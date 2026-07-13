// components/service/MenouQrClient.jsx
// «Ψηφιακό Μενού QR» — signature element: before/after — a paper menu with
// pen-corrected prices next to a phone-framed digital menu, plus a QR tile.
// Copy comes verbatim from lib/services.js.
'use client';

import { useLangStore } from '@/store/langStore';
import { getService } from '@/lib/services';
import ScrollReveal from '@/components/ScrollReveal';
import {
  ICONS,
  PainSection,
  StepsSection,
  IncludesSection,
  ProofStrip,
  FaqSection,
  CtaBand,
} from '@/components/service/blocks';

export default function MenouQrClient() {
  const { lang } = useLangStore();
  const service = getService('psifiako-menou-qr');
  // The pitch is two sentences — staged as a two-beat typographic moment.
  const [beat1, beat2] =
    lang === 'el'
      ? ['Πόσο κόστισε η τελευταία επανεκτύπωση καταλόγων;', 'Αυτή ήταν και η τελευταία.']
      : ['How much did the last menu reprint cost?', 'That was also the last one.'];

  return (
    <>
      {/* ─── HERO — centered H1 ─── */}
      <section className="pt-16 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-[radial-gradient(ellipse,rgba(71,200,245,0.09)_0%,transparent_65%)] blur-[80px]" />
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
          </ScrollReveal>
        </div>
      </section>

      {/* ─── PITCH — two beats: the question, then the promise ─── */}
      <section className="pb-16 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal delay={80}>
            <p
              className="font-display font-bold text-gray-300 leading-snug mb-4"
              style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.1rem)' }}
            >
              {beat1}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={220}>
            <p
              className="font-display font-black text-electric-cyan leading-snug"
              style={{ fontSize: 'clamp(1.9rem, 4.2vw, 3.2rem)', filter: 'drop-shadow(0 0 24px rgba(71,200,245,0.3))' }}
            >
              {beat2}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── BEFORE / AFTER — pen-corrected paper vs the living menu ─── */}
      <section className="pb-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-14 md:gap-10 items-center">
            <ScrollReveal delay={80} direction="left">
              <PaperMenu lang={lang} />
            </ScrollReveal>
            <ScrollReveal delay={200} direction="right">
              <PhoneMenu />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <PainSection service={service} />
      <StepsSection service={service} />
      <IncludesSection service={service} icons={['qr', 'pen', 'printer']} />
      <ProofStrip />
      <FaqSection service={service} />
      <CtaBand />
    </>
  );
}

