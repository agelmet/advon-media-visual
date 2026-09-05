// lib/home.js
// Content for the homepage and the ads landing page (Design System v2, Sept 2026).
// EL copy is final marketing copy — edit with care.

import { portfolioData } from '@/lib/data';

export const PHONE_DISPLAY = null; // no public phone yet — set e.g. '+30 69X XXX XXXX' to enable call buttons
export const EMAIL = 'angelos@advonmedia.com';
export const REVIEW_COUNT = '110+';
export const SITE_COUNT = '200+';

/* ---------- The offer, word for word (October Blueprint) ---------- */
export const PROMISE = {
  el: 'Δωρεάν κατασκευή. Χωρίς προκαταβολή. Πληρώνετε μόνο τη φιλοξενία (10,83€/μήνα), όταν δείτε το πρώτο δείγμα της σελίδας σας — και κάνουμε απεριόριστες αλλαγές μέχρι να είναι ακριβώς όπως τη θέλετε.',
  en: 'Free build. No deposit. You pay only the hosting (€10.83/month), once you have seen the first draft of your website — and we make unlimited changes until it is exactly the way you want it.',
};

/* ---------- The nine sites shown in the hero stack and the portfolio mosaic ---------- */
export const WORK = [
  { key: 'kastritsis', name: 'Γιώργος Καστρίτσης', nameEn: 'Giorgos Kastritsis', niche: { el: 'Ψυχοθεραπευτής', en: 'Psychotherapist' }, url: null, alt: { el: 'Ιστοσελίδα ψυχοθεραπευτή με πορτρέτο και τίτλο «Κανένας άνθρωπος δεν είναι ίδιος»', en: 'Psychotherapist website with a portrait and the headline “No two people are the same”' } },
  { key: 'fasoula', name: 'Μαρία Φασούλα', nameEn: 'Maria Fasoula', niche: { el: 'Οδοντίατρος · Προσθετολόγος', en: 'Dentist · Prosthodontist' }, url: null, alt: { el: 'Ιστοσελίδα οδοντιάτρου με τίτλο «Η αρχιτεκτονική του τέλειου χαμόγελου»', en: 'Dentist website with the headline “The architecture of the perfect smile”' } },
  { key: 'loulou', name: 'Χρυσάνθη Λουλού', nameEn: 'Chrysanthi Loulou', niche: { el: 'Φυσικοθεραπεύτρια', en: 'Physiotherapist' }, url: 'https://loulou-physiotherapy.gr', alt: { el: 'Ιστοσελίδα φυσικοθεραπευτηρίου με τίτλο «Η κίνηση είναι η θεραπεία»', en: 'Physiotherapy website with the headline “Movement is the therapy”' } },
  { key: 'stergiop', name: 'Βασιλική Στεργιοπούλου', nameEn: 'Vasiliki Stergiopoulou', niche: { el: 'Κλινική Ψυχολόγος', en: 'Clinical Psychologist' }, url: null, alt: { el: 'Ιστοσελίδα κλινικής ψυχολόγου με μεγάλο σεριφ τίτλο το όνομά της', en: 'Clinical psychologist website with her name set in a large serif' } },
  { key: 'patridou', name: 'Πατρίδου', nameEn: 'Patridou', niche: { el: 'Ψυχοθεραπεία', en: 'Psychotherapy' }, url: null, alt: { el: 'Ιστοσελίδα ψυχοθεραπείας με τίτλο «Επιστροφή στον εαυτό»', en: 'Psychotherapy website with the headline “Return to yourself”' } },
  { key: 'pefanis', name: 'Κωνσταντίνος Πεφάνης', nameEn: 'Konstantinos Pefanis', niche: { el: 'Ψυχολόγος · CBT', en: 'Psychologist · CBT' }, url: null, alt: { el: 'Ιστοσελίδα ψυχολόγου με τίτλο «Η σκέψη αλλάζει, η ζωή ακολουθεί»', en: 'Psychologist website with the headline “Thought changes, life follows”' } },
  { key: 'tsonidou', name: 'Τσονίδου', nameEn: 'Tsonidou', niche: { el: 'Κλινική Ψυχολόγος', en: 'Clinical Psychologist' }, url: null, alt: { el: 'Ιστοσελίδα κλινικής ψυχολόγου με πορτρέτο και τίτλο «Φροντίζοντας τις πραγματικές σας ανάγκες»', en: 'Clinical psychologist website with a portrait and the headline “Caring for your real needs”' } },
  { key: 'oikonomou', name: 'Οικονόμου', nameEn: 'Oikonomou', niche: { el: 'Παιδοψυχολόγος', en: 'Child Psychologist' }, url: null, alt: { el: 'Ιστοσελίδα παιδοψυχολόγου με φωτογραφία του χώρου και τίτλο «Ένας χώρος όπου βρίσκετε τη δική σας φωνή»', en: 'Child psychologist website with the practice room and the headline “A place where you find your own voice”' } },
  { key: 'ditsa', name: 'Βιώ — Ντίτσα', nameEn: 'Vio — Ditsa', niche: { el: 'Ψυχοθεραπεύτρια', en: 'Psychotherapist' }, url: null, alt: { el: 'Ιστοσελίδα ψυχοθεραπεύτριας με απόφθεγμα «Η ζωή αφορά το είναι και το γίγνεσθαι»', en: 'Psychotherapist website with the quote “Life is about being and becoming”' } },
];

