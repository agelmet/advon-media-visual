// app/api/brief/route.js
//
// Morning-brief mailbox for the Advon CRM (13 Sept 2026).
//
//   POST /api/brief   (CRM, x-crm-auth)  — the CRM sends a small PLAIN summary
//                                          (who owes money, materials/feedback overdue,
//                                          renewals, meetings, leads left) and it is
//                                          written to brief/today.json in the private
//                                          data repo. A dated copy goes to brief/history/.
//   GET  /api/brief   (CRM, x-crm-auth)  — returns the latest brief.
//
// The 08:30 morning-brief agent reads brief/today.json straight from GitHub with its
// own read-only token, so nothing here is public. Same env vars as /api/crm.

import { commit as ghCommit } from '@/lib/ghdata';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BRIEF_PATH = 'brief/today.json';
const HISTORY_DIR = 'brief/history';
const MAX_BYTES = 200 * 1024;

const NO_STORE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
  'Content-Type': 'application/json; charset=utf-8',
};
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: NO_STORE });

function cfg() {
  return {
    token: process.env.CRM_GH_TOKEN,
    repo: process.env.CRM_GH_REPO,
    branch: process.env.CRM_GH_BRANCH || 'main',
    authHash: process.env.CRM_AUTH_HASH,
  };
}
async function sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
async function authorized(req, c) {
  if (!c.authHash) return false;
  const token = req.headers.get('x-crm-auth') || '';
  if (!token) return false;
  return safeEqual(await sha256Hex(token), String(c.authHash).trim().toLowerCase());
}
async function gh(c, path, init = {}) {
  return fetch(`https://api.github.com/repos/${c.repo}/contents/${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${c.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'advon-brief',
      ...(init.headers || {}),
    },
  });
}
const b64e = (s) => Buffer.from(s, 'utf8').toString('base64');
const b64d = (s) => Buffer.from(s, 'base64').toString('utf8');

async function readFile(c, path) {
  const res = await gh(c, `${path}?ref=${encodeURIComponent(c.branch)}&t=${Date.now()}`);
  if (res.status === 404) return { sha: null, text: null };
  if (!res.ok) throw new Error(`GitHub read failed (${res.status})`);
  const meta = await res.json();
  return { sha: meta.sha, text: b64d(String(meta.content || '').replace(/\n/g, '')) };
}
async function writeFile(c, path, text, sha, message) {
  const body = { message, content: b64e(text), branch: c.branch };
  if (sha) body.sha = sha;
  const res = await gh(c, path, { method: 'PUT', body: JSON.stringify(body) });
  if (!res.ok) { const e = new Error(`GitHub write failed (${res.status})`); e.status = res.status; throw e; }
}

// ---------- plain-text rendering for the morning-brief agent ----------
// GET /api/brief?k=<read key> answers with a ready-to-send text (Greek + English labels).
// The key only unlocks reading this summary; its SHA-256 is fixed below.
const READ_KEY_SHA256 = '78085eb3d9b816c080a3cbeee27e1b67cd5775b568083951a66ef6f5c1aa65d6';
const eur = (n) => '€' + Math.round(+n || 0).toLocaleString('en-US');
const dmy = (iso) => (iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}` : '');
function renderBrief(b) {
  const L = [];
  const upd = new Date(b.updated);
  const ageH = Math.round((Date.now() - upd.getTime()) / 36e5);
  L.push(`ADVON — Morning brief · ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}`);
  L.push(`(CRM data as of ${upd.toLocaleString('en-GB', { timeZone: 'Europe/Athens', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}${ageH > 36 ? ` — ${Math.round(ageH / 24)} days old, open the CRM to refresh` : ''})`);
  L.push('');
  const m = b.money || {};
  const e = m.earned || {};
  L.push(`MONEY · ${b.month}: earned ${eur(e.total)} of ${eur(m.target)} target (new ${eur(e.new)} · renewals ${eur(e.renew)} · monthly ${eur(e.subs)}) · still to collect ${eur(m.toCollect)} · forecast 30d ${eur(m.forecast30)} / 60d ${eur(m.forecast60)} / 90d ${eur(m.forecast90)}`);
  L.push('');
  const ch = b.chase || {};
  const row = (x) => `  • ${x.name} — ${eur(x.value)}${x.days != null ? ` · ${x.days}d` : ''}${x.phone ? ` · ${x.phone}` : ''}`;
  L.push(`1) CHASE MONEY — waiting payment (${(ch.unpaid || []).length})`);
  (ch.unpaid || []).slice(0, 10).forEach((x) => L.push(row(x)));
  if (!(ch.unpaid || []).length) L.push('  nobody — clean.');
  L.push('');
  L.push(`2) MATERIALS OVERDUE — need info (${(ch.materials || []).length}, chase after 3 days)`);
  (ch.materials || []).filter((x) => x.days >= 3).slice(0, 10).forEach((x) => L.push(row(x)));
  if (!(ch.materials || []).filter((x) => x.days >= 3).length) L.push('  nobody over 3 days.');
  L.push('');
  L.push(`3) DRAFT SENT, NO FEEDBACK (${(ch.feedback || []).length}, chase after 5 days)`);
  (ch.feedback || []).filter((x) => x.days >= 5).slice(0, 10).forEach((x) => L.push(row(x)));
  if (!(ch.feedback || []).filter((x) => x.days >= 5).length) L.push('  nobody over 5 days.');
  if ((ch.thinking || []).length) { L.push(''); L.push(`4) STILL THINKING after the meeting (${ch.thinking.length})`); ch.thinking.slice(0, 8).forEach((x) => L.push(row(x))); }
  L.push('');
  const ren = b.renewals || [];
  L.push(`RENEWALS next 14 days (${ren.length})${ren.length ? '' : ' — none'}`);
  ren.slice(0, 12).forEach((r) => L.push(`  • ${r.name} — ${eur(r.value)} · ${dmy(r.date)}${r.overdue ? ' OVERDUE' : ''}`));
  if ((b.subsDue || []).length) { L.push(`Subscriptions unpaid this month: ${b.subsDue.map((s) => `${s.name} ${eur(s.value)}`).join(', ')}`); }
  L.push('');
  const mt = b.meetings || [];
  L.push(`MEETINGS next 7 days (${mt.length})${mt.length ? '' : ' — none booked'}`);
  mt.slice(0, 10).forEach((x) => L.push(`  • ${dmy(x.day)}${x.time ? ' ' + x.time : ''} — ${x.name}${x.phone ? ' · ' + x.phone : ''}`));
  L.push('');
  const ld = b.leads || {}, cb = b.callbacks || {}, cy = (b.calls || {}).yesterday || {}, cm = (b.calls || {}).month || {};
  L.push(`CALLS · leads left ${ld.fresh || 0} fresh + ${ld.retry || 0} to retry · callbacks due now ${cb.leftNow || 0}${(cb.scheduledDue || []).length ? ' (' + cb.scheduledDue.slice(0, 5).map((s) => s.name).join(', ') + ')' : ''}`);
  L.push(`  yesterday ${dmy(cy.date)}: ${cy.calls || 0} calls · ${cy.booked || 0} booked · ${cy.sms || 0} sms · ${cy.no || 0} no · ${(ld.yesterday || {}).noanswer || 0} no answer`);
  L.push(`  this month: ${cm.calls || 0} calls · ${cm.booked || 0} booked · ${Math.round((cm.rate || 0) * 100)}% call→meeting · ${cm.workingDays || 0} working days`);
  if ((b.asap || []).length) { L.push(''); L.push('DO ASAP'); b.asap.slice(0, 6).forEach((a, i) => L.push(`  ${i + 1}. ${a.hot ? '🔥 ' : ''}${a.text}`)); }
  if ((b.todosHigh || []).length) { L.push(''); L.push('HIGH-PRIORITY TO DO: ' + b.todosHigh.slice(0, 8).join(' · ')); }
  return L.join('\n');
}

export async function GET(req) {
  const c = cfg();
  if (!c.token || !c.repo) return json({ error: 'storage not configured' }, 503);
  const url = new URL(req.url);
  const k = url.searchParams.get('k');
  if (k) {
    if ((await sha256Hex(k)) !== READ_KEY_SHA256) return new Response('forbidden', { status: 403 });
    try {
      const { text } = await readFile(c, BRIEF_PATH);
      if (!text) return new Response('No brief yet — open the CRM once so it can export one.', { status: 200, headers: { ...NO_STORE, 'Content-Type': 'text/plain; charset=utf-8' } });
      const body = url.searchParams.get('format') === 'json' ? text : renderBrief(JSON.parse(text));
      return new Response(body, { status: 200, headers: { ...NO_STORE, 'Content-Type': (url.searchParams.get('format') === 'json' ? 'application/json' : 'text/plain') + '; charset=utf-8' } });
    } catch (e) { return new Response('brief read failed: ' + (e.message || ''), { status: 502 }); }
  }
  if (!(await authorized(req, c))) return json({ error: 'unauthorized' }, 401);
  try {
    const { text } = await readFile(c, BRIEF_PATH);
    if (!text) return json({ brief: null });
    return json({ brief: JSON.parse(text) });
  } catch (e) {
    return json({ error: e.message || 'read failed' }, 502);
  }
}

export async function POST(req) {
  const c = cfg();
  if (!c.token || !c.repo) return json({ error: 'storage not configured' }, 503);
  if (!(await authorized(req, c))) return json({ error: 'unauthorized' }, 401);
  let brief;
  try { brief = await req.json(); } catch { return json({ error: 'bad json' }, 400); }
  if (!brief || typeof brief !== 'object' || !brief.updated) return json({ error: 'bad brief' }, 400);
  const text = JSON.stringify(brief, null, 1);
  if (text.length > MAX_BYTES) return json({ error: 'brief too large' }, 413);
  try {
    // today.json + the dated copy in ONE commit, retried on branch races (lib/ghdata.js)
    const day = String(brief.today || brief.updated).slice(0, 10);
    await ghCommit(c, `brief: ${brief.updated}`, async () => [
      { path: BRIEF_PATH, content: text },
      { path: `${HISTORY_DIR}/${day}.json`, content: text },
    ]);
    return json({ ok: true, updated: brief.updated });
  } catch (e) {
    return json({ error: e.message || 'write failed' }, 502);
  }
}
