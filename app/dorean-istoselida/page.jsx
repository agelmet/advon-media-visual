// app/dorean-istoselida/page.jsx — the ads landing page (Meta + Google, October 2026)
import Bi from '@/components/Bi';
import LeadForm from '@/components/lp/LeadForm';
import { PROMISE, HERO_STACK } from '@/lib/home';
import { googleReviews, REVIEWS_URL, OVERALL_RATING } from '@/lib/reviews';
import { GoogleG, Stars, WorkImage, workByKey } from '@/components/home/ui';

export const metadata = {
  title: 'Δωρεάν Κατασκευή Ιστοσελίδας — Χωρίς Προκαταβολή | Advon Media',
  description:
    'Δωρεάν κατασκευή. Χωρίς προκαταβολή. Πληρώνετε μόνο τη φιλοξενία (10,83€/μήνα), όταν δείτε το πρώτο δείγμα της σελίδας σας — και κάνουμε απεριόριστες αλλαγές μέχρι να είναι ακριβώς όπως τη θέλετε.',
  alternates: { canonical: '/dorean-istoselida' },
  robots: { index: false, follow: true },
  openGraph: { title: 'Η ιστοσελίδα σας. Δωρεάν. Χωρίς προκαταβολή.', description: PROMISE.el, url: '/dorean-istoselida' },
};

const CHECKS = [
  { el: '0€ κατασκευή. Ούτε ευρώ προκαταβολή.', en: '€0 build. Not one euro of deposit.' },
  { el: 'Λιγότερη από 1 ώρα από εσάς — στέλνετε υλικό, τα υπόλοιπα τα κάνουμε εμείς.', en: 'Less than an hour of your time — you send material, we do the rest.' },
  { el: 'Όλες οι αλλαγές, μέχρι να γίνει ακριβώς όπως τη φαντάζεστε.', en: 'Every change, until it is exactly how you imagine it.' },
  { el: '10,83€/μήνα: domain, φιλοξενία, ασφάλεια, συντήρηση — όλα μέσα, αφού τη δείτε έτοιμη.', en: '€10.83/month: domain, hosting, security, maintenance — all included, after you see it finished.' },
];

export default function LandingPage() {
  const strip = HERO_STACK.slice(0, 3).map(workByKey).filter(Boolean);
  const reviews = googleReviews.filter((r) => r.text && r.text.trim().length >= 80 && r.text.trim().length <= 420).slice(0, 6);
  return (
    <>
      {/* ── Promise + form ── */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-[0.16]" style={{ background: 'radial-gradient(ellipse at center, #3B9BE8 0%, transparent 62%)' }} aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-5 md:px-8 grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <Bi as="span" className="eyebrow" el="Κατασκευή ιστοσελίδας · Χωρίς προκαταβολή" en="Website build · No deposit" />
            <h1 className="font-display text-paper mt-5 mb-6 leading-[0.98]" style={{ fontSize: 'clamp(2.7rem, 6vw, 4.6rem)' }}>
              <Bi el="Η ιστοσελίδα σας." en="Your website." /><br />
              <span className="text-aegean-2"><Bi el="Δωρεάν." en="Free." /></span>
            </h1>
            <Bi as="p" className="text-paper-2 text-lg md:text-xl leading-relaxed max-w-[38rem] mb-7" el={PROMISE.el} en={PROMISE.en} />
            <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-paper-2 mb-8">
              <span className="font-semibold text-paper"><Bi el="200+ ιστοσελίδες" en="200+ websites" /></span>
              <span className="text-paper-3" aria-hidden="true">·</span>
              <a href={REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-paper">
                <GoogleG /> <Stars /> <span className="font-semibold text-paper">{OVERALL_RATING}</span> <Bi el="110+ κριτικές — δείτε τες όλες" en="110+ reviews — see them all" />
              </a>
            </p>
            <ul className="space-y-3 text-paper-2">
              {CHECKS.map((c) => (
                <li key={c.el} className="flex items-start gap-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-aegean-2 shrink-0 mt-0.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                  <Bi el={c.el} en={c.en} />
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* ── Three sites ── */}
      <section className="py-12 md:py-16 border-t border-line" aria-labelledby="lp-work">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <Bi as="h2" id="lp-work" className="font-display text-3xl md:text-4xl text-paper mb-2" el="Τρεις από τις 200+ σελίδες που φτιάξαμε." en="Three of the 200+ websites we have built." />
          <Bi as="p" className="text-paper-3 mb-8" el="Όλες με 0€ κατασκευή. Όλες φτιαγμένες για το επάγγελμα του κατόχου τους." en="All built for €0. All designed for their owner’s profession." />
          <ul className="grid sm:grid-cols-3 gap-5">
            {strip.map((item) => (
              <li key={item.key}>
                <div className="mockup">
                  <div className="mockup-bar"><i /><i /><i /></div>
                  <WorkImage item={item} sizes="(min-width: 640px) 33vw, 100vw" />
                </div>
                <p className="mt-3 text-sm"><span className="font-semibold text-paper">{item.name}</span> <span className="text-paper-3">· <Bi el={item.niche.el} en={item.niche.en} /></span></p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Review wall ── */}
      <section className="py-12 md:py-16 border-t border-line" aria-labelledby="lp-reviews">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <Bi as="h2" id="lp-reviews" className="font-display text-3xl md:text-4xl text-paper mb-2" el="Δεν θα σας πούμε εμείς ότι είμαστε καλοί." en="We will not be the ones to tell you we are good." />
              <Bi as="p" className="text-paper-3" el="Θα αφήσουμε τους 110+ να το πουν." en="We will let the 110+ say it." />
            </div>
            <a href={REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost self-start"><GoogleG /> <Bi el="Δείτε τις κριτικές στο Google" en="See the reviews on Google" /> →</a>
          </div>
          <ul className="sm:columns-2 lg:columns-3 gap-5 [&>li]:break-inside-avoid [&>li]:mb-5">
            {reviews.map((r, i) => (
              <li key={r.name + i} className="card-v2 p-6 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3"><span className="font-semibold text-paper truncate">{r.name}</span><GoogleG /></div>
                <Stars />
                <p className="text-paper-2 text-[0.95rem] leading-relaxed"><span className="i18n-el">{r.text}</span><span className="i18n-en">{r.textEn || r.text}</span></p>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <a href="#form" className="btn-primary text-base"><Bi el="Θέλω το δωρεάν δείγμα μου" en="I want my free draft" /> ↑</a>
          </div>
        </div>
      </section>
    </>
  );
}
