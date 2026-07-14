// components/service/RantevouClient.jsx
// «Online Ραντεβού» — signature element: a phone-framed booking page where
// a late-night slot books itself, plus a 24h timeline of when requests
// actually arrive. Copy comes verbatim from lib/services.js.
'use client';

import { useState } from 'react';
import { useLangStore } from '@/store/langStore';
import { getService } from '@/lib/services';
import ScrollReveal from '@/components/ScrollReveal';
import {
  ICONS,
  highlight,
  PainSection,
  StepsSection,
  IncludesSection,
  ProofStrip,
  FaqSection,
  CtaBand,
} from '@/components/service/blocks';

export default function RantevouClient() {
  const { lang } = useLangStore();
  const service = getService('online-rantevou');
  // Last includes line is the pricing — rendered below as the same
  // toggle-card comparison used for hosting on the kataskevi page.
  const gridItems = service.includes.slice(0, 4);

  return (
    <>
      {/* ─── HERO — split: oversized H1 + art-directed pitch | booking phone ─── */}
      <section className="pt-16 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-[radial-gradient(ellipse,rgba(71,200,245,0.09)_0%,transparent_65%)] blur-[80px]" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-14 lg:gap-10 items-center">
            <div>
              <ScrollReveal>
                <span className="section-label">{lang === 'el' ? 'Υπηρεσία' : 'Service'}</span>
                <h1
                  className="font-black font-display mb-10 text-white tracking-tight leading-[1.06]"
                  style={{ fontSize: 'clamp(2.6rem, 6vw, 4.3rem)' }}
                >
                  {service.h1[lang]}
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={130}>
                {/* The pitch as a typographic moment — no box, no border */}
                <p
                  className="font-display font-bold text-gray-100 leading-[1.35]"
                  style={{ fontSize: 'clamp(1.35rem, 2.4vw, 1.8rem)' }}
                >
                  {highlight(
                    service.pitch[lang],
                    lang === 'el'
                      ? ['το βράδυ, την Κυριακή', 'τα κλείνει η σελίδα σας']
                      : ['at night, on Sundays', 'your page books for you']
                  )}
                </p>
              </ScrollReveal>

              {/* Reminders — the #1 pain, stated up front */}
              <ScrollReveal delay={220}>
                <div className="mt-8 inline-flex items-start gap-3 rounded-2xl border border-electric-cyan/30 bg-electric-cyan/6 px-5 py-4">
                  <span className="text-electric-cyan icon-glow shrink-0 mt-0.5">{ICONS.bell('w-5 h-5')}</span>
                  <p className="text-gray-200 text-sm md:text-base leading-relaxed font-semibold">
                    {lang === 'el' ? (
                      <>Αυτόματη υπενθύμιση με email πριν από κάθε ραντεβού — <span className="text-electric-cyan">λιγότερες ακυρώσεις, λιγότερα κενά στο πρόγραμμα</span>.</>
                    ) : (
                      <>Automatic email reminder before every appointment — <span className="text-electric-cyan">fewer cancellations, fewer gaps in your schedule</span>.</>
                    )}
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Booking page, phone-framed. A slot has just booked itself. */}
            <ScrollReveal delay={120} direction="scale">
              <BookingPhone lang={lang} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── 24h TIMELINE — when requests actually arrive (leads into the pain copy) ─── */}
      <section className="pb-4 relative" aria-hidden="true">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal direction="fade">
            <NightTimeline lang={lang} />
          </ScrollReveal>
        </div>
      </section>

      <PainSection service={service} />
      <StepsSection service={service} />
      <IncludesSection service={service} items={gridItems} icons={['bell', 'smartphone', 'refresh', 'users']} />

      {/* ─── PRICING — same toggle-card design as the hosting pricing ─── */}
      <BookingPricing lang={lang} />

      <ProofStrip />
      <FaqSection service={service} />
      <CtaBand />
    </>
  );
}

/* ─── Pricing — the exact toggle-card design of the hosting pricing on
       the kataskevi page (same structure, emphasis and rhythm). ─── */
