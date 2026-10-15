// components/service/KataskeviClient.jsx
// «Κατασκευή Ιστοσελίδων» — flagship page. Standard service structure,
// plus the "why is it free" story and the full portfolio grid kept from
// the previous version (all pricing removed per the site-wide rule).
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLangStore } from '@/store/langStore';
import { portfolioData } from '@/lib/data';
import { getService } from '@/lib/services';
import ScrollReveal from '@/components/ScrollReveal';
import PitchQuote from '@/components/PitchQuote';
import IncludesTech from '@/components/service/IncludesTech';
import KataskeviPricing from '@/components/service/KataskeviPricing';
import {
  StepsSection,
  ProofStrip,
  FaqSection,
} from '@/components/service/blocks';

export default function KataskeviClient() {
  const { lang } = useLangStore();
  const service = getService('kataskevi-istoselidas');

  return (
    <>
      {/* ─── HERO — the original «ΔΩΡΕΑΝ» treatment, restored ─── */}
      <section className="pt-16 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[560px] bg-[radial-gradient(ellipse,rgba(71,200,245,0.09)_0%,transparent_65%)] blur-[80px]" />
          <div
            className="absolute inset-x-0 top-0 h-[460px]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(71,200,245,0.05) 1px, transparent 1px),' +
                'linear-gradient(90deg, rgba(71,200,245,0.05) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage: 'radial-gradient(ellipse 80% 90% at 50% 0%, black 10%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 90% at 50% 0%, black 10%, transparent 70%)',
            }}
          />
        </div>
        {/* The title block (service, h1, price, ΔΩΡΕΑΝ, 10.83€) is centred on every screen.
            Desktop: under it, two equal plates side by side — what the 10.83€ covers | the pitch. */}
        <div className="max-w-4xl lg:max-w-6xl mx-auto px-6 text-center relative z-10">
          <div>
          <ScrollReveal>
            <span className="section-label">{lang === 'el' ? 'Υπηρεσία' : 'Service'}</span>
            <h1
              className="font-black font-display mb-10 text-white tracking-tight leading-[1.06]"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 4.5rem)' }}
            >
              {service.h1[lang]}
            </h1>
          </ScrollReveal>

          {/* ── ΤΙΜΗ ΚΑΤΑΣΚΕΥΗΣ — anchor price struck out, ΔΩΡΕΑΝ centerpiece ── */}
          <ScrollReveal delay={100}>
            <span className="text-electric-cyan text-xs font-bold tracking-widest uppercase mb-6 block">
              {lang === 'el' ? 'ΤΙΜΗ ΚΑΤΑΣΚΕΥΗΣ' : 'CREATION PRICE'}
            </span>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 mb-5">
              {/* Anchor / original price — crossed out with hand-drawn SVG line */}
              <div className="relative inline-block mv-strike" data-io>
                <span className="text-2xl md:text-3xl font-bold text-gray-400/75 tracking-tight whitespace-nowrap select-none">
                  700€ – 5.000€
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 210 40"
                  fill="none"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  preserveAspectRatio="none"
                >
                  <path
                    pathLength="1"
                    d="M6,32 C45,25 95,16 140,10 C168,6 190,4 204,2"
                    stroke="#ef4444"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                  />
                  <path
                    pathLength="1"
                    d="M4,34 C48,28 99,19 144,13 C171,9 192,6 206,4"
                    stroke="#ef4444"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    opacity="0.45"
                  />
                </svg>
              </div>
              <span className="mv-land" data-io>
                <span className="free-pulse text-7xl md:text-8xl font-black text-white tracking-tight leading-none">
                  {lang === 'el' ? 'ΔΩΡΕΑΝ' : 'FREE'}
                </span>
              </span>
            </div>
            <p className="text-lg md:text-xl text-gray-300 mb-3">
              {lang === 'el' ? (
                <>Μόνο <span className="text-white font-black">10.83€/μήνα</span> — όλα περιλαμβάνονται</>
              ) : (
                <>Only <span className="text-white font-black">10.83€/month</span> — everything included</>
              )}
            </p>
          </ScrollReveal>
          </div>

          {/* desktop: two equal plates side by side; phones: stacked and centred as before */}
          <div className="mt-6 lg:mt-12 lg:grid lg:grid-cols-2 lg:gap-6 lg:items-stretch lg:text-left">
          <ScrollReveal delay={160} direction="left" className="lg:h-full">
          <div className="kat-cover lg:h-full lg:flex lg:flex-col lg:justify-center">
            <p className="text-sm lg:text-[15px] text-gray-500 lg:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8 lg:mb-6">
              {lang === 'el'
                ? 'Η κατασκευή είναι πραγματικά δωρεάν — το ποσό αυτό καλύπτει αποκλειστικά τα απαραίτητα λειτουργικά που χρειάζεται κάθε ιστοσελίδα για να είναι online, όσα θα πληρώνατε ούτως ή άλλως, όπου κι αν τη φτιάχνατε. Εδώ, τα έχετε όλα σε ένα, χωρίς τίποτα επιπλέον.'
                : "The build itself is genuinely free — this amount covers only the essential running services every website needs to stay online, what you would pay anyway, wherever you had it built. Here, it's all in one, with nothing extra on top."}
            </p>
            {/* Included-items chips */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 max-w-3xl mx-auto lg:mx-0 mv-pop" data-io>
              {[
                { el: 'Φιλοξενία (hosting)', en: 'Hosting' },
                { el: 'Domain name της επιλογής σας', en: 'Domain name of your choice' },
                { el: 'Ασφάλεια', en: 'Security' },
                { el: 'Αυτόματα backups', en: 'Automatic backups' },
              ].map(({ el, en }) => (
                <span
                  key={en}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-cyan/8 border border-electric-cyan/25 text-sm font-semibold text-gray-200 whitespace-nowrap"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-electric-cyan shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                  {lang === 'el' ? el : en}
                </span>
              ))}
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/4 border border-white/12 text-sm font-semibold text-gray-400 whitespace-nowrap">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                {lang === 'el' ? 'και άλλα' : 'and more'}
              </span>
            </div>
          </div>
          </ScrollReveal>
          <ScrollReveal delay={240} direction="right" className="lg:h-full">
            <PitchQuote lit className="text-left mt-12 lg:mt-0 max-w-3xl lg:max-w-none mx-auto lg:h-full lg:flex lg:flex-col lg:justify-center">{service.pitch[lang]}</PitchQuote>
          </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Why is it free? — one wide plate: the heading, then the three reasons side by side on desktop ── */}
      <section className="pb-24 pt-6 mv-amb alt">
        <div className="max-w-4xl lg:max-w-6xl mx-auto px-6">
          <ScrollReveal delay={60} direction="scale">
            <div className="mv-frost relative overflow-hidden rounded-3xl p-8 md:p-12">
              <div className="relative z-10 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-[1fr_1.08fr] lg:gap-0 why-cols">
                <div className="why-col">
                  <h2 data-fx="mask" className="text-3xl md:text-4xl font-black text-white mb-7 lg:mb-6 font-display">
                    {lang === 'el' ? 'Γιατί είναι Δωρεάν;' : 'Why is it Free?'}
                  </h2>
                  <span className="why-num" aria-hidden="true">01</span>
                  <p className="text-white text-lg md:text-xl lg:text-[1.22rem] leading-relaxed border-l-2 border-electric-cyan/70 pl-5 lg:border-l-0 lg:pl-0" data-lit>
                    {lang === 'el'
                      ? 'Στη σημερινή εποχή, δεν νοείται επιχείρηση ή επαγγελματίας χωρίς παρουσία στο διαδίκτυο. Μια δική σας ιστοσελίδα δεν είναι πολυτέλεια — είναι αναγκαιότητα: είναι ο χώρος όπου σας βρίσκουν όσοι σας αναζητούν και όπου παρουσιάζεστε όπως πραγματικά σας αξίζει — με το δικό σας περιεχόμενο, τα δικά σας λόγια, τη δική σας ταυτότητα.'
                      : "In today's world, no business or professional can afford to be invisible online. A website of your own isn't a luxury — it's a necessity: it's where people find you when they're looking for you, and where you present yourself the way you truly deserve — with your own content, your own words, your own identity."}
                  </p>
                </div>
                <div className="why-col space-y-6 lg:space-y-7">
                <div>
                  <span className="why-num" aria-hidden="true">02</span>
                  <p className="text-gray-200 text-base md:text-[17px] leading-relaxed">
                    {lang === 'el'
                      ? 'Πιστεύουμε ότι κάθε επαγγελματίας αξίζει μια πραγματικά επαγγελματική παρουσία στο διαδίκτυο — όχι μόνο όσοι μπορούν να διαθέσουν χιλιάδες ευρώ. Γι’ αυτό αναλαμβάνουμε την κατασκευή εντελώς δωρεάν: για να στηρίξουμε μικρές επιχειρήσεις, ελεύθερους επαγγελματίες και όσους κάνουν τώρα τα πρώτα τους βήματα, χωρίς κανένα εμπόδιο στην εκκίνηση.'
                      : "We believe every professional deserves a truly professional online presence — not just those who can spend thousands of euros. That's why we build your website completely free: to support small businesses, freelancers, and anyone taking their first steps, with zero barriers to getting started."}
                  </p>
                </div>
                <div className="lg:pt-7 lg:border-t lg:border-white/8">
                  <span className="why-num" aria-hidden="true">03</span>
                  <p className="text-gray-200 text-base md:text-[17px] leading-relaxed">
                    {lang === 'el' ? (
                      <>Κερδίζουμε κι εμείς: κάθε ιστοσελίδα που παραδίδουμε μεγαλώνει το πορτφόλιό μας και μας φέρνει τους επόμενους πελάτες. Προσφέρουμε επίσης κι άλλες υπηρεσίες, όπως <Link href="/diaxeirisi-social-media" className="text-white underline decoration-electric-cyan/40 underline-offset-4 hover:decoration-electric-cyan">διαχείριση social media</Link> και <Link href="/google-ads" className="text-white underline decoration-electric-cyan/40 underline-offset-4 hover:decoration-electric-cyan">διαφημίσεις στο Google</Link>, που μπορείτε να επιλέξετε αν και όταν τις χρειαστείτε. Η δωρεάν ιστοσελίδα είναι ο τρόπος μας να ξεκινήσει μια συνεργασία που κρατάει. Εσείς αποκτάτε μια premium ιστοσελίδα χωρίς ρίσκο, εμείς ένα ακόμα δείγμα δουλειάς που μας κάνει περήφανους. <span className="text-white font-bold mv-mark" data-io>Όλοι κερδίζουν.</span></>
                    ) : (
                      <>We win too: every website we deliver grows our portfolio and brings us our next clients. We also offer other services, such as <Link href="/diaxeirisi-social-media" className="text-white underline decoration-electric-cyan/40 underline-offset-4 hover:decoration-electric-cyan">social media management</Link> and <Link href="/google-ads" className="text-white underline decoration-electric-cyan/40 underline-offset-4 hover:decoration-electric-cyan">Google ads</Link>, which you can choose if and when you need them. The free website is our way of starting a partnership that lasts. You get a premium website with zero risk; we get one more project we&apos;re proud of. <span className="text-white font-bold mv-mark" data-io>Everyone wins.</span></>
                    )}
                  </p>
                </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <StepsSection service={service} />
      <IncludesTech service={service} />

      {/* ─── HOSTING PRICING + INFRASTRUCTURE + EXTRAS (restored from history) ─── */}
      <KataskeviPricing />

      <ProofStrip />

      {/* ─── PORTFOLIO (kept) ─── */}
      <section
        id="portfolio"
        className="py-24 bg-[#0b0c10]/60 border-t border-electric-cyan/8 backdrop-blur-sm scroll-mt-24"
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <ScrollReveal className="text-center mb-14">
            <span className="section-label">{lang === 'el' ? 'Πορτφόλιο' : 'Portfolio'}</span>
            <h2 className="text-4xl md:text-5xl font-black font-display mb-3 text-white tracking-tight">
              {lang === 'el' ? 'Δείτε μερικές από τις Δουλειές μας' : 'Check Out Some Of Our Work'}
            </h2>
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-sm text-gray-500 leading-relaxed">
                {lang === 'el' ? (
                  <>
                    {'Όλες είναι ιστοσελίδες πελατών μας, '}
                    <strong className="text-gray-300 font-semibold">γραμμένες από την αρχή σε κώδικα</strong>
                    {' — '}
                    <strong className="text-gray-300 font-semibold">όχι πάνω σε έτοιμο template</strong>
                    {' — γύρω από το δικό τους επάγγελμα, τις δικές τους φωτογραφίες και τα δικά τους χρώματα.'}
                  </>
                ) : (
                  <>
                    {'Every one of these is a client’s website, '}
                    <strong className="text-gray-300 font-semibold">written from scratch in code</strong>
                    {' — '}
                    <strong className="text-gray-300 font-semibold">not on top of a ready-made template</strong>
                    {' — around their own profession, their own photos and their own colours.'}
                  </>
                )}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                {lang === 'el'
                  ? 'Η δική σας μπορεί να θυμίζει κάποια από αυτές, να πάει σε εντελώς άλλη κατεύθυνση, ή να ακολουθήσει τη σχεδίαση μιας ιστοσελίδας που είδατε και σας άρεσε. Αρκεί να μας την περιγράψετε ή να μας τη δείξετε.'
                  : 'Yours can resemble one of them, go in a completely different direction, or follow the design of a site you have seen and liked. All we need is a description or an example.'}
              </p>
            </div>
          </ScrollReveal>
          {/* 4 / 6 / 12 track grid, every card spans 2 tracks → 2 / 3 / 6 cards a row.
              An unfinished last row is centred by giving its first card a start track. */}
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {portfolioData.map((item, index) => (
              <PortfolioCard key={index} item={item} lang={lang} d={index % 6} cls={lastRowStart(index, portfolioData.length)} />
            ))}
          </div>
        </div>
      </section>

      <FaqSection service={service} />
    </>
  );
}

