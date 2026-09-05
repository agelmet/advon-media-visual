// components/home/ui.jsx — small shared pieces for the homepage & landing page (server-safe)
import Bi from '@/components/Bi';
import { WORK } from '@/lib/home';

export function GoogleG({ className = 'g-logo' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.1 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.5z"/>
    </svg>
  );
}

export function Stars({ className = 'w-4 h-4' }) {
  return (
    <span className="inline-flex gap-0.5 text-gold" role="img" aria-label="5 από 5 αστέρια">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true"><path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.06 1.11-6.46-4.7-4.58 6.49-.94L12 2.5z"/></svg>
      ))}
    </span>
  );
}

export function SectionHead({ eyebrow, title, lede, className = '' }) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <Bi as="span" className="eyebrow" el={eyebrow.el} en={eyebrow.en} />
      <Bi as="h2" className="font-display text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.05] mt-4 mb-4 text-paper" el={title.el} en={title.en} />
      {lede && <Bi as="p" className="text-paper-2 text-lg leading-relaxed" el={lede.el} en={lede.en} />}
    </div>
  );
}

/* One site screenshot as a browser-style mockup */
export function WorkImage({ item, widths = [600, 800, 1400], sizes = '(min-width: 1024px) 560px, 100vw', priority = false, className = '' }) {
  const w = item.key;
  return (
    <picture>
      <source type="image/avif" srcSet={widths.map((x) => `/img/work/${w}-${x}.avif ${x}w`).join(', ')} sizes={sizes} />
      <img
        src={`/img/work/${w}-800.webp`}
        srcSet={widths.map((x) => `/img/work/${w}-${x}.webp ${x}w`).join(', ')}
        sizes={sizes}
        width="1400"
        height="802"
        alt={item.alt.el}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        className={`block w-full h-auto ${className}`}
      />
    </picture>
  );
}

export function workByKey(key) {
  return WORK.find((w) => w.key === key);
}

/* Server-safe service icons (the legacy ICONS map lives in a client module) */
export function ServiceIcon({ name, className = 'w-5 h-5' }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className, 'aria-hidden': true };
  switch (name) {
    case 'star': return <svg {...common}><path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.06 1.11-6.46-4.7-4.58 6.49-.94L12 2.5z"/></svg>;
    case 'calendar': return <svg {...common}><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
    case 'bot': return <svg {...common}><rect width="18" height="12" x="3" y="8" rx="2"/><path d="M12 2v6M8 14h.01M16 14h.01"/></svg>;
    case 'building': return <svg {...common}><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M12 14h.01M8 14h.01M16 14h.01"/></svg>;
    case 'qr': return <svg {...common}><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3M21 21v.01M12 7v3a2 2 0 0 1-2 2H7M3 12h.01M12 3h.01M12 16v.01M16 12h1M21 12v.01M12 21v-1"/></svg>;
    case 'code': return <svg {...common}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
    default: return <svg {...common}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
  }
}
