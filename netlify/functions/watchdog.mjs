// netlify/functions/watchdog.mjs — Advon portfolio watchdog (13 Sept 2026)
//
// Runs every day at 05:00 UTC (08:00 Athens) and checks ONE SEVENTH of the client
// sites listed in watchdog/sites.json (private data repo), so every site is checked
// once a week and each run stays well inside the function time limit.
// For every site: HTTP status + response time, final URL after redirects, page
// title, Advon credit present, contact form present (Formspree / Netlify / mailto),
// and the TLS certificate expiry. Results are merged into watchdog/report.json in
// the data repo; the weekly "portfolio watchdog" agent reads that file and tells
// Angelo what needs attention. Uses the same CRM_GH_* env vars as /api/crm.
//
// Manual run: GET https://advonmedia.com/.netlify/functions/watchdog?all=1&key=<CRM_AUTH_HASH prefix 12>
import tls from 'node:tls';

export const config = { schedule: '0 5 * * *' };

const SITES_PATH = 'watchdog/sites.json';
const REPORT_PATH = 'watchdog/report.json';
const TIMEOUT_MS = 9000;
const CONCURRENCY = 12;

function cfg() {
  return { token: process.env.CRM_GH_TOKEN, repo: process.env.CRM_GH_REPO, branch: process.env.CRM_GH_BRANCH || 'main', auth: process.env.CRM_AUTH_HASH || '' };
}
async function gh(c, path, init = {}) {
  return fetch(`https://api.github.com/repos/${c.repo}/contents/${path}`, {
    ...init, cache: 'no-store',
    headers: { Authorization: `Bearer ${c.token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'advon-watchdog', ...(init.headers || {}) },
  });
}
const b64e = (s) => Buffer.from(s, 'utf8').toString('base64');
const b64d = (s) => Buffer.from(s, 'base64').toString('utf8');
async function readJson(c, path) {
  const res = await gh(c, `${path}?ref=${encodeURIComponent(c.branch)}&t=${Date.now()}`);
  if (res.status === 404) return { sha: null, data: null };
  if (!res.ok) throw new Error(`GitHub read failed (${res.status})`);
  const meta = await res.json();
  try { return { sha: meta.sha, data: JSON.parse(b64d(String(meta.content || '').replace(/\n/g, ''))) }; } catch { return { sha: meta.sha, data: null }; }
}
async function writeJson(c, path, obj, sha, message) {
  const body = { message, content: b64e(JSON.stringify(obj, null, 1)), branch: c.branch };
  if (sha) body.sha = sha;
  const res = await gh(c, path, { method: 'PUT', body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`GitHub write failed (${res.status})`);
}

function certExpiry(host) {
  return new Promise((resolve) => {
    const done = (v) => { try { s.destroy(); } catch {} resolve(v); };
    const s = tls.connect({ host, port: 443, servername: host, timeout: 6000, rejectUnauthorized: false }, () => {
      const cert = s.getPeerCertificate();
      const ok = s.authorized;
      done({ validTo: cert && cert.valid_to ? new Date(cert.valid_to).toISOString() : null, authorized: ok, issuer: cert && cert.issuer ? (cert.issuer.O || '') : '' });
    });
    s.on('error', (e) => done({ validTo: null, authorized: false, error: String(e.code || e.message) }));
    s.on('timeout', () => done({ validTo: null, authorized: false, error: 'timeout' }));
  });
}

async function checkSite(site) {
  const out = { domain: site.domain, url: site.url, checkedAt: new Date().toISOString() };
  const t0 = Date.now();
  try {
    const ctrl = new AbortController(); const tm = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    const res = await fetch(site.url, { redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AdvonWatchdog/1.0; +https://advonmedia.com)' } });
    clearTimeout(tm);
    out.status = res.status; out.ms = Date.now() - t0; out.finalUrl = res.url;
    const html = await res.text();
    out.bytes = html.length;
    const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i); out.title = t ? t[1].replace(/\s+/g, ' ').trim().slice(0, 120) : '';
    out.advonCredit = /advonmedia\.com/i.test(html);
    out.form = /<form[\s>]/i.test(html);
    out.formspree = (html.match(/formspree\.io\/f\/(\w+)/i) || [])[1] || '';
    out.netlifyForm = /data-netlify=["']?true/i.test(html) || /netlify-honeypot/i.test(html);
    out.mailto = /href=["']mailto:/i.test(html);
    out.blankPage = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, '').trim().length < 200;
    out.parked = /domain (is )?(parked|for sale)|this domain has expired|papaki\.com\/parking|hostinger.*parking/i.test(html);
    if (res.status >= 400) out.problem = `HTTP ${res.status}`;
    else if (out.blankPage) out.problem = 'page is empty';
    else if (out.parked) out.problem = 'domain parked / expired';
  } catch (e) {
    out.ms = Date.now() - t0; out.status = 0; out.error = String(e.name === 'AbortError' ? 'timeout' : (e.cause && e.cause.code) || e.message).slice(0, 80);
    out.problem = /ENOTFOUND|EAI_AGAIN/.test(out.error) ? 'domain does not resolve (expired?)' : /CERT|certificate/i.test(out.error) ? 'SSL certificate problem' : `unreachable (${out.error})`;
  }
  try {
    const host = new URL(out.finalUrl || site.url).hostname;
    const c = await certExpiry(host);
    out.sslValidTo = c.validTo; out.sslOk = c.authorized; if (c.issuer) out.sslIssuer = c.issuer;
    if (c.validTo) { const days = Math.round((new Date(c.validTo) - Date.now()) / 864e5); out.sslDays = days; if (days < 7 && !out.problem) out.problem = `SSL expires in ${days} days`; }
    if (!c.authorized && !out.problem) out.problem = 'SSL not trusted';
  } catch {}
  if (!out.problem && out.status === 200 && !out.form && !out.mailto) out.warn = 'no contact form found';
  if (!out.problem && out.ms > 6000) out.warn = (out.warn ? out.warn + ' · ' : '') + `slow (${out.ms} ms)`;
  return out;
}

async function pool(items, n, fn) {
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } }));
  return out;
}

export default async (req) => {
  const c = cfg();
  if (!c.token || !c.repo) return new Response('storage not configured', { status: 503 });
  const url = new URL(req.url);
  const manual = url.searchParams.get('all') === '1';
  if (manual && (!c.auth || url.searchParams.get('key') !== c.auth.slice(0, 12))) return new Response('forbidden', { status: 403 });
  const { data: sitesDoc } = await readJson(c, SITES_PATH);
  const sites = (sitesDoc && Array.isArray(sitesDoc.sites) ? sitesDoc.sites : []).filter((s) => s && s.domain && s.url);
  if (!sites.length) return new Response('no sites', { status: 200 });
  const day = new Date().getUTCDay();
  const todays = manual ? sites : sites.filter((_, i) => i % 7 === day);
  const results = await pool(todays, CONCURRENCY, checkSite);
  for (let attempt = 0; attempt < 3; attempt++) {
    const { sha, data } = await readJson(c, REPORT_PATH);
    const rep = data && typeof data === 'object' ? data : { sites: {} };
    rep.sites = rep.sites || {};
    results.forEach((r) => { const prev = rep.sites[r.domain] || {}; rep.sites[r.domain] = { ...r, firstProblemAt: r.problem ? (prev.problem ? prev.firstProblemAt || r.checkedAt : r.checkedAt) : null }; });
    rep.updated = new Date().toISOString(); rep.totalSites = sites.length; rep.lastRun = { at: rep.updated, checked: results.length, problems: results.filter((r) => r.problem).length, day };
    try { await writeJson(c, REPORT_PATH, rep, sha, `watchdog: ${results.length} sites, ${rep.lastRun.problems} problems`); break; }
    catch (e) { if (attempt === 2) throw e; }
  }
  const problems = results.filter((r) => r.problem).map((r) => `${r.domain}: ${r.problem}`);
  return new Response(JSON.stringify({ checked: results.length, problems }, null, 1), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
