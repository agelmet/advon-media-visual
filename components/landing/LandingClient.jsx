// components/landing/LandingClient.jsx
// The ads landing page (/istoselida). The hero is the homepage hero, unchanged in look;
// everything after it is ONLY the website service — the same sections and cards the
// site already uses (stats, portfolio, ΔΩΡΕΑΝ price, steps, packages, Google reviews,
// FAQ), laid out as one path that ends at the booking/contact section (layout).
'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useLangStore } from '@/store/langStore';
import Reviews from '@/components/Reviews';
import Stats from '@/components/sats';
import ScrollReveal from '@/components/ScrollReveal';
import PitchQuote from '@/components/PitchQuote';
import KataskeviPricing from '@/components/service/KataskeviPricing';
import { StepsSection, IncludesSection, FaqSection } from '@/components/service/blocks';
import { portfolioData } from '@/lib/data';
import { getService, HOME_FAQS } from '@/lib/services';

const PROFESSIONS = [
  'Οδοντίατροι', 'Ψυχολόγοι', 'Ψυχοθεραπευτές', 'Οφθαλμίατροι', 'Παιδίατροι',
  'Διαιτολόγοι', 'Φυσικοθεραπευτές', 'Λογοθεραπευτές', 'Γυναικολόγοι', 'Δερματολόγοι',
];

// How many portfolio cards before «see all» (4 full rows of 6 on desktop, 12 rows of 2 on phones).
const FIRST_CARDS = 24;

const arrow = (cls = 'w-5 h-5') => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={cls}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

function goTo(e, id) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  if (window.history?.replaceState) window.history.replaceState(null, '', window.location.pathname + window.location.search + '#' + id);
}

