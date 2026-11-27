// components/ReviewsColumns.jsx — the 140+ review cards and their auto-scrolling columns.
// Loaded on demand by Reviews.jsx only when the section is about to scroll into view, so the
// home page's first paint no longer carries 220 cards of HTML and the 70KB review list.
'use client';
import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { googleReviews } from '@/lib/reviews';
import { portfolioData } from '@/lib/data';
import { REVIEW_SITE } from '@/lib/review-sites';
import { REVIEWS_URL } from '@/lib/reviews-meta';
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

/* ─── Review + the website we built for that person (27 Nov 2026) ───────────────────────────
   PAIRS  = every review whose writer has a live site in the portfolio (lib/review-sites.js):
            written reviews first (newest first), then the star-only ones.
   OTHERS = every other review; they show as plain cards under the spotlight. */
const SITE_BY_URL = new Map(portfolioData.map((p) => [p.url, p]));
const PAIRS = (() => {
  const all = googleReviews
    .map((review) => ({ review, site: SITE_BY_URL.get(REVIEW_SITE[review.name]) }))
    .filter((x) => x.site);
  const written = all.filter((x) => x.review.text);
  // two reviews of the same site never follow each other
  for (let k = 1; k < written.length; k++) {
    if (written[k].site === written[k - 1].site && k + 6 < written.length) {
      const [moved] = written.splice(k, 1);
      written.splice(k + 6, 0, moved);
    }
  }
  return [...written, ...all.filter((x) => !x.review.text)];
})();
const PAIRED = new Set(PAIRS.map((x) => x.review));
export const OTHERS = googleReviews.filter((r) => !PAIRED.has(r));
// one show: first every review that has a website, then (at the very end) the ones without
const SLIDES = [...PAIRS, ...OTHERS.map((review) => ({ review, site: null }))];

const host = (url) => url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
const SLIDE_MS = 3200;