function BookingPricing({ lang }) {
  const [solo, setSolo] = useState(true);

  const rowIcons = {
    calendar: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-electric-cyan shrink-0"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
    check: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>,
  };

  return (
    <section className="pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal delay={60} direction="scale" className="mt-4">
          <div className="text-center mb-10">
            <span className="section-label">{lang === 'el' ? 'Τιμές' : 'Pricing'}</span>
            <h2 className="text-3xl md:text-4xl font-black font-display mb-3 text-white tracking-tight">
              {lang === 'el' ? 'Τιμολόγηση Online Ραντεβού' : 'Online Booking Pricing'}
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              {lang === 'el' ? 'Επιλέξτε το σχήμα που ταιριάζει στη δουλειά σας.' : 'Choose the plan that fits how you work.'}
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-2 mt-6 p-1.5 rounded-full bg-white/5 border border-white/12">
              <button
                onClick={() => setSolo(true)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${solo ? 'bg-electric-cyan text-[#050a0e] shadow-[0_0_16px_rgba(71,200,245,0.35)]' : 'text-gray-400 hover:text-white'}`}
              >
                {lang === 'el' ? 'Ένας επαγγελματίας' : 'One professional'}
              </button>
              <button
                onClick={() => setSolo(false)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${!solo ? 'bg-electric-cyan text-[#050a0e] shadow-[0_0_16px_rgba(71,200,245,0.35)]' : 'text-gray-400 hover:text-white'}`}
              >
                {lang === 'el' ? 'Ομάδα' : 'Team'}
              </button>
            </div>
          </div>

          {/* Single card — swaps on toggle */}
          <div className="max-w-md mx-auto">
            {solo ? (
              /* One professional */
              <div key="solo" className="pricing-swap-in pricing-featured glass-panel rounded-2xl p-8 border-2 border-electric-cyan/60 relative shadow-[0_0_50px_rgba(71,200,245,0.18)]">
                <div className="text-electric-cyan text-xs font-black uppercase tracking-widest mb-4 mt-1">
                  {lang === 'el' ? 'Ένας Επαγγελματίας' : 'One Professional'}
                </div>
                <div className="flex items-end gap-2 mb-0.5">
                  <span className="text-5xl font-black text-white">5€</span>
                  <span className="text-gray-500 mb-1.5 text-sm">{lang === 'el' ? '/μήνα' : '/month'}</span>
                </div>
                <p className="text-gray-400 text-sm mb-5 mt-1">
                  {lang === 'el' ? 'Όλο το σύστημα, για εσάς' : 'The whole system, for you'}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-electric-cyan/8 border border-electric-cyan/25 rounded-xl px-4 py-3">
                    {rowIcons.calendar}
                    <span className="text-electric-cyan font-bold text-sm">
                      {lang === 'el' ? 'Δική σας σελίδα κρατήσεων — οι υπηρεσίες σας σε λίστα' : 'Your own booking page — your services in a list'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3">
                    {rowIcons.check}
                    <span className="text-gray-300 text-sm font-semibold">
                      {lang === 'el' ? 'Ημερολόγιο συγχρονισμένο με το δικό σας' : 'Calendar synced with your own'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3">
                    {rowIcons.check}
                    <span className="text-gray-400 text-sm">
                      {lang === 'el' ? 'Αυτόματες υπενθυμίσεις στους πελάτες σας' : 'Automatic reminders to your clients'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Team */
              <div key="team" className="pricing-swap-in glass-panel rounded-2xl p-8 border-2 border-electric-cyan/60 relative shadow-[0_0_50px_rgba(71,200,245,0.18)]">
                <div className="text-gray-300 text-xs font-black uppercase tracking-widest mb-4">
                  {lang === 'el' ? 'Ομάδα' : 'Team'}
                </div>
                <div className="flex items-end gap-2 mb-0.5">
                  <span className="text-5xl font-black text-white">15–25€</span>
                  <span className="text-gray-500 mb-1.5 text-sm">{lang === 'el' ? '/μήνα' : '/month'}</span>
                </div>
                <p className="text-gray-400 text-sm mb-5 mt-1">
                  {lang === 'el' ? 'Ανάλογα με τα άτομα της ομάδας' : 'Depending on team size'}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-electric-cyan/8 border border-electric-cyan/25 rounded-xl px-4 py-3">
                    {rowIcons.calendar}
                    <span className="text-electric-cyan font-bold text-sm">
                      {lang === 'el' ? 'Κάθε πελάτης κλείνει στον δικό του επαγγελματία' : 'Every client books with their own professional'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3">
                    {rowIcons.check}
                    <span className="text-gray-300 text-sm font-semibold">
                      {lang === 'el' ? 'Ο καθένας βλέπει το δικό του πρόγραμμα' : 'Each of you sees your own schedule'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3">
                    {rowIcons.check}
                    <span className="text-gray-400 text-sm">
                      {lang === 'el' ? 'Για κομμωτήρια, barbershops, ιατρεία' : 'For hair salons, barbershops, clinics'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-gray-600 text-xs mt-5">
            {lang === 'el' ? 'Χωρίς κρυφές χρεώσεις · Χωρίς κόστος εγκατάστασης' : 'No hidden fees · No setup cost'}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── Signature: phone-framed booking page. Skeleton bars stand in for a
       client's service names; the times are real. One slot just booked. ─── */
function BookingPhone({ lang }) {
  const days = lang === 'el' ? ['Δ', 'Τ', 'Τ', 'Π', 'Π', 'Σ', 'Κ'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const slots = ['09:00', '09:45', '10:30', '11:15', '12:00', '17:30', '18:15', '19:00'];
  const booked = '18:15';

  return (
    <div className="relative max-w-[320px] mx-auto">
      <div aria-hidden="true" className="absolute inset-0 bg-electric-cyan/8 blur-[90px] rounded-full pointer-events-none" />

      {/* Frame */}
      <div className="relative z-10 rounded-[2.75rem] border border-white/12 bg-[#0a1418] p-2.5 shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_50px_rgba(71,200,245,0.12)]">
        <div className="rounded-[2.25rem] bg-[#050a0e] overflow-hidden">
          {/* Notch */}
          <div className="flex justify-center pt-2.5 pb-1">
            <div className="w-20 h-1.5 rounded-full bg-white/10" />
          </div>

          <div className="px-5 pt-3 pb-6">
            {/* Business header — skeleton identity */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-electric-cyan/50 to-void-purple/50 border border-white/15" />
              <div className="space-y-1.5">
                <div className="h-2.5 w-28 rounded-full bg-white/20" />
                <div className="h-2 w-16 rounded-full bg-white/8" />
              </div>
            </div>

            {/* Day strip */}
            <div className="flex justify-between mb-5">
              {days.map((d, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[0.6rem] font-black ${
                    i === 5
                      ? 'bg-electric-cyan text-[#050a0e] shadow-[0_0_14px_rgba(71,200,245,0.5)]'
                      : 'bg-white/4 text-gray-500 border border-white/6'
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Services — skeleton names + real durations */}
            <div className="space-y-2.5 mb-5">
              {[
                { w: 'w-24', dur: '30′', active: true },
                { w: 'w-32', dur: '45′', active: false },
              ].map(({ w, dur, active }, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-3 border ${
                    active ? 'border-electric-cyan/40 bg-electric-cyan/6' : 'border-white/6 bg-white/2'
                  }`}
                >
                  <div className={`h-2.5 ${w} rounded-full ${active ? 'bg-white/30' : 'bg-white/12'}`} />
                  <span className={`text-[0.6rem] font-black px-2 py-0.5 rounded-full ${active ? 'bg-electric-cyan/15 text-electric-cyan' : 'bg-white/5 text-gray-500'}`}>
                    {dur}
                  </span>
                </div>
              ))}
            </div>

            {/* Time slots — one just booked itself */}
            <div className="grid grid-cols-4 gap-2">
              {slots.map((t) => (
                <div
                  key={t}
                  className={`rounded-lg py-2 text-center text-[0.6rem] font-bold flex items-center justify-center gap-1 ${
                    t === booked
                      ? 'bg-electric-cyan text-[#050a0e] shadow-[0_0_16px_rgba(71,200,245,0.5)]'
                      : 'bg-white/4 text-gray-400 border border-white/6'
                  }`}
                >
                  {t === booked && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating confirmation — booked on a Sunday night, while you slept */}
      <div className="absolute -top-4 -right-3 md:-right-8 z-20 animate-float">
        <div className="flex items-center gap-2.5 rounded-2xl border border-electric-cyan/35 bg-[#0a1418]/95 backdrop-blur-md px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_24px_rgba(71,200,245,0.2)]">
          <div className="w-8 h-8 rounded-full bg-electric-cyan/12 border border-electric-cyan/30 flex items-center justify-center text-electric-cyan">
            {ICONS.calendar('w-4 h-4')}
          </div>
          <div>
            <div className="text-[0.68rem] font-black text-white leading-tight">{lang === 'el' ? 'Κυριακή' : 'Sunday'} · 22:47</div>
            <div className="flex items-center gap-1 text-[0.6rem] font-bold text-electric-cyan">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5"><polyline points="20 6 9 17 4 12"/></svg>
              OK
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Signature: 24-hour strip — requests land outside working hours ─── */
function NightTimeline({ lang }) {
  const marks = [
    { pos: '11%', time: '02:31' },
    { pos: '38%', time: lang === 'el' ? 'Κυρ 09:15' : 'Sun 09:15', hot: true },
    { pos: '66%', time: '15:48' },
    { pos: '91%', time: '22:47', hot: true },
  ];
  return (
    <div className="relative pt-10 pb-12">
      {/* Ruler */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-electric-cyan/40 to-transparent">
        {/* Working-hours window, faintly brighter */}
        <div className="absolute left-[35%] right-[35%] -top-[1.5px] h-[3px] rounded-full bg-electric-cyan/25" />
        {marks.map(({ pos, time, hot }) => (
          <div key={time} className="absolute -translate-x-1/2" style={{ left: pos }}>
            <div className={`w-2.5 h-2.5 rounded-full -translate-y-[5px] ${hot ? 'bg-electric-cyan shadow-[0_0_12px_rgba(71,200,245,0.8)] animate-pulse-slow' : 'bg-white/25'}`} />
            <div className={`mt-2.5 text-[0.6rem] font-black tracking-wider whitespace-nowrap ${hot ? 'text-electric-cyan' : 'text-gray-600'}`}>
              {time}
            </div>
          </div>
        ))}
      </div>
      {/* Hour ticks */}
      <div className="flex justify-between mt-9 text-[0.55rem] font-bold tracking-[0.2em] text-gray-700">
        {['00:00', '06:00', '12:00', '18:00', '24:00'].map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
    </div>
  );
}
