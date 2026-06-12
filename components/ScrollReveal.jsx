// components/ScrollReveal.jsx
'use client';
import { useEffect, useRef } from 'react';

export default function ScrollReveal({ children, className = '', delay = 0, direction = 'up', threshold = 0.12, once = true }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const dirMap = {
      up: 'sr-up',
      left: 'sr-left',
      right: 'sr-right',
      scale: 'sr-scale',
      fade: 'sr-fade',
    };

    el.classList.add('sr', dirMap[direction] || 'sr-up');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add('sr-visible');
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.classList.remove('sr-visible');
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, direction, threshold, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
