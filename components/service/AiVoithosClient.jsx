// components/service/AiVoithosClient.jsx
// «AI Βοηθός Ιστοσελίδας» — signature element: a chat replay whose bubbles
// reveal in sequence at 03:12 (the questions are the ones quoted in the
// pain copy), ending in a lead card. The page also points at the real,
// live widget bottom-right. Copy comes verbatim from lib/services.js.
'use client';

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

export default function AiVoithosClient() {
  const { lang } = useLangStore();
  const service = getService('ai-voithos');
  // Last includes line («Δοκιμάστε τον τώρα…») becomes the try-it moment.
  const gridItems = service.includes.slice(0, 3);
  const tryLine = service.includes[3];

  return (
    <>
      {/* ─── HERO — split: oversized H1 + art-directed pitch | chat replay ─── */}
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
                <p
                  className="font-display font-bold text-gray-100 leading-[1.35]"
                  style={{ fontSize: 'clamp(1.35rem, 2.4vw, 1.8rem)' }}
                >
                  {highlight(
                    service.pitch[lang],
                    lang === 'el'
                      ? ['κανένας δεν φεύγει χωρίς απάντηση']
                      : ['no one leaves without an answer']
                  )}
                </p>
              </ScrollReveal>
            </div>

            <ChatReplay lang={lang} />
          </div>
        </div>
      </section>

      <PainSection service={service} />
      <StepsSection service={service} />
      <IncludesSection service={service} items={gridItems} icons={['message', 'send', 'clock']} />

      {/* ─── «Δοκιμάστε τον τώρα» — the live widget IS the demo ─── */}
      <section className="pb-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <ScrollReveal direction="scale">
            <div className="relative text-center py-14">
              <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(71,200,245,0.07)_0%,transparent_70%)] pointer-events-none" />
              <p
                className="relative z-10 font-display font-black text-white leading-[1.25] max-w-2xl mx-auto"
                style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.6rem)' }}
              >
                {highlight(
                  tryLine[lang],
                  lang === 'el' ? ['κάτω δεξιά'] : ['bottom right']
                )}
              </p>
              {/* Hand-drawn arrow, curving toward the actual widget bubble */}
              <div className="relative z-10 mt-6 flex justify-end max-w-2xl mx-auto pr-4" aria-hidden="true">
                <svg viewBox="0 0 120 90" fill="none" className="w-24 h-[4.5rem] text-electric-cyan animate-float">
                  <path d="M8 6 C30 10 78 18 92 52 C96 62 98 70 99 78" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 7" />
                  <path d="M88 68 L99 82 L106 66" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ProofStrip />
      <FaqSection service={service} />
      <CtaBand />
    </>
  );
}

/* ─── Signature: chat replay at 03:12. The visitor questions are the ones
       quoted in the pain copy; answers render as cards, not invented prose. ─── */
function ChatReplay({ lang }) {
  const q1 = lang === 'el' ? 'Δέχεστε Σάββατο;' : 'Are you open Saturdays?';
  const q2 = lang === 'el' ? 'Πού ακριβώς είστε;' : 'Where exactly are you?';

  return (
    <ScrollReveal delay={120} direction="scale">
      <div className="relative max-w-[360px] mx-auto">
        <div aria-hidden="true" className="absolute inset-0 bg-electric-cyan/8 blur-[90px] rounded-full pointer-events-none" />

        <div className="relative z-10 glass-panel rounded-3xl overflow-hidden">
          {/* Header: assistant identity + online, all night long */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/6 bg-white/2">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-electric-cyan/12 border border-electric-cyan/35 flex items-center justify-center text-electric-cyan">
                {ICONS.bot('w-5 h-5')}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyber-lime border-2 border-[#0a1418]" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="h-2.5 w-24 rounded-full bg-white/20" />
              <div className="h-2 w-14 rounded-full bg-white/8" />
            </div>
            <span className="text-[0.58rem] font-black tracking-[0.15em] text-electric-cyan bg-electric-cyan/8 border border-electric-cyan/25 rounded-full px-2.5 py-1">
              24/7
            </span>
          </div>

          <div className="px-4 py-5 space-y-3">
            {/* Visitor asks — 03:12, no one else is answering */}
            <ScrollReveal delay={250} direction="right">
              <Bubble who="user" time="03:12">{q1}</Bubble>
            </ScrollReveal>

            {/* Instant answer: an opening-hours card */}
            <ScrollReveal delay={450} direction="left">
              <Bubble who="bot" time="03:12">
                <div className="flex items-center gap-2.5">
                  <span className="text-electric-cyan">{ICONS.clock('w-4 h-4')}</span>
                  <div className="space-y-1.5">
                    <div className="h-2 w-24 rounded-full bg-white/25" />
                    <div className="h-2 w-16 rounded-full bg-white/10" />
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-cyber-lime shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </Bubble>
            </ScrollReveal>

            <ScrollReveal delay={650} direction="right">
              <Bubble who="user" time="03:13">{q2}</Bubble>
            </ScrollReveal>

            {/* Instant answer: a location card */}
            <ScrollReveal delay={850} direction="left">
              <Bubble who="bot" time="03:13">
                <div className="flex items-center gap-2.5">
                  <span className="text-electric-cyan">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </span>
                  <div className="space-y-1.5">
                    <div className="h-2 w-28 rounded-full bg-white/25" />
                    <div className="h-2 w-20 rounded-full bg-white/10" />
                  </div>
                </div>
              </Bubble>
            </ScrollReveal>

            {/* The lead, forwarded to you: name + phone */}
            <ScrollReveal delay={1050} direction="up">
              <div className="mt-2 rounded-2xl border border-electric-cyan/30 bg-electric-cyan/5 p-3.5">
                <div className="flex items-center gap-2 mb-2.5 text-electric-cyan">
                  {ICONS.send('w-3.5 h-3.5')}
                  <div className="h-2 w-20 rounded-full bg-electric-cyan/30" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 rounded-lg bg-white/4 border border-white/8 px-3 py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-gray-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <div className="h-2 w-24 rounded-full bg-white/15" />
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg bg-white/4 border border-white/8 px-3 py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-gray-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <div className="h-2 w-20 rounded-full bg-white/15" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

function Bubble({ who, time, children }) {
  const isUser = who === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-electric-cyan/15 border border-electric-cyan/30 text-white rounded-br-md'
            : 'bg-white/4 border border-white/8 text-gray-200 rounded-bl-md'
        }`}
      >
        {children}
        <div className={`mt-1 text-[0.55rem] font-bold tracking-wider ${isUser ? 'text-electric-cyan/70 text-right' : 'text-gray-600'}`}>
          {time}
        </div>
      </div>
    </div>
  );
}
