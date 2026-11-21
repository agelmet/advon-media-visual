// app/api/booking/route.js — Advon's own booking page (/rantevou), 20 Nov 2026. See lib/booking.js.
//
//   GET  ?slots=1[&from=YYYY-MM-DD&days=N]   free start times per day (public)
//   GET  ?stamp=1                            the form stamp (robot check, same as /api/lead)
//   GET  ?b=<id>.<sig>                       one booking, for the change/cancel page (the link in the e-mails)
//   POST {action:'book', day, time, name, phone, email, job?, how:'meet'|'tel', msg?, lang?, stamp, website(honeypot)}
//   POST {action:'move', b, day, time}       change the time
//   POST {action:'cancel', b}
//   POST {action:'test', b}                  send both reminders now (only on test deploys, or for Angelo's own address)

import { ghConf, ghReady, commit, readAtHead } from '@/lib/ghdata';
import { checkStamp, makeStamp, phoneVerdict, contentVerdict, emailShapeOk, tooMany, clientIp } from '@/lib/antispam';
import { mailConf, sendTelegram, tgEsc } from '@/lib/chatcore';
import { sendMetaEvent } from '@/lib/metacapi';
import {
  BOOKING, gcalReady, freeSlots, isFree, createEvent, moveEvent, deleteEvent, newId, newRef, manageToken, readToken,
  publicBooking, sendBookingMail, sendOwnerMail, bookingStats, dayLabel, endTime, athensToDate, todayAthens,
} from '@/lib/booking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const H = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8' };
const json = (b, s = 200) => new Response(JSON.stringify(b), { status: s, headers: H });
// CONTEXT exists only while Netlify BUILDS — the running function never sees it, so production thought it was a test
// («(test deploy)» on every Telegram). The data branch tells: production writes to main, branch deploys to draft.
const isProd = () => process.env.CONTEXT === 'production' || (process.env.CRM_GH_BRANCH || 'main') === 'main';
const OWN = /^(advonmd|agelmet[a-z0-9]*)@gmail\.com$/i;

