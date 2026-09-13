// app/api/bookings/route.js
//
// Meetings booked online -> the Advon CRM.
//
// Every booking page Angelo uses (Zoho Bookings and the Google Calendar
// appointment schedule) writes the meeting into the Google Calendar
// "Advon Media" (advonmd@gmail.com). This route reads that calendar through
// its PRIVATE iCal address, turns each booking into clean JSON, and the CRM
// (public/crm/index.html) turns it into a client on the Board with one tap.
//
// Environment variable, set on NETLIFY (Site configuration -> Environment
// variables). It is a secret: anyone holding it can read the whole calendar.
//   GCAL_ICS_URL   the "Secret address in iCal format" of the calendar
//                  (Google Calendar -> Settings -> <calendar> -> Integrate calendar)
//
// Authentication reuses the CRM's own sync token: the browser sends
// x-crm-auth and it is checked against CRM_AUTH_HASH, exactly like /api/crm.
// Without it the route answers 401 — customer names, emails and phone
// numbers are never served to the open internet.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
  'Content-Type': 'application/json; charset=utf-8',
};
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: NO_STORE });

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

/* ---------------- iCalendar parsing ---------------- */

// RFC 5545 folds long lines: a CRLF followed by a space or tab continues the
// previous line. Unfold first or every long DESCRIPTION comes back in pieces.
function unfold(text) {
  return text.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '').replace(/\r/g, '');
}
function unescapeIcs(v) {
  return String(v || '')
    .replace(/\\n/gi, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\')
    .trim();
}
function stripTags(v) {
  return String(v || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

// One VEVENT -> a map of NAME -> {value, params}. Repeated names keep a list.
function parseBlock(block) {
  const out = {};
  block.split('\n').forEach((line) => {
    const i = line.indexOf(':');
    if (i < 0) return;
    const left = line.slice(0, i);
    const value = line.slice(i + 1);
    const parts = left.split(';');
    const name = parts[0].toUpperCase();
    const params = {};
    parts.slice(1).forEach((p) => {
      const j = p.indexOf('=');
      if (j > 0) params[p.slice(0, j).toUpperCase()] = p.slice(j + 1).replace(/^"|"$/g, '');
    });
    const item = { value, params };
    if (out[name] === undefined) out[name] = item;
    else if (Array.isArray(out[name])) out[name].push(item);
    else out[name] = [out[name], item];
  });
  return out;
}

const ATHENS = 'Europe/Athens';
// A UTC instant -> {day:'YYYY-MM-DD', time:'HH:MM'} as it reads on a clock in Athens.
function inAthens(date) {
  const p = new Intl.DateTimeFormat('en-GB', {
    timeZone: ATHENS, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(date).reduce((a, x) => ((a[x.type] = x.value), a), {});
  return { day: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}
// DTSTART in any of its three shapes: floating local, UTC (trailing Z), all-day.
function parseDt(prop) {
  if (!prop) return null;
  const v = String(prop.value || '').trim();
  const allDay = (prop.params && prop.params.VALUE === 'DATE') || /^\d{8}$/.test(v);
  if (allDay) {
    const m = v.match(/^(\d{4})(\d{2})(\d{2})$/);
    return m ? { day: `${m[1]}-${m[2]}-${m[3]}`, time: '', allDay: true } : null;
  }
  const m = v.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/);
  if (!m) return null;
  if (m[7] === 'Z') {
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
    return { ...inAthens(d), allDay: false, iso: d.toISOString() };
  }
  // TZID form: the digits already are the wall time in that zone.
  return { day: `${m[1]}-${m[2]}-${m[3]}`, time: `${m[4]}:${m[5]}`, allDay: false };
}

/* ---------------- turning an event into a booking ---------------- */

const OWN = /(advonmd|agelmet|agelmetbzn|agelmet7|agelmetsoc)@/i;
const pick = (re, text) => { const m = text.match(re); return m ? m[1].trim() : ''; };

function readBooking(ev) {
  const summary = unescapeIcs(ev.SUMMARY && ev.SUMMARY.value);
  const desc = stripTags(unescapeIcs(ev.DESCRIPTION && ev.DESCRIPTION.value));
  let name = '', email = '', phone = '', service = '', ref = '', source = '';

  // 1. Zoho Bookings, synced into Google Calendar.
  //    "Customer Info / Name : X / Email : Y / Contact Number : Z / Booking ID : AD-000n"
  if (/Customer\s*Info/i.test(desc)) {
    source = 'zoho';
    name = pick(/^\s*Name\s*:\s*(.+)$/im, desc);
    email = pick(/^\s*Email\s*:\s*(.+)$/im, desc);
    phone = pick(/^\s*(?:Contact\s*Number|Phone)\s*:\s*(.+)$/im, desc);
    service = pick(/^\s*Service\s*Name\s*:\s*(.+)$/im, desc);
    ref = pick(/^\s*Booking\s*ID\s*:\s*(.+)$/im, desc);
  }
  // 2. Google Calendar appointment schedule.
  //    "<b>Κράτηση από</b>\n<name>\n<email>" (or the English "Booked by").
  else if (/Κράτηση\s*από|Booked\s*by/i.test(desc)) {
    source = 'google';
    const lines = desc.split('\n').map((s) => s.trim()).filter(Boolean);
    const at = lines.findIndex((l) => /Κράτηση\s*από|Booked\s*by/i.test(l));
    const after = lines.slice(at + 1);
    name = after.find((l) => !/@/.test(l)) || '';
    email = (after.find((l) => /@/.test(l)) || '').match(/[^\s<>,;]+@[^\s<>,;]+/)?.[0] || '';
    // "Website - Advon Media (Οδοντίατρος Κουράκος)" -> service, name
    const m = summary.match(/^(.*?)\s*\(([^()]+)\)\s*$/);
    if (m) { service = m[1].trim(); if (!name) name = m[2].trim(); }
    else service = summary;
  }
  if (!source) return null;

  // Summary fallbacks: "<service> with <name>" (Zoho's wording).
  if (!name) {
    const m = summary.match(/^(.*?)\s+(?:with|με)\s+(.+)$/i);
    if (m) { name = m[2].trim(); if (!service) service = m[1].trim(); }
  }
  if (!service) service = summary;

  // Whoever is on the invitation and is not one of Angelo's own addresses.
  if (!email) {
    const att = ev.ATTENDEE ? (Array.isArray(ev.ATTENDEE) ? ev.ATTENDEE : [ev.ATTENDEE]) : [];
    for (const a of att) {
      const e = String(a.value || '').replace(/^mailto:/i, '').trim();
      if (e && !OWN.test(e)) { email = e; if (!name && a.params && a.params.CN) name = a.params.CN; break; }
    }
  }
  if (!name && !email) return null;

  const start = parseDt(ev.DTSTART), end = parseDt(ev.DTEND);
  if (!start) return null;

  return {
    uid: String((ev.UID && ev.UID.value) || '').trim(),
    source,
    name: name || email,
    email,
    phone: phone.replace(/\s+/g, ' ').trim(),
    service,
    ref,
    day: start.day,
    time: start.allDay ? '' : start.time,
    endTime: end && !end.allDay ? end.time : '',
    meet: (pick(/(https:\/\/meet\.google\.com\/[a-z-]+)/i, desc) || ''),
    status: String((ev.STATUS && ev.STATUS.value) || 'CONFIRMED').toUpperCase(),
    created: String((ev.CREATED && ev.CREATED.value) || ''),
  };
}

export async function GET(req) {
  const icsUrl = process.env.GCAL_ICS_URL;
  const authHash = process.env.CRM_AUTH_HASH;

  if (!authHash) return json({ ok: false, code: 'not_configured', error: 'CRM_AUTH_HASH is missing on the server' }, 500);
  const token = req.headers.get('x-crm-auth') || '';
  if (!token || !safeEqual(await sha256Hex(token), String(authHash).trim().toLowerCase()))
    return json({ ok: false, code: 'unauthorized', error: 'Sync token missing or wrong' }, 401);

  if (!icsUrl)
    return json({ ok: false, code: 'no_calendar', error: 'GCAL_ICS_URL is not set in Netlify — the calendar link is missing' }, 503);

  let text = '';
  try {
    const res = await fetch(icsUrl, { cache: 'no-store', headers: { 'User-Agent': 'AdvonCRM/1.0' } });
    if (!res.ok)
      return json({ ok: false, code: 'calendar_error', error: `Google answered ${res.status} for the calendar link` }, 502);
    text = await res.text();
  } catch (e) {
    return json({ ok: false, code: 'calendar_unreachable', error: String((e && e.message) || e) }, 502);
  }
  if (!/BEGIN:VCALENDAR/.test(text))
    return json({ ok: false, code: 'calendar_bad', error: 'That link did not return a calendar' }, 502);

  const blocks = unfold(text).split('BEGIN:VEVENT').slice(1).map((b) => b.split('END:VEVENT')[0]);
  const seen = new Set();
  const bookings = [];
  for (const b of blocks) {
    let bk = null;
    try { bk = readBooking(parseBlock(b)); } catch { bk = null; }
    if (!bk || bk.status === 'CANCELLED') continue;
    const key = bk.uid || `${bk.day}|${bk.time}|${bk.name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    bookings.push(bk);
  }

  // A month back (so nothing already booked is missed) and a year forward.
  const today = inAthens(new Date()).day;
  const from = inAthens(new Date(Date.now() - 31 * 864e5)).day;
  const to = inAthens(new Date(Date.now() + 366 * 864e5)).day;
  const list = bookings
    .filter((b) => b.day >= from && b.day <= to)
    .sort((a, b) => (a.day + (a.time || '')).localeCompare(b.day + (b.time || '')));

  return json({
    ok: true,
    today,
    count: list.length,
    upcoming: list.filter((b) => b.day >= today).length,
    bookings: list,
  });
}
