// components/landing/LandingClient.jsx
// The ads landing page (/istoselida) — v2, 22 Oct 2026, for the November Meta ads.
// One offer, one path: hero → price (ΔΩΡΕΑΝ, 130€ + ΦΠΑ) → why free → real client sites →
// Google reviews → how it works → what's included → FAQ → the booking/contact section (layout).
// Built with the site's current design language (Starlight sky, Motion v4 data-io / data-lit,
// frosted plates, Cards v5). No Growth package, no extras price list, no monthly switch, no
// counters — a stranger from an ad sees one clear price.
// Message match: the profession ads («Ψυχολόγος;», «Οδοντίατρος;», «Παιδίατρος;») land here with
// utm_content N_psy / N_dent / N_paed (or ?p=psy) → the page speaks to that profession (lib/landing.js).
'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useLangStore } from '@/store/langStore';
import Reviews from '@/components/Reviews';
import ScrollReveal from '@/components/ScrollReveal';
import PitchQuote from '@/components/PitchQuote';
import IncludesTech from '@/components/service/IncludesTech';
import { StepsSection, FaqSection } from '@/components/service/blocks';
import { portfolioData } from '@/lib/data';
import { getService } from '@/lib/services';
import { readNiche } from '@/lib/landing';

const PROFESSIONS = [
  'Ψυχολόγοι', 'Οδοντίατροι', 'Παιδίατροι', 'Ψυχοθεραπευτές', 'Οφθαλμίατροι',
  'Διαιτολόγοι', 'Φυσικοθεραπευτές', 'Λογοθεραπευτές', 'Γυναικολόγοι', 'Δερματολόγοι',
];
const NICHE_WORD = { psy: 'Ψυχολόγοι', dent: 'Οδοντίατροι', paed: 'Παιδίατροι' };

// 36 cards at once (6 full rows on desktop), «Δείτε περισσότερες» adds 36 more each time.
const FIRST_CARDS = 36;
const MORE_CARDS = 36;

const HOSTING = [
  'Domain name της επιλογής σας — δώρο',
  'Φιλοξενία σε παγκόσμιο δίκτυο (CDN)',
  'Πιστοποιητικό ασφαλείας SSL',
  'Αυτόματα backups',
  'Τακτικός έλεγχος ότι η σελίδα λειτουργεί σωστά',
  'Τεχνική υποστήριξη',
];

