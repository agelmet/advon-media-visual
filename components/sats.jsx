// components/Stats.jsx
'use client';
import { useEffect, useState, useRef } from 'react';
import { useLangStore } from '@/store/langStore';
import { GoogleG, GoogleStar } from '@/components/ReviewsGlyphs';

const AnimatedCounter = ({ end, suffix = '', duration = 2200, hasTriggered }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!hasTriggered) return;
    // Reduced motion, or a background tab (rAF is throttled there): show the final value at once.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden) {
      setCount(end);
      return;
    }
    let start = null;
    let raf = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setCount(end);
    };
    raf = requestAnimationFrame(step);
    const safety = setTimeout(() => setCount(end), duration + 400); // never freeze mid-count
    return () => { cancelAnimationFrame(raf); clearTimeout(safety); };
  }, [end, duration, hasTriggered]);

  return <span>{count}{suffix}</span>;
};

export default function Stats() {
  const { lang } = useLangStore();
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  /* `accent` = the gold, shining number. Only the Google reviews stat gets it (with the Google G). */
  const stats = [
    { end: 3,   suffix: '+', labelEl: 'ΧΡΟΝΙΑ ΕΜΠΕΙΡΙΑΣ', labelEn: 'YEARS EXPERIENCE' },
    { end: 220, suffix: '+', labelEl: 'ΙΣΤΟΣΕΛΙΔΕΣ',       labelEn: 'WEBSITES' },
    { end: 100, suffix: '%', labelEl: 'ΕΠΙΤΥΧΙΑ',          labelEn: 'SUCCESS' },
    { end: 125, suffix: '+', labelEl: 'ΑΞΙΟΛΟΓΗΣΕΙΣ',      labelEn: 'REVIEWS', accent: true, google: true },
  ];

  return (
    <section
      ref={ref}
      className="py-24 border-y border-electric-cyan/8 bg-[#0b0c10]/40 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aurora"
          style={{ width: '90%', height: '200%', background: 'radial-gradient(ellipse, rgba(71,200,245,0.055) 0%, rgba(71,200,245,0.025) 35%, transparent 70%)', animation: 'auroraFloat3 20s ease-in-out infinite' }}
        />
        {/* Fine dot grid — drifts very slowly, fades out at the edges */}
        <div className="absolute inset-0 stats-dots" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 text-center relative z-10">
        {stats.map(({ end, suffix, labelEl, labelEn, accent, google }, i) => {
          const Tile = google ? 'a' : 'div';
          return (
          <Tile
            key={labelEn}
            {...(google ? { href: '#reviews', 'aria-label': lang === 'el' ? '125+ αξιολογήσεις 5 αστέρων στο Google' : '125+ five-star Google reviews' } : {})}
            className={`stat-tile group card-sweep glass-panel rounded-3xl px-3 md:px-4 py-8 md:py-10 flex flex-col items-center justify-start h-full ${google ? 'stat-google-tile' : ''} ${isVisible ? 'stat-tile-in' : ''}`}
            style={{ transitionDelay: `${i * 110}ms` }}
          >
            {/* the number: same size, same row, same weight on all four tiles */}
            <div
              className={`font-black font-display mb-2 leading-none transition-transform duration-300 group-hover:scale-110 ${accent ? 'stat-shine' : 'text-electric-cyan'}`}
              style={{
                fontSize: 'clamp(2.4rem, 5.6vw, 3.8rem)',
                filter: accent
                  ? 'drop-shadow(0 0 14px rgba(251,188,5,0.45)) drop-shadow(0 0 34px rgba(240,165,0,0.22))'
                  : 'drop-shadow(0 0 20px rgba(71,200,245,0.3))',
              }}
            >
              <AnimatedCounter end={end} suffix={suffix} hasTriggered={isVisible} />
            </div>
            {/* the rule under the number — on the Google tile it is the five stars, as Google shows them */}
            <div className="h-4 mb-2.5 flex items-center justify-center">
              {google ? (
                <span className="stat-stars flex items-center gap-[3px]" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((k) => (
                    <GoogleStar key={k} className="w-[15px] h-[15px] text-[#FBBC05]" style={{ '--k': k }} />
                  ))}
                </span>
              ) : (
                <div className={`stat-line h-[2px] rounded-full ${accent ? 'bg-[#FBBC05]/60' : 'bg-electric-cyan/50'}`} />
              )}
            </div>
            {/* label row: the same height on all four tiles, so every row lines up */}
            <div className="min-h-7 md:min-h-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-[0.65rem] font-black tracking-[0.2em] text-gray-500 uppercase transition-colors duration-300 group-hover:text-gray-300">
              {google && (
                <span className="stat-gchip inline-flex items-center gap-2 normal-case tracking-normal">
                  <span className="stat-google inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-white shadow-[0_3px_12px_rgba(0,0,0,0.55)] shrink-0">
                    <GoogleG className="w-[17px] h-[17px] md:w-5 md:h-5" />
                  </span>
                  <span className="text-[0.9rem] md:text-base font-bold text-gray-100 leading-none">5,0</span>
                  <span className="text-gray-600 hidden md:inline">·</span>
                </span>
              )}
              <span>{lang === 'el' ? labelEl : labelEn}</span>
            </div>
          </Tile>
          );
        })}
      </div>
    </section>
  );
}
