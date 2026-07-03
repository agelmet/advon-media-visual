// components/TiltCard.jsx
'use client';
import { useRef } from 'react';

export default function TiltCard({ children, className = '', max = 6 }) {
  const innerRef = useRef(null);

  const canTilt = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches;

  const onMove = (e) => {
    const el = innerRef.current;
    if (!el || !canTilt()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
  };

  const onLeave = () => {
    const el = innerRef.current;
    if (el) el.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div className={`tilt-wrap ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={innerRef} className="tilt-inner h-full">
        {children}
      </div>
    </div>
  );
}
