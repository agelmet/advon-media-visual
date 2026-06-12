// app/page.jsx
'use client';
import Link from 'next/link';
import { useLangStore } from '@/store/langStore';
import Reviews from '@/components/Reviews';
import Stats from '@/components/sats';
import ScrollReveal from '@/components/ScrollReveal';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-electric-cyan shrink-0 icon-glow">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const marqueeItems = [
  'Κατασκευή Ιστοσελίδας',
  'Google Reviews NFC',
  'Social Media Management',
  'SEO Optimization',
  'Web Design',
  'Local Business Marketing',
  'Website Creation',
  'Digital Marketing',
];

export default function Home() {
  const { lang } = useLangStore();

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[95vh] flex items-center justify-center py-20 overflow-hidden">

        {/* Hero accent glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse,rgba(71,200,245,0.06)_0%,transparent_65%)] blur-[60px]" />
        </div>

        <div className="container max-w-7xl mx-auto px-6 text-center z-10">

          {/* Animated badge */}
          <div className="reveal-item delay-1 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-electric-cyan/50 bg-electric-cyan/8 mb-10 badge-scan"
               style={{ boxShadow: '0 0 30px rgba(71,200,245,0.18), inset 0 0 20px rgba(71,200,245,0.04)' }}>
            <span className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse" style={{ boxShadow: '0 0 12px #47c8f5' }} />
            <span className="text-[0.65rem] font-black tracking-[0.3em] text-white uppercase">ADVON MEDIA</span>
            <span className="text-[0.65rem] font-semibold tracking-[0.15em] text-electric-cyan/70 uppercase hidden sm:inline">
              {lang === 'el' ? '— Ψηφιακό Marketing' : '— Digital Marketing'}
            </span>
          </div>

          {/* Kinetic headline */}
          <h1
            className="font-black font-display mb-8 leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 6.5rem)', perspective: '1000px' }}
          >
            <span className="reveal-word block" style={{ animationDelay: '0.15s' }}>
              {lang === 'el' ? 'Μετατρέπουμε' : 'We Turn'}
            </span>
            <span className="reveal-word inline-block" style={{ animationDelay: '0.35s' }}>
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500">
                {lang === 'el' ? 'Επισκέπτες' : 'Visitors'}
              </span>
            </span>
            {' '}
            <span className="reveal-word inline-block" style={{ animationDelay: '0.5s' }}>
              <span className="text-gray-400">{lang === 'el' ? 'σε' : 'into'}</span>
            </span>
            {' '}
            <span className="reveal-word inline-block" style={{ animationDelay: '0.68s' }}>
              <span
                className="text-shimmer"
                style={{ filter: 'drop-shadow(0 0 40px rgba(71,200,245,0.55))' }}
              >
                {lang === 'el' ? 'Πελάτες' : 'Customers'}
              </span>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="reveal-item delay-4 text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
            style={{ fontSize: 'clamp(1rem, 2.2vw, 1.25rem)' }}
          >
            {lang === 'el'
              ? 'Οι πιο αποτελεσματικές λύσεις marketing για τοπικές επιχειρήσεις και ελεύθερους επαγγελματίες. Ανεβείτε στην κορυφή των αποτελεσμάτων χωρίς ρίσκο.'
              : 'The most effective marketing solutions for local businesses and freelancers. Reach the top of search results without risk.'}
          </p>

          {/* CTA Buttons */}
          <div className="reveal-item delay-5 flex flex-wrap items-center justify-center gap-5">
            <Link
              href="/kataskevi-istoselidas"
              className="btn-premium group relative overflow-hidden px-9 py-4 bg-electric-cyan text-[#050a0e] font-black text-base uppercase tracking-[0.1em] rounded-xl flex items-center gap-3 transition-all duration-300 hover:scale-105"
              style={{ boxShadow: '0 0 30px rgba(71,200,245,0.45), 0 4px 20px rgba(0,0,0,0.4)' }}
            >
              <span className="relative z-10 flex items-center gap-3">
                {lang === 'el' ? 'ΥΠΗΡΕΣΙΕΣ' : 'SERVICES'}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </Link>

            <Link
              href="/kataskevi-istoselidas#portfolio"
              className="btn-premium group px-9 py-4 bg-transparent border-2 border-electric-cyan text-electric-cyan font-black text-base uppercase tracking-[0.1em] rounded-xl hover:bg-electric-cyan hover:text-[#050a0e] transition-all duration-300 flex items-center gap-3 backdrop-blur-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="6 3 20 12 6 21 6 3"/></svg>
              {lang === 'el' ? 'ΠΟΡΤΦΟΛΙΟ' : 'PORTFOLIO'}
            </Link>

            <Link
              href="#contact"
              className="btn-premium group px-9 py-4 bg-white/5 border border-white/20 text-white font-black text-base uppercase tracking-[0.1em] rounded-xl hover:bg-white hover:text-[#050a0e] transition-all duration-300 flex items-center gap-3 backdrop-blur-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              {lang === 'el' ? 'ΕΠΙΚΟΙΝΩΝΙΑ' : 'CONTACT'}
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="reveal-item delay-6 flex justify-center mt-16">
            <div className="flex flex-col items-center gap-2 opacity-40">
              <span className="text-[0.6rem] tracking-[0.25em] uppercase text-gray-500">
                {lang === 'el' ? 'Κάντε Scroll' : 'Scroll Down'}
              </span>
              <div className="w-px h-10 bg-gradient-to-b from-electric-cyan/60 to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE TICKER ─── */}
      <div className="overflow-hidden py-5 border-y border-electric-cyan/10 bg-[#050a0e]/60 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050a0e] via-transparent to-[#050a0e] z-10 pointer-events-none" />
        <div className="flex gap-0 marquee-track" style={{ width: 'max-content' }}>
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-5 px-6 whitespace-nowrap">
              <span className="text-[0.7rem] font-black tracking-[0.2em] uppercase text-gray-500">{item}</span>
              <span className="w-1 h-1 rounded-full bg-electric-cyan/50 flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {/* ─── STATS ─── */}
      <Stats />

      {/* ─── SERVICES ─── */}
      <section className="py-32 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-[radial-gradient(ellipse,rgba(71,200,245,0.03)_0%,transparent_70%)] blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-20">
            <span className="section-label">{lang === 'el' ? 'Υπηρεσίες' : 'Services'}</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-display mb-4 tracking-tight">
              {lang === 'el' ? 'Λύσεις που Αποδίδουν' : 'Solutions That Deliver'}
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              {lang === 'el' ? 'Τρεις εστιασμένες υπηρεσίες — κάθε μία σχεδιασμένη για να φέρει αποτελέσματα.' : 'Three focused services — each designed to deliver measurable results.'}
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 — Website */}
            <ScrollReveal delay={0} direction="up">
              <div className="glass-panel service-card rounded-3xl p-8 flex flex-col h-full group">
                <div className="w-14 h-14 rounded-2xl bg-electric-cyan/10 border border-electric-cyan/20 flex items-center justify-center mb-6 text-electric-cyan group-hover:bg-electric-cyan/20 group-hover:scale-110 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-black price-gradient">{lang === 'el' ? 'ΔΩΡΕΑΝ' : 'FREE'}</span>
                  <span className="text-sm text-gray-500">{lang === 'el' ? '(10.83€/μήνα hosting)' : '(10.83€/mo hosting)'}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 font-display text-white">{lang === 'el' ? 'Κατασκευή Ιστοσελίδας' : 'Website Creation'}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed flex-grow text-sm">
                  {lang === 'el' ? 'Επαγγελματική ιστοσελίδα που κατακτά υψηλές θέσεις στη Google.' : 'Professional website that conquers high rankings on Google.'}
                </p>
                <ul className="space-y-2.5 mb-8 flex-grow">
                  {[
                    lang === 'el' ? 'Επαγγελματικός σχεδιασμός' : 'Professional design',
                    lang === 'el' ? 'SEO βελτιστοποίηση' : 'SEO optimization',
                    'Mobile responsive',
                    lang === 'el' ? 'Παράδοση σε 5-10 ημέρες' : 'Delivery in 5-10 days',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckIcon /> {item}
                    </li>
                  ))}
                </ul>
                <Link href="/kataskevi-istoselidas" className="btn-premium flex items-center justify-center gap-2 w-full py-3.5 bg-electric-cyan text-[#050a0e] font-bold rounded-xl hover:bg-white transition-colors uppercase text-sm tracking-wide mt-auto">
                  {lang === 'el' ? 'ΠΕΡΙΣΣΟΤΕΡΕΣ ΠΛΗΡΟΦΟΡΙΕΣ' : 'LEARN MORE'}
                </Link>
              </div>
            </ScrollReveal>

            {/* Card 2 — Reviews */}
            <ScrollReveal delay={120} direction="up">
              <div className="glass-panel service-card rounded-3xl p-8 flex flex-col h-full group relative">
                {/* Featured badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-electric-cyan text-[#050a0e] text-[0.6rem] font-black tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(71,200,245,0.4)]">
                  {lang === 'el' ? 'ΔΗΜΟΦΙΛΕΣ' : 'POPULAR'}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-electric-cyan/10 border border-electric-cyan/20 flex items-center justify-center mb-6 text-electric-cyan group-hover:bg-electric-cyan/20 group-hover:scale-110 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-black price-gradient">25€</span>
                  <span className="text-sm text-gray-500">{lang === 'el' ? 'εφάπαξ' : 'one-time'}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 font-display text-white">{lang === 'el' ? 'Βάση Αξιολογήσεων' : 'Reviews Base'}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed flex-grow text-sm">
                  {lang === 'el' ? '50+ νέες αξιολογήσεις κάθε μήνα. Ανεβείτε στην κορυφή της Google σε 3 μήνες.' : '50+ new reviews every month. Reach the top of Google in 3 months.'}
                </p>
                <ul className="space-y-2.5 mb-8 flex-grow">
                  {[
                    lang === 'el' ? 'Αύξηση κριτικών Google' : 'Increase Google reviews',
                    lang === 'el' ? 'Βελτίωση τοπικού SEO' : 'Improve Local SEO',
                    lang === 'el' ? 'Εύκολη χρήση (NFC)' : 'Easy to use (NFC)',
                    lang === 'el' ? 'Χωρίς μηνιαία συνδρομή' : 'No monthly subscription',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckIcon /> {item}
                    </li>
                  ))}
                </ul>
                <Link href="/google-reviews-nfc" className="btn-premium flex items-center justify-center gap-2 w-full py-3.5 bg-electric-cyan text-[#050a0e] font-bold rounded-xl hover:bg-white transition-colors uppercase text-sm tracking-wide mt-auto">
                  {lang === 'el' ? 'ΠΕΡΙΣΣΟΤΕΡΕΣ ΠΛΗΡΟΦΟΡΙΕΣ' : 'LEARN MORE'}
                </Link>
              </div>
            </ScrollReveal>

            {/* Card 3 — Social Media */}
            <ScrollReveal delay={240} direction="up">
              <div className="glass-panel service-card rounded-3xl p-8 flex flex-col h-full group">
                <div className="w-14 h-14 rounded-2xl bg-electric-cyan/10 border border-electric-cyan/20 flex items-center justify-center mb-6 text-electric-cyan group-hover:bg-electric-cyan/20 group-hover:scale-110 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-black price-gradient">87€</span>
                  <span className="text-sm text-gray-500">{lang === 'el' ? '/μήνα' : '/month'}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 font-display text-white">{lang === 'el' ? 'Διαχείριση Social Media' : 'Social Media Management'}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed flex-grow text-sm">
                  {lang === 'el' ? 'Επαγγελματικά posts, hashtag research, copywriting. 7 ημέρες δωρεάν δοκιμή.' : 'Professional posts, hashtag research, copywriting. 7 day free trial.'}
                </p>
                <ul className="space-y-2.5 mb-8 flex-grow">
                  {[
                    lang === 'el' ? '3 posts/εβδομάδα' : '3 posts/week',
                    'Hashtag research',
                    'Copywriting',
                    lang === 'el' ? 'Μηνιαία αναφορά' : 'Monthly report',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckIcon /> {item}
                    </li>
                  ))}
                </ul>
                <Link href="/diaxeirisi-social-media" className="btn-premium flex items-center justify-center gap-2 w-full py-3.5 bg-electric-cyan text-[#050a0e] font-bold rounded-xl hover:bg-white transition-colors uppercase text-sm tracking-wide mt-auto">
                  {lang === 'el' ? 'ΠΕΡΙΣΣΟΤΕΡΕΣ ΠΛΗΡΟΦΟΡΙΕΣ' : 'LEARN MORE'}
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Bottom CTA */}
          <ScrollReveal delay={100} className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 flex-wrap justify-center">
              <span className="text-gray-500 text-sm">{lang === 'el' ? 'Δεν είστε σίγουροι ποια υπηρεσία ταιριάζει;' : 'Not sure which service fits?'}</span>
              <Link href="#contact" className="btn-premium inline-flex items-center gap-2 px-6 py-2.5 border border-electric-cyan/40 text-electric-cyan text-sm font-bold rounded-xl hover:bg-electric-cyan hover:text-[#050a0e] transition-all">
                {lang === 'el' ? 'Δωρεάν Ραντεβού →' : 'Free Consultation →'}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <Reviews />
    </>
  );
}
