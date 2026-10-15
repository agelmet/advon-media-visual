// components/Roadmap.jsx — «Πώς δουλεύουμε μαζί»: four steps on a winding path
// that draws itself WITH the scroll (the DIADROMES roadmap Angelo loved), a walker
// that travels it and dots that light up as it reaches them. The path is built
// from the real dot positions, so it always passes through every step at any width.
// One rAF scroll handler, transform/stroke only, static under reduced motion.
'use client';

import { useEffect, useRef } from 'react';
import { useLangStore } from '@/store/langStore';
import ScrollReveal from '@/components/ScrollReveal';
import { services } from '@/lib/services';

const WHEN = {
  el: ['Ημέρα 1', '4–10 ημέρες', 'Όσες χρειαστούν', '1–2 ημέρες'],
  en: ['Day 1', '4–10 days', 'As many as needed', '1–2 days'],
};

export default function Roadmap() {
  const { lang } = useLangStore();
  const steps = services[0].steps; // the website's own four steps, verbatim
  const wrap = useRef(null);
  const svg = useRef(null);

  useEffect(() => {
    const root = wrap.current;
    const s = svg.current;
    if (!root || !s) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const path = s.querySelector('.rm-path');
    const bg = s.querySelector('.rm-path-bg');
    const walker = root.querySelector('.rm-walker');
    const dots = Array.from(root.querySelectorAll('.rm-step'));
    let len = 1, pts = [], raf = 0, last = -1;

    const build = () => {
      const r = root.getBoundingClientRect();
      pts = dots.map((d) => {
        const b = d.querySelector('.rm-dot').getBoundingClientRect();
        return [b.left - r.left + b.width / 2, b.top - r.top + b.height / 2];
      });
      if (pts.length < 2) return;
      const vertical = Math.abs(pts[1][1] - pts[0][1]) > Math.abs(pts[1][0] - pts[0][0]);
      let d = `M ${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        if (vertical) {
          const sway = (i % 2 ? 1 : -1) * 40;
          d += ` C ${x0 + sway} ${y0 + (y1 - y0) * 0.45}, ${x1 - sway} ${y1 - (y1 - y0) * 0.45}, ${x1} ${y1}`;
        } else {
          const lift = (i % 2 ? -1 : 1) * 34;
          d += ` C ${x0 + (x1 - x0) * 0.4} ${y0 + lift}, ${x1 - (x1 - x0) * 0.4} ${y1 + lift}, ${x1} ${y1}`;
        }
      }
      path.setAttribute('d', d); bg.setAttribute('d', d);
      s.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
      len = path.getTotalLength();
      root.style.setProperty('--len', len);
      root.style.setProperty('--rm-op', `path("${d}")`);
      last = -1; update();
    };

    const update = () => {
      raf = 0;
      const r = root.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the roadmap's top reaches 85% of the screen, 1 when its bottom reaches 35%
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.5)));
      if (Math.abs(p - last) < 0.002) return;
      last = p;
      root.style.setProperty('--rp', p.toFixed(3));
      const n = dots.length;
      dots.forEach((d, i) => d.classList.toggle('on', p >= (i / (n - 1)) * 0.92 + 0.02));
    };

    if (reduce) {
      build();
      root.style.setProperty('--rp', 1);
      dots.forEach((d) => d.classList.add('on'));
      return;
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    build();
    window.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(build);
    ro.observe(root);
    // fonts settle a moment later and move the dots a few px
    const t = setTimeout(build, 900);
    return () => { window.removeEventListener('scroll', onScroll); ro.disconnect(); clearTimeout(t); cancelAnimationFrame(raf); };
  }, [lang]);

  return (
    <section className="py-28 relative overflow-hidden border-t border-electric-cyan/8 bg-[#0a1418]/40 mv-shoulder">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="section-label">{lang === 'el' ? 'Πώς δουλεύουμε μαζί' : 'How we work together'}</span>
          <h2 className="text-4xl md:text-5xl font-black font-display mb-4 tracking-tight text-white">
            {lang === 'el' ? 'Από το υλικό σας στον αέρα.' : 'From your material to live.'}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {lang === 'el'
              ? 'Τέσσερα βήματα, χωρίς προκαταβολή. Σε κάθε βήμα ξέρετε τι γίνεται και τι ακολουθεί.'
              : 'Four steps, no deposit. At every step you know what is happening and what comes next.'}
          </p>
        </ScrollReveal>

        <div ref={wrap} className="rm-wrap">
          <svg ref={svg} className="rm-svg" aria-hidden="true" preserveAspectRatio="none">
            <defs>
              <linearGradient id="rmGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#47c8f5" /><stop offset="0.6" stopColor="#8a6bd6" /><stop offset="1" stopColor="#c9ff00" />
              </linearGradient>
            </defs>
            <path className="rm-path-bg" d="M0 0" />
            <path className="rm-path" d="M0 0" />
          </svg>
          <span className="rm-walker" aria-hidden="true" />
          <div className="rm-grid">
            {steps.map((st, i) => (
              <div key={i} className="rm-step">
                <span className={`rm-dot ${i === steps.length - 1 ? 'last' : ''}`}>{i + 1}</span>
                <span className="rm-when">{WHEN[lang][i]}</span>
                <h3 className="font-display text-lg">{st.title[lang]}</h3>
                <p>{st.body[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