const arrow = (cls = 'w-5 h-5') => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
const check = (cls = 'w-4 h-4') => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
);
const star = (cls = 'w-4 h-4') => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true"><path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.06 1.11-6.46-4.7-4.58 6.49-.94L12 2.5z"/></svg>
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
  const [shown, setShown] = useState(FIRST_CARDS);
  const [showBar, setShowBar] = useState(false);
  const [niche, setNiche] = useState(null);

  // the profession the ad spoke to (read once, after mount — the page itself is static)
  useEffect(() => { setNiche(readNiche()); }, []);

  const onMagnetMove = (e) => {
    const el = magnetRef.current;
    if (!el || !window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1)}px, ${((e.clientY - r.top - r.height / 2) * 0.25).toFixed(1)}px) scale(1.05)`;
  };
  const onMagnetLeave = () => { if (magnetRef.current) magnetRef.current.style.transform = 'translate(0px, 0px) scale(1)'; };

  useEffect(() => {
    const onScroll = () => {
      // the ceiling light stays put and only fades a little (same as the homepage)
      if (heroDecoRef.current) heroDecoRef.current.style.opacity = String(Math.max(0.35, 1 - window.scrollY / 900));
      // phone booking bar: after the hero, hidden again once the booking section is on screen
      const c = document.getElementById('contact');
      const pastHero = window.scrollY > window.innerHeight * 0.8;
      const atContact = c ? c.getBoundingClientRect().top < window.innerHeight * 0.9 : false;
      setShowBar(pastHero && !atContact);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // the profession's own sites first, then everything else in the usual order
  const ordered = niche
    ? [...portfolioData.filter((p) => niche.match.test(p.name)), ...portfolioData.filter((p) => !niche.match.test(p.name))]
    : portfolioData;
  const allWork = shown >= ordered.length;
  const work = ordered.slice(0, shown);
  const professions = niche ? [NICHE_WORD[niche.key], ...PROFESSIONS.filter((p) => p !== NICHE_WORD[niche.key])] : PROFESSIONS;

  return (
    <>
      {/* ─── HERO — the homepage hero, speaking to the ad's profession ─── */}
      <section className="relative min-h-[100svh] flex items-center justify-center -mt-28 pt-40 [@media(max-height:760px)]:pt-32 pb-14 overflow-hidden">
        <div ref={heroDecoRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ willChange: 'opacity' }}>
          <div className="absolute inset-0 rr-ceiling" />
        </div>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: '1100px', height: '760px', background: 'radial-gradient(ellipse, rgba(255,240,218,0.05) 0%, rgba(255,240,218,0.02) 34%, transparent 66%)' }} />
        </div>

        <div className="container max-w-7xl mx-auto px-6 text-center z-10 mv-hero-scrub">
          <div
            className="reveal-item delay-1 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-electric-cyan/50 bg-electric-cyan/8 mb-7 badge-scan"
            style={{ boxShadow: '0 0 30px rgba(71,200,245,0.2), inset 0 0 20px rgba(71,200,245,0.05)' }}
          >
            <span className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse" style={{ boxShadow: '0 0 12px #47c8f5' }} />
            <span className="text-[0.65rem] font-black tracking-[0.3em] text-white uppercase">ADVON MEDIA</span>
            <span className="text-[0.65rem] font-semibold tracking-[0.15em] text-electric-cyan/80 uppercase">
              — {niche ? niche.badge : 'Κατασκευή ιστοσελίδων'}
            </span>
          </div>

          <h1 className="font-black font-display mb-6 leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.6rem, min(7vw, 9.5vh), 6rem)', perspective: '1000px' }}>
            <span className="reveal-word !block" style={{ animationDelay: '0.15s' }}>
              <span className="relative inline-block">
                <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500">Η ιστοσελίδα σας.</span>
                <span className="hero-sheen absolute inset-0 bg-clip-text text-transparent pointer-events-none select-none" aria-hidden="true">Η ιστοσελίδα σας.</span>
              </span>
            </span>
            <span className="reveal-word inline-block" style={{ animationDelay: '0.4s' }}>
              <span className="text-shimmer" style={{ filter: 'drop-shadow(0 0 45px rgba(71,200,245,0.6))' }}>Δωρεάν.</span>
            </span>
          </h1>

          {niche && (
            <p className="reveal-item delay-3 font-display italic text-electric-cyan max-w-3xl mx-auto mb-4 leading-snug" style={{ fontSize: 'clamp(1.1rem, 2.4vw, 1.45rem)' }}>
              {niche.line}
            </p>
          )}
          <p className="reveal-item delay-4 text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed font-medium" style={{ fontSize: 'clamp(1rem, 2.2vw, 1.2rem)' }}>
            Τη φτιάχνουμε δωρεάν και τη βλέπετε πρώτα έτοιμη. Πληρώνετε μόνο τη φιλοξενία, όταν δείτε το πρώτο σχέδιο. Δώρο το domain name.
          </p>

          <p className="lp-proof reveal-item delay-5 text-electric-cyan/90 text-sm md:text-base font-bold tracking-wide mb-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span>220+ ιστοσελίδες online</span>
            <span className="text-electric-cyan/40 hidden sm:inline" aria-hidden="true">·</span>
            <a
              href="#reviews"
              onClick={(e) => goTo(e, 'reviews')}
              className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-electric-cyan/8 border border-electric-cyan/25 hover:bg-electric-cyan/16 hover:border-electric-cyan/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-cyan/70 transition-all duration-300"
            >
              {star('w-4 h-4 text-[#FBBC05] shrink-0')}
              5,0 · 130+ κριτικές στο Google
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all duration-300" aria-hidden="true"><path d="M12 5v14"/><path d="m5 12 7 7 7-7"/></svg>
            </a>
          </p>

          <div className="reveal-item delay-6 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <a
              ref={magnetRef}
              href="#contact"
              onClick={(e) => goTo(e, 'contact')}
              onMouseMove={onMagnetMove}
              onMouseLeave={onMagnetLeave}
              data-no-mag
              className="btn-premium group relative overflow-hidden px-8 sm:px-9 py-4 bg-electric-cyan text-[#050608] font-black text-[0.95rem] sm:text-base uppercase tracking-[0.08em] rounded-xl flex items-center gap-3 transition-all duration-300"
              style={{ animation: 'heroCTAPulse 3s ease-in-out infinite' }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Θέλω τη δωρεάν σελίδα μου
                {arrow('w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300')}
              </span>
            </a>
            <a
              href="#portfolio"
              onClick={(e) => goTo(e, 'portfolio')}
              className="btn-premium group px-8 sm:px-9 py-4 bg-transparent border-2 border-electric-cyan/80 text-electric-cyan font-black text-[0.95rem] sm:text-base uppercase tracking-[0.08em] rounded-xl hover:bg-electric-cyan hover:text-[#050608] transition-all duration-300 flex items-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              Δείτε τη δουλειά μας
            </a>
          </div>

          <ul className="reveal-item delay-6 mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-gray-400 text-xs md:text-sm font-semibold tracking-wide">
            {['Κατασκευή 0€', 'Χωρίς προκαταβολή', 'Πρώτο σχέδιο σε 4–10 ημέρες', 'Απεριόριστες αλλαγές πριν βγει online'].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">{check('w-3.5 h-3.5 text-electric-cyan')}{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── WHO WE BUILD FOR ─── */}
      <div className="overflow-hidden py-5 border-y border-electric-cyan/10 bg-[#050608]/60 relative mv-skew">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050608] via-transparent to-[#050608] z-10 pointer-events-none" />
        <div className="flex gap-0 marquee-track" style={{ width: 'max-content' }}>
          {[...professions, ...professions, ...professions, ...professions].map((item, i) => (
            <span key={i} className="flex items-center gap-5 px-6 whitespace-nowrap">
              <span className="text-[0.7rem] font-black tracking-[0.2em] uppercase text-gray-400">{item}</span>
              <span className="w-1 h-1 rounded-full bg-electric-cyan/50 flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {/* ─── PRICE — ΔΩΡΕΑΝ, then exactly what the 130€ is and when it is paid ─── */}
      <section id="timi" className="pt-24 pb-16 relative overflow-hidden scroll-mt-28 mv-amb">
        <div className="max-w-4xl lg:max-w-6xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal>
            <span className="section-label">Τιμή</span>
            <h2 className="font-black font-display mb-9 text-white tracking-tight leading-[1.06]" style={{ fontSize: 'clamp(2.3rem, 5.4vw, 4rem)' }}>
              {niche ? `Ιστοσελίδα για ${niche.who}` : 'Κατασκευή ιστοσελίδας'}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <span className="text-electric-cyan text-xs font-bold tracking-widest uppercase mb-6 block">Τιμή κατασκευής</span>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 mb-6">
              <div className="relative inline-block mv-strike" data-io>
                <span className="text-2xl md:text-3xl font-bold text-gray-400/75 tracking-tight whitespace-nowrap select-none">700€ – 5.000€</span>
                <svg aria-hidden="true" viewBox="0 0 210 40" fill="none" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                  <path pathLength="1" d="M6,32 C45,25 95,16 140,10 C168,6 190,4 204,2" stroke="#ef4444" strokeWidth="3.8" strokeLinecap="round" />
                  <path pathLength="1" d="M4,34 C48,28 99,19 144,13 C171,9 192,6 206,4" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />
                </svg>
              </div>
              <span className="mv-land" data-io>
                <span className="free-pulse text-7xl md:text-8xl font-black text-white tracking-tight leading-none">ΔΩΡΕΑΝ</span>
              </span>
            </div>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Πληρώνετε μόνο τη φιλοξενία: <span className="text-white font-black whitespace-nowrap">130€ τον χρόνο</span> <span className="text-gray-400 whitespace-nowrap">+ ΦΠΑ</span>
            </p>
            <p className="mt-1 text-sm text-gray-400">δηλαδή 10,83€ τον μήνα, με όλα μέσα</p>
            <p className="mt-2 text-sm md:text-base text-electric-cyan font-bold">Και μόνο όταν δείτε έτοιμο το πρώτο σχέδιο. Καμία προκαταβολή.</p>
          </ScrollReveal>

          {/* desktop: what the 130€ covers | the pitch, side by side; phones: stacked */}
          <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-stretch text-left">
            <ScrollReveal delay={160} direction="left" className="h-full">
              <div className="mv-frost relative overflow-hidden rounded-3xl p-7 md:p-9 h-full">
                <div className="relative z-10">
                  <p className="text-xs font-black tracking-[0.22em] uppercase text-electric-cyan mb-2">Τι περιλαμβάνουν τα 130€</p>
                  <p className="text-gray-300 text-[15px] leading-relaxed mb-5">
                    Όσα χρειάζεται κάθε ιστοσελίδα για να είναι online, όσα θα πληρώνατε ούτως ή άλλως, όπου κι αν τη φτιάχνατε. Εδώ τα έχετε όλα σε ένα, χωρίς τίποτα επιπλέον.
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-x-5 gap-y-3 mv-pop" data-io>
                    {HOSTING.map((t) => (
                      <li key={t} className="flex items-start gap-2.5 text-sm text-gray-200">
                        <span className="mt-0.5 w-5 h-5 rounded-md bg-electric-cyan/12 border border-electric-cyan/30 text-electric-cyan grid place-items-center shrink-0">{check('w-3 h-3')}</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 pt-5 border-t border-white/8 text-xs text-gray-400 leading-relaxed">
                    Τιμολόγιο για τα 130€ + ΦΠΑ, με τραπεζική μεταφορά, μόλις παραδοθεί το πρώτο σχέδιο. Ελάχιστη διάρκεια 1 έτος.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={240} direction="right" className="h-full">
              <PitchQuote lit className="h-full flex flex-col justify-center">{service.pitch[lang]}</PitchQuote>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── WHY FREE — the answer to «what's the catch?» ─── */}
      <section className="pb-24 pt-4 mv-amb alt">
        <div className="max-w-4xl lg:max-w-6xl mx-auto px-6">
          <ScrollReveal delay={60} direction="scale">
            <div className="mv-frost relative overflow-hidden rounded-3xl p-8 md:p-12">
              <div className="relative z-10 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-[1fr_1.08fr] lg:gap-0 why-cols">
                <div className="why-col">
                  <h2 data-fx="mask" className="text-3xl md:text-4xl font-black text-white mb-7 lg:mb-6 font-display">Γιατί είναι δωρεάν;</h2>
                  <span className="why-num" aria-hidden="true">01</span>
                  <p className="text-white text-lg md:text-xl lg:text-[1.22rem] leading-relaxed border-l-2 border-electric-cyan/70 pl-5 lg:border-l-0 lg:pl-0" data-lit>
                    Στη σημερινή εποχή, δεν νοείται επιχείρηση ή επαγγελματίας χωρίς παρουσία στο διαδίκτυο. Μια δική σας ιστοσελίδα δεν είναι πολυτέλεια — είναι αναγκαιότητα: είναι ο χώρος όπου σας βρίσκουν όσοι σας αναζητούν και όπου παρουσιάζεστε όπως πραγματικά σας αξίζει.
                  </p>
                </div>
                <div className="why-col space-y-6 lg:space-y-7">
                  <div>
                    <span className="why-num" aria-hidden="true">02</span>
                    <p className="text-gray-200 text-base md:text-[17px] leading-relaxed">
                      Πιστεύουμε ότι κάθε επαγγελματίας αξίζει μια πραγματικά επαγγελματική παρουσία στο διαδίκτυο — όχι μόνο όσοι μπορούν να διαθέσουν χιλιάδες ευρώ. Γι’ αυτό αναλαμβάνουμε την κατασκευή εντελώς δωρεάν, χωρίς κανένα εμπόδιο στην εκκίνηση.
                    </p>
                  </div>
                  <div className="lg:pt-7 lg:border-t lg:border-white/8">
                    <span className="why-num" aria-hidden="true">03</span>
                    <p className="text-gray-200 text-base md:text-[17px] leading-relaxed">
                      Κερδίζουμε κι εμείς: κάθε ιστοσελίδα που παραδίδουμε μεγαλώνει το πορτφόλιό μας και μας φέρνει τους επόμενους πελάτες. Προσφέρουμε επίσης κι άλλες υπηρεσίες, όπως διαχείριση social media και διαφημίσεις στο Google, που μπορείτε να επιλέξετε αν και όταν τις χρειαστείτε. Εσείς αποκτάτε μια premium ιστοσελίδα χωρίς ρίσκο, εμείς ένα ακόμα δείγμα δουλειάς που μας κάνει περήφανους. <span className="text-white font-bold mv-mark" data-io>Όλοι κερδίζουν.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── PORTFOLIO — real client sites, the ad's profession first ─── */}
      <section id="portfolio" className="py-24 bg-[#0b0c10]/60 border-y border-electric-cyan/8 scroll-mt-24">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <ScrollReveal className="text-center mb-14">
            <span className="section-label">Πορτφόλιο</span>
            <h2 className="text-4xl md:text-5xl font-black font-display mb-4 text-white tracking-tight">
              {niche ? `Ιστοσελίδες που φτιάξαμε για ${niche.who}` : 'Μερικές από τις ιστοσελίδες μας'}
            </h2>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Όλες είναι ιστοσελίδες πελατών μας, online στο δικό τους domain,{' '}
              <strong className="text-gray-200 font-semibold">γραμμένες από την αρχή σε κώδικα</strong>, όχι πάνω σε έτοιμο template. Πατήστε όποια θέλετε για να την ανοίξετε.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {work.map((item, index) => (
              <PortfolioCard key={item.url + index} item={item} lang={lang} d={index % 6} eager={index < 6} cls={allWork ? lastRowStart(index, work.length) : ''} />
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            {!allWork && (
              <button
                type="button"
                onClick={() => setShown((n) => n + MORE_CARDS)}
                className="btn-premium inline-flex items-center gap-2 px-7 py-3.5 border border-electric-cyan/40 text-electric-cyan text-sm font-bold rounded-xl hover:bg-electric-cyan hover:text-[#050608] transition-all"
              >
                Δείτε περισσότερες
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true"><path d="M12 5v14"/><path d="m5 12 7 7 7-7"/></svg>
              </button>
            )}
            <a
              href="#contact"
              onClick={(e) => goTo(e, 'contact')}
              className="btn-premium inline-flex items-center gap-2 px-7 py-3.5 bg-electric-cyan text-[#050608] text-sm font-black uppercase tracking-wide rounded-xl hover:bg-white transition-all"
            >
              Θέλω κι εγώ μια τέτοια
              {arrow('w-4 h-4')}
            </a>
          </div>
        </div>
      </section>

      {/* ─── GOOGLE REVIEWS — every written review, word for word ─── */}
      <Reviews />

      {/* ─── HOW IT WORKS · WHAT'S INCLUDED ─── */}
      <div id="vimata" className="scroll-mt-28"><StepsSection service={service} /></div>
      <IncludesTech service={service} />

      {/* ─── FAQ ─── */}
      <FaqSection faqs={LANDING_FAQS} />

      {/* ─── Phone booking bar (steps aside while the cookie box is open) ─── */}
      <div
        className={`lp-bar md:hidden fixed left-3 right-3 bottom-3 z-40 transition-all duration-300 ${showBar ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}
        aria-hidden={!showBar}
      >
        <a
          href="#contact"
          onClick={(e) => goTo(e, 'contact')}
          tabIndex={showBar ? 0 : -1}
          className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl bg-electric-cyan text-[#050608] font-black text-[0.95rem] uppercase tracking-[0.08em] shadow-[0_10px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(71,200,245,0.45)]"
        >
          Θέλω τη δωρεάν σελίδα μου
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

function PortfolioCard({ item, lang, cls = '', d = 0, eager = false }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      data-io
      className={`col-span-2 ${cls} mv-pf group img-shine relative overflow-hidden rounded-2xl border border-white/8 block bg-[#050608] glow-border-hover shadow-[0_18px_50px_-14px_rgba(0,0,0,0.9)] hover:-translate-y-1.5`}
      style={{ aspectRatio: '4/3', '--d': d }}
    >
      <Image src={item.image} alt={item.name} fill priority={eager} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/55 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-4">
        <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
          <p className="text-sm font-black text-white mb-2 leading-tight line-clamp-2">{lang === 'el' ? item.name : item.nameEn}</p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-electric-cyan/20 border border-electric-cyan/50 rounded-full text-[9px] font-black text-electric-cyan uppercase tracking-wider">
            Προβολή
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
          </span>
        </div>
      </div>
    </a>
  );
}

