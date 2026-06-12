// app/kataskevi-istoselidas/page.jsx
'use client';
import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useLangStore } from '@/store/langStore';
import { portfolioData } from '@/lib/data';
import ScrollReveal from '@/components/ScrollReveal';

const ITEMS_PER_PAGE = 36;

export default function WebsiteCreation() {
  const { lang } = useLangStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [fading, setFading] = useState(false);
  const portfolioRef = useRef(null);

  const totalPages = Math.ceil(portfolioData.length / ITEMS_PER_PAGE);
  const visibleItems = portfolioData.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const goToPage = useCallback((newPage) => {
    if (newPage === currentPage || fading) return;
    setFading(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setFading(false);
      // Scroll to top of portfolio section smoothly
      portfolioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 280);
  }, [currentPage, fading]);

  return (
    <>
      {/* ─── SERVICE INFO SECTION ─── */}
      <section className="py-32 pt-40 max-w-6xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <span className="section-label">{lang === 'el' ? 'Υπηρεσία' : 'Service'}</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display mb-6 text-white tracking-tight">
            {lang === 'el' ? 'Κατασκευή Ιστοσελίδας' : 'Website Creation'}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {lang === 'el'
              ? 'Αναβαθμίστε την επαγγελματική σας παρουσία στο διαδίκτυο και μετατρέψτε τους επισκέπτες σας σε πελάτες.'
              : 'Upgrade your professional online presence and turn your visitors into customers.'}
          </p>
        </ScrollReveal>

        {/* Domain Bonus Banner */}
        <ScrollReveal delay={80} className="mb-16">
          <div className="relative overflow-hidden bg-gradient-to-r from-electric-cyan/12 to-transparent border border-electric-cyan/35 rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(71,200,245,0.12)] flex flex-col md:flex-row items-center gap-8 group glow-border-hover">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-electric-cyan/8 rounded-full blur-[80px] pointer-events-none" />
            <div className="bg-electric-cyan/15 p-5 rounded-2xl text-electric-cyan shrink-0 ring-1 ring-electric-cyan/40 group-hover:scale-110 transition-transform duration-300 icon-glow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><rect x="3" y="8" width="18" height="14" rx="2"/><path d="M12 5a3 3 0 1 0-3 3"/><path d="M15 8a3 3 0 1 0-3-3"/><path d="M12 8v14"/><path d="M3 15h18"/></svg>
            </div>
            <div className="text-center md:text-left z-10">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-3 font-display">
                {lang === 'el' ? 'Bonus: Το Domain Name Περιλαμβάνεται!' : 'Bonus: Domain Name Included!'}
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                {lang === 'el'
                  ? 'Το επιθυμητό σας domain name παρέχεται εντελώς δωρεάν και συμπεριλαμβάνεται στην τιμή της μηνιαίας συνδρομής. Χωρίς κανένα κρυφό κόστος ή επιπλέον χρεώσεις.'
                  : 'Your desired domain name is provided completely free and included in the monthly subscription price. No hidden costs or extra charges.'}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Info Panel */}
        <ScrollReveal delay={60}>
          <div className="glass-panel p-8 md:p-12 rounded-3xl text-gray-300 leading-relaxed font-body text-lg mb-20 shadow-[0_0_50px_rgba(71,200,245,0.08)]">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-12 pb-8 border-b border-white/8 text-center md:text-left">
              <div>
                <span className="text-electric-cyan text-xs font-bold tracking-widest uppercase mb-2 block">{lang === 'el' ? 'ΚΟΣΤΟΣ ΚΑΤΑΣΚΕΥΗΣ' : 'CONSTRUCTION COST'}</span>
                <div className="flex flex-col md:flex-row md:items-end gap-3">
                  <span className="text-6xl font-black text-white tracking-tight" style={{ textShadow: '0 0 30px rgba(255,255,255,0.2)' }}>
                    {lang === 'el' ? 'ΔΩΡΕΑΝ' : 'FREE'}
                  </span>
                  <span className="text-electric-cyan font-bold mb-2 md:mb-1.5 bg-electric-cyan/10 px-3 py-1 rounded-lg border border-electric-cyan/30">
                    {lang === 'el' ? 'ΜΟΝΟ 10.83€/μήνα hosting' : 'ONLY 10.83€/mo hosting'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10 mb-16">
              {[
                {
                  Icon: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-electric-cyan shrink-0 mt-1"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>,
                  titleEl: 'Γιατί είναι Δωρεάν;', titleEn: 'Why is it Free?',
                  bodyEl: 'Δεν είναι κάποιο μάρκετινγκ τρικ, όντως η κατασκευή είναι εντελώς δωρεάν. Το κάνουμε αυτό γιατί θέλουμε να προσθέσουμε όσες περισσότερες ιστοσελίδες γίνεται στο πορτφόλιο μας.',
                  bodyEn: 'Construction is completely free. We do this to add websites to our portfolio to establish ourselves in the market.',
                },
                {
                  Icon: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-electric-cyan shrink-0 mt-1"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>,
                  titleEl: 'Το Μοναδικό Κόστος', titleEn: 'The Only Cost',
                  bodyEl: 'Το μόνο κόστος για εσάς είναι η φιλοξενία (hosting) στο διαδίκτυο. Είναι 10.83€/μήνα, ποσό που θα πληρώνατε ούτως ή άλλως.',
                  bodyEn: 'The only cost for you is the internet hosting. It is 10.83€/month, an amount you would pay anyway.',
                },
                {
                  Icon: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-electric-cyan shrink-0 mt-1"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
                  titleEl: 'Σημασία για το SEO', titleEn: 'Importance for SEO',
                  bodyEl: 'Μια καλά σχεδιασμένη ιστοσελίδα σας βοηθά να κατακτήσετε υψηλότερες θέσεις στις μηχανές αναζήτησης.',
                  bodyEn: 'A well-designed website helps you achieve higher positions in search engines.',
                },
                {
                  Icon: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-electric-cyan shrink-0 mt-1"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>,
                  titleEl: 'Η Ψηφιακή σας Βιτρίνα', titleEn: 'Your Digital Storefront',
                  bodyEl: 'Λειτουργεί ως η ψηφιακή σας βιτρίνα, ενισχύοντας την επαγγελματική σας εικόνα.',
                  bodyEn: 'It acts as your digital storefront, enhancing your professional image.',
                },
              ].map(({ Icon, titleEl, titleEn, bodyEl, bodyEn }) => (
                <div key={titleEn} className="flex gap-4">
                  <Icon />
                  <div>
                    <h4 className="text-white font-bold text-xl mb-2">{lang === 'el' ? titleEl : titleEn}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{lang === 'el' ? bodyEl : bodyEn}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h3 className="text-3xl font-bold text-white mb-4 font-display text-center">
                {lang === 'el' ? 'Πανεύκολη Διαδικασία Κατασκευής' : 'Super Easy Creation Process'}
              </h3>
              <p className="text-center text-gray-400 mb-10 text-base">
                {lang === 'el' ? 'Για να μειώσουμε τον χρόνο επένδυσης σας στην κατασκευή, χρειαζόμαστε από εσάς μόνο:' : 'To minimize your time investment, we only need from you:'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { num: '1', titleEl: 'Φωτογραφίες', titleEn: 'Photos', bodyEl: 'Δική σας επαγγελματική, του χώρου ή/και του προσωπικού.', bodyEn: 'Your own professional photo, your space, and/or staff.' },
                  { num: '2', titleEl: 'Βασικά Κείμενα', titleEn: 'Basic Texts', bodyEl: 'Μικρά κείμενα για την επιχείρηση. Εμείς αναλαμβάνουμε την τελική κειμενογραφία.', bodyEn: 'Short texts about the business. We handle the final copywriting.' },
                  { num: '3', titleEl: 'Υπηρεσίες', titleEn: 'Services', bodyEl: 'Λίστα με τις υπηρεσίες σας επιγραμματικά.', bodyEn: 'A bulleted list of your services.' },
                  { num: '4', titleEl: 'Στοιχεία Επικοινωνίας', titleEn: 'Contact Details', bodyEl: 'Τηλέφωνο, email, διεύθυνση, και ωράριο λειτουργίας.', bodyEn: 'Phone, email, address, and operating hours.' },
                  { num: '5', titleEl: 'Λογότυπο', titleEn: 'Logo', bodyEl: 'Ένα λογότυπο αν έχετε, αλλιώς δημιουργούμε εμείς ένα εντελώς δωρεάν για εσάς.', bodyEn: 'A logo if you have one, otherwise we will design one for free.' },
                ].map(({ num, titleEl, titleEn, bodyEl, bodyEn }) => (
                  <div key={num} className="bg-white/4 border border-white/8 p-6 rounded-2xl hover:bg-white/8 hover:border-electric-cyan/25 transition-all duration-300 group">
                    <div className="w-10 h-10 bg-electric-cyan/15 rounded-full flex items-center justify-center text-electric-cyan font-black mb-4 group-hover:bg-electric-cyan group-hover:text-[#050a0e] transition-all duration-300 text-sm">
                      {num}
                    </div>
                    <h4 className="text-white font-bold mb-2">{lang === 'el' ? titleEl : titleEn}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{lang === 'el' ? bodyEl : bodyEn}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── PORTFOLIO SECTION ─── */}
      <section
        id="portfolio"
        ref={portfolioRef}
        className="py-24 bg-[#0a1418]/60 border-t border-electric-cyan/8 backdrop-blur-sm scroll-mt-24"
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">

          {/* Section header */}
          <ScrollReveal className="text-center mb-14">
            <span className="section-label">{lang === 'el' ? 'Πορτφόλιο' : 'Portfolio'}</span>
            <h2 className="text-4xl md:text-5xl font-black font-display mb-3 text-white tracking-tight">
              {lang === 'el' ? 'Δείτε μερικές από τις Δουλειές μας' : 'Check Out Some Of Our Work'}
            </h2>
            <p className="text-gray-500 text-sm">
              {lang === 'el' ? 'Σελίδα' : 'Page'} {currentPage + 1} / {totalPages}
            </p>
          </ScrollReveal>

          {/* ── DESKTOP grid (hidden on mobile) ── */}
          <div className="hidden md:block">
            <div
              className="grid grid-cols-6 gap-3 mb-10"
              style={{
                opacity: fading ? 0 : 1,
                transform: fading ? 'translateY(8px)' : 'translateY(0)',
                transition: 'opacity 0.28s ease, transform 0.28s ease',
              }}
            >
              {visibleItems.map((item, index) => (
                <PortfolioCard key={`${currentPage}-${index}`} item={item} lang={lang} />
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 pt-4">
                {/* Prev */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 0 || fading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-electric-cyan/30 text-electric-cyan text-sm font-bold hover:bg-electric-cyan/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m15 18-6-6 6-6"/></svg>
                  {lang === 'el' ? 'Προηγούμενη' : 'Previous'}
                </button>

                {/* Dot indicators */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i)}
                      className="rounded-full transition-all duration-300 focus:outline-none"
                      style={{
                        width: i === currentPage ? '32px' : '8px',
                        height: '8px',
                        background: i === currentPage ? '#47c8f5' : 'rgba(255,255,255,0.2)',
                        boxShadow: i === currentPage ? '0 0 10px #47c8f5' : 'none',
                      }}
                      aria-label={`Page ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Page counter */}
                <span className="text-gray-500 text-sm font-mono tabular-nums select-none">
                  {currentPage + 1} / {totalPages}
                </span>

                {/* Next */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages - 1 || fading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-electric-cyan/30 text-electric-cyan text-sm font-bold hover:bg-electric-cyan/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {lang === 'el' ? 'Επόμενη' : 'Next'}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            )}
          </div>

          {/* ── MOBILE list (hidden on desktop, all items, no pagination) ── */}
          <div className="md:hidden grid grid-cols-1 gap-5">
            {portfolioData.map((item, index) => (
              <PortfolioCard key={index} item={item} lang={lang} mobile />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Shared card component ─── */
function PortfolioCard({ item, lang, mobile = false }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden rounded-2xl border border-white/8 block bg-[#050a0e] glow-border-hover shadow-lg"
      style={{ aspectRatio: mobile ? '16/9' : '4/3' }}
    >
      <Image
        src={item.image}
        alt={item.name}
        fill
        sizes={mobile
          ? '100vw'
          : '(max-width: 1600px) 17vw, 267px'}
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050a0e] via-[#050a0e]/55 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-4">
        <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
          <p className="text-sm font-black text-white mb-2 leading-tight line-clamp-2">
            {lang === 'el' ? item.name : item.nameEn}
          </p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-electric-cyan/20 border border-electric-cyan/50 rounded-full text-[9px] font-black text-electric-cyan uppercase tracking-wider">
            {lang === 'el' ? 'ΠΡΟΒΟΛΗ' : 'VIEW SITE'}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
          </span>
        </div>
      </div>
    </a>
  );
}
