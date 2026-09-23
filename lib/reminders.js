// lib/reminders.js — client reminders (23 Sept 2026)
//
// Angelo keeps «remind KOURAKOS on Friday to send material» as EVENTS in his Google Calendar «Advon Media»
// (the same calendar the CRM reads for bookings, GCAL_ICS_URL). A reminder is any event whose title starts
// with ⏰:   «⏰ KOURAKOS — υλικό για τη σελίδα»
//   title  = ⏰ <client> — <what we need from them>
//   description (optional) = details; a paragraph starting «Viber:» is the ready-to-send text for the client.
// Claude (from any chat, any device) or Angelo himself (Google Calendar app) creates them — nothing else to install.
//
// This module is shared by app/api/reminders/route.js (the CRM Home card) and netlify/functions/reminders.mjs
// (the 08:30 Telegram + e-mail). Done / sent bookkeeping lives in the private data repo: reminders/state.json
//   { done: { <uid>: iso }, sent: { <uid>: 'YYYY-MM-DD' } }
// (the calendar is read-only for us — Google's secret iCal address cannot write).

import { tgEsc } from './chatcore.js';

export const STATE_PATH = 'reminders/state.json';
const ATHENS = 'Europe/Athens';

// ---------- ICS (same shapes as app/api/bookings/route.js) ----------
const unfold = (text) => text.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '').replace(/\r/g, '');
const unescapeIcs = (v) => String(v || '').replace(/\\n/gi, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\').trim();
const stripTags = (v) => String(v || '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
function parseBlock(block) {
  const out = {};
  block.split('\n').forEach((line) => {
    const i = line.indexOf(':'); if (i < 0) return;
    const left = line.slice(0, i), value = line.slice(i + 1);
    const parts = left.split(';'); const name = parts[0].toUpperCase(); const params = {};
    parts.slice(1).forEach((p) => { const j = p.indexOf('='); if (j > 0) params[p.slice(0, j).toUpperCase()] = p.slice(j + 1).replace(/^"|"$/g, ''); });
    const item = { value, params };
    if (out[name] === undefined) out[name] = item; else if (Array.isArray(out[name])) out[name].push(item); else out[name] = [out[name], item];
  });
  return out;
}
export function inAthens(date) {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: ATHENS, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(date).reduce((a, x) => ((a[x.type] = x.value), a), {});
  return { day: `${p.year}-${p.month}-${p.day}`, time: `${p.hour === '24' ? '00' : p.hour}:${p.minute}` };
}
function parseDt(prop) {
  if (!prop) return null;
  const v = String(prop.value || '').trim();
  const allDay = (prop.params && prop.params.VALUE === 'DATE') || /^\d{8}$/.test(v);
  if (allDay) { const m = v.match(/^(\d{4})(\d{2})(\d{2})$/); return m ? { day: `${m[1]}-${m[2]}-${m[3]}`, time: '', allDay: true } : null; }
  const m = v.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/); if (!m) return null;
  if (m[7] === 'Z') { const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6])); return { ...inAthens(d), allDay: false }; }
  return { day: `${m[1]}-${m[2]}-${m[3]}`, time: `${m[4]}:${m[5]}`, allDay: false };
}

