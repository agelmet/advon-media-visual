// components/CustomCursor.jsx
'use client';
import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setIsMounted(true);

    const target = { x: -200, y: -200 };
    const ring   = { x: -200, y: -200 };
    let raf;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const onOver = (e) => {
      const isInteractive = e.target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer, label');
      setIsHovering(!!isInteractive);
    };

    const animate = () => {
      // Dot follows cursor exactly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      }
      // Ring lags behind (lerp)
      ring.x += (target.x - ring.x) * 0.14;
      ring.y += (target.y - ring.y) * 0.14;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* Precise inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{ willChange: 'transform' }}
      >
        <div
          className="absolute rounded-full bg-electric-cyan transition-all duration-200"
          style={{
            width: isHovering ? '6px' : '5px',
            height: isHovering ? '6px' : '5px',
            transform: 'translate(-50%, -50%)',
            opacity: isHovering ? 0 : 1,
            boxShadow: '0 0 12px #47c8f5, 0 0 4px #47c8f5',
          }}
        />
      </div>

      {/* Lagging outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block"
        style={{ willChange: 'transform' }}
      >
        <div
          className="absolute rounded-full border transition-all duration-300"
          style={{
            width: isHovering ? '48px' : '32px',
            height: isHovering ? '48px' : '32px',
            transform: 'translate(-50%, -50%)',
            borderColor: isHovering ? '#47c8f5' : 'rgba(71,200,245,0.45)',
            background: isHovering ? 'rgba(71,200,245,0.08)' : 'transparent',
            backdropFilter: isHovering ? 'blur(4px)' : 'none',
            boxShadow: isHovering
              ? '0 0 20px rgba(71,200,245,0.4), inset 0 0 10px rgba(71,200,245,0.1)'
              : '0 0 8px rgba(71,200,245,0.15)',
          }}
        />
      </div>
    </>
  );
}
