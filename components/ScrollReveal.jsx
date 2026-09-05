// components/ScrollReveal.jsx
'use client';
import { useEffect, useRef } from 'react';

export default function ScrollReveal({ children, className = '', delay = 0, direction = 'up', threshold = 0.12, once = true }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dirMap = {
      up: 'sr-up',
      left: 'sr-left',
      right: 'sr-right',
      scale: 'sr-scale',
      fade: 'sr-fade',
    };

    el.classList.add('sr', dirMap[direction] || 'sr-up');

    // Once revealed, .sr keeps will-change + an active filter on the element
    // forever; on an ancestor of a cross-origin iframe (booking calendar)
    // those compositing hints break wheel scrolling, so strip everything
    // after the reveal transition finishes.
    let releaseTimer;
    const release = (e) => {
      if (e && e.target !== el) return; // ignore transitionend bubbling from children
      el.classList.remove('sr', 'sr-up', 'sr-left', 'sr-right', 'sr-scale', 'sr-fade', 'sr-visible');
      el.style.transitionDelay = '';
      el.removeEventListener('transitionend', release);
      clearTimeout(releaseTimer);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add('sr-visible');
          if (once) {
            observer.unobserve(el);
            el.addEventListener('transitionend', release);
            releaseTimer = setTimeout(release, 1000 + delay); // fallback if transitionend never fires
          }
        } else if (!once) {
          el.classList.remove('sr-visible');
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(releaseTimer);
      el.removeEventListener('transitionend', release);
    };
  }, [delay, direction, threshold, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
