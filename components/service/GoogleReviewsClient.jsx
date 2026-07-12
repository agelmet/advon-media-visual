// components/service/GoogleReviewsClient.jsx
// «Παρουσία στο Google» — merged canonical page for the NFC review stand
// + Google Business Profile setup. Custom hero (product image), then the
// standard service page blocks.
'use client';

import { useLangStore } from '@/store/langStore';
import ScrollReveal from '@/components/ScrollReveal';
import PitchQuote from '@/components/PitchQuote';
import { getService } from '@/lib/services';
import {
  PainSection,
  StepsSection,
  IncludesSection,
  ProofStrip,
  FaqSection,
  CtaBand,
} from '@/components/service/blocks';

export default function GoogleReviewsClient() {
  const { lang } = useLangStore();
  const service = getService('google-reviews-nfc');

  return (
    <>
      {/* ─── HERO: text + product image ─── */}
      <section className="pt-16 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse,rgba(71,200,245,0.08)_0%,transparent_65%)] blur-[80px]" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <ScrollReveal>
                <span className="section-label">{lang === 'el' ? 'Υπηρεσία' : 'Service'}</span>
                <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-black font-display mb-6 text-white tracking-tight leading-[1.08]">
                  {service.h1[lang]}
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={120} direction="scale">
                <PitchQuote>{service.pitch[lang]}</PitchQuote>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="flex flex-wrap gap-3 mt-8">
                  {[
                    lang === 'el' ? '✓ Χωρίς εφαρμογή' : '✓ No app needed',
                    '✓ iOS & Android',
                    lang === 'el' ? '✓ Στήσιμο από εμάς' : '✓ Set up by us',
                  ].map((badge) => (
                    <span key={badge} className="text-xs font-semibold text-gray-400 bg-white/4 border border-white/8 px-3 py-1.5 rounded-full">
                      {badge}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={100} direction="up">
              <div className="relative flex items-center justify-center animate-float">
                <div className="absolute inset-0 bg-electric-cyan/8 blur-[100px] rounded-full" aria-hidden="true" />
                <img
                  src="https://assets.cdn.filesafe.space/61icdoMiJ2pHklO6mmKW/media/6724bf7a4eb48eb705a7b389.gif"
                  alt={lang === 'el' ? 'Βάση NFC για κριτικές Google' : 'NFC Google reviews stand'}
                  className="relative z-10 w-full max-w-md mx-auto rounded-3xl border border-electric-cyan/30 shadow-[0_20px_80px_rgba(71,200,245,0.25)] hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <PainSection service={service} />
      <StepsSection service={service} />
      <IncludesSection service={service} />
      <ProofStrip />
      <FaqSection service={service} />
      <CtaBand service={service} />
    </>
  );
}
