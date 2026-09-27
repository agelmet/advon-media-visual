// components/Socials.jsx — the three Advon Media social profiles, one place for every link on the site.
// (Instagram @advon_media · Facebook page «Advon Media» · TikTok @advonmedia — checked 27 Sept 2026.)
export const SOCIALS = [
  { key: 'instagram', title: 'Instagram', handle: '@advon_media', href: 'https://www.instagram.com/advon_media' },
  { key: 'facebook', title: 'Facebook', handle: 'Advon Media', href: 'https://www.facebook.com/people/Advon-Media/61552890781956/' },
  { key: 'tiktok', title: 'TikTok', handle: '@advonmedia', href: 'https://www.tiktok.com/@advonmedia' },
];

/* Simple line icons drawn in-house (lucide dropped its brand icons). */
export function SocialIcon({ name, className = 'w-5 h-5' }) {
  if (name === 'instagram') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
  }
  if (name === 'facebook') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }
  if (name === 'tiktok') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    );
  }
  return null;
}

/* A compact icon row (footer, header drawer). */
export function SocialRow({ className = '', size = 'w-5 h-5' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {SOCIALS.map((s) => (
        <a
          key={s.key}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.title}
          title={`${s.title} · ${s.handle}`}
          className="social-btn w-11 h-11 rounded-xl border border-white/10 bg-white/[0.03] text-gray-400 flex items-center justify-center hover:text-[#050a0e] hover:bg-electric-cyan hover:border-electric-cyan hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(71,200,245,0.35)] transition-all duration-300"
        >
          <SocialIcon name={s.key} className={size} />
        </a>
      ))}
    </div>
  );
}