/* Centre an unfinished last row: the class for the first card of that row at each breakpoint. */
const START = {
  base: { 1: 'col-start-2' },
  md: { 1: 'md:col-start-3', 2: 'md:col-start-2' },
  lg: { 1: 'lg:col-start-6', 2: 'lg:col-start-5', 3: 'lg:col-start-4', 4: 'lg:col-start-3', 5: 'lg:col-start-2' },
};
function lastRowStart(i, n) {
  const at = (cols) => { const r = n % cols; return r && i === n - r ? r : 0; };
  const b = at(2), m = at(3), l = at(6);
  const out = [];
  if (b) out.push(START.base[b]);
  if (m) out.push(START.md[m]); else if (b) out.push('md:col-start-auto');
  if (l) out.push(START.lg[l]); else if (b || m) out.push('lg:col-start-auto');
  return out.join(' ');
}

/* ─── Portfolio card (kept from previous version) ─── */
function PortfolioCard({ item, lang, cls = '', d = 0 }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      data-io
      className={`col-span-2 ${cls} mv-pf group img-shine relative overflow-hidden rounded-2xl border border-white/8 block bg-[#050608] glow-border-hover shadow-[0_18px_50px_-14px_rgba(0,0,0,0.9)] hover:-translate-y-1.5`}
      style={{ aspectRatio: '4/3', '--d': d }}
    >
      <Image
        src={item.image}
        alt={item.name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/55 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-4">
        <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
          <p className="text-sm font-black text-white mb-2 leading-tight line-clamp-2">
            {lang === 'el' ? item.name : item.nameEn}
          </p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-electric-cyan/20 border border-electric-cyan/50 rounded-full text-[9px] font-black text-electric-cyan uppercase tracking-wider">
            {lang === 'el' ? 'ΠΡΟΒΟΛΗ' : 'VIEW SITE'}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
          </span>
        </div>
      </div>
    </a>
  );
}
