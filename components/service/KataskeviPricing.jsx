// components/service/KataskeviPricing.jsx
// The website-hosting pricing block, restored verbatim from git history
// (commit 6b911dc — the last version before the service-catalog rebuild):
// annual 10.83€ vs monthly 15€ toggle, enterprise hosting features, and
// the Changes & Extras add-on cards. Copy, prices and card design are
// intentionally unchanged — this section converted as it was.
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLangStore } from '@/store/langStore';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';
import GrowthWhy from '@/components/service/GrowthWhy';

// 21 Sept 2026 — the clear "what you get" list and the two plan lists.
// Wording rule: only what we really do (no "server updates", no call
// recording — we count taps on the phone button and form submissions).
const GET_LIST = [
  { el: 'Σχεδιασμός από το μηδέν', en: 'Designed from scratch', subEl: 'Ποτέ έτοιμο template', subEn: 'Never a ready-made template' },
  { el: 'Πρώτα για κινητό', en: 'Mobile first', subEl: 'Γρήγορη σε κάθε συσκευή', subEn: 'Fast on every device' },
  { el: 'Έτοιμη για το Google', en: 'Ready for Google', subEl: 'SEO από την πρώτη μέρα', subEn: 'SEO from day one' },
  { el: 'Ελληνικά & Αγγλικά', en: 'Greek & English', subEl: 'Δίγλωσση από την αρχή', subEn: 'Bilingual from the start' },
  { el: 'Δείγμα σε 5–\u206010\u00A0ημέρες', en: 'Draft in 5–\u206010\u00A0days', subEl: 'Χωρίς προκαταβολή', subEn: 'No deposit' },
];

const HOSTING_LIST = [
  { el: 'Φιλοξενία σε παγκόσμιο δίκτυο (CDN)', en: 'Hosting on a global network (CDN)' },
  { el: 'Πιστοποιητικό ασφαλείας SSL', en: 'SSL security certificate' },
  { el: 'Αυτόματα backups', en: 'Automatic backups' },
  { el: 'Τακτικός έλεγχος ότι η σελίδα λειτουργεί σωστά', en: 'Regular checks that the site works properly' },
  { el: 'Τεχνική υποστήριξη', en: 'Technical support' },
  { el: 'Απεριόριστες αλλαγές μέχρι τη δημοσίευση', en: 'Unlimited changes until the site is published' },
];

const GROWTH_LIST = [
  { el: '3 άρθρα κάθε μήνα, γραμμένα για το Google (SEO)', en: '3 articles every month, written for Google (SEO)' },
  { el: 'Ενότητα άρθρων στη σελίδα σας, χωρίς επιπλέον χρέωση', en: 'An articles section on your site, at no extra charge' },
  { el: '1 αίτημα αλλαγών κάθε μήνα, χωρίς χρέωση (αξίας 50€): όλες οι αλλαγές που θέλετε, σε ένα μήνυμα', en: '1 change request every month, free of charge (worth €50): every change you want, in one message' },
  { el: 'Google Search Console: με ποιες αναζητήσεις σας βρίσκουν και σε ποια θέση', en: 'Google Search Console: which searches find you, and in what position' },
  { el: 'Google Analytics και παρακολούθηση επισκεψιμότητας', en: 'Google Analytics and traffic monitoring' },
  { el: 'Μέτρηση των κλικ στο τηλέφωνο και των φορμών', en: 'Tracking of phone-button taps and form submissions' },
  { el: 'Μηνιαία αναφορά με προτάσεις βελτίωσης', en: 'Monthly report with improvement suggestions' },
  { el: 'Προτεραιότητα στις αλλαγές', en: 'Priority on change requests' },
];

