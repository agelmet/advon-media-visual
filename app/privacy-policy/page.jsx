// app/page.jsx
'use client';
import Link from 'next/link';
import { useLangStore } from '@/store/langStore';
import Reviews from '@/components/Reviews';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-electric-cyan shrink-0">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function Home() {
  const { lang } = useLangStore();

  return (
    <>
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 overflow-hidden">
        <div className="container max-w-7xl mx-auto px-6 text-center z-10">
          
          <div className="reveal-item delay-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-electric-cyan/50 bg-electric-cyan/10 mb-8 shadow-[0_0_30px_rgba(71,200,245,0.2)] backdrop-blur-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-electric-cyan animate-pulse shadow-[0_0_15px_#47c8f5]"></span>
            <span className="text-xs font-black tracking-[0.25em] text-white uppercase">ADVON MEDIA</span>
          </div>

          <h1 className="reveal-item delay-2 text-5xl md:text-7xl lg:text-8xl font-black font-display mb-8 leading-[1.05] tracking-tight drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)]">
            {lang === 'el' ? 'Μετατρέπουμε' : 'We Turn'}<br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-300 to-gray-600">
              {lang === 'el' ? 'Επισκέπτες' : 'Visitors'}
            </span>{' '}
            {lang === 'el' ? 'σε' : 'Into'}{' '}
            <span className="text-shimmer drop-shadow-[0_0_40px_rgba(71,200,245,0.7)]">
              {lang === 'el' ? 'Πελάτες' : 'Customers'}
            </span>
          </h1>

          <p className="reveal-item delay-3 text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed drop-shadow-[0_5px_15px_rgba(0,0,0,1)] font-medium">
            {lang === 'el' 
              ? 'Οι πιο αποτελεσματικές λύσεις marketing για τοπικές επιχειρήσεις και ελεύθερους επαγγελματίες. Ανεβείτε στην κορυφή των αποτελεσμάτων χωρίς ρίσκο.' 
              : 'The most effective marketing solutions for local businesses and freelancers. Reach the top of search results without risk.'}
          </p>

          <div className="reveal-item delay-4 flex flex-wrap items-center justify-center gap-6">
            <Link href="/kataskevi-istoselidas" className="group relative overflow-hidden px-10 py-5 bg-electric-cyan text-[#050a0e] font-black text-lg uppercase tracking-[0.1em] rounded-xl shadow-[0_0_30px_rgba(71,200,245,0.5)] hover:scale-105 transition-all flex items-center gap-3">
              <div className="btn-shine-effect"></div>
              <span className="relative z-10 flex items-center gap-3">
                {lang === 'el' ? 'ΥΠΗΡΕΣΙΕΣ' : 'SERVICES'}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 group-hover:translate-x-2 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </Link>
            <Link href="/kataskevi-istoselidas#portfolio" className="group px-10 py-5 bg-transparent border-2 border-electric-cyan text-electric-cyan font-black text-lg uppercase tracking-[0.1em] rounded-xl hover:bg-electric-cyan hover:text-[#050a0e] transition-all flex items-center gap-3 backdrop-blur-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="6 3 20 12 6 21 6 3"/></svg> {lang === 'el' ? 'ΠΟΡΤΦΟΛΙΟ' : 'PORTFOLIO'}
            </Link>
            <Link href="#contact" className="group px-10 py-5 bg-white text-[#050a0e] font-black text-lg uppercase tracking-[0.1em] rounded-xl hover:bg-gray-200 transition-all flex items-center gap-3 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg> {lang === 'el' ? 'ΕΠΙΚΟΙΝΩΝΙΑ' : 'CONTACT'}
            </Link>
          </div>
        </div>
      </section>

      {/* LUXURY STATS CARDS */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="stat-card group">
            <div className="text-4xl md:text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:from-electric-cyan group-hover:to-[#c9ff00] mb-2 transition-all duration-500 relative z-10">3+</div>
            <div className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase relative z-10 group-hover:text-white transition-colors duration-500">{lang === 'el' ? 'ΧΡΟΝΙΑ ΕΜΠΕΙΡΙΑΣ' : 'YEARS EXPERIENCE'}</div>
          </div>
          <div className="stat-card group">
            <div className="text-4xl md:text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:from-electric-cyan group-hover:to-[#c9ff00] mb-2 transition-all duration-500 relative z-10">130+</div>
            <div className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase relative z-10 group-hover:text-white transition-colors duration-500">{lang === 'el' ? 'ΠΕΛΑΤΕΣ' : 'CLIENTS'}</div>
          </div>
          <div className="stat-card group">
            <div className="text-4xl md:text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:from-electric-cyan group-hover:to-[#c9ff00] mb-2 transition-all duration-500 relative z-10">100%</div>
            <div className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase relative z-10 group-hover:text-white transition-colors duration-500">{lang === 'el' ? 'ΕΠΙΤΥΧΙΑ' : 'SUCCESS'}</div>
          </div>
          <div className="stat-card group">
            <div className="text-4xl md:text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:from-electric-cyan group-hover:to-[#c9ff00] mb-2 transition-all duration-500 relative z-10">80+</div>
            <div className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase relative z-10 group-hover:text-white transition-colors duration-500">5-STAR REVIEWS</div>
          </div>
        </div>
      </section>

      {/* Services Summary */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-electric-cyan text-xs font-bold tracking-[0.3em] uppercase mb-4 block">{lang === 'el' ? 'Υπηρεσίες' : 'Services'}</span>
            <h2 className="text-4xl md:text-5xl font-black font-display mb-4">{lang === 'el' ? 'Λύσεις που Αποδίδουν' : 'Solutions That Deliver'}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-panel rounded-2xl p-8 flex flex-col h-full hover:border-electric-cyan/50">
              <div className="w-14 h-14 rounded-2xl bg-electric-cyan/10 flex items-center justify-center mb-6 text-electric-cyan">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold bg-gradient-to-br from-electric-cyan to-[#c9ff00] text-transparent bg-clip-text">{lang === 'el' ? 'ΔΩΡΕΑΝ' : 'FREE'}</span>
                <span className="text-sm text-gray-400">{lang === 'el' ? '(10.83€/μήνα hosting)' : '(10.83€/mo hosting)'}</span>
              </div>
              <h3 className="text-xl font-bold mb-4 font-display">{lang === 'el' ? 'Κατασκευή Ιστοσελίδας' : 'Website Creation'}</h3>
              <p className="text-gray-400 mb-6 leading-relaxed flex-grow">{lang === 'el' ? 'Επαγγελματική ιστοσελίδα που κατακτά υψηλές θέσεις στη Google.' : 'Professional website that conquers high rankings on Google.'}</p>
              
              <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon /> <span className="el-text">{lang === 'el' ? 'Επαγγελματικός σχεδιασμός' : 'Professional design'}</span></li>
                  <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon /> <span className="el-text">{lang === 'el' ? 'SEO βελτιστοποίηση' : 'SEO optimization'}</span></li>
                  <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon /> <span className="el-text">{lang === 'el' ? 'Mobile responsive' : 'Mobile responsive'}</span></li>
                  <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon /> <span className="el-text">{lang === 'el' ? 'Παράδοση σε 5-10 ημέρες' : 'Delivery in 5-10 days'}</span></li>
              </ul>

              <Link href="/kataskevi-istoselidas" className="flex items-center justify-center gap-2 w-full py-3 bg-electric-cyan text-[#050a0e] font-bold rounded-xl hover:bg-white transition-colors uppercase text-sm mt-auto">
                {lang === 'el' ? 'ΠΕΡΙΣΣΟΤΕΡΕΣ ΠΛΗΡΟΦΟΡΙΕΣ' : 'LEARN MORE'}
              </Link>
            </div>

            <div className="glass-panel rounded-2xl p-8 flex flex-col h-full hover:border-electric-cyan/50">
              <div className="w-14 h-14 rounded-2xl bg-electric-cyan/10 flex items-center justify-center mb-6 text-electric-cyan">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold bg-gradient-to-br from-electric-cyan to-[#c9ff00] text-transparent bg-clip-text">25€</span>
                <span className="text-sm text-gray-400">{lang === 'el' ? 'εφάπαξ' : 'one-time'}</span>
              </div>
              <h3 className="text-xl font-bold mb-4 font-display">{lang === 'el' ? 'Βάση Αξιολογήσεων' : 'Reviews Base'}</h3>
              <p className="text-gray-400 mb-6 leading-relaxed flex-grow">{lang === 'el' ? '50+ νέες αξιολογήσεις κάθε μήνα. Ανεβείτε στην κορυφή της Google σε 3 μήνες.' : '50+ new reviews every month. Reach the top of Google in 3 months.'}</p>
              
              <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon /> <span className="el-text">{lang === 'el' ? 'Αύξηση κριτικών Google' : 'Increase Google reviews'}</span></li>
                  <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon /> <span className="el-text">{lang === 'el' ? 'Βελτίωση τοπικού SEO' : 'Improve Local SEO'}</span></li>
                  <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon /> <span className="el-text">{lang === 'el' ? 'Εύκολη χρήση (NFC)' : 'Easy to use (NFC)'}</span></li>
                  <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon /> <span className="el-text">{lang === 'el' ? 'Χωρίς μηνιαία συνδρομή' : 'No monthly subscription'}</span></li>
              </ul>

              <Link href="/google-reviews-nfc" className="flex items-center justify-center gap-2 w-full py-3 bg-electric-cyan text-[#050a0e] font-bold rounded-xl hover:bg-white transition-colors uppercase text-sm mt-auto">
                {lang === 'el' ? 'ΠΕΡΙΣΣΟΤΕΡΕΣ ΠΛΗΡΟΦΟΡΙΕΣ' : 'LEARN MORE'}
              </Link>
            </div>

            <div className="glass-panel rounded-2xl p-8 flex flex-col h-full hover:border-electric-cyan/50">
              <div className="w-14 h-14 rounded-2xl bg-electric-cyan/10 flex items-center justify-center mb-6 text-electric-cyan">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold bg-gradient-to-br from-electric-cyan to-[#c9ff00] text-transparent bg-clip-text">87€</span>
                <span className="text-sm text-gray-400">{lang === 'el' ? '/μήνα' : '/month'}</span>
              </div>
              <h3 className="text-xl font-bold mb-4 font-display">{lang === 'el' ? 'Διαχείριση Social Media' : 'Social Media Management'}</h3>
              <p className="text-gray-400 mb-6 leading-relaxed flex-grow">{lang === 'el' ? 'Επαγγελματικά posts, hashtag research, copywriting. 7 ημέρες δωρεάν δοκιμή.' : 'Professional posts, hashtag research, copywriting. 7 day free trial.'}</p>
              
              <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon /> <span className="el-text">{lang === 'el' ? '3 posts/εβδομάδα' : '3 posts/week'}</span></li>
                  <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon /> <span className="el-text">{lang === 'el' ? 'Hashtag research' : 'Hashtag research'}</span></li>
                  <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon /> <span className="el-text">{lang === 'el' ? 'Copywriting' : 'Copywriting'}</span></li>
                  <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon /> <span className="el-text">{lang === 'el' ? 'Μηνιαία αναφορά' : 'Monthly report'}</span></li>
              </ul>

              <Link href="/diaxeirisi-social-media" className="flex items-center justify-center gap-2 w-full py-3 bg-electric-cyan text-[#050a0e] font-bold rounded-xl hover:bg-white transition-colors uppercase text-sm mt-auto">
                {lang === 'el' ? 'ΠΕΡΙΣΣΟΤΕΡΕΣ ΠΛΗΡΟΦΟΡΙΕΣ' : 'LEARN MORE'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Reviews />
    </>
  );
}