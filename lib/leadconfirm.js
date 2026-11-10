// lib/leadconfirm.js — the confirmation e-mail a person gets right after the free-website form
// (homepage contact form, /istoselida, /dorean). Angelo, 10 Nov 2026: one e-mail that works whether or not
// they also booked a time on Zoho (Zoho sends its own confirmation with the time) — who we are, what happens
// next, the booking link, the price in plain words, proof (reviews + 3 sites), his signature.
// Plain and calm: no urgency lines, no emojis, no bank details (payment comes with the first draft).
// Images are served from the same host that handled the form (advonmedia.com live, the branch URL in tests).

export const BOOK_URL = 'https://advonmedia.zohobookings.eu/#/264312000000038046';
const REVIEWS_URL = 'https://g.co/kgs/wXBAZWP';
const PORTFOLIO_URL = 'https://advonmedia.com/kataskevi-istoselidas#portfolio';
const SITES = [
  { img: 'allsmiles.jpg', url: 'https://allsmiles.gr', el: 'Άννα Στριγκόνη, Οδοντίατρος', en: 'Anna Strigkoni, Dentist' },
  { img: 'dentalphilosophy.jpg', url: 'https://dentalphilosophy.gr', el: 'Dental Philosophy, Οδοντίατροι', en: 'Dental Philosophy, Dentists' },
  { img: 'salakou.jpg', url: 'https://georgia-salakou-psychologist.gr', el: 'Γεωργία Σαλάκου, Ψυχολόγος', en: 'Georgia Salakou, Psychologist' },
];

