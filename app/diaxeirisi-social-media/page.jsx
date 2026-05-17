// app/diaxeirisi-social-media/page.jsx
'use client';
import { useLangStore } from '@/store/langStore';

export default function SocialMedia() {
  const { lang } = useLangStore();

  return (
    <section className="py-32 pt-40 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <span className="text-electric-cyan text-xs font-bold tracking-[0.3em] uppercase mb-4 block">{lang === 'el' ? 'Υπηρεσία' : 'Service'}</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display mb-6 text-white">{lang === 'el' ? 'Διαχείριση Social Media' : 'Social Media Management'}</h1>
        <div className="inline-flex items-end gap-3 bg-electric-cyan/10 border border-electric-cyan/30 px-6 py-3 rounded-full">
          <span className="text-3xl font-black text-white">87€</span>
          <span className="text-electric-cyan font-bold mb-1 uppercase tracking-widest text-sm">{lang === 'el' ? '/ΜΗΝΑ' : '/MONTH'}</span>
        </div>
      </div>
      
      <div className="glass-panel p-8 md:p-12 rounded-3xl text-gray-300 leading-relaxed font-body text-lg mb-20 shadow-[0_0_50px_rgba(71,200,245,0.1)]">
        
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <span className="bg-gradient-to-r from-electric-cyan to-blue-500 text-[#050a0e] font-black px-6 py-3 rounded-xl inline-flex items-center gap-3 shadow-[0_0_20px_rgba(71,200,245,0.4)]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="8" width="18" height="14" rx="2"/><path d="M12 5a3 3 0 1 0-3 3"/><path d="M15 8a3 3 0 1 0-3-3"/><path d="M12 8v14"/><path d="M3 15h18"/></svg> 
            {lang === 'el' ? 'Δωρεάν Δοκιμή 7 Ημερών' : '7-Day Free Trial'}
          </span>
          <span className="bg-white/10 text-white font-bold px-6 py-3 rounded-xl inline-flex items-center gap-3 border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg> 
            No contracts - cancel anytime
          </span>
        </div>

        <h2 className="text-3xl font-black text-white mb-10 font-display text-center uppercase tracking-wide">
          {lang === 'el' ? 'Τι Περιλαμβανει το Πακετο' : 'What The Package Includes'}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#050a0e]/50 border border-white/5 p-6 rounded-2xl hover:border-electric-cyan/30 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-electric-cyan mb-4"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            <h4 className="text-white font-bold text-lg mb-2">{lang === 'el' ? 'Επαγγελματικά Posts' : 'Professional Posts'}</h4>
            <p className="text-sm text-gray-400">{lang === 'el' ? 'Χρησιμοποιούμε premium εργαλεία (Photoshop, Canva Pro, κ.α.) για ελκυστικά εικαστικά που τραβούν την προσοχή.' : 'We use premium tools (Photoshop, Canva Pro, etc.) for attractive visuals that grab attention.'}</p>
          </div>
          <div className="bg-[#050a0e]/50 border border-white/5 p-6 rounded-2xl hover:border-electric-cyan/30 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-electric-cyan mb-4"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>
            <h4 className="text-white font-bold text-lg mb-2">{lang === 'el' ? 'Έρευνα Hashtags' : 'Hashtag Research'}</h4>
            <p className="text-sm text-gray-400">{lang === 'el' ? 'Στοχευμένα hashtags ανάλογα με την τοποθεσία και το κοινό σας για μέγιστη οργανική εμβέλεια.' : 'Targeted hashtags depending on location and audience for maximum organic reach.'}</p>
          </div>
          <div className="bg-[#050a0e]/50 border border-white/5 p-6 rounded-2xl hover:border-electric-cyan/30 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-electric-cyan mb-4"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
            <h4 className="text-white font-bold text-lg mb-2">{lang === 'el' ? 'Κειμενογραφία' : 'Copywriting'}</h4>
            <p className="text-sm text-gray-400">{lang === 'el' ? 'Δημιουργία κειμένων (copy) που πείθουν τον αναγνώστη και τον οδηγούν σε δράση (π.χ. ραντεβού).' : 'Creating copy that persuades the reader and drives them to action (e.g. appointment).'}</p>
          </div>
          <div className="bg-[#050a0e]/50 border border-white/5 p-6 rounded-2xl hover:border-electric-cyan/30 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-electric-cyan mb-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
            <h4 className="text-white font-bold text-lg mb-2">{lang === 'el' ? 'Profile Optimization' : 'Profile Optimization'}</h4>
            <p className="text-sm text-gray-400">{lang === 'el' ? 'Βελτιστοποίηση του βιογραφικού (bio) σας ώστε να είναι 100% επαγγελματικό και ξεκάθαρο.' : 'Optimization of your bio so it is 100% professional and clear.'}</p>
          </div>
          <div className="bg-[#050a0e]/50 border border-white/5 p-6 rounded-2xl hover:border-electric-cyan/30 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-electric-cyan mb-4"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
            <h4 className="text-white font-bold text-lg mb-2">{lang === 'el' ? 'Μηνιαίες Αναφορές' : 'Monthly Reports'}</h4>
            <p className="text-sm text-gray-400">{lang === 'el' ? 'Πλήρης ανάλυση της ανάπτυξης των ακολούθων και της αλληλεπίδρασης.' : 'Complete analysis of follower growth and interaction.'}</p>
          </div>
          <div className="bg-[#050a0e]/50 border border-white/5 p-6 rounded-2xl hover:border-electric-cyan/30 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-electric-cyan mb-4"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <h4 className="text-white font-bold text-lg mb-2">{lang === 'el' ? 'Ευκολία & Άνεση' : 'Convenience'}</h4>
            <p className="text-sm text-gray-400">{lang === 'el' ? 'Απλώς μας στέλνετε φωτογραφίες. Τα υπόλοιπα τα αναλαμβάνουμε όλα εμείς.' : 'Just send us photos. We handle absolutely everything else.'}</p>
          </div>
        </div>

        <hr className="border-white/10 my-12" />
        
        <h3 className="text-2xl font-bold text-white mb-8 font-display text-center">{lang === 'el' ? 'Γιατί να Μας Επιλέξετε' : 'Why Choose Us'}</h3>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="flex items-start gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-electric-cyan mt-1 shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
            <div>
              <h4 className="font-bold text-white mb-1">{lang === 'el' ? 'Χωρίς Ρίσκο' : 'Risk-Free'}</h4>
              <p className="text-gray-400 text-sm">{lang === 'el' ? 'Εγγύηση επιστροφής χρημάτων αν δεν μείνετε 100% ικανοποιημένοι.' : 'Money-back guarantee if you are not 100% satisfied.'}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-electric-cyan mt-1 shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
            <div>
              <h4 className="font-bold text-white mb-1">{lang === 'el' ? 'Προσωποποιημένη Υπηρεσία' : 'Personalized Service'}</h4>
              <p className="text-gray-400 text-sm">{lang === 'el' ? 'Προσαρμόζουμε τα πάντα στην ταυτότητα της επιχείρησής σας.' : 'We adapt everything to the identity of your business.'}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-electric-cyan mt-1 shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
            <div>
              <h4 className="font-bold text-white mb-1">{lang === 'el' ? 'Περιορισμένες Θέσεις' : 'Limited Spots'}</h4>
              <p className="text-gray-400 text-sm">{lang === 'el' ? 'Λαμβάνουμε λίγους πελάτες τον μήνα για να διατηρούμε κορυφαία ποιότητα.' : 'We take few clients per month to maintain top quality.'}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-electric-cyan mt-1 shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
            <div>
              <h4 className="font-bold text-white mb-1">{lang === 'el' ? 'Καμία Δέσμευση' : 'No Commitment'}</h4>
              <p className="text-gray-400 text-sm">{lang === 'el' ? 'Σταματάτε οποιαδήποτε στιγμή, χωρίς μακροχρόνια συμβόλαια.' : 'Cancel anytime, no long-term contracts.'}</p>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-gradient-to-r from-electric-cyan/10 to-transparent border-l-4 border-electric-cyan text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-xl font-black text-white mb-2">{lang === 'el' ? 'Αποτέλεσμα: Περισσότεροι Πελάτες' : 'Result: More Clients'}</h3>
            <p className="text-gray-300 text-sm">{lang === 'el' ? 'Δείτε αυξημένη αλληλεπίδραση και ένα προφίλ που δημιουργεί εμπιστοσύνη με 87€/μήνα.' : 'See increased interaction and a profile that builds trust for 87€/month.'}</p>
          </div>
          <a href="mailto:angelos@advonmedia.com" className="px-8 py-3 bg-electric-cyan text-[#050a0e] font-bold rounded-xl whitespace-nowrap hover:bg-white transition-colors">
            {lang === 'el' ? 'Στείλτε Email' : 'Send Email'}
          </a>
        </div>
      </div>
    </section>
  );
}