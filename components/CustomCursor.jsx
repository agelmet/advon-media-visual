// components/CustomCursor.jsx
// Subtle cursor accent: the native cursor stays fully visible; a soft
// brand-colored glow ring trails it with a smooth lerp. Desktop
// (fine-pointer) only — disabled on touch devices and when the user
// prefers reduced motion.
'use client';
import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const ringRef = useRef(null);
  const haloRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Desktop mice/trackpads only; never on touch, never with reduced motion.
    const fine = window.matchMedia('(pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduced.matches) return;
    setEnabled(true);

    const target = { x: -200, y: -200 };
    const ring = { x: -200, y: -200 };
    const halo = { x: -200, y: -200 };
    let raf;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onOver = (e) => {
      setHovering(!!e.target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer, label'));
    };

    const animate = () => {
      // Tight lerp: the ring feels attached, never laggy.
      ring.x += (target.x - ring.x) * 0.28;
      ring.y += (target.y - ring.y) * 0.28;
      halo.x += (target.x - halo.x) * 0.16;
      halo.y += (target.y - halo.y) * 0.16;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      if (haloRef.current) haloRef.current.style.transform = `translate3d(${halo.x}px, ${halo.y}px, 0)`;
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Soft halo — a faint, wider breath of brand color */}
      <div
        ref={haloRef}
        data-cursor-fx=""
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{ willChange: 'transform', opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease' }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: '90px',
            height: '90px',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(71,200,245,0.10) 0%, rgba(71,200,245,0.04) 45%, transparent 70%)',
          }}
        />
      </div>

      {/* Trailing accent ring */}
      <div
        ref={ringRef}
        data-cursor-fx=""
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ willChange: 'transform', opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease' }}
      >
        <div
          className="absolute rounded-full transition-all duration-300 ease-out"
          style={{
            width: hovering ? '34px' : '24px',
            height: hovering ? '34px' : '24px',
            transform: 'translate(-50%, -50%)',
            border: `1px solid ${hovering ? 'rgba(71,200,245,0.7)' : 'rgba(71,200,245,0.35)'}`,
            boxShadow: hovering
              ? '0 0 18px rgba(71,200,245,0.3), inset 0 0 8px rgba(71,200,245,0.08)'
              : '0 0 10px rgba(71,200,245,0.12)',
          }}
        />
      </div>
    </>
  );
}
