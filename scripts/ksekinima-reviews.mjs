// scripts/ksekinima-reviews.mjs — writes public/ksekinima/reviews.json for the static «Ξεκινάμε τώρα» page.
// The page shows the SAME reviews show as the home page (components/ReviewsColumns.jsx → Spotlight):
// every Google review of lib/reviews.js, in the same order, next to the same website of lib/data.js.
// Runs before every build (package.json "prebuild"), so a new review on the home page appears there too.
// It never fails a build: on any problem it keeps the reviews.json that is already in the repo.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const grab = (src, name) => new Function(src.replace(/export const/g, 'const') + `;return ${name};`)();

try {
  const googleReviews = grab(read('lib/reviews.js'), 'googleReviews');
  const meta = read('lib/reviews-meta.js');
  const REVIEWS_URL = grab(meta, 'REVIEWS_URL');
  const OVERALL_RATING = grab(meta, 'OVERALL_RATING');
  const REVIEW_SITE = grab(read('lib/review-sites.js'), 'REVIEW_SITE');
  const data = read('lib/data.js');
  const portfolioData = grab(data.slice(data.indexOf('export const portfolioData'), data.indexOf('export const blogsData')), 'portfolioData');

  // — the same rules as ReviewsColumns.jsx (PAIRS / OTHERS / SLIDES) —
  const SITE_BY_URL = new Map(portfolioData.map((p) => [p.url, p]));
  const all = googleReviews.map((review) => ({ review, site: SITE_BY_URL.get(REVIEW_SITE[review.name]) })).filter((x) => x.site);
  const written = all.filter((x) => x.review.text);
  for (let k = 1; k < written.length; k++) {
    if (written[k].site === written[k - 1].site && k + 6 < written.length) {
      const [moved] = written.splice(k, 1);
      written.splice(k + 6, 0, moved);
    }
  }
  const pairs = [...written, ...all.filter((x) => !x.review.text)];
  const paired = new Set(pairs.map((x) => x.review));
  const slides = [...pairs, ...googleReviews.filter((r) => !paired.has(r)).map((review) => ({ review, site: null }))];
  if (slides.length !== googleReviews.length || slides.length < 100) throw new Error('unexpected number of reviews: ' + slides.length);

  const out = {
    rating: OVERALL_RATING,
    url: REVIEWS_URL,
    slides: slides.map(({ review, site }) => (site
      ? { n: review.name, t: review.text, s: { u: site.url, i: site.image, n: site.name } }
      : { n: review.name, t: review.text })),
  };
  const file = path.join(root, 'public/ksekinima/reviews.json');
  const next = JSON.stringify(out);
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== next) fs.writeFileSync(file, next);
  console.log(`ksekinima reviews.json: ${out.slides.length} reviews, ${pairs.length} with a website`);
} catch (e) {
  console.warn('ksekinima reviews.json NOT refreshed (kept the one in the repo):', e.message);
}
