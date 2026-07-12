// components/service/blocks.jsx
// Shared building blocks for dedicated service pages. Composed by
// ServicePageClient (standard pages) and by the custom rebuilt pages
// (kataskevi-istoselidas, google-reviews-nfc).
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLangStore } from '@/store/langStore';
import ScrollReveal from '@/components/ScrollReveal';
import PitchQuote from '@/components/PitchQuote';

/* ─── Icons (lucide outline style, matching the rest of the site) ─── */
const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const ICONS = {
  globe: (cls = 'w-7 h-7') => (
    <svg {...iconProps} className={cls}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
  ),
  star: (cls = 'w-7 h-7') => (
    <svg {...iconProps} className={cls}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
  calendar: (cls = 'w-7 h-7') => (
    <svg {...iconProps} className={cls}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
  ),
  bot: (cls = 'w-7 h-7') => (
    <svg {...iconProps} className={cls}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
  ),
  building: (cls = 'w-7 h-7') => (
    <svg {...iconProps} className={cls}><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
  ),
  qr: (cls = 'w-7 h-7') => (
    <svg {...iconProps} className={cls}><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
  ),
  code: (cls = 'w-7 h-7') => (
    <svg {...iconProps} className={cls}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  ),
  heart: (cls = 'w-7 h-7') => (
    <svg {...iconProps} className={cls}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  ),
  calculator: (cls = 'w-7 h-7') => (
    <svg {...iconProps} className={cls}><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
  ),
  instagram: (cls = 'w-7 h-7') => (
    <svg {...iconProps} className={cls}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
  ),
  check: (cls = 'w-5 h-5') => (
    <svg {...iconProps} strokeWidth="2.5" className={cls}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
  ),
};

/* ─── Hero: label + oversized H1 + pitch quote (+ optional subline) ─── */
export function ServiceHero({ service, children }) {
  const { lang } = useLangStore();
  return (
    <section className="pt-16 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-[radial-gradient(ellipse,rgba(71,200,245,0.09)_0%,transparent_65%)] blur-[80px]" />
        {/* Tech grid, echoing the homepage hero */}
        <div
          className="absolute inset-x-0 top-0 h-[420px]"
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
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <ScrollReveal>
          <span className="section-label">{lang === 'el' ? 'Υπηρεσία' : 'Service'}</span>
          <h1
            className="font-black font-display mb-5 text-white tracking-tight leading-[1.06]"
            style={{ fontSize: 'clamp(2.6rem, 6vw, 4.5rem)' }}
          >
            {service.h1[lang]}
          </h1>
          {service.sub && (
            <p className="text-gray-400 text-lg mb-4">{service.sub[lang]}</p>
          )}
        </ScrollReveal>
        {children}
        <ScrollReveal delay={140} direction="scale">
          <PitchQuote className="text-left mt-8 max-w-3xl mx-auto">{service.pitch[lang]}</PitchQuote>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── The pain — lead pull-quote line + short airy paragraphs ─── */
export function PainSection({ service }) {
  const { lang } = useLangStore();
  const [lead, ...rest] = service.pain;
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute rounded-full" style={{ top: '-10%', right: '-12%', width: 'min(45vw, 460px)', height: 'min(45vw, 460px)', background: 'radial-gradient(circle, rgba(107,63,160,0.1) 0%, transparent 65%)', filter: 'blur(90px)' }} />
      </div>
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Pull-quote lead */}
        <ScrollReveal>
          <p
            className="font-display font-bold text-white leading-snug mb-12 relative pl-6"
            style={{ fontSize: 'clamp(1.35rem, 2.6vw, 1.85rem)' }}
          >
            <span aria-hidden="true" className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-gradient-to-b from-electric-cyan to-electric-cyan/10" />
            {lead[lang]}
          </p>
        </ScrollReveal>
        {/* Supporting paragraphs — generous whitespace */}
        <div className="space-y-8">
          {rest.map((p, i) => (
            <ScrollReveal key={i} delay={i * 90}>
              <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                {p[lang]}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── «Πώς λειτουργεί» — numbered milestones on a connected line ─── */
export function StepsSection({ service }) {
  const { lang } = useLangStore();
  const cols = service.steps.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';
  const inset = service.steps.length === 3 ? 'md:left-[calc(16.66%+1rem)] md:right-[calc(16.66%+1rem)]' : 'lg:left-[calc(12.5%+1rem)] lg:right-[calc(12.5%+1rem)]';
  return (
    <section className="py-24 bg-[#0a1418]/60 border-y border-electric-cyan/8 backdrop-blur-sm relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="section-label">{lang === 'el' ? 'Βήμα - Βήμα' : 'Step by Step'}</span>
          <h2 className="text-3xl md:text-4xl font-black font-display mb-3 text-white tracking-tight">
            {lang === 'el' ? 'Πώς λειτουργεί' : 'How It Works'}
          </h2>
        </ScrollReveal>

        <div className={`grid gap-10 md:gap-8 relative ${cols}`}>
          {/* Connector line between milestone nodes (desktop) */}
          <div
            aria-hidden="true"
            className={`hidden md:block absolute top-8 h-px bg-gradient-to-r from-electric-cyan/25 via-electric-cyan/60 to-electric-cyan/25 left-0 right-0 ${inset}`}
          />
          {/* Mobile connector — vertical */}
          <div aria-hidden="true" className="md:hidden absolute top-4 bottom-8 left-[31px] w-px bg-gradient-to-b from-electric-cyan/50 via-electric-cyan/30 to-transparent" />

          {service.steps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 120} direction="up" className="h-full">
              <div className="relative flex md:flex-col items-start md:items-center gap-5 md:gap-0 md:text-center h-full pl-0">
                <div
                  className="w-16 h-16 shrink-0 md:mx-auto md:mb-6 rounded-full bg-[#0a1418] border-2 border-electric-cyan/45 flex items-center justify-center relative z-10"
                  style={{ boxShadow: '0 0 26px rgba(71,200,245,0.18), inset 0 0 14px rgba(71,200,245,0.06)' }}
                >
                  <span className="text-xl font-black text-electric-cyan">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-2 leading-snug">{step.title[lang]}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-xs md:mx-auto">{step.body[lang]}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── «Τι περιλαμβάνει» — icon + short-line grid ─── */
export function IncludesSection({ service }) {
  const { lang } = useLangStore();
  const twoCol = service.includes.length !== 3;
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <span className="section-label">{lang === 'el' ? 'Παροχές' : 'What You Get'}</span>
          <h2 className="text-3xl md:text-4xl font-black font-display mb-3 text-white tracking-tight">
            {lang === 'el' ? 'Τι περιλαμβάνει' : "What's Included"}
          </h2>
        </ScrollReveal>
        <div className={`grid gap-5 ${twoCol ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
          {service.includes.map((item, i) => (
            <ScrollReveal
              key={i}
              delay={(i % 2) * 90 + Math.floor(i / 2) * 50}
              direction={i % 2 === 0 ? 'left' : 'right'}
              className={`h-full ${twoCol && service.includes.length % 2 === 1 && i === service.includes.length - 1 ? 'sm:col-span-2' : ''}`}
            >
              <div className="glass-panel card-sweep rounded-2xl p-6 flex items-start gap-4 h-full group">
                <div className="w-11 h-11 rounded-xl bg-electric-cyan/10 border border-electric-cyan/20 flex items-center justify-center text-electric-cyan shrink-0 icon-glow group-hover:bg-electric-cyan/20 transition-colors duration-300">
                  {ICONS.check('w-5 h-5')}
                </div>
                <p className="text-gray-200 text-[0.95rem] leading-relaxed pt-1">{item[lang]}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        {service.pitch2 && (
          <ScrollReveal delay={120} className="mt-12 max-w-3xl mx-auto">
            <PitchQuote compact>{service.pitch2[lang]}</PitchQuote>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

/* ─── Proof band: big numbers, small labels — consistent across pages ─── */
export function ProofStrip() {
  const { lang } = useLangStore();
  const stats = [
    { num: '200+', el: 'ΙΣΤΟΣΕΛΙΔΕΣ ΓΙΑ ΕΛΛΗΝΙΚΕΣ ΕΠΙΧΕΙΡΗΣΕΙΣ', en: 'WEBSITES FOR GREEK BUSINESSES' },
    { num: '100+', el: 'ΚΡΙΤΙΚΕΣ 5★ ΣΤΟ GOOGLE', en: '5★ REVIEWS ON GOOGLE' },
  ];
  return (
    <div className="border-y border-electric-cyan/10 bg-[#0a1418]/50 backdrop-blur-sm py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: '70%', height: '180%', background: 'radial-gradient(ellipse, rgba(71,200,245,0.06) 0%, transparent 65%)', filter: 'blur(70px)' }} />
      </div>
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
          {stats.map(({ num, el, en }) => (
            <div key={num} className="text-center group">
              <div
                className="font-black font-display price-gradient mb-1.5 transition-transform duration-300 group-hover:scale-105"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 3.75rem)', filter: 'drop-shadow(0 0 20px rgba(71,200,245,0.25))' }}
              >
                {num}
              </div>
              <div className="h-[2px] w-8 bg-electric-cyan/35 mx-auto mb-2.5" />
              <div className="text-[0.62rem] font-black tracking-[0.2em] text-gray-500 uppercase max-w-[220px]">
                {lang === 'el' ? el : en}
              </div>
            </div>
          ))}
          <div className="hidden md:block w-px h-16 bg-electric-cyan/15" aria-hidden="true" />
          <Link
            href="/kataskevi-istoselidas#portfolio"
            className="btn-premium inline-flex items-center gap-2 px-7 py-3 border border-electric-cyan/40 text-electric-cyan text-sm font-bold rounded-xl hover:bg-electric-cyan hover:text-[#050a0e] transition-all"
          >
            {lang === 'el' ? 'Δείτε το πορτφόλιό μας →' : 'See our portfolio →'}
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── FAQ accordion ─── */
export function FaqSection({ service }) {
  const { lang } = useLangStore();
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <span className="section-label">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-black font-display mb-3 text-white tracking-tight">
            {lang === 'el' ? 'Συχνές Ερωτήσεις' : 'Frequently Asked Questions'}
          </h2>
        </ScrollReveal>
        <div className="space-y-3">
          {service.faqs.map(({ q, a }, i) => (
            <ScrollReveal key={i} delay={i * 60}>
              <div className="glass-panel rounded-2xl overflow-hidden border border-white/8 hover:border-electric-cyan/25 transition-colors duration-300">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-bold text-white text-base">{q[lang]}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={`w-5 h-5 text-electric-cyan shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                  >
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                <div className={`acc-body ${openFaq === i ? 'acc-open' : ''}`}>
                  <div>
                    <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                      {a[lang]}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA — full-width band, identical on every page ─── */
export function CtaBand() {
  const { lang } = useLangStore();
  return (
    <section className="py-24 relative overflow-hidden border-t border-electric-cyan/10 bg-gradient-to-b from-transparent to-[#0a1418]/60">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_70%_at_50%_100%,rgba(71,200,245,0.08)_0%,transparent_70%)]" />
        <div className="absolute top-0 left-0 right-0 cyber-divider" />
      </div>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <ScrollReveal>
          <h2
            className="font-black font-display mb-4 text-white tracking-tight"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)' }}
          >
            {lang === 'el' ? 'Ας το συζητήσουμε' : "Let's talk it through"}
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            {lang === 'el'
              ? 'Στείλτε μας ένα μήνυμα ή κλείστε μια δωρεάν συμβουλευτική κλήση — θα σας απαντήσουμε μέσα στην ίδια ημέρα.'
              : 'Send us a message or book a free consultation call — we reply within the same day.'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="#contact"
              className="btn-premium inline-flex items-center gap-3 px-10 py-4 bg-electric-cyan text-[#050a0e] font-black text-base uppercase tracking-[0.1em] rounded-xl hover:bg-white transition-all duration-300 hover:scale-105"
              style={{ boxShadow: '0 0 30px rgba(71,200,245,0.4), 0 4px 20px rgba(0,0,0,0.4)', animation: 'heroCTAPulse 3s ease-in-out infinite' }}
            >
              {lang === 'el' ? 'Φόρμα Επικοινωνίας' : 'Contact Form'}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <a
              href="mailto:angelos@advonmedia.com"
              className="btn-premium inline-flex items-center gap-3 px-10 py-4 bg-transparent border-2 border-electric-cyan text-electric-cyan font-black text-base uppercase tracking-[0.1em] rounded-xl hover:bg-electric-cyan hover:text-[#050a0e] transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              Email
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
