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

export default function KataskeviPricing({ infra = true }) {
  const { lang } = useLangStore();
  const [billingAnnual, setBillingAnnual] = useState(true);

  return (
    <section className="pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* ─── PACKAGES: HOSTING (annual / monthly) + GROWTH ─── */}
        <ScrollReveal delay={60} direction="scale" className="mt-4">
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
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-electric-cyan text-[#050608] text-[0.6rem] font-black tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(71,200,245,0.5)] whitespace-nowrap">
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
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${billingAnnual ? 'bg-electric-cyan text-[#050608] shadow-[0_0_16px_rgba(71,200,245,0.35)]' : 'text-gray-400 hover:text-white'}`}
                  >
                    {lang === 'el' ? 'Ετήσια' : 'Annual'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingAnnual(false)}
                    aria-pressed={!billingAnnual}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${!billingAnnual ? 'bg-electric-cyan text-[#050608] shadow-[0_0_16px_rgba(71,200,245,0.35)]' : 'text-gray-400 hover:text-white'}`}
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
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-white text-[#050608] text-[0.6rem] font-black tracking-[0.2em] uppercase whitespace-nowrap">
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
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${billingAnnual ? 'bg-white text-[#050608]' : 'text-gray-400 hover:text-white'}`}
                  >
                    {lang === 'el' ? 'Ετήσια' : 'Annual'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingAnnual(false)}
                    aria-pressed={!billingAnnual}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${!billingAnnual ? 'bg-white text-[#050608]' : 'text-gray-400 hover:text-white'}`}
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

        {/* ─── AFTER PUBLISHING: changes & extras (27 Nov 2026 — Angelo: make it clear) ───
            Three ways side by side: we make the changes (50€ + ΦΠΑ per request) · you edit one section
            yourself (70€ + ΦΠΑ once) · you edit everything yourself (130€ + ΦΠΑ once). The contact form
            stays a separate small add-on underneath. */}
        <ScrollReveal delay={80} className="mt-20">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <span className="section-label">{lang === 'el' ? 'Μετά τη δημοσίευση' : 'After publishing'}</span>
            <h2 className="text-3xl md:text-4xl font-black font-display mb-4 text-white tracking-tight">
              {lang === 'el' ? 'Αλλαγές στην ιστοσελίδα σας' : 'Changes to your website'}
            </h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
              {lang === 'el'
                ? <>Μέχρι να βγει online, οι αλλαγές είναι <b className="text-white">απεριόριστες και δωρεάν</b>. Μετά, διαλέγετε: τις κάνουμε εμείς ή τις κάνετε μόνοι σας.</>
                : <>Until it goes live, changes are <b className="text-white">unlimited and free</b>. After that, you choose: we make them, or you make them yourself.</>}
            </p>
          </div>

          {(() => {
            const el = lang === 'el';
            const Tick = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 text-electric-cyan shrink-0" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>;
            const List = ({ items }) => (
              <ul className="mt-auto space-y-2.5 pt-4 border-t border-white/8">
                {items.map((li) => <li key={li} className="flex items-start gap-2.5 text-sm text-gray-200"><Tick /><span>{li}</span></li>)}
              </ul>
            );
            /* a tiny drawn page: one row lit = one section, every row lit = the whole website */
            const Scope = ({ all }) => (
              <svg viewBox="0 0 64 80" className="ds-scope w-12 h-[60px] shrink-0" aria-hidden="true">
                <rect x="1.5" y="1.5" width="61" height="77" rx="7" className="ds-page" />
                {[12, 26, 40, 54].map((y, i) => (
                  <rect key={y} x="9" y={y} width="46" height={i === 1 ? 14 : 9} rx="2.5" className={all || i === 1 ? 'ds-on' : 'ds-off'} />
                ))}
              </svg>
            );
            const self = el ? [
              { all: false, scope: '1 ενότητα', price: '70€', per: '+ ΦΠΑ · εφάπαξ', title: 'Απλή ενότητα',
                text: 'Μία ενότητα της σελίδας που αλλάζετε μόνοι σας, όποτε θέλετε, χωρίς να μας ρωτάτε.',
                list: ['Άρθρα, εκδηλώσεις / σεμινάρια ή φωτογραφίες', 'Προσθέτετε, αλλάζετε και διαγράφετε από υπολογιστή ή κινητό', 'Για όλα τα υπόλοιπα, αίτημα αλλαγών'] },
              { all: true, scope: 'Όλη η ιστοσελίδα', price: '130€', per: '+ ΦΠΑ · εφάπαξ', title: 'Πλήρης πίνακας διαχείρισης',
                text: 'Ο δικός σας πίνακας διαχείρισης για ολόκληρη την ιστοσελίδα — αλλάζετε τα πάντα μόνοι σας.',
                list: ['Όλα τα κείμενα και όλες οι φωτογραφίες', 'Υπηρεσίες, τιμές, ωράριο, άρθρα, εκδηλώσεις', 'Χωρίς χρέωση ανά αλλαγή, όσες φορές θέλετε'] },
            ] : [
              { all: false, scope: '1 section', price: '€70', per: '+ VAT · one-off', title: 'A simple section',
                text: 'One section of the site that you change yourself, whenever you like, without asking us.',
                list: ['Articles, events / seminars or photos', 'Add, edit and delete from a computer or phone', 'For everything else, a change request'] },
              { all: true, scope: 'The whole website', price: '€130', per: '+ VAT · one-off', title: 'Full admin panel',
                text: 'Your own admin panel for the whole website — you change everything yourself.',
                list: ['All texts and all photos', 'Services, prices, hours, articles, events', 'No charge per change, as often as you like'] },
            ];
            return (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-stretch">
                {/* 1 · we make the changes */}
                <div className="chg-card glass-panel rounded-2xl p-7 h-full flex flex-col border border-white/10">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-11 h-11 bg-electric-cyan/10 border border-electric-cyan/25 rounded-xl flex items-center justify-center text-electric-cyan shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>
                    </span>
                    <span className="chg-who text-[0.7rem] font-black tracking-[0.16em] uppercase text-electric-cyan">{el ? 'Τις κάνουμε εμείς' : 'We make them'}</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-black price-gradient tabular-nums">{el ? '50€' : '€50'}</span>
                    <span className="text-gray-400 text-sm font-semibold">{el ? '+ ΦΠΑ / αίτημα' : '+ VAT / request'}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mt-2 mb-2">{el ? 'Αίτημα αλλαγών' : 'Change request'}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{el ? 'Μας στέλνετε ό,τι θέλετε να αλλάξει και το ολοκληρώνουμε εντός 3 εργάσιμων ημερών.' : 'Send us whatever you want changed and we finish it within 3 working days.'}</p>
                  <List items={el
                    ? ['Ένα αίτημα = όλες οι αλλαγές που γράψετε σε ένα μήνυμα', 'Κείμενα, φωτογραφίες, υπηρεσίες, ωράριο, νέα ενότητα', 'Πληρώνετε μόνο όταν χρειαστείτε κάτι']
                    : ['One request = every change you write in one message', 'Texts, photos, services, hours, a new section', 'You pay only when you need something']} />
                </div>

                {/* 2 · you make them yourself — one card, two ways: one section or the whole website */}
                <div className="chg-card ds-card glass-panel rounded-2xl h-full flex flex-col border border-electric-cyan/40 chg-hot">
                  <div className="flex items-center gap-3 px-7 pt-7 pb-5 border-b border-white/8 ds-head">
                    <span className="w-11 h-11 bg-electric-cyan/10 border border-electric-cyan/25 rounded-xl flex items-center justify-center text-electric-cyan shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                    </span>
                    <div>
                      <span className="chg-who block text-[0.7rem] font-black tracking-[0.16em] uppercase text-electric-cyan">{el ? 'Τις κάνετε εσείς' : 'You make them'}</span>
                      <span className="block text-gray-300 text-sm mt-1">{el ? 'Με δικό σας πίνακα διαχείρισης — διαλέξτε πόσο από τη σελίδα θα αλλάζετε:' : 'With your own admin panel — choose how much of the site you will edit:'}</span>
                    </div>
                  </div>
                  <div className="ds-ways relative grid grid-cols-1 md:grid-cols-2 flex-1">
                    <span className="ds-or" aria-hidden="true">{el ? 'ή' : 'or'}</span>
                    {self.map((o) => (
                      <div key={o.title} className={`ds-way flex flex-col p-7 ${o.all ? 'ds-all' : ''}`}>
                        <div className="flex items-center gap-4 mb-5">
                          <Scope all={o.all} />
                          <span className="ds-scope-t text-xl md:text-2xl font-black text-white leading-tight">{o.scope}</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-4xl font-black price-gradient tabular-nums">{o.price}</span>
                          <span className="text-gray-400 text-sm font-semibold">{o.per}</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mt-2 mb-2">{o.title}</h3>
                        <p className="chg-text text-gray-400 text-sm leading-relaxed mb-4">{o.text}</p>
                        <List items={o.list} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* the contact form — a small add-on (plugin) */}
          <div className="chg-extra glass-panel mt-6 rounded-2xl px-6 py-5 border border-white/10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <span className="w-11 h-11 bg-electric-cyan/10 border border-electric-cyan/25 rounded-xl flex items-center justify-center text-electric-cyan shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </span>
            <p className="text-sm text-gray-300 leading-relaxed flex-1">
              <span className="ds-addon">{lang === 'el' ? 'Πρόσθετο' : 'Add-on'}</span>{' '}
              <b className="text-white">{lang === 'el' ? 'Φόρμα επικοινωνίας' : 'Contact form'}</b>{' '}
              {lang === 'el'
                ? '— κάθε φορά που κάποιος τη συμπληρώνει, λαμβάνετε αμέσως email στη διεύθυνση που θέλετε.'
                : '— every time someone fills it in, you get an email right away at the address you choose.'}
            </p>
            <span className="whitespace-nowrap"><b className="text-2xl font-black price-gradient tabular-nums">{lang === 'el' ? '+20€' : '+€20'}</b> <span className="text-gray-400 text-sm font-semibold">{lang === 'el' ? '+ ΦΠΑ · εφάπαξ' : '+ VAT · one-off'}</span></span>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="#contact"
              className="btn-premium inline-flex items-center gap-2 px-8 py-3.5 border border-electric-cyan/40 text-electric-cyan font-bold rounded-xl hover:bg-electric-cyan hover:text-[#050608] transition-all duration-300 text-sm"
            >
              {lang === 'el' ? 'Επικοινωνία' : 'Contact Us'}
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
