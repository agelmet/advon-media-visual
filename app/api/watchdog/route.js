// app/api/watchdog/route.js — plain-text summary of watchdog/report.json for the weekly agent.
// GET /api/watchdog?k=<read key>   (same read key as /api/brief; only unlocks this summary)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const REPORT_PATH = 'watchdog/report.json';
const READ_KEY_SHA256 = '78085eb3d9b816c080a3cbeee27e1b67cd5775b568083951a66ef6f5c1aa65d6';
const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0', Pragma: 'no-cache', Expires: '0' };
const text = (body, status = 200) => new Response(body, { status, headers: { ...NO_STORE, 'Content-Type': 'text/plain; charset=utf-8' } });
async function sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
export async function GET(req) {
  const token = process.env.CRM_GH_TOKEN, repo = process.env.CRM_GH_REPO, branch = process.env.CRM_GH_BRANCH || 'main';
  if (!token || !repo) return text('storage not configured', 503);
  const url = new URL(req.url);
  const k = url.searchParams.get('k') || '';
  if (!k || (await sha256Hex(k)) !== READ_KEY_SHA256) return text('forbidden', 403);
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${REPORT_PATH}?ref=${encodeURIComponent(branch)}&t=${Date.now()}`, {
    cache: 'no-store', headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.raw+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'advon-watchdog-read' },
  });
  if (res.status === 404) return text('No watchdog report yet — the daily check has not run.');
  if (!res.ok) return text(`report read failed (${res.status})`, 502);
  const rep = await res.json();
  if (url.searchParams.get('format') === 'json') return new Response(JSON.stringify(rep), { status: 200, headers: { ...NO_STORE, 'Content-Type': 'application/json; charset=utf-8' } });
  const sites = Object.values(rep.sites || {});
  const problems = sites.filter((s) => s.problem).sort((a, b) => (a.firstProblemAt || '').localeCompare(b.firstProblemAt || ''));
  const warns = sites.filter((s) => !s.problem && s.warn);
  const stale = sites.filter((s) => Date.now() - new Date(s.checkedAt).getTime() > 9 * 864e5);
  const ssl = sites.filter((s) => s.sslDays != null && s.sslDays < 21 && !s.problem).sort((a, b) => a.sslDays - b.sslDays);
  const L = [];
  L.push(`ADVON — Portfolio watchdog · ${sites.length} of ${rep.totalSites || sites.length} sites checked in the last week · report updated ${new Date(rep.updated).toLocaleString('en-GB', { timeZone: 'Europe/Athens' })}`);
  L.push('');
  L.push(`PROBLEMS (${problems.length})${problems.length ? '' : ' — none, every site answered'}`);
  problems.forEach((s) => L.push(`  ✗ ${s.domain} — ${s.problem} (since ${String(s.firstProblemAt || s.checkedAt).slice(0, 10)}${s.status ? `, HTTP ${s.status}` : ''})`));
  L.push('');
  L.push(`SSL expiring within 3 weeks (${ssl.length})${ssl.length ? '' : ' — none'}`);
  ssl.forEach((s) => L.push(`  ⚠ ${s.domain} — ${s.sslDays} days (${String(s.sslValidTo).slice(0, 10)})`));
  L.push('');
  L.push(`WARNINGS (${warns.length})${warns.length ? '' : ' — none'}`);
  warns.slice(0, 25).forEach((s) => L.push(`  ⚠ ${s.domain} — ${s.warn}`));
  if (stale.length) { L.push(''); L.push(`Not checked for over 9 days (${stale.length}): ${stale.map((s) => s.domain).join(', ')}`); }
  const fast = sites.filter((s) => s.ms).map((s) => s.ms); const avg = fast.length ? Math.round(fast.reduce((a, b) => a + b, 0) / fast.length) : 0;
  L.push(''); L.push(`Average response ${avg} ms · ${sites.filter((s) => s.advonCredit).length} sites carry the Advon credit · ${sites.filter((s) => s.form || s.mailto).length} have a contact form or email link.`);
  return text(L.join('\n'));
}
