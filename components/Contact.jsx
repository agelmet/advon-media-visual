// components/Contact.jsx
'use client';
import { useState, useEffect } from 'react';
import { useLangStore } from '@/store/langStore';
import ScrollReveal from '@/components/ScrollReveal';
import { SOCIALS, SocialIcon } from '@/components/Socials';
import { metaTrack } from '@/components/Analytics';

// Zoho Bookings inline embed.
//
// Both values come from Zoho itself (Event Types > Website Meeting > Share >
// Embed as Widget > Inline Embed), not from a copy-pasted blog snippet:
//   - the script is Zoho's own embed CDN (nimbuspop.com is Zoho's, despite the name)
//   - ZOHO_BOOKING_URL is the SERVICE-specific url, so visitors land straight on the
//     calendar instead of first having to pick "Website Meeting" from a list of one.
//     The account-wide url (.../portal-embed#/advonmedia) adds that pointless extra click.
const ZOHO_EMBED_SCRIPT = 'https://bookings.nimbuspop.com/assets/embed.js';
const ZOHO_BOOKING_URL =
  'https://advonmedia.zohobookings.eu/portal-embed#/264312000000038046';
const ZOHO_SCRIPT_ID = 'zoho-bookings-embed';
const ZOHO_PARENT_ID = 'zoho-booking-inline';

const inputCls =
  'w-full bg-[#050a0e]/60 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-electric-cyan focus:shadow-[0_0_0_3px_rgba(71,200,245,0.15),0_0_24px_rgba(71,200,245,0.18)] transition-all duration-300';

