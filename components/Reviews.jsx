// components/Reviews.jsx
'use client';
import { useState } from 'react';
import { useLangStore } from '@/store/langStore';
import { googleReviews, REVIEWS_URL, OVERALL_RATING } from '@/lib/reviews';
import ScrollReveal from '@/components/ScrollReveal';

const INITIAL_VISIBLE = 12;
const LOAD_STEP = 24;
const CLAMP_CHARS = 220;

const GoogleStar = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

/* Official Google "G" */
const GoogleG = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

/* Google-style deterministic avatar colors (initial-letter fallback) */
const AVATAR_COLORS = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#039BE5', '#0097A7', '#00796B', '#43A047', '#7CB342', '#EF6C00', '#F4511E', '#795548', '#607D8B'];

function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function ReviewCard({ review, lang }) {
  const [expanded, setExpanded] = useState(false);
  const { name, text } = review;
  const isLong = text.length > CLAMP_CHARS;
  const shown = isLong && !expanded ? text.slice(0, CLAMP_CHARS).trimEnd() + '…' : text;

  return (
    <div className="break-inside-avoid mb-4 bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.4)] border border-white/70 hover:shadow-[0_6px_24px_rgba(0,0,0,0.5)] transition-shadow duration-300">
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium shrink-0 select-none"
            style={{ backgroundColor: avatarColor(name) }}
            aria-hidden="true"
          >
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h4 className="text-[#202124] font-semibold text-[15px] leading-tight truncate">{name}</h4>
            <div className="flex gap-0.5 text-[#FBBC05] mt-1" aria-label={lang === 'el' ? 'Βαθμολογία 5 στα 5' : 'Rated 5 out of 5'}>
              {[1, 2, 3, 4, 5].map((s) => <GoogleStar key={s} className="w-4 h-4" />)}
            </div>
          </div>
        </div>
        <GoogleG className="w-5 h-5 shrink-0 mt-1" />
      </div>

      {text ? (
        <>
          <p className="text-[#3c4043] text-sm leading-relaxed whitespace-pre-line">{shown}</p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1.5 text-[#1a73e8] text-sm font-medium hover:underline"
            >
              {expanded ? (lang === 'el' ? 'Λιγότερα' : 'Less') : (lang === 'el' ? 'Περισσότερα' : 'More')}
            </button>
          )}
        </>
      ) : (
        <p className="text-[#80868b] text-sm italic">
          {lang === 'el' ? 'Αξιολόγηση 5 αστέρων' : '5-star rating'}
        </p>
      )}
    </div>
  );
}

export default function Reviews() {
  const { lang } = useLangStore();
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const total = googleReviews.length;
  const remaining = total - visible;

  return (
    <section id="reviews" className="py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[70%] bg-electric-cyan/4 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px cyber-divider" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <span className="section-label">{lang === 'el' ? 'Αξιολογήσεις' : 'Reviews'}</span>
          <h2 className="text-4xl md:text-5xl font-black font-display mb-6 text-white tracking-tight flex items-center justify-center gap-4 flex-wrap">
            <GoogleG className="w-10 h-10 md:w-12 md:h-12" />
            {lang === 'el' ? 'Αξιολογήσεις στη Google' : 'Google Reviews'}
          </h2>

          {/* Rating summary */}
          <div className="inline-flex items-center gap-4 bg-white rounded-2xl px-7 py-4 shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
            <span className="text-5xl font-black text-[#202124]">{OVERALL_RATING}</span>
            <div className="flex flex-col items-start gap-1">
              <div className="flex gap-0.5 text-[#FBBC05]" style={{ filter: 'drop-shadow(0 0 6px rgba(251,188,5,0.45))' }}>
                {[1, 2, 3, 4, 5].map((s) => <GoogleStar key={s} className="w-6 h-6" />)}
              </div>
              <span className="text-[#5f6368] font-medium text-sm">
                {total} {lang === 'el' ? 'αξιολογήσεις στη Google' : 'reviews on Google'}
              </span>
            </div>
          </div>

          <div className="mt-7">
            <a
              href={REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium inline-flex items-center gap-3 px-7 py-3.5 bg-white text-[#1a73e8] rounded-full font-bold text-sm shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_28px_rgba(66,133,244,0.35)] transition-all duration-300"
            >
              <GoogleG className="w-[18px] h-[18px]" />
              {lang === 'el' ? 'Δείτε όλες τις αξιολογήσεις στη Google' : 'See all reviews on Google'}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" /></svg>
            </a>
          </div>
        </ScrollReveal>

        {/* Review cards — masonry columns */}
        <ScrollReveal direction="fade" delay={60}>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {googleReviews.slice(0, visible).map((review) => (
              <ReviewCard key={review.name} review={review} lang={lang} />
            ))}
          </div>

          {/* Load more */}
          <div className="text-center mt-8 flex flex-col items-center gap-3">
            {remaining > 0 ? (
              <button
                onClick={() => setVisible((v) => Math.min(v + LOAD_STEP, total))}
                className="btn-premium inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-[#202124] rounded-full font-bold text-sm shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.55)] transition-all duration-300"
              >
                {lang === 'el' ? 'Περισσότερες αξιολογήσεις' : 'More reviews'}
                <span className="text-[#5f6368] font-medium">(+{Math.min(LOAD_STEP, remaining)})</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m6 9 6 6 6-6" /></svg>
              </button>
            ) : (
              <a
                href={REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-electric-cyan font-bold text-sm hover:underline"
              >
                {lang === 'el' ? 'Δείτε τις αξιολογήσεις και στη Google' : 'Also see the reviews on Google'}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" /></svg>
              </a>
            )}
            <span className="text-gray-500 text-xs">
              {lang === 'el'
                ? `Εμφανίζονται ${Math.min(visible, total)} από ${total} αξιολογήσεις`
                : `Showing ${Math.min(visible, total)} of ${total} reviews`}
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
