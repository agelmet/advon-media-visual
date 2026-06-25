// app/google-reviews-nfc/page.jsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLangStore } from '@/store/langStore';
import ScrollReveal from '@/components/ScrollReveal';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-electric-cyan shrink-0">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const FEATURES = [
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    titleEl: 'Αύξηση Αξιολογήσεων', titleEn: 'Review Growth',
    bodyEl: '50+ νέες αξιολογήσεις Google κάθε μήνα, αυτόματα.',
    bodyEn: '50+ new Google reviews every month, automatically.',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
    titleEl: 'Βελτίωση Τοπικού SEO', titleEn: 'Better Local SEO',
    bodyEl: 'Ανεβείτε στην 1η σελίδα της Google Maps σε 3 μήνες.',
    bodyEn: 'Climb to the 1st page of Google Maps within 3 months.',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>,
    titleEl: 'Μηδενική Τριβή (NFC)', titleEn: 'Zero Friction (NFC)',
    bodyEl: 'Ένα άγγιγμα του κινητού — ο πελάτης βλέπει αμέσως τη φόρμα 5 αστέρων.',
    bodyEn: 'One phone tap — the client sees the 5-star form instantly.',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    titleEl: 'Χωρίς Μηνιαία Συνδρομή', titleEn: 'No Monthly Fee',
    bodyEl: 'Πληρώνετε μία φορά — 25€. Τίποτα άλλο, ποτέ.',
    bodyEn: 'Pay once — €25. Nothing else, ever.',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.9 1.26h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.29 6.29l1.1-1.16a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    titleEl: 'Λειτουργεί με Κάθε Κινητό', titleEn: 'Works with Every Phone',
    bodyEl: 'iOS & Android. Δεν χρειάζεται app, δεν χρειάζεται εγγραφή.',
    bodyEn: 'iOS & Android. No app needed, no sign-up required.',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>,
    titleEl: 'Επαγγελματικός Σχεδιασμός', titleEn: 'Professional Design',
    bodyEl: 'Κομψή βάση που αναβαθμίζει την εικόνα του επαγγελματικού σας χώρου.',
    bodyEn: 'Elegant stand that upgrades the image of your professional space.',
  },
];

const STEPS = [
  {
    num: '01',
    iconEl: 'Σετάρετε τη Βάση',
    iconEn: 'Set Up the Stand',
    bodyEl: 'Ρυθμίστε τη βάση NFC σε δευτερόλεπτα, 1 φορά μόνο, και τοποθετήστε τη στο γραφείο ή τον χώρο υποδοχής σας.',
    bodyEn: 'Set up the NFC stand in seconds, just once, and place it on your desk or reception area.',
  },
  {
    num: '02',
    iconEl: 'Ο Πελάτης Ακουμπά',
    iconEn: 'Client Taps',
    bodyEl: 'Ο πελάτης ακουμπά ή φέρνει κοντά το κινητό του στη βάση.',
    bodyEn: 'The client taps or brings their phone close to the stand.',
  },
  {
    num: '03',
    iconEl: 'Αξιολόγηση Αμέσως',
    iconEn: 'Review Instantly',
    bodyEl: 'Ανοίγει κατευθείαν η φόρμα Google αξιολόγησης. Αφήνει αξιολόγηση σε δευτερόλεπτα.',
    bodyEn: 'The Google review form opens directly. They leave a review in seconds.',
  },
];

