// app/diaxeirisi-social-media/page.jsx
// «Διαχείριση Social Media» — signature element: a phone-framed profile
// whose post grid fills in on scroll, plus a content-calendar strip.
// All copy is unchanged — this was a design pass only.
'use client';
import { useLangStore } from '@/store/langStore';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';
import { CtaBand } from '@/components/service/blocks';

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

  const whyUs = [
    { titleEl: 'Χωρίς Ρίσκο', titleEn: 'Risk-Free', bodyEl: 'Εγγύηση επιστροφής χρημάτων αν δεν μείνετε 100% ικανοποιημένοι.', bodyEn: 'Money-back guarantee if you are not 100% satisfied.' },
    { titleEl: 'Προσωποποιημένη Υπηρεσία', titleEn: 'Personalized Service', bodyEl: 'Προσαρμόζουμε τα πάντα στην ταυτότητα της επιχείρησής σας.', bodyEn: 'We adapt everything to the identity of your business.' },
    { titleEl: 'Περιορισμένες Θέσεις', titleEn: 'Limited Spots', bodyEl: 'Λαμβάνουμε λίγους πελάτες τον μήνα για να διατηρούμε κορυφαία ποιότητα.', bodyEn: 'We take few clients per month to maintain top quality.' },
    { titleEl: 'Καμία Δέσμευση', titleEn: 'No Commitment', bodyEl: 'Σταματάτε οποιαδήποτε στιγμή, χωρίς μακροχρόνια συμβόλαια.', bodyEn: 'Cancel anytime, no long-term contracts.' },
  ];

  return (
    <>
      {/* ─── HERO — split: oversized H1 + intro | profile phone ─── */}
      <section className="pt-16 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-[radial-gradient(ellipse,rgba(71,200,245,0.09)_0%,transparent_65%)] blur-[80px]" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-14 lg:gap-10 items-center">
            <div>
              <ScrollReveal>
                <span className="section-label">{lang === 'el' ? 'Υπηρεσία' : 'Service'}</span>
                <h1
                  className="font-black font-display mb-8 text-white tracking-tight leading-[1.06]"
                  style={{ fontSize: 'clamp(2.6rem, 6vw, 4.3rem)' }}
                >
                  {lang === 'el' ? 'Διαχείριση Social Media' : 'Social Media Management'}
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={130}>
                <p
                  className="font-display font-bold text-gray-100 leading-[1.35]"
                  style={{ fontSize: 'clamp(1.35rem, 2.4vw, 1.8rem)' }}
                >
                  {lang === 'el'
                    ? 'Επαγγελματικά posts και συνέπεια στα προφίλ σας — χωρίς να χρειάζεται να το σκέφτεστε εσείς.'
                    : 'Professional posts and consistency on your profiles — without you having to think about it.'}
                </p>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={120} direction="scale">
              <ProfilePhone />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── FEATURES — «Τι Περιλαμβάνει το Πακέτο» as an icon grid ─── */}
      <section className="py-24 bg-[#0a1418]/60 border-y border-electric-cyan/8 backdrop-blur-sm relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center mb-14">
            <span className="section-label">{lang === 'el' ? 'Παροχές' : 'What You Get'}</span>
            <h2 className="text-3xl md:text-4xl font-black font-display mb-3 text-white tracking-tight">
              {lang === 'el' ? 'Τι Περιλαμβάνει το Πακέτο' : 'What The Package Includes'}
            </h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, titleEl, titleEn, bodyEl, bodyEn }, i) => (
              <ScrollReveal key={titleEn} delay={i * 60} direction={i % 3 === 0 ? 'left' : i % 3 === 2 ? 'right' : 'up'} className="h-full">
                <TiltCard className="h-full">
                  <div className="glass-panel card-sweep p-6 rounded-2xl group h-full">
                    <div className="w-12 h-12 rounded-xl bg-electric-cyan/10 border border-electric-cyan/20 flex items-center justify-center icon-glow mb-4 group-hover:bg-electric-cyan/20 transition-colors duration-300">
                      {icon}
                    </div>
                    <h4 className="text-white font-bold text-lg mb-2">{lang === 'el' ? titleEl : titleEn}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{lang === 'el' ? bodyEl : bodyEn}</p>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONSISTENCY — content calendar | «Γιατί να Μας Επιλέξετε» ─── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute rounded-full" style={{ top: '-10%', right: '-12%', width: 'min(45vw, 460px)', height: 'min(45vw, 460px)', background: 'radial-gradient(circle, rgba(107,63,160,0.1) 0%, transparent 65%)', filter: 'blur(90px)' }} />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <ScrollReveal direction="left">
              <ContentCalendar lang={lang} />
            </ScrollReveal>
            <div>
              <ScrollReveal>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-10 font-display">
                  {lang === 'el' ? 'Γιατί να Μας Επιλέξετε' : 'Why Choose Us'}
                </h3>
              </ScrollReveal>
              <div className="space-y-8">
                {whyUs.map(({ titleEl, titleEn, bodyEl, bodyEn }, i) => (
                  <ScrollReveal key={titleEn} delay={i * 90}>
                    <div className="flex items-start gap-5">
                      <span className="font-display font-black text-electric-cyan/60 text-xl leading-none pt-0.5 select-none">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h4 className="font-bold text-white mb-1">{lang === 'el' ? titleEl : titleEn}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{lang === 'el' ? bodyEl : bodyEn}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RESULT + TRIAL — the closing band ─── */}
      <section className="pb-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal direction="scale">
            <div className="relative overflow-hidden rounded-3xl border border-electric-cyan/30 bg-gradient-to-br from-electric-cyan/8 via-transparent to-transparent p-8 md:p-12 text-center shadow-[0_0_40px_rgba(71,200,245,0.1)]">
              <div aria-hidden="true" className="absolute -right-24 -top-24 w-72 h-72 bg-electric-cyan/8 rounded-full blur-[90px] pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 font-display">
                  {lang === 'el' ? 'Αποτέλεσμα: Περισσότεροι Πελάτες' : 'Result: More Clients'}
                </h3>
                <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                  {lang === 'el' ? 'Δείτε αυξημένη αλληλεπίδραση και ένα προφίλ που δημιουργεί εμπιστοσύνη.' : 'See increased interaction and a profile that builds trust.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                  <span className="badge-scan bg-gradient-to-r from-electric-cyan to-blue-500 text-[#050a0e] font-black px-6 py-3 rounded-xl inline-flex items-center gap-3 shadow-[0_0_20px_rgba(71,200,245,0.35)]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="8" width="18" height="14" rx="2"/><path d="M12 5a3 3 0 1 0-3 3"/><path d="M15 8a3 3 0 1 0-3-3"/><path d="M12 8v14"/><path d="M3 15h18"/></svg>
                    {lang === 'el' ? 'Δωρεάν Δοκιμή 7 Ημερών' : '7-Day Free Trial'}
                  </span>
                  <span className="bg-white/8 text-white font-bold px-6 py-3 rounded-xl inline-flex items-center gap-3 border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    No contracts — cancel anytime
                  </span>
                </div>
                <a href="mailto:angelos@advonmedia.com" className="btn-premium inline-block px-10 py-4 bg-electric-cyan text-[#050a0e] font-black rounded-xl hover:bg-white transition-colors text-sm uppercase tracking-[0.1em]" style={{ boxShadow: '0 0 30px rgba(71,200,245,0.4), 0 4px 20px rgba(0,0,0,0.4)' }}>
                  {lang === 'el' ? 'Στείλτε Email' : 'Send Email'}
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

/* ─── Signature: the profile, phone-framed — its grid fills in on scroll ─── */
function ProfilePhone() {
  const tiles = [
    'from-electric-cyan/40 to-void-purple/40',
    'from-void-purple/45 to-electric-cyan/25',
    'from-electric-cyan/30 to-cyber-lime/20',
    'from-white/15 to-electric-cyan/30',
    'from-electric-cyan/45 to-void-purple/30',
    'from-void-purple/40 to-white/10',
    'from-cyber-lime/20 to-electric-cyan/35',
    'from-electric-cyan/25 to-void-purple/45',
    'from-void-purple/30 to-electric-cyan/40',
  ];
  return (
    <div className="relative max-w-[300px] mx-auto">
      <div aria-hidden="true" className="absolute inset-0 bg-electric-cyan/8 blur-[90px] rounded-full pointer-events-none" />

      <div className="relative z-10 rounded-[2.75rem] border border-white/12 bg-[#0a1418] p-2.5 shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_50px_rgba(71,200,245,0.12)]">
        <div className="rounded-[2.25rem] bg-[#050a0e] overflow-hidden">
          <div className="flex justify-center pt-2.5 pb-1">
            <div className="w-20 h-1.5 rounded-full bg-white/10" />
          </div>
          <div className="px-4 pt-3 pb-5">
            {/* Profile header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-electric-cyan via-void-purple to-cyber-lime">
                <div className="w-full h-full rounded-full bg-[#0a1418] border-2 border-[#050a0e]" />
              </div>
              <div className="flex-1 flex justify-around">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="text-center space-y-1.5">
                    <div className="h-2.5 w-8 rounded-full bg-white/25 mx-auto" />
                    <div className="h-1.5 w-10 rounded-full bg-white/8 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
            {/* Bio — professional and clear */}
            <div className="space-y-1.5 mb-4">
              <div className="h-2 w-24 rounded-full bg-white/20" />
              <div className="h-1.5 w-40 rounded-full bg-white/10" />
              <div className="h-1.5 w-32 rounded-full bg-white/10" />
            </div>
            {/* Highlights */}
            <div className="flex gap-3 mb-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-9 h-9 rounded-full border border-white/12 bg-white/4" />
              ))}
            </div>
            {/* The grid — filled in, post by post */}
            <div className="grid grid-cols-3 gap-1">
              {tiles.map((g, i) => (
                <ScrollReveal key={i} delay={200 + i * 90} direction="scale">
                  <div className={`aspect-square rounded-[4px] bg-gradient-to-br ${g} border border-white/6 flex items-center justify-center text-white/20`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Signature: the month, posted with consistency ─── */
function ContentCalendar({ lang }) {
  const days = lang === 'el' ? ['Δ', 'Τ', 'Τ', 'Π', 'Π', 'Σ', 'Κ'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const postDays = [1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26];
  return (
    <div className="glass-panel rounded-3xl p-7 md:p-9 max-w-md mx-auto lg:mx-0">
      <div className="flex items-center justify-between mb-6">
        <div className="h-2.5 w-24 rounded-full bg-white/20" />
        <div className="flex items-center gap-1.5 text-[0.58rem] font-black tracking-[0.15em] uppercase text-electric-cyan">
          <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan" />
          {lang === 'el' ? 'Δημοσίευση' : 'Post day'}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map((d, i) => (
          <div key={i} className="text-center text-[0.58rem] font-black text-gray-600">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 28 }).map((_, i) => {
          const isPost = postDays.includes(i);
          return (
            <ScrollReveal key={i} delay={100 + i * 20} direction="fade">
              <div
                className={`aspect-square rounded-lg flex items-center justify-center ${
                  isPost
                    ? 'bg-electric-cyan/12 border border-electric-cyan/35'
                    : 'bg-white/3 border border-white/5'
                }`}
              >
                {isPost && <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan shadow-[0_0_8px_rgba(71,200,245,0.8)]" />}
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
