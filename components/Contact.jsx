// components/Contact.jsx
// Site-wide contact block: the form posts to /api/lead (CRM lead inbox) and
// falls back to Formspree if that is unavailable; the Zoho calendar loads on click.
'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLangStore } from '@/store/langStore';
import ZohoInline from '@/components/ZohoInline';
import { track } from '@/components/MetaPixel';

const FORMSPREE = 'https://formspree.io/f/xkopgoaj';

export default function Contact() {
  const { lang } = useLangStore();
  const pathname = usePathname();
  const [status, setStatus] = useState({ kind: '', msg: '' });
  const [busy, setBusy] = useState(false);

  if (pathname?.startsWith('/dorean-istoselida') || pathname?.startsWith('/crm')) return null;
  const t = (el, en) => (lang === 'el' ? el : en);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.website) return; // honeypot
    setBusy(true);
    setStatus({ kind: 'info', msg: t('Αποστολή…', 'Sending…') });
    const payload = {
      name: data.name, email: data.email, phone: data.phone, message: data.message,
      source: 'contact', page: pathname,
    };
    let ok = false;
    try {
      const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      ok = r.ok;
    } catch {}
    if (!ok) {
      try {
        const r = await fetch(FORMSPREE, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        ok = r.ok;
      } catch {}
    }
    setBusy(false);
    if (ok) {
      track('Lead', { content_name: 'contact' });
      setStatus({ kind: 'ok', msg: t('Ευχαριστούμε! Θα σας καλέσουμε το συντομότερο — συνήθως μέσα σε λίγα λεπτά σε ώρες γραφείου.', 'Thank you! We will call you shortly — usually within minutes during office hours.') });
      form.reset();
    } else {
      setStatus({ kind: 'err', msg: t('Κάτι πήγε στραβά. Στείλτε μας email στο angelos@advonmedia.com.', 'Something went wrong. Please email angelos@advonmedia.com.') });
    }
  }

  const field = 'w-full bg-ink border border-line rounded-lg px-4 py-3 text-paper placeholder:text-paper-3 focus:outline-none focus:border-aegean transition-colors';
  const label = 'block text-xs font-bold text-paper-2 mb-2 uppercase tracking-wider';

  return (
    <section id="contact" className="relative z-20 border-t border-line bg-ink py-20 md:py-28 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="max-w-2xl mb-12">
          <span className="eyebrow">{t('Επικοινωνία', 'Contact')}</span>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05] mt-4 mb-4 text-paper">{t('Ας μιλήσουμε για τη σελίδα σας.', "Let's talk about your website.")}</h2>
          <p className="text-paper-2 text-lg">{t('Ένα 10λεπτο τηλεφώνημα αρκεί για να ξεκινήσουμε. Χωρίς δέσμευση, χωρίς προκαταβολή.', 'A 10-minute call is all it takes to start. No commitment, no deposit.')}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="card-v2 p-6 md:p-8">
            <h3 className="text-xl font-bold mb-2 text-paper">{t('Στείλτε μας τα στοιχεία σας', 'Send us your details')}</h3>
            <p className="text-paper-3 text-sm mb-6">{t('Σας καλούμε εμείς — συνήθως μέσα σε λίγα λεπτά σε ώρες γραφείου.', 'We call you back — usually within minutes during office hours.')}</p>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
              <div className="hidden" aria-hidden="true">
                <label htmlFor="c-website">Website</label>
                <input id="c-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <div>
                <label htmlFor="c-name" className={label}>{t('Όνομα / Επωνυμία', 'Name / Company')}</label>
                <input id="c-name" type="text" name="name" required autoComplete="name" className={field} />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="c-phone" className={label}>{t('Τηλέφωνο', 'Phone')}</label>
                  <input id="c-phone" type="tel" name="phone" required autoComplete="tel" inputMode="tel" className={field} />
                </div>
                <div>
                  <label htmlFor="c-email" className={label}>Email</label>
                  <input id="c-email" type="email" name="email" autoComplete="email" className={field} />
                </div>
              </div>
              <div>
                <label htmlFor="c-message" className={label}>{t('Τι χρειάζεστε;', 'What do you need?')}</label>
                <textarea id="c-message" name="message" rows="4" className={`${field} resize-none`} placeholder={t('π.χ. Είμαι οδοντίατρος στο Χαλάνδρι και θέλω μια νέα σελίδα.', 'e.g. I am a dentist in Chalandri and I need a new website.')} />
              </div>
              <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
                {busy ? t('Αποστολή…', 'Sending…') : t('Θέλω να με καλέσετε', 'Call me back')}
              </button>
              {status.msg && (
                <p role="status" className={`text-sm ${status.kind === 'ok' ? 'text-green-400' : status.kind === 'err' ? 'text-red-400' : 'text-paper-3'}`}>{status.msg}</p>
              )}
              <p className="text-xs text-paper-3">{t('Τα στοιχεία σας χρησιμοποιούνται μόνο για να επικοινωνήσουμε μαζί σας.', 'Your details are used only to get back to you.')}</p>
            </form>
          </div>

          <div className="card-v2 p-6 md:p-8">
            <h3 className="text-xl font-bold mb-2 text-paper">{t('Ή κλείστε ραντεβού μόνοι σας', 'Or book a slot yourself')}</h3>
            <p className="text-paper-3 text-sm mb-6">{t('Διαλέξτε μέρα και ώρα για ένα δωρεάν 10λεπτο τηλεφώνημα με τον Άγγελο. Λαμβάνετε αμέσως το link του Google Meet στο email σας.', 'Pick a day and time for a free 10-minute call with Angelos. You receive the Google Meet link by email right away.')}</p>
            <ZohoInline />
            <div className="mt-8 pt-6 border-t border-line grid sm:grid-cols-2 gap-4 text-sm">
              <a href="mailto:angelos@advonmedia.com" className="flex items-center gap-3 text-paper-2 hover:text-paper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-aegean-2" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 7L2 7"/></svg>
                angelos@advonmedia.com
              </a>
              <a href="https://www.instagram.com/advon_media" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-paper-2 hover:text-paper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-aegean-2" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>
                @advon_media
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