/* Shared strike-through for the pen corrections */
function PenStrike() {
  return (
    <svg aria-hidden="true" viewBox="0 0 60 20" fill="none" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
      <path d="M3 14 C18 11 40 7 57 5" stroke="#dc2626" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Before: the printed menu, corrected by hand ─── */
function PaperMenu({ lang }) {
  const rows = [
    { w: 'w-28', old: '8.50', neu: '9.50', tilt: '-rotate-6' },
    { w: 'w-36', old: '12.00', neu: null },
    { w: 'w-24', old: '6.50', neu: '7', tilt: 'rotate-3' },
    { w: 'w-32', old: '14.50', neu: null },
    { w: 'w-28', old: '11.00', neu: '12.50', tilt: '-rotate-3' },
  ];
  return (
    <div className="relative max-w-[380px] mx-auto">
      <div className="relative -rotate-2 rounded-lg bg-[#f2ecdd] p-7 pb-9 shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
        {/* Label */}
        <span className="absolute -top-3.5 left-6 text-[0.58rem] font-black tracking-[0.25em] uppercase text-gray-400 bg-[#0d1a21] border border-white/10 rounded-full px-3 py-1.5 rotate-1">
          {lang === 'el' ? 'Έντυπος κατάλογος' : 'Printed menu'}
        </span>
        {/* Heading rule */}
        <div className="flex justify-center mb-6">
          <div className="h-3 w-32 rounded-sm bg-[#2a2118]/80" />
        </div>
        <div className="space-y-4">
          {rows.map(({ w, old, neu, tilt }, i) => (
            <div key={i} className="flex items-end gap-3">
              <div className={`h-2.5 ${w} rounded-sm bg-[#2a2118]/55`} />
              <div className="flex-1 border-b border-dotted border-[#2a2118]/30 mb-0.5" />
              <div className="relative flex items-center gap-1.5">
                <span className="relative font-bold text-sm text-[#2a2118]/85 tabular-nums">
                  {old}
                  {neu && <PenStrike />}
                </span>
                {neu && (
                  <span
                    className={`font-bold text-[0.95rem] text-red-600 tabular-nums ${tilt}`}
                    style={{ fontFamily: 'cursive' }}
                  >
                    {neu}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* A new dish, penciled in the margin */}
        <div className="mt-5 flex items-end gap-3 -rotate-1">
          <div className="h-2.5 w-24 rounded-sm border border-dashed border-red-600/50" />
          <span className="text-red-600 text-sm font-bold" style={{ fontFamily: 'cursive' }}>+</span>
        </div>
      </div>
    </div>
  );
}

/* ─── After: the digital menu on the customer's phone ─── */
function PhoneMenu() {
  const dishes = [
    { w: 'w-24', price: '9.50', dots: ['bg-amber-400', 'bg-rose-400'] },
    { w: 'w-32', price: '12.00', dots: ['bg-amber-400'] },
    { w: 'w-20', price: '7.00', dots: ['bg-rose-400', 'bg-electric-cyan'] },
    { w: 'w-28', price: '12.50', dots: ['bg-amber-400'] },
  ];
  return (
    <div className="relative max-w-[300px] mx-auto">
      <div aria-hidden="true" className="absolute inset-0 bg-electric-cyan/8 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 rounded-[2.75rem] border border-white/12 bg-[#0a1418] p-2.5 shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_50px_rgba(71,200,245,0.12)]">
        <div className="rounded-[2.25rem] bg-[#050a0e] overflow-hidden">
          <div className="flex justify-center pt-2.5 pb-1">
            <div className="w-20 h-1.5 rounded-full bg-white/10" />
          </div>
          <div className="px-4 pt-3 pb-6">
            {/* Header: identity + language toggle */}
            <div className="flex items-center justify-between mb-4">
              <div className="h-2.5 w-24 rounded-full bg-white/20" />
              <div className="flex rounded-full border border-white/10 overflow-hidden text-[0.55rem] font-black">
                <span className="px-2 py-1 bg-electric-cyan text-[#050a0e]">ΕΛ</span>
                <span className="px-2 py-1 text-gray-500">EN</span>
              </div>
            </div>
            {/* Category chips */}
            <div className="flex gap-1.5 mb-4">
              <div className="h-6 w-16 rounded-full bg-electric-cyan/15 border border-electric-cyan/40" />
              <div className="h-6 w-14 rounded-full bg-white/4 border border-white/8" />
              <div className="h-6 w-12 rounded-full bg-white/4 border border-white/8" />
            </div>
            {/* Dishes: photo, name, allergens, a price that is always current */}
            <div className="space-y-2.5">
              {dishes.map(({ w, price, dots }, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/2 p-2.5">
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-electric-cyan/25 to-void-purple/30 border border-white/8 flex items-center justify-center text-white/25 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className={`h-2 ${w} rounded-full bg-white/18`} />
                    <div className="flex gap-1">
                      {dots.map((d, j) => (
                        <span key={j} className={`w-1.5 h-1.5 rounded-full opacity-80 ${d}`} />
                      ))}
                    </div>
                  </div>
                  <span className="text-[0.7rem] font-black text-electric-cyan tabular-nums">{price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* The QR that never changes — floats by the phone */}
      <div className="absolute -top-5 -right-4 md:-right-8 z-20 animate-float">
        <div className="badge-scan rounded-2xl bg-white p-3 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_24px_rgba(71,200,245,0.25)]">
          <span className="text-[#050a0e]">{ICONS.qr('w-9 h-9')}</span>
        </div>
      </div>
    </div>
  );
}