const FAQS = [
  {
    qEl: 'Τι είναι η τεχνολογία NFC;',
    qEn: 'What is NFC technology?',
    aEl: 'Το NFC (Near Field Communication) είναι η ίδια τεχνολογία που χρησιμοποιείτε για ανέπαφες πληρωμές. Ενσωματώνεται στη βάση μας, και με ένα άγγιγμα του κινητού ανοίγει αυτόματα η σελίδα αξιολόγησής σας.',
    aEn: 'NFC (Near Field Communication) is the same technology used for contactless payments. Built into our stand, a simple phone tap automatically opens your review page.',
  },
  {
    qEl: 'Λειτουργεί με iPhone και Android;',
    qEn: 'Does it work with iPhone and Android?',
    aEl: 'Ναι, λειτουργεί με iOS 13+ (iPhone XS και νεότερα) και με κάθε Android με NFC. Επίσης έχει QR code ως εναλλακτική για παλαιότερες συσκευές.',
    aEn: 'Yes, it works with iOS 13+ (iPhone XS and newer) and any Android with NFC. It also has a QR code as backup for older devices.',
  },
  {
    qEl: 'Υπάρχει μηνιαία χρέωση;',
    qEn: 'Is there a monthly charge?',
    aEl: 'Όχι. Πληρώνετε 25€ εφάπαξ και η βάση λειτουργεί για πάντα χωρίς κανένα επιπλέον κόστος.',
    aEn: 'No. You pay €25 once and the stand works forever with no additional cost.',
  },
  {
    qEl: 'Πόσο καιρό παίρνει η παράδοση;',
    qEn: 'How long does delivery take?',
    aEl: 'Η παράδοση γίνεται συνήθως εντός 3-5 εργάσιμων ημερών σε όλη την Ελλάδα.',
    aEn: 'Delivery usually takes 3-5 business days throughout Greece.',
  },
  {
    qEl: 'Μπορώ να αλλάξω τον σύνδεσμο αξιολόγησης αργότερα;',
    qEn: 'Can I change the review link later?',
    aEl: 'Ναι. Επικοινωνείτε μαζί μας και ενημερώνουμε τον σύνδεσμο χωρίς επιπλέον χρέωση.',
    aEn: 'Yes. Contact us and we will update the link at no extra charge.',
  },
];

