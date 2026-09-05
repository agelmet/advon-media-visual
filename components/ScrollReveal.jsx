// components/ScrollReveal.jsx
// Legacy wrapper used by the service/blog pages. v2 behaviour: content is
// visible without JS, reveals slightly BEFORE entering the viewport, 450ms,
// transform + opacity only (no blur — it is non-composited and blanks screens).
'use client';
import { useEffect, useRef } from 'react';

export default function ScrollReveal({ children, className = '', delay = 0, direction = 'up', threshold = 0.01, once = true }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const dirMap = { up: 'sr-up', left: 'sr-left', right: 'sr-right', scale: 'sr-scale', fade: 'sr-fade' };
    el.classList.add('sr', dirMap[direction] || 'sr-up');

    let releaseTimer;
    const release = () => {
      el.classList.remove('sr', 'sr-up', 'sr-left', 'sr-right', 'sr-scale', 'sr-fade', 'sr-visible');
      el.style.transitionDelay = '';
      clearTimeout(releaseTimer);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${Math.min(delay, 180)}ms`;
          el.classList.add('sr-visible');
          if (once) { observer.unobserve(el); releaseTimer = setTimeout(release, 700 + Math.min(delay, 180)); }
        } else if (!once) {
          el.classList.remove('sr-visible');
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    const safety = setTimeout(() => { el.classList.add('sr-visible'); }, 1500);
    return () => { observer.disconnect(); clearTimeout(releaseTimer); clearTimeout(safety); };
  }, [delay, direction, threshold, once]);

  return <div ref={ref} className={className}>{children}</div>;
}
