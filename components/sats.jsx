// components/Stats.jsx
'use client';
import { useEffect, useState, useRef } from 'react';
import { useLangStore } from '@/store/langStore';

const AnimatedCounter = ({ end, suffix = '', duration = 2200, hasTriggered }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!hasTriggered) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(end);
      return;
    }
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(end);
    };
    requestAnimationFrame(step);
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

  /* `accent` = the gold, shining number. Only the reviews stat gets it. */
  const stats = [
    { end: 3,   suffix: '+', labelEl: 'ΧΡΟΝΙΑ ΕΜΠΕΙΡΙΑΣ', labelEn: 'YEARS EXPERIENCE' },
    { end: 200, suffix: '+', labelEl: 'ΙΣΤΟΣΕΛΙΔΕΣ',       labelEn: 'WEBSITES' },
    { end: 100, suffix: '%', labelEl: 'ΕΠΙΤΥΧΙΑ',          labelEn: 'SUCCESS' },
    { end: 110, suffix: '+', labelEl: 'ΑΞΙΟΛΟΓΗΣΕΙΣ',      labelEn: '5-STAR REVIEWS', accent: true },
  ];

  return (
    <section
      ref={ref}
      className="py-24 border-y border-electric-cyan/8 bg-[#0a1418]/40 backdrop-blur-sm transition-all duration-1000 ease-out relative overflow-hidden"
      style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(32px)' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: '70%', height: '160%', background: 'radial-gradient(ellipse, rgba(71,200,245,0.06) 0%, transparent 65%)', filter: 'blur(70px)', animation: 'auroraFloat3 20s ease-in-out infinite' }}
        />
      </div>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center relative z-10">
        {stats.map(({ end, suffix, labelEl, labelEn, accent }, i) => (
          <div key={labelEn} className="group flex flex-col items-center">
            <div
              className={`font-black font-display mb-2 transition-transform duration-300 group-hover:scale-110 ${accent ? 'stat-shine' : 'text-electric-cyan'}`}
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                filter: accent
                  ? 'drop-shadow(0 0 14px rgba(251,188,5,0.5)) drop-shadow(0 0 38px rgba(240,165,0,0.28))'
                  : 'drop-shadow(0 0 20px rgba(71,200,245,0.3))',
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <AnimatedCounter end={end} suffix={suffix} hasTriggered={isVisible} />
            </div>
            <div className="h-[2px] w-4 bg-electric-cyan/35 mb-2.5 transition-all duration-400 group-hover:w-14 group-hover:bg-electric-cyan" />
            <div className="text-[0.65rem] font-black tracking-[0.2em] text-gray-500 uppercase transition-colors duration-300 group-hover:text-gray-300">
              {lang === 'el' ? labelEl : labelEn}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
