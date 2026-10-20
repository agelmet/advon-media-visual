// lib/antispam.js — keeps robots out of the forms and fake e-mails out of the booking calendar (20 Oct 2026)
//
// Two jobs, one secret:
//   1. FORMS (/api/lead): a signed «stamp» the page fetches when it opens (GET /api/lead?stamp=1). A message
//      without a valid stamp never came through the page; one sent less than 3 s after the stamp was typed
//      by a robot. Together with the hidden field, the phone check and the content check (links, foreign
//      script, spam phrases) everything that fails is answered «sent ✓» and filed in leads/spam.json — never
//      lost, never e-mailed, never in the CRM inbox.
//   2. BOOKING (/api/verify): a 6-digit code e-mailed through Resend. Stateless: the code is never stored —
//      the browser keeps a signed token that only matches the right code for that e-mail within 10 minutes.
//      A correct code returns a «verified» token (30 days) and files the e-mail in bookings/verified.json, so
//      the booking guard (netlify/functions/booking-guard.mjs) can tell a real booking from one made on the
//      bare Zoho link with an e-mail that was never confirmed.
//
// The signing key is derived from secrets that already exist in Netlify (FORM_STAMP_SECRET if it is ever set,
// otherwise CRM_AUTH_HASH / CRM_GH_TOKEN) — no new environment variable is needed.

import { createHmac, randomInt, timingSafeEqual, createHash } from 'node:crypto';

const KEY = () => {
  const base = process.env.FORM_STAMP_SECRET || process.env.CRM_AUTH_HASH || process.env.CRM_GH_TOKEN || '';
  return base ? createHash('sha256').update('advon-antispam|' + base).digest() : null;
};
export const antispamReady = () => !!KEY();

