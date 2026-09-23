// app/api/reminders/route.js — client reminders for the CRM Home card (23 Sept 2026)
//
// The reminders themselves are ⏰ events in the Google Calendar «Advon Media» (see lib/reminders.js).
//   GET  /api/reminders            (x-crm-auth)  → {ok, today, items:[{uid, day, time, client, what, desc, viber, done, sentOn, when}], asap:[{uid, day, text, hot}]}
//                                                  (asap = «📌 …» events whose day has come — the CRM adds each to «Do ASAP» once)
//   POST /api/reminders?done=1     JSON {uid}    → mark done (the client sent what we asked); {uid, undo:true} takes it back
//   GET  /api/reminders?k=<read key>             → the same list as plain text (for a Claude agent)
// Done/sent bookkeeping: reminders/state.json in the private data repo (one commit per change, lib/ghdata.js).

import { ghReady, ghConf, commit as ghCommit, readAtHead } from '@/lib/ghdata';
import { forgetHead } from '@/lib/chatcore';
import { STATE_PATH, fetchCalendarText, parseReminders, parseAsap, withState, viberText, todayAthens, dayGreek, inAthens } from '@/lib/reminders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0', Pragma: 'no-cache', Expires: '0', 'Content-Type': 'application/json; charset=utf-8' };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: NO_STORE });
const READ_KEY_SHA256 = '78085eb3d9b816c080a3cbeee27e1b67cd5775b568083951a66ef6f5c1aa65d6';

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0;
}
async function crmAuthorized(req) {
  const t = req.headers.get('x-crm-auth') || '', h = process.env.CRM_AUTH_HASH;
  if (!t || !h) return false;
  return safeEqual(await sha256Hex(t), String(h).trim().toLowerCase());
}
// the state file lives outside chats/, so it is read with a plain tree walk at the current head
async function readStateSafe(conf) {
  try { const r = await readAtHead(conf, STATE_PATH); const s = r && r.text ? JSON.parse(r.text) : null; return s && typeof s === 'object' && !Array.isArray(s) ? s : { done: {}, sent: {} }; }
  catch { return { done: {}, sent: {} }; }
}

export async function GET(req) {
  const url = new URL(req.url);
  const k = url.searchParams.get('k');
  if (k) { if ((await sha256Hex(k)) !== READ_KEY_SHA256) return new Response('forbidden', { status: 403 }); }
  else if (!(await crmAuthorized(req))) return json({ ok: false, error: 'unauthorized' }, 401);
  const conf = ghConf();
  try {
    const [ics, state] = await Promise.all([fetchCalendarText(), ghReady(conf) ? readStateSafe(conf) : { done: {}, sent: {} }]);
    const list = parseReminders(ics);
    const today = todayAthens();
    // «📌» events whose day has come (last 60 days) — the CRM adds each one to «Do ASAP» once
    const from60 = inAthens(new Date(Date.now() - 60 * 864e5)).day;
    const asap = parseAsap(ics).filter((a) => a.day >= from60 && a.day <= today).map(({ status, ...a }) => a);
    // + things the server itself asks Angelo to do (e.g. «buy the domain» when a client presses «πάμε live»)
    try { const r = ghReady(conf) ? await readAtHead(conf, 'asap/inbox.json') : null; const inbox = r && r.text ? JSON.parse(r.text) : [];
      (Array.isArray(inbox) ? inbox : []).filter((a) => a && a.uid && a.text && (a.day || '') >= from60).forEach((a) => asap.push({ uid: a.uid, day: a.day, text: a.text, hot: !!a.hot })); } catch {}
    const items = withState(list, state).map((r) => ({ ...r, viber: viberText(r) }));
    if (k) {
      const L = [`REMINDERS — ${dayGreek(today)} — ${items.filter((r) => !r.done && r.day <= today).length} due, ${items.filter((r) => !r.done && r.day > today).length} upcoming`];
      items.forEach((r) => L.push(`  ${r.done ? '✅' : r.day < today ? '⚠️ overdue' : r.day === today ? '⏰ today' : '·'} ${r.day}${r.time ? ' ' + r.time : ''} — ${r.client} — ${r.what}${r.sentOn ? ' (sent ' + r.sentOn + ')' : ''}`));
      return new Response(L.join('\n'), { headers: { ...NO_STORE, 'Content-Type': 'text/plain; charset=utf-8' } });
    }
    return json({ ok: true, today, items, asap });
  } catch (e) {
    return json({ ok: false, code: e.code || 'error', error: e.message || 'failed' }, e.code === 'no_calendar' ? 503 : 502);
  }
}

export async function POST(req) {
  if (!(await crmAuthorized(req))) return json({ ok: false, error: 'unauthorized' }, 401);
  const conf = ghConf();
  if (!ghReady(conf)) return json({ ok: false, error: 'storage not configured' }, 503);
  const url = new URL(req.url);
  if (url.searchParams.get('done') !== '1') return json({ ok: false, error: 'unknown action' }, 400);
  let body; try { body = await req.json(); } catch { return json({ ok: false, error: 'bad json' }, 400); }
  const uid = String(body.uid || '').trim().slice(0, 200);
  if (!uid) return json({ ok: false, error: 'missing uid' }, 400);
  let out = null;
  try {
    await ghCommit(conf, `reminders: ${body.undo ? 'undo' : 'done'} ${uid.slice(0, 24)}`, async (ctx) => {
      const { data } = await ctx.readJson(STATE_PATH, {});
      const st = data && typeof data === 'object' ? data : {};
      st.done = st.done || {}; st.sent = st.sent || {};
      if (body.undo) delete st.done[uid]; else st.done[uid] = new Date().toISOString();
      // keep the file small: forget marks older than 120 days
      const cut = Date.now() - 120 * 864e5;
      for (const [u, at] of Object.entries(st.done)) if (Date.parse(at) < cut) delete st.done[u];
      for (const [u, d] of Object.entries(st.sent)) if (Date.parse(d) < cut) delete st.sent[u];
      out = st;
      return [{ path: STATE_PATH, content: JSON.stringify(st, null, 1) }];
    });
    forgetHead();
    return json({ ok: true, done: !body.undo, uid, state: out });
  } catch (e) { return json({ ok: false, error: e.message || 'write failed' }, 502); }
}
