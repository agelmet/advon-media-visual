// components/Spotlight.jsx — desktop-only: glass cards get a soft pool of light that follows
// the pointer while hovering (the classic "premium card" touch). One delegated listener;
// it only writes two CSS variables on the card under the cursor, nothing repaints elsewhere.
'use client';
import { useEffect } from 'react';

export default function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
    let raf = 0, pending = null;
    const apply = () => {
      raf = 0;
      const { card, x, y } = pending; pending = null;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--sx', `${((x - r.left) / r.width * 100).toFixed(1)}%`);
      card.style.setProperty('--sy', `${((y - r.top) / r.height * 100).toFixed(1)}%`);
    };
    const onMove = (e) => {
      const card = e.target.closest && e.target.closest('.glass-panel');
      if (!card) return;
      pending = { card, x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => { document.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, []);
  return null;
}