const T = {
  el: {
    subject: 'Λάβαμε τα στοιχεία σας – Advon Media',
    pre: 'Τι γίνεται μετά, το κόστος με απλά λόγια και πώς κλείνετε ώρα για τη δωρεάν κλήση.',
    hi: (h) => (h < 12 ? 'Καλημέρα σας,' : 'Καλησπέρα σας,'),
    thanks: 'Λάβαμε τα στοιχεία σας για τη δωρεάν ιστοσελίδα και θα επικοινωνήσουμε μαζί σας εντός 24 ωρών. Σας ευχαριστούμε πολύ!',
    nextH: 'Τι γίνεται μετά',
    steps: [
      ['Μια σύντομη δωρεάν κλήση,', 'τηλεφωνικά ή online μέσω Google Meet (περίπου 15 λεπτά). Γνωριζόμαστε και μας λέτε τι θέλετε από την ιστοσελίδα σας.'],
      ['Μας στέλνετε ό,τι έχετε:', 'φωτογραφίες, λογότυπο ή κάρτα. Αν δεν έχετε κάτι, μας γράφετε πολύ απλά, σε λίγα κείμενα, τι θέλετε να περιέχει.'],
      ['Σε 4–10 ημέρες βλέπετε την ιστοσελίδα σας.', 'Κάνουμε όσες αλλαγές θέλετε, μέχρι να είναι όπως την φανταστήκατε.'],
    ],
    callH: 'Για την κλήση',
    booked: 'Αν κλείσατε ήδη ώρα, θα λάβετε ξεχωριστή επιβεβαίωση με την ημέρα και την ώρα.',
    notYet: 'Αν όχι, μπορείτε να διαλέξετε μία εδώ:',
    btn: 'Κλείστε ώρα για την κλήση',
    orCall: 'ή θα σας καλέσουμε εμείς μέσα στις επόμενες 24 ώρες.',
    costH: 'Το κόστος, με απλά λόγια',
    cost: [
      ['Κατασκευή ιστοσελίδας: ', '0€', '. Την κατασκευή δεν τη χρεώνουμε.'],
      ['Πληρώνετε μόνο τη φιλοξενία και το domain: ', '130€ + ΦΠΑ τον χρόνο', ', σε μία πληρωμή για όλο τον χρόνο (όχι κάθε μήνα).'],
      ['Το domain (π.χ. epitheto-epaggelma.gr) περιλαμβάνεται.', '', ''],
      ['Χωρίς προκαταβολή.', '', ''],
      ['Απεριόριστες αλλαγές μέχρι να βγει online.', '', ''],
    ],
    usH: 'Λίγα λόγια για εμάς',
    us: 'Έχουμε φτιάξει πάνω από 250 ιστοσελίδες για επαγγελματίες και επιχειρήσεις σε όλη την Ελλάδα, και έχουμε πάνω από 135 κριτικές στο Google, όλες 5 αστέρων.',
    portfolio: 'Δείτε τις ιστοσελίδες μας',
    reviews: 'Διαβάστε τις κριτικές μας στο Google',
    reply: 'Για οτιδήποτε, μπορείτε απλώς να απαντήσετε σε αυτό το e-mail.',
    bye: 'Με εκτίμηση,',
    name: 'Άγγελος Μετρίδης',
    tag: 'Ιστοσελίδες για επαγγελματίες και επιχειρήσεις σε όλη την Ελλάδα',
    foot: 'Λάβατε αυτό το e-mail επειδή συμπληρώσατε τη φόρμα στο advonmedia.com. Δεν θα σας στείλουμε διαφημιστικά e-mail.',
  },
  en: {
    subject: 'We received your details – Advon Media',
    pre: 'What happens next, the cost in plain words, and how to book your free call.',
    hi: () => 'Hello,',
    thanks: 'We received your details for the free website and we will contact you within 24 hours. Thank you very much!',
    nextH: 'What happens next',
    steps: [
      ['A short free call,', 'by phone or online on Google Meet (about 15 minutes). We get to know each other and you tell us what you want from your website.'],
      ['You send us whatever you have:', 'photos, a logo or a business card. If you don’t have any, simply write us a few lines about what you want it to include.'],
      ['In 4–10 days you see your website.', 'We make as many changes as you like, until it is the way you pictured it.'],
    ],
    callH: 'About the call',
    booked: 'If you already booked a time, you will get a separate confirmation with the day and time.',
    notYet: 'If not, you can pick one here:',
    btn: 'Book a time for the call',
    orCall: 'or we will call you within the next 24 hours.',
    costH: 'The cost, in plain words',
    cost: [
      ['Building the website: ', '€0', '. We don’t charge for building it.'],
      ['You only pay for hosting and the domain: ', '€130 + VAT per year', ', in one payment for the whole year (not every month).'],
      ['The domain (e.g. yourname.gr) is included.', '', ''],
      ['No deposit.', '', ''],
      ['Unlimited changes until it goes online.', '', ''],
    ],
    usH: 'A few words about us',
    us: 'We have built more than 250 websites for professionals and businesses all over Greece, and we have more than 135 Google reviews, all 5 stars.',
    portfolio: 'See our websites',
    reviews: 'Read our Google reviews',
    reply: 'For anything at all, you can simply reply to this e-mail.',
    bye: 'Kind regards,',
    name: 'Angelos Metridis',
    tag: 'Websites for professionals and businesses all over Greece',
    foot: 'You received this e-mail because you filled in the form on advonmedia.com. We will not send you marketing e-mails.',
  },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function athensHour(d = new Date()) {
  try { return Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Athens', hour: '2-digit', hour12: false }).format(d)); } catch { return 15; }
}

export function buildLeadConfirm({ lang = 'el', base = 'https://advonmedia.com', now = new Date() } = {}) {
  const t = T[lang === 'en' ? 'en' : 'el'];
  const img = (f) => `${base.replace(/\/$/, '')}/img/email/${f}`;
  const INK = '#16181D', MUTED = '#5B6270', LINK = '#1C6FD8', LINE = '#E3EAF2', CYAN = '#47C8F5', BLUE = '#1C6FD8';
  const F = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;";
  const H = `${F}font-size:17px;line-height:1.35;font-weight:800;color:${INK};margin:0 0 12px;padding-left:11px;border-left:3px solid ${CYAN};`;
  const P = `${F}font-size:15px;line-height:1.6;color:${INK};margin:0 0 12px;`;

  const steps = t.steps.map((s, i) => `
      <tr><td valign="top" style="width:34px;padding:0 0 12px;">
        <div style="${F}width:24px;height:24px;line-height:24px;border-radius:12px;background-color:${BLUE};background-image:linear-gradient(135deg,${BLUE},${CYAN});color:#FFFFFF;font-size:13px;font-weight:800;text-align:center;">${i + 1}</div></td>
      <td valign="top" style="${F}font-size:15px;line-height:1.55;color:${INK};padding:1px 0 12px;"><b>${esc(s[0])}</b> ${esc(s[1])}</td></tr>`).join('');

  const cost = t.cost.map((c) => `
      <tr><td valign="top" style="width:20px;${F}font-size:15px;line-height:1.6;color:${CYAN};padding:0 0 6px;font-weight:800;">✓</td>
      <td valign="top" style="${F}font-size:15px;line-height:1.6;color:${INK};padding:0 0 6px;">${esc(c[0])}${c[1] ? `<b style="color:${c[1] === '0€' || c[1] === '€0' ? BLUE : INK};">${esc(c[1])}</b>` : ''}${esc(c[2])}</td></tr>`).join('');

  const sites = SITES.map((s) => `
      <td valign="top" width="33%" style="padding:0 4px;">
        <a href="${s.url}" style="text-decoration:none;"><img src="${img(s.img)}" width="176" alt="${esc(s[lang === 'en' ? 'en' : 'el'])}" style="display:block;width:100%;max-width:176px;height:auto;border:1px solid ${LINE};border-radius:6px;"></a>
        <div style="${F}font-size:11px;line-height:1.35;color:${MUTED};padding-top:6px;">${esc(s[lang === 'en' ? 'en' : 'el'])}</div></td>`).join('');

  const html = `<!doctype html>
<html lang="${lang === 'en' ? 'en' : 'el'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${esc(t.subject)}</title></head>
<body style="margin:0;padding:0;background:#EEF4F9;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(t.pre)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#EEF4F9;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid ${LINE};">
  <tr><td style="padding:0;line-height:0;font-size:0;"><a href="https://advonmedia.com"><img src="${img('header.png')}" width="600" alt="Advon Media" style="display:block;width:100%;max-width:600px;height:auto;border:0;"></a></td></tr>
  <tr><td style="padding:28px 28px 8px;">
    <p style="${P}">${esc(t.hi(athensHour(now)))}</p>
    <p style="${P}margin-bottom:24px;">${esc(t.thanks)}</p>

    <p style="${H}">${esc(t.nextH)}</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:14px;">${steps}</table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#EEF9FE;border:1px solid #BFE9FB;border-radius:12px;margin-bottom:26px;"><tr><td style="padding:18px 20px;">
      <p style="${H}">${esc(t.callH)}</p>
      <p style="${P}">${esc(t.booked)}</p>
      <p style="${P}margin-bottom:14px;">${esc(t.notYet)}</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-radius:999px;background-color:${BLUE};background-image:linear-gradient(100deg,${BLUE},#2AA8EE);">
        <a href="${BOOK_URL}" style="${F}display:inline-block;padding:13px 26px;font-size:15px;font-weight:800;color:#FFFFFF;text-decoration:none;border-radius:999px;">${esc(t.btn)}</a></td></tr></table>
      <p style="${P}margin:14px 0 0;color:${MUTED};">${esc(t.orCall)}</p>
    </td></tr></table>

    <p style="${H}">${esc(t.costH)}</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:22px;">${cost}</table>

    <p style="${H}">${esc(t.usH)}</p>
    <p style="${P}margin-bottom:16px;">${esc(t.us)}</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 -4px 14px;"><tr>${sites}</tr></table>
    <p style="${P}margin-bottom:6px;"><a href="${PORTFOLIO_URL}" style="color:${LINK};font-weight:700;text-decoration:none;">${esc(t.portfolio)} →</a></p>
    <p style="${P}margin-bottom:26px;"><a href="${REVIEWS_URL}" style="color:${LINK};font-weight:700;text-decoration:none;">${esc(t.reviews)} →</a></p>

    <p style="${P}">${esc(t.reply)}</p>
    <p style="${P}margin-bottom:4px;">${esc(t.bye)}</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 26px;"><tr>
      <td valign="middle" style="padding-right:12px;"><img src="${img('mark.png')}" width="25" alt="" style="display:block;width:25px;height:auto;border:0;"></td>
      <td valign="middle" style="${F}font-size:15px;line-height:1.5;color:${INK};border-left:1px solid ${LINE};padding-left:12px;"><b>${esc(t.name)}</b><br><b style="color:${BLUE};">Advon Media</b><br><a href="https://advonmedia.com" style="color:${LINK};text-decoration:none;">advonmedia.com</a></td></tr></table>
  </td></tr>
  <tr><td style="height:3px;line-height:3px;font-size:0;background-color:${BLUE};background-image:linear-gradient(90deg,${BLUE},#2AA8EE 42%,#8BE0FC 50%,#2AA8EE 58%,${BLUE});">&nbsp;</td></tr>
  <tr><td style="padding:14px 28px 18px;${F}font-size:11px;line-height:1.5;color:#8A909C;"><b style="color:${MUTED};">Advon Media</b> · ${esc(t.tag)}<br>${esc(t.foot)}</td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    t.hi(athensHour(now)), '', t.thanks, '',
    t.nextH.toUpperCase(), ...t.steps.map((s, i) => `${i + 1}. ${s[0]} ${s[1]}`), '',
    t.callH.toUpperCase(), t.booked, `${t.notYet} ${BOOK_URL}`, t.orCall, '',
    t.costH.toUpperCase(), ...t.cost.map((c) => `- ${c[0]}${c[1]}${c[2]}`), '',
    t.usH.toUpperCase(), t.us, `${t.portfolio}: ${PORTFOLIO_URL}`, `${t.reviews}: ${REVIEWS_URL}`, '',
    t.reply, '', t.bye, t.name, 'Advon Media', 'advonmedia.com', '', t.foot,
  ].join('\n');

  return { subject: t.subject, html, text };
}
