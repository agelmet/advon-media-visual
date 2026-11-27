// lib/blocklist.js — people Angelo does not want to hear from again (27 Nov 2026, first: Patricia «Fashion»).
//
// The list lives in the PRIVATE data repo, file leads/blocked.json — so blocking someone new is one edit there,
// never a deploy:
//   { "people": [ { "name": "Patricia", "phones": ["6969389157"], "emails": ["x@gmail.com"], "why": "…", "at": "2026-11-27" } ] }
//
// Checked by /api/booking (new booking → neutral «something went wrong», nothing booked, nothing sent) and by
// /api/lead (form → answered «sent ✓» like a robot, nothing stored, nothing e-mailed, no Telegram).
// Phones match on the last 10 digits (so +30 / 0030 / spaces don't matter); e-mails ignore case, and for gmail
// also dots and «+tag». Read at most once a minute per function instance; if the file can't be read, nobody is blocked.

import { ghConf, ghReady, readAtHead } from '@/lib/ghdata';

export const BLOCK_PATH = 'leads/blocked.json';
const TTL = 60 * 1000;
let cache = { at: 0, list: null };

export const phoneKey = (p) => { const d = String(p || '').replace(/\D/g, ''); return d.length >= 8 ? d.slice(-10) : ''; };
export function emailKey(e) {
  let s = String(e || '').trim().toLowerCase();
  const m = s.match(/^([^@]+)@(gmail\.com|googlemail\.com)$/);
  if (m) s = m[1].split('+')[0].replace(/\./g, '') + '@gmail.com';
  return s;
}

export function buildIndex(data) {
  const phones = new Map(), emails = new Map();
  for (const p of Array.isArray(data?.people) ? data.people : []) {
    if (!p || p.off) continue;
    for (const x of [].concat(p.phones || [], p.phone || [])) { const k = phoneKey(x); if (k) phones.set(k, p); }
    for (const x of [].concat(p.emails || [], p.email || [])) { const k = emailKey(x); if (k.includes('@')) emails.set(k, p); }
  }
  return { phones, emails };
}

async function index() {
  if (cache.list && Date.now() - cache.at < TTL) return cache.list;
  const conf = ghConf();
  if (!ghReady(conf)) return buildIndex(null);
  try {
    const r = await readAtHead(conf, BLOCK_PATH);
    cache = { at: Date.now(), list: buildIndex(r.text ? JSON.parse(r.text) : null) };
  } catch (e) {
    console.error('[blocklist] read failed', e?.message);
    return cache.list || buildIndex(null);
  }
  return cache.list;
}

// → the blocked person's record, or null
export function matchIn(idx, { phone, email } = {}) {
  const pk = phoneKey(phone), ek = emailKey(email);
  return (pk && idx.phones.get(pk)) || (ek && idx.emails.get(ek)) || null;
}
export async function isBlocked(who) {
  try { return matchIn(await index(), who); } catch { return null; }
}
