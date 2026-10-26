// lib/consent.js — the visitor's cookie choice (GDPR / ePrivacy, Angelo's rule of 24 Sept 2026:
// nothing from another company loads before the visitor agrees). Google Analytics and the Meta
// Pixel load only after «Αποδοχή». The choice is kept 12 months in localStorage `advon-consent`
// (same key as the client sites) and can be changed any time from the footer.
export const CONSENT_KEY = 'advon-consent';
const YEAR = 365 * 24 * 3600 * 1000;

// 'yes' | 'no' | null (never asked, or older than 12 months)
export function getConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    let v = null, t = 0;
    try { const j = JSON.parse(raw); v = j && (j.stats ?? j.v ?? j.all); t = +(j && (j.t || j.at)) || 0; } catch { v = raw; }
    if (t && Date.now() - t > YEAR) return null;
    if (v === true || v === 'yes' || v === 'all' || v === 'granted') return 'yes';
    if (v === false || v === 'no' || v === 'none' || v === 'denied') return 'no';
    return null;
  } catch {
    return null;
  }
}

export function setConsent(choice) {
  const v = choice === 'yes' ? 'yes' : 'no';
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ v, t: Date.now() })); } catch {}
  try { window.dispatchEvent(new CustomEvent('advon-consent', { detail: v })); } catch {}
}

// Footer «Ρυθμίσεις cookies»: show the box again.
export function openConsent() {
  try { window.dispatchEvent(new CustomEvent('advon-consent-open')); } catch {}
}