export default function KataskeviPricing() {
  const { lang } = useLangStore();
  const [billingAnnual, setBillingAnnual] = useState(true);

  return (
    <section className="pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* ─── WHAT EVERY WEBSITE COMES WITH (21 Sept 2026) ─── */}
        <ScrollReveal delay={40} direction="fade" className="mt-4">
          <div className="text-center mb-8">
            <span className="section-label">{lang === 'el' ? 'Σε κάθε ιστοσελίδα' : 'In every website'}</span>
            <h2 className="text-3xl md:text-4xl font-black font-display text-white tracking-tight">
              {lang === 'el' ? 'Τι παίρνετε, ξεκάθαρα' : 'What you get, clearly'}
            </h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {GET_LIST.map((g) => (
              <li
                key={g.en}
                className="get-tile glass-panel rounded-2xl p-5 text-center flex flex-col items-center sm:last:col-span-2 lg:last:col-span-1"
              >
                <span className="w-10 h-10 rounded-xl bg-electric-cyan/10 border border-electric-cyan/30 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-electric-cyan" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span className="text-white font-bold text-sm leading-snug mb-1">{lang === 'el' ? g.el : g.en}</span>
                <span className="text-gray-400 text-xs leading-snug">{lang === 'el' ? g.subEl : g.subEn}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        {/* ─── PACKAGES: HOSTING (annual / monthly) + GROWTH ─── */}
        <ScrollReveal delay={60} direction="scale" className="mt-20">
          <div className="text-center mb-12">
            <span className="section-label">{lang === 'el' ? 'Πακέτα' : 'Plans'}</span>
            <h2 className="text-3xl md:text-4xl font-black font-display mb-3 text-white tracking-tight">
              {lang === 'el' ? 'Τιμολόγηση Φιλοξενίας' : 'Hosting Pricing'}
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              {lang === 'el'
                ? 'Δύο πακέτα. Η κατασκευή της ιστοσελίδας είναι δωρεάν και στα δύο.'
                : 'Two plans. The website build is free in both.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 max-w-5xl mx-auto items-stretch">

            {/* ── Hosting card — price swaps on the toggle ── */}
            <div
              key={billingAnnual ? 'annual' : 'monthly'}
              className="pricing-swap-in pricing-featured glass-panel rounded-2xl p-8 border-2 border-electric-cyan/60 relative shadow-[0_0_50px_rgba(71,200,245,0.18)] flex flex-col"
            >
              {billingAnnual && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-electric-cyan text-[#050a0e] text-[0.6rem] font-black tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(71,200,245,0.5)] whitespace-nowrap">
                  {lang === 'el' ? 'ΚΑΛΥΤΕΡΗ ΤΙΜΗ' : 'BEST VALUE'}
                </div>
              )}
              <div className="flex items-center justify-between gap-3 mb-4 mt-1 min-h-[38px]">
                <div className="text-electric-cyan text-xs font-black uppercase tracking-widest">
                  {lang === 'el' ? 'Φιλοξενία' : 'Hosting'}
                </div>
                {/* Toggle */}
                <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/12" role="group" aria-label={lang === 'el' ? 'Τρόπος χρέωσης' : 'Billing cycle'}>
                  <button
                    type="button"
                    onClick={() => setBillingAnnual(true)}
                    aria-pressed={billingAnnual}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${billingAnnual ? 'bg-electric-cyan text-[#050a0e] shadow-[0_0_16px_rgba(71,200,245,0.35)]' : 'text-gray-400 hover:text-white'}`}
                  >
                    {lang === 'el' ? 'Ετήσια' : 'Annual'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingAnnual(false)}
                    aria-pressed={!billingAnnual}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${!billingAnnual ? 'bg-electric-cyan text-[#050a0e] shadow-[0_0_16px_rgba(71,200,245,0.35)]' : 'text-gray-400 hover:text-white'}`}
                  >
                    {lang === 'el' ? 'Μηνιαία' : 'Monthly'}
                  </button>
                </div>
              </div>
              <div className="flex items-end gap-2 mb-0.5">
                <span className="text-5xl font-black text-white">{billingAnnual ? '10.83€' : '15€'}</span>
                <span className="text-gray-500 mb-1.5 text-sm">{lang === 'el' ? '/μήνα' : '/month'}</span>
              </div>
              <p className="text-gray-500 text-xs mb-1">{lang === 'el' ? '(+ΦΠΑ)' : '(+VAT)'}</p>
              <p className="text-gray-500 text-xs leading-relaxed mb-5 min-h-[2.6em]">
                {billingAnnual
                  ? (lang === 'el'
                    ? 'Τιμολογείται ως 130€/χρόνο, με την παράδοση του πρώτου δείγματος της σελίδας σας.'
                    : 'Billed as €130/year, upon delivery of the first draft of your website.')
                  : (lang === 'el' ? 'Χρέωση μία φορά τον μήνα' : 'Billed once per month')}
              </p>

              <div className="flex items-center gap-3 bg-electric-cyan/8 border border-electric-cyan/25 rounded-xl px-4 py-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-electric-cyan shrink-0" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                <span className="text-electric-cyan font-bold text-sm">
                  {lang === 'el' ? 'Domain name δωρεάν — περιλαμβάνεται' : 'Domain name free — included'}
                </span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {HOSTING_LIST.map((r) => (
                  <li key={r.en} className="flex items-start gap-3 text-sm text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-electric-cyan shrink-0 mt-0.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>{lang === 'el' ? r.el : r.en}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto space-y-3">
                <div className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-gray-300 text-sm font-semibold">
                    {billingAnnual
                      ? (lang === 'el' ? 'Εξοικονομείτε 50€ τον χρόνο' : 'Save €50 per year')
                      : (lang === 'el' ? '180€/χρόνο με μηνιαία πληρωμή' : '€180/year with monthly payments')}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                  <span className="text-gray-400 text-sm">
                    {billingAnnual
                      ? (lang === 'el' ? 'Ελάχιστη δέσμευση 1 έτος' : 'Minimum commitment 1 year')
                      : (lang === 'el' ? 'Ελάχιστη δέσμευση 12 μήνες' : 'Minimum 12-month commitment')}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Growth card — 39.58€/month paid yearly (475€) or 49€/month ── */}
            <div key={billingAnnual ? 'g-annual' : 'g-monthly'} className="pricing-swap-in growth-card glass-panel rounded-2xl p-8 border-2 border-white/15 relative flex flex-col">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-white text-[#050a0e] text-[0.6rem] font-black tracking-[0.2em] uppercase whitespace-nowrap">
                {lang === 'el' ? 'ΝΕΟ' : 'NEW'}
              </div>
              <div className="flex items-center justify-between gap-3 mb-4 mt-1 min-h-[38px]">
                <div className="text-white text-xs font-black uppercase tracking-widest">Growth</div>
                {/* Toggle — same state as the hosting card, so both cards always show the same billing cycle */}
                <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/12" role="group" aria-label={lang === 'el' ? 'Τρόπος χρέωσης Growth' : 'Growth billing cycle'}>
                  <button
                    type="button"
                    onClick={() => setBillingAnnual(true)}
                    aria-pressed={billingAnnual}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${billingAnnual ? 'bg-white text-[#050a0e]' : 'text-gray-400 hover:text-white'}`}
                  >
                    {lang === 'el' ? 'Ετήσια' : 'Annual'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingAnnual(false)}
                    aria-pressed={!billingAnnual}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${!billingAnnual ? 'bg-white text-[#050a0e]' : 'text-gray-400 hover:text-white'}`}
                  >
                    {lang === 'el' ? 'Μηνιαία' : 'Monthly'}
                  </button>
                </div>
              </div>
              <div className="flex items-end gap-2 mb-0.5">
                <span className="text-5xl font-black text-white">{billingAnnual ? '39.58€' : '49€'}</span>
                <span className="text-gray-500 mb-1.5 text-sm">{lang === 'el' ? '/μήνα' : '/month'}</span>
              </div>
              <p className="text-gray-500 text-xs mb-1">{lang === 'el' ? '(+ΦΠΑ)' : '(+VAT)'}</p>
              <p className="text-gray-500 text-xs leading-relaxed mb-5 min-h-[2.6em]">
                {billingAnnual
                  ? (lang === 'el'
                    ? 'Τιμολογείται ως 475€/χρόνο, με προπληρωμή για όλο το έτος.'
                    : 'Billed as €475/year, paid upfront for the whole year.')
                  : (lang === 'el' ? 'Χρέωση μία φορά τον μήνα' : 'Billed once per month')}
              </p>

              <div className="flex items-center gap-3 bg-electric-cyan/8 border border-electric-cyan/25 rounded-xl px-4 py-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-electric-cyan shrink-0" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                <span className="text-electric-cyan font-bold text-sm">
                  {lang === 'el' ? 'Όλα όσα περιλαμβάνει η Φιλοξενία' : 'Everything in Hosting'}
                </span>
              </div>
              <ul className="space-y-2.5 mb-4">
                {GROWTH_LIST.map((r) => (
                  <li key={r.en} className="flex items-start gap-3 text-sm text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-electric-cyan shrink-0 mt-0.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>{lang === 'el' ? r.el : r.en}</span>
                  </li>
                ))}
              </ul>

              <GrowthWhy lang={lang} billingAnnual={billingAnnual} />

              <div className="mt-auto space-y-3">
                <div className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-gray-300 text-sm font-semibold">
                    {billingAnnual
                      ? (lang === 'el' ? 'Εξοικονομείτε 113€ τον χρόνο' : 'Save €113 per year')
                      : (lang === 'el' ? '588€/χρόνο με μηνιαία πληρωμή' : '€588/year with monthly payments')}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  <span className="text-gray-400 text-sm">
                    {lang === 'el' ? 'Και για ιστοσελίδες που έχουμε ήδη φτιάξει' : 'Also for websites we have already built'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-600 text-xs mt-5">
            {lang === 'el' ? 'Χωρίς κρυφές χρεώσεις · Χωρίς εγκατάσταση · Domain name δωρεάν' : 'No hidden fees · No setup fee · Free domain name'}
          </p>
        </ScrollReveal>

        {/* ─── HOSTING TECHNICAL FEATURES ─── */}
        <ScrollReveal delay={60} direction="fade" className="mt-20">
          <div className="text-center mb-12">
            <span className="section-label">{lang === 'el' ? 'Τεχνικά Χαρακτηριστικά' : 'Technical Features'}</span>
            <h2 className="text-3xl md:text-4xl font-black font-display mb-3 text-white tracking-tight">
              {lang === 'el' ? 'Enterprise-Grade Υποδομή' : 'Enterprise-Grade Infrastructure'}
            </h2>
            <p className="text-gray-500 text-base max-w-2xl mx-auto">
              {lang === 'el'
                ? 'Η ιστοσελίδα σας τρέχει σε υποδομή επιπέδου μεγάλης επιχείρησης — ασφαλής, γρήγορη, και πάντα online.'
                : 'Your website runs on enterprise-level infrastructure — secure, fast, and always online.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m13 2-2 2.5h3L12 7"/><path d="M10 14v-3"/><path d="M14 14v-3"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><circle cx="12" cy="14" r="8"/></svg>,
                titleEl: 'Ταχύτατη Φόρτωση μέσω Global CDN',
                titleEn: 'Lightning-Fast Loading via Global CDN',
                bodyEl: 'Η ιστοσελίδα εξυπηρετείται από παγκόσμιο δίκτυο διανομής περιεχομένου (CDN). Τα αρχεία της φορτώνουν από το πλησιέστερο data center σε κάθε επισκέπτη, εξαλείφοντας τις καθυστερήσεις και εξασφαλίζοντας εξαιρετικά γρήγορους χρόνους φόρτωσης.',
                bodyEn: 'The website is served from a globally distributed CDN. Files load from the data center closest to each visitor, eliminating lag and guaranteeing ultra-fast load times.',
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
                titleEl: 'Αυτόματη Κρυπτογράφηση SSL/TLS',
                titleEn: 'Automated SSL/TLS Encryption',
                bodyEl: 'Η ιστοσελίδα προστατεύεται με αυτόματα ανανεούμενο, επαγγελματικό πιστοποιητικό SSL. Κάθε σύνδεση πραγματοποιείται μέσω HTTPS, ώστε όλα τα δεδομένα που ανταλλάσσονται μεταξύ server και browser να παραμένουν κρυπτογραφημένα και απόλυτα ιδιωτικά.',
                bodyEn: 'Secured with a continuously renewed, enterprise-grade SSL certificate. Every connection is served over HTTPS — all data between server and browser stays strictly private and encrypted.',
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
                titleEl: 'Ενεργή Προστασία από DDoS',
                titleEn: 'Active DDoS Mitigation',
                bodyEl: 'Το υποκείμενο δίκτυο διαθέτει ενσωματωμένη προστασία DDoS σε Layer 3, 4 και 7, που απορροφά και εξουδετερώνει αυτόματα την κακόβουλη κίνηση από bots ή τις επιθέσεις υπερφόρτωσης, πριν προλάβουν να επηρεάσουν την απόδοση της ιστοσελίδας.',
                bodyEn: 'The edge network includes built-in Layer 3, 4, and 7 DDoS protection, automatically absorbing and neutralizing malicious bot traffic or server floods before they affect performance.',
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>,
                titleEl: 'Αμετάβλητα Deployments & Συνεχή Αντίγραφα Ασφαλείας',
                titleEn: 'Immutable Deployments & Continuous Backups',
                bodyEl: 'Κάθε ενημέρωση δημιουργεί ένα πλήρες, μη επεξεργάσιμο (read-only) snapshot ολόκληρης της ιστοσελίδας — ένα αυτόματο και αδιάσπαστο αντίγραφο ασφαλείας της ψηφιακής σας παρουσίας.',
                bodyEn: 'Every update generates a complete, read-only snapshot of the entire site — an automated, unbreakable backup of your entire web property.',
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.54"/></svg>,
                titleEl: 'Άμεση Επαναφορά με Ένα Κλικ',
                titleEn: 'Instant One-Click Rollbacks',
                bodyEl: 'Καθώς κάθε ενημέρωση αποθηκεύεται ως αμετάβλητο snapshot, η ιστοσελίδα μπορεί να επανέλθει σε οποιαδήποτε προηγούμενη, πλήρως λειτουργική έκδοση μέσα σε δευτερόλεπτα, αν ποτέ προκύψει κάποιο πρόβλημα.',
                bodyEn: 'Because every update is saved as an immutable snapshot, the site can be reverted to any previous working version in seconds if any issue ever occurs.',
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
                titleEl: 'Παγκόσμια Εφεδρεία & Μέγιστη Διαθεσιμότητα',
                titleEn: 'Global Redundancy & Maximum Uptime',
                bodyEl: 'Η ιστοσελίδα δεν φιλοξενείται σε έναν μόνο server, αλλά διανέμεται σε ένα τεράστιο παγκόσμιο δίκτυο. Αν ένα περιφερειακό data center παρουσιάσει πρόβλημα, η κίνηση ανακατευθύνεται αυτόματα στο πλησιέστερο διαθέσιμο, διασφαλίζοντας τη μέγιστη δυνατή διαθεσιμότητα.',
                bodyEn: 'The site is distributed across a massive global network, not a single server. If one regional data center goes down, traffic is seamlessly rerouted to keep the site online.',
              },
            ].map(({ icon, titleEl, titleEn, bodyEl, bodyEn }) => (
              <div key={titleEn} className="glass-panel card-sweep rounded-2xl p-6 flex gap-4 group hover:border-electric-cyan/30 transition-colors duration-300">
                <div className="w-11 h-11 bg-electric-cyan/10 border border-electric-cyan/20 rounded-xl flex items-center justify-center text-electric-cyan shrink-0 group-hover:bg-electric-cyan/18 transition-colors duration-300">
                  {icon}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1.5 leading-tight">{lang === 'el' ? titleEl : titleEn}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{lang === 'el' ? bodyEl : bodyEn}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ─── FUTURE CHANGES POLICY + ADD-ONS ─── */}
        <ScrollReveal delay={80} className="mt-20">
          <div className="text-center mb-10">
            <span className="section-label">{lang === 'el' ? 'Extras' : 'Extras'}</span>
            <h2 className="text-3xl md:text-4xl font-black font-display mb-3 text-white tracking-tight">
              {lang === 'el' ? 'Αλλαγές & Extras' : 'Changes & Extras'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Future changes policy */}
            <TiltCard className="h-full">
            <div className="glass-panel card-sweep rounded-2xl p-7 h-full border border-electric-cyan/20 hover:border-electric-cyan/40 transition-colors duration-300">
              <div className="w-12 h-12 bg-electric-cyan/10 border border-electric-cyan/20 rounded-xl flex items-center justify-center text-electric-cyan mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-black price-gradient">50€</span>
                <span className="text-gray-500 text-sm">{lang === 'el' ? '/αίτημα' : '/request'}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-3">
                {lang === 'el' ? 'Μελλοντικές Αλλαγές' : 'Future Changes'}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {lang === 'el'
                  ? 'Για οποιαδήποτε αλλαγή στην ιστοσελίδα σας, επικοινωνείτε μαζί μας και ολοκληρώνουμε τις αλλαγές εντός 3 εργάσιμων ημερών. Ένα αίτημα μπορεί να περιλαμβάνει πολλές λεπτομερείς αλλαγές.'
                  : 'For any changes to your website, contact us and we complete them within 3 working days. One request can include multiple detailed changes.'}
              </p>
            </div>
            </TiltCard>

            {/* Add-on: Articles/Seminars section */}
            <TiltCard className="h-full">
            <div className="glass-panel card-sweep rounded-2xl p-7 h-full border border-white/8 hover:border-electric-cyan/30 transition-colors duration-300 relative">
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-void-purple/80 border border-void-purple text-white text-[0.55rem] font-black tracking-widest uppercase">
                {lang === 'el' ? 'ΠΡΟΑΙΡΕΤΙΚΟ' : 'ADD-ON'}
              </div>
              <div className="w-12 h-12 bg-electric-cyan/10 border border-electric-cyan/20 rounded-xl flex items-center justify-center text-electric-cyan mb-5 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-black price-gradient">70€</span>
                <span className="text-gray-500 text-sm">{lang === 'el' ? 'εφάπαξ' : 'one-time'}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-3">
                {lang === 'el' ? 'Ενότητα Άρθρων / Σεμιναρίων' : 'Articles / Seminars Section'}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {lang === 'el'
                  ? 'Χτίζουμε μια αποκλειστική ενότητα άρθρων, σεμιναρίων ή εργαστηρίων στον κώδικα της ιστοσελίδας σας. Στη συνέχεια, εσείς μπορείτε να ανεβάζετε και να επεξεργάζεστε το περιεχόμενο όποτε θέλετε, ανεξάρτητα.'
                  : 'We build a dedicated articles, seminars, or workshops section into your website\'s code. Afterwards, you can upload and edit the content whenever you want, independently.'}
              </p>
            </div>
            </TiltCard>

            {/* Add-on: Contact form */}
            <TiltCard className="h-full">
            <div className="glass-panel card-sweep rounded-2xl p-7 h-full border border-white/8 hover:border-electric-cyan/30 transition-colors duration-300 relative">
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-void-purple/80 border border-void-purple text-white text-[0.55rem] font-black tracking-widest uppercase">
                {lang === 'el' ? 'ΠΡΟΑΙΡΕΤΙΚΟ' : 'ADD-ON'}
              </div>
              <div className="w-12 h-12 bg-electric-cyan/10 border border-electric-cyan/20 rounded-xl flex items-center justify-center text-electric-cyan mb-5 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-black price-gradient">50€</span>
                <span className="text-gray-500 text-sm">{lang === 'el' ? 'εφάπαξ' : 'one-time'}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-3">
                {lang === 'el' ? 'Φόρμα Επικοινωνίας' : 'Contact Form'}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {lang === 'el'
                  ? 'Ενσωματώνουμε φόρμα επικοινωνίας στον κώδικα της ιστοσελίδας σας. Κάθε φορά που κάποιος υποβάλλει τη φόρμα, λαμβάνετε αμέσως email στη διεύθυνση που επιλέγετε.'
                  : 'We embed a contact form into your website\'s code. Every time someone submits the form, you immediately receive an email at your preferred address.'}
              </p>
            </div>
            </TiltCard>

            {/* Add-on: Admin Panel */}
            <TiltCard className="h-full">
            <div className="glass-panel card-sweep rounded-2xl p-7 h-full border border-white/8 hover:border-electric-cyan/30 transition-colors duration-300 relative">
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-void-purple/80 border border-void-purple text-white text-[0.55rem] font-black tracking-widest uppercase">
                {lang === 'el' ? 'ΠΡΟΑΙΡΕΤΙΚΟ' : 'ADD-ON'}
              </div>
              <div className="w-12 h-12 bg-electric-cyan/10 border border-electric-cyan/20 rounded-xl flex items-center justify-center text-electric-cyan mb-5 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-black price-gradient">180€</span>
                <span className="text-gray-500 text-sm">{lang === 'el' ? 'εφάπαξ' : 'one-off'}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-3">
                {lang === 'el' ? 'Πίνακας Διαχείρισης (Admin Panel)' : 'Admin Panel'}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {lang === 'el'
                  ? 'Χτίζουμε και ενσωματώνουμε στον κώδικα της ιστοσελίδας σας έναν πίνακα διαχείρισης, ώστε να μπορείτε να αλλάζετε μόνοι σας κείμενα και εικόνες όποτε θέλετε — δωρεάν, έως 5 αλλαγές τον μήνα.'
                  : 'We build and integrate an admin panel into your website\'s code so you can change texts and images yourself whenever you want — free, up to 5 changes per month.'}
              </p>
            </div>
            </TiltCard>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="#contact"
              className="btn-premium inline-flex items-center gap-2 px-8 py-3.5 border border-electric-cyan/40 text-electric-cyan font-bold rounded-xl hover:bg-electric-cyan hover:text-[#050a0e] transition-all duration-300 text-sm"
            >
              {lang === 'el' ? 'Επικοινωνία' : 'Contact Us'}
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
