// lib/booking.js — Advon's own booking page for the free intro call (20 Nov 2026).
//
// Replaces the Zoho page. Angelo wanted a clean, branded, Greek page with e-mail reminders.
//   • free times  = his working hours (BOOKING below, copied from Zoho) minus whatever is busy in his
//                   Google Calendar «Advon Media» (advonmd@gmail.com), read live through the Calendar API;
//   • a booking   = an event in that calendar (with a Google Meet link) written in the SAME shape Zoho used
//                   («<service> with <name>», «Customer Info / Name : / Email : / Contact Number : / Booking ID :»),
//                   so app/api/bookings + the CRM put it on the Board exactly like a Zoho booking;
//   • e-mails     = confirmation now, a reminder ~24 h before and one ~1 h before, through Resend
//                   (netlify/functions/booking-reminders.mjs sends the reminders every 10 minutes);
//   • change/cancel links in every e-mail open /rantevou/?b=<id>.<sig>.
// Bookings are kept in the data repo: bookings/online.json (on branch deploys CRM_GH_BRANCH=draft keeps tests apart).
//
// Netlify env (Angelo pasted them himself, 20 Nov 2026): GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
// (Google Cloud project «advon-booking» under advonmd@gmail.com, OAuth app «Advon Booking», scopes calendar.events +
// calendar.freebusy). Resend: RESEND_API_KEY (Production context only — on a branch deploy no e-mail can go out).

import { createHash, createHmac, timingSafeEqual, randomBytes } from 'node:crypto';

export const TZ = 'Europe/Athens';
export const BOOKING = {
  service: 'Free Website & Growth Consultation',   // keep: the CRM and the ad-leads tab know bookings by this title
  minutes: 15,
  step: 15,                                         // a start time every 15 minutes, like Zoho
  noticeHours: 4,                                   // earliest booking: 4 hours from now (what Zoho showed on 20 Nov)
  daysAhead: 45,
  // JS getDay(): 0 Sunday … 6 Saturday. [first start, last start] in Athens time.
  hours: {
    1: ['09:00', '22:00'], 2: ['09:00', '22:00'], 3: ['09:00', '22:00'], 4: ['09:00', '22:00'], 5: ['09:00', '22:00'],
    6: ['10:30', '11:45'],
  },
  calendarId: 'primary',                            // advonmd@gmail.com = «Advon Media»
  path: 'bookings/online.json',
};

/* ---------------- time in Athens ---------------- */

const pad = (n) => String(n).padStart(2, '0');
// The offset of Athens from UTC (minutes) at a given instant.
function tzOffsetMin(date) {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })
    .formatToParts(date).reduce((a, x) => ((a[x.type] = x.value), a), {});
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return Math.round((asUtc - date.getTime()) / 60000);
}
// Athens wall time 'YYYY-MM-DD' + 'HH:MM' → Date (UTC instant).
export function athensToDate(day, time) {
  const [y, m, d] = day.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  let t = guess - tzOffsetMin(new Date(guess)) * 60000;
  t = guess - tzOffsetMin(new Date(t)) * 60000;          // second pass settles the DST edge
  return new Date(t);
}
export function athensParts(date) {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short', hourCycle: 'h23' })
    .formatToParts(date).reduce((a, x) => ((a[x.type] = x.value), a), {});
  return { day: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}
export const todayAthens = () => athensParts(new Date()).day;
function addDays(day, n) {
  const [y, m, d] = day.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}
const dow = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); };
const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fromMin = (n) => `${pad(Math.floor(n / 60))}:${pad(n % 60)}`;
export const endTime = (t) => fromMin(toMin(t) + BOOKING.minutes);

// Every start time the hours allow on a day (busy times not yet removed).
export function dayStarts(day) {
  const h = BOOKING.hours[dow(day)];
  if (!h) return [];
  const out = [];
  for (let m = toMin(h[0]); m <= toMin(h[1]); m += BOOKING.step) out.push(fromMin(m));
  return out;
}

/* ---------------- Google Calendar ---------------- */

