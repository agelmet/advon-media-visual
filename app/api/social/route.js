// app/api/social/route.js — the CRM «Meta» tab (25 Sept 2026)
//   GET  /api/social                       (x-crm-auth) → {ok, base, posts:[merged plan+state], meta:{connected, pageName, igUsername, source}}
//   POST /api/social?a=approve   {id, on}  approve (on:true) or take back (on:false) one post; {ids:[…], on} for several
//   POST /api/social?a=settings  {auto}    auto-post ON: every post goes out on its date unless skipped (default ON)
//   POST /api/social?a=skip      {id, on}  leave a post out of the month (or bring it back)
//   POST /api/social?a=edit      {id, caption?, hashtags?, date?, time?, reset?}   change what goes out (reset → back to Claude's version)
//   POST /api/social?a=post      {id, targets?:['ig','fb']}   publish now (runs in the background function, result in ~1–3 min)
//   POST /api/social?a=connect   {userToken, appId?, appSecret?}   store the Meta connection (encrypted)
//   POST /api/social?a=disconnect
//   POST /api/social?a=check     → re-read the page and Instagram names with the stored token
import { ghReady, ghConf, commit as ghCommit } from '@/lib/ghdata';
import { SOCIAL_BASE, CREDS_PATH, STATE_PATH, fetchPlan, merged, autoOn, sealCreds, connectMeta, checkMeta } from '@/lib/social';
import { mutateJson } from '@/lib/ghdata';
import { readState, readCreds, patchPost, kick } from '@/lib/socialrun';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0', Pragma: 'no-cache', Expires: '0', 'Content-Type': 'application/json; charset=utf-8' };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: NO_STORE });
async function sha256Hex(str) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join(''); }
function safeEqual(a, b) { if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }
async function crmAuthorized(req) { const t = req.headers.get('x-crm-auth') || '', h = process.env.CRM_AUTH_HASH; if (!t || !h) return false; return safeEqual(await sha256Hex(t), String(h).trim().toLowerCase()); }
const DAY = /^\d{4}-\d{2}-\d{2}$/, TIME = /^\d{2}:\d{2}$/;

export async function GET(req) {
  if (!(await crmAuthorized(req))) return json({ ok: false, error: 'unauthorized' }, 401);
  const conf = ghConf();
  try {
    const [plan, state, creds] = await Promise.all([fetchPlan(), ghReady(conf) ? readState(conf) : { posts: {} }, ghReady(conf) ? readCreds(conf) : null]);
    return json({ ok: true, base: SOCIAL_BASE, month: plan.month || null, auto: autoOn(state), posts: merged(plan, state),
      meta: creds ? { connected: true, pageName: creds.pageName || '', igUsername: creds.igUsername || '', source: creds.source || 'crm', connectedAt: creds.connectedAt || null } : { connected: false } });
  } catch (e) { return json({ ok: false, code: e.code || 'error', error: e.message || 'failed' }, 502); }
}

export async function POST(req) {
  if (!(await crmAuthorized(req))) return json({ ok: false, error: 'unauthorized' }, 401);
  const conf = ghConf(); if (!ghReady(conf)) return json({ ok: false, error: 'storage not configured' }, 503);
  const a = new URL(req.url).searchParams.get('a');
  let b = {}; try { b = await req.json(); } catch {}
  const id = String(b.id || '').slice(0, 120);
  try {
    if (a === 'approve') {
      const ids = Array.isArray(b.ids) ? b.ids.map(String).slice(0, 60) : [id];
      for (const x of ids) await patchPost(conf, x, (s) => (s.status === 'posted' || s.status === 'posting') ? undefined : ({ ...s, approved: b.on ? true : false, approvedAt: b.on ? new Date().toISOString() : null, status: b.on ? 'approved' : undefined, skip: b.on ? false : s.skip }), `social: ${b.on ? 'approve' : 'unapprove'} ${x}`);
      return json({ ok: true });
    }
    if (a === 'settings') {
      await mutateJson(conf, STATE_PATH, (st) => { const n = st && st.posts ? st : { posts: {} }; n.settings = { ...(n.settings || {}), auto: !!b.auto }; n.updated = new Date().toISOString(); return n; }, `social: auto-post ${b.auto ? 'on' : 'off'}`, { posts: {} });
      return json({ ok: true, auto: !!b.auto });
    }
    if (a === 'skip') { await patchPost(conf, id, (s) => (s.status === 'posted' || s.status === 'posting') ? undefined : ({ ...s, skip: !!b.on, status: undefined })); return json({ ok: true }); }
    if (a === 'edit') {
      await patchPost(conf, id, (s) => {
        const n = { ...s };
        if (b.reset) { delete n.caption; delete n.hashtags; delete n.date; delete n.time; return n; }
        if (typeof b.caption === 'string') n.caption = b.caption.slice(0, 2100);
        if (typeof b.hashtags === 'string') n.hashtags = b.hashtags.slice(0, 400);
        if (b.date && DAY.test(b.date)) n.date = b.date;
        if (b.time && TIME.test(b.time)) n.time = b.time;
        return n;
      });
      return json({ ok: true });
    }
    if (a === 'post') {
      const targets = Array.isArray(b.targets) && b.targets.length ? b.targets.filter((t) => t === 'ig' || t === 'fb') : ['ig', 'fb'];
      if (!(await readCreds(conf))) return json({ ok: false, error: 'Connect Instagram & Facebook first (the button at the top of the Meta tab).' }, 409);
      await patchPost(conf, id, (s) => ({ ...s, status: 'posting', startedAt: new Date().toISOString(), approved: true }), `social: post now ${id}`);
      await kick([id], targets);
      return json({ ok: true, posting: true });
    }
    if (a === 'connect') {
      const c = await connectMeta({ userToken: String(b.userToken || '').trim(), appId: String(b.appId || '').trim(), appSecret: String(b.appSecret || '').trim(), pageHint: b.pageHint });
      const box = await sealCreds(c);
      await ghCommit(conf, 'social: Meta connected', async () => [{ path: CREDS_PATH, content: JSON.stringify(box) }]);
      return json({ ok: true, pageName: c.pageName, igUsername: c.igUsername, longLived: c.longLived });
    }
    if (a === 'disconnect') { await ghCommit(conf, 'social: Meta disconnected', async () => [{ path: CREDS_PATH, content: null }]); return json({ ok: true }); }
    if (a === 'check') { const c = await readCreds(conf); if (!c) return json({ ok: false, error: 'not connected' }, 409); return json({ ok: true, ...(await checkMeta(c)) }); }
    return json({ ok: false, error: 'unknown action' }, 400);
  } catch (e) { return json({ ok: false, code: e.code || 'error', error: e.message || 'failed', meta: e.meta || null }, e.code === 'meta' || e.code === 'bad_input' || e.code === 'no_pages' || e.code === 'no_ig' ? 400 : 502); }
}
