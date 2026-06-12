// app/google-reviews-nfc/page.jsx
'use client';
import { useLangStore } from '@/store/langStore';
import ScrollReveal from '@/components/ScrollReveal';

export default function NFC() {
  const { lang } = useLangStore();

  return (
    <section className="py-32 pt-40 max-w-6xl mx-auto px-6">
      {/* Header */}
      <ScrollReveal className="text-center mb-16">
        <span className="section-label">{lang === 'el' ? 'Υπηρεσία' : 'Service'}</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display mb-8 text-white tracking-tight">
          {lang === 'el' ? 'Βάση Αξιολογήσεων' : 'Reviews Base'}
        </h1>
        <div className="inline-flex items-end gap-3 bg-electric-cyan/8 border border-electric-cyan/30 px-6 py-3 rounded-full badge-scan">
          <span className="text-3xl font-black text-white">25€</span>
          <span className="text-electric-cyan font-bold mb-1 uppercase tracking-widest text-sm">
            {lang === 'el' ? 'ΕΦΑΠΑΞ' : 'ONE-TIME'}
          </span>
        </div>
      </ScrollReveal>

      {/* Main Panel */}
      <ScrollReveal delay={80}>
        <div className="glass-panel p-8 md:p-12 rounded-3xl text-gray-300 leading-relaxed font-body text-lg mb-20 shadow-[0_0_50px_rgba(71,200,245,0.08)]">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-white font-display leading-tight">
                {lang === 'el'
                  ? 'Ανεβείτε στην κορυφή της Google και αποκτήστε 150 νέες αξιολογήσεις σε 3 μήνες.'
                  : 'Reach the top of Google and gain 150 new reviews in 3 months.'}
              </h2>

              <div className="space-y-6">
                {[
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-electric-cyan w-6 h-6"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
                    titleEl: 'Η Πρώτη Εντύπωση', titleEn: 'The First Impression',
                    bodyEl: 'Το πρώτο που κάνει κάποιος όταν αναζητεί μια επιχείρηση είναι να δει τις κριτικές. Αν έχετε ελάχιστες, χάνετε πελάτες από τον ανταγωνισμό.',
                    bodyEn: 'The first thing someone does when looking for a business is to check its reviews. With too few, you lose clients to competitors.',
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-electric-cyan w-6 h-6"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>,
                    titleEl: 'Ο Αλγόριθμος της Google', titleEn: 'The Google Algorithm',
                    bodyEl: 'Η Google παρέχει τα πιο έγκυρα αποτελέσματα δίνοντας τεράστια σημασία στον όγκο και τη συχνότητα των νέων αξιολογήσεων (SEO).',
                    bodyEn: 'Google prioritizes valid results, giving massive weight to the volume and frequency of new reviews (SEO).',
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-electric-cyan w-6 h-6"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/><path d="M8 8v4"/><path d="M12 7v5"/><path d="M16 6v6"/></svg>,
                    titleEl: 'Μηδενική Τριβή', titleEn: 'Zero Friction',
                    bodyEl: 'Οι πελάτες συνήθως βαριούνται να ψάξουν το προφίλ σας. Με ένα απλό άγγιγμα του κινητού στη βάση, μεταφέρονται κατευθείαν στη φόρμα 5-αστέρων!',
                    bodyEn: 'Clients usually forget to search for your profile. With a simple tap on the stand, they are directed straight to the 5-star form!',
                  },
                ].map(({ icon, titleEl, titleEn, bodyEl, bodyEn }) => (
                  <div key={titleEn} className="flex gap-4">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:border-electric-cyan/30 transition-colors">
                      {icon}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-xl mb-1">{lang === 'el' ? titleEl : titleEn}</h4>
                      <p className="text-gray-400 text-base leading-relaxed">{lang === 'el' ? bodyEl : bodyEn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GIF */}
            <div className="relative w-full flex items-center justify-center">
              <div className="absolute inset-0 bg-electric-cyan/8 blur-[80px] rounded-full" />
              <img
                src="https://assets.cdn.filesafe.space/61icdoMiJ2pHklO6mmKW/media/6724bf7a4eb48eb705a7b389.gif"
                alt="NFC Tech"
                className="relative z-10 w-full max-w-md mx-auto rounded-3xl border border-electric-cyan/35 shadow-[0_20px_60px_rgba(71,200,245,0.25)] transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Math panel */}
          <ScrollReveal delay={100} className="mt-16">
            <div className="bg-electric-cyan/5 border border-electric-cyan/20 p-8 rounded-2xl text-center">
              <h3 className="text-2xl font-black text-electric-cyan mb-4">{lang === 'el' ? 'Τα Μαθηματικά της Επιτυχίας' : 'The Math of Success'}</h3>
              <p className="text-white text-lg max-w-3xl mx-auto italic leading-relaxed">
                {lang === 'el'
                  ? '"Αν έχετε 8 πελάτες ανά ημέρα (x20 εργάσιμες = 160 τον μήνα). Αν λιγότεροι από τους μισούς (έστω 50) σας αφήσουν μια αξιολόγηση μέσω της ανέπαφης βάσης, σε 3 μήνες θα έχετε 150 νέες κορυφαίες αξιολογήσεις!"'
                  : '"If you have 8 clients per day (x20 working days = 160 per month). If less than half (say 50) leave a review via the contactless base, in 3 months you\'ll have 150 new top-tier reviews!"'}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </ScrollReveal>
    </section>
  );
}
