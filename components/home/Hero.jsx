// components/home/Hero.jsx — server component
import Link from 'next/link';
import Bi from '@/components/Bi';
import { HERO, HERO_STACK } from '@/lib/home';
import { REVIEWS_URL } from '@/lib/reviews';
import { GoogleG, Stars, WorkImage, workByKey } from '@/components/home/ui';

export default function Hero() {
  const stack = HERO_STACK.map(workByKey).filter(Boolean);
  const first = stack[0];

  return (
    <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden" aria-labelledby="hero-title">
      {/* one soft light source, nothing else */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-[0.16]" style={{ background: 'radial-gradient(ellipse at center, #3B9BE8 0%, transparent 62%)' }} aria-hidden="true" />
      <link rel="preload" as="image" type="image/avif" imageSrcSet={`/img/work/${first.key}-600.avif 600w, /img/work/${first.key}-800.avif 800w, /img/work/${first.key}-1400.avif 1400w`} imageSizes="(min-width: 1024px) 560px, 100vw" fetchPriority="high" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        <div className="lg:col-span-7 relative z-10">
          <Bi as="span" className="eyebrow" el={HERO.eyebrow.el} en={HERO.eyebrow.en} />
          <h1 id="hero-title" className="font-display text-paper mt-5 mb-6 leading-[0.98] tracking-[-0.01em]" style={{ fontSize: 'clamp(2.9rem, 6.6vw, 5.4rem)' }}>
            <span className="block"><Bi el={HERO.h1a.el} en={HERO.h1a.en} /></span>
            <span className="block text-aegean-2"><Bi el={HERO.h1b.el} en={HERO.h1b.en} /></span>
          </h1>
          <Bi as="p" className="text-paper-2 text-lg md:text-xl leading-relaxed max-w-[34rem] mb-8" el={HERO.sub.el} en={HERO.sub.en} />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/dorean-istoselida" prefetch={false} className="btn-primary text-base">
              <Bi el={HERO.cta.el} en={HERO.cta.en} />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <a href="#how" className="btn-ghost"><Bi el={HERO.link.el} en={HERO.link.en} /> ↓</a>
          </div>
          <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-paper-2">
            <span className="font-semibold text-paper"><Bi el={HERO.proofSites.el} en={HERO.proofSites.en} /></span>
            <span className="text-paper-3" aria-hidden="true">·</span>
            <a href={REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-paper">
              <GoogleG /> <Stars /> <span className="font-semibold text-paper">5.0</span>
              <span><Bi el={HERO.proofReviews.el} en={HERO.proofReviews.en} /></span>
            </a>
          </p>
        </div>

        {/* The work, drifting slowly. Cross-fade only — the one moving thing on the page. */}
        <div className="lg:col-span-5 relative">
          <div className="lg:[perspective:1600px]">
            <div className="stack-drift lg:[transform:rotateY(-7deg)_rotateX(2deg)] lg:origin-left">
              <div className="mockup">
                <div className="mockup-bar"><i /><i /><i /></div>
                <div className="relative aspect-[1400/802]">
                  {stack.map((item, i) => (
                    <figure key={item.key} className="stack-slide absolute inset-0 m-0" style={{ opacity: i === 0 ? 1 : 0 }}>
                      <WorkImage item={item} priority={i === 0} />
                      <figcaption className="absolute left-3 bottom-3 bg-ink/85 text-paper text-[0.7rem] font-semibold px-2.5 py-1.5 rounded-md tracking-wide">
                        {item.name} · <Bi el={item.niche.el} en={item.niche.en} />
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center lg:text-left text-xs text-paper-3 tracking-wide">
            <Bi el="Πραγματικές σελίδες πελατών μας — όλες με 0€ κατασκευή." en="Real client websites — all built for €0." />
          </p>
        </div>
      </div>
    </section>
  );
}
