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

## Working notes (5 Sept 2026, after the v2 rebuild)
- Repo: `agelmet/advon-media-visual` (public), branch `main`; Netlify project `advonmediaa` (team `advonmd`) deploys every push in ~2 min; Vercel and GitHub Pages also build it but are mirrors only. v2 went live on 5 Sept 2026 (commits `7e0819e` + `ee12095`).
- Pushing: `~/Documents/ADVON-CLIENTS/.advon/push.sh ~/Desktop/advon-media` (reads the GitHub token from `ADVON-CLIENTS/.advon/secrets.env`; from a Cowork device shell the paths are `$HOME/mnt/ADVON-CLIENTS/.advon/push.sh $HOME/mnt/advon-media`). Never write the token into `.git/config`, a commit, or this file. Netlify API: `ADVON-CLIENTS/.advon/netlify.sh` (macOS only — the Cowork device shell cannot reach api.netlify.com; use Chrome on app.netlify.com there).
- After every push: check app.netlify.com → advonmedia.com shows «Published», then load the live page in Chrome, read console for `Refused|Content Security|rror`, check `/dorean-istoselida` + `/dorean-istoselida/efcharisto` (Zoho iframe must render) and run PageSpeed mobile.
- `lib/nav.js` holds the menu labels used by Header/Footer (keeps the 66KB catalogue out of the shared JS). Update it whenever `lib/services.js` nav labels change.
- Fonts are self-hosted via `next/font` (`lib/fonts.js`). A container without internet can build with `NEXT_FONT_GOOGLE_MOCKED_RESPONSES=<mock.js> npx next build --webpack` (Turbopack ignores the mock).
- Lead inbox: `/api/lead` reuses `CRM_GH_TOKEN` / `CRM_GH_REPO` (leads stored in `leads/inbox.json` of the data repo). Optional: `RESEND_API_KEY` + `LEAD_NOTIFY_TO`, `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`, `NEXT_PUBLIC_META_PIXEL_ID` — all set in Netlify → Environment variables.
- Device shell cannot delete files: before every git command `mv .git/*.lock _to_delete/`; replace files with `git show ref:path > path` (never `git checkout -- path`); move deletions into `_to_delete/` (gitignored).
