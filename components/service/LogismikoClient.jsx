// components/service/LogismikoClient.jsx
// «Custom Μικρό Λογισμικό» — signature elements: the chaos→order
// transformation (notebook / Excel / Viber converging into one clean app
// window) and the half-the-time bars. Copy verbatim from lib/services.js.
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

export default function LogismikoClient() {
  const { lang } = useLangStore();
  const service = getService('custom-logismiko');
  // Last includes line (the half-the-time story) is art-directed as bars.
  const gridItems = service.includes.slice(0, 3);
  const halfTimeLine = service.includes[3];

  return (
    <>
      {/* ─── HERO — centered H1 + art-directed pitch ─── */}
      <section className="pt-16 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-[radial-gradient(ellipse,rgba(71,200,245,0.09)_0%,transparent_65%)] blur-[80px]" />
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
              className="font-black font-display mb-10 text-white tracking-tight leading-[1.06]"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 4.5rem)' }}
            >
              {service.h1[lang]}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={140}>
            <p
              className="font-display font-bold text-gray-100 leading-[1.4] max-w-3xl mx-auto"
              style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.75rem)' }}
            >
              {highlight(
                service.pitch[lang],
                lang === 'el'
                  ? ['το πραγματικό σύστημα', 'τον δικό σας τρόπο δουλειάς']
                  : ['the real system', 'the way you actually work']
              )}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={240}>
            <div className="mt-10 flex flex-col items-center gap-3">
              <a
                href="/crm-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium inline-flex items-center gap-3 px-9 py-4 bg-electric-cyan text-[#050a0e] font-black text-base rounded-xl hover:bg-white transition-all duration-300 hover:scale-105"
                style={{ boxShadow: '0 0 30px rgba(71,200,245,0.4), 0 4px 20px rgba(0,0,0,0.4)' }}
              >
                {lang === 'el' ? 'Δείτε το CRM που φτιάξαμε για εμάς' : 'See the CRM we built for ourselves'}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </a>
              <span className="text-xs font-semibold tracking-wide text-gray-500">
                {lang === 'el' ? 'Ζωντανό demo με δείγμα δεδομένων · χωρίς εγγραφή' : 'Live demo with sample data · no signup'}
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── CHAOS → ORDER — the scattered tools become one window ─── */}
      <section className="pb-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_auto_1.25fr] items-center gap-12 lg:gap-6">
            <ChaosCards lang={lang} />

            {/* Flow: chaos in, order out */}
            <ScrollReveal delay={260} direction="fade" className="hidden lg:block">
              <svg viewBox="0 0 110 60" fill="none" className="w-24 h-14" aria-hidden="true">
                <defs>
                  <linearGradient id="flowgrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="rgba(71,200,245,0.08)" />
                    <stop offset="1" stopColor="rgba(71,200,245,0.9)" />
                  </linearGradient>
                </defs>
                <path d="M4 30 H88" stroke="url(#flowgrad)" strokeWidth="2" strokeLinecap="round" />
                <path d="M78 18 L96 30 L78 42" stroke="rgba(71,200,245,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </ScrollReveal>
            <div aria-hidden="true" className="lg:hidden mx-auto w-px h-10 bg-gradient-to-b from-electric-cyan/10 via-electric-cyan/60 to-electric-cyan/10" />

            <AppWindow />
          </div>
        </div>
      </section>

      <PainSection service={service} />
      <StepsSection service={service} />
      <IncludesSection service={service} items={gridItems} icons={['layout', 'monitor', 'database']} />

      {/* ─── HALF THE TIME — the includes line as two bars ─── */}
      <section className="pb-24 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <div className="space-y-5 mb-10">
              <div className="flex items-center gap-4">
                <span className="w-14 text-[0.6rem] font-black tracking-[0.2em] uppercase text-gray-600 text-right shrink-0">
                  {lang === 'el' ? 'Πριν' : 'Before'}
                </span>
                <div className="h-4 rounded-full bg-white/8 border border-white/6 w-full" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-14 text-[0.6rem] font-black tracking-[0.2em] uppercase text-electric-cyan text-right shrink-0">
                  {lang === 'el' ? 'Μετά' : 'After'}
                </span>
                <div className="w-full">
                  <div className="badge-scan h-4 rounded-full w-1/2 bg-gradient-to-r from-electric-cyan to-electric-cyan/60 shadow-[0_0_20px_rgba(71,200,245,0.35)]" />
                </div>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={140}>
            <p
              className="font-display font-bold text-gray-100 leading-[1.4] text-center"
              style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.55rem)' }}
            >
              {highlight(
                halfTimeLine[lang],
                lang === 'el' ? ['στον μισό χρόνο'] : ['half the time']
              )}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <ProofStrip />
      <FaqSection service={service} />
      <CtaBand />
    </>
  );
}