export function Spotlight({ lang, reduced }) {
  const el = lang === 'el';
  const n = SLIDES.length;
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);            // 1 = came from the right, -1 = from the left
  const [prev, setPrev] = useState(null);
  const [open, setOpen] = useState(false);       // «Περισσότερα» pressed: the text scrolls, the show waits
  const [paused, setPaused] = useState(false);   // the visitor pressed pause
  const [seen, setSeen] = useState(false);       // on screen
  const [long, setLong] = useState(false);
  const rootRef = useRef(null);
  const railRef = useRef(null);
  const textRef = useRef(null);

  const go = useCallback((to, d) => {
    setI((cur) => {
      const next = ((to % n) + n) % n;
      if (next !== cur) { setPrev(cur); setDir(d || (to >= cur ? 1 : -1)); }
      return next;
    });
    setOpen(false);
  }, [n]);

  // phones: swipe left / right over the frame to change review
  const touch = useRef(null);
  const swipedAt = useRef(0);
  const onTouchStart = (e) => { const t = e.touches[0]; touch.current = { x: t.clientX, y: t.clientY }; };
  const onTouchEnd = (e) => {
    const from = touch.current; touch.current = null;
    if (!from) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - from.x, dy = t.clientY - from.y;
    if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
    swipedAt.current = Date.now();
    if (dx < 0) go(i + 1, 1); else go(i - 1, -1);
  };
  // a swipe that ends on the website link must not open the website
  const onClickCapture = (e) => { if (Date.now() - swipedAt.current < 450) { e.preventDefault(); e.stopPropagation(); } };

  // only run while the spotlight is on screen
  useEffect(() => {
    const node = rootRef.current;
    if (!node || !('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.25 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // is the review longer than its box?
  useLayoutEffect(() => {
    const t = textRef.current;
    if (t) setLong(t.scrollHeight > t.clientHeight + 4);
  }, [i, lang]);

  // keep the active thumbnail in the middle of the strip (scrolls the strip only, never the page)
  useEffect(() => {
    const rail = railRef.current;
    const cur = rail && rail.children[i];
    if (!cur) return;
    rail.scrollTo({ left: cur.offsetLeft - rail.clientWidth / 2 + cur.clientWidth / 2, behavior: reduced ? 'auto' : 'smooth' });
  }, [i, reduced]);

  const running = seen && !open && !paused && !reduced;
  const { review, site } = SLIDES[i];
  const before = prev != null ? SLIDES[prev] : null;
  const after = SLIDES[(i + 1) % n];
  const text = el ? review.text : review.textEn;
  const siteName = site ? (el ? site.name : site.nameEn) : '';
  const sizes = '(max-width: 1023px) 92vw, 700px';

  return (
    <div ref={rootRef} className={`rvs ${running ? 'is-running' : ''} ${dir < 0 ? 'from-left' : 'from-right'}`}>
      <div className="rvs-frame" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onClickCapture={onClickCapture}>
        {/* the bar that fills = the time left; when it is full the next review comes */}
        <span key={`bar-${i}`} className="rvs-bar" style={{ animationDuration: `${SLIDE_MS}ms` }} onAnimationEnd={() => go(i + 1, 1)} aria-hidden="true" />

        <div className="rvs-grid">
          {/* the website (shown whole, never cropped) — or, for a review with no website, a Google panel of the same size */}
          {site ? (
            <a href={site.url} target="_blank" rel="noopener noreferrer" className="rvs-site group" aria-label={`${siteName} — ${host(site.url)}`}>
              <span className="rvs-chrome" aria-hidden="true">
                <i /><i /><i />
                <b key={`h-${i}`} className="rvs-url">{host(site.url)}</b>
                <em>Live</em>
              </span>
              <span className="rvs-shot">
                {before && before.site && before.site !== site && (
                  <Image key={`o-${prev}`} src={before.site.image} alt="" fill sizes={sizes} className="rvs-img rvs-out" />
                )}
                <Image key={`c-${i}`} src={site.image} alt={siteName} fill sizes={sizes} className="rvs-img rvs-in" priority={false} />
                <span key={`cap-${i}`} className="rvs-cap">
                  <span className="rvs-cap-t">{siteName}</span>
                  <span className="rvs-cap-b">
                    <span className="rvs-cap-l">{el ? 'Δείτε την ιστοσελίδα' : 'Visit the website'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
                  </span>
                </span>
              </span>
            </a>
          ) : (
            <a href={REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="rvs-site rvs-nosite group" aria-label={el ? 'Δείτε την αξιολόγηση στη Google' : 'See the review on Google'}>
              <span key={`g-${i}`} className="rvs-gpanel">
                <GoogleG className="w-14 h-14 md:w-16 md:h-16" />
                <span className="rvs-gscore">{'5,0'}</span>
                <span className="rvs-stars flex gap-1 text-[#FBBC05]">{[1, 2, 3, 4, 5].map((k) => <GoogleStar key={k} className="w-7 h-7 md:w-8 md:h-8" style={{ '--s': k }} />)}</span>
                <span className="rvs-gtext">{el ? 'Αξιολόγηση στη Google' : 'Review on Google'}</span>
                <span className="rvs-cap-b rvs-gbtn">
                  <span>{el ? 'Δείτε τη στη Google' : 'See it on Google'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
                </span>
              </span>
            </a>
          )}
          {/* the next website is fetched quietly so the switch is instant */}
          {after.site && <span className="rvs-pre" aria-hidden="true"><Image key={`n-${(i + 1) % n}`} src={after.site.image} alt="" fill sizes={sizes} /></span>}

          {/* the review, as it is on Google */}
          <div className="rvs-review">
            <div key={`r-${i}`} className="rvs-slide">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar review={review} />
                  <div className="min-w-0">
                    <h3 className="rvs-name text-[#202124] font-semibold text-base leading-tight">{review.name}</h3>
                    <div className="rvs-stars flex gap-0.5 text-[#FBBC05] mt-1.5" aria-label={el ? 'Βαθμολογία 5 στα 5' : 'Rated 5 out of 5'}>
                      {[1, 2, 3, 4, 5].map((s) => <GoogleStar key={s} className="w-[18px] h-[18px]" style={{ '--s': s }} />)}
                    </div>
                  </div>
                </div>
                <GoogleG className="w-6 h-6 shrink-0 mt-1" />
              </div>

              {text ? (
                <div ref={textRef} className={`rvs-text ${open ? 'is-open' : ''} ${long && !open ? 'is-long' : ''}`} tabIndex={open ? 0 : undefined}>
                  <p className="whitespace-pre-line">{text}</p>
                </div>
              ) : (
                <div ref={textRef} className="rvs-text rvs-staronly">
                  <div className="flex gap-1 text-[#FBBC05]">{[1, 2, 3, 4, 5].map((s) => <GoogleStar key={s} className="w-9 h-9" />)}</div>
                  <p>{el ? 'Αξιολόγηση 5 αστέρων στη Google' : '5-star rating on Google'}</p>
                </div>
              )}

              {/* the row is always there, so the card keeps one height whether the button shows or not */}
              <div className="rvs-more-row">
                {(long || open) && (
                  <button type="button" onClick={() => setOpen((o) => !o)} className="rvs-more">
                    {open ? (el ? 'Λιγότερα' : 'Less') : (el ? 'Περισσότερα' : 'More')}
                  </button>
                )}
              </div>
            </div>

            <div className="rvs-ctrl">
              <span className="rvs-count" aria-live="off"><b>{i + 1}</b> / 140+</span>
              <span className="rvs-btns">
                <button type="button" onClick={() => go(i - 1)} aria-label={el ? 'Προηγούμενη αξιολόγηση' : 'Previous review'}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                {!reduced && (
                  <button type="button" onClick={() => setPaused((v) => !v)} aria-label={paused ? (el ? 'Συνέχεια' : 'Play') : (el ? 'Παύση' : 'Pause')} aria-pressed={paused}>
                    {paused
                      ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>
                      : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><rect x="6.5" y="5" width="4" height="14" rx="1" /><rect x="13.5" y="5" width="4" height="14" rx="1" /></svg>}
                  </button>
                )}
                <button type="button" onClick={() => go(i + 1)} aria-label={el ? 'Επόμενη αξιολόγηση' : 'Next review'}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* every site in one strip: tap one to jump to its review */}
      <div className="rvs-rail-wrap">
        <div ref={railRef} className="rvs-rail" role="group" aria-label={el ? 'Όλες οι αξιολογήσεις' : 'All reviews'}>
          {SLIDES.map((x, k) => (
            <button key={k} type="button" onClick={() => go(k)} className={`rvs-thumb ${k === i ? 'is-on' : ''} ${x.site ? '' : 'rvs-thumb-g'}`}
              aria-label={x.site ? `${x.review.name} — ${host(x.site.url)}` : x.review.name} aria-current={k === i ? 'true' : undefined}>
              {x.site
                ? <Image src={x.site.image} alt="" width={160} height={120} sizes="132px" loading="lazy" draggable={false} />
                : <span className="rvs-thumb-in"><i style={{ backgroundColor: avatarColor(x.review.name) }}>{x.review.name.charAt(0).toUpperCase()}</i><GoogleG className="w-3.5 h-3.5" /></span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Static, non-moving fallback grid (prefers-reduced-motion). */
export function StaticGrid({ lang, reviews = googleReviews }) {
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const total = reviews.length;
  const remaining = total - visible;

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {reviews.slice(0, visible).map((review) => (
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
export function MarqueeColumns({ lang, columnCount, reviews = googleReviews }) {
  // Distribute reviews evenly: review index % columnCount → column (index % 4 on desktop).
  const columns = Array.from({ length: columnCount }, () => []);
  reviews.forEach((review, i) => columns[i % columnCount].push(review));

  return (
    <div
      className="reviews-viewport grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
    >
      {columns.map((col, ci) => {
        // Columns 1 & 3 scroll up, 2 & 4 scroll down (adjacent columns opposite).
        const goingUp = ci % 2 === 0;
        // the durations were tuned for 34 cards a column; fewer cards = a shorter loop at the same pace
        const duration = Math.max(24, Math.round(COLUMN_DURATIONS[ci % COLUMN_DURATIONS.length] * col.length / 34));
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

