// components/ScrollReveal.jsx — v5 (15 Oct 2026): cards land once, smoothly, and then let go.
//  • the hidden state is in the server HTML (`sr sr-<dir>`, only under html.mv-js), so a card
//    never flashes visible → hidden → visible while the page wakes up;
//  • the entrance is a CSS @keyframes animation, not a transition: the card's own
//    `transition` (hover, colours) can no longer hijack it, so nothing jumps half-way;
//  • no will-change, and on animationend every class comes off (the last frame equals the
//    resting card), so there is no repaint «snap» when it settles;
//  • reduced motion: the classes come off at once and nothing is ever hidden.
'use client';
import { useEffect, useRef, useState } from 'react';

const DIRS = { up: 'sr-up', left: 'sr-left', right: 'sr-right', scale: 'sr-scale', fade: 'sr-fade', deal: 'sr-deal' };
const ALL = ['sr', 'sr-visible', ...Object.values(DIRS)];

export default function ScrollReveal({ children, className = '', delay = 0, direction = 'up', threshold = 0.12, once = true, style, id, as: Tag = 'div' }) {
  const ref = useRef(null);
  const [settled, setSettled] = useState(false); // once landed, React renders it without the reveal classes
  const dir = DIRS[direction] || 'sr-up';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const done = () => { el.classList.remove(...ALL); el.style.removeProperty('--srd'); if (once) setSettled(true); };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { done(); return; }

    let timer;
    const onEnd = (e) => { if (e.target === el) { el.removeEventListener('animationend', onEnd); clearTimeout(timer); done(); } };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.setProperty('--srd', `${delay}ms`);
          el.classList.add('sr-visible');
          if (once) {
            observer.disconnect();
            el.addEventListener('animationend', onEnd);
            timer = setTimeout(done, 1500 + delay); // safety net if animationend never fires
          }
        } else if (!once) {
          el.classList.remove('sr-visible');
        }
      },
      { threshold, rootMargin: '0px 0px -6% 0px' }
    );
    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(timer); el.removeEventListener('animationend', onEnd); };
  }, [delay, threshold, once]);

  return (
    <Tag ref={ref} id={id} className={settled ? className : `sr ${dir} ${className}`} style={style} suppressHydrationWarning>
      {children}
    </Tag>
  );
}
