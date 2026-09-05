// components/Contact.jsx
'use client';
import { useState, useEffect } from 'react';
import { useLangStore } from '@/store/langStore';
import ScrollReveal from '@/components/ScrollReveal';

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

export default function Contact() {
  const { lang } = useLangStore();
  const [status, setStatus] = useState('');

  // Calendar injection.
  //
  // NOTE: Zoho's own snippet wraps the init in `window.onload = ...`. That is fine on a
  // plain HTML page but silently does nothing here — this is a client component, so by
  // the time it mounts the window load event has usually already fired and the handler
  // never runs, leaving an empty box. We hook the script's own load event instead, and
  // handle the case where the script is already in the DOM from a previous mount.
  useEffect(() => {
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
  }, [lang]); // re-render the widget if the language changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(lang === 'el' ? 'Αποστολή...' : 'Sending...');
    const form = e.target;
    try {
      const response = await fetch(form.action, { method: form.method, body: new FormData(form), headers: { 'Accept': 'application/json' }});
      if (response.ok) {
        setStatus(lang === 'el' ? 'Ευχαριστούμε! Το μήνυμά σας εστάλη επιτυχώς.' : 'Thank you! Your message has been sent successfully.');
        form.reset();
      } else {
        setStatus(lang === 'el' ? 'Ωχ! Υπήρξε ένα πρόβλημα.' : 'Oops! There was a problem.');
      }
    } catch (err) {
      setStatus(lang === 'el' ? 'Ωχ! Υπήρξε ένα πρόβλημα.' : 'Oops! There was a problem.');
    }
  };

  return (
    <section id="contact" className="py-32 relative border-t border-electric-cyan/10 bg-gradient-to-b from-[#050a0e] to-[#0a1418] z-20 overflow-hidden">
      {/* Ambient depth layers */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute rounded-full"
          style={{ top: '-10%', left: '-8%', width: 'min(55vw, 560px)', height: 'min(55vw, 560px)', background: 'radial-gradient(circle, rgba(71,200,245,0.09) 0%, transparent 65%)', filter: 'blur(80px)', animation: 'auroraFloat1 24s ease-in-out infinite' }}
        />
        <div
          className="absolute rounded-full"
          style={{ bottom: '-12%', right: '-6%', width: 'min(50vw, 520px)', height: 'min(50vw, 520px)', background: 'radial-gradient(circle, rgba(107,63,160,0.12) 0%, transparent 65%)', filter: 'blur(90px)', animation: 'auroraFloat2 30s ease-in-out infinite' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <ScrollReveal>
        <span className="text-electric-cyan text-xs font-black tracking-[0.4em] uppercase mb-4 block drop-shadow-[0_0_15px_rgba(71,200,245,0.6)]">
          {lang === 'el' ? 'ΕΠΙΚΟΙΝΩΝΙΑ' : 'CONTACT'}
        </span>
        <h2 className="text-4xl md:text-6xl font-black font-display mb-16 text-white">
          {lang === 'el' ? 'Ας Συνεργαστούμε' : "Let's Collaborate"}
        </h2>
        </ScrollReveal>

        {/* The booking widget needs its own full-width row.
            Zoho's embed switches from "calendar, then times underneath" to
            "calendar | times side by side" somewhere between 760px and 900px of iframe
            width — measured, not guessed. In the old two-up grid this panel was only
            ~600px, so visitors had to pick a date and then scroll down to discover the
            times, which is where people were dropping out. Full width gives it ~1150px
            inside the padding on desktop, comfortably past the breakpoint. Below md it
            stacks anyway, which is the correct mobile layout regardless. */}
        <div className="grid gap-8 mb-16">
          {/* Form */}
          <ScrollReveal direction="left" className="h-full w-full max-w-3xl mx-auto">
          <div className="glass-panel p-8 md:p-10 rounded-3xl text-left h-full flex flex-col">
            <h3 className="text-2xl md:text-3xl font-black mb-6 text-white font-display">{lang === 'el' ? 'Εκδήλωση Ενδιαφέροντος' : 'Express Interest'}</h3>
            <p className="text-gray-400 mb-8">{lang === 'el' ? 'Συμπληρώστε τη φόρμα και ένας εκπρόσωπός μας θα επικοινωνήσει μαζί σας μέσω email ή τηλεφώνου εντός της ίδιας ημέρας.' : 'Fill out the form and a representative will contact you via email or phone within the same day.'}</p>
            <form action="https://formspree.io/f/xkopgoaj" method="POST" onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col">
              <div>
                <label className="block text-sm font-bold text-electric-cyan mb-2 uppercase tracking-wider">{lang === 'el' ? 'Όνομα / Επωνυμία' : 'Name / Company'}</label>
                <input type="text" name="name" required className="w-full bg-[#050a0e]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-electric-cyan mb-2 uppercase tracking-wider">Email</label>
                <input type="email" name="email" required className="w-full bg-[#050a0e]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-electric-cyan mb-2 uppercase tracking-wider">{lang === 'el' ? 'Τηλέφωνο' : 'Phone Number'}</label>
                <input type="tel" name="phone" required className="w-full bg-[#050a0e]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors" />
              </div>
              <div className="flex-grow">
                <label className="block text-sm font-bold text-electric-cyan mb-2 uppercase tracking-wider">{lang === 'el' ? 'Μήνυμα / Υπηρεσία που σας ενδιαφέρει' : 'Message / Service of Interest'}</label>
                <textarea name="message" rows="4" required className="w-full h-full min-h-[120px] bg-[#050a0e]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors resize-none"></textarea>
              </div>
              <div className="mt-auto">
                <button type="submit" className="w-full py-4 bg-electric-cyan text-[#050a0e] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(71,200,245,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]">
                  {lang === 'el' ? 'Αποστολή' : 'Send'}
                </button>
                {status && <p className="mt-4 text-center text-electric-cyan font-bold">{status}</p>}
              </div>
            </form>
          </div>
          </ScrollReveal>

          {/* Zoho Bookings Calendar */}
          <ScrollReveal direction="right" delay={100} className="h-full">
          <div className="glass-panel p-8 md:p-10 rounded-3xl text-left flex flex-col h-full overflow-hidden">
             <h3 className="text-2xl md:text-3xl font-black mb-6 text-white font-display">{lang === 'el' ? 'Κλείστε Ραντεβού' : 'Book Appointment'}</h3>
             <p className="text-gray-400 mb-8">{lang === 'el' ? 'Επιλέξτε την ημέρα και ώρα που σας εξυπηρετεί για μια δωρεάν συμβουλευτική κλήση.' : 'Choose the day and time that suits you for a free consultation call.'}</p>
             {/* Same reasoning as the old Trafft box: keep a FIXED height rather than
                 letting the widget grow to its full content height. Inside this clipped
                 panel a tall iframe leaves nothing scrollable, so wheel/touch over the
                 calendar does nothing. At a fixed height the iframe scrolls its own
                 content natively. Zoho sets inline width/height on the iframe it injects,
                 so the [&_iframe] rules force it to fill the box on every breakpoint. */}
             <div className="w-full flex-grow rounded-xl bg-white relative min-h-[620px] lg:min-h-[760px] overflow-hidden">
                <div
                  id={ZOHO_PARENT_ID}
                  className="absolute inset-0 w-full h-full [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:!border-0"
                >
                </div>
             </div>
          </div>
          </ScrollReveal>
        </div>

        {/* Contact Tiles */}
        <div className="grid md:grid-cols-2 gap-8">
          <ScrollReveal direction="up" className="h-full">
          <a href="mailto:angelos@advonmedia.com" className="group glass-panel card-sweep p-8 rounded-3xl h-full block transition-all duration-300 hover:bg-electric-cyan/5">
            <div className="w-16 h-16 bg-electric-cyan/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-electric-cyan group-hover:bg-electric-cyan group-hover:text-[#050a0e] transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><rect width="24" height="16" x="0" y="4" rx="2" ry="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <h3 className="text-xl font-black mb-2 text-white">Email</h3>
            <p className="text-electric-cyan font-bold tracking-wide">angelos@advonmedia.com</p>
          </a>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={120} className="h-full">
          <a href="https://www.instagram.com/advon_media" target="_blank" rel="noopener noreferrer" className="group glass-panel card-sweep p-8 rounded-3xl h-full block transition-all duration-300 hover:bg-electric-cyan/5">
            <div className="w-16 h-16 bg-electric-cyan/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-electric-cyan group-hover:bg-electric-cyan group-hover:text-[#050a0e] transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </div>
            <h3 className="text-xl font-black mb-2 text-white">Instagram</h3>
            <p className="text-electric-cyan font-bold tracking-wide">@advon_media</p>
          </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}