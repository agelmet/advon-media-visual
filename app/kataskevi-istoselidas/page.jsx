// app/kataskevi-istoselidas/page.jsx
'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLangStore } from '@/store/langStore';
import { portfolioData } from '@/lib/data';
import ScrollReveal from '@/components/ScrollReveal';

export default function WebsiteCreation() {
  const { lang } = useLangStore();
  const [billingAnnual, setBillingAnnual] = useState(true);

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

        {/* ─── HOSTING PRICING TOGGLE ─── */}
        <ScrollReveal delay={60} className="mt-4">
          <div className="text-center mb-10">
            <span className="section-label">{lang === 'el' ? 'Φιλοξενία (Hosting)' : 'Hosting'}</span>
            <h2 className="text-3xl md:text-4xl font-black font-display mb-3 text-white tracking-tight">
              {lang === 'el' ? 'Τιμολόγηση Φιλοξενίας' : 'Hosting Pricing'}
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              {lang === 'el' ? 'Επιλέξτε τον τρόπο χρέωσης που σας βολεύει.' : 'Choose the billing cycle that suits you best.'}
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-2 mt-6 p-1.5 rounded-full bg-white/5 border border-white/12">
              <button
                onClick={() => setBillingAnnual(true)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${billingAnnual ? 'bg-electric-cyan text-[#050a0e] shadow-[0_0_16px_rgba(71,200,245,0.35)]' : 'text-gray-400 hover:text-white'}`}
              >
                {lang === 'el' ? 'Ετήσια' : 'Annual'}
              </button>
              <button
                onClick={() => setBillingAnnual(false)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${!billingAnnual ? 'bg-electric-cyan text-[#050a0e] shadow-[0_0_16px_rgba(71,200,245,0.35)]' : 'text-gray-400 hover:text-white'}`}
              >
                {lang === 'el' ? 'Μηνιαία' : 'Monthly'}
              </button>
            </div>
          </div>

          {/* Single card — swaps on toggle */}
          <div className="max-w-md mx-auto">
            {billingAnnual ? (
              /* Annual card */
              <div className="glass-panel rounded-2xl p-8 border-2 border-electric-cyan/60 relative shadow-[0_0_50px_rgba(71,200,245,0.18)]">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-electric-cyan text-[#050a0e] text-[0.6rem] font-black tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(71,200,245,0.5)] whitespace-nowrap">
                  {lang === 'el' ? 'ΚΑΛΥΤΕΡΗ ΤΙΜΗ' : 'BEST VALUE'}
                </div>
                <div className="text-electric-cyan text-xs font-black uppercase tracking-widest mb-4 mt-1">
                  {lang === 'el' ? 'Ετήσια Χρέωση' : 'Annual Billing'}
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-5xl font-black text-white">10.83€</span>
                  <span className="text-gray-500 mb-1.5 text-sm">{lang === 'el' ? '/μήνα' : '/month'}</span>
                </div>
                <p className="text-gray-400 text-sm mb-5">
                  {lang === 'el' ? 'Τιμολογείται ως 130€/χρόνο' : 'Billed as €130/year'}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-electric-cyan/8 border border-electric-cyan/25 rounded-xl px-4 py-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-electric-cyan shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                    <span className="text-electric-cyan font-bold text-sm">
                      {lang === 'el' ? 'Domain name δωρεάν — περιλαμβάνεται' : 'Domain name free — included'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                    <span className="text-gray-300 text-sm font-semibold">
                      {lang === 'el' ? 'Εξοικονομείτε 50€ τον χρόνο' : 'Save €50 per year'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 shrink-0"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    <span className="text-gray-400 text-sm">
                      {lang === 'el' ? 'Ελάχιστη δέσμευση 12 μήνες' : 'Minimum 12-month commitment'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Monthly card */
              <div className="glass-panel rounded-2xl p-8 border-2 border-electric-cyan/60 relative shadow-[0_0_50px_rgba(71,200,245,0.18)]">
                <div className="text-gray-300 text-xs font-black uppercase tracking-widest mb-4">
                  {lang === 'el' ? 'Μηνιαία Χρέωση' : 'Monthly Billing'}
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-5xl font-black text-white">15€</span>
                  <span className="text-gray-500 mb-1.5 text-sm">{lang === 'el' ? '/μήνα' : '/month'}</span>
                </div>
                <p className="text-gray-400 text-sm mb-5">
                  {lang === 'el' ? 'Χρέωση μία φορά τον μήνα' : 'Billed once per month'}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-electric-cyan/8 border border-electric-cyan/25 rounded-xl px-4 py-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-electric-cyan shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                    <span className="text-electric-cyan font-bold text-sm">
                      {lang === 'el' ? 'Domain name δωρεάν — περιλαμβάνεται' : 'Domain name free — included'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                    <span className="text-gray-300 text-sm font-semibold">
                      {lang === 'el' ? '180€/χρόνο με μηνιαία πληρωμή' : '€180/year with monthly payments'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 shrink-0"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    <span className="text-gray-400 text-sm">
                      {lang === 'el' ? 'Ελάχιστη δέσμευση 12 μήνες' : 'Minimum 12-month commitment'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-gray-600 text-xs mt-5">
            {lang === 'el' ? 'Χωρίς κρυφές χρεώσεις · Χωρίς εγκατάσταση · Domain name δωρεάν' : 'No hidden fees · No setup fee · Free domain name'}
          </p>
        </ScrollReveal>

        {/* ─── FUTURE CHANGES POLICY + ADD-ONS ─── */}
        <ScrollReveal delay={80} className="mt-20">
          <div className="text-center mb-10">
            <span className="section-label">{lang === 'el' ? 'Extras' : 'Extras'}</span>
            <h2 className="text-3xl md:text-4xl font-black font-display mb-3 text-white tracking-tight">
              {lang === 'el' ? 'Αλλαγές & Extras' : 'Changes & Extras'}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Future changes policy */}
            <div className="glass-panel rounded-2xl p-7 border border-electric-cyan/20 hover:border-electric-cyan/40 transition-colors duration-300">
              <div className="w-12 h-12 bg-electric-cyan/10 border border-electric-cyan/20 rounded-xl flex items-center justify-center text-electric-cyan mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-black price-gradient">50€</span>
                <span className="text-gray-500 text-sm">{lang === 'el' ? '/αίτημα' : '/request'}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-3">
                {lang === 'el' ? 'Μελλοντικές Αλλαγές' : 'Future Changes'}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {lang === 'el'
                  ? 'Για οποιαδήποτε αλλαγή στην ιστοσελίδα σας, επικοινωνείτε μαζί μας και ολοκληρώνουμε τις αλλαγές εντός 3 εργάσιμων ημερών. Ένα αίτημα μπορεί να περιλαμβάνει πολλές λεπτομερείς αλλαγές.'
                  : 'For any changes to your website, contact us and we complete them within 3 working days. One request can include multiple detailed changes.'}
              </p>
            </div>

            {/* Add-on: Articles/Seminars section */}
            <div className="glass-panel rounded-2xl p-7 border border-white/8 hover:border-electric-cyan/30 transition-colors duration-300 relative">
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-void-purple/80 border border-void-purple text-white text-[0.55rem] font-black tracking-widest uppercase">
                {lang === 'el' ? 'ΠΡΟΑΙΡΕΤΙΚΟ' : 'ADD-ON'}
              </div>
              <div className="w-12 h-12 bg-electric-cyan/10 border border-electric-cyan/20 rounded-xl flex items-center justify-center text-electric-cyan mb-5 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-black price-gradient">70€</span>
                <span className="text-gray-500 text-sm">{lang === 'el' ? 'εφάπαξ' : 'one-time'}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-3">
                {lang === 'el' ? 'Ενότητα Άρθρων / Σεμιναρίων' : 'Articles / Seminars Section'}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {lang === 'el'
                  ? 'Χτίζουμε μια αποκλειστική ενότητα άρθρων, σεμιναρίων ή εργαστηρίων στον κώδικα της ιστοσελίδας σας. Στη συνέχεια, εσείς μπορείτε να ανεβάζετε και να επεξεργάζεστε το περιεχόμενο όποτε θέλετε, ανεξάρτητα.'
                  : 'We build a dedicated articles, seminars, or workshops section into your website\'s code. Afterwards, you can upload and edit the content whenever you want, independently.'}
              </p>
            </div>

            {/* Add-on: Contact form */}
            <div className="glass-panel rounded-2xl p-7 border border-white/8 hover:border-electric-cyan/30 transition-colors duration-300 relative">
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-void-purple/80 border border-void-purple text-white text-[0.55rem] font-black tracking-widest uppercase">
                {lang === 'el' ? 'ΠΡΟΑΙΡΕΤΙΚΟ' : 'ADD-ON'}
              </div>
              <div className="w-12 h-12 bg-electric-cyan/10 border border-electric-cyan/20 rounded-xl flex items-center justify-center text-electric-cyan mb-5 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-black price-gradient">50€</span>
                <span className="text-gray-500 text-sm">{lang === 'el' ? 'εφάπαξ' : 'one-time'}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-3">
                {lang === 'el' ? 'Φόρμα Επικοινωνίας' : 'Contact Form'}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {lang === 'el'
                  ? 'Ενσωματώνουμε φόρμα επικοινωνίας στον κώδικα της ιστοσελίδας σας. Κάθε φορά που κάποιος υποβάλλει τη φόρμα, λαμβάνετε αμέσως email στη διεύθυνση που επιλέγετε.'
                  : 'We embed a contact form into your website\'s code. Every time someone submits the form, you immediately receive an email at your preferred address.'}
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="#contact"
              className="btn-premium inline-flex items-center gap-2 px-8 py-3.5 border border-electric-cyan/40 text-electric-cyan font-bold rounded-xl hover:bg-electric-cyan hover:text-[#050a0e] transition-all duration-300 text-sm"
            >
              {lang === 'el' ? 'Επικοινωνία' : 'Contact Us'}
            </Link>
          </div>
        </ScrollReveal>

      </section>

      {/* ─── PORTFOLIO SECTION ─── */}
      <section
        id="portfolio"
        className="py-24 bg-[#0a1418]/60 border-t border-electric-cyan/8 backdrop-blur-sm scroll-mt-24"
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">

          {/* Section header */}
          <ScrollReveal className="text-center mb-14">
            <span className="section-label">{lang === 'el' ? 'Πορτφόλιο' : 'Portfolio'}</span>
            <h2 className="text-4xl md:text-5xl font-black font-display mb-3 text-white tracking-tight">
              {lang === 'el' ? 'Δείτε μερικές από τις Δουλειές μας' : 'Check Out Some Of Our Work'}
            </h2>
          </ScrollReveal>

          {/* Single full grid — 2 cols mobile, 3 cols tablet, 6 cols desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {portfolioData.map((item, index) => (
              <PortfolioCard key={index} item={item} lang={lang} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Card component ─── */
function PortfolioCard({ item, lang }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden rounded-2xl border border-white/8 block bg-[#050a0e] glow-border-hover shadow-lg"
      style={{ aspectRatio: '4/3' }}
    >
      <Image
        src={item.image}
        alt={item.name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
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
