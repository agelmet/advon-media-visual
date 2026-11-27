// components/SiteRiver.jsx — «the river» (27 Nov 2026): two rows of REAL client sites in small
// browser frames, drifting in opposite directions on a plane tilted into the sky. Proof you can see
// in the first scroll — instead of an AI video of invented websites.
// Decorative by default (aria-hidden, no pointer events); with `links` (home page, 27 Nov 2026) every
// tile opens that live site in a new tab and the rows pause under the pointer so a click is easy.
// /istoselida keeps them decorative on purpose: the ads page should not send visitors away.
// Transform only; paused off screen and in a hidden tab; still under reduced motion.
'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { SHOWCASE } from '@/lib/showcase';

function Row({ items, rev, links }) {
  return (
    <div className={`river-row ${rev ? 'r' : ''}`}>
      {[...items, ...items].map((it, i) => {
        const inner = (
          <>
            <div className="river-bar"><i /><i /><i /><span>{it.domain}</span></div>
            <Image src={it.src} alt="" width={320} height={240} sizes="(max-width: 640px) 210px, 300px" loading="lazy" draggable={false} />
          </>
        );
        if (!links) return <div key={i} className="river-tile">{inner}</div>;
        // the second copy only exists to make the loop seamless: hidden from screen readers and the Tab key
        const copy = i >= items.length;
        return (
          <a key={i} className="river-tile" href={`https://${it.domain}`} target="_blank" rel="noopener"
            aria-label={copy ? undefined : it.domain} aria-hidden={copy || undefined} tabIndex={copy ? -1 : undefined} draggable={false}>
            {inner}
          </a>
        );
      })}
    </div>
  );
}

export default function SiteRiver({ children, className = '', links = false }) {
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
    <div ref={ref} className={`river off ${links ? 'river-links' : ''} ${className}`}>
      <div className="river-view" aria-hidden={links ? undefined : 'true'}>
        <div className="river-plane">
          <Row items={SHOWCASE.slice(0, half)} links={links} />
          <Row items={SHOWCASE.slice(half)} rev links={links} />
        </div>
      </div>
      {children && <div className="river-cap">{children}</div>}
    </div>
  );
}
