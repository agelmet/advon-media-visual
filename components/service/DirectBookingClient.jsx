// components/service/DirectBookingClient.jsx
// «Direct Booking για Τουρισμό» — signature elements: the commission pitch
// as a giant 0% moment, and a channel-sync diagram (Booking / Airbnb /
// Expedia converging into one calendar). Copy verbatim from lib/services.js.
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

export default function DirectBookingClient() {
  const { lang } = useLangStore();
  const service = getService('direct-booking');

  return (
    <>
      {/* ─── HERO — centered H1 + sub ─── */}
      <section className="pt-16 pb-10 relative overflow-hidden">
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
              className="font-black font-display mb-5 text-white tracking-tight leading-[1.06]"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 4.5rem)' }}
            >
              {service.h1[lang]}
            </h1>
            <p className="text-gray-400 text-lg">{service.sub[lang]}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── 0% — the pitch as the page's art moment ─── */}
      <section className="pb-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal delay={100}>
            <span className="text-electric-cyan text-xs font-bold tracking-widest uppercase mb-4 block">
              {lang === 'el' ? 'Προμήθεια στις απευθείας κρατήσεις' : 'Commission on direct bookings'}
            </span>
            <div
              className="free-pulse font-black font-display text-white leading-none mb-8"
              style={{ fontSize: 'clamp(6rem, 16vw, 11rem)' }}
            >
              0%
            </div>
          </ScrollReveal>
          <ScrollReveal delay={180}>
            <p
              className="font-display font-bold text-gray-100 leading-[1.35] max-w-2xl mx-auto"
              style={{ fontSize: 'clamp(1.35rem, 2.6vw, 1.9rem)' }}
            >
              {highlight(
                service.pitch[lang],
                lang === 'el' ? ['μία και μόνο κράτηση'] : ['a single booking']
              )}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <PainSection service={service} />

      {/* ─── SYNC DIAGRAM — every channel, one calendar ─── */}
      <section className="py-24 bg-[#0a1418]/60 border-y border-electric-cyan/8 backdrop-blur-sm relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <SyncDiagram lang={lang} />
        </div>
      </section>

      <StepsSection service={service} />
      <IncludesSection service={service} icons={['globe', 'refresh', 'chart', 'sparkles']} />
      <ProofStrip />
      <FaqSection service={service} />
      <CtaBand />
    </>
  );
}

/* ─── Signature: platforms + your own site converge into one calendar ─── */
function SyncDiagram({ lang }) {
  const channels = ['Booking.com', 'Airbnb', 'Expedia'];
  return (
    <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-10 md:gap-4">
      {/* Sources: the platforms + your own booking page */}
      <div className="flex flex-row md:flex-col flex-wrap justify-center md:items-end gap-3 md:gap-4">
        {channels.map((name, i) => (
          <ScrollReveal key={name} delay={i * 110} direction="left">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/3 px-5 py-3.5 md:w-56">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-gray-400">
                {ICONS.globe('w-4 h-4')}
              </div>
              <span className="text-sm font-bold text-gray-300">{name}</span>
            </div>
          </ScrollReveal>
        ))}
        <ScrollReveal delay={330} direction="left">
          <div className="flex items-center gap-3 rounded-2xl border border-electric-cyan/40 bg-electric-cyan/6 px-5 py-3.5 md:w-56 shadow-[0_0_24px_rgba(71,200,245,0.12)]">
            <div className="w-8 h-8 rounded-lg bg-electric-cyan/12 border border-electric-cyan/30 flex items-center justify-center text-electric-cyan">
              {ICONS.building('w-4 h-4')}
            </div>
            <span className="text-sm font-black text-white">{lang === 'el' ? 'Η σελίδα σας' : 'Your website'}</span>
          </div>
        </ScrollReveal>
      </div>

      {/* Converging flow lines (desktop) / vertical connector (mobile) */}
      <ScrollReveal delay={200} direction="fade" className="hidden md:block">
        <svg viewBox="0 0 160 240" fill="none" className="w-32 h-56" aria-hidden="true">
          <defs>
            <linearGradient id="syncflow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="rgba(71,200,245,0.05)" />
              <stop offset="1" stopColor="rgba(71,200,245,0.75)" />
            </linearGradient>
          </defs>
          <path d="M4 32 C70 32 100 120 156 120" stroke="url(#syncflow)" strokeWidth="1.5" />
          <path d="M4 90 C70 90 100 120 156 120" stroke="url(#syncflow)" strokeWidth="1.5" />
          <path d="M4 150 C70 150 100 120 156 120" stroke="url(#syncflow)" strokeWidth="1.5" />
          <path d="M4 208 C70 208 100 122 156 120" stroke="rgba(71,200,245,0.9)" strokeWidth="2" />
        </svg>
      </ScrollReveal>
      <div aria-hidden="true" className="md:hidden mx-auto w-px h-10 bg-gradient-to-b from-electric-cyan/10 via-electric-cyan/60 to-electric-cyan/10" />

      {/* One calendar — no double bookings */}
      <ScrollReveal delay={320} direction="right">
        <div className="relative mx-auto md:mx-0 w-fit">
          <div aria-hidden="true" className="absolute inset-0 bg-electric-cyan/10 blur-[60px] rounded-full pointer-events-none" />
          <div className="relative z-10 rounded-3xl border-2 border-electric-cyan/45 bg-[#0a1418] p-7 shadow-[0_0_40px_rgba(71,200,245,0.18)]">
            <div className="text-electric-cyan icon-glow mb-4">{ICONS.calendar('w-10 h-10')}</div>
            {/* Mini month: every channel writes to the same squares */}
            <div className="grid grid-cols-7 gap-1.5" aria-hidden="true">
              {Array.from({ length: 21 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-[3px] ${
                    [2, 5, 8, 9, 13, 16, 19].includes(i)
                      ? 'bg-electric-cyan/80 shadow-[0_0_6px_rgba(71,200,245,0.6)]'
                      : 'bg-white/8'
                  }`}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[0.6rem] font-black tracking-[0.15em] uppercase text-cyber-lime">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>
              SYNC
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