export default function Contact() {
  const { lang } = useLangStore();
  const [status, setStatus] = useState('');
  const [sent, setSent] = useState(false);

  // Calendar injection.
  //
  // NOTE: Zoho's own snippet wraps the init in `window.onload = ...`. That is fine on a
  // plain HTML page but silently does nothing here — this is a client component, so by
  // the time it mounts the window load event has usually already fired and the handler
  // never runs, leaving an empty box. We hook the script's own load event instead, and
  // handle the case where the script is already in the DOM from a previous mount.
  // The calendar is injected when the contact section is about 900px from the screen —
  // on a first paint nobody can see it yet, so the page no longer waits for Zoho.
  const [wantZoho, setWantZoho] = useState(false);
  useEffect(() => {
    if (wantZoho) return;
    const el = document.getElementById(ZOHO_PARENT_ID);
    if (!el || !('IntersectionObserver' in window)) { setWantZoho(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setWantZoho(true); io.disconnect(); } }, { rootMargin: '900px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [wantZoho]);

  useEffect(() => {
    if (!wantZoho) return;
    let cancelled = false;

    const render = () => {
      if (cancelled) return;
      const parent = document.getElementById(ZOHO_PARENT_ID);
      if (!parent || !window.Bookings) return;
      parent.innerHTML = ''; // drop any iframe from a previous render
      window.Bookings.inlineEmbed({
        url: ZOHO_BOOKING_URL,
        parent: `#${ZOHO_PARENT_ID}`,
        height: '600px',
      });
    };

    let script = document.getElementById(ZOHO_SCRIPT_ID);

    if (window.Bookings) {
      render();
    } else if (script) {
      script.addEventListener('load', render);
    } else {
      script = document.createElement('script');
      script.id = ZOHO_SCRIPT_ID;
      script.src = ZOHO_EMBED_SCRIPT;
      script.async = true;
      script.addEventListener('load', render);
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (script) script.removeEventListener('load', render);
      const parent = document.getElementById(ZOHO_PARENT_ID);
      if (parent) parent.innerHTML = '';
    };
  }, [lang, wantZoho]); // re-render the widget if the language changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(lang === 'el' ? 'Αποστολή...' : 'Sending...');
    const form = e.target;
    try {
      const response = await fetch(form.action, { method: form.method, body: new FormData(form), headers: { 'Accept': 'application/json' }});
      if (response.ok) {
        setStatus(lang === 'el' ? 'Ευχαριστούμε! Το μήνυμά σας εστάλη επιτυχώς — θα επικοινωνήσουμε μαζί σας εντός της ημέρας.' : 'Thank you! Your message has been sent — we will contact you within the day.');
        setSent(true);
        metaTrack('Lead', { content_name: 'contact-form' });
        form.reset();
      } else {
        setStatus(lang === 'el' ? 'Ωχ! Υπήρξε ένα πρόβλημα. Στείλτε μας email στο angelos@advonmedia.com.' : 'Oops! There was a problem. Email us at angelos@advonmedia.com.');
      }
    } catch (err) {
      setStatus(lang === 'el' ? 'Ωχ! Υπήρξε ένα πρόβλημα. Στείλτε μας email στο angelos@advonmedia.com.' : 'Oops! There was a problem. Email us at angelos@advonmedia.com.');
    }
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
    <section id="contact" className="py-32 relative border-t border-electric-cyan/10 bg-gradient-to-b from-[#050a0e] to-[#0a1418] z-20 overflow-hidden">
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
          {lang === 'el' ? 'ΕΠΙΚΟΙΝΩΝΙΑ' : 'CONTACT'}
        </span>
        <h2 className="text-4xl md:text-6xl font-black font-display mb-5 text-white">
          {lang === 'el' ? 'Ας Συνεργαστούμε' : "Let's Collaborate"}
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed">
          {lang === 'el'
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
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-xl bg-electric-cyan/10 border border-electric-cyan/20 text-electric-cyan flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white font-display">{lang === 'el' ? 'Εκδήλωση Ενδιαφέροντος' : 'Express Interest'}</h3>
            </div>
            <p className="text-gray-400 mb-8">{lang === 'el' ? 'Συμπληρώστε τη φόρμα και θα επικοινωνήσουμε μαζί σας μέσω email ή τηλεφώνου εντός της ίδιας ημέρας.' : 'Fill out the form and we will contact you via email or phone within the same day.'}</p>
            <form action="https://formspree.io/f/xkopgoaj" method="POST" onSubmit={handleSubmit} className="space-y-5 flex-grow flex flex-col">
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
              <div>
                <label htmlFor="cf-email" className="block text-xs font-bold text-electric-cyan mb-2 uppercase tracking-wider">Email</label>
                <input id="cf-email" type="email" name="email" required autoComplete="email" className={inputCls} />
              </div>
              <div className="flex-grow flex flex-col">
                <label htmlFor="cf-message" className="block text-xs font-bold text-electric-cyan mb-2 uppercase tracking-wider">{lang === 'el' ? 'Μήνυμα / Υπηρεσία που σας ενδιαφέρει' : 'Message / Service of Interest'}</label>
                <textarea id="cf-message" name="message" rows="5" required className={`${inputCls} flex-grow min-h-[150px] resize-none`}></textarea>
              </div>
              <input type="text" name="_gotcha" tabIndex="-1" autoComplete="off" className="hidden" aria-hidden="true" />
              <div className="mt-auto pt-1">
                <button
                  type="submit"
                  disabled={sent}
                  className="btn-premium w-full py-4 bg-electric-cyan text-[#050a0e] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_24px_rgba(71,200,245,0.35)] hover:shadow-[0_0_44px_rgba(255,255,255,0.5)] disabled:opacity-70 disabled:cursor-default"
                >
                  {sent ? (lang === 'el' ? 'Εστάλη ✓' : 'Sent ✓') : (lang === 'el' ? 'Αποστολή' : 'Send')}
                </button>
                {status && <p className="mt-4 text-center text-electric-cyan font-bold text-sm">{status}</p>}
                <p className="mt-4 text-center text-[11px] text-gray-500 leading-relaxed">
                  {lang === 'el'
                    ? 'Τα στοιχεία σας χρησιμοποιούνται μόνο για να σας απαντήσουμε.'
                    : 'Your details are used only to reply to you.'}
                </p>
              </div>
            </form>
          </div>
          </ScrollReveal>

          {/* Zoho Bookings Calendar */}
          <ScrollReveal direction="right" delay={100} className="h-full w-full">
          <div className="glass-panel contact-card p-8 md:p-10 rounded-3xl text-left flex flex-col h-full overflow-hidden">
             <div className="flex items-center gap-3 mb-4">
               <span className="w-10 h-10 rounded-xl bg-electric-cyan/10 border border-electric-cyan/20 text-electric-cyan flex items-center justify-center shrink-0">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
               </span>
               <h3 className="text-2xl md:text-3xl font-black text-white font-display">{lang === 'el' ? 'Κλείστε Ραντεβού' : 'Book a Call'}</h3>
             </div>
             <p className="text-gray-400 mb-8">{lang === 'el' ? 'Επιλέξτε την ημέρα και ώρα που σας εξυπηρετεί για μια δωρεάν 15λεπτη συμβουλευτική κλήση.' : 'Choose the day and time that suits you for a free 15-minute consultation call.'}</p>
             {/* Same reasoning as the old Trafft box: keep a FIXED minimum height rather than
                 letting the widget grow to its full content height. Inside this clipped
                 panel a tall iframe leaves nothing scrollable, so wheel/touch over the
                 calendar does nothing. At a fixed height the iframe scrolls its own
                 content natively. Zoho sets inline width/height on the iframe it injects,
                 so the [&_iframe] rules force it to fill the box on every breakpoint. */}
             <div className="w-full flex-grow rounded-xl bg-white relative min-h-[600px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                <div
                  id={ZOHO_PARENT_ID}
                  className="absolute inset-0 w-full h-full [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:!border-0"
                >
                </div>
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
                <div className="w-14 h-14 md:w-16 md:h-16 bg-electric-cyan/10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-electric-cyan group-hover:bg-electric-cyan group-hover:text-[#050a0e] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  {t.icon}
                </div>
                <h3 className="text-lg md:text-xl font-black mb-1.5 text-white">{t.title}</h3>
                <p className="text-electric-cyan font-bold tracking-wide text-sm break-all">{t.sub}</p>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