function baseUrl(req) {
  if (isProd()) return 'https://advonmedia.com';
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'advonmedia.com';
  return `${/localhost|127\.0\.0\.1/.test(host) ? 'http' : 'https'}://${host}`;
}
const clean = (s, n) => String(s ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
const validDay = (d) => /^\d{4}-\d{2}-\d{2}$/.test(String(d || ''));
const validTime = (t) => /^\d{2}:\d{2}$/.test(String(t || ''));

async function loadAll(conf) {
  const r = await readAtHead(conf, BOOKING.path);
  try { const j = JSON.parse(r.text || '{}'); return Array.isArray(j.items) ? j.items : []; } catch { return []; }
}
async function findByToken(conf, tok) {
  const id = readToken(tok);
  if (!id) return null;
  return (await loadAll(conf)).find((x) => x.id === id) || null;
}
// Change ONE booking inside the file (retried on races by commit()).
async function saveBooking(conf, id, fn, message) {
  let out = null;
  await commit(conf, message, async (ctx) => {
    const { data } = await ctx.readJson(BOOKING.path, { items: [] });
    const items = Array.isArray(data?.items) ? data.items : [];
    const i = items.findIndex((x) => x.id === id);
    const next = fn(i >= 0 ? items[i] : null, items);
    if (!next) return null;
    if (i >= 0) items[i] = next; else items.push(next);
    out = next;
    return [{ path: BOOKING.path, content: JSON.stringify({ items }, null, 1) }];
  });
  return out;
}

async function tellAngelo(text, bk) {
  const mc = mailConf();
  const btn = [{ text: 'Open the CRM', url: 'https://crm.advonmedia.com/' }];
  return sendTelegram(mc, text + (isProd() ? '' : '\n\n<i>(test deploy)</i>'), { html: true, buttons: btn }).catch(() => null);
}
const who = (bk) => `<b>${tgEsc(bk.name)}</b>${bk.job ? ' · ' + tgEsc(bk.job) : ''}\n📞 ${tgEsc(bk.phone)} · ✉️ ${tgEsc(bk.email)}\n${bk.how === 'tel' ? 'Phone call' : 'Google Meet'}${bk.msg ? '\n«' + tgEsc(bk.msg) + '»' : ''}`;

export async function GET(req) {
  const u = new URL(req.url);
  if (u.searchParams.get('stamp')) return json({ ok: true, stamp: makeStamp() });

  if (u.searchParams.get('slots')) {
    if (!gcalReady()) return json({ ok: false, code: 'not_configured' }, 503);
    if (tooMany('slots:' + clientIp(req), 60, 60000)) return json({ ok: false, code: 'slow_down' }, 429);
    const from = validDay(u.searchParams.get('from')) ? u.searchParams.get('from') : todayAthens();
    const days = Math.min(Math.max(parseInt(u.searchParams.get('days') || '45', 10) || 45, 1), BOOKING.daysAhead + 1);
    try {
      const slots = await freeSlots(from, days);
      return json({ ok: true, tz: 'Europe/Athens', minutes: BOOKING.minutes, daysAhead: BOOKING.daysAhead, today: todayAthens(), slots });
    } catch (e) {
      console.error('[booking] slots', e.message);
      return json({ ok: false, code: e.code || 'calendar_error' }, 502);
    }
  }

  const tok = u.searchParams.get('b');
  if (tok) {
    const conf = ghConf();
    if (!ghReady(conf)) return json({ ok: false, code: 'not_configured' }, 503);
    const bk = await findByToken(conf, tok).catch(() => null);
    if (!bk) return json({ ok: false, code: 'not_found' }, 404);
    return json({ ok: true, booking: publicBooking(bk) });
  }
  return json({ ok: false, code: 'bad_request' }, 400);
}

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return json({ ok: false, code: 'bad_json' }, 400); }
  const action = String(body?.action || 'book');
  const conf = ghConf();
  if (!ghReady(conf) || !gcalReady()) return json({ ok: false, code: 'not_configured' }, 503);
  const ip = clientIp(req);
  const base = baseUrl(req);

  /* ---------- new booking ---------- */
  if (action === 'book') {
    if (tooMany('book:' + ip, 6, 3600000)) return json({ ok: false, code: 'slow_down' }, 429);
    if (clean(body.website, 50)) return json({ ok: true, booking: null, robot: true });           // honeypot: say «ok», do nothing
    const st = checkStamp(body.stamp);
    if (!st.ok) return json({ ok: false, code: 'robot' }, 400);
    const f = {
      day: String(body.day || ''), time: String(body.time || ''),
      name: clean(body.name, 80), phone: clean(body.phone, 30), email: clean(body.email, 160).toLowerCase(),
      job: clean(body.job, 80), msg: clean(body.msg, 600), how: body.how === 'tel' ? 'tel' : 'meet', lang: body.lang === 'en' ? 'en' : 'el',
      src: ['meta', 'google', 'form'].includes(body.src) ? body.src : '',
    };
    if (!validDay(f.day) || !validTime(f.time)) return json({ ok: false, code: 'bad_time' }, 400);
    if (f.name.length < 2) return json({ ok: false, code: 'bad_name' }, 400);
    const pv = phoneVerdict(f.phone);
    if (!pv.ok) return json({ ok: false, code: 'bad_phone' }, 400);
    if (!emailShapeOk(f.email)) return json({ ok: false, code: 'bad_email' }, 400);
    const cv = contentVerdict({ name: f.name, message: f.msg, email: f.email, profession: f.job });
    if (cv) { console.warn('[booking] spam', cv); return json({ ok: true, booking: null, robot: true }); }
    if (!(await isFree(f.day, f.time).catch(() => false))) return json({ ok: false, code: 'taken' }, 409);

    // a second booking from the same e-mail while one is still ahead → keep only the new one? No: refuse, offer the link.
    const items = await loadAll(conf);
    const ahead = items.find((x) => x.status === 'confirmed' && x.email === f.email && athensToDate(x.day, x.time).getTime() > Date.now());
    if (ahead && !OWN.test(f.email)) return json({ ok: false, code: 'already', booking: publicBooking(ahead), manage: manageToken(ahead.id) }, 409);

    const id = newId();
    const bk = { id, ref: newRef(items), ...f, status: 'confirmed', created: new Date().toISOString(), ip: ip.slice(0, 64), sent: {} };
    let ev;
    try { ev = await createEvent(bk); }
    catch (e) { console.error('[booking] create', e.message); return json({ ok: false, code: 'calendar_error' }, 502); }
    bk.eventId = ev.eventId; bk.meet = ev.meet;
    try {
      await saveBooking(conf, id, (cur, all) => { bk.ref = newRef(all); return bk; }, `Booking ${f.day} ${f.time} — ${f.name}`);
    } catch (e) {
      console.error('[booking] save', e.message);
      await deleteEvent(bk).catch(() => {});
      return json({ ok: false, code: 'save_error' }, 502);
    }
    const mail = await sendBookingMail('c', bk, base);
    if (mail.ok) await saveBooking(conf, id, (cur) => cur && { ...cur, sent: { ...(cur.sent || {}), c: new Date().toISOString() } }, `Booking ${bk.ref}: confirmation sent`).catch(() => {});
    await sendOwnerMail('new', bk, { stats: bookingStats([...items.filter((x) => x.id !== id), bk]) });
    await tellAngelo(`📅 <b>NEW BOOKING</b> · ${tgEsc(dayLabel(bk.day))} ${bk.time}–${endTime(bk.time)}\n${who(bk)}${mail.ok ? '' : '\n⚠️ confirmation e-mail not sent (' + tgEsc(mail.why) + ')'}`, bk);
    // Meta (server side, click id only — never name/phone/e-mail): «Schedule» for every booking from an ad click,
    // plus «Lead» when nobody filled the form before (the booking IS the lead). Same event ids as the pixel.
    const mb = { fbclid: body.fbclid, fbclid_ts: body.fbclid_ts, page: body.page || '/rantevou' };
    await Promise.all([
      body.ev_schedule ? sendMetaEvent(req, { ...mb, event_id: body.ev_schedule }, 'booking', 'Schedule').catch(() => false) : null,
      body.ev_lead && f.src !== 'form' ? sendMetaEvent(req, { ...mb, event_id: body.ev_lead }, 'booking', 'Lead').catch(() => false) : null,
    ]);
    return json({ ok: true, booking: publicBooking(bk), manage: manageToken(id), mail: mail.ok });
  }

  /* ---------- change / cancel / test ---------- */
  const bk = await findByToken(conf, body.b).catch(() => null);
  if (!bk) return json({ ok: false, code: 'not_found' }, 404);
  if (tooMany('manage:' + bk.id, 12, 3600000)) return json({ ok: false, code: 'slow_down' }, 429);

  if (action === 'cancel') {
    if (bk.status === 'cancelled') return json({ ok: true, booking: publicBooking(bk) });
    try { await deleteEvent(bk); } catch (e) { console.error('[booking] delete', e.message); return json({ ok: false, code: 'calendar_error' }, 502); }
    const next = await saveBooking(conf, bk.id, (cur) => cur && { ...cur, status: 'cancelled', cancelledAt: new Date().toISOString() }, `Booking ${bk.ref} cancelled`);
    await sendBookingMail('x', next, base);
    await sendOwnerMail('cancelled', next);
    await tellAngelo(`❌ <b>BOOKING CANCELLED</b> by the client · ${tgEsc(dayLabel(bk.day))} ${bk.time}\n${who(bk)}`, bk);
    return json({ ok: true, booking: publicBooking(next) });
  }

  if (action === 'move') {
    if (bk.status !== 'confirmed') return json({ ok: false, code: 'cancelled' }, 409);
    const day = String(body.day || ''), time = String(body.time || '');
    if (!validDay(day) || !validTime(time)) return json({ ok: false, code: 'bad_time' }, 400);
    if (!(await isFree(day, time).catch(() => false))) return json({ ok: false, code: 'taken' }, 409);
    const old = { day: bk.day, time: bk.time };
    const moved = { ...bk, day, time };
    try { await moveEvent(moved); } catch (e) { console.error('[booking] move', e.message); return json({ ok: false, code: 'calendar_error' }, 502); }
    const next = await saveBooking(conf, bk.id, (cur) => cur && { ...cur, day, time, movedAt: new Date().toISOString(), moves: [...(cur.moves || []), old], sent: { c: (cur.sent || {}).c } }, `Booking ${bk.ref} moved to ${day} ${time}`);
    await sendBookingMail('m', next, base);
    await sendOwnerMail('moved', next, { old });
    await tellAngelo(`🔁 <b>BOOKING MOVED</b> by the client\n${tgEsc(dayLabel(old.day))} ${old.time} → <b>${tgEsc(dayLabel(day))} ${time}</b>\n${who(next)}`, next);
    return json({ ok: true, booking: publicBooking(next) });
  }

  if (action === 'test') {
    if (isProd() && !OWN.test(bk.email)) return json({ ok: false, code: 'not_allowed' }, 403);
    const b = await sendBookingMail('r1', bk, base);
    return json({ ok: b.ok, r1: b });
  }

  return json({ ok: false, code: 'bad_action' }, 400);
}
