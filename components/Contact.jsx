// components/Contact.jsx
'use client';
import { useState, useEffect } from 'react';
import { useLangStore } from '@/store/langStore';
import ScrollReveal from '@/components/ScrollReveal';

export default function Contact() {
  const { lang } = useLangStore();
  const [status, setStatus] = useState('');

  // Bulletproof Calendar Injection
  useEffect(() => {
    // 1. Remove old script if it exists (prevents duplicate bugs)
    const oldScript = document.getElementById('trafft-script');
    if (oldScript) oldScript.remove();
    
    // 2. Inject fresh script so Trafft finds the div instantly
    const timer = setTimeout(() => {
      const script = document.createElement('script');
      script.id = 'trafft-script';
      script.src = 'https://advonmedia.trafft.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }, 100); // 100ms delay ensures the HTML div is painted first

    return () => clearTimeout(timer);
  }, [lang]); // Re-runs instantly if language changes

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

        <div className="grid md:grid-cols-2 gap-8 mb-16 items-stretch">
          {/* Form */}
          <ScrollReveal direction="left" className="h-full">
          <div className="glass-panel p-8 md:p-10 rounded-3xl text-left h-full flex flex-col">
            <h3 className="text-2xl md:text-3xl font-black mb-6 text-white font-display">{lang === 'el' ? 'Εκδήλωση Ενδιαφέροντος' : 'Express Interest'}</h3>
            <p className="text-gray-400 mb-8">{lang === 'el' ? 'Συμπληρώστε τη φόρμα και ένας εκπρόσωπός μας θα επικοινωνήσει μαζί σας μέσω email ή τηλεφώνου εντός της ίδιας ημέρας.' : 'Fill out the form and a representative will contact you via email or phone within the same day.'}</p>
            <form action="https://formspree.io/f/xkopgoaj" method="POST" onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col">
              <div>
                <label className="block text-sm font-bold text-electric-cyan mb-2 uppercase tracking-wider">{lang === 'el' ? 'Όνομα / Επωνυμία' : 'Name / Company'}</label>
                <input type="text" name="name" required className="w-full bg-[#050a0e]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors cursor-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-electric-cyan mb-2 uppercase tracking-wider">Email</label>
                <input type="email" name="email" required className="w-full bg-[#050a0e]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors cursor-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-electric-cyan mb-2 uppercase tracking-wider">{lang === 'el' ? 'Τηλέφωνο' : 'Phone Number'}</label>
                <input type="tel" name="phone" required className="w-full bg-[#050a0e]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors cursor-none" />
              </div>
              <div className="flex-grow">
                <label className="block text-sm font-bold text-electric-cyan mb-2 uppercase tracking-wider">{lang === 'el' ? 'Μήνυμα / Υπηρεσία που σας ενδιαφέρει' : 'Message / Service of Interest'}</label>
                <textarea name="message" rows="4" required className="w-full h-full min-h-[120px] bg-[#050a0e]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors resize-none cursor-none"></textarea>
              </div>
              <div className="mt-auto">
                <button type="submit" className="w-full py-4 bg-electric-cyan text-[#050a0e] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(71,200,245,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] cursor-none">
                  {lang === 'el' ? 'Αποστολή' : 'Send'}
                </button>
                {status && <p className="mt-4 text-center text-electric-cyan font-bold">{status}</p>}
              </div>
            </form>
          </div>
          </ScrollReveal>

          {/* Working Trafft Calendar */}
          <ScrollReveal direction="right" delay={100} className="h-full">
          <div className="glass-panel p-8 md:p-10 rounded-3xl text-left flex flex-col h-full overflow-hidden">
             <h3 className="text-2xl md:text-3xl font-black mb-6 text-white font-display">{lang === 'el' ? 'Κλείστε Ραντεβού' : 'Book Appointment'}</h3>
             <p className="text-gray-400 mb-8">{lang === 'el' ? 'Επιλέξτε την ημέρα και ώρα που σας εξυπηρετεί για μια δωρεάν συμβουλευτική κλήση.' : 'Choose the day and time that suits you for a free consultation call.'}</p>
             <div className="w-full flex-grow rounded-xl bg-white relative min-h-[500px]">
                <div 
                  className="embedded-booking absolute inset-0 w-full h-full" 
                  data-url="https://advonmedia.trafft.com" 
                  data-query="&t=s&uuid=1003c403-d56e-439b-876a-c563b3127470" 
                  data-employee="aggelos-metrides" 
                  data-lang={lang} 
                  data-autoresize="1" 
                  data-showsidebar="0" 
                  data-showservices="0" 
                  style={{width: '100%', height: '100%'}}>
                </div>
             </div>
          </div>
          </ScrollReveal>
        </div>

        {/* Contact Tiles */}
        <div className="grid md:grid-cols-2 gap-8">
          <ScrollReveal direction="up" className="h-full">
          <a href="mailto:angelos@advonmedia.com" className="group glass-panel card-sweep p-8 rounded-3xl h-full block transition-all duration-300 hover:bg-electric-cyan/5 cursor-none">
            <div className="w-16 h-16 bg-electric-cyan/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-electric-cyan group-hover:bg-electric-cyan group-hover:text-[#050a0e] transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><rect width="24" height="16" x="0" y="4" rx="2" ry="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <h3 className="text-xl font-black mb-2 text-white">Email</h3>
            <p className="text-electric-cyan font-bold tracking-wide">angelos@advonmedia.com</p>
          </a>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={120} className="h-full">
          <a href="https://www.instagram.com/advon_media" target="_blank" rel="noopener noreferrer" className="group glass-panel card-sweep p-8 rounded-3xl h-full block transition-all duration-300 hover:bg-electric-cyan/5 cursor-none">
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