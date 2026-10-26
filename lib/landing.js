// lib/landing.js — the ads landing page(s). On these paths the shared layout shows a
// focused header (no menu — one «book a call» button), a short footer and the ads
// version of the contact section (form → Formspree + CRM «From the ads», Meta Lead).
export const LANDING_PATHS = ['/istoselida'];

export function isLanding(pathname = '') {
  return LANDING_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

// UTM parameters from the ad link, kept for the whole visit (sessionStorage, same key as /dorean).
export function readUtm() {
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  let saved = {};
  try { saved = JSON.parse(sessionStorage.getItem('advon_utm') || '{}'); } catch {}
  const fresh = {};
  try {
    const p = new URLSearchParams(window.location.search);
    keys.forEach((k) => { const v = p.get(k); if (v) fresh[k] = v.slice(0, 120); });
  } catch {}
  const utm = { ...saved, ...fresh };
  try { sessionStorage.setItem('advon_utm', JSON.stringify(utm)); } catch {}
  return utm;
}

// Message match (22 Oct 2026): the «Ψυχολόγος; / Οδοντίατρος; / Παιδίατρος;» ads land on the same page,
// which then speaks to that profession (eyebrow, line under the headline, their sites first, the form's
// «Ειδικότητα» filled in). Read from utm_content (N_psy, IMG-dent…) or ?p=psy.
export const NICHES = {
  psy: {
    key: 'psy', badge: 'Για ψυχολόγους & ψυχοθεραπευτές', who: 'ψυχολόγους', prof: 'Ψυχολόγος',
    line: 'Πριν κλείσει το πρώτο ραντεβού, ο νέος σας πελάτης ψάχνει το όνομά σας στο Google.',
    match: /ψυχ|Ψυχ|Συστημικ|Θεραπευτ|Ψυχικής/,
  },
  dent: {
    key: 'dent', badge: 'Για οδοντιάτρους', who: 'οδοντιάτρους', prof: 'Οδοντίατρος',
    line: 'Πριν κλείσει ραντεβού, ο νέος σας ασθενής ψάχνει το όνομά σας στο Google.',
    match: /Οδοντ/,
  },
  paed: {
    key: 'paed', badge: 'Για παιδιάτρους', who: 'παιδιάτρους', prof: 'Παιδίατρος',
    line: 'Πριν κλείσει ραντεβού, κάθε γονιός ψάχνει πρώτα το όνομά σας στο Google.',
    match: /Παιδίατρ/,
  },
};

export function readNiche() {
  try {
    const p = new URLSearchParams(window.location.search);
    let k = (p.get('p') || '').toLowerCase();
    if (!NICHES[k]) {
      const u = String((readUtm() || {}).utm_content || '').toLowerCase();
      k = /psy/.test(u) ? 'psy' : /dent/.test(u) ? 'dent' : /paed|ped/.test(u) ? 'paed' : '';
    }
    if (NICHES[k]) { try { sessionStorage.setItem('advon_niche', k); } catch {} return NICHES[k]; }
    const s = sessionStorage.getItem('advon_niche');
    return NICHES[s] || null;
  } catch {
    return null;
  }
}
