// app/api/tiktok/route.js — «I posted it ✓» for TikTok, saved on the server (2 Oct 2026)
// Angelo: marking a TikTok as posted «sometimes doesn't save». The phone page (drafts.advonmedia.com/tiktok/) kept it
// only in that browser's localStorage — Safari, the Telegram in-app browser and the computer each had their own copy,
// and iOS may clear it. Now every mark lives in the data repo (social/state.json → posts[id].tiktokDone), shared by
// the phone page and the CRM Meta → SALES cards.
//   GET  /api/tiktok              → {ok, done:{<id>: iso}}
//   POST /api/tiktok  {id, on}    → mark / unmark (body may be sent as text/plain to avoid a CORS preflight)
// No secret: the only thing this can change is a «posted on TikTok» tick on an id that looks like a post id.
import { ghReady, ghConf } from '@/lib/ghdata';
import { readState, patchPost } from '@/lib/socialrun';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ORIGINS = ['https://drafts.advonmedia.com', 'https://agelmet.github.io', 'https://advonmedia.com', 'https://www.advonmedia.com'];
function headers(req) {
  const o = req.headers.get('origin') || '';
  return { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0', 'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': ORIGINS.includes(o) ? o : ORIGINS[0], 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' };
}
const ID = /^[a-z0-9][a-z0-9-]{2,90}$/i;

export async function OPTIONS(req) { return new Response(null, { status: 204, headers: headers(req) }); }

export async function GET(req) {
  const conf = ghConf();
  if (!ghReady(conf)) return new Response(JSON.stringify({ ok: false, error: 'storage not configured' }), { status: 503, headers: headers(req) });
  const st = await readState(conf); const done = {};
  for (const [id, s] of Object.entries(st.posts || {})) if (s && s.tiktokDone) done[id] = s.tiktokDone;
  return new Response(JSON.stringify({ ok: true, done }), { headers: headers(req) });
}

export async function POST(req) {
  const conf = ghConf();
  if (!ghReady(conf)) return new Response(JSON.stringify({ ok: false, error: 'storage not configured' }), { status: 503, headers: headers(req) });
  let b = {}; try { b = JSON.parse(await req.text()); } catch {}
  const id = String(b.id || '');
  if (!ID.test(id)) return new Response(JSON.stringify({ ok: false, error: 'bad id' }), { status: 400, headers: headers(req) });
  const at = b.on ? (typeof b.at === 'string' && !isNaN(Date.parse(b.at)) ? b.at : new Date().toISOString()) : null;
  try {
    await patchPost(conf, id, (s) => ({ ...s, tiktokDone: at }), `tiktok: ${at ? 'posted' : 'undo'} ${id}`);
    return new Response(JSON.stringify({ ok: true, id, tiktokDone: at }), { headers: headers(req) });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message || 'failed' }), { status: 502, headers: headers(req) });
  }
}
