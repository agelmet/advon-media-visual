// lib/showcase.js — 16 real client sites for the moving «river» under the hero (home + /istoselida).
// A short, hand-picked list (different professions, local thumbnails) so the 190-site portfolio
// list (lib/data.js) stays out of the home bundle. Only LIVE sites that are already in the portfolio.
export const SHOWCASE = [
  ['bogiatzi', 'bogiatzi-psychologist.gr'],
  ['selfiehair', 'selfiehair.gr'],
  ['dionvilla', 'dionvillazakynthos.com'],
  ['lamprou', 'lamproueye.gr'],
  ['salakou', 'georgia-salakou-psychologist.gr'],
  ['vogiatzis', 'vogiatzis-dent.gr'],
  ['vavavoom', 'vavavoomacting.com'],
  ['gonata', 'athinagonata-psychologist.gr'],
  ['kdental', 'kk-dental.gr'],
  ['papaefstathiou', 'papaefstathiou-psychology.gr'],
  ['aaenergy', 'aaenergy-consultans.gr'],
  ['sfyri', 'sfyridentalcare.gr'],
  ['morogianni', 'emorogianni.gr'],
  ['zoetherapy', 'zoetherapy.gr'],
  ['syneinai', 'syneinai.gr'],
  ['makedou', 'makedou-psychotherapy.gr'],
].map(([k, d]) => ({ src: `/img/portfolio/${k}.jpg`, domain: d }));
