// components/SiteRiver.jsx — «the river» (27 Nov 2026): two rows of REAL client sites in small
// browser frames, drifting in opposite directions on a plane tilted into the sky. Proof you can see
// in the first scroll — instead of an AI video of invented websites.
// Decorative (aria-hidden, no pointer events); the caption under it is the link.
// Transform only; paused off screen and in a hidden tab; still under reduced motion.
'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { SHOWCASE } from '@/lib/showcase';

function Row({ items, rev }) {
  return (
    <div className={`river-row ${rev ? 'r' : ''}`}>
      {[...items, ...items].map((it, i) => (
        <div key={i} className="river-tile">
          <div className="river-bar"><i /><i /><i /><span>{it.domain}</span></div>
          <Image src={it.src} alt="" width={320} height={240} sizes="(max-width: 640px) 210px, 300px" loading="lazy" draggable={false} />
        </div>
      ))}
    </div>
  );
}

export default function SiteRiver({ children, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle('off', !e.isIntersecting), { rootMargin: '120px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const half = Math.ceil(SHOWCASE.length / 2);
  return (
    <div ref={ref} className={`river off ${className}`}>
      <div className="river-view" aria-hidden="true">
        <div className="river-plane">
          <Row items={SHOWCASE.slice(0, half)} />
          <Row items={SHOWCASE.slice(half)} rev />
        </div>
      </div>
      {children && <div className="river-cap">{children}</div>}
    </div>
  );
}
