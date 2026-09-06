// components/Reviews.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useLangStore } from '@/store/langStore';
import { REVIEWS_URL, OVERALL_RATING } from '@/lib/reviews-meta';
import ScrollReveal from '@/components/ScrollReveal';
import { GoogleStar, GoogleG } from '@/components/ReviewsGlyphs';

/* The cards themselves (and the 70KB review list) live in their own chunk and are fetched
   only when the reviews are about 700px away from the screen. Same cards, same motion —
   the page just does not pay for them before anyone can see them. */
const MarqueeColumns = dynamic(() => import('@/components/ReviewsColumns').then((m) => m.MarqueeColumns), { ssr: false, loading: () => null });
const StaticGrid = dynamic(() => import('@/components/ReviewsColumns').then((m) => m.StaticGrid), { ssr: false, loading: () => null });

/* How many columns for the current viewport (desktop 4 / tablet 2 / mobile 1). */
function useColumnCount() {
  const [count, setCount] = useState(4);
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)');
    const tablet = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
    const update = () => setCount(mobile.matches ? 1 : tablet.matches ? 2 : 4);
    update();
    mobile.addEventListener('change', update);
    tablet.addEventListener('change', update);
    return () => {
      mobile.removeEventListener('change', update);
      tablet.removeEventListener('change', update);
    };
  }, []);
  return count;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}


/* Mounts its children once the wrapper is near the viewport. */
function useNear(rootMargin = '700px 0px') {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    if (!('IntersectionObserver' in window)) { setNear(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [near, rootMargin]);
  return [ref, near];
}

export default function Reviews() {
  const { lang } = useLangStore();
  const columnCount = useColumnCount();
  const reducedMotion = useReducedMotion();
  const [nearRef, near] = useNear();

  return (
    <section id="reviews" className="py-32 relative overflow-hidden scroll-mt-24">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[70%] bg-electric-cyan/4 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px cyber-divider" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <span className="section-label">{lang === 'el' ? 'Αξιολογήσεις' : 'Reviews'}</span>
          <h2 className="text-4xl md:text-5xl font-black font-display mb-6 text-white tracking-tight flex items-center justify-center gap-4 flex-wrap">
            <GoogleG className="w-10 h-10 md:w-12 md:h-12" />
            {lang === 'el' ? 'Αξιολογήσεις στη Google' : 'Google Reviews'}
          </h2>

          {/* Rating summary */}
          <div className="inline-flex items-center gap-4 bg-white rounded-2xl px-7 py-4 shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
            <span className="text-5xl font-black text-[#202124]">{OVERALL_RATING}</span>
            <div className="flex flex-col items-start gap-1">
              <div className="flex gap-0.5 text-[#FBBC05]" style={{ filter: 'drop-shadow(0 0 6px rgba(251,188,5,0.45))' }}>
                {[1, 2, 3, 4, 5].map((s) => <GoogleStar key={s} className="w-6 h-6" />)}
              </div>
              <span className="text-[#5f6368] font-medium text-sm">
                110+ {lang === 'el' ? 'αξιολογήσεις στη Google' : 'reviews on Google'}
              </span>
            </div>
          </div>

          <div className="mt-7">
            <a
              href={REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium inline-flex items-center gap-3 px-7 py-3.5 bg-white text-[#1a73e8] rounded-full font-bold text-sm shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_28px_rgba(66,133,244,0.35)] transition-all duration-300"
            >
              <GoogleG className="w-[18px] h-[18px]" />
              {lang === 'el' ? 'Δείτε όλες τις αξιολογήσεις στη Google' : 'See all reviews on Google'}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" /></svg>
            </a>
          </div>
        </ScrollReveal>

        {/* Reviews — vertical auto-scrolling columns (static grid if reduced-motion) */}
        <ScrollReveal direction="fade" delay={60}>
          <div ref={nearRef}>
            {!near ? (
              <div className="reviews-viewport" aria-hidden="true" />
            ) : reducedMotion ? (
              <StaticGrid lang={lang} />
            ) : (
              <MarqueeColumns lang={lang} columnCount={columnCount} />
            )}
          </div>

          <div className="text-center mt-8">
            <span className="text-gray-500 text-xs">
              {lang === 'el'
                ? 'Εμφανίζονται 110+ πραγματικές αξιολογήσεις από τη Google'
                : 'Showing 110+ real reviews from Google'}
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
