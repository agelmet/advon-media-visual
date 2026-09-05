@AGENTS.md

# advonmedia.com — project notes (Sept 2026)

## Stack (verified from the repo)
- Next.js 16 (app router, JSX), React 19, Tailwind 4 via @tailwindcss/postcss, zustand for the EL/EN language store, lucide-react icons.
- Live site is served by **Netlify** (not the Vercel project `advon-media-visual`, which is a mirror). Env vars go in Netlify.
- `public/crm/index.html` is the Advon CRM (single-file, encrypted, GitHub-backed sync via `app/api/crm/route.js`). Always back it up as `index.backup-YYYYMMDD.html` before editing; keep single-file, encrypted storage and sync layer intact.
- The Advon chat widget is an external script from advon-services.vercel.app loaded in `app/layout.jsx`.

## Audit of 5 Sept 2026 (PageSpeed, mobile, Slow 4G) — the numbers to beat
Performance 48 · Accessibility 82 · Best practices 77 · SEO 100 · FCP 3.2s · LCP 4.8s · TBT 1,320ms · CLS 0 · Speed Index 5.2s · 2,766 KiB · unused JS 927 KiB · render-blocking 1,520ms · 32 non-composited animations · no CrUX field data yet.
Root causes: Google Fonts via CSS @import; Playfair Display has no Greek glyphs (Greek headlines render in the system fallback serif); whole homepage is a client component pulling reviews.js/services.js/data.js into the bundle; starfield + aurora blur + laser sweeps + scanlines + custom cursor; blur() scroll reveals that leave the viewport blank; widget + Zoho iframe + raw.githubusercontent logo at load; no CSP/HSTS/XFO headers; a11y issues (form labels, iframe title, contrast, heading order, prohibited ARIA).

## Rebuild rules (direction chosen by Angelo: dark, cinematic)
- Server-render pages; hydrate only the language toggle, FAQ accordion and reviews strip. Ship the first 12 reviews, load the rest on demand.
- Fonts via `next/font` with `subsets: ['greek','latin']`: display GFS Didot (fallback Literata), body Manrope, figures JetBrains Mono. Never a face without the greek subset.
- Remove starfield, aurora blobs, lasers, scanlines, custom cursor and every looping glow. One accent (the Advon logo blue); gold only for stars; lime and purple retired. Warm-black ground (#0B0E12 → #141A21), warm off-white text (#F2EEE6), a static 4% grain layer.
- Hero: headline + ONE CTA + a slow cross-fading stack of real site mockups (assets in ADVON-CLIENTS/portfolio-heroes). Proof line with the Google logo linking to the live profile.
- Section order: hero → niche strip → «Πώς δουλεύει» (3 steps) → portfolio with niche filter → pricing card → reviews → three service tiles + link → FAQ → booking → footer.
- Reveals ≤ 500ms, transform/opacity only, rootMargin -8%; nothing blank at any scroll position.
- Self-host the logo; load the chat widget on first interaction; open the Zoho embed on click; sticky mobile bar Κλήση · Viber · Ραντεβού.
- Add `/dorean-istoselida` (ads landing page: promise text verbatim from the October Blueprint, three-site strip, review wall, 3-field form posting to the forms rail + CRM lead endpoint with utm_source/campaign/content) and its thank-you page with the Zoho embed; Meta Pixel Lead on submit, Schedule on booking.
- Security headers (CSP, HSTS, XFO, COOP) in netlify.toml; add llms.txt; OG image per page is a real mockup.
- Budget before any push: mobile Lighthouse ≥ 90 performance / ≥ 95 accessibility, LCP ≤ 2.0s, ≤ 900KB. Keep the review count consistent with the live Google figure everywhere (site, schema, ads).
