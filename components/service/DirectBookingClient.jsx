// components/service/DirectBookingClient.jsx
// «Ιστοσελίδα για καταλύματα» (was «Direct Booking για Τουρισμό»). 24 Nov 2026 — Angelo: not a
// main service any more, reached from «Έχετε κατάλυμα;»; the page now leads with the THREE options,
// said super simply: 1 · 0€ + 130€/year (guests call / message you) · 2 · 0€ + 180€/year
// (availability calendar + booking requests to your e-mail) · 3 · 100€ setup + 240€/year (full
// booking system on the site, synced with Airbnb & Booking). Then the 0% moment, the pain, the sync
// diagram (option 3), the steps, the FAQ.
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
  ProofStrip,
  FaqSection,
} from '@/components/service/blocks';
import { Head, PriceCard } from '@/components/service/setup';

const T = {
  el: {
    kicker: 'Για καταλύματα',
    cta1: 'Δείτε τις 3 επιλογές', cta2: 'Επικοινωνία',
    oLabel: 'Οι 3 επιλογές',
    oTitle: 'Διαλέξτε πώς θα κλείνουν οι επισκέπτες σας.',
    oLead: 'Και στις τρεις, την ιστοσελίδα τη φτιάχνουμε εμείς, με τις φωτογραφίες και τα στοιχεία του καταλύματός σας, σε ελληνικά και αγγλικά. Αλλάζει μόνο το πώς γίνεται η κράτηση.',
    opts: [
      { n: '1', tier: 'Ιστοσελίδα καταλύματος', price: '0€', note: 'κατασκευή', sub: '130€ + ΦΠΑ τον χρόνο · φιλοξενία και domain', badge: 'Η πρότασή μας για αρχή', cta: 'Ξεκινάω με αυτό', items: [
        'Η ιστοσελίδα του καταλύματός σας: φωτογραφίες, χώροι, παροχές, τοποθεσία',
        'Ο επισκέπτης σας καλεί ή σας στέλνει μήνυμα (Viber, WhatsApp, e-mail) για να κλείσει',
        'Εσείς συμφωνείτε ημερομηνίες και τιμή — χωρίς καμία προμήθεια',
        'Κουμπιά προς τις αγγελίες σας στο Airbnb και στο Booking, αν τις έχετε',
      ] },
      { n: '2', tier: 'Με ημερολόγιο διαθεσιμότητας', price: '0€', note: 'κατασκευή', sub: '180€ + ΦΠΑ τον χρόνο · φιλοξενία, domain και ημερολόγιο', cta: 'Θέλω το ημερολόγιο', items: [
        'Όλα όσα έχει η επιλογή 1',
        'Ημερολόγιο στην ιστοσελίδα με τις ελεύθερες ημερομηνίες — ενημερώνεται μόνο του από το Airbnb και το Booking',
        'Ο επισκέπτης διαλέγει ημερομηνίες και σας στέλνει αίτημα κράτησης στο e-mail σας',
        'Εσείς απαντάτε και επιβεβαιώνετε την κράτηση',
      ] },
      { n: '3', tier: 'Πλήρες σύστημα κρατήσεων', price: '100€', note: 'στήσιμο · εφάπαξ', sub: '240€ + ΦΠΑ τον χρόνο · φιλοξενία, domain και σύστημα κρατήσεων', cta: 'Θέλω πλήρες σύστημα', items: [
        'Όλα όσα έχει η επιλογή 1',
        'Ο επισκέπτης κλείνει μόνος του από την ιστοσελίδα σας, όπως στο Airbnb',
        'Ένα ημερολόγιο κοινό με Airbnb και Booking: μια ημερομηνία που κλείνει κάπου, κλείνει παντού',
        'Καμία διπλοκράτηση και καμία προμήθεια στις κρατήσεις από την ιστοσελίδα σας',
      ] },
    ],
    vat: 'Όλες οι τιμές είναι χωρίς ΦΠΑ 24%. Μπορείτε να ξεκινήσετε με την επιλογή 1 και να προσθέσουμε το ημερολόγιο ή το πλήρες σύστημα αργότερα, στην ίδια ιστοσελίδα.',
    pLabel: 'Ποια σας ταιριάζει;',
    pTitle: 'Με μια ματιά.',
    pick: [
      ['Θέλω να με βρίσκουν και να με καλούν', 'Επιλογή 1'],
      ['Θέλω να βλέπουν πότε είμαι ελεύθερος και να μου στέλνουν αίτημα', 'Επιλογή 2'],
      ['Θέλω να κλείνουν μόνοι τους, όπως στο Airbnb', 'Επιλογή 3'],
    ],
    syncLabel: 'Επιλογή 3',
    syncTitle: 'Ένα ημερολόγιο για όλα.',
    syncLead: 'Η ιστοσελίδα σας, το Airbnb και το Booking βλέπουν το ίδιο ημερολόγιο. Όταν κάποιος κλείνει οπουδήποτε, οι ημερομηνίες κλείνουν παντού — αυτόματα.',
  },
  en: {
    kicker: 'For holiday rentals',
    cta1: 'See the 3 options', cta2: 'Contact',
    oLabel: 'The 3 options',
    oTitle: 'Choose how your guests book.',
    oLead: 'In all three we build the website ourselves, with your property\'s photos and details, in Greek and English. Only the way guests book changes.',
    opts: [
      { n: '1', tier: 'Property website', price: '€0', note: 'build', sub: '€130 + VAT a year · hosting and domain', badge: 'Our pick to start with', cta: 'I start with this', items: [
        'Your property\'s website: photos, rooms, amenities, location',
        'Guests call you or message you (Viber, WhatsApp, e-mail) to book',
        'You agree dates and price — no commission at all',
        'Buttons to your Airbnb and Booking listings, if you have them',
      ] },
      { n: '2', tier: 'With an availability calendar', price: '€0', note: 'build', sub: '€180 + VAT a year · hosting, domain and calendar', cta: 'I want the calendar', items: [
        'Everything in option 1',
        'A calendar on the website with the free dates — it updates itself from Airbnb and Booking',
        'Guests pick dates and send a booking request to your e-mail',
        'You reply and confirm the booking',
      ] },
      { n: '3', tier: 'Full booking system', price: '€100', note: 'setup · one-off', sub: '€240 + VAT a year · hosting, domain and booking system', cta: 'I want the full system', items: [
        'Everything in option 1',
        'Guests book on their own from your website, like on Airbnb',
        'One calendar shared with Airbnb and Booking: a date booked anywhere closes everywhere',
        'No double bookings and no commission on bookings from your website',
      ] },
    ],
    vat: 'All prices exclude 24% VAT. You can start with option 1 and we add the calendar or the full system later, on the same website.',
    pLabel: 'Which one fits you?',
    pTitle: 'At a glance.',
    pick: [
      ['I want people to find me and call me', 'Option 1'],
      ['I want them to see when I\'m free and send me a request', 'Option 2'],
      ['I want them to book on their own, like on Airbnb', 'Option 3'],
    ],
    syncLabel: 'Option 3',
    syncTitle: 'One calendar for everything.',
    syncLead: 'Your website, Airbnb and Booking see the same calendar. When someone books anywhere, the dates close everywhere — automatically.',
  },
};

