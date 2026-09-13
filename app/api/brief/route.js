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

export async function GET(req) {
  const c = cfg();
  if (!c.token || !c.repo) return json({ error: 'storage not configured' }, 503);
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
    // today.json — retried once on a concurrent write
    for (let attempt = 0; attempt < 2; attempt++) {
      const { sha } = await readFile(c, BRIEF_PATH);
      try { await writeFile(c, BRIEF_PATH, text, sha, `brief: ${brief.updated}`); break; }
      catch (e) { if (attempt === 1 || !(e.status === 409 || e.status === 422)) throw e; }
    }
    // one dated copy per day (best effort — never fails the request)
    try {
      const day = String(brief.today || brief.updated).slice(0, 10);
      const hp = `${HISTORY_DIR}/${day}.json`;
      const { sha } = await readFile(c, hp);
      await writeFile(c, hp, text, sha, `brief history ${day}`);
    } catch {}
    return json({ ok: true, updated: brief.updated });
  } catch (e) {
    return json({ error: e.message || 'write failed' }, 502);
  }
}