export const gcalReady = () => !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN);
const TOK = { at: null, exp: 0 };
async function accessToken() {
  if (TOK.at && Date.now() < TOK.exp - 60000) return TOK.at;
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN, grant_type: 'refresh_token',
    }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) {
    const e = new Error(`Google sign-in failed: ${j.error || r.status} ${j.error_description || ''}`.trim());
    e.code = j.error === 'invalid_grant' ? 'gcal_revoked' : 'gcal_auth';
    throw e;
  }
  TOK.at = j.access_token; TOK.exp = Date.now() + (j.expires_in || 3000) * 1000;
  return TOK.at;
}
async function gapi(path, init = {}) {
  const at = await accessToken();
  const r = await fetch(`https://www.googleapis.com/calendar/v3/${path}`, {
    ...init, cache: 'no-store',
    headers: { Authorization: `Bearer ${at}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  if (r.status === 204) return {};
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(`Google Calendar ${r.status}: ${j?.error?.message || ''}`); e.status = r.status; throw e; }
  return j;
}
// Busy intervals [{s,e}] in ms between two instants.
export async function busy(fromDate, toDate) {
  const j = await gapi('freeBusy', { method: 'POST', body: JSON.stringify({ timeMin: fromDate.toISOString(), timeMax: toDate.toISOString(), timeZone: TZ, items: [{ id: BOOKING.calendarId }] }) });
  const cal = j.calendars && (j.calendars[BOOKING.calendarId] || Object.values(j.calendars)[0]);
  if (cal && cal.errors && cal.errors.length) throw new Error('Google Calendar: ' + cal.errors.map((x) => x.reason).join(', '));
  return ((cal && cal.busy) || []).map((b) => ({ s: Date.parse(b.start), e: Date.parse(b.end) }));
}
// Free start times per day for the next `days` days (from `fromDay`, Athens).
export async function freeSlots(fromDay = todayAthens(), days = BOOKING.daysAhead) {
  const first = fromDay < todayAthens() ? todayAthens() : fromDay;
  const lastAllowed = addDays(todayAthens(), BOOKING.daysAhead);
  const list = [];
  for (let i = 0; i < days; i++) { const d = addDays(first, i); if (d > lastAllowed) break; list.push(d); }
  if (!list.length) return {};
  const from = athensToDate(list[0], '00:00'), to = athensToDate(addDays(list[list.length - 1], 1), '00:00');
  const b = await busy(from, to);
  const earliest = Date.now() + BOOKING.noticeHours * 3600000;
  const out = {};
  for (const d of list) {
    const free = dayStarts(d).filter((t) => {
      const s = athensToDate(d, t).getTime(), e = s + BOOKING.minutes * 60000;
      if (s < earliest) return false;
      return !b.some((x) => x.s < e && x.e > s);
    });
    out[d] = free;
  }
  return out;
}
export async function isFree(day, time) {
  if (!dayStarts(day).includes(time)) return false;
  const s = athensToDate(day, time), e = new Date(s.getTime() + BOOKING.minutes * 60000);
  if (s.getTime() < Date.now() + BOOKING.noticeHours * 3600000) return false;
  if (day > addDays(todayAthens(), BOOKING.daysAhead)) return false;
  const b = await busy(s, e);
  return !b.some((x) => x.s < e.getTime() && x.e > s.getTime());
}

// The event, in Zoho's shape so the CRM recognises it (app/api/bookings readBooking).
function eventBody(bk, meet) {
  const lines = [
    'Customer Info',
    `Name : ${bk.name}`,
    `Email : ${bk.email}`,
    `Contact Number : ${bk.phone}`,
    `Service Name : ${BOOKING.service}`,
    `Booking ID : ${bk.ref}`,
    '',
    bk.how === 'tel' ? 'Τρόπος: τηλεφωνική κλήση στο κινητό του πελάτη' : 'Τρόπος: Google Meet',
    bk.job ? `Επάγγελμα / επιχείρηση: ${bk.job}` : '',
    bk.msg ? `Σημείωση: ${bk.msg}` : '',
    meet ? `Google Meet: ${meet}` : '',
    '',
    'Κλείστηκε από τη σελίδα ραντεβού του advonmedia.com',
  ];
  const s = athensToDate(bk.day, bk.time), e = new Date(s.getTime() + BOOKING.minutes * 60000);
  return {
    summary: `${BOOKING.service} with ${bk.name}`,
    description: lines.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
    start: { dateTime: s.toISOString(), timeZone: TZ },
    end: { dateTime: e.toISOString(), timeZone: TZ },
    attendees: bk.email ? [{ email: bk.email, displayName: bk.name }] : [],
    reminders: { useDefault: true },
  };
}
export async function createEvent(bk) {
  const body = eventBody(bk, '');
  if (bk.how !== 'tel') body.conferenceData = { createRequest: { requestId: bk.id, conferenceSolutionKey: { type: 'hangoutsMeet' } } };
  let ev = await gapi(`calendars/${encodeURIComponent(BOOKING.calendarId)}/events?conferenceDataVersion=1&sendUpdates=none`, { method: 'POST', body: JSON.stringify(body) });
  const meet = ev.hangoutLink || (ev.conferenceData?.entryPoints || []).find((p) => p.entryPointType === 'video')?.uri || '';
  if (meet) {
    // put the Meet link in the description too (the CRM reads it from there)
    ev = await gapi(`calendars/${encodeURIComponent(BOOKING.calendarId)}/events/${ev.id}?sendUpdates=none`, { method: 'PATCH', body: JSON.stringify({ description: eventBody(bk, meet).description }) }).catch(() => ev);
  }
  return { eventId: ev.id, meet };
}
export async function moveEvent(bk) {
  const b = eventBody(bk, bk.meet);
  return gapi(`calendars/${encodeURIComponent(BOOKING.calendarId)}/events/${bk.eventId}?sendUpdates=none`, { method: 'PATCH', body: JSON.stringify({ start: b.start, end: b.end, description: b.description, summary: b.summary }) });
}
export async function deleteEvent(bk) {
  if (!bk.eventId) return;
  try { await gapi(`calendars/${encodeURIComponent(BOOKING.calendarId)}/events/${bk.eventId}?sendUpdates=none`, { method: 'DELETE' }); }
  catch (e) { if (e.status !== 404 && e.status !== 410) throw e; }
}

/* ---------------- ids and the change/cancel link ---------------- */

const KEY = () => createHash('sha256').update('advon-booking|' + (process.env.CRM_AUTH_HASH || process.env.CRM_GH_TOKEN || 'dev')).digest();
export const newId = () => randomBytes(9).toString('base64url');
export const sign = (id) => createHmac('sha256', KEY()).update('bk|' + id).digest('base64url').slice(0, 22);
export const manageToken = (id) => `${id}.${sign(id)}`;
export function readToken(tok) {
  const m = String(tok || '').match(/^([A-Za-z0-9_-]{8,20})\.([A-Za-z0-9_-]{22})$/);
  if (!m) return null;
  const a = Buffer.from(m[2]), b = Buffer.from(sign(m[1]));
  return a.length === b.length && timingSafeEqual(a, b) ? m[1] : null;
}
export function newRef(items) {
  // ADV-0001, ADV-0002 … (Zoho used AD-000nn — a different prefix so the two never collide)
  let max = 0;
  for (const x of items || []) { const m = String(x.ref || '').match(/^ADV-(\d+)$/); if (m) max = Math.max(max, +m[1]); }
  return `ADV-${String(max + 1).padStart(4, '0')}`;
}
// What the page may show about a booking (no other people's data ever leaves the server).
export const publicBooking = (bk) => bk && ({
  ref: bk.ref, name: bk.name, day: bk.day, time: bk.time, end: endTime(bk.time), how: bk.how,
  phone: bk.phone, email: bk.email, meet: bk.how === 'tel' ? '' : bk.meet || '', status: bk.status, lang: bk.lang,
});

/* ---------------- e-mails ---------------- */

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const DAYS = { el: ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'], en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] };
const MON = { el: ['Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου', 'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου'], en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] };
export function dayLabel(day, lang = 'el', withYear = false) {
  const [y, m, d] = day.split('-').map(Number); const L = lang === 'en' ? 'en' : 'el';
  return `${DAYS[L][dow(day)]} ${d} ${MON[L][m - 1]}${withYear ? ' ' + y : ''}`;
}
// Calendar file / Google link for «add to my calendar».
export function gcalAddUrl(bk, lang = 'el') {
  const f = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const s = athensToDate(bk.day, bk.time), e = new Date(s.getTime() + BOOKING.minutes * 60000);
  const t = lang === 'en' ? 'Intro call with Advon Media' : 'Κλήση γνωριμίας με την Advon Media';
  const det = (bk.how === 'tel' ? (lang === 'en' ? `We call you on ${bk.phone}.` : `Σας καλούμε στο ${bk.phone}.`) : (bk.meet ? `Google Meet: ${bk.meet}` : 'Google Meet'));
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(t)}&dates=${f(s)}/${f(e)}&details=${encodeURIComponent(det)}`;
}

const TX = {
  el: {
    hi: 'Καλησπέρα σας,',
    c: { kicker: 'Επιβεβαιώθηκε', subject: (bk) => `Το ραντεβού σας κλείστηκε επιτυχώς · ${dayLabel(bk.day)}, ${bk.time}`, title: 'Το ραντεβού σας κλείστηκε επιτυχώς',
      body: () => '<b style="color:#15803D;">Η δωρεάν κλήση γνωριμίας μας κλείστηκε επιτυχώς! 🎉</b><br><br>Γνωριζόμαστε, μας λέτε τι κάνετε και τι θα θέλατε, και σας εξηγούμε πώς δουλεύουμε και σε πόσες μέρες θα δείτε την πρώτη εικόνα της ιστοσελίδας σας. Η κλήση διαρκεί περίπου 15 λεπτά.',
      tip: ['Τι να έχετε έτοιμο;', 'Τίποτα ιδιαίτερο. Αν έχετε ήδη κάτι online, π.χ. σελίδα στο Facebook ή μια παλιότερη ιστοσελίδα, παίρνουμε από εκεί όλες τις πληροφορίες. Αλλιώς, αρκεί μια απλή ιδέα για το τι θέλετε. Χρειαζόμαστε ελάχιστα και αναλαμβάνουμε εμείς όλα τα υπόλοιπα!'] },
    r24: { kicker: 'Υπενθύμιση', subject: (bk) => `Αύριο στις ${bk.time} · Η κλήση μας με την Advon Media`, title: (bk) => `Αύριο τα λέμε στις ${bk.time}`,
      body: (bk) => `Σας θυμίζουμε ότι <b>αύριο, ${esc(dayLabel(bk.day))} στις ${esc(bk.time)}</b>, έχουμε τη δωρεάν κλήση γνωριμίας μας (περίπου 10–15 λεπτά).` },
    r1: { kicker: 'Σε 1 ώρα', subject: (bk) => `Σε 1 ώρα · Η κλήση μας στις ${bk.time}`, title: 'Τα λέμε σε μία ώρα!',
      body: (bk) => (bk.how === 'tel' ? `Η κλήση μας είναι <b>σήμερα στις ${esc(bk.time)}</b>. Θα σας καλέσουμε στο ${esc(bk.phone)}.` : `Η κλήση μας ξεκινά <b>σήμερα στις ${esc(bk.time)}</b>. Πατήστε το κουμπί λίγο πριν την ώρα και θα μπείτε κατευθείαν στη βιντεοκλήση, όπου θα σας δείξουμε τη δική μας παρουσίαση.`) },
    x: { kicker: 'Ακύρωση', subject: (bk) => `Το ραντεβού ακυρώθηκε · ${dayLabel(bk.day)}, ${bk.time}`, title: 'Το ραντεβού ακυρώθηκε',
      body: 'Ακυρώσαμε το ραντεβού όπως ζητήσατε. Όποτε θέλετε, κλείστε μια νέα ώρα με ένα κλικ.' },
    m: { kicker: 'Νέα ώρα', subject: (bk) => `Νέα ώρα για το ραντεβού σας · ${dayLabel(bk.day)}, ${bk.time}`, title: 'Αλλάξαμε την ώρα',
      body: 'Το ραντεβού σας μεταφέρθηκε στη νέα ώρα που διαλέξατε.' },
    lab: { day: 'Ημέρα', time: 'Ώρα', how: 'Τρόπος', with: 'Με τον', tz: '(ώρα Ελλάδας)', meet: 'Google Meet · Βιντεοκλήση (με σύντομη παρουσίαση)', tel: (p) => `Σας καλούμε στο ${p}`, host: 'Άγγελο Μ. · Ιδρυτή της Advon Media' },
    btnAdd: 'Προσθήκη στο ημερολόγιο', btnMeet: 'Σύνδεση στη βιντεοκλήση', btnNew: 'Νέο ραντεβού',
    meetNote: 'Ο σύνδεσμος ανοίγει από υπολογιστή ή κινητό. Δεν χρειάζεται να κατεβάσετε τίποτα.',
    hold: 'Κρατήσαμε αυτή την ώρα αποκλειστικά για εσάς, καθώς οι διαθέσιμες ώρες μας είναι περιορισμένες. Σας παρακαλούμε να την προσθέσετε στο ημερολόγιό σας, κι αν κάτι αλλάξει, αλλάξτε την με ένα κλικ από το email σας.',
    bye: 'Τα λέμε σύντομα,', manage: 'Δεν σας βολεύει η ώρα;', change: 'Αλλαγή ώρας', cancel: 'Ακύρωση',
  },
  en: {
    hi: 'Hello,',
    c: { kicker: 'Confirmed', subject: (bk) => `Your call is successfully booked · ${dayLabel(bk.day, 'en')}, ${bk.time}`, title: 'Your call is successfully booked',
      body: () => '<b style="color:#15803D;">Our free intro call is successfully booked! 🎉</b><br><br>We get to know each other, you tell us what you do and what you would like, and we explain how we work and in how many days you will see the first version of your website. The call takes about 15 minutes.',
      tip: ['Anything to prepare?', 'Nothing special. If you already have something online, like a Facebook page or an older website, we take all the information from there. If not, a simple idea of what you want is enough. We need very little and we handle everything else!'] },
    r24: { kicker: 'Reminder', subject: (bk) => `Tomorrow at ${bk.time} · Our call with Advon Media`, title: (bk) => `See you tomorrow at ${bk.time}`,
      body: (bk) => `A reminder that <b>tomorrow, ${esc(dayLabel(bk.day, 'en'))} at ${esc(bk.time)}</b>, we have our free intro call (about 10–15 minutes).` },
    r1: { kicker: 'In 1 hour', subject: (bk) => `In 1 hour · Our call at ${bk.time}`, title: 'Talk to you in an hour!',
      body: (bk) => (bk.how === 'tel' ? `Our call is <b>today at ${esc(bk.time)}</b>. We will call you on ${esc(bk.phone)}.` : `Our call starts <b>today at ${esc(bk.time)}</b>. Press the button a little before and you join the video call, where we show you our own presentation.`) },
    x: { kicker: 'Cancelled', subject: (bk) => `Your call was cancelled · ${dayLabel(bk.day, 'en')}, ${bk.time}`, title: 'Your call was cancelled',
      body: 'We cancelled the call as you asked. Book a new time whenever you like.' },
    m: { kicker: 'New time', subject: (bk) => `New time for your call · ${dayLabel(bk.day, 'en')}, ${bk.time}`, title: 'Your call has a new time',
      body: 'Your call has been moved to the new time you chose.' },
    lab: { day: 'Day', time: 'Time', how: 'How', with: 'With', tz: '(Greece time)', meet: 'Google Meet · Video call (with a short presentation)', tel: (p) => `We call you on ${p}`, host: 'Angelo M. · Founder of Advon Media' },
    btnAdd: 'Add to calendar', btnMeet: 'Join the video call', btnNew: 'Book a new time',
    meetNote: 'The link opens on a computer or phone. Nothing to download.',
    hold: 'We have reserved this time just for you, as our available times are limited. Please add it to your calendar, and if anything changes, move it with one click from your email.',
    bye: 'Talk soon,', manage: 'Time no longer works?', change: 'Change time', cancel: 'Cancel',
  },
};

// kind: 'c' confirmation · 'r24' · 'r1' · 'x' cancelled · 'm' moved
// Greek capitals never carry accents (Επιβεβαιώθηκε → ΕΠΙΒΕΒΑΙΩΘΗΚΕ), whatever the mail client does with text-transform.
const UP = (x) => String(x).toLocaleUpperCase('el').normalize('NFD').replace(/\u0301/g, '').normalize('NFC');

export function bookingMail(kind, bk, base = 'https://advonmedia.com') {
  const L = bk.lang === 'en' ? 'en' : 'el';
  const t = TX[L], k = t[kind];
  const B = base.replace(/\/$/, '');
  const img = (f) => `https://advonmedia.com/img/email/${f}`;
  const manage = `${B}/rantevou/?b=${manageToken(bk.id)}`;
  const F = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;";
  const INK = '#0E1621', MUTED = '#5B6270', LINE = '#E4E9F0', BLUE = '#1C6FD8', CYAN = '#47C8F5';
  const P = `${F}margin:0 0 12px;font-size:15px;line-height:1.65;color:#3B4757;`;
  const title = typeof k.title === 'function' ? k.title(bk) : k.title;
  const body = typeof k.body === 'function' ? k.body(bk) : esc(k.body);
  const row = (l, v, c = INK) => `<tr><td style="${F}padding:11px 0;border-top:1px solid #EEF2F6;font-size:13px;color:#6B7686;width:92px;vertical-align:top;">${esc(l)}</td><td style="${F}padding:11px 0;border-top:1px solid #EEF2F6;font-size:15px;color:${c};font-weight:700;">${v}</td></tr>`;
  const details = kind === 'x' ? '' : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 6px;border-collapse:collapse;">
    ${row(t.lab.day, esc(dayLabel(bk.day, L, true)), BLUE)}
    ${row(t.lab.time, `${esc(bk.time)} – ${esc(endTime(bk.time))} <span style="font-weight:500;color:#6B7686;">${esc(t.lab.tz)}</span>`, BLUE)}
    ${row(t.lab.how, esc(bk.how === 'tel' ? t.lab.tel(bk.phone) : t.lab.meet), BLUE)}
    ${row(t.lab.with, esc(t.lab.host))}</table>`;
  const button = (label, href) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0 4px;"><tr><td style="border-radius:999px;background-color:${BLUE};background-image:linear-gradient(100deg,${BLUE},#2AA8EE);"><a href="${href}" style="${F}display:inline-block;padding:14px 28px;font-size:15px;font-weight:800;color:#FFFFFF;text-decoration:none;border-radius:999px;">${esc(label)}</a></td></tr></table>`;
  let cta = '';
  if (kind === 'c' || kind === 'm') cta = `<p style="${F}margin:18px 0 0;font-size:14.5px;line-height:1.6;color:#3B4757;padding:14px 16px;border-left:4px solid #F59E0B;background:#FFF8EB;border-radius:10px;">📌 ${esc(t.hold)}</p>` + button(t.btnAdd, gcalAddUrl(bk, L));
  if ((kind === 'r24' || kind === 'r1') && bk.how !== 'tel' && bk.meet) cta = button(t.btnMeet, bk.meet) + `<p style="${F}margin:12px 0 0;font-size:13.5px;color:${MUTED};">${esc(t.meetNote)}</p>`;
  if (kind === 'x') cta = button(t.btnNew, `${B}/rantevou/`);
  const tip = kind === 'c' ? `<p style="${F}margin:18px 0 0;font-size:14px;color:#3B4757;line-height:1.6;padding:14px 16px;background:#E8F5FD;border-radius:12px;"><b style="color:#1559B3;">${esc(t.c.tip[0])}</b> ${esc(t.c.tip[1])}</p>` : '';
  const foot = kind === 'x' ? '' : `${esc(t.manage)} <a href="${manage}" style="color:${BLUE};font-weight:700;">${esc(t.change)}</a> · <a href="${manage}&a=cancel" style="color:${BLUE};font-weight:700;">${esc(t.cancel)}</a><br>`;
  const html = `<!doctype html><html lang="${L}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${esc(k.subject(bk))}</title></head>
<body style="margin:0;padding:0;background:#F3F6FA;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F6FA;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid ${LINE};">
  <tr><td style="padding:0;line-height:0;font-size:0;"><a href="https://advonmedia.com"><img src="${img('header.png')}" width="560" alt="Advon Media" style="display:block;width:100%;max-width:560px;height:auto;border:0;"></a></td></tr>
  <tr><td style="padding:28px 28px 6px;${F}">
    ${(kind === 'c' || kind === 'm') ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 12px;"><tr><td style="width:40px;height:40px;border-radius:20px;background-color:#16A34A;background-image:linear-gradient(135deg,#16A34A,#22C55E);text-align:center;vertical-align:middle;${F}font-size:22px;line-height:40px;color:#FFFFFF;font-weight:800;">&#10003;</td><td style="padding-left:10px;${F}font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#15803D;font-weight:800;">${esc(UP(k.kicker))}</td></tr></table>` : `<p style="${F}margin:0 0 6px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${BLUE};font-weight:800;">${esc(UP(k.kicker))}</p>`}
    ${kind === 'c' ? '' : `<h1 style="${F}margin:0 0 14px;font-size:24px;line-height:1.25;color:${INK};font-weight:800;">${esc(title)}</h1>`}
    <p style="${P}">${esc(t.hi)}</p>
    <p style="${P}">${body}</p>
    ${details}${cta}${tip}
  </td></tr>
  <tr><td style="padding:22px 28px 24px;${F}">
    <p style="${F}margin:0 0 4px;font-size:14px;color:#3B4757;">${esc(t.bye)}</p>
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td valign="middle" style="padding-right:12px;"><img src="${img('mark.png')}" width="22" alt="" style="display:block;width:22px;height:auto;border:0;"></td>
      <td valign="middle" style="${F}font-size:14px;line-height:1.5;color:${INK};border-left:1px solid ${LINE};padding-left:12px;"><b>${L === 'en' ? 'Angelo' : 'Άγγελος'}</b> – <b style="color:${BLUE};">Advon Media</b></td></tr></table>
  </td></tr>
  <tr><td style="height:3px;line-height:3px;font-size:0;background-color:${BLUE};background-image:linear-gradient(90deg,${BLUE},${CYAN},#8BE0FC);">&nbsp;</td></tr>
  <tr><td style="padding:14px 28px 18px;${F}font-size:12.5px;line-height:1.6;color:#6B7686;background:#F7F9FC;">${foot}Advon Media · <a href="https://advonmedia.com" style="color:#6B7686;">advonmedia.com</a></td></tr>
</table></td></tr></table></body></html>`;
  const plain = [t.hi, '', body.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, ''), '',
    kind === 'x' ? '' : `${t.lab.day}: ${dayLabel(bk.day, L, true)}\n${t.lab.time}: ${bk.time} – ${endTime(bk.time)} ${t.lab.tz}\n${t.lab.how}: ${bk.how === 'tel' ? t.lab.tel(bk.phone) : t.lab.meet}${bk.how !== 'tel' && bk.meet ? '\nGoogle Meet: ' + bk.meet : ''}`,
    '', kind === 'x' ? `${t.btnNew}: ${B}/rantevou/` : `${t.manage} ${manage}`, '', t.bye, `${L === 'en' ? 'Angelo' : 'Άγγελος'} – Advon Media`].join('\n');
  return { subject: k.subject(bk), html, text: plain };
}

export async function sendBookingMail(kind, bk, base) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, why: 'no_resend_key' };
  const m = bookingMail(kind, bk, base);
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.BOOKING_FROM || 'Άγγελος – Advon Media <rantevou@advonmedia.com>',
        to: [bk.email], reply_to: process.env.CHAT_REPLY_TO || 'advonmd@gmail.com',
        subject: m.subject, html: m.html, text: m.text,
      }),
    });
    if (r.ok) return { ok: true };
    let msg = ''; try { msg = (await r.json()).message || ''; } catch {}
    return { ok: false, why: `resend ${r.status} ${msg}`.trim() };
  } catch (e) { return { ok: false, why: e.message }; }
}

// Which reminder is due now for a booking (or null). Runs every 10 minutes.
export function dueReminder(bk, now = Date.now()) {
  if (bk.status !== 'confirmed' || !bk.email) return null;
  const s = athensToDate(bk.day, bk.time).getTime();
  if (now >= s) return null;
  const sent = bk.sent || {};
  if (!sent.r1 && now >= s - 60 * 60000) return 'r1';
  // only one reminder, 1 hour before (Angelo, 20 Nov 2026) — no day-before e-mail
  return null;
}

// ---------------------------------------------------------------------------------------------
// E-mail to Angelo for every booking (new / moved / cancelled) — 20 Nov 2026.
// Goes to BOOKING_NOTIFY_TO (default advonmd@gmail.com); «Reply» answers the client directly.
const NOTIFY_TO = () => process.env.BOOKING_NOTIFY_TO || 'advonmd@gmail.com';
const telHref = (p) => { let d = String(p || '').replace(/[^\d+]/g, ''); if (/^(69|2)\d{8}$/.test(d)) d = '+30' + d; else if (/^30\d{10}$/.test(d)) d = '+' + d; return d; };
const weekStart = (day) => { const d = new Date(day + 'T12:00:00Z'); const w = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - w); return d.toISOString().slice(0, 10); };

export function bookingStats(items, now = Date.now()) {
  const live = (items || []).filter((x) => x.status === 'confirmed');
  const today = todayAthens(), ws = weekStart(today);
  const cday = (x) => (x.created ? athensParts(new Date(x.created)).day : '');
  const madeToday = (items || []).filter((x) => cday(x) === today).length;
  const madeWeek = (items || []).filter((x) => x.created && weekStart(cday(x)) === ws).length;
  const upcoming = live.filter((x) => athensToDate(x.day, x.time).getTime() > now).length;
  return { madeToday, madeWeek, upcoming };
}

export function ownerMail(kind, bk, opt = {}) {
  const F = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;";
  const INK = '#0E1621', MUTED = '#6B7686', BLUE = '#1C6FD8', GREEN = '#16A34A';
  const st = opt.stats || {};
  const head = {
    new: { bg: 'linear-gradient(135deg,#0F9F4F 0%,#16A34A 45%,#22C55E 100%)', solid: GREEN, kick: '🎉  NEW BOOKING', title: `${bk.name} booked a call!` },
    moved: { bg: 'linear-gradient(135deg,#1559B3,#1C6FD8 55%,#2AA8EE)', solid: BLUE, kick: '🔁  BOOKING MOVED', title: `${bk.name} moved the call` },
    cancelled: { bg: 'linear-gradient(135deg,#4B5563,#6B7280)', solid: '#6B7280', kick: '✖  BOOKING CANCELLED', title: `${bk.name} cancelled` },
  }[kind];
  const when = `${dayLabel(bk.day, 'el', true)}`;
  const how = bk.how === 'tel' ? '📞 Phone call — you call them' : '🎥 Google Meet video call';
  const tel = telHref(bk.phone), viber = `viber://chat?number=${encodeURIComponent(tel)}`;
  const cal = `https://calendar.google.com/calendar/r/day/${bk.day.replace(/-/g, '/')}`;
  const pill = (txt, bg, fg) => `<td style="padding:0 6px 6px 0;"><span style="${F}display:inline-block;padding:7px 12px;border-radius:999px;background:${bg};color:${fg};font-size:13px;font-weight:800;">${txt}</span></td>`;
  const stats = kind === 'new' ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0 0;"><tr>
      ${pill(`🔥 #${st.madeWeek || 1} this week`, '#FEF3C7', '#92400E')}${pill(`${st.madeToday || 1} today`, '#DCFCE7', '#166534')}${pill(`${st.upcoming || 1} calls coming up`, '#E0EDFF', '#1559B3')}</tr></table>` : '';
  const row = (l, v) => v ? `<tr><td style="${F}padding:12px 0;border-top:1px solid #EEF2F6;font-size:13px;color:${MUTED};width:110px;vertical-align:top;">${l}</td><td style="${F}padding:12px 0;border-top:1px solid #EEF2F6;font-size:15.5px;color:${INK};font-weight:700;line-height:1.45;">${v}</td></tr>` : '';
  const btn = (label, href, bg) => `<td style="padding:0 8px 8px 0;"><a href="${href}" style="${F}display:inline-block;padding:12px 18px;border-radius:12px;background:${bg};color:#fff;font-size:14px;font-weight:800;text-decoration:none;">${label}</a></td>`;
  const moved = kind === 'moved' && opt.old ? `<p style="${F}margin:14px 0 0;font-size:14px;color:rgba(255,255,255,.85);">was <s>${esc(dayLabel(opt.old.day, 'el'))} ${esc(opt.old.time)}</s></p>` : '';
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head>
<body style="margin:0;padding:0;background:#EEF2F7;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2F7;"><tr><td align="center" style="padding:22px 10px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #E4E9F0;">
  <tr><td style="padding:28px 26px 26px;background-color:${head.solid};background-image:${head.bg};${F}">
    <p style="${F}margin:0 0 10px;font-size:12.5px;letter-spacing:.12em;color:rgba(255,255,255,.9);font-weight:800;">${head.kick}</p>
    <h1 style="${F}margin:0;font-size:26px;line-height:1.2;color:#FFFFFF;font-weight:800;">${esc(head.title)}</h1>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:18px 0 0;background:rgba(255,255,255,.16);border-radius:14px;"><tr><td style="padding:14px 18px;${F}">
      <p style="${F}margin:0;font-size:14px;color:rgba(255,255,255,.88);font-weight:600;">${esc(when)}</p>
      <p style="${F}margin:4px 0 0;font-size:30px;line-height:1.1;color:#FFFFFF;font-weight:800;letter-spacing:-.01em;">${esc(bk.time)} – ${esc(endTime(bk.time))}</p>
      <p style="${F}margin:8px 0 0;font-size:14px;color:#FFFFFF;font-weight:700;">${how}</p></td></tr></table>${moved}
  </td></tr>
  <tr><td style="padding:22px 26px 6px;${F}">
    ${stats}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 4px;border-collapse:collapse;">
      ${row('Name', esc(bk.name))}
      ${row('Phone', `<a href="tel:${esc(tel)}" style="color:${BLUE};text-decoration:none;">${esc(bk.phone)}</a>`)}
      ${row('E-mail', `<a href="mailto:${esc(bk.email)}" style="color:${BLUE};text-decoration:none;">${esc(bk.email)}</a>`)}
      ${row('Business', esc(bk.job || '—'))}
      ${row('Message', bk.msg ? `<span style="font-weight:500;font-style:italic;color:#3B4757;">«${esc(bk.msg)}»</span>` : '')}
      ${row('Came from', bk.src === 'meta' ? '<span style="color:#1559B3;">Meta ad (Facebook / Instagram)</span>' : (bk.src ? esc(bk.src) : 'Website'))}
      ${row('Language', bk.lang === 'en' ? 'English' : 'Ελληνικά')}
      ${row('Booking', `<span style="color:${MUTED};font-weight:600;">${esc(bk.ref || '')}</span>`)}
    </table>
    ${kind === 'cancelled' ? `<p style="${F}margin:12px 0 18px;font-size:14px;color:#3B4757;">The time is free again in your calendar.</p>` : `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:14px 0 0;"><tr>
      ${btn('📞 Call', `tel:${tel}`, GREEN)}${btn('💬 Viber', viber, '#7360F2')}${bk.how !== 'tel' && bk.meet ? btn('🎥 Google Meet', esc(bk.meet), BLUE) : ''}</tr></table><table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;"><tr>
      ${btn('📅 Calendar', cal, '#0E1621')}${btn('CRM', 'https://crm.advonmedia.com/', '#475569')}</tr></table>`}
  </td></tr>
  <tr><td style="height:4px;line-height:4px;font-size:0;background-color:${BLUE};background-image:linear-gradient(90deg,#1C6FD8,#47C8F5,#8BE0FC);">&nbsp;</td></tr>
  <tr><td style="padding:14px 26px 18px;${F}font-size:12.5px;line-height:1.6;color:${MUTED};background:#F7F9FC;">Reply to this e-mail to write to ${esc(bk.name)} directly · Advon booking page</td></tr>
</table></td></tr></table></body></html>`;
  const subject = { new: `🎉 New booking · ${bk.name} · ${dayLabel(bk.day)} ${bk.time}`, moved: `🔁 Moved · ${bk.name} → ${dayLabel(bk.day)} ${bk.time}`, cancelled: `✖ Cancelled · ${bk.name} · ${dayLabel(bk.day)} ${bk.time}` }[kind];
  const text = [head.title, `${when} ${bk.time}–${endTime(bk.time)}`, how, '', `Name: ${bk.name}`, `Phone: ${bk.phone}`, `E-mail: ${bk.email}`, bk.job ? `Business: ${bk.job}` : '', bk.msg ? `Message: ${bk.msg}` : '', bk.meet ? `Meet: ${bk.meet}` : ''].filter(Boolean).join('\n');
  return { subject, html, text };
}

export async function sendOwnerMail(kind, bk, opt = {}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, why: 'no_resend_key' };
  const m = ownerMail(kind, bk, opt);
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'Advon Booking <rantevou@advonmedia.com>', to: [NOTIFY_TO()], reply_to: bk.email || undefined, subject: m.subject, html: m.html, text: m.text }),
    });
    return r.ok ? { ok: true } : { ok: false, why: `resend ${r.status}` };
  } catch (e) { return { ok: false, why: e.message }; }
}
