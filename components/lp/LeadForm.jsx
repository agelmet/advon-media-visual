// components/lp/LeadForm.jsx
// The three-field form on /dorean-istoselida. Captures UTM parameters from the
// URL (kept in sessionStorage so they survive a scroll or a reload), posts to
// /api/lead, fires the Meta "Lead" event and moves to the thank-you page.
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLangStore } from '@/store/langStore';
import { track } from '@/components/MetaPixel';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const STORE_KEY = 'advon_utm';

function readUtm() {
  let saved = {};
  try { saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || '{}'); } catch {}
  const params = new URLSearchParams(window.location.search);
  const fresh = {};
  UTM_KEYS.forEach((k) => { const v = params.get(k); if (v) fresh[k] = v.slice(0, 120); });
  const utm = { ...saved, ...fresh };
  try { sessionStorage.setItem(STORE_KEY, JSON.stringify(utm)); } catch {}
  return utm;
}

export default function LeadForm() {
  const { lang } = useLangStore();
  const router = useRouter();
  const [utm, setUtm] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const t = (el, en) => (lang === 'el' ? el : en);

  useEffect(() => { setUtm(readUtm()); }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.website) return; // honeypot
    setBusy(true); setError('');
    const payload = {
      name: data.name, profession: data.profession, phone: data.phone,
      source: 'landing', page: '/dorean-istoselida',
      utm_source: utm.utm_source || '', utm_medium: utm.utm_medium || '', utm_campaign: utm.utm_campaign || '', utm_content: utm.utm_content || '',
    };
    let ok = false, reason = '';
    try {
      const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      ok = r.ok;
      if (!ok) { try { reason = (await r.json()).error || ''; } catch {} }
    } catch {}
    if (ok) {
      track('Lead', { content_name: 'dorean-istoselida', content_category: data.profession || '' });
      try { sessionStorage.setItem('advon_lead_name', String(data.name || '')); } catch {}
      router.push('/dorean-istoselida/efcharisto');
      return;
    }
    setBusy(false);
    if (reason === 'invalid_phone') setError(t('Ελέγξτε το τηλέφωνο — χρειαζόμαστε 10 ψηφία, π.χ. 69X XXX XXXX.', 'Please check the phone number — 10 digits, e.g. 69X XXX XXXX.'));
    else setError(t('Κάτι πήγε στραβά. Στείλτε μας email στο angelos@advonmedia.com ή δοκιμάστε ξανά σε λίγο.', 'Something went wrong. Email angelos@advonmedia.com or try again in a moment.'));
  }

  const field = 'w-full bg-ink border border-line rounded-lg px-4 py-3.5 text-paper placeholder:text-paper-3 focus:outline-none focus:border-aegean transition-colors text-base';
  const label = 'block text-xs font-bold text-paper-2 mb-2 uppercase tracking-wider';

  return (
    <form id="form" onSubmit={onSubmit} className="card-v2 p-6 md:p-8 space-y-5 scroll-mt-24" aria-labelledby="form-title">
      <div>
        <h2 id="form-title" className="text-2xl font-bold text-paper">{t('Δείτε το δείγμα σας — δωρεάν', 'See your draft — free')}</h2>
        <p className="text-paper-3 text-sm mt-1">{t('Τρία πεδία. Σας καλούμε σε λίγα λεπτά για ένα 10λεπτο τηλεφώνημα.', 'Three fields. We call you within minutes for a 10-minute chat.')}</p>
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="lp-website">Website</label>
        <input id="lp-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="lp-name" className={label}>{t('Όνομα', 'Name')}</label>
        <input id="lp-name" name="name" type="text" required autoComplete="name" className={field} placeholder={t('π.χ. Μαρία Παπαδοπούλου', 'e.g. Maria Papadopoulou')} />
      </div>
      <div>
        <label htmlFor="lp-profession" className={label}>{t('Επάγγελμα / Επιχείρηση', 'Profession / Business')}</label>
        <input id="lp-profession" name="profession" type="text" required className={field} placeholder={t('π.χ. Οδοντίατρος, Χαλάνδρι', 'e.g. Dentist, Chalandri')} />
      </div>
      <div>
        <label htmlFor="lp-phone" className={label}>{t('Τηλέφωνο', 'Phone')}</label>
        <input id="lp-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" className={field} placeholder="69X XXX XXXX" />
      </div>
      <button type="submit" disabled={busy} className="btn-primary w-full text-base disabled:opacity-60">
        {busy ? t('Αποστολή…', 'Sending…') : t('Θέλω το δωρεάν δείγμα μου', 'I want my free draft')}
        {!busy && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>}
      </button>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <p className="text-xs text-paper-3 leading-relaxed">{t('Καμία προκαταβολή, καμία δέσμευση. Τα στοιχεία σας χρησιμοποιούνται μόνο για να επικοινωνήσουμε μαζί σας.', 'No deposit, no commitment. Your details are used only to get back to you.')}</p>
    </form>
  );
}