export const HERO_STACK = ['kastritsis', 'fasoula', 'loulou', 'stergiop'];

/* ---------- Niches (the strip under the hero, and the portfolio filter) ---------- */
export const NICHES = [
  { id: 'psy', el: 'Ψυχολόγοι & ψυχοθεραπευτές', en: 'Psychologists & therapists', test: /ψυχολ|ψυχοθερ|ψυχικ|θεραπ|σύμβουλος|συμβουλ|ψυχαναλ/i },
  { id: 'dent', el: 'Οδοντίατροι', en: 'Dentists', test: /οδοντ/i },
  { id: 'med', el: 'Ιατροί', en: 'Doctors', test: /ιατρ|καρδιολ|παιδίατρ|ψυχίατρ|νευρο|χειρουργ/i },
  { id: 'physio', el: 'Φυσικοθεραπευτές', en: 'Physiotherapists', test: /φυσικοθερ/i },
  { id: 'pro', el: 'Λογιστές, δικηγόροι & επαγγελματίες', en: 'Accountants, lawyers & professionals', test: /λογιστ|φοροτεχ|δικηγόρ|νομικ|σύμβουλος επιχ|μηχανικ/i },
];

export const NICHE_STRIP = [
  { el: 'Ιατροί', en: 'Doctors' },
  { el: 'Οδοντίατροι', en: 'Dentists' },
  { el: 'Ψυχολόγοι', en: 'Psychologists' },
  { el: 'Φυσικοθεραπευτές', en: 'Physiotherapists' },
  { el: 'Δικηγόροι', en: 'Lawyers' },
  { el: 'Λογιστές', en: 'Accountants' },
  { el: 'Ξενοδοχεία & βίλες', en: 'Hotels & villas' },
  { el: 'Εστίαση', en: 'Restaurants' },
  { el: 'Κομμωτήρια & barbers', en: 'Salons & barbers' },
  { el: 'Σχολές & ακαδημίες', en: 'Schools & academies' },
];

export function nicheOf(name) {
  // order matters: dentists before generic doctors, physio before generic
  const order = ['dent', 'physio', 'psy', 'med', 'pro'];
  for (const id of order) {
    const n = NICHES.find((x) => x.id === id);
    if (n.test.test(name)) return id;
  }
  return 'other';
}

export function portfolioByNiche() {
  return portfolioData.map((p) => ({ ...p, niche: nicheOf(p.name) }));
}

