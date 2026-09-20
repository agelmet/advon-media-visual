// app/api/backup/route.js — the server half of the CRM's «Backup everything» / «Restore from a backup» (20 Sept 2026)
//
// Everything outside the CRM's own state lives in the PRIVATE data repo (CRM_GH_REPO): chats with their attachments,
// lead lists, the ads inbox, client material, the brief. The CRM's Export menu packs all of it — together with a plain
// copy of the CRM itself — into ONE .zip in the browser, and can put it back from that .zip.
//
// All calls carry the CRM's own sync token (x-crm-auth vs CRM_AUTH_HASH, the same check as /api/crm and /api/chat):
//   GET  /api/backup?list=1           → {repo, branch, head, snapshots, files:[{path, sha, size}]}   (snapshots/ left out)
//   GET  /api/backup?blob=<sha>       → the raw bytes of one file
//   POST /api/backup?blob=1           raw body → {sha}            (a loose blob — nothing is committed yet)
//   POST /api/backup?restore=1        JSON {files:[{path, sha}]}  → ONE commit that writes them. Only chats/, leads/, intake/ and
//                                     brief/ may be written; crm-data.json is never touched here (the CRM saves its own, encrypted).
//   POST /api/backup?mail=1           → e-mail the small safety copy now (the same one that goes out every Monday)
// The chat agent's key (?k=<CHAT_AGENT_KEY>) may only trigger ?mail=1 — handy for testing from outside the CRM.

import { ghReady, ghConf, commit as ghCommit, createBlob, blobBuffer } from '@/lib/ghdata';
import { listRepo, sendSafetyCopy } from '@/lib/backupcore';
import { forgetHead } from '@/lib/chatcore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 26;

const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0', Pragma: 'no-cache', Expires: '0', 'Content-Type': 'application/json; charset=utf-8' };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: NO_STORE });
const SHA_RE = /^[0-9a-f]{40}$/;
const PATH_OK = /^(chats|leads|intake|brief)\/[^\u0000-\u001f\\]{1,300}$/;
const MAX_BLOB = 5.5 * 1024 * 1024;
const AGENT_KEY_SHA256 = '9bdf28e5bfba580df30a7b218900fa53dc3fba6e8a1317df8e8c2326080ac38a';

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0;
}
async function authorized(req) {
  const t = req.headers.get('x-crm-auth') || '';
  const want = String(process.env.CRM_AUTH_HASH || '').trim().toLowerCase();
  if (!t || !want) return false;
  return safeEqual(await sha256Hex(t), want);
}

export async function GET(req) {
  const c = ghConf();
  if (!ghReady(c)) return json({ error: 'storage not configured' }, 503);
  if (!(await authorized(req))) return json({ error: 'unauthorized' }, 401);
  const q = (k) => new URL(req.url).searchParams.get(k);
  try {
    if (q('blob')) {
      const sha = String(q('blob'));
      if (!SHA_RE.test(sha)) return json({ error: 'bad sha' }, 400);
      const buf = await blobBuffer(c, sha);
      if (buf.length > MAX_BLOB) return json({ error: 'file too large for one download' }, 413);
      return new Response(buf, { status: 200, headers: { 'Content-Type': 'application/octet-stream', 'Cache-Control': 'private, no-store' } });
    }
    const tree = await listRepo(c);
    return json({ ok: true, repo: c.repo, branch: c.branch, ...tree });
  } catch (e) { return json({ error: e.message || 'read failed' }, e.status === 404 ? 404 : 502); }
}

export async function POST(req) {
  const c = ghConf();
  if (!ghReady(c)) return json({ error: 'storage not configured' }, 503);
  const url = new URL(req.url);
  const q = (k) => url.searchParams.get(k);
  const byAgent = q('k') ? (await sha256Hex(String(q('k')))) === AGENT_KEY_SHA256 : false;
  if (!(byAgent && q('mail') === '1') && !(await authorized(req))) return json({ error: 'unauthorized' }, 401);
  try {
    if (q('mail') === '1') {
      const r = await sendSafetyCopy(c, 'asked');
      return json(r, r.ok ? 200 : 502);
    }
    if (q('blob') === '1') {
      const buf = Buffer.from(await req.arrayBuffer());
      if (!buf.length) return json({ error: 'empty' }, 400);
      if (buf.length > MAX_BLOB) return json({ error: 'file too large' }, 413);
      return json({ ok: true, sha: await createBlob(c, buf), bytes: buf.length });
    }
    if (q('restore') === '1') {
      let body; try { body = await req.json(); } catch { return json({ error: 'bad json' }, 400); }
      const files = (Array.isArray(body.files) ? body.files : []).slice(0, 500)
        .map((f) => ({ path: String(f.path || ''), sha: String(f.sha || '') }))
        .filter((f) => SHA_RE.test(f.sha) && PATH_OK.test(f.path) && !f.path.includes('..') && !f.path.includes('//'));
      if (!files.length) return json({ error: 'nothing to restore' }, 400);
      await ghCommit(c, `backup: restore ${files.length} file(s)${body.from ? ' from ' + String(body.from).slice(0, 40) : ''}`, async () => files.map((f) => ({ path: f.path, blobSha: f.sha })));
      forgetHead();
      return json({ ok: true, written: files.length });
    }
    return json({ error: 'unknown action' }, 400);
  } catch (e) { return json({ error: e.message || 'write failed' }, 502); }
}
