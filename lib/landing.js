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
