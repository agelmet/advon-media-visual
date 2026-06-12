// components/Reviews.jsx
'use client';
import { useLangStore } from '@/store/langStore';
import { reviewsData } from '@/lib/data';
import ScrollReveal from '@/components/ScrollReveal';

const StarIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

export default function Reviews() {
  const { lang } = useLangStore();
  const renderArray = [...reviewsData, ...reviewsData, ...reviewsData];

  return (
    <section id="reviews" className="py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[70%] bg-electric-cyan/4 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px cyber-divider" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal className="text-center mb-20">
          <span className="section-label">{lang === 'el' ? 'Αξιολογήσεις' : 'Reviews'}</span>
          <h2 className="text-4xl md:text-5xl font-black font-display mb-4 text-white tracking-tight">
            {lang === 'el' ? 'Τι λένε οι πελάτες μας' : 'What our clients say'}
          </h2>
        </ScrollReveal>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left sticky panel */}
          <ScrollReveal direction="left" className="lg:col-span-5 lg:sticky lg:top-[28%] pt-4 lg:pt-16 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Rating display */}
            <div className="flex items-center gap-5 mb-8 justify-center lg:justify-start">
              <span className="text-7xl font-black text-white" style={{ textShadow: '0 0 30px rgba(255,255,255,0.2)' }}>
                5.0
              </span>
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-1 text-[#FBBC05]" style={{ filter: 'drop-shadow(0 0 8px rgba(251,188,5,0.5))' }}>
                  {[1,2,3,4,5].map(i => <StarIcon key={i} className="w-6 h-6" />)}
                </div>
                <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">
                  (90+) {lang === 'el' ? 'Αξιολογήσεις' : 'Reviews'}
                </span>
              </div>
            </div>

            <p className="text-gray-300 text-lg mb-10 leading-relaxed max-w-md">
              {lang === 'el'
                ? 'Δείτε τι λένε οι πελάτες μας για τις ψηφιακές λύσεις που προσφέρουμε. Η ικανοποίησή σας είναι η μεγαλύτερη ανταμοιβή μας.'
                : 'See what our clients have to say about the digital solutions we offer. Your satisfaction is our greatest reward.'}
            </p>

            <a
              href="https://share.google/zWUQyGTmywjaljaMW"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium inline-flex items-center gap-2.5 px-8 py-4 border border-electric-cyan text-electric-cyan rounded-xl hover:bg-electric-cyan hover:text-[#050a0e] transition-all duration-300 font-bold uppercase tracking-wide text-sm"
            >
              {lang === 'el' ? 'ΔΕΙΤΕ ΟΛΕΣ ΤΙΣ ΑΞΙΟΛΟΓΗΣΕΙΣ' : 'SEE ALL REVIEWS'}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
            </a>
          </ScrollReveal>

          {/* Scrolling reviews */}
          <ScrollReveal direction="right" className="lg:col-span-7 h-[620px] overflow-hidden mask-vertical relative">
            <div className="flex flex-col gap-5 animate-vertical-scroll py-4 hover:[animation-play-state:paused]">
              {renderArray.map((r, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-white/5 hover:border-electric-cyan/25 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-electric-cyan/15 border border-electric-cyan/40 flex items-center justify-center text-lg font-black text-electric-cyan uppercase shrink-0">
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white tracking-wide text-sm">{r.name}</h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-green-400"><path d="M20 6 9 17l-5-5"/></svg>
                          <span className="text-[0.58rem] tracking-[0.2em] text-green-400 uppercase font-black">VERIFIED</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-[#FBBC05]">
                    {[1,2,3,4,5].map(star => <StarIcon key={star} className="w-3.5 h-3.5" />)}
                  </div>
                  <p className="text-gray-300 text-sm font-medium leading-relaxed">
                    "{lang === 'el' ? r.text : r.textEn}"
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
