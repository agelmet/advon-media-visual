// app/diaxeirisi-social-media/page.jsx
'use client';
import { useLangStore } from '@/store/langStore';
import ScrollReveal from '@/components/ScrollReveal';

export default function SocialMedia() {
  const { lang } = useLangStore();

  const features = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-electric-cyan"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>,
      titleEl: 'Επαγγελματικά Posts', titleEn: 'Professional Posts',
      bodyEl: 'Χρησιμοποιούμε premium εργαλεία (Photoshop, Canva Pro, κ.α.) για ελκυστικά εικαστικά που τραβούν την προσοχή.',
      bodyEn: 'We use premium tools (Photoshop, Canva Pro, etc.) for attractive visuals that grab attention.',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-electric-cyan"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>,
      titleEl: 'Έρευνα Hashtags', titleEn: 'Hashtag Research',
      bodyEl: 'Στοχευμένα hashtags ανάλογα με την τοποθεσία και το κοινό σας για μέγιστη οργανική εμβέλεια.',
      bodyEn: 'Targeted hashtags depending on location and audience for maximum organic reach.',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-electric-cyan"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
      titleEl: 'Κειμενογραφία', titleEn: 'Copywriting',
      bodyEl: 'Δημιουργία κειμένων (copy) που πείθουν τον αναγνώστη και τον οδηγούν σε δράση (π.χ. ραντεβού).',
      bodyEn: 'Creating copy that persuades the reader and drives them to action (e.g. appointment).',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-electric-cyan"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>,
      titleEl: 'Profile Optimization', titleEn: 'Profile Optimization',
      bodyEl: 'Βελτιστοποίηση του βιογραφικού (bio) σας ώστε να είναι 100% επαγγελματικό και ξεκάθαρο.',
      bodyEn: 'Optimization of your bio so it is 100% professional and clear.',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-electric-cyan"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>,
      titleEl: 'Μηνιαίες Αναφορές', titleEn: 'Monthly Reports',
      bodyEl: 'Πλήρης ανάλυση της ανάπτυξης των ακολούθων και της αλληλεπίδρασης.',
      bodyEn: 'Complete analysis of follower growth and interaction.',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-electric-cyan"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
      titleEl: 'Ευκολία & Άνεση', titleEn: 'Convenience',
      bodyEl: 'Απλώς μας στέλνετε φωτογραφίες. Τα υπόλοιπα τα αναλαμβάνουμε όλα εμείς.',
      bodyEn: 'Just send us photos. We handle absolutely everything else.',
    },
  ];

  return (
    <section className="py-32 pt-16 max-w-7xl mx-auto px-6">
      {/* Header */}
      <ScrollReveal className="text-center mb-16">
        <span className="section-label">{lang === 'el' ? 'Υπηρεσία' : 'Service'}</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display mb-8 text-white tracking-tight">
          {lang === 'el' ? 'Διαχείριση Social Media' : 'Social Media Management'}
        </h1>
        <div className="inline-flex items-end gap-3 bg-electric-cyan/8 border border-electric-cyan/30 px-6 py-3 rounded-full badge-scan">
          <span className="text-3xl font-black text-white">87€</span>
          <span className="text-electric-cyan font-bold mb-1 uppercase tracking-widest text-sm">
            {lang === 'el' ? '/ΜΗΝΑ' : '/MONTH'}
          </span>
        </div>
      </ScrollReveal>

      {/* Main Panel */}
      <ScrollReveal delay={60}>
        <div className="glass-panel p-8 md:p-12 rounded-3xl text-gray-300 leading-relaxed font-body text-lg mb-20 shadow-[0_0_50px_rgba(71,200,245,0.08)]">

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <span className="bg-gradient-to-r from-electric-cyan to-blue-500 text-[#050a0e] font-black px-6 py-3 rounded-xl inline-flex items-center gap-3 shadow-[0_0_20px_rgba(71,200,245,0.35)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="8" width="18" height="14" rx="2"/><path d="M12 5a3 3 0 1 0-3 3"/><path d="M15 8a3 3 0 1 0-3-3"/><path d="M12 8v14"/><path d="M3 15h18"/></svg>
              {lang === 'el' ? 'Δωρεάν Δοκιμή 7 Ημερών' : '7-Day Free Trial'}
            </span>
            <span className="bg-white/8 text-white font-bold px-6 py-3 rounded-xl inline-flex items-center gap-3 border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              No contracts — cancel anytime
            </span>
          </div>

          <h2 className="text-3xl font-black text-white mb-10 font-display text-center uppercase tracking-wide">
            {lang === 'el' ? 'Τι Περιλαμβάνει το Πακέτο' : 'What The Package Includes'}
          </h2>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map(({ icon, titleEl, titleEn, bodyEl, bodyEn }, i) => (
              <ScrollReveal key={titleEn} delay={i * 60} direction="up">
                <div className="bg-[#050a0e]/50 border border-white/5 p-6 rounded-2xl hover:border-electric-cyan/30 hover:bg-[#050a0e]/80 transition-all duration-300 group h-full">
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
                    {icon}
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">{lang === 'el' ? titleEl : titleEn}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{lang === 'el' ? bodyEl : bodyEn}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="cyber-divider my-12" />

          <ScrollReveal delay={60}>
            <h3 className="text-2xl font-bold text-white mb-8 font-display text-center">
              {lang === 'el' ? 'Γιατί να Μας Επιλέξετε' : 'Why Choose Us'}
            </h3>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {[
                { titleEl: 'Χωρίς Ρίσκο', titleEn: 'Risk-Free', bodyEl: 'Εγγύηση επιστροφής χρημάτων αν δεν μείνετε 100% ικανοποιημένοι.', bodyEn: 'Money-back guarantee if you are not 100% satisfied.' },
                { titleEl: 'Προσωποποιημένη Υπηρεσία', titleEn: 'Personalized Service', bodyEl: 'Προσαρμόζουμε τα πάντα στην ταυτότητα της επιχείρησής σας.', bodyEn: 'We adapt everything to the identity of your business.' },
                { titleEl: 'Περιορισμένες Θέσεις', titleEn: 'Limited Spots', bodyEl: 'Λαμβάνουμε λίγους πελάτες τον μήνα για να διατηρούμε κορυφαία ποιότητα.', bodyEn: 'We take few clients per month to maintain top quality.' },
                { titleEl: 'Καμία Δέσμευση', titleEn: 'No Commitment', bodyEl: 'Σταματάτε οποιαδήποτε στιγμή, χωρίς μακροχρόνια συμβόλαια.', bodyEn: 'Cancel anytime, no long-term contracts.' },
              ].map(({ titleEl, titleEn, bodyEl, bodyEn }) => (
                <div key={titleEn} className="flex items-start gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-electric-cyan mt-1 shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                  <div>
                    <h4 className="font-bold text-white mb-1">{lang === 'el' ? titleEl : titleEn}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{lang === 'el' ? bodyEl : bodyEn}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* CTA strip */}
          <ScrollReveal delay={80}>
            <div className="p-8 rounded-2xl bg-gradient-to-r from-electric-cyan/10 to-transparent border-l-4 border-electric-cyan text-left flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-xl font-black text-white mb-2">{lang === 'el' ? 'Αποτέλεσμα: Περισσότεροι Πελάτες' : 'Result: More Clients'}</h3>
                <p className="text-gray-300 text-sm">{lang === 'el' ? 'Δείτε αυξημένη αλληλεπίδραση και ένα προφίλ που δημιουργεί εμπιστοσύνη με 87€/μήνα.' : 'See increased interaction and a profile that builds trust for 87€/month.'}</p>
              </div>
              <a href="mailto:angelos@advonmedia.com" className="btn-premium px-8 py-3.5 bg-electric-cyan text-[#050a0e] font-bold rounded-xl whitespace-nowrap hover:bg-white transition-colors text-sm uppercase tracking-wide">
                {lang === 'el' ? 'Στείλτε Email' : 'Send Email'}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </ScrollReveal>
    </section>
  );
}