export default function LandingClient() {
  const { lang } = useLangStore();
  const service = getService('kataskevi-istoselidas');
  const heroDecoRef = useRef(null);
  const magnetRef = useRef(null);
  const [allWork, setAllWork] = useState(false);
  const [showBar, setShowBar] = useState(false);

  const onMagnetMove = (e) => {
    const el = magnetRef.current;
    if (!el || !window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1)}px, ${((e.clientY - r.top - r.height / 2) * 0.25).toFixed(1)}px) scale(1.05)`;
  };
  const onMagnetLeave = () => { if (magnetRef.current) magnetRef.current.style.transform = 'translate(0px, 0px) scale(1)'; };

  useEffect(() => {
    const onScroll = () => {
      if (heroDecoRef.current) heroDecoRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
      // Phone booking bar: after the hero, hidden again once the booking section is on screen.
      const c = document.getElementById('contact');
      const pastHero = window.scrollY > window.innerHeight * 0.8;
      const atContact = c ? c.getBoundingClientRect().top < window.innerHeight * 0.9 : false;
      setShowBar(pastHero && !atContact);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // FAQ: the website-service questions + the two general ones from the homepage that ad visitors ask.
  const faqs = [...service.faqs, ...HOME_FAQS.filter((f) => /τεχνικές γνώσεις|αλλάξω πράγματα/.test(f.q.el))];
  const work = allWork ? portfolioData : portfolioData.slice(0, FIRST_CARDS);

  return (
    <>
      {/* ─── HERO — same as the homepage ─── */}
      <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
        <div ref={heroDecoRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ willChange: 'transform' }}>
          <div className="absolute rounded-full aurora" style={{ top: '-22%', left: '-16%', width: 'min(84vw, 840px)', height: 'min(84vw, 840px)', background: 'radial-gradient(circle, rgba(71,200,245,0.12) 0%, rgba(71,200,245,0.06) 30%, rgba(71,200,245,0.02) 52%, transparent 70%)', animation: 'auroraFloat1 22s ease-in-out infinite' }} />
          <div className="absolute rounded-full aurora" style={{ bottom: '-20%', right: '-12%', width: 'min(74vw, 760px)', height: 'min(74vw, 760px)', background: 'radial-gradient(circle, rgba(107,63,160,0.15) 0%, rgba(107,63,160,0.07) 30%, rgba(107,63,160,0.025) 52%, transparent 70%)', animation: 'auroraFloat2 28s ease-in-out infinite' }} />
          <div className="absolute rounded-full aurora" style={{ top: '22%', left: '50%', width: 'min(48vw, 540px)', height: 'min(48vw, 540px)', background: 'radial-gradient(circle, rgba(71,200,245,0.085) 0%, rgba(71,200,245,0.04) 30%, rgba(71,200,245,0.012) 52%, transparent 68%)', animation: 'auroraFloat3 17s ease-in-out infinite' }} />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(71,200,245,0.055) 1px, transparent 1px),linear-gradient(90deg, rgba(71,200,245,0.055) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 5%, transparent 72%)',
              WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 5%, transparent 72%)',
            }}
          />
          <div className="hero-orbit hero-orbit-a" aria-hidden="true"><span className="hero-orbit-dot" /><span className="hero-orbit-dot d2" /></div>
          <div className="hero-orbit hero-orbit-b" aria-hidden="true"><span className="hero-orbit-dot" /></div>
          {[
            { top: '17%', skew: -8, dur: '5s', delay: '0s', w: 2, cyan: true, op: 0.65 },
            { top: '40%', skew: -5, dur: '8.5s', delay: '1.8s', w: 1, cyan: true, op: 0.4 },
            { top: '63%', skew: -13, dur: '11.5s', delay: '0.5s', w: 2, cyan: true, op: 0.5 },
            { top: '29%', skew: -6, dur: '7s', delay: '3.5s', w: 1, cyan: false, op: 0.36 },
          ].map((b, i) => (
            <div key={i} style={{ position: 'absolute', top: b.top, left: 0, right: 0, height: `${b.w}px`, transform: `skewX(${b.skew}deg)`, overflow: 'hidden' }}>
              <div
                style={{
                  position: 'absolute', left: '-30%', width: '30%', height: '100%', opacity: b.op,
                  background: b.cyan
                    ? 'linear-gradient(90deg, transparent 0%, rgba(71,200,245,0.6) 25%, #47c8f5 50%, rgba(71,200,245,0.6) 75%, transparent 100%)'
                    : 'linear-gradient(90deg, transparent 0%, rgba(201,255,0,0.5) 25%, #c9ff00 50%, rgba(201,255,0,0.5) 75%, transparent 100%)',
                  boxShadow: b.cyan
                    ? '0 0 6px 2px rgba(71,200,245,0.9), 0 0 20px 5px rgba(71,200,245,0.3)'
                    : '0 0 6px 2px rgba(201,255,0,0.75), 0 0 20px 5px rgba(201,255,0,0.22)',
                  animation: `laserSweep ${b.dur} ${b.delay} infinite linear`,
                  willChange: 'transform',
                }}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)', opacity: 0.35 }} />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: '1100px', height: '760px', background: 'radial-gradient(ellipse, rgba(71,200,245,0.075) 0%, rgba(71,200,245,0.035) 32%, rgba(71,200,245,0.01) 55%, transparent 70%)' }} />
        </div>

        <div className="container max-w-7xl mx-auto px-6 text-center z-10">
          <div
            className="reveal-item delay-1 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-electric-cyan/50 bg-electric-cyan/8 mb-10 badge-scan"
            style={{ boxShadow: '0 0 30px rgba(71,200,245,0.2), inset 0 0 20px rgba(71,200,245,0.05)' }}
          >
            <span className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse" style={{ boxShadow: '0 0 12px #47c8f5' }} />
            <span className="text-[0.65rem] font-black tracking-[0.3em] text-white uppercase">ADVON MEDIA</span>
            <span className="text-[0.65rem] font-semibold tracking-[0.15em] text-electric-cyan/70 uppercase hidden sm:inline">
              {lang === 'el' ? '— Κατασκευή Ιστοσελίδων' : '— Website Creation'}
            </span>
          </div>

          <h1 className="font-black font-display mb-8 leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.6rem, 7vw, 6rem)', perspective: '1000px' }}>
            <span className="reveal-word !block" style={{ animationDelay: '0.15s' }}>
              <span className="relative inline-block">
                <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500">
                  {lang === 'el' ? 'Η ιστοσελίδα σας.' : 'Your website.'}
                </span>
                <span className="hero-sheen absolute inset-0 bg-clip-text text-transparent pointer-events-none select-none" aria-hidden="true">
                  {lang === 'el' ? 'Η ιστοσελίδα σας.' : 'Your website.'}
                </span>
              </span>
            </span>
            <span className="reveal-word inline-block" style={{ animationDelay: '0.4s' }}>
              <span className="text-shimmer" style={{ filter: 'drop-shadow(0 0 45px rgba(71,200,245,0.6))' }}>
                {lang === 'el' ? 'Δωρεάν.' : 'Free.'}
              </span>
            </span>
          </h1>

          <p className="reveal-item delay-4 text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed font-medium" style={{ fontSize: 'clamp(1rem, 2.2vw, 1.25rem)' }}>
            {lang === 'el'
              ? 'Τη βλέπετε πρώτα έτοιμη — και μετά κάνουμε όσες αλλαγές θέλετε, ώστε να γίνει όπως την ονειρεύεστε. Πληρώνετε μόνο τη φιλοξενία — δώρο το domain name.'
              : 'You see it finished first — then we make as many changes as you want, until it is exactly how you dreamed it. You pay only for the hosting — the domain name is a gift.'}
          </p>

          <p className="reveal-item delay-5 text-electric-cyan/90 text-sm md:text-base font-bold tracking-wide mb-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span>{lang === 'el' ? '220+ ιστοσελίδες' : '220+ websites'}</span>
            <span className="text-electric-cyan/40 hidden sm:inline" aria-hidden="true">·</span>
            <a
              href="#reviews"
              onClick={(e) => goTo(e, 'reviews')}
              title={lang === 'el' ? 'Δείτε τις αξιολογήσεις' : 'See the reviews'}
              className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-electric-cyan/8 border border-electric-cyan/25 hover:bg-electric-cyan/16 hover:border-electric-cyan/60 hover:text-electric-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-cyan/70 transition-all duration-300 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#FBBC05] shrink-0" aria-hidden="true"><path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.06 1.11-6.46-4.7-4.58 6.49-.94L12 2.5z"/></svg>
              {lang === 'el' ? '125+ κριτικές 5★ στο Google' : '125+ 5★ reviews on Google'}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all duration-300" aria-hidden="true"><path d="M12 5v14"/><path d="m5 12 7 7 7-7"/></svg>
            </a>
          </p>

          <div className="reveal-item delay-6 flex flex-wrap items-center justify-center gap-5">
            <a
              ref={magnetRef}
              href="#contact"
              onClick={(e) => goTo(e, 'contact')}
              onMouseMove={onMagnetMove}
              onMouseLeave={onMagnetLeave}
              className="btn-premium group relative overflow-hidden px-9 py-4 bg-electric-cyan text-[#050a0e] font-black text-base uppercase tracking-[0.1em] rounded-xl flex items-center gap-3 transition-all duration-300"
              style={{ animation: 'heroCTAPulse 3s ease-in-out infinite' }}
            >
              <span className="relative z-10 flex items-center gap-3">
                {lang === 'el' ? 'Η ΔΩΡΕΑΝ ΣΕΛΙΔΑ ΣΑΣ' : 'YOUR FREE WEBSITE'}
                {arrow('w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300')}
              </span>
            </a>
            <a
              href="#portfolio"
              onClick={(e) => goTo(e, 'portfolio')}
              className="btn-premium group px-9 py-4 bg-transparent border-2 border-electric-cyan text-electric-cyan font-black text-base uppercase tracking-[0.1em] rounded-xl hover:bg-electric-cyan hover:text-[#050a0e] transition-all duration-300 flex items-center gap-3 backdrop-blur-sm"
              style={{ animation: 'borderGlow 3s ease-in-out infinite 1s' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              {lang === 'el' ? 'ΠΟΡΤΦΟΛΙΟ' : 'PORTFOLIO'}
            </a>
            <a
              href="#timi"
              onClick={(e) => goTo(e, 'timi')}
              className="btn-premium group px-9 py-4 bg-white/5 border border-white/20 text-white font-black text-base uppercase tracking-[0.1em] rounded-xl hover:bg-white hover:text-[#050a0e] transition-all duration-300 flex items-center gap-3 backdrop-blur-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
              {lang === 'el' ? 'ΤΙΜΕΣ' : 'PRICES'}
            </a>
          </div>

          <p className="reveal-item delay-6 text-gray-500 text-xs md:text-sm tracking-wide mt-8">
            {lang === 'el'
              ? 'Κατασκευή 0€ · Χωρίς προκαταβολή · Απεριόριστες αλλαγές · Πρώτο σχέδιο σε 4–10 ημέρες'
              : 'Build 0€ · No deposit · Unlimited changes · First design in 4–10 days'}
          </p>

          <div className="reveal-item delay-6 flex justify-center mt-16">
            <div className="flex flex-col items-center gap-2 opacity-40">
              <span className="text-[0.6rem] tracking-[0.25em] uppercase text-gray-500">{lang === 'el' ? 'Κάντε Scroll' : 'Scroll Down'}</span>
              <div className="w-px h-10 bg-gradient-to-b from-electric-cyan/60 to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHO WE BUILD FOR ─── */}
      <div className="overflow-hidden py-5 border-y border-electric-cyan/10 bg-[#050a0e]/60 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050a0e] via-transparent to-[#050a0e] z-10 pointer-events-none" />
        <div className="flex gap-0 marquee-track" style={{ width: 'max-content' }}>
          {[...PROFESSIONS, ...PROFESSIONS, ...PROFESSIONS, ...PROFESSIONS].map((item, i) => (
            <span key={i} className="flex items-center gap-5 px-6 whitespace-nowrap">
              <span className="text-[0.7rem] font-black tracking-[0.2em] uppercase text-gray-500">{item}</span>
              <span className="w-1 h-1 rounded-full bg-electric-cyan/50 flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {/* ─── STATS ─── */}
      <Stats />

      {/* ─── PORTFOLIO — real client sites first, so the offer is seen next to the work ─── */}
      <section id="portfolio" className="py-24 bg-[#0a1418]/60 border-b border-electric-cyan/8 backdrop-blur-sm scroll-mt-28">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <ScrollReveal className="text-center mb-14">
            <span className="section-label">{lang === 'el' ? 'Πορτφόλιο' : 'Portfolio'}</span>
            <h2 className="text-4xl md:text-5xl font-black font-display mb-3 text-white tracking-tight">
              {lang === 'el' ? 'Δείτε μερικές από τις Δουλειές μας' : 'Check Out Some Of Our Work'}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto">
              {lang === 'el' ? (
                <>
                  {'Όλες είναι ιστοσελίδες πελατών μας, online στο δικό τους domain, '}
                  <strong className="text-gray-300 font-semibold">γραμμένες από την αρχή σε κώδικα</strong>
                  {' — '}
                  <strong className="text-gray-300 font-semibold">όχι πάνω σε έτοιμο template</strong>
                  {'. Πατήστε όποια θέλετε για να την ανοίξετε.'}
                </>
              ) : (
                <>
                  {'Every one is a client’s website, live on their own domain, '}
                  <strong className="text-gray-300 font-semibold">written from scratch in code</strong>
                  {' — '}
                  <strong className="text-gray-300 font-semibold">not on a ready-made template</strong>
                  {'. Tap any of them to open it.'}
                </>
              )}
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {work.map((item, index) => (
              <PortfolioCard key={item.url + index} item={item} lang={lang} cls={allWork ? lastRowStart(index, work.length) : ''} />
            ))}
          </div>
          <div className="text-center mt-10">
            {!allWork ? (
              <button
                type="button"
                onClick={() => setAllWork(true)}
                className="btn-premium inline-flex items-center gap-2 px-7 py-3.5 border border-electric-cyan/40 text-electric-cyan text-sm font-bold rounded-xl hover:bg-electric-cyan hover:text-[#050a0e] transition-all"
              >
                {lang === 'el' ? 'Δείτε όλο το πορτφόλιο' : 'See the whole portfolio'}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 5v14"/><path d="m5 12 7 7 7-7"/></svg>
              </button>
            ) : (
              <a
                href="#contact"
                onClick={(e) => goTo(e, 'contact')}
                className="btn-premium inline-flex items-center gap-2 px-7 py-3.5 bg-electric-cyan text-[#050a0e] text-sm font-black uppercase tracking-wide rounded-xl hover:bg-white transition-all"
              >
                {lang === 'el' ? 'Θέλω κι εγώ μια τέτοια' : 'I want one like these'}
                {arrow('w-4 h-4')}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ─── PRICE — the ΔΩΡΕΑΝ block of the website page ─── */}
      <section id="timi" className="pt-24 pb-16 relative overflow-hidden scroll-mt-28">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[560px] bg-[radial-gradient(ellipse,rgba(71,200,245,0.09)_0%,transparent_65%)] blur-[80px]" />
          <div
            className="absolute inset-x-0 top-0 h-[460px]"
            style={{
              backgroundImage: 'linear-gradient(rgba(71,200,245,0.05) 1px, transparent 1px),linear-gradient(90deg, rgba(71,200,245,0.05) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage: 'radial-gradient(ellipse 80% 90% at 50% 0%, black 10%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 90% at 50% 0%, black 10%, transparent 70%)',
            }}
          />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal>
            <span className="section-label">{lang === 'el' ? 'Τιμή' : 'Price'}</span>
            <h2 className="font-black font-display mb-10 text-white tracking-tight leading-[1.06]" style={{ fontSize: 'clamp(2.3rem, 5.4vw, 4rem)' }}>
              {lang === 'el' ? 'Κατασκευή Ιστοσελίδας' : 'Website Creation'}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <span className="text-electric-cyan text-xs font-bold tracking-widest uppercase mb-6 block">{lang === 'el' ? 'ΤΙΜΗ ΚΑΤΑΣΚΕΥΗΣ' : 'CREATION PRICE'}</span>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 mb-5">
              <div className="relative inline-block">
                <span className="text-2xl md:text-3xl font-bold text-gray-400/75 tracking-tight whitespace-nowrap select-none">700€ – 5.000€</span>
                <svg aria-hidden="true" viewBox="0 0 210 40" fill="none" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                  <path d="M6,32 C45,25 95,16 140,10 C168,6 190,4 204,2" stroke="#ef4444" strokeWidth="3.8" strokeLinecap="round" />
                  <path d="M4,34 C48,28 99,19 144,13 C171,9 192,6 206,4" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />
                </svg>
              </div>
              <span className="free-pulse text-7xl md:text-8xl font-black text-white tracking-tight leading-none">{lang === 'el' ? 'ΔΩΡΕΑΝ' : 'FREE'}</span>
            </div>
            <p className="text-lg md:text-xl text-gray-300 mb-3">
              {lang === 'el'
                ? <>Μόνο <span className="text-white font-black">10.83€/μήνα</span> (130€ τον χρόνο) — όλα περιλαμβάνονται</>
                : <>Only <span className="text-white font-black">10.83€/month</span> (130€ a year) — everything included</>}
            </p>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto mb-8">
              {lang === 'el'
                ? 'Η κατασκευή είναι πραγματικά δωρεάν — το ποσό αυτό καλύπτει αποκλειστικά τα απαραίτητα λειτουργικά που χρειάζεται κάθε ιστοσελίδα για να είναι online, όσα θα πληρώνατε ούτως ή άλλως, όπου κι αν τη φτιάχνατε. Εδώ, τα έχετε όλα σε ένα, χωρίς τίποτα επιπλέον.'
                : "The build itself is genuinely free — this amount covers only the essential running services every website needs to stay online, what you would pay anyway, wherever you had it built. Here, it's all in one, with nothing extra on top."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto">
              {[
                { el: 'Φιλοξενία (hosting)', en: 'Hosting' },
                { el: 'Domain name της επιλογής σας', en: 'Domain name of your choice' },
                { el: 'Ασφάλεια', en: 'Security' },
                { el: 'Αυτόματα backups', en: 'Automatic backups' },
              ].map(({ el, en }) => (
                <span key={en} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-cyan/8 border border-electric-cyan/25 text-sm font-semibold text-gray-200 whitespace-nowrap">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-electric-cyan shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                  {lang === 'el' ? el : en}
                </span>
              ))}
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/4 border border-white/12 text-sm font-semibold text-gray-400 whitespace-nowrap">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                {lang === 'el' ? 'και άλλα' : 'and more'}
              </span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={160} direction="scale">
            <PitchQuote className="text-left mt-12 max-w-3xl mx-auto">{service.pitch[lang]}</PitchQuote>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── WHY FREE ─── */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal delay={60}>
            <div className="relative overflow-hidden rounded-3xl border border-electric-cyan/30 bg-gradient-to-br from-electric-cyan/8 via-transparent to-transparent p-8 md:p-12 shadow-[0_0_40px_rgba(71,200,245,0.1)]">
              <div aria-hidden="true" className="absolute -right-24 -top-24 w-72 h-72 bg-electric-cyan/8 rounded-full blur-[90px] pointer-events-none" />
              <h3 className="text-2xl md:text-3xl font-black text-white mb-6 font-display relative z-10">{lang === 'el' ? 'Γιατί είναι Δωρεάν;' : 'Why is it Free?'}</h3>
              <div className="relative z-10 space-y-5">
                <p className="text-gray-200 text-lg leading-relaxed border-l-2 border-electric-cyan/60 pl-5">
                  {lang === 'el'
                    ? 'Στη σημερινή εποχή, δεν νοείται επιχείρηση ή επαγγελματίας χωρίς παρουσία στο διαδίκτυο. Μια δική σας ιστοσελίδα δεν είναι πολυτέλεια — είναι αναγκαιότητα: είναι ο χώρος όπου σας βρίσκουν όσοι σας αναζητούν και όπου παρουσιάζεστε όπως πραγματικά σας αξίζει — με το δικό σας περιεχόμενο, τα δικά σας λόγια, τη δική σας ταυτότητα.'
                    : "In today's world, no business or professional can afford to be invisible online. A website of your own isn't a luxury — it's a necessity: it's where people find you when they're looking for you, and where you present yourself the way you truly deserve — with your own content, your own words, your own identity."}
                </p>
                <p className="text-gray-400 text-base leading-relaxed">
                  {lang === 'el'
                    ? 'Πιστεύουμε ότι κάθε επαγγελματίας αξίζει μια πραγματικά επαγγελματική παρουσία στο διαδίκτυο — όχι μόνο όσοι μπορούν να διαθέσουν χιλιάδες ευρώ. Γι’ αυτό αναλαμβάνουμε την κατασκευή εντελώς δωρεάν: για να στηρίξουμε μικρές επιχειρήσεις, ελεύθερους επαγγελματίες και όσους κάνουν τώρα τα πρώτα τους βήματα, χωρίς κανένα εμπόδιο στην εκκίνηση.'
                    : "We believe every professional deserves a truly professional online presence — not just those who can spend thousands of euros. That's why we build your website completely free: to support small businesses, freelancers, and anyone taking their first steps, with zero barriers to getting started."}
                </p>
                <p className="text-gray-400 text-base leading-relaxed">
                  {lang === 'el' ? (
                    <>Κερδίζουμε κι εμείς: κάθε ιστοσελίδα που παραδίδουμε μεγαλώνει το πορτφόλιό μας και μας φέρνει τους επόμενους πελάτες. Εσείς αποκτάτε μια premium ιστοσελίδα χωρίς ρίσκο, εμείς ένα ακόμα δείγμα δουλειάς που μας κάνει περήφανους. <span className="text-electric-cyan font-bold">Όλοι κερδίζουν.</span></>
                  ) : (
                    <>We win too: every website we deliver grows our portfolio and brings us our next clients. You get a premium website with zero risk; we get one more project we&apos;re proud of. <span className="text-electric-cyan font-bold">Everyone wins.</span></>
                  )}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── HOW IT WORKS · WHAT'S INCLUDED · PACKAGES (same as the website page) ─── */}
      <div id="vimata" className="scroll-mt-28"><StepsSection service={service} /></div>
      <IncludesSection service={service} />
      <KataskeviPricing infra={false} />

      {/* ─── GOOGLE REVIEWS (all of them, as on the homepage) ─── */}
      <Reviews />

      {/* ─── FAQ ─── */}
      <FaqSection faqs={faqs} />

      {/* ─── Phone booking bar ─── */}
      <div
        className={`md:hidden fixed left-3 right-3 bottom-3 z-40 transition-all duration-300 ${showBar ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}
        aria-hidden={!showBar}
      >
        <a
          href="#contact"
          onClick={(e) => goTo(e, 'contact')}
          tabIndex={showBar ? 0 : -1}
          className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl bg-electric-cyan text-[#050a0e] font-black text-[0.95rem] uppercase tracking-[0.08em] shadow-[0_10px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(71,200,245,0.45)]"
        >
          {lang === 'el' ? 'Κλείστε δωρεάν ραντεβού' : 'Book a free call'}
          {arrow('w-5 h-5')}
        </a>
      </div>
    </>
  );
}

/* Centre an unfinished last row (same rule as the website page). */
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

function PortfolioCard({ item, lang, cls = '' }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`col-span-2 ${cls} group img-shine relative overflow-hidden rounded-2xl border border-white/8 block bg-[#050a0e] glow-border-hover shadow-lg transition-transform duration-500 hover:-translate-y-1.5`}
      style={{ aspectRatio: '4/3' }}
    >
      <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050a0e] via-[#050a0e]/55 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-4">
        <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
          <p className="text-sm font-black text-white mb-2 leading-tight line-clamp-2">{lang === 'el' ? item.name : item.nameEn}</p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-electric-cyan/20 border border-electric-cyan/50 rounded-full text-[9px] font-black text-electric-cyan uppercase tracking-wider">
            {lang === 'el' ? 'ΠΡΟΒΟΛΗ' : 'VIEW SITE'}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
          </span>
        </div>
      </div>
    </a>
  );
}