// ---------- a reminder out of one event ----------
const TITLE_RE = /^\s*(✅\s*)?⏰\s*(.*)$/u;
export function splitTitle(summary) {
  const m = String(summary || '').match(TITLE_RE); if (!m) return null;
  const rest = m[2].trim();
  // «KOURAKOS — υλικό» / «KOURAKOS - υλικό» / «KOURAKOS: υλικό» / «KOURAKOS υλικό»
  const sep = rest.match(/^(.*?)\s*(?:—|–|-|:)\s+(.*)$/);
  const client = (sep ? sep[1] : rest.split(/\s+/)[0]).trim();
  const what = (sep ? sep[2] : rest.slice(client.length)).trim();
  return { doneMark: !!m[1], client, what };
}
export function readReminder(ev) {
  const summary = unescapeIcs(ev.SUMMARY && ev.SUMMARY.value);
  const t = splitTitle(summary); if (!t) return null;
  const start = parseDt(ev.DTSTART); if (!start) return null;
  const desc = stripTags(unescapeIcs(ev.DESCRIPTION && ev.DESCRIPTION.value));
  const vm = desc.match(/(?:^|\n)\s*Viber\s*:\s*([\s\S]+?)(?=\n\s*\n\s*[A-ZΑ-Ω][^\n]{0,30}:|$)/i);
  return {
    uid: String((ev.UID && ev.UID.value) || '').trim() || `${start.day}|${summary}`,
    day: start.day, time: start.allDay ? '' : start.time,
    client: t.client, what: t.what, title: summary.replace(/^\s*(✅\s*)?⏰\s*/u, '').trim(),
    doneMark: t.doneMark,
    desc: desc.replace(/(?:^|\n)\s*Viber\s*:[\s\S]*$/i, '').trim().slice(0, 1200),
    viber: vm ? vm[1].trim().slice(0, 1500) : '',
    status: String((ev.STATUS && ev.STATUS.value) || 'CONFIRMED').toUpperCase(),
  };
}
export function parseReminders(icsText) {
  const blocks = unfold(icsText).split('BEGIN:VEVENT').slice(1).map((b) => b.split('END:VEVENT')[0]);
  const seen = new Set(); const out = [];
  for (const b of blocks) {
    let r = null; try { r = readReminder(parseBlock(b)); } catch { r = null; }
    if (!r || r.status === 'CANCELLED' || seen.has(r.uid)) continue;
    seen.add(r.uid); out.push(r);
  }
  return out.sort((a, b) => (a.day + a.time).localeCompare(b.day + b.time));
}
export async function fetchReminders() {
  const icsUrl = process.env.GCAL_ICS_URL;
  if (!icsUrl) throw Object.assign(new Error('GCAL_ICS_URL is not set in Netlify — the calendar link is missing'), { code: 'no_calendar' });
  const res = await fetch(icsUrl, { cache: 'no-store', headers: { 'User-Agent': 'AdvonCRM/1.0' } });
  if (!res.ok) throw Object.assign(new Error(`Google answered ${res.status} for the calendar link`), { code: 'calendar_error' });
  const text = await res.text();
  if (!/BEGIN:VCALENDAR/.test(text)) throw Object.assign(new Error('That link did not return a calendar'), { code: 'calendar_bad' });
  return parseReminders(text);
}

// ---------- what the CRM and the notifier show: the window + the state ----------
export const todayAthens = () => inAthens(new Date()).day;
export function withState(list, state, { back = 45, ahead = 60 } = {}) {
  const today = todayAthens();
  const from = inAthens(new Date(Date.now() - back * 864e5)).day, to = inAthens(new Date(Date.now() + ahead * 864e5)).day;
  const done = (state && state.done) || {}, sent = (state && state.sent) || {};
  return list.filter((r) => r.day >= from && r.day <= to).map((r) => {
    const isDone = !!(done[r.uid] || r.doneMark);
    return { ...r, done: isDone, doneAt: done[r.uid] || null, sentOn: sent[r.uid] || null, when: r.day < today ? 'overdue' : r.day === today ? 'today' : 'upcoming' };
  }).filter((r) => !(r.done && r.day < from));
}

// ---------- the Viber text ----------
// If Claude wrote one at capture time («Viber:» in the description) it is used as it is; otherwise a plain,
// safe template (Angelo edits it before sending). No emojis in the client text, never a word about money.
const greekCaps = (s) => /[Α-Ωα-ω]/.test(s);
export function viberText(r) {
  if (r.viber) return r.viber;
  const name = greekCaps(r.client) ? ` κ. ${r.client}` : '';
  const what = r.what ? r.what.replace(/[.\s]+$/, '') : 'ό,τι είχαμε πει';
  return `Καλημέρα σας${name}! Ελπίζω να είστε καλά.\n\nΜια μικρή υπενθύμιση για την ιστοσελίδα σας — για να προχωρήσουμε θα χρειαστούμε: ${what}.\n\nΜπορείτε να μου τα στείλετε εδώ στο Viber ή στο advonmd@gmail.com (αρχεία πάνω από 4 MB μέσω wetransfer.com). Μόλις τα έχω, συνεχίζω αμέσως.\n\nΕυχαριστώ πολύ!`;
}