/* FAQ for the ads landing — every answer checked against the real offer (Angelo, 11 Oct 2026;
   22 Oct 2026: ΦΠΑ stated, Growth line removed). */
const LANDING_FAQS = [
  {
    q: { el: 'Πόσο κοστίζει η κατασκευή;', en: 'How much does the build cost?' },
    a: {
      el: 'Η κατασκευή είναι δωρεάν. Πληρώνετε μόνο φιλοξενία και domain: 130€ τον χρόνο + ΦΠΑ (10,83€ τον μήνα), ή 15€ τον μήνα + ΦΠΑ αν προτιμάτε μηνιαία πληρωμή — και μόνο αφού δείτε το πρώτο σχέδιο της σελίδας σας. Καμία προκαταβολή, καμία κρυφή χρέωση.',
      en: 'The build is free. You pay only hosting and domain: 130€ a year + VAT (10.83€ a month), or 15€ a month + VAT on monthly billing — and only after you have seen the first design of your website. No deposit, no hidden fees.',
    },
  },
  {
    q: { el: 'Πόσο χρόνο χρειάζεται από εμένα;', en: 'How much of my time does it take?' },
    a: {
      el: 'Λιγότερο από 1 ώρα συνολικά. Ένα δωρεάν τηλεφώνημα 15 λεπτών για να μας πείτε τι κάνετε, και μετά μας στέλνετε λίγες φωτογραφίες, τις υπηρεσίες σας και τα στοιχεία επικοινωνίας — αν δεν ξέρετε τι να στείλετε, σας καθοδηγούμε εμείς. Αν έχετε προφίλ στο doctoranytime, ξεκινάμε από εκεί και συνήθως χρειαζόμαστε μόνο τις φωτογραφίες σας. Τον σχεδιασμό, την κατασκευή, το domain και όλα τα τεχνικά τα αναλαμβάνουμε εμείς. Αν δεν έχετε λογότυπο, σχεδιάζουμε ένα για εσάς.',
      en: 'Less than 1 hour in total. A free 15-minute call to tell us what you do, then you send us a few photos, your services and your contact details — if you are not sure what to send, we guide you. If you have a doctoranytime profile we start from it and usually need only your photos. Design, build, domain and everything technical are on us. If you have no logo, we design one.',
    },
  },
  {
    q: { el: 'Πόσο γρήγορα θα είναι έτοιμη;', en: 'How fast will it be ready?' },
    a: {
      el: 'Μόλις λάβουμε το υλικό σας, το πρώτο σχέδιο είναι έτοιμο σε 4–10 ημέρες. Μετά κάνουμε μαζί όσες αλλαγές θέλετε, και μόλις την εγκρίνετε βγαίνει online σε 1–2 ημέρες.',
      en: 'Once we have your material, the first design is ready in 4–10 days. Then we make as many changes as you want together, and once you approve it, it goes live in 1–2 days.',
    },
  },
  {
    q: { el: 'Τι γίνεται αν δεν μου αρέσει το αποτέλεσμα;', en: 'What if I don’t like the result?' },
    a: {
      el: 'Το αλλάζουμε — όσες φορές χρειαστεί, χωρίς χρέωση, μέχρι να είναι ακριβώς όπως το θέλετε, πριν βγει online. Κι επειδή δεν έχετε δώσει προκαταβολή, δεν ρισκάρετε τίποτα για να δείτε το πρώτο σχέδιο.',
      en: 'We change it — as many times as needed, free of charge, until it is exactly how you want it, before it goes live. And since you paid no deposit, seeing the first design costs you nothing.',
    },
  },
  {
    q: { el: 'Μπορώ να σας δείξω μια ιστοσελίδα που μου αρέσει;', en: 'Can I show you a website I like?' },
    a: {
      el: 'Ναι, και μας βοηθάει πολύ. Στείλτε μας το link — μπορεί να είναι ιστοσελίδα άλλου επαγγελματία, ξένη, ή κάποια από το πορτφόλιό μας. Μπορούμε να κρατήσουμε μόνο το ύφος της ή να φτιάξουμε τη δική σας σχεδόν ίδια, με τα δικά σας κείμενα, φωτογραφίες και χρώματα.',
      en: 'Yes, and it helps a lot. Send us the link — another professional’s site, a foreign one, or one from our portfolio. We can keep just its style, or build yours almost the same, with your own texts, photos and colours.',
    },
  },
  {
    q: { el: 'Χρειάζομαι τεχνικές γνώσεις;', en: 'Do I need technical knowledge?' },
    a: {
      el: 'Όχι. Αναλαμβάνουμε τα πάντα: σχεδιασμό, κατασκευή, domain, φιλοξενία, ασφάλεια και συντήρηση. Εσείς στέλνετε το υλικό σας και εγκρίνετε το αποτέλεσμα — τίποτα τεχνικό δεν περνάει από εσάς.',
      en: 'No. We handle everything: design, build, domain, hosting, security and maintenance. You send your material and approve the result — nothing technical goes through you.',
    },
  },
  {
    q: { el: 'Μπορώ να αλλάξω πράγματα στη σελίδα αργότερα;', en: 'Can I change things later?' },
    a: {
      el: 'Ναι. Μέχρι να βγει online, οι αλλαγές είναι απεριόριστες και χωρίς χρέωση. Μετά τη δημοσίευση, κάθε αίτημα αλλαγών κοστίζει 50€ — ένα αίτημα μπορεί να περιλαμβάνει όσες αλλαγές θέλετε, σε ένα μήνυμα — και ολοκληρώνεται εντός 3 εργάσιμων ημερών. Αν προτιμάτε να αλλάζετε μόνοι σας κείμενα και εικόνες, προσθέτουμε πίνακα διαχείρισης (180€ εφάπαξ).',
      en: 'Yes. Until it goes live, changes are unlimited and free. After publishing, each change request costs 50€ — one request can include as many changes as you like, in one message — and is done within 3 working days. If you prefer to change texts and images yourself, we add an admin panel (180€ one-off).',
    },
  },
];