export default function DirectBookingClient() {
  const { lang } = useLangStore();
  const service = getService('direct-booking');
  const t = T[lang] || T.el;

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
            <span className="section-label">{t.kicker}</span>
            <h1
              className="font-black font-display mb-5 text-white tracking-tight leading-[1.06]"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 4.5rem)', textWrap: 'balance' }}
            >
              {service.h1[lang]}
            </h1>
            <p className="save-tag font-display font-bold max-w-3xl mx-auto mb-5">
              {lang === 'el'
                ? <>Λίγες κρατήσεις τον χρόνο από τη δική σας ιστοσελίδα γλιτώνουν <em>εκατοντάδες — συχνά χιλιάδες — ευρώ</em> σε προμήθειες.</>
                : <>A few bookings a year through your own website save you <em>hundreds — often thousands — of euros</em> in commission.</>}
            </p>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{service.sub[lang]}</p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <a href="#epiloges" className="btn-premium inline-flex items-center gap-2 px-8 py-4 bg-electric-cyan text-[#050608] font-black text-sm uppercase tracking-[0.1em] rounded-xl hover:bg-white transition-colors" style={{ boxShadow: '0 0 30px rgba(71,200,245,0.35)' }}>{t.cta1}</a>
              <a href="#contact" className="btn-premium btn-ghost inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-black text-sm uppercase tracking-[0.1em] rounded-xl hover:bg-white hover:text-[#050608] transition-colors">{t.cta2}</a>
            </div>
            <SaveCalc lang={lang} />
          </ScrollReveal>
        </div>
      </section>

      {/* ─── THE THREE OPTIONS ─── */}
      <section id="epiloges" className="py-20 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <Head center label={t.oLabel} title={t.oTitle} lead={t.oLead} />
          <div className="grid md:grid-cols-3 gap-6 mt-14 items-stretch">
            {t.opts.map((o, i) => (
              <ScrollReveal key={o.n} delay={i * 110} className="h-full">
                <PriceCard tier={`${lang === 'el' ? 'Επιλογή' : 'Option'} ${o.n} · ${o.tier}`} price={o.price} priceNote={o.note} sub={o.sub} items={o.items} cta={o.cta} hot={i === 0} badge={o.badge} />
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal className="mt-6"><p className="text-center text-sm text-gray-400 leading-relaxed max-w-3xl mx-auto">{t.vat}</p></ScrollReveal>
          <div className="max-w-3xl mx-auto mt-16">
            <Head center label={t.pLabel} title={t.pTitle} />
            <ScrollReveal className="stay-pick mt-8">
              {t.pick.map(([q, a]) => (
                <div key={a} className="stay-pick-row"><span>{q}</span><b>{a}</b></div>
              ))}
            </ScrollReveal>
          </div>
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
      <section className="py-24 bg-[#0b0c10]/60 border-y border-electric-cyan/8 backdrop-blur-sm relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <Head center label={t.syncLabel} title={t.syncTitle} lead={t.syncLead} className="mb-14" />
          <SyncDiagram lang={lang} />
        </div>
      </section>

      <StepsSection service={service} />
      <ProofStrip />
      <FaqSection service={service} />
    </>
  );
}

/* ─── Signature: platforms + your own site converge into one calendar ─── */
function SyncDiagram({ lang }) {
  const channels = ['Airbnb', 'Booking.com', 'Vrbo'];
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
          <div className="relative z-10 rounded-3xl border-2 border-electric-cyan/45 bg-[#0b0c10] p-7 shadow-[0_0_40px_rgba(71,200,245,0.18)]">
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

/* ─── Savings calculator (27 Nov 2026): what stays with the owner when a guest books on the owner's
   own site instead of a platform. Platforms keep ~15% (Booking.com ~15% on average; Airbnb 15.5%
   host-only fee for EU listings since 13 Oct 2026) — checked 27 Nov 2026. Deliberately small. ─── */
const RATE = 0.15;
function SaveCalc({ lang }) {
  const el = lang === 'el';
  const [price, setPrice] = useState(200);
  const [stays, setStays] = useState(6);
  const [nights, setNights] = useState(6);
  const fmt = (n) => Math.round(n).toLocaleString(el ? 'el-GR' : 'en-GB');
  const income = price * stays * nights;
  const saved = income * RATE;
  const rows = [
    { k: 'p', label: el ? 'Τιμή ανά βράδυ' : 'Price per night', val: `${fmt(price)}€`, v: price, set: setPrice, min: 40, max: 800, step: 10 },
    { k: 's', label: el ? 'Απευθείας κρατήσεις τον χρόνο' : 'Direct bookings a year', val: fmt(stays), v: stays, set: setStays, min: 1, max: 40, step: 1 },
    { k: 'n', label: el ? 'Βράδια ανά κράτηση' : 'Nights per booking', val: fmt(nights), v: nights, set: setNights, min: 1, max: 14, step: 1 },
  ];
  return (
    <div className="save-calc glass-panel mt-8 text-left">
      <div className="save-calc-grid">
        {rows.map((r) => (
          <label key={r.k} className="save-field">
            <span className="save-lbl">{r.label}<b>{r.val}</b></span>
            <input type="range" min={r.min} max={r.max} step={r.step} value={r.v}
              onChange={(e) => r.set(+e.target.value)} aria-label={r.label} />
          </label>
        ))}
      </div>
      <div className="save-out">
        <div>
          <span className="save-out-lbl">{el ? 'Μένουν σε εσάς, κάθε χρόνο' : 'Stays with you, every year'}</span>
          <span className="save-out-num" aria-live="polite">≈ {fmt(saved)}€</span>
        </div>
        <p className="save-note">
          {el
            ? <>Αυτό κρατάει η πλατφόρμα (~15%) από {fmt(income)}€ κρατήσεων. Πολλοί επισκέπτες σάς βρίσκουν στο Booking ή στο Airbnb και μετά ψάχνουν το όνομα του καταλύματος στο Google για καλύτερη τιμή. Η ιστοσελίδα κοστίζει από <b>130€ + ΦΠΑ τον χρόνο</b>.</>
            : <>That is what the platform keeps (~15%) from €{fmt(income)} of bookings. Many guests find you on Booking or Airbnb and then search your property's name on Google for a better price. The website costs from <b>€130 + VAT a year</b>.</>}
        </p>
      </div>
    </div>
  );
}
