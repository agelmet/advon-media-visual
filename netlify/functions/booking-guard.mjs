// netlify/functions/booking-guard.mjs — warns Angelo about a booking whose e-mail was never confirmed (20 Oct 2026)
//
// The booking calendar on advonmedia.com and /dorean opens only after the visitor confirms their e-mail with a
// 6-digit code (/api/verify → bookings/verified.json). Zoho's own booking link still exists, though, and anyone
// who digs it out of the page can book there without a code. Every 10 minutes this reads the Google Calendar
// «Advon Media» (GCAL_ICS_URL — Zoho writes every booking into it), and for each NEW Zoho booking checks the
// customer's e-mail against bookings/verified.json. Not confirmed → one Telegram (or e-mail) to Angelo:
// «probably fake — cancel it in Zoho without notifying». Confirmed → nothing.
// Bookkeeping: bookings/guard.json {since, seen:{<booking id>: 'ok'|'alert'|'base'}}. The first run only takes
// note of the bookings that already exist (no alerts for the past).
// Manual run: GET https://advonmedia.com/.netlify/functions/booking-guard?key=<CHAT_AGENT_KEY or first 12 chars of CRM_AUTH_HASH>[&dry=1]

import { ghConf, ghReady, commit as ghCommit } from '../../lib/ghdata.js';
import { mailConf, sendEmail, sendTelegram, tgEsc } from '../../lib/chatcore.js';
import { fetchCalendarText } from '../../lib/reminders.js';

export const config = { schedule: '*/10 * * * *' };

const GUARD_PATH = 'bookings/guard.json';
const VERIFIED_PATH = 'bookings/verified.json';

// ---------- the Zoho bookings in the calendar ----------
const unfold = (t) => t.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '').replace(/\r/g, '');
const unesc = (v) => String(v || '').replace(/\\n/gi, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\').trim();
const strip = (v) => String(v || '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const pick = (re, t) => { const m = t.match(re); return m ? m[1].trim() : ''; };
function prop(block, name) {
  const m = block.match(new RegExp(`^${name}(;[^:\\n]*)?:(.*)$`, 'm'));
  return m ? { params: m[1] || '', value: m[2] } : null;
}
function startOf(p) {
  if (!p) return '';
  const m = p.value.trim().match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/);
  if (!m) return '';
  if (/Z$/.test(p.value.trim())) {
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]));
    return d.toLocaleString('en-GB', { timeZone: 'Europe/Athens', weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }
  return `${m[3]}/${m[2]} ${m[4]}:${m[5]}`;
}
export function zohoBookings(ics) {
  const text = unfold(ics);
  const out = [];
  for (const blk of text.split('BEGIN:VEVENT').slice(1)) {
    const block = blk.split('END:VEVENT')[0];
    const desc = strip(unesc((prop(block, 'DESCRIPTION') || {}).value));
    if (!/Customer\s*Info/i.test(desc)) continue;
    const status = String((prop(block, 'STATUS') || {}).value || 'CONFIRMED').trim().toUpperCase();
    const ref = pick(/^\s*Booking\s*ID\s*:\s*(.+)$/im, desc);
    const uid = String((prop(block, 'UID') || {}).value || '').trim();
    out.push({
      id: ref || uid,
      ref,
      status,
      name: pick(/^\s*Name\s*:\s*(.+)$/im, desc),
      email: pick(/^\s*Email\s*:\s*(.+)$/im, desc).toLowerCase(),
      phone: pick(/^\s*(?:Contact\s*Number|Phone)\s*:\s*(.+)$/im, desc),
      when: startOf(prop(block, 'DTSTART')),
    });
  }
  return out.filter((b) => b.id);
}

function alertText(b) {
  return [
    `⚠️ <b>BOOKING WITH AN UNCONFIRMED E-MAIL</b>`,
    ``,
    `<b>${tgEsc(b.name || 'No name')}</b>${b.ref ? ` · ${tgEsc(b.ref)}` : ''}`,
    b.when ? `Meeting: ${tgEsc(b.when)}` : null,
    `E-mail: ${tgEsc(b.email || '—')} — never confirmed with the code`,
    b.phone ? `Phone: ${tgEsc(b.phone)}` : null,
    ``,
    `It was made on Zoho's own link, not through advonmedia.com, so nobody checked the e-mail. Most likely fake.`,
    `If the phone does not answer: cancel it in Zoho Bookings <b>without</b> notifying.`,
  ].filter((x) => x !== null).join('\n');
}

export default async (req) => {
  const url = new URL(req.url);
  const manual = url.searchParams.get('key');
  if (manual !== null) {
    const want = String(process.env.CRM_AUTH_HASH || '').slice(0, 12);
    const h = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(manual)))].map((b) => b.toString(16).padStart(2, '0')).join('');
    const agentOk = h === '9bdf28e5bfba580df30a7b218900fa53dc3fba6e8a1317df8e8c2326080ac38a';
    if (!agentOk && (!want || manual !== want)) return new Response('forbidden', { status: 403 });
  }
  const dry = url.searchParams.get('dry') === '1';
  const conf = ghConf();
  if (!ghReady(conf)) return new Response('no data repo', { status: 503 });
  const mc = mailConf();

  let list;
  try { list = zohoBookings(await fetchCalendarText()); }
  catch (e) { return new Response(`calendar: ${e.message}`, { status: 502 }); }

  const report = { bookings: list.length, alerts: [], ok: [], baseline: false };
  await ghCommit(conf, 'booking guard', async (ctx) => {
    const g = (await ctx.readJson(GUARD_PATH, null)).data;
    const verified = (await ctx.readJson(VERIFIED_PATH, {})).data || {};
    const state = g && typeof g === 'object' && g.seen ? g : { since: new Date().toISOString(), seen: {} };
    const first = !g;
    report.baseline = first;
    let changed = first;
    for (const b of list) {
      if (state.seen[b.id]) continue;
      if (b.status === 'CANCELLED') continue;                       // already cancelled — nothing to say
      changed = true;
      if (first) { state.seen[b.id] = 'base'; continue; }
      if (b.email && verified[b.email]) { state.seen[b.id] = 'ok'; report.ok.push(b.id); continue; }
      state.seen[b.id] = 'alert';
      report.alerts.push(b);
    }
    if (!changed || dry) return null;
    const keys = Object.keys(state.seen);
    if (keys.length > 2000) keys.slice(0, keys.length - 2000).forEach((k) => delete state.seen[k]);
    return [{ path: GUARD_PATH, content: JSON.stringify(state, null, 1) }];
  });

  if (!dry) {
    for (const b of report.alerts) {
      const t = alertText(b);
      const r = await sendTelegram(mc, t, { html: true, buttons: [{ text: 'Open Zoho Bookings', url: 'https://bookings.zoho.eu/' }] });
      if (!r.ok && mc.resendKey) await sendEmail(mc, mc.notifyTo, `⚠️ Booking with an unconfirmed e-mail — ${b.name || b.email}`, t.replace(/<[^>]+>/g, ''));
    }
  }
  return new Response(JSON.stringify({ ...report, alerts: report.alerts.map((b) => ({ id: b.id, name: b.name, email: b.email })) }, null, 1), { headers: { 'Content-Type': 'application/json' } });
};