// ---------- the 08:30 message to Angelo (Telegram + e-mail) ----------
const GR_DAYS = ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];
export function dayGreek(day) {
  const [y, m, d] = day.split('-').map(Number);
  return `${GR_DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]} ${d}/${m}`;
}
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
export function reminderDigest(items, today) {
  const due = items.filter((r) => !r.done && r.day <= today).sort((a, b) => a.day.localeCompare(b.day));
  const overdue = due.filter((r) => r.day < today), now = due.filter((r) => r.day === today);
  const title = `⏰ Υπενθυμίσεις πελατών — ${dayGreek(today)}`;
  const line = (r) => `${r.client}${r.what ? ' — ' + r.what : ''}${r.day < today ? ` (εκκρεμεί από ${dayGreek(r.day)})` : ''}`;
  let tg = `<b>${tgEsc(title)}</b>`;
  const tgItem = (r) => `\n\n👤 <b>${tgEsc(r.client)}</b>${r.what ? ' — ' + tgEsc(r.what) : ''}${r.day < today ? `\n<i>εκκρεμεί από ${tgEsc(dayGreek(r.day))}</i>` : ''}\n<blockquote>${tgEsc(viberText(r))}</blockquote>`;
  overdue.forEach((r) => { tg += tgItem(r); }); now.forEach((r) => { tg += tgItem(r); });
  tg += `\n\n<i>Αντιγράψτε το κείμενο στο Viber. Στο CRM → Home «Client reminders» πατήστε ✓ μόλις στείλουν.</i>`;
  const text = `${title}\n\n${due.map((r) => `${line(r)}\n\n${viberText(r)}`).join('\n\n— — —\n\n')}\n\nCRM: https://advonmedia.com/crm/`;
  const cards = due.map((r) => `<div style="margin:18px 0 0"><p style="margin:0 0 6px;font:800 15px ${FONT}">${esc(r.client)}${r.what ? ` <span style="font-weight:600;color:#5C6575">— ${esc(r.what)}</span>` : ''}${r.day < today ? `<span style="display:inline-block;margin-left:8px;background:#FFF1E6;color:#B7791F;font:700 11px ${FONT};border-radius:999px;padding:3px 9px">εκκρεμεί από ${esc(dayGreek(r.day))}</span>` : ''}</p>
    <div style="background:#F4F8FE;border-left:4px solid #2F7FE0;border-radius:0 12px 12px 0;padding:14px 16px;font-size:14.5px;white-space:pre-wrap">${esc(viberText(r))}</div></div>`).join('');
  const html = `<div style="background:#F3F5F9;padding:24px 12px"><div style="max-width:600px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden;border:1px solid #E6E9F0;font-family:${FONT};color:#10141F;line-height:1.55">
    <div style="background:#0B0E12;padding:16px 26px"><span style="font:800 12px ${FONT};letter-spacing:.18em;text-transform:uppercase;color:#fff">Advon CRM · Reminders</span></div>
    <div style="padding:24px 26px 26px"><h1 style="font:800 22px ${FONT};margin:0 0 4px">${esc(title)}</h1><p style="margin:0;font-size:14px;color:#5C6575">${due.length === 1 ? '1 πελάτης' : due.length + ' πελάτες'} · αντιγράψτε το κείμενο στο Viber</p>${cards}
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 0"><tr><td style="background:#2F7FE0;border-radius:12px"><a href="https://advonmedia.com/crm/" style="display:inline-block;padding:13px 24px;font:700 15px ${FONT};color:#fff;text-decoration:none">Open the CRM →</a></td></tr></table></div></div></div>`;
  return { n: due.length, uids: due.map((r) => r.uid), tg, subject: `${title}${due.length ? ' · ' + due.map((r) => r.client).join(', ') : ''}`, text, html, buttons: [{ text: 'Open the CRM', url: 'https://advonmedia.com/crm/' }] };
}
