// components/BrandMarks.jsx — the platform marks shown on the Social Media and Google Ads
// service cards (which platforms we run for the client). Drawn inline, no network requests.
import { GoogleG } from '@/components/ReviewsGlyphs';

export const InstagramMark = ({ className = '' }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <defs>
      <radialGradient id="igGrad" cx="30%" cy="107%" r="150%">
        <stop offset="0" stopColor="#fdf497" />
        <stop offset=".05" stopColor="#fdf497" />
        <stop offset=".45" stopColor="#fd5949" />
        <stop offset=".6" stopColor="#d6249f" />
        <stop offset=".9" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect width="48" height="48" rx="13" fill="url(#igGrad)" />
    <rect x="11" y="11" width="26" height="26" rx="8" fill="none" stroke="#fff" strokeWidth="3.2" />
    <circle cx="24" cy="24" r="6.3" fill="none" stroke="#fff" strokeWidth="3.2" />
    <circle cx="32.4" cy="15.6" r="1.9" fill="#fff" />
  </svg>
);

export const FacebookMark = ({ className = '' }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <circle cx="24" cy="24" r="24" fill="#1877F2" />
    <path fill="#fff" d="M26.6 48V31h5.4l.9-6.6h-6.3v-4.2c0-1.9.6-3.2 3.3-3.2h3.4v-5.9c-.6-.1-2.6-.3-4.9-.3-4.9 0-8.2 3-8.2 8.4v5.2h-5.5V31h5.5v17z" />
  </svg>
);

/* Instagram + Facebook side by side, slightly overlapping — they part a little on hover */
export function SocialMarks() {
  return (
    <span className="brand-duo" role="img" aria-label="Instagram · Facebook">
      <span className="brand-tile ig"><InstagramMark className="w-full h-full" /></span>
      <span className="brand-tile fb"><FacebookMark className="w-full h-full" /></span>
    </span>
  );
}

/* Google «G» on a white tile */
export function GoogleMark() {
  return (
    <span className="brand-tile g" role="img" aria-label="Google">
      <GoogleG className="w-7 h-7" />
    </span>
  );
}

/* Line versions in the site's own icon style (cyan strokes, same tile as the other service icons) */
export const InstagramLine = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r=".9" fill="currentColor" stroke="none" />
  </svg>
);
export const FacebookLine = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M15.5 3.5h-2.2c-2.4 0-3.8 1.5-3.8 4v2.6H7v3.3h2.5V21h3.4v-7.6h2.6l.5-3.3h-3.1V8c0-.9.4-1.4 1.4-1.4h1.7z" />
  </svg>
);
export const GoogleLine = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M19.4 6.8A9 9 0 1 0 21 12h-8.5" />
  </svg>
);