const b64u = (buf) => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = (s) => Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64');
const sign = (text) => b64u(createHmac('sha256', KEY()).update(text).digest()).slice(0, 32);
function sameSig(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

// ---------------- 1. the form stamp ----------------
export const STAMP_MIN_MS = 3000;            // faster than this = a robot
const STAMP_MAX_MS = 48 * 3600 * 1000;       // a page left open two days still works

export function makeStamp(now = Date.now()) {
  const ts = String(now);
  return `${ts}.${sign('stamp|' + ts)}`;
}
// → { ok, why, ageMs }
export function checkStamp(stamp, now = Date.now()) {
  if (!KEY()) return { ok: true, why: 'no-key', ageMs: null };      // never block real people because of a missing secret
  const s = String(stamp || '');
  const m = s.match(/^(\d{12,14})\.([A-Za-z0-9_-]{20,64})$/);
  if (!m) return { ok: false, why: s ? 'bad-stamp' : 'no-stamp', ageMs: null };
  if (!sameSig(m[2], sign('stamp|' + m[1]))) return { ok: false, why: 'forged-stamp', ageMs: null };
  const ageMs = now - Number(m[1]);
  if (ageMs < STAMP_MIN_MS) return { ok: false, why: 'too-fast', ageMs };
  if (ageMs > STAMP_MAX_MS) return { ok: false, why: 'old-stamp', ageMs };
  return { ok: true, why: '', ageMs };
}

// ---------------- phone ----------------
// Greek: mobile 69XXXXXXXX or landline 2XXXXXXXXX (10 digits). Anything else must be a real international
// number: «+» or «00», a country code, 8–15 digits in all. One digit repeated 7+ times = made up.
export function phoneVerdict(raw) {
  const s = String(raw || '').trim();
  let d = s.replace(/[^\d+]/g, '');
  if (!d.replace(/\+/g, '')) return { ok: false, e164: '' };
  if (d.startsWith('00')) d = '+' + d.slice(2);
  let e164;
  if (d.startsWith('+')) e164 = '+' + d.slice(1).replace(/\+/g, '');
  else if (/^30\d{10}$/.test(d)) e164 = '+' + d;
  else if (/^\d{10}$/.test(d)) e164 = '+30' + d;
  else return { ok: false, e164: '+' + d.replace(/\+/g, '') };
  const digits = e164.slice(1);
  if (/(\d)\1{6,}/.test(digits)) return { ok: false, e164 };
  if (digits.startsWith('30')) {
    const nat = digits.slice(2);
    return { ok: /^(69\d{8}|2\d{9})$/.test(nat), e164 };
  }
  return { ok: /^[1-9]\d{7,14}$/.test(digits), e164 };
}

// ---------------- content ----------------
const FOREIGN = /[Ѐ-ӿԀ-ԯ֐-׿؀-ۿݐ-ݿऀ-ॿ฀-๿぀-ヿ㐀-鿿가-힯豈-﫿]/;
const LINK = /(https?:\/\/|www\.|\[url|<a\s|href=|\b[a-z0-9-]{2,}\.(com|net|org|info|biz|ru|xyz|top|online|site|shop|store|click|link|io|co|me|us|uk|in|pk|bd|vn|cn|tk|ml|ga|cf|gq|live|pro|app|dev|ly)\b(\/|\s|$))/i;
const PHRASES = [
  'seo service', 'seo services', 'seo expert', 'seo agency', 'seo audit', 'seo report', 'seo package', 'seo team',
  'backlink', 'back link', 'guest post', 'link building', 'domain authority', 'pbn', 'da/pa',
  'first page of google', 'page 1 of google', 'rank your website', 'ranking your website', 'top of google',
  'increase your traffic', 'website traffic', 'targeted traffic', 'more traffic', 'organic traffic',
  'lead generation', 'generate leads', 'qualified leads', 'virtual assistant', 'outsourc',
  'web design services', 'website redesign service', 'app development', 'mobile app development', 'wordpress expert',
  'crypto', 'bitcoin', 'btc ', 'usdt', 'forex', 'binary option', 'investment opportunit', 'passive income', 'make money',
  'casino', 'betting', 'slot game', 'viagra', 'cialis', 'porn', 'xxx', 'escort', 'dating', 'hot girls', 'sexy',
  'loan offer', 'cheap loan', 'payday', 'credit repair',
  'unsubscribe', 'opt out', 'opt-out', 'no longer wish to receive',
  'whatsapp me', 'whatsapp:', 'telegram me', 'contact me on telegram', 'skype me', 'hello dear', 'dear sir/madam', 'dear sir or madam', 'dear business owner', 'dear website owner',
  'i noticed your website', 'i was checking your website', 'i came across your website', 'i found your website', 'your website is not ranking',
  'price list', 'pricelist', 'bulk email', 'email list', 'data list', 'scraping',
  'chatgpt bot', 'ai chatbot for your website', 'google maps ranking', 'google my business ranking', 'gmb ranking',
];
// Phrases match at the start of a word only («dating» must not catch «updating»).
const PHRASE_RES = PHRASES.map((p) => [p.trim(), new RegExp('(^|[^a-z])' + p.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'))]);
// A Latin word that cannot be a name: 6+ consonants in a row («dfghjkl»), or 3+ capitals inside it after a
// small letter («eVjKqLmP»). Greek names never match.
function gibberish(name) {
  return String(name || '').split(/[\s,.'-]+/).some((w) =>
    /[bcdfghjklmnpqrstvwxz]{6,}/i.test(w) || (/^[A-Za-z]{6,}$/.test(w) && (w.slice(1).match(/(?<=[a-z])[A-Z]/g) || []).length >= 3));
}
const DISPOSABLE = /@(mailinator|guerrillamail|10minutemail|tempmail|temp-mail|yopmail|trashmail|getnada|sharklasers|dispostable|maildrop|throwawaymail|fakeinbox|mintemail|emailondeck|moakt|tempr\.email|mailnesia|mohmal)\./i;

// fields: {name, email, phone, message, profession}. → reason string, or '' when it looks human.
export function contentVerdict(f) {
  const name = String(f.name || ''), msg = String(f.message || ''), prof = String(f.profession || ''), email = String(f.email || '');
  const all = `${name}\n${prof}\n${msg}`;
  if (FOREIGN.test(all)) return 'foreign-script';
  if (LINK.test(name) || LINK.test(msg) || LINK.test(prof)) return 'link';
  if (/@/.test(name)) return 'link';
  const low = ` ${all.toLowerCase().replace(/\s+/g, ' ')} `;
  const hit = PHRASE_RES.find(([, re]) => re.test(low));
  if (hit) return `phrase:${hit[0]}`;
  if (gibberish(name)) return 'gibberish-name';
  if (DISPOSABLE.test(email)) return 'throwaway-email';
  if (name && msg && name.trim().toLowerCase() === msg.trim().toLowerCase()) return 'name-equals-message';
  return '';
}

// ---------------- 2. the booking code ----------------
export const CODE_TTL_MS = 10 * 60 * 1000;
export const VERIFIED_TTL_MS = 30 * 24 * 3600 * 1000;
export const normEmail = (e) => String(e || '').trim().toLowerCase();
export const emailShapeOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e || '')) && String(e).length <= 160;

// → { code, token }   (the code goes by e-mail, the token to the browser)
export function newCode(email, now = Date.now()) {
  const code = String(randomInt(0, 1000000)).padStart(6, '0');
  const body = b64u(JSON.stringify({ e: normEmail(email), x: now + CODE_TTL_MS, n: randomInt(0, 2 ** 31) }));
  return { code, token: `${body}.${sign('code|' + body + '|' + code)}` };
}
// → { ok, email, why }
export function checkCode(token, code, now = Date.now()) {
  if (!KEY()) return { ok: false, email: '', why: 'not-configured' };
  const m = String(token || '').match(/^([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]{20,64})$/);
  const c = String(code || '').replace(/\D/g, '');
  if (!m || c.length !== 6) return { ok: false, email: '', why: 'bad' };
  let p; try { p = JSON.parse(unb64u(m[1]).toString('utf8')); } catch { return { ok: false, email: '', why: 'bad' }; }
  if (!p || typeof p.e !== 'string' || typeof p.x !== 'number') return { ok: false, email: '', why: 'bad' };
  if (now > p.x) return { ok: false, email: p.e, why: 'expired' };
  if (!sameSig(m[2], sign('code|' + m[1] + '|' + c))) return { ok: false, email: p.e, why: 'wrong' };
  return { ok: true, email: p.e, why: '' };
}
// After a correct code: proof the browser keeps for 30 days.
export function makeVerified(email, now = Date.now()) {
  const body = b64u(JSON.stringify({ e: normEmail(email), x: now + VERIFIED_TTL_MS }));
  return `${body}.${sign('verified|' + body)}`;
}
export function checkVerified(token, now = Date.now()) {
  if (!KEY()) return { ok: false, email: '' };
  const m = String(token || '').match(/^([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]{20,64})$/);
  if (!m || !sameSig(m[2], sign('verified|' + m[1]))) return { ok: false, email: '' };
  let p; try { p = JSON.parse(unb64u(m[1]).toString('utf8')); } catch { return { ok: false, email: '' }; }
  return p && p.x > now ? { ok: true, email: p.e } : { ok: false, email: p ? p.e : '' };
}

// ---------------- small in-memory rate limiter (per function instance, best effort) ----------------
const BUCKETS = new Map();
export function tooMany(key, max, windowMs) {
  const now = Date.now();
  const arr = (BUCKETS.get(key) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  BUCKETS.set(key, arr);
  if (BUCKETS.size > 20000) BUCKETS.clear();
  return arr.length > max;
}
export const clientIp = (req) => req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
