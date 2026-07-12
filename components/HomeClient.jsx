// components/HomeClient.jsx
'use client';
import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLangStore } from '@/store/langStore';
import Reviews from '@/components/Reviews';
import Stats from '@/components/sats';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';
import PitchQuote from '@/components/PitchQuote';
import { services, extras } from '@/lib/services';
import { ICONS } from '@/components/service/blocks';

const marqueeItems = [
  'Κατασκευή Ιστοσελίδων',
  'Παρουσία στο Google',
  'Online Ραντεβού',
  'AI Βοηθός Ιστοσελίδας',
  'Direct Booking',
  'Ψηφιακό Μενού QR',
  'Custom Λογισμικό',
  'SEO Optimization',
];

export default function HomeClient() {
  const { lang } = useLangStore();
  const heroDecoRef = useRef(null);
  const magnetRef = useRef(null);

  const onMagnetMove = (e) => {
    const el = magnetRef.current;
    if (!el || !window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${(x * 0.18).toFixed(1)}px, ${(y * 0.25).toFixed(1)}px) scale(1.05)`;
  };
  const onMagnetLeave = () => {
    const el = magnetRef.current;
    if (el) el.style.transform = 'translate(0px, 0px) scale(1)';
  };

  useEffect(() => {
    const onScroll = () => {
      if (heroDecoRef.current) {
        heroDecoRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">

        {/* ── PARALLAX DECORATION LAYERS (slower than scroll) ── */}
        <div
          ref={heroDecoRef}
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ willChange: 'transform' }}
        >
          {/* Ambient aurora orbs */}
          <div className="absolute rounded-full" style={{ top: '-15%', left: '-10%', width: 'min(70vw, 700px)', height: 'min(70vw, 700px)', background: 'radial-gradient(circle, rgba(71,200,245,0.13) 0%, transparent 65%)', filter: 'blur(70px)', animation: 'auroraFloat1 22s ease-in-out infinite' }} />
          <div className="absolute rounded-full" style={{ bottom: '-12%', right: '-5%', width: 'min(60vw, 620px)', height: 'min(60vw, 620px)', background: 'radial-gradient(circle, rgba(107,63,160,0.16) 0%, transparent 65%)', filter: 'blur(90px)', animation: 'auroraFloat2 28s ease-in-out infinite' }} />
          <div className="absolute rounded-full" style={{ top: '28%', left: '55%', width: 'min(38vw, 420px)', height: 'min(38vw, 420px)', background: 'radial-gradient(circle, rgba(71,200,245,0.09) 0%, transparent 60%)', filter: 'blur(55px)', animation: 'auroraFloat3 17s ease-in-out infinite' }} />

          {/* Tech grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(71,200,245,0.055) 1px, transparent 1px),' +
                'linear-gradient(90deg, rgba(71,200,245,0.055) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 5%, transparent 72%)',
              WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 5%, transparent 72%)',
            }}
          />

          {/* Laser beams — skewed outer wrapper keeps angle fixed; inner div sweeps via laserSweep */}
          {[
            { top: '17%', skew: -8,  dur: '5s',    delay: '0s',   w: 2, cyan: true,  op: 0.65 },
            { top: '40%', skew: -5,  dur: '8.5s',  delay: '1.8s', w: 1, cyan: true,  op: 0.4  },
            { top: '63%', skew: -13, dur: '11.5s', delay: '0.5s', w: 2, cyan: true,  op: 0.5  },
            { top: '29%', skew: -6,  dur: '7s',    delay: '3.5s', w: 1, cyan: false, op: 0.36 },
          ].map((b, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: b.top,
                left: 0,
                right: 0,
                height: `${b.w}px`,
                transform: `skewX(${b.skew}deg)`,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '-30%',
                  width: '30%',
                  height: '100%',
                  opacity: b.op,
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

        {/* ── Scanline overlay (fixed — not parallaxed) ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)',
            opacity: 0.35,
          }}
        />

        {/* ── Central radial glow ── */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: '900px', height: '600px', background: 'radial-gradient(ellipse, rgba(71,200,245,0.08) 0%, transparent 65%)', filter: 'blur(60px)' }}
          />
        </div>

        {/* ── CONTENT ── */}
        <div className="container max-w-7xl mx-auto px-6 text-center z-10">

          {/* Animated badge */}
          <div
            className="reveal-item delay-1 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-electric-cyan/50 bg-electric-cyan/8 mb-10 badge-scan"
            style={{ boxShadow: '0 0 30px rgba(71,200,245,0.2), inset 0 0 20px rgba(71,200,245,0.05)' }}
          >
            <span className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse" style={{ boxShadow: '0 0 12px #47c8f5' }} />
            <span className="text-[0.65rem] font-black tracking-[0.3em] text-white uppercase">ADVON MEDIA</span>
            <span className="text-[0.65rem] font-semibold tracking-[0.15em] text-electric-cyan/70 uppercase hidden sm:inline">
              {lang === 'el' ? '— Ιστοσελίδες & Ψηφιακά Εργαλεία' : '— Websites & Digital Tools'}
            </span>
          </div>

          {/* Kinetic headline */}
          <h1
            className="font-black font-display mb-8 leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(2.6rem, 7vw, 6rem)', perspective: '1000px' }}
          >
            <span className="reveal-word !block" style={{ animationDelay: '0.15s' }}>
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500">
                {lang === 'el' ? 'Φτιάχνουμε την' : 'We build your'}
              </span>
            </span>
            <span className="reveal-word inline-block" style={{ animationDelay: '0.35s' }}>
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500">
                {lang === 'el' ? 'ιστοσελίδα σας' : 'website'}
              </span>
            </span>
            {' '}
            <span className="reveal-word inline-block" style={{ animationDelay: '0.55s' }}>
              <span
                className="text-shimmer"
                style={{ filter: 'drop-shadow(0 0 45px rgba(71,200,245,0.6))' }}
              >
                {lang === 'el' ? 'δωρεάν.' : 'for free.'}
              </span>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="reveal-item delay-4 text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed font-medium"
            style={{ fontSize: 'clamp(1rem, 2.2vw, 1.25rem)' }}
          >
            {lang === 'el'
              ? 'Χωρίς προκαταβολή: πληρώνετε μόνο τη φιλοξενία, όταν παραδοθεί το πρώτο δείγμα της σελίδας σας. Και από εκεί, κάνουμε όσες αλλαγές χρειαστούν — μέχρι να είναι ακριβώς όπως την έχετε στο μυαλό σας.'
              : "No deposit: you pay only the hosting, once the first draft of your website is delivered. From there, we make as many changes as it takes — until it's exactly how you imagined it."}
          </p>

          {/* Proof line */}
          <p className="reveal-item delay-5 text-electric-cyan/90 text-sm md:text-base font-bold tracking-wide mb-6">
            {lang === 'el'
              ? '200+ ιστοσελίδες για ελληνικές επιχειρήσεις · 100+ κριτικές 5★ στο Google'
              : '200+ websites for Greek businesses · 100+ 5★ reviews on Google'}
          </p>

          {/* Bridge sentence */}
          <p className="reveal-item delay-5 text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed text-sm md:text-base">
            {lang === 'el'
              ? 'Και δεν σταματάμε στη σελίδα. Τη βάζουμε να δουλεύει για εσάς: κριτικές στο Google, online ραντεβού, κρατήσεις χωρίς προμήθειες, AI βοηθός που απαντά όταν εσείς δεν μπορείτε.'
              : "And we don't stop at the website. We put it to work for you: Google reviews, online appointments, commission-free bookings, an AI assistant that answers when you can't."}
          </p>

          {/* CTA Buttons */}
          <div className="reveal-item delay-6 flex flex-wrap items-center justify-center gap-5">
            {/* Primary — animated glow pulse */}
            <Link
              ref={magnetRef}
              onMouseMove={onMagnetMove}
              onMouseLeave={onMagnetLeave}
              href="/kataskevi-istoselidas"
              className="btn-premium group relative overflow-hidden px-9 py-4 bg-electric-cyan text-[#050a0e] font-black text-base uppercase tracking-[0.1em] rounded-xl flex items-center gap-3 transition-all duration-300"
              style={{ animation: 'heroCTAPulse 3s ease-in-out infinite' }}
            >
              <span className="relative z-10 flex items-center gap-3">
                {lang === 'el' ? 'Η ΔΩΡΕΑΝ ΣΕΛΙΔΑ ΣΑΣ' : 'YOUR FREE WEBSITE'}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </Link>

            {/* Secondary — neon border glow */}
            <Link
              href="/#services"
              className="btn-premium group px-9 py-4 bg-transparent border-2 border-electric-cyan text-electric-cyan font-black text-base uppercase tracking-[0.1em] rounded-xl hover:bg-electric-cyan hover:text-[#050a0e] transition-all duration-300 flex items-center gap-3 backdrop-blur-sm"
              style={{ animation: 'borderGlow 3s ease-in-out infinite 1s' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>
              {lang === 'el' ? 'ΥΠΗΡΕΣΙΕΣ' : 'SERVICES'}
            </Link>

            <Link
              href="#contact"
              className="btn-premium group px-9 py-4 bg-white/5 border border-white/20 text-white font-black text-base uppercase tracking-[0.1em] rounded-xl hover:bg-white hover:text-[#050a0e] transition-all duration-300 flex items-center gap-3 backdrop-blur-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              {lang === 'el' ? 'ΕΠΙΚΟΙΝΩΝΙΑ' : 'CONTACT'}
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="reveal-item delay-6 flex justify-center mt-16">
            <div className="flex flex-col items-center gap-2 opacity-40">
              <span className="text-[0.6rem] tracking-[0.25em] uppercase text-gray-500">
                {lang === 'el' ? 'Κάντε Scroll' : 'Scroll Down'}
              </span>
              <div className="w-px h-10 bg-gradient-to-b from-electric-cyan/60 to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE TICKER ─── */}
      <div className="overflow-hidden py-5 border-y border-electric-cyan/10 bg-[#050a0e]/60 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050a0e] via-transparent to-[#050a0e] z-10 pointer-events-none" />
        <div className="flex gap-0 marquee-track" style={{ width: 'max-content' }}>
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-5 px-6 whitespace-nowrap">
              <span className="text-[0.7rem] font-black tracking-[0.2em] uppercase text-gray-500">{item}</span>
              <span className="w-1 h-1 rounded-full bg-electric-cyan/50 flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {/* ─── STATS ─── */}
      <Stats />

      {/* ─── SERVICES ─── */}
      <section id="services" className="py-32 relative scroll-mt-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-[radial-gradient(ellipse,rgba(71,200,245,0.03)_0%,transparent_70%)] blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-20">
            <span className="section-label">{lang === 'el' ? 'Υπηρεσίες' : 'Services'}</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-display mb-4 tracking-tight">
              {lang === 'el' ? 'Οι Υπηρεσίες μας' : 'Our Services'}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {lang === 'el'
                ? 'Ό,τι χρειάζεται η επιχείρησή σας για να σας βρίσκουν, να σας εμπιστεύονται — και να κλείνουν.'
                : 'Everything your business needs to be found, to be trusted — and to get booked.'}
            </p>
          </ScrollReveal>

          {/* 3 + 4 symmetric grid: three anchor services on row one (span 4/12),
              four on row two (span 3/12); tablet gets a full-width 7th card. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-stretch">
            {services.map((service, i) => {
              const isKataskevi = service.slug === 'kataskevi-istoselidas';
              const span = i < 3 ? 'lg:col-span-4' : 'lg:col-span-3';
              const tabletFix = i === services.length - 1 ? 'md:col-span-2 lg:col-span-3' : '';
              return (
                <ScrollReveal
                  key={service.slug}
                  delay={(i % 4) * 100}
                  direction="up"
                  className={`h-full ${span} ${tabletFix}`}
                >
                  <TiltCard className="h-full">
                    <div className="glass-panel service-card card-sweep rounded-3xl p-8 flex flex-col h-full group">
                      <div className="w-14 h-14 rounded-2xl bg-electric-cyan/10 border border-electric-cyan/20 flex items-center justify-center mb-6 text-electric-cyan group-hover:bg-electric-cyan/20 group-hover:scale-110 transition-all duration-300">
                        {ICONS[service.icon]('w-7 h-7')}
                      </div>
                      {isKataskevi && (
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-3xl font-black price-gradient">{lang === 'el' ? 'ΔΩΡΕΑΝ' : 'FREE'}</span>
                          <span className="text-sm text-gray-500">{lang === 'el' ? '(10.83€/μήνα hosting)' : '(10.83€/mo hosting)'}</span>
                        </div>
                      )}
                      <h3 className="text-xl font-bold mb-4 font-display text-white">{service.nav[lang]}</h3>
                      {isKataskevi ? (
                        <>
                          <p className="text-gray-400 mb-5 leading-relaxed text-sm">
                            {lang === 'el' ? 'Επαγγελματική ιστοσελίδα που κατακτά υψηλές θέσεις στη Google.' : 'Professional website that conquers high rankings on Google.'}
                          </p>
                          <ul className="space-y-2.5 mb-5">
                            {[
                              { el: 'Επαγγελματικός σχεδιασμός', en: 'Professional design' },
                              { el: 'SEO βελτιστοποίηση', en: 'SEO optimization' },
                              { el: 'Mobile responsive', en: 'Mobile responsive' },
                              { el: 'Απεριόριστες αλλαγές μέχρι την τελειότητα', en: 'Unlimited changes until perfection' },
                            ].map((item) => (
                              <li key={item.en} className="flex items-start gap-3 text-sm text-gray-400 leading-relaxed">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-electric-cyan shrink-0 mt-0.5 icon-glow"><polyline points="20 6 9 17 4 12"/></svg>
                                {item[lang]}
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <ul className="space-y-2.5 mb-5">
                          {service.card.points.map((pi) => (
                            <li key={pi} className="flex items-start gap-3 text-sm text-gray-400 leading-relaxed">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-electric-cyan shrink-0 mt-0.5 icon-glow"><polyline points="20 6 9 17 4 12"/></svg>
                              {service.includes[pi][lang]}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mb-7 flex-grow">
                        <PitchQuote compact>{service.pitch[lang]}</PitchQuote>
                      </div>
                      <Link
                        href={`/${service.slug}`}
                        className="btn-premium flex items-center justify-center gap-2 w-full py-3.5 bg-electric-cyan text-[#050a0e] font-bold rounded-xl hover:bg-white transition-colors uppercase text-sm tracking-wide mt-auto"
                      >
                        {service.card.cta[lang]}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </Link>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              );
            })}
          </div>

          {/* ── «Ακόμη» strip ── */}
          <ScrollReveal delay={80} className="mt-16">
            <div className="text-center mb-8">
              <span className="section-label">{lang === 'el' ? 'Ακόμη' : 'And More'}</span>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {extras.map((extra) => {
                const icon =
                  extra.key === 'wedding' ? ICONS.heart('w-6 h-6')
                  : extra.key === 'calculators' ? ICONS.calculator('w-6 h-6')
                  : ICONS.instagram('w-6 h-6');
                const inner = (
                  <div className="glass-panel card-sweep rounded-2xl p-6 flex gap-4 h-full group">
                    <div className="w-12 h-12 bg-electric-cyan/10 border border-electric-cyan/20 rounded-xl flex items-center justify-center text-electric-cyan shrink-0 group-hover:bg-electric-cyan/20 transition-colors duration-300">
                      {icon}
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1.5 flex items-center gap-2">
                        {extra.title[lang]}
                        {extra.href && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-electric-cyan"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        )}
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{extra.body[lang]}</p>
                    </div>
                  </div>
                );
                return extra.href ? (
                  <Link key={extra.key} href={extra.href} className="h-full block">
                    {inner}
                  </Link>
                ) : (
                  <div key={extra.key} className="h-full">
                    {inner}
                  </div>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Bottom CTA */}
          <ScrollReveal delay={100} className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 flex-wrap justify-center">
              <span className="text-gray-500 text-sm">{lang === 'el' ? 'Δεν είστε σίγουροι ποια υπηρεσία ταιριάζει;' : 'Not sure which service fits?'}</span>
              <Link href="#contact" className="btn-premium inline-flex items-center gap-2 px-6 py-2.5 border border-electric-cyan/40 text-electric-cyan text-sm font-bold rounded-xl hover:bg-electric-cyan hover:text-[#050a0e] transition-all">
                {lang === 'el' ? 'Δωρεάν Ραντεβού →' : 'Free Consultation →'}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <Reviews />
    </>
  );
}
