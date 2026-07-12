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
import { PROOF } from '@/lib/services';

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
};

const CheckIcon = () => (
  <svg {...iconProps} strokeWidth="3" className="w-4 h-4 text-electric-cyan shrink-0 mt-1">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/* ─── Hero: label + H1 + pitch quote (+ optional subline / second pitch) ─── */
export function ServiceHero({ service }) {
  const { lang } = useLangStore();
  return (
    <section className="pt-16 pb-14 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse,rgba(71,200,245,0.08)_0%,transparent_65%)] blur-[80px]" />
      </div>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <ScrollReveal>
          <span className="section-label">{lang === 'el' ? 'Υπηρεσία' : 'Service'}</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display mb-5 text-white tracking-tight leading-[1.08]">
            {service.h1[lang]}
          </h1>
          {service.sub && (
            <p className="text-gray-400 text-lg mb-8">{service.sub[lang]}</p>
          )}
        </ScrollReveal>
        <ScrollReveal delay={120} direction="scale">
          <PitchQuote className="text-left mt-6">{service.pitch[lang]}</PitchQuote>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── The pain — 2-3 short paragraphs ─── */
export function PainSection({ service }) {
  const { lang } = useLangStore();
  return (
    <section className="py-14">
      <div className="max-w-3xl mx-auto px-6">
        <ScrollReveal>
          <div className="glass-panel rounded-3xl p-8 md:p-12 space-y-5">
            {service.pain.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'text-gray-200 text-lg leading-relaxed border-l-2 border-electric-cyan/60 pl-5'
                    : 'text-gray-400 text-base leading-relaxed'
                }
              >
                {p[lang]}
              </p>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── «Πώς λειτουργεί» — numbered steps ─── */
export function StepsSection({ service }) {
  const { lang } = useLangStore();
  const cols = service.steps.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';
  return (
    <section className="py-20 bg-[#0a1418]/60 border-y border-electric-cyan/8 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <span className="section-label">{lang === 'el' ? 'Βήμα - Βήμα' : 'Step by Step'}</span>
          <h2 className="text-3xl md:text-4xl font-black font-display mb-3 text-white tracking-tight">
            {lang === 'el' ? 'Πώς λειτουργεί' : 'How It Works'}
          </h2>
        </ScrollReveal>
        <div className={`grid gap-8 ${cols}`}>
          {service.steps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 110} direction="up" className="h-full">
              <div className="text-center h-full flex flex-col items-center">
                <div
                  className="w-16 h-16 mb-5 rounded-full bg-electric-cyan/10 border-2 border-electric-cyan/40 flex items-center justify-center"
                  style={{ boxShadow: '0 0 24px rgba(71,200,245,0.15)' }}
                >
                  <span className="text-xl font-black text-electric-cyan">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2.5">{step.title[lang]}</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">{step.body[lang]}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── «Τι περιλαμβάνει» — checklist from the points ─── */
export function IncludesSection({ service }) {
  const { lang } = useLangStore();
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        <ScrollReveal className="text-center mb-12">
          <span className="section-label">{lang === 'el' ? 'Παροχές' : 'What You Get'}</span>
          <h2 className="text-3xl md:text-4xl font-black font-display mb-3 text-white tracking-tight">
            {lang === 'el' ? 'Τι περιλαμβάνει' : "What's Included"}
          </h2>
        </ScrollReveal>
        <div className="space-y-3">
          {service.includes.map((item, i) => (
            <ScrollReveal key={i} delay={i * 70}>
              <div className="glass-panel card-sweep rounded-2xl px-6 py-5 flex items-start gap-4">
                <CheckIcon />
                <p className="text-gray-200 text-base leading-relaxed">{item[lang]}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        {service.pitch2 && (
          <ScrollReveal delay={100} className="mt-10">
            <PitchQuote compact className="mx-2">{service.pitch2[lang]}</PitchQuote>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

/* ─── Proof strip: 200+ sites · 100+ reviews · portfolio link ─── */
export function ProofStrip() {
  const { lang } = useLangStore();
  return (
    <div className="border-y border-electric-cyan/10 bg-[#050a0e]/60 backdrop-blur-sm py-8">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-center">
        <div>
          <div className="text-2xl md:text-3xl font-black price-gradient">200+</div>
          <div className="text-gray-500 text-xs md:text-sm mt-1">
            {lang === 'el' ? 'ιστοσελίδες για ελληνικές επιχειρήσεις' : 'websites for Greek businesses'}
          </div>
        </div>
        <div className="hidden md:block w-px h-10 bg-electric-cyan/15" aria-hidden="true" />
        <div>
          <div className="text-2xl md:text-3xl font-black price-gradient">100+</div>
          <div className="text-gray-500 text-xs md:text-sm mt-1">
            {lang === 'el' ? 'κριτικές 5★ στο Google' : '5★ reviews on Google'}
          </div>
        </div>
        <div className="hidden md:block w-px h-10 bg-electric-cyan/15" aria-hidden="true" />
        <Link
          href="/kataskevi-istoselidas#portfolio"
          className="btn-premium inline-flex items-center gap-2 px-6 py-2.5 border border-electric-cyan/40 text-electric-cyan text-sm font-bold rounded-xl hover:bg-electric-cyan hover:text-[#050a0e] transition-all"
        >
          {lang === 'el' ? 'Δείτε το πορτφόλιό μας →' : 'See our portfolio →'}
        </Link>
      </div>
    </div>
  );
}

/* ─── FAQ accordion ─── */
export function FaqSection({ service }) {
  const { lang } = useLangStore();
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        <ScrollReveal className="text-center mb-12">
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

/* ─── Final CTA band: email + contact form ─── */
export function CtaBand({ service }) {
  const { lang } = useLangStore();
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(71,200,245,0.06)_0%,transparent_70%)]" />
      </div>
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-black font-display mb-4 text-white tracking-tight">
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
              style={{ boxShadow: '0 0 30px rgba(71,200,245,0.4), 0 4px 20px rgba(0,0,0,0.4)' }}
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
