// components/Contact.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useLangStore } from '@/store/langStore';
import ScrollReveal from '@/components/ScrollReveal';
import { SOCIALS, SocialIcon } from '@/components/Socials';
import { metaTrack } from '@/components/Analytics';
import { usePathname } from 'next/navigation';
import { isLanding, readUtm, readNiche, readClickId } from '@/lib/landing';

// Our own booking page (/rantevou, 20 Nov 2026 — replaces Zoho): shown here as a same-origin iframe in its
// «embed» mode. After the form, the details go to it through sessionStorage + postMessage (never in the URL),
// so the visitor only picks a day and a time. The iframe tells us its height and when a booking is made
// (Meta «Schedule», plus «Lead» when nobody filled the form first — the same event ids go to the server).
const CAL_ID = 'advon-booking';
const PREFILL_KEY = 'advon_prefill';

const inputCls =
  'w-full bg-[#050608]/60 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-electric-cyan focus:shadow-[0_0_0_3px_rgba(71,200,245,0.15),0_0_24px_rgba(71,200,245,0.18)] transition-all duration-300';

export default function Contact() {
  const { lang } = useLangStore();
  const [status, setStatus] = useState('');
  const [sent, setSent] = useState(false);
  // After the form the same card turns into «Βήμα 2 από 2» and the booking next to it already holds their details.
  const calRef = useRef(null);
  const [calH, setCalH] = useState(560);
  // Both forms go ONLY to our own /api/lead (CRM lead inbox + Telegram + e-mail) — no Formspree (10 Nov 2026:
  // its 50-a-month limit and its spam folder were hiding real leads). Ads landing page (/istoselida): shorter
  // form with «ειδικότητα», the ad's UTM, Meta Lead on success.
  const landing = isLanding(usePathname() || '');
  const utmRef = useRef({});
  const clickRef = useRef(null);
  const stampRef = useRef('');
  const profRef = useRef(null);
  useEffect(() => {
    // the page's stamp: /api/lead files a form without it as spam (robot check, 20 Oct 2026)
    fetch('/api/lead?stamp=1', { cache: 'no-store' }).then((r) => r.json()).then((j) => { if (j && j.stamp) stampRef.current = j.stamp; }).catch(() => {});
    if (!landing) return;
    utmRef.current = readUtm();
    clickRef.current = readClickId();
    // the profession the ad spoke to («Ψυχολόγος;» → Ψυχολόγος) — one field less to type
    const n = readNiche();
    if (n && profRef.current && !profRef.current.value) profRef.current.value = n.prof;
  }, [landing]);
  // The booking page loads when the contact section is about 900px from the screen (nothing to wait for on first paint).
  const [wantCal, setWantCal] = useState(false);
  useEffect(() => {
    if (wantCal) return;
    const el = document.getElementById(CAL_ID);
    if (!el || !('IntersectionObserver' in window)) { setWantCal(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setWantCal(true); io.disconnect(); } }, { rootMargin: '900px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [wantCal]);

  const sendPrefill = () => {
    let d = null;
    try { d = JSON.parse(sessionStorage.getItem(PREFILL_KEY) || 'null'); } catch {}
    const w = calRef.current && calRef.current.contentWindow;
    if (d && w) { try { w.postMessage({ advon: 'rv', type: 'prefill', data: d }, window.location.origin); } catch {} }
  };
  useEffect(() => {
    const onMsg = (e) => {
      if (e.origin !== window.location.origin || !e.data || e.data.advon !== 'rv') return;
      if (calRef.current && e.source !== calRef.current.contentWindow) return;
      const m = e.data;
      if (m.type === 'h' && m.h > 0) setCalH(Math.max(420, Math.min(2400, Math.ceil(m.h))));
      else if (m.type === 'ready') sendPrefill();
      else if (m.type === 'see' && calRef.current) {
        // the booking asks to bring a part of it into view (after picking a day / a time): scroll the page, up or down only when needed
        const top = calRef.current.getBoundingClientRect().top + (+m.y || 0);
        const hd = document.querySelector('header'); const hb = hd ? hd.getBoundingClientRect().bottom : 0;
        const head = Math.max(80, hb) + 20; // never under the site's fixed menu bar
        const want = m.mid ? top - (window.innerHeight - (+m.h || 0)) / 2 : top - head;
        if (top < head || top + Math.min(+m.h || 0, 200) > window.innerHeight * 0.85) window.scrollBy({ top: want, behavior: 'smooth' });
      }
      else if (m.type === 'booked') {
        const cn = landing ? 'istoselida-calendar' : 'booking';
        if (m.evS) metaTrack('Schedule', { content_name: cn }, { eventID: m.evS });
        if (m.evL) metaTrack('Lead', { content_name: cn }, { eventID: m.evL });
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landing]);
  const keepPrefill = (d) => {
    try { sessionStorage.setItem(PREFILL_KEY, JSON.stringify({ ...d, ts: Date.now() })); } catch {}
    setWantCal(true);
    setTimeout(sendPrefill, 50);
  };

  const handleLandingSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);
    if (fd.get('_gotcha')) return;
    const name = String(fd.get('name') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const profession = String(fd.get('profession') || '').trim();
    const message = String(fd.get('message') || '').trim();
    if (phone.replace(/\D/g, '').length < 10) { setStatus('Ελέγξτε το τηλέφωνο — χρειαζόμαστε 10 ψηφία, π.χ. 69X XXX XXXX.'); return; }
    setStatus('Αποστολή...');
    const utm = utmRef.current || {};
    const click = clickRef.current || readClickId();
    const eventId = `lead-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const utmLine = [utm.utm_source, utm.utm_medium, utm.utm_campaign, utm.utm_content].filter(Boolean).join(' / ');
    let crmOk = false, reason = '';
    try {
      const r = await fetch('/api/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, email, profession, message, stamp: stampRef.current, website: String(fd.get('_gotcha') || ''), source: 'istoselida', page: window.location.pathname + window.location.search,
          utm_source: utm.utm_source || '', utm_medium: utm.utm_medium || '', utm_campaign: utm.utm_campaign || '', utm_content: utm.utm_content || '',
          fbclid: (click && click.id) || '', fbclid_ts: (click && click.ts) || 0, event_id: eventId,
        }),
      });
      crmOk = r.ok;
      if (!crmOk) { try { reason = (await r.json()).error || ''; } catch {} }
    } catch {}
    if (crmOk) {
      setSent(true);
      setStatus('');
      metaTrack('Lead', { content_name: 'istoselida', content_category: profession }, { eventID: eventId });
      form.reset();
      // step 2: the booking next to the form already holds their details — they only pick a time
      keepPrefill({ name, phone, email, job: profession });
      setTimeout(() => { const el = document.getElementById('lead-step2'); if (el) { try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch {} } }, 120);
    } else if (reason === 'invalid_phone') {
      setStatus('Ελέγξτε το τηλέφωνο — χρειαζόμαστε 10 ψηφία, π.χ. 69X XXX XXXX.');
    } else {
      setStatus('Κάτι πήγε στραβά. Δοκιμάστε ξανά σε λίγο ή στείλτε μας email στο angelos@advonmedia.com.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);
    if (fd.get('_gotcha')) return;
    const el = lang === 'el';
    const problem = el ? 'Ωχ! Υπήρξε ένα πρόβλημα. Στείλτε μας email στο angelos@advonmedia.com.' : 'Oops! There was a problem. Email us at angelos@advonmedia.com.';
    setStatus(el ? 'Αποστολή...' : 'Sending...');
    try {
      const response = await fetch('/api/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(fd.get('name') || '').trim(), phone: String(fd.get('phone') || '').trim(), email: String(fd.get('email') || '').trim(),
          message: String(fd.get('message') || '').trim(), stamp: stampRef.current, website: '', source: 'site', page: window.location.pathname, lang,
        }),
      });
      if (response.ok) {
        setStatus('');
        setSent(true);
        metaTrack('Lead', { content_name: 'contact-form' });
        form.reset();
        // step 2: the booking next to the form already holds their details — they only pick a time
        keepPrefill({ name: String(fd.get('name') || '').trim(), phone: String(fd.get('phone') || '').trim(), email: String(fd.get('email') || '').trim() });
        setTimeout(() => { const s2 = document.getElementById('lead-step2'); if (s2) { try { s2.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch {} } }, 120);
      } else {
        let reason = ''; try { reason = (await response.json()).error || ''; } catch {}
        setStatus(reason === 'invalid_phone' ? (el ? 'Ελέγξτε το τηλέφωνο — χρειαζόμαστε έναν έγκυρο αριθμό.' : 'Please check the phone number.') : problem);
      }
    } catch (err) {
      setStatus(problem);
    }
  };

  // «Βήμα 2 από 2» texts (10 Nov 2026) — the ads page is Greek only, the main site follows the language switch
  const S2 = lang === 'en' && !landing ? {
    got: 'We received your details.', h1: 'Step 2 of 2:', h2: 'pick a time', h3: 'for the free call', sub: 'No commitment and no upfront payment.', next: 'What happens next',
    steps: ['Pick a day and time in the calendar. Your details are already filled in. You get a confirmation email right away and a reminder 1 hour before.', 'You talk with Angelos for 10–15 minutes, by phone or on Google Meet: what you do, what the site should show, what material we need.', 'If we go ahead, you see the first draft of your website within 1–5 days.'],
    below: 'The calendar is right below ↓', laterH: 'Not a good time to book right now?', later: "You don't need to do anything. We will call you within 24 hours on a working day. If you sent your details at the weekend or on a public holiday, we will call you on the next working day.",
  } : {
    got: 'Λάβαμε τα στοιχεία σας.', h1: 'Βήμα 2 από 2:', h2: 'διαλέξτε ώρα', h3: 'για τη δωρεάν κλήση', sub: 'Χωρίς δέσμευση και χωρίς προκαταβολή.', next: 'Τι γίνεται μετά',
    steps: ['Διαλέγετε μέρα και ώρα στο ημερολόγιο. Τα στοιχεία σας είναι ήδη συμπληρωμένα. Σας έρχεται αμέσως email επιβεβαίωσης και υπενθύμιση 1 ώρα πριν.', 'Μιλάτε 10–15 λεπτά με τον Άγγελο, τηλεφωνικά ή στο Google Meet: τι κάνετε, τι θέλετε να δείχνει η σελίδα, τι υλικό χρειαζόμαστε.', 'Αν προχωρήσουμε, σε 1–5 ημέρες βλέπετε το πρώτο σχέδιο της ιστοσελίδας σας.'],
    below: 'Το ημερολόγιο είναι ακριβώς από κάτω ↓', laterH: 'Δεν σας βολεύει να κλείσετε ώρα τώρα;', later: 'Δεν χρειάζεται να κάνετε τίποτα. Θα σας καλέσουμε εμείς μέσα σε 24 ώρες, σε εργάσιμη ημέρα. Αν μας στείλατε τα στοιχεία σας Σαββατοκύριακο ή αργία, θα σας καλέσουμε την αμέσως επόμενη εργάσιμη.',
  };

  const tiles = [
    {
      key: 'email',
      href: 'mailto:angelos@advonmedia.com',
      title: 'Email',
      sub: 'angelos@advonmedia.com',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><rect width="20" height="16" x="2" y="4" rx="2" ry="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
      external: false,
    },
    ...SOCIALS.map((s) => ({ key: s.key, href: s.href, title: s.title, sub: s.handle, icon: <SocialIcon name={s.key} className="w-7 h-7" />, external: true })),
  ];

  return (
    <section id="contact" className="py-32 relative border-t border-electric-cyan/10 bg-gradient-to-b from-[#050608] to-[#0b0c10] z-20 overflow-hidden">
      {/* Ambient depth layers */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute rounded-full aurora"
          style={{ top: '-18%', left: '-14%', width: 'min(68vw, 700px)', height: 'min(68vw, 700px)', background: 'radial-gradient(circle, rgba(71,200,245,0.085) 0%, rgba(71,200,245,0.04) 32%, rgba(71,200,245,0.012) 55%, transparent 70%)', animation: 'auroraFloat1 24s ease-in-out infinite' }}
        />
        <div
          className="absolute rounded-full aurora"
          style={{ bottom: '-20%', right: '-12%', width: 'min(62vw, 640px)', height: 'min(62vw, 640px)', background: 'radial-gradient(circle, rgba(107,63,160,0.11) 0%, rgba(107,63,160,0.05) 32%, rgba(107,63,160,0.015) 55%, transparent 70%)', animation: 'auroraFloat2 30s ease-in-out infinite' }}
        />
        {/* Slow rotating halo behind the two panels */}
        <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 contact-halo" />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <ScrollReveal>
        <span className="text-electric-cyan text-xs font-black tracking-[0.4em] uppercase mb-4 block drop-shadow-[0_0_15px_rgba(71,200,245,0.6)]">
          {landing ? 'ΔΩΡΕΑΝ ΡΑΝΤΕΒΟΥ' : lang === 'el' ? 'ΕΠΙΚΟΙΝΩΝΙΑ' : 'CONTACT'}
        </span>
        <h2 className="text-4xl md:text-6xl font-black font-display mb-5 text-white">
          {landing ? 'Ας ξεκινήσουμε τη σελίδα σας' : lang === 'el' ? 'Ας Συνεργαστούμε' : "Let's Collaborate"}
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed">
          {landing
            ? 'Κλείστε μια δωρεάν 15λεπτη κλήση στο ημερολόγιο ή αφήστε μας τα στοιχεία σας και σας καλούμε εμείς. Χωρίς καμία δέσμευση — και χωρίς προκαταβολή.'
            : lang === 'el'
            ? 'Στείλτε μας δύο λόγια ή κλείστε απευθείας μια δωρεάν 15λεπτη κλήση — ό,τι σας βολεύει. Απαντάμε την ίδια μέρα.'
            : 'Send us a few words or book a free 15-minute call directly — whichever suits you. We reply the same day.'}
        </p>
        </ScrollReveal>

        {/* Form | Booking — two equal panels side by side on desktop, stacked on phones.
            Both cards stretch to the same height; the booking box fills whatever is left
            under its intro so the two bottoms always line up. */}
        <div className="grid gap-8 lg:grid-cols-2 items-stretch mb-16">
          {/* Form */}
          <ScrollReveal direction="left" className="h-full w-full">
          <div className="glass-panel contact-card p-8 md:p-10 rounded-3xl text-left h-full flex flex-col">
            {sent ? (
              <div id="lead-step2" className="flex flex-col h-full scroll-mt-24">
                <div className="flex gap-1.5 mb-5" aria-hidden="true">
                  <span className="h-1.5 flex-1 rounded-full bg-electric-cyan" />
                  <span className="h-1.5 flex-1 rounded-full bg-electric-cyan/25 overflow-hidden"><span className="block h-full w-1/2 rounded-full bg-electric-cyan" /></span>
                </div>
                <p className="flex items-center gap-2.5 text-sm font-bold text-electric-cyan mb-4" role="status">
                  <span className="w-7 h-7 rounded-full bg-[#0EC673] text-white flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>
                  </span>
                  {S2.got}
                </p>
                <h3 className="text-2xl md:text-3xl font-black text-white font-display mb-3 leading-tight">{S2.h1} <span className="text-electric-cyan">{S2.h2}</span> {S2.h3}</h3>
                <p className="text-gray-400 mb-6">{S2.sub}</p>
                <div className="rounded-2xl border border-electric-cyan/20 bg-electric-cyan/[0.06] p-5 mb-6">
                  <p className="text-[11px] font-black tracking-[0.14em] uppercase text-electric-cyan mb-3">{S2.next}</p>
                  <ol className="space-y-3">
                    {S2.steps.map((t, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-gray-200">
                        <span className="w-5 h-5 mt-0.5 rounded-full bg-electric-cyan/20 text-electric-cyan text-[11px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <p className="lg:hidden text-center text-electric-cyan font-bold text-sm mb-4">{S2.below}</p>
                <div className="flex gap-4 rounded-2xl border border-[#0EC673]/35 bg-[#0EC673]/[0.08] p-5">
                  <span className="w-10 h-10 rounded-xl bg-[#0EC673]/15 text-[#3EE39A] flex items-center justify-center shrink-0" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </span>
                  <div>
                    <p className="font-black text-white text-base leading-snug mb-1.5">{S2.laterH}</p>
                    <p className="text-sm text-gray-200 leading-relaxed">{S2.later}</p>
                  </div>
                </div>
              </div>
            ) : (<>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-xl bg-electric-cyan/10 border border-electric-cyan/20 text-electric-cyan flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white font-display">{landing ? 'Σας καλούμε εμείς' : lang === 'el' ? 'Εκδήλωση Ενδιαφέροντος' : 'Express Interest'}</h3>
            </div>
            <p className="text-gray-400 mb-8">{landing ? 'Αφήστε όνομα, τηλέφωνο και ειδικότητα — σας καλούμε την ίδια μέρα για να δούμε τι θέλετε στη σελίδα σας.' : lang === 'el' ? 'Συμπληρώστε τη φόρμα και θα επικοινωνήσουμε μαζί σας μέσω email ή τηλεφώνου εντός της ίδιας ημέρας.' : 'Fill out the form and we will contact you via email or phone within the same day.'}</p>
            <form action="/api/lead" method="POST" onSubmit={landing ? handleLandingSubmit : handleSubmit} className="space-y-5 flex-grow flex flex-col">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="cf-name" className="block text-xs font-bold text-electric-cyan mb-2 uppercase tracking-wider">{lang === 'el' ? 'Όνομα / Επωνυμία' : 'Name / Company'}</label>
                  <input id="cf-name" type="text" name="name" required autoComplete="name" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="cf-phone" className="block text-xs font-bold text-electric-cyan mb-2 uppercase tracking-wider">{lang === 'el' ? 'Τηλέφωνο' : 'Phone Number'}</label>
                  <input id="cf-phone" type="tel" name="phone" required autoComplete="tel" className={inputCls} />
                </div>
              </div>
              {landing ? (
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="cf-email" className="block text-xs font-bold text-electric-cyan mb-2 uppercase tracking-wider">Email</label>
                    <input id="cf-email" type="email" name="email" required autoComplete="email" inputMode="email" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="cf-prof" className="block text-xs font-bold text-electric-cyan mb-2 uppercase tracking-wider">Ειδικότητα</label>
                    <input id="cf-prof" ref={profRef} type="text" name="profession" required placeholder="π.χ. Ψυχολόγος" autoComplete="organization-title" className={inputCls} />
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="cf-email" className="block text-xs font-bold text-electric-cyan mb-2 uppercase tracking-wider">Email</label>
                  <input id="cf-email" type="email" name="email" required autoComplete="email" className={inputCls} />
                </div>
              )}
              <div className="flex-grow flex flex-col">
                <label htmlFor="cf-message" className="block text-xs font-bold text-electric-cyan mb-2 uppercase tracking-wider">{landing ? 'Μήνυμα (προαιρετικό)' : lang === 'el' ? 'Μήνυμα / Υπηρεσία που σας ενδιαφέρει' : 'Message / Service of Interest'}</label>
                <textarea id="cf-message" name="message" rows={landing ? 4 : 5} required={!landing} placeholder={landing ? 'π.χ. μια ιστοσελίδα που σας αρέσει, ή πότε να σας καλέσουμε' : undefined} className={`${inputCls} flex-grow ${landing ? 'min-h-[120px]' : 'min-h-[150px]'} resize-none`}></textarea>
              </div>
              <input type="text" name="_gotcha" tabIndex="-1" autoComplete="off" className="hidden" aria-hidden="true" />
              <div className="mt-auto pt-1">
                <button
                  type="submit"
                  disabled={sent}
                  className="btn-premium w-full py-4 bg-electric-cyan text-[#050608] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_24px_rgba(71,200,245,0.35)] hover:shadow-[0_0_44px_rgba(255,255,255,0.5)] disabled:opacity-70 disabled:cursor-default"
                >
                  {sent ? (lang === 'el' ? 'Εστάλη ✓' : 'Sent ✓') : landing ? 'Θέλω τη δωρεάν σελίδα μου' : (lang === 'el' ? 'Αποστολή' : 'Send')}
                </button>
                {status && <p className="mt-4 text-center text-electric-cyan font-bold text-sm">{status}</p>}
                <p className="mt-4 text-center text-[11px] text-gray-500 leading-relaxed">
                  {landing ? (
                    <>Τα στοιχεία σας χρησιμοποιούνται για να σας απαντήσουμε και για να μετράμε τις διαφημίσεις μας στη Meta. <a href="/privacy-policy" className="underline hover:text-gray-300">Πολιτική απορρήτου</a></>
                  ) : lang === 'el'
                    ? 'Τα στοιχεία σας χρησιμοποιούνται μόνο για να σας απαντήσουμε.'
                    : 'Your details are used only to reply to you.'}
                </p>
              </div>
            </form>
            </>)}
          </div>
          </ScrollReveal>

          {/* Booking (our own /rantevou page) */}
          <ScrollReveal direction="right" delay={100} className="h-full w-full">
          <div className={`glass-panel contact-card p-8 md:p-10 rounded-3xl text-left flex flex-col h-full overflow-hidden ${sent ? 'ring-2 ring-electric-cyan/60' : ''}`}>
             <div className="flex items-center gap-3 mb-4">
               <span className="w-10 h-10 rounded-xl bg-electric-cyan/10 border border-electric-cyan/20 text-electric-cyan flex items-center justify-center shrink-0">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
               </span>
               <h3 className="text-2xl md:text-3xl font-black text-white font-display">{sent ? (lang === 'en' && !landing ? 'Pick a day and time' : 'Διαλέξτε μέρα και ώρα') : landing ? 'Κλείστε ραντεβού μόνοι σας' : lang === 'el' ? 'Κλείστε Ραντεβού' : 'Book a Call'}</h3>
             </div>
             <p className="text-gray-400 mb-8">{lang === 'el' ? 'Επιλέξτε την ημέρα και ώρα που σας εξυπηρετεί για μια δωρεάν 15λεπτη συμβουλευτική κλήση.' : 'Choose the day and time that suits you for a free 15-minute consultation call.'}</p>
             {/* Our booking page in «embed» mode. It reports its own height, so the box always fits it:
                 no inner scrollbar, nothing cut off, on every screen. */}
             <div id={CAL_ID} className="w-full flex-grow rounded-xl bg-white relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]" style={{ minHeight: calH }}>
                {wantCal && (
                  <iframe
                    key={lang === 'en' && !landing ? 'en' : 'el'}
                    ref={calRef}
                    src={`/rantevou/?embed=1&fit=1${lang === 'en' && !landing ? '&lang=en' : ''}`}
                    title={lang === 'en' && !landing ? 'Book a free intro call' : 'Κλείστε δωρεάν κλήση γνωριμίας'}
                    onLoad={sendPrefill}
                    className="block w-full border-0"
                    style={{ height: calH }}
                  />
                )}
             </div>
          </div>
          </ScrollReveal>
        </div>

        {/* Contact tiles — Email + the three social profiles, one symmetric row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {tiles.map((t, i) => (
            <ScrollReveal key={t.key} direction="up" delay={i * 90} className="h-full">
              <a
                href={t.href}
                target={t.external ? '_blank' : undefined}
                rel={t.external ? 'noopener noreferrer' : undefined}
                className="group glass-panel card-sweep p-6 md:p-8 rounded-3xl h-full block transition-all duration-300 hover:bg-electric-cyan/5"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-electric-cyan/10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-electric-cyan group-hover:bg-electric-cyan group-hover:text-[#050608] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  {t.icon}
                </div>
                <h3 className="text-lg md:text-xl font-black mb-1.5 text-white">{t.title}</h3>
                <p className="text-electric-cyan font-bold tracking-wide text-sm break-all">{t.sub}</p>
              </a>
            </ScrollReveal>
          ))}
        </div>

        {/* Ads landing: a way back to the full site with every service (Angelo, 11 Oct 2026) */}
        {landing && (
          <ScrollReveal delay={120} className="mt-12">
            <a
              href="https://advonmedia.com/"
              className="btn-premium inline-flex items-center gap-3 px-8 py-4 border-2 border-electric-cyan/60 text-electric-cyan font-black text-sm md:text-base uppercase tracking-[0.1em] rounded-xl hover:bg-electric-cyan hover:text-[#050608] transition-all duration-300"
            >
              Δείτε όλες τις υπηρεσίες μας
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <p className="mt-3 text-gray-500 text-sm">Online ραντεβού, κριτικές Google, AI βοηθός, social media και άλλα, στο advonmedia.com</p>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