/* ─── The «before»: notebook, Excel, Viber — tilted, overlapping, scattered ─── */
function ChaosCards({ lang }) {
  return (
    <div className="relative h-64 max-w-[320px] mx-auto w-full">
      {/* Notebook */}
      <ScrollReveal delay={60} direction="left" className="absolute top-0 left-2 w-44">
        <div className="-rotate-6 rounded-xl bg-[#10202a] border border-white/10 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
          <span className="text-[0.58rem] font-black tracking-[0.2em] uppercase text-gray-500">
            {lang === 'el' ? 'Τετράδιο' : 'Notebook'}
          </span>
          <div className="mt-3 space-y-2.5">
            {['w-28', 'w-20', 'w-24'].map((w, i) => (
              <div key={i} className={`h-1.5 ${w} rounded-full bg-white/12 border-b border-white/5`} />
            ))}
          </div>
        </div>
      </ScrollReveal>
      {/* Excel */}
      <ScrollReveal delay={180} direction="left" className="absolute top-16 right-0 w-44">
        <div className="rotate-3 rounded-xl bg-[#0d2318] border border-white/10 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
          <span className="text-[0.58rem] font-black tracking-[0.2em] uppercase text-green-500/80">Excel</span>
          <div className="mt-3 grid grid-cols-4 gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-3 rounded-[3px] bg-white/8 border border-white/5" />
            ))}
          </div>
        </div>
      </ScrollReveal>
      {/* Viber */}
      <ScrollReveal delay={300} direction="left" className="absolute bottom-0 left-10 w-40">
        <div className="-rotate-2 rounded-xl bg-[#1d1430] border border-white/10 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
          <span className="text-[0.58rem] font-black tracking-[0.2em] uppercase text-void-purple brightness-150">Viber</span>
          <div className="mt-3 space-y-2">
            <div className="h-5 w-24 rounded-xl rounded-bl-sm bg-white/10" />
            <div className="h-5 w-20 rounded-xl rounded-br-sm bg-electric-cyan/15 ml-auto" />
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

/* ─── The «after»: one clean window — every tab where you'd look for it ─── */
function AppWindow() {
  return (
    <ScrollReveal delay={340} direction="right">
      <div className="relative max-w-[520px] mx-auto">
        <div aria-hidden="true" className="absolute inset-0 bg-electric-cyan/8 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative z-10 rounded-2xl border border-electric-cyan/25 bg-[#0a1418] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_50px_rgba(71,200,245,0.12)]">
          {/* Chrome */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/6 bg-white/2">
            <span className="w-2.5 h-2.5 rounded-full bg-white/12" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/12" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/12" />
            <div className="ml-3 h-4 w-40 rounded-md bg-white/5" />
          </div>
          <div className="flex">
            {/* Sidebar: the five tabs you actually need */}
            <div className="w-32 shrink-0 border-r border-white/6 p-3 space-y-1.5 bg-white/1">
              {[
                { icon: 'users', active: true },
                { icon: 'calendar', active: false },
                { icon: 'database', active: false },
                { icon: 'chart', active: false },
              ].map(({ icon, active }, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-2 ${
                    active ? 'bg-electric-cyan/12 border border-electric-cyan/30 text-electric-cyan' : 'text-gray-600'
                  }`}
                >
                  {ICONS[icon]('w-3.5 h-3.5')}
                  <div className={`h-1.5 rounded-full ${active ? 'bg-electric-cyan/40 w-12' : 'bg-white/10 w-10'}`} />
                </div>
              ))}
            </div>
            {/* Main: stats + rows, everything in its place */}
            <div className="flex-1 p-4">
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {[0, 1].map((i) => (
                  <div key={i} className="rounded-xl border border-white/6 bg-white/2 p-3">
                    <div className="h-1.5 w-12 rounded-full bg-white/10 mb-2" />
                    <div className={`h-3 w-16 rounded-md ${i === 0 ? 'bg-electric-cyan/50' : 'bg-white/15'}`} />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {['bg-cyber-lime', 'bg-electric-cyan', 'bg-white/25', 'bg-electric-cyan'].map((dot, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/2 px-3 py-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                    <div className="h-1.5 w-24 rounded-full bg-white/12" />
                    <div className="h-1.5 w-12 rounded-full bg-white/6 ml-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