/* ---------- «Πώς δουλεύει» ---------- */
export const STEPS = [
  {
    n: '01',
    title: { el: 'Μας στέλνετε το υλικό σας', en: 'Send us your material' },
    body: {
      el: 'Λίγες φωτογραφίες, τις υπηρεσίες σας και τα στοιχεία επικοινωνίας — δέκα λεπτά από εσάς. Την κειμενογραφία την αναλαμβάνουμε εμείς.',
      en: 'A few photos, your services and contact details — ten minutes of your time. We take care of the copywriting.',
    },
    meta: { el: '10 λεπτά', en: '10 minutes' },
  },
  {
    n: '02',
    title: { el: 'Βλέπετε τη σελίδα σας έτοιμη', en: 'See your website, finished' },
    body: {
      el: 'Σε 7–14 ημέρες σας δείχνουμε την ολοκληρωμένη σελίδα. Χωρίς προκαταβολή, χωρίς δέσμευση — αν δεν σας αρέσει, δεν χάσατε τίποτα.',
      en: 'Within 7–14 days we show you the finished site. No deposit, no commitment — if you do not like it, you have lost nothing.',
    },
    meta: { el: '7–14 ημέρες', en: '7–14 days' },
  },
  {
    n: '03',
    title: { el: 'Μόνο αν σας αρέσει, πληρώνετε τη φιλοξενία', en: 'Only if you like it, you pay the hosting' },
    body: {
      el: '10,83€/μήνα — domain, φιλοξενία, ασφάλεια, backups και απεριόριστες αλλαγές, όλα μέσα. Και συνεχίζουμε μαζί μέχρι να είναι ακριβώς δική σας.',
      en: '€10.83/month — domain, hosting, security, backups and unlimited changes, all included. And we keep going together until it is exactly yours.',
    },
    meta: { el: '10,83€ / μήνα', en: '€10.83 / month' },
  },
];

/* ---------- Pricing card ---------- */
export const PRICING = {
  build: { el: 'Κατασκευή', en: 'Build' },
  buildPrice: { el: '0€', en: '€0' },
  hosting: { el: 'Φιλοξενία', en: 'Hosting' },
  hostingPrice: { el: '10,83€', en: '€10.83' },
  hostingNote: {
    el: 'Τιμολογείται ως 130€/χρόνο, με την παράδοση του πρώτου δείγματος. Μηνιαία πληρωμή: 15€/μήνα.',
    en: 'Billed as €130/year, when the first draft is delivered. Monthly option: €15/month.',
  },
  includes: [
    { el: 'Domain της επιλογής σας', en: 'Your own domain' },
    { el: 'Φιλοξενία, ασφάλεια SSL & αυτόματα backups', en: 'Hosting, SSL security & automatic backups' },
    { el: 'Απεριόριστες αλλαγές — για πάντα', en: 'Unlimited changes — forever' },
    { el: 'Δίγλωσση (EL/EN), γρήγορη, έτοιμη για Google', en: 'Bilingual (EL/EN), fast, ready for Google' },
    { el: 'Κριτικές Google, ραντεβού, AI βοηθός — ως προσθήκες', en: 'Google reviews, booking, AI assistant — as add-ons' },
  ],
  more: { el: 'Πρόσθετες σελίδες, πίνακας διαχείρισης και premium κατασκευές — δείτε όλες τις τιμές', en: 'Extra pages, admin panel and premium builds — see all prices' },
};

/* ---------- Copy blocks ---------- */
export const HERO = {
  eyebrow: { el: 'Κατασκευή ιστοσελίδας · Χωρίς προκαταβολή', en: 'Website build · No deposit' },
  h1a: { el: 'Η ιστοσελίδα σας.', en: 'Your website.' },
  h1b: { el: 'Δωρεάν.', en: 'Free.' },
  sub: {
    el: 'Τη φτιάχνουμε και σας τη δείχνουμε έτοιμη. Πληρώνετε μόνο τη φιλοξενία — 10,83€ τον μήνα — και μόνο αν σας αρέσει.',
    en: 'We build it and show it to you finished. You pay only the hosting — €10.83 a month — and only if you like it.',
  },
  cta: { el: 'Δείτε το δείγμα σας — δωρεάν', en: 'See your free draft' },
  link: { el: 'Πώς δουλεύει', en: 'How it works' },
  proofSites: { el: '200+ ιστοσελίδες', en: '200+ websites' },
  proofReviews: { el: '110+ κριτικές στο Google', en: '110+ Google reviews' },
};
