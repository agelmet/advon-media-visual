// components/ReviewsColumns.jsx — the 110+ review cards and their auto-scrolling columns.
// Loaded on demand by Reviews.jsx only when the section is about to scroll into view, so the
// home page's first paint no longer carries 220 cards of HTML and the 70KB review list.
'use client';
import { useState } from 'react';
import { googleReviews } from '@/lib/reviews';
import { GoogleStar, GoogleG } from '@/components/ReviewsGlyphs';

const INITIAL_VISIBLE = 12;
const LOAD_STEP = 24;
const CLAMP_CHARS = 220;

// Per-column loop durations (seconds) so adjacent columns never move in lockstep.
const COLUMN_DURATIONS = [78, 92, 84, 88];

/* Google-style deterministic avatar colors (initial-letter fallback) */
const AVATAR_COLORS = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#039BE5', '#0097A7', '#00796B', '#43A047', '#7CB342', '#EF6C00', '#F4511E', '#795548', '#607D8B'];

function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function Avatar({ review }) {
  const { name, photo } = review;
  const [broken, setBroken] = useState(false);
  if (photo && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt=""
        onError={() => setBroken(true)}
        className="w-10 h-10 rounded-full object-cover shrink-0 select-none"
      />
    );
  }
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium shrink-0 select-none"
      style={{ backgroundColor: avatarColor(name) }}
      aria-hidden="true"
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function ReviewCard({ review, lang }) {
  const [expanded, setExpanded] = useState(false);
  const { name } = review;
  const text = lang === 'el' ? review.text : review.textEn;
  const isLong = text.length > CLAMP_CHARS;
  const shown = isLong && !expanded ? text.slice(0, CLAMP_CHARS).trimEnd() + '…' : text;

  return (
    <div className="break-inside-avoid mb-4 bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.4)] border border-white/70 hover:shadow-[0_6px_24px_rgba(0,0,0,0.5)] transition-shadow duration-300">
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar review={review} />
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

/* Static, non-moving fallback grid (prefers-reduced-motion). */
export function StaticGrid({ lang }) {
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const total = googleReviews.length;
  const remaining = total - visible;

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {googleReviews.slice(0, visible).map((review) => (
          <ReviewCard key={review.name} review={review} lang={lang} />
        ))}
      </div>
      <div className="text-center mt-8">
        {remaining > 0 && (
          <button
            onClick={() => setVisible((v) => Math.min(v + LOAD_STEP, total))}
            className="btn-premium inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-[#202124] rounded-full font-bold text-sm shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.55)] transition-all duration-300"
          >
            {lang === 'el' ? 'Περισσότερες αξιολογήσεις' : 'More reviews'}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m6 9 6 6 6-6" /></svg>
          </button>
        )}
      </div>
    </>
  );
}

/* Vertical auto-scrolling columns marquee. */
export function MarqueeColumns({ lang, columnCount }) {
  // Distribute reviews evenly: review index % columnCount → column (index % 4 on desktop).
  const columns = Array.from({ length: columnCount }, () => []);
  googleReviews.forEach((review, i) => columns[i % columnCount].push(review));

  return (
    <div
      className="reviews-viewport grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
    >
      {columns.map((col, ci) => {
        // Columns 1 & 3 scroll up, 2 & 4 scroll down (adjacent columns opposite).
        const goingUp = ci % 2 === 0;
        const duration = COLUMN_DURATIONS[ci % COLUMN_DURATIONS.length];
        return (
          <div key={ci} className="min-w-0">
            <div
              className="reviews-col"
              style={{
                animationName: goingUp ? 'reviewsScrollUp' : 'reviewsScrollDown',
                animationDuration: `${duration}s`,
              }}
            >
              {/* Duplicate the card set so the -50% loop is seamless/infinite. */}
              {[...col, ...col].map((review, idx) => (
                <ReviewCard key={`${ci}-${idx}`} review={review} lang={lang} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

