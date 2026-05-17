// components/Reviews.jsx
'use client';
import { useLangStore } from '@/store/langStore';
import { reviewsData } from '@/lib/data';
import { Star, CheckCircle, ExternalLink } from 'lucide-react';

export default function Reviews() {
  const { lang } = useLangStore();
  const renderArray = [...reviewsData, ...reviewsData, ...reviewsData]; // Tripled for infinite scroll

  return (
    <section id="reviews" className="py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-electric-cyan/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="text-electric-cyan text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
            {lang === 'el' ? 'Αξιολογήσεις' : 'Reviews'}
          </span>
          <h2 className="text-4xl md:text-5xl font-black font-display mb-4">
            {lang === 'el' ? 'Τι λένε οι πελάτες μας' : 'What our clients say'}
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-[30%] pt-12 lg:pt-24 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-center gap-2 mb-8 justify-center lg:justify-start">
              <div className="flex gap-1 text-[#FBBC05]">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-6 h-6 fill-current" />)}
              </div>
              <span className="text-xl font-bold text-white flex items-center gap-2">5.0 <span className="text-gray-400 font-medium text-sm">(75+)</span></span>
            </div>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-md">
              {lang === 'el' 
                ? 'Δείτε τι λένε οι πελάτες μας για τις ψηφιακές λύσεις που προσφέρουμε. Η ικανοποίησή σας είναι η μεγαλύτερη ανταμοιβή μας.' 
                : 'See what our clients have to say about the digital solutions we offer. Your satisfaction is our greatest reward.'}
            </p>
            <a href="https://share.google/zWUQyGTmywjaljaMW" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 border border-electric-cyan text-electric-cyan rounded-xl hover:bg-electric-cyan hover:text-[#050a0e] transition-all font-bold uppercase tracking-wide">
              {lang === 'el' ? 'ΔΕΙΤΕ ΟΛΕΣ ΤΙΣ ΑΞΙΟΛΟΓΗΣΕΙΣ' : 'SEE ALL REVIEWS'} <ExternalLink className="w-5 h-5" />
            </a>
          </div>

          <div className="lg:col-span-7 h-[600px] overflow-hidden mask-vertical relative">
            <div className="flex flex-col gap-6 animate-vertical-scroll py-4 hover:[animation-play-state:paused]">
              {renderArray.map((r, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-electric-cyan/20 border border-electric-cyan/50 flex items-center justify-center text-xl font-bold text-electric-cyan uppercase shrink-0">
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white tracking-wide text-sm">{r.name}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-[0.6rem] tracking-[0.2em] text-green-500 uppercase font-black">VERIFIED</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 text-[#FBBC05]">
                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-3 h-3 fill-current" />)}
                  </div>
                  <p className="text-gray-300 text-sm font-medium leading-relaxed">
                    "{lang === 'el' ? r.text : r.textEn}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