export default function NFC() {
  const { lang } = useLangStore();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse,rgba(71,200,245,0.08)_0%,transparent_65%)] blur-[80px]" />
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <ScrollReveal>
                <span className="section-label">{lang === 'el' ? 'Υπηρεσία' : 'Service'}</span>
                <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-black font-display mb-6 text-white tracking-tight leading-[1.08]">
                  {lang === 'el'
                    ? <>Αποκτήστε <span className="text-shimmer">150 Νέες</span> Αξιολογήσεις σε 3 Μήνες</>
                    : <>Get <span className="text-shimmer">150 New</span> Reviews in 3 Months</>}
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg">
                  {lang === 'el'
                    ? 'Ένα άγγιγμα του κινητού στη βάση NFC — και ο πελάτης σας αφήνει 5 αστέρια στη Google αμέσως. Χωρίς αναζήτηση, χωρίς τριβή, χωρίς μηνιαία συνδρομή.'
                    : 'One tap of the phone on the NFC stand — and your client leaves a 5-star Google review instantly. No searching, no friction, no monthly subscription.'}
                </p>

                {/* Price */}
                <div className="flex items-end gap-3 mb-8">
                  <span className="text-5xl font-black text-white tracking-tight" style={{ textShadow: '0 0 30px rgba(255,255,255,0.15)' }}>25€</span>
                  <div className="mb-1.5">
                    <span className="block text-electric-cyan font-bold text-sm uppercase tracking-widest">
                      {lang === 'el' ? 'ΕΦΑΠΑΞ' : 'ONE-TIME'}
                    </span>
                    <span className="text-gray-500 text-xs">{lang === 'el' ? 'Χωρίς μηνιαία συνδρομή' : 'No monthly subscription'}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="#contact"
                  className="btn-premium inline-flex items-center gap-3 px-10 py-4 bg-electric-cyan text-[#050a0e] font-black text-base uppercase tracking-[0.1em] rounded-xl hover:bg-white transition-all duration-300 hover:scale-105 mb-6"
                  style={{ boxShadow: '0 0 30px rgba(71,200,245,0.4), 0 4px 20px rgba(0,0,0,0.4)' }}
                >
                  {lang === 'el' ? 'Αγορά Τώρα' : 'Buy Now'}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-3 mt-2">
                  {[
                    lang === 'el' ? '✓ Χωρίς συνδρομή' : '✓ No subscription',
                    lang === 'el' ? '✓ Παράδοση 3-5 ημέρες' : '✓ 3-5 day delivery',
                    lang === 'el' ? '✓ iOS & Android' : '✓ iOS & Android',
                  ].map((badge) => (
                    <span key={badge} className="text-xs font-semibold text-gray-400 bg-white/4 border border-white/8 px-3 py-1.5 rounded-full">
                      {badge}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* Right: product image */}
            <ScrollReveal delay={100} direction="up">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-electric-cyan/8 blur-[100px] rounded-full" aria-hidden="true" />
                <img
                  src="https://assets.cdn.filesafe.space/61icdoMiJ2pHklO6mmKW/media/6724bf7a4eb48eb705a7b389.gif"
                  alt={lang === 'el' ? 'Βάση NFC Αξιολογήσεων Google' : 'NFC Google Reviews Stand'}
                  className="relative z-10 w-full max-w-md mx-auto rounded-3xl border border-electric-cyan/30 shadow-[0_20px_80px_rgba(71,200,245,0.25)] hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <div className="border-y border-electric-cyan/10 bg-[#050a0e]/60 backdrop-blur-sm py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { num: '150+', labelEl: 'αξιολογήσεις / 3 μήνες', labelEn: 'reviews / 3 months' },
              { num: '50+', labelEl: 'νέες αξιολογήσεις / μήνα', labelEn: 'new reviews / month' },
              { num: '0€', labelEl: 'μηνιαία συνδρομή', labelEn: 'monthly subscription' },
            ].map(({ num, labelEl, labelEn }) => (
              <div key={num}>
                <div className="text-2xl md:text-3xl font-black price-gradient">{num}</div>
                <div className="text-gray-500 text-xs md:text-sm mt-1">{lang === 'el' ? labelEl : labelEn}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FEATURES GRID ─── */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center mb-14">
            <span className="section-label">{lang === 'el' ? 'Γιατί να το Επιλέξετε' : 'Why Choose It'}</span>
            <h2 className="text-3xl md:text-4xl font-black font-display mb-4 text-white tracking-tight">
              {lang === 'el' ? 'Όλα όσα χρειάζεστε — τίποτα παραπάνω' : 'Everything you need — nothing more'}
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon, titleEl, titleEn, bodyEl, bodyEn }) => (
              <ScrollReveal key={titleEn} delay={60} direction="up">
                <div className="glass-panel rounded-2xl p-6 flex gap-4 h-full group">
                  <div className="w-12 h-12 bg-electric-cyan/10 border border-electric-cyan/20 rounded-xl flex items-center justify-center text-electric-cyan shrink-0 group-hover:bg-electric-cyan/20 transition-colors duration-300">
                    {icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1.5">{lang === 'el' ? titleEl : titleEn}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{lang === 'el' ? bodyEl : bodyEn}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 bg-[#0a1418]/60 border-y border-electric-cyan/8 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <span className="section-label">{lang === 'el' ? 'Πώς Λειτουργεί' : 'How It Works'}</span>
            <h2 className="text-3xl md:text-4xl font-black font-display mb-4 text-white tracking-tight">
              {lang === 'el' ? '3 Βήματα — Τόσο Απλό' : '3 Steps — That Simple'}
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* connector line on desktop */}
            <div className="hidden md:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-electric-cyan/30 via-electric-cyan/60 to-electric-cyan/30" aria-hidden="true" />

            {STEPS.map(({ num, iconEl, iconEn, bodyEl, bodyEn }) => (
              <ScrollReveal key={num} delay={80} direction="up">
                <div className="text-center relative">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-electric-cyan/10 border-2 border-electric-cyan/40 flex items-center justify-center relative z-10"
                    style={{ boxShadow: '0 0 30px rgba(71,200,245,0.15)' }}>
                    <span className="text-2xl font-black text-electric-cyan">{num}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{lang === 'el' ? iconEl : iconEn}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">{lang === 'el' ? bodyEl : bodyEn}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MATH PANEL ─── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <div className="glass-panel p-8 md:p-12 rounded-3xl text-center shadow-[0_0_60px_rgba(71,200,245,0.08)]">
              <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-electric-cyan/10 border border-electric-cyan/25 flex items-center justify-center text-electric-cyan">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-electric-cyan mb-6">
                {lang === 'el' ? 'Τα Μαθηματικά της Επιτυχίας' : 'The Math of Success'}
              </h3>
              <p className="text-white text-lg md:text-xl max-w-3xl mx-auto italic leading-relaxed text-gray-200">
                {lang === 'el'
                  ? '"Αν έχετε 8 πελάτες ανά ημέρα (×20 εργάσιμες = 160 τον μήνα). Αν μόνο 50 από αυτούς αφήσουν μια αξιολόγηση μέσω της βάσης — σε 3 μήνες θα έχετε 150 νέες κορυφαίες αξιολογήσεις στη Google!"'
                  : '"If you have 8 clients per day (×20 working days = 160/month). If just 50 of them leave a review via the stand — in 3 months you will have 150 new top-tier Google reviews!"'}
              </p>
              <div className="mt-8 flex flex-wrap gap-6 justify-center">
                {[
                  { numEl: '8 πελάτες/μέρα', numEn: '8 clients/day' },
                  { numEl: '×3 μήνες', numEn: '×3 months' },
                  { numEl: '= 150 αξιολογήσεις', numEn: '= 150 reviews' },
                ].map(({ numEl, numEn }) => (
                  <div key={numEl} className="text-center">
                    <span className="text-xl font-black price-gradient">{lang === 'el' ? numEl : numEn}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── CTA (mid-page) ─── */}
      <div className="py-4 text-center">
        <ScrollReveal>
          <Link
            href="#contact"
            className="btn-premium inline-flex items-center gap-3 px-10 py-4 bg-electric-cyan text-[#050a0e] font-black text-base uppercase tracking-[0.1em] rounded-xl hover:bg-white transition-all duration-300 hover:scale-105"
            style={{ boxShadow: '0 0 30px rgba(71,200,245,0.4)' }}
          >
            {lang === 'el' ? 'Αγορά Τώρα — 25€ εφάπαξ' : 'Buy Now — €25 one-time'}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </ScrollReveal>
      </div>

      {/* ─── FAQ ─── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal className="text-center mb-14">
            <span className="section-label">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-black font-display mb-4 text-white tracking-tight">
              {lang === 'el' ? 'Συχνές Ερωτήσεις' : 'Frequently Asked Questions'}
            </h2>
          </ScrollReveal>

          <div className="space-y-3">
            {FAQS.map(({ qEl, qEn, aEl, aEn }, i) => (
              <ScrollReveal key={i} delay={40}>
                <div
                  className="glass-panel rounded-2xl overflow-hidden border border-white/8 hover:border-electric-cyan/25 transition-colors duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-bold text-white text-base">{lang === 'el' ? qEl : qEn}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className={`w-5 h-5 text-electric-cyan shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                    >
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                      {lang === 'el' ? aEl : aEn}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(71,200,245,0.06)_0%,transparent_70%)]" />
        </div>
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-black font-display mb-4 text-white tracking-tight">
              {lang === 'el' ? 'Έτοιμοι να ανεβείτε στην κορυφή;' : 'Ready to reach the top?'}
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              {lang === 'el'
                ? 'Μία απόφαση, 25€, εκατοντάδες νέες αξιολογήσεις. Επικοινωνήστε μαζί μας σήμερα.'
                : 'One decision, €25, hundreds of new reviews. Contact us today.'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="#contact"
                className="btn-premium inline-flex items-center gap-3 px-12 py-5 bg-electric-cyan text-[#050a0e] font-black text-lg uppercase tracking-[0.1em] rounded-xl hover:bg-white transition-all duration-300 hover:scale-105"
                style={{ boxShadow: '0 0 40px rgba(71,200,245,0.45), 0 4px 20px rgba(0,0,0,0.4)' }}
              >
                {lang === 'el' ? 'Αγορά Τώρα / Buy Now' : 'Buy Now / Αγορά Τώρα'}
              </Link>
            </div>
            <p className="text-gray-600 text-sm mt-6">
              {lang === 'el' ? '25€ εφάπαξ · Χωρίς μηνιαία συνδρομή · Παράδοση 3-5 ημέρες' : '€25 one-time · No monthly fee · 3-5 day delivery'}
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
