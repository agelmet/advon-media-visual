// lib/startorder.js — «Ξεκινάμε τώρα» (no-call start), 21 Nov 2026.
//
// The page /ksekinima/ lets a person who is already sure start their website without a meeting:
// video → details → material → options → card payment (Angelo, 21 Nov 2026: they pay right there through the
// Stripe of the Advon shop; he absorbs Stripe's fee — 161,20 €, +62 € with express). The material is saved
// BEFORE the payment, so a person who never pays is not lost (Board «Need info» + the material in the CRM).
// The payment itself is made by advonshop.netlify.app/api/start-checkout (fixed prices on that server);
// /api/intake?confirm=1 asks the shop whether the order is paid before marking anything paid.
//
// It reuses /api/intake (files become loose blobs, ONE commit at the end). This file adds:
//   • cleanStart()   — validates the contact + options sent by the page
//   • boardEntry()   — a card for the CRM Board via the inbox leads/lists.json → lists._crm.board2
//                      (step 1 → «Need info» so Angelo can call if they stop; finished → «Building»)
//   • startText()    — the Telegram / e-mail line Angelo gets
//   • confirmMail()  — the e-mail the client gets after sending (plain, his voice, no bank details)
//
// Prices shown here must match the page and advonmedia.com.

export const EXTRAS = {
  admin: { el: 'Πίνακας διαχείρισης (admin panel)', price: 180, once: true },
  form: { el: 'Φόρμα επικοινωνίας', price: 50, once: true },
  articles: { el: 'Ενότητα άρθρων', price: 70, once: true },
  gbp: { el: 'Google Business Profile', price: 90, once: true },
};
export const SOCIAL = { s49: { el: 'Social media · Βασικό', price: 49 }, s79: { el: 'Social media · Ανάπτυξη', price: 79 }, s99: { el: 'Social media · Pro', price: 99 } };
export const EXPRESS_PRICE = 50;
export const HOSTING = 130;

const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
const digits = (v) => String(v || '').replace(/\D/g, '');

export function cleanStart(body) {
  const c = body && typeof body.contact === 'object' ? body.contact : {};
  const o = body && typeof body.options === 'object' ? body.options : {};
  const contact = {
    name: clean(c.name, 90),
    phone: clean(c.phone, 30),
    email: clean(c.email, 120).toLowerCase(),
    job: clean(c.job, 90),
    area: clean(c.area, 90),
  };
  const errors = [];
  if (contact.name.length < 3) errors.push('name');
  const ph = digits(contact.phone);
  if (ph.length < 10 || ph.length > 14) errors.push('phone');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact.email)) errors.push('email');
  if (contact.job.length < 2) errors.push('job');
  const options = {
    express: !!o.express,
    extras: (Array.isArray(o.extras) ? o.extras : []).filter((k) => EXTRAS[k]).slice(0, 6),
    social: SOCIAL[o.social] ? o.social : '',
    domain: clean(o.domain, 80),
    nothing: !!o.nothing,          // «Δεν έχω υλικό — ξεκινήστε με ό,τι βρείτε»
    more: !!o.more,                // «θα στείλω κι άλλα αργότερα»
    links: clean(o.links, 600),
    afm: digits(o.afm).slice(0, 9),
    eponymia: clean(o.eponymia, 120),
    addr: clean(o.addr, 160),
    source: clean(o.source, 60),
  };
  return { contact, options, errors };
}

const lastWord = (n) => (String(n || '').trim().split(/\s+/).pop() || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

/** the first-year value we put on the Board card (+ΦΠΑ is never included in CRM values) */
export function value(options) {
  return HOSTING + (options.express ? EXPRESS_PRICE : 0);
}

const HEAD = {
  s: '🟡 Ξεκινάμε τώρα — συμπλήρωσε στοιχεία αλλά ΔΕΝ ολοκλήρωσε ακόμα: πάρε τηλέφωνο αν δεν έρθει «ΠΛΗΡΩΣΕ»',
  u: '🟠 Ξεκινάμε τώρα — έστειλε υλικό και πήγε στην πληρωμή, ΔΕΝ έχει πληρώσει ακόμα: πάρε τηλέφωνο αν δεν έρθει «ΠΛΗΡΩΣΕ»',
  d: '💳 Ξεκινάμε τώρα (χωρίς ραντεβού) — ΠΛΗΡΩΣΕ με κάρτα',
};
export function boardEntry(id, stepTag, contact, options, extraNote = '') {
  const done = stepTag === 'd';
  const bits = [
    HEAD[stepTag] || HEAD.s,
    contact.job && `Επάγγελμα: ${contact.job}`,
    contact.area && `Περιοχή: ${contact.area}`,
    options.express && `⚡ EXPRESS +${EXPRESS_PRICE}€ — πρώτο σχέδιο σε 1–2 εργάσιμες, κλήση την ίδια μέρα`,
    options.domain && `Domain: ${options.domain}`,
    options.extras.length && `Θέλει επίσης: ${options.extras.map((k) => EXTRAS[k].el).join(', ')}`,
    options.social && `Social: ${SOCIAL[options.social].el} (${SOCIAL[options.social].price}€/μήνα)`,
    extraNote,
    `Υλικό: CRM → Home → Client material (${id})`,
  ].filter(Boolean);
  return {
    id: `ks-${id}-${stepTag}`,
    name: `${lastWord(contact.name)} · ${contact.job || 'ιστοσελίδα'}`.slice(0, 80),
    phone: digits(contact.phone).slice(-10),
    email: contact.email,
    stage: done ? 'building' : 'needinfo',   // paid → straight to «Building» so the work is not forgotten (the note says it is paid)
    value: value(options),
    valueSet: done,
    notes: bits.join('\n'),
  };
}

export function startText(kind, id, contact, options, files = 0, note = '') {
  if (kind === 'started') {
    return `🟡 Ξεκινάμε τώρα — ${contact.name} μόλις ξεκίνησε τη φόρμα\n${contact.job}${contact.area ? ' · ' + contact.area : ''}\n☎ ${contact.phone}\n✉ ${contact.email}\nΑν δεν έρθει «ΕΣΤΕΙΛΕ» σε λίγο, πάρ' τον τηλέφωνο.\n${id}`;
  }
  const L = [
    `${options.express ? '⚡💳 EXPRESS · ' : '💳 '}ΠΛΗΡΩΣΕ ${options.express ? '223,20€' : '161,20€'} — νέα ιστοσελίδα χωρίς ραντεβού: ${contact.name}`,
    `${contact.job}${contact.area ? ' · ' + contact.area : ''}`,
    `☎ ${contact.phone}  ✉ ${contact.email}`,
    `${files} αρχεία${options.links ? ' · links: ' + options.links.slice(0, 160) : ''}${options.nothing ? ' · δεν έχει υλικό — πάρε από τα προφίλ του' : ''}`,
    options.express && `Express: πρώτο σχέδιο σε 1–2 εργάσιμες + κλήση ΣΗΜΕΡΑ`,
    options.domain && `Domain: ${options.domain}`,
    options.extras.length && `Θέλει επίσης: ${options.extras.map((k) => EXTRAS[k].el).join(', ')}`,
    options.social && `Social: ${SOCIAL[options.social].el}`,
    note && `Οδηγίες: ${note.slice(0, 300)}`,
    `Κάρτα στο Board (Building, πληρωμένη) + υλικό στο CRM. Ξεκίνα το πρώτο σχέδιο. ${id}`,
  ].filter(Boolean);
  return L.join('\n');
}

const esc = (s) => String(s || '').replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));

/** The client's e-mail after sending. Plain, warm, his voice; no bank details (payment comes with the first draft). */
export function confirmMail(contact, options, files) {
  const greek = (h) => (h < 12 ? 'Καλημέρα σας' : 'Καλησπέρα σας');
  const hr = +new Date().toLocaleString('en-GB', { timeZone: 'Europe/Athens', hour: '2-digit', hour12: false });
  const when = options.express ? '1–2 εργάσιμες ημέρες' : '2–7 ημέρες';
  const lines = [
    `${greek(hr)},`,
    '',
    'λάβαμε όλα τα στοιχεία σας και την πληρωμή σας, και ξεκινάμε την ιστοσελίδα σας. Σας ευχαριστούμε πολύ για την εμπιστοσύνη!',
    '',
    'Τι γίνεται τώρα:',
    `1. ${options.express ? 'Σας καλούμε σήμερα για μια σύντομη επιβεβαίωση και ξεκινάμε αμέσως.' : 'Ξεκινάμε με όσα μας στείλατε. Αν χρειαστούμε κάτι, θα σας γράψουμε ή θα σας πάρουμε τηλέφωνο.'}`,
    `2. Σε ${when} σας στέλνουμε το πρώτο σχέδιο της ιστοσελίδας σας.`,
    '3. Μας λέτε ό,τι αλλαγές θέλετε — όσες φορές χρειαστεί — μέχρι να γίνει ακριβώς όπως τη φανταστήκατε.',
    '4. Τη βγάζουμε online με το δικό σας domain.',
    '',
    `Λάβαμε την πληρωμή σας (${options.express ? '223,20€: φιλοξενία & domain για τον πρώτο χρόνο και express παράδοση' : '161,20€: φιλοξενία & domain για τον πρώτο χρόνο'}). Οι 365 ημέρες μετράνε από τη μέρα που η ιστοσελίδα σας βγαίνει online. Το παραστατικό θα σας σταλεί στο e-mail σας.`,
    '',
    options.more || options.nothing || !files
      ? 'Αν θυμηθείτε κάτι ή θέλετε να στείλετε κι άλλες φωτογραφίες, απλώς απαντήστε σε αυτό το e-mail ή ανεβάστε τα εδώ: https://advonmedia.com/ylika'
      : 'Αν θυμηθείτε κάτι ακόμα, απλώς απαντήστε σε αυτό το e-mail.',
    '',
    'Καλή συνέχεια,',
    'Άγγελος Μετρίδης',
    'Advon Media · advonmedia.com',
  ];
  const text = lines.join('\n');
  const html = `<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;font-size:15px;line-height:1.6;color:#0E1621;max-width:560px">${lines
    .map((l) => (l === '' ? '<br>' : /^\d\./.test(l) ? `<div style="margin:2px 0 2px 4px">${esc(l)}</div>` : `<div>${esc(l).replace(/(https:\/\/advonmedia\.com\/ylika)/, '<a href="$1" style="color:#1C6FD8">$1</a>')}</div>`))
    .join('')}</div>`;
  return { subject: 'Ξεκινάμε την ιστοσελίδα σας – Advon Media', text, html };
}
