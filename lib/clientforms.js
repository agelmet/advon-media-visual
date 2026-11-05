// lib/clientforms.js — which client sites may send a form through advonmedia.com, and to whom (5 Nov 2026)
//
// One shared relay (/api/form) for every client site that bought a form / quiz: the visitor's browser posts the
// answers, the server e-mails them through Resend from forms@advonmedia.com to the client's OWN address.
// The recipient is NEVER taken from the request — only from this list — so the endpoint can't be used to send
// mail to anyone else. A new client = one entry here (+ one advonmedia.com deploy).
//
//   id        what the page sends as `site`
//   to        the client's inbox (array allowed)
//   name      shown as the sender name and in the subject
//   origins   the client's live domain(s); drafts.advonmedia.com/<REPO>/ is always allowed for drafts
//   repo      the drafts path, for the «Σελίδα» line
//   bcc       optional copy (e.g. Angelo while testing)

export const CLIENT_FORMS = {
  lamprou: {
    to: ['lamprou.eye@gmail.com'],
    name: 'Δρ. Λάμπρος Λάμπρου',
    origins: [],                       // add the live domain when it is bought, e.g. 'https://lamprou-ofthalmiatros.gr'
    repo: 'LAMPROU',
  },
};

const DRAFTS = 'https://drafts.advonmedia.com';
const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export function formSite(id) {
  const k = String(id || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
  return Object.prototype.hasOwnProperty.call(CLIENT_FORMS, k) ? { id: k, ...CLIENT_FORMS[k] } : null;
}

// Is this browser origin allowed to post for that site? (no Origin header = not a browser → not allowed)
export function originOk(site, origin) {
  if (!site || !origin) return false;
  if (origin === DRAFTS) return true;
  if (process.env.NODE_ENV !== 'production' && LOCAL.test(origin)) return true;
  return (site.origins || []).some((o) => o === origin || o.replace('https://', 'https://www.') === origin);
}

// Any origin that belongs to some client (used for the CORS answer to the preflight, before the body is read)
export function anyClientOrigin(origin) {
  if (!origin) return false;
  if (origin === DRAFTS) return true;
  if (process.env.NODE_ENV !== 'production' && LOCAL.test(origin)) return true;
  return Object.values(CLIENT_FORMS).some((s) => originOk(s, origin));
}
