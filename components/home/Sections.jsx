// components/home/Sections.jsx — server components for the homepage sections
import Link from 'next/link';
import Bi from '@/components/Bi';
import { NICHE_STRIP, NICHES, STEPS, PRICING, WORK, portfolioByNiche } from '@/lib/home';
import { services, HOME_FAQS } from '@/lib/services';
import { googleReviews, REVIEWS_URL, OVERALL_RATING } from '@/lib/reviews';
import { GoogleG, Stars, SectionHead, WorkImage, ServiceIcon } from '@/components/home/ui';

/* ───────────── Niche strip ───────────── */
export function NicheStrip() {
  return (
    <section className="border-y border-line bg-ink-2/60" aria-label="Για ποιους φτιάχνουμε ιστοσελίδες">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8rem] font-semibold tracking-wide text-paper-3">
        <Bi as="span" className="text-paper-2 mr-2" el="Φτιάχνουμε για:" en="We build for:" />
        {NICHE_STRIP.map((n) => (
          <span key={n.el} className="whitespace-nowrap"><Bi el={n.el} en={n.en} /></span>
        ))}
      </div>
    </section>
  );
}

/* ───────────── Πώς δουλεύει ───────────── */
export function HowItWorks() {
  return (
    <section id="how" className="py-20 md:py-28 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHead
          className="rv"
          eyebrow={{ el: 'Πώς δουλεύει', en: 'How it works' }}
          title={{ el: 'Πρώτα τη βλέπετε. Μετά αποφασίζετε.', en: 'First you see it. Then you decide.' }}
          lede={{ el: 'Το αντίθετο από κάθε άλλη εταιρεία κατασκευής ιστοσελίδων. Καμία προκαταβολή — ποτέ.', en: 'The opposite of every other web agency. No deposit — ever.' }}
        />
        <ol className="mt-12 grid md:grid-cols-3 gap-5 md:gap-6">
          {STEPS.map((s, i) => (
            <li key={s.n} className={`card-v2 p-7 md:p-8 rv rv-${i + 1}`}>
              <div className="flex items-baseline justify-between mb-6">
                <span className="font-display text-4xl text-aegean-2">{s.n}</span>
                <Bi as="span" className="text-xs font-bold tracking-widest uppercase text-paper-3" el={s.meta.el} en={s.meta.en} />
              </div>
              <Bi as="h3" className="text-xl font-bold text-paper mb-3" el={s.title.el} en={s.title.en} />
              <Bi as="p" className="text-paper-2 leading-relaxed" el={s.body.el} en={s.body.en} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────── Portfolio ───────────── */
const NICHE_ORDER = ['psy', 'dent', 'med', 'physio', 'pro'];

export function Portfolio() {
  const all = portfolioByNiche();
  const counts = Object.fromEntries(NICHE_ORDER.map((id) => [id, all.filter((p) => p.niche === id).length]));
  return (
    <section id="work" className="py-20 md:py-28 border-t border-line scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 rv">
          <SectionHead
            eyebrow={{ el: 'Πορτφόλιο', en: 'Portfolio' }}
            title={{ el: 'Η δουλειά μιλάει πρώτη.', en: 'The work speaks first.' }}
            lede={{ el: 'Εννέα από τις 200+ σελίδες που έχουμε παραδώσει. Κάθε μία σχεδιασμένη για το επάγγελμα και τους πελάτες του κατόχου της — καμία από πρότυπο.', en: 'Nine of the 200+ websites we have delivered. Each designed for its owner’s profession and clients — none from a template.' }}
          />
          <Link href="/kataskevi-istoselidas#portfolio" className="btn-ghost self-start lg:self-auto">
            <Bi el="Όλα τα έργα" en="All projects" /> →
          </Link>
        </div>

        <ul className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6" aria-label="Επιλεγμένα έργα">
          {WORK.map((item, i) => {
            const inner = (
              <>
                <div className="mockup">
                  <div className="mockup-bar"><i /><i /><i /></div>
                  <WorkImage item={item} widths={[600, 800, 1400]} sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw" />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <span className="font-semibold text-paper">{item.name}</span>
                  <Bi as="span" className="text-xs text-paper-3 tracking-wide text-right" el={item.niche.el} en={item.niche.en} />
                </div>
              </>
            );
            return (
              <li key={item.key} className={`rv rv-${(i % 3) + 1}`}>
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="block group">{inner}</a>
                ) : (
                  <div>{inner}</div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Every live site, filterable by profession — CSS only, no JavaScript */}
        <div className="mt-16 relative rv">
          <Bi as="h3" className="text-lg font-bold text-paper mb-4" el={`Όλες οι σελίδες που έχουμε στον αέρα (${all.length})`} en={`Every site we have live (${all.length})`} />
          <input type="radio" name="pf" id="pf-all" className="pf-input" defaultChecked />
          {NICHE_ORDER.map((id) => <input key={id} type="radio" name="pf" id={`pf-${id}`} className="pf-input" />)}
          <div className="pf-chips flex flex-wrap gap-2 mb-6">
            <label htmlFor="pf-all" className="pf-chip"><Bi el="Όλα" en="All" /> · {all.length}</label>
            {NICHE_ORDER.map((id) => {
              const n = NICHES.find((x) => x.id === id);
              return counts[id] ? (
                <label key={id} htmlFor={`pf-${id}`} className="pf-chip"><Bi el={n.el} en={n.en} /> · {counts[id]}</label>
              ) : null;
            })}
          </div>
          <ul className="pf-list grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1.5 text-sm">
            {all.map((p) => (
              <li key={p.url} data-niche={p.niche} className="truncate">
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-paper-2 hover:text-aegean-2 transition-colors">
                  <span className="i18n-el">{p.name}</span><span className="i18n-en">{p.nameEn}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Pricing ───────────── */
export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28 border-t border-line scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5 rv">
          <SectionHead
            eyebrow={{ el: 'Τιμές', en: 'Pricing' }}
            title={{ el: 'Μία τιμή. Χωρίς ψιλά γράμματα.', en: 'One price. No fine print.' }}
            lede={{ el: 'Η κατασκευή είναι δωρεάν. Η φιλοξενία τιμολογείται μόνο όταν δείτε το δείγμα σας και αποφασίσετε να προχωρήσετε.', en: 'The build is free. Hosting is billed only when you have seen your draft and decided to go ahead.' }}
          />
          <Link href="/kataskevi-istoselidas" className="btn-ghost mt-8 inline-flex">
            <Bi el={PRICING.more.el} en={PRICING.more.en} /> →
          </Link>
        </div>
        <div className="lg:col-span-7 rv rv-2">
          <div className="card-v2 p-7 md:p-10 grid sm:grid-cols-2 gap-8">
            <div>
              <Bi as="span" className="eyebrow" el={PRICING.build.el} en={PRICING.build.en} />
              <p className="font-display text-6xl md:text-7xl text-paper mt-3 leading-none"><Bi el={PRICING.buildPrice.el} en={PRICING.buildPrice.en} /></p>
              <Bi as="p" className="text-paper-3 text-sm mt-3" el="Σχεδιασμός, κείμενα, κατασκευή — όλα δωρεάν, χωρίς προκαταβολή." en="Design, copy, build — all free, no deposit." />
            </div>
            <div>
              <Bi as="span" className="eyebrow" el={PRICING.hosting.el} en={PRICING.hosting.en} />
              <p className="font-display text-6xl md:text-7xl text-aegean-2 mt-3 leading-none"><Bi el={PRICING.hostingPrice.el} en={PRICING.hostingPrice.en} /><span className="text-2xl text-paper-3 font-body"> / <Bi el="μήνα" en="month" /></span></p>
              <Bi as="p" className="text-paper-3 text-sm mt-3" el={PRICING.hostingNote.el} en={PRICING.hostingNote.en} />
            </div>
            <ul className="sm:col-span-2 mt-2 pt-6 border-t border-line grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-paper-2">
              {PRICING.includes.map((inc) => (
                <li key={inc.el} className="flex items-start gap-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-aegean-2 shrink-0 mt-1" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                  <Bi el={inc.el} en={inc.en} />
                </li>
              ))}
            </ul>
            <div className="sm:col-span-2">
              <Link href="/dorean-istoselida" className="btn-primary w-full sm:w-auto">
                <Bi el="Ξεκινήστε — δείτε το δείγμα σας δωρεάν" en="Start — see your free draft" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Reviews ───────────── */
export function ReviewsGrid({ count = 9, compact = false }) {
  const withText = googleReviews.filter((r) => r.text && r.text.trim().length >= 80 && r.text.trim().length <= 420);
  const picked = withText.slice(0, count);
  return (
    <section id="reviews" className={`${compact ? 'py-14' : 'py-20 md:py-28'} border-t border-line scroll-mt-20`}>
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 rv">
          <SectionHead
            eyebrow={{ el: 'Κριτικές', en: 'Reviews' }}
            title={{ el: 'Δεν θα σας πούμε εμείς ότι είμαστε καλοί.', en: 'We will not be the ones to tell you we are good.' }}
            lede={{ el: 'Θα αφήσουμε τους 110+ να το πουν. Κάθε κριτική είναι δημόσια στο Google — διαβάστε τες όλες.', en: 'We will let the 110+ say it. Every review is public on Google — read them all.' }}
          />
          <a href={REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="card-v2 px-5 py-4 flex items-center gap-4 self-start lg:self-auto hover:border-aegean">
            <GoogleG className="w-8 h-8 shrink-0" />
            <span>
              <span className="flex items-center gap-2"><span className="font-display text-3xl text-paper leading-none">{OVERALL_RATING}</span><Stars /></span>
              <span className="block text-xs text-paper-3 mt-1"><Bi el="110+ κριτικές στο Google →" en="110+ Google reviews →" /></span>
            </span>
          </a>
        </div>
        <ul className="mt-12 sm:columns-2 lg:columns-3 gap-5 [&>li]:break-inside-avoid [&>li]:mb-5">
          {picked.map((r, i) => (
            <li key={r.name + i} className={`card-v2 p-6 flex flex-col gap-4 rv rv-${(i % 3) + 1}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-paper truncate">{r.name}</span>
                <GoogleG />
              </div>
              <Stars />
              <p className="text-paper-2 text-[0.95rem] leading-relaxed">
                <span className="i18n-el">{r.text}</span>
                <span className="i18n-en">{r.textEn || r.text}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────── Services (three tiles + the rest as links) ───────────── */
const TRIO = ['kataskevi-istoselidas', 'google-reviews-nfc', 'online-rantevou'];
export function ServicesTrio() {
  const trio = TRIO.map((slug) => services.find((s) => s.slug === slug)).filter(Boolean);
  const rest = services.filter((s) => !TRIO.includes(s.slug));
  return (
    <section id="services" className="py-20 md:py-28 border-t border-line scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHead
          className="rv"
          eyebrow={{ el: 'Υπηρεσίες', en: 'Services' }}
          title={{ el: 'Η σελίδα είναι η αρχή. Μετά τη βάζουμε να δουλεύει.', en: 'The website is the start. Then we put it to work.' }}
          lede={{ el: 'Ό,τι χρειάζεται μια επιχείρηση για να τη βρίσκουν, να την εμπιστεύονται — και να κλείνουν.', en: 'Everything a business needs to be found, trusted — and booked.' }}
        />
        <ul className="mt-12 grid md:grid-cols-3 gap-5 md:gap-6">
          {trio.map((s, i) => (
            <li key={s.slug} className={`card-v2 p-7 flex flex-col rv rv-${i + 1}`}>
              <div className="w-11 h-11 rounded-lg bg-ink-3 border border-line flex items-center justify-center text-aegean-2 mb-5"><ServiceIcon name={s.icon} /></div>
              <Bi as="h3" className="text-xl font-bold text-paper mb-3" el={s.nav.el} en={s.nav.en} />
              <Bi as="p" className="text-paper-2 leading-relaxed mb-6 flex-1" el={s.pitch.el} en={s.pitch.en} />
              <Link href={`/${s.slug}`} className="btn-ghost self-start"><Bi el="Μάθετε περισσότερα" en="Learn more" /> →</Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-paper-3 rv">
          <Bi as="span" className="text-paper-2" el="Ακόμη:" en="Also:" />
          {rest.map((s) => (
            <Link key={s.slug} href={`/${s.slug}`} className="hover:text-aegean-2 transition-colors"><Bi el={s.nav.el} en={s.nav.en} /></Link>
          ))}
          <Link href="/diaxeirisi-social-media" className="hover:text-aegean-2 transition-colors"><Bi el="Διαχείριση Social Media" en="Social Media Management" /></Link>
        </p>
      </div>
    </section>
  );
}

/* ───────────── FAQ (native details, no JS) ───────────── */
export function HomeFaq({ faqs = HOME_FAQS, title }) {
  return (
    <section id="faq" className="py-20 md:py-28 border-t border-line scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 rv">
          <SectionHead
            eyebrow={{ el: 'Συχνές ερωτήσεις', en: 'FAQ' }}
            title={title || { el: 'Ό,τι ρωτούν όλοι πριν ξεκινήσουν.', en: 'What everyone asks before starting.' }}
          />
        </div>
        <div className="lg:col-span-8 faq rv rv-2">
          {faqs.map(({ q, a }, i) => (
            <details key={i} open={i === 0}>
              <summary className="text-paper">
                <span><span className="i18n-el">{q.el}</span><span className="i18n-en">{q.en}</span></span>
                <span className="plus" aria-hidden="true" />
              </summary>
              <div><span className="i18n-el">{a.el}</span><span className="i18n-en">{a.en}</span></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
