// app/kataskevi-istoselidas/page.jsx
'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLangStore } from '@/store/langStore';
import { portfolioData } from '@/lib/data';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';

export default function WebsiteCreation() {
  const { lang } = useLangStore();
  const [billingAnnual, setBillingAnnual] = useState(true);

  return (
    <>
      {/* ─── SERVICE INFO SECTION ─── */}
      <section className="py-32 pt-16 max-w-6xl mx-auto px-6">
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

        {/* Main Info Panel */}
        <ScrollReveal delay={60}>
          <div className="glass-panel p-8 md:p-12 rounded-3xl text-gray-300 leading-relaxed font-body text-lg mb-20 shadow-[0_0_50px_rgba(71,200,245,0.08)]">
            {/* ── Pricing hero ── */}
            <div className="text-center mb-16 pb-12 border-b border-white/8">
              <span className="text-electric-cyan text-xs font-bold tracking-widest uppercase mb-6 block">
                {lang === 'el' ? 'ΤΙΜΗ ΚΑΤΑΣΚΕΥΗΣ' : 'CREATION PRICE'}
              </span>
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 mb-5">
                {/* Anchor / original price — crossed out with hand-drawn SVG line */}
                <div className="relative inline-block">
                  <span className="text-2xl md:text-3xl font-bold text-gray-400/75 tracking-tight whitespace-nowrap select-none">
                    700€ – 5.000€
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 210 40"
                    fill="none"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M6,32 C45,25 95,16 140,10 C168,6 190,4 204,2"
                      stroke="#ef4444"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4,34 C48,28 99,19 144,13 C171,9 192,6 206,4"
                      stroke="#ef4444"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      opacity="0.45"
                    />
                  </svg>
                </div>
                <span className="free-pulse text-7xl md:text-8xl font-black text-white tracking-tight leading-none">
                  {lang === 'el' ? 'ΔΩΡΕΑΝ' : 'FREE'}
                </span>
              </div>
              <p className="text-lg md:text-xl text-gray-300 mb-3">
                {lang === 'el' ? (
                  <>Μόνο <span className="text-white font-black">10.83€/μήνα</span> — όλα περιλαμβάνονται</>
                ) : (
                  <>Only <span className="text-white font-black">10.83€/month</span> — everything included</>
                )}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto mb-8">
                {lang === 'el'
                  ? 'Η κατασκευή είναι πραγματικά δωρεάν — το ποσό αυτό καλύπτει αποκλειστικά τα απαραίτητα λειτουργικά που χρειάζεται κάθε ιστοσελίδα για να είναι online, όσα θα πληρώνατε ούτως ή άλλως, όπου κι αν την φτιάχνατε. Εδώ, τα έχετε όλα σε ένα, χωρίς τίποτα επιπλέον.'
                  : "The build itself is genuinely free — this amount covers only the essential running services every website needs to stay online, what you would pay anyway, wherever you had it built. Here, it's all in one, with nothing extra on top."}
              </p>
              {/* Included-items chips */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto">
                {[
                  { el: 'Φιλοξενία (hosting)', en: 'Hosting' },
                  { el: 'Domain name της επιλογής σας', en: 'Domain name of your choice' },
                  { el: 'Ασφάλεια', en: 'Security' },
                  { el: 'Αυτόματα backups', en: 'Automatic backups' },
                ].map(({ el, en }) => (
                  <span
                    key={en}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-cyan/8 border border-electric-cyan/25 text-sm font-semibold text-gray-200 whitespace-nowrap"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-electric-cyan shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                    {lang === 'el' ? el : en}
                  </span>
                ))}
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/4 border border-white/12 text-sm font-semibold text-gray-400 whitespace-nowrap">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  {lang === 'el' ? 'και άλλα' : 'and more'}
                </span>
              </div>
            </div>

            {/* ── Why is it free? — story block ── */}
            <ScrollReveal delay={60}>
              <div className="relative overflow-hidden rounded-3xl border border-electric-cyan/30 bg-gradient-to-br from-electric-cyan/8 via-transparent to-transparent p-8 md:p-12 mb-16 shadow-[0_0_40px_rgba(71,200,245,0.1)]">
                <div aria-hidden="true" className="absolute -right-24 -top-24 w-72 h-72 bg-electric-cyan/8 rounded-full blur-[90px] pointer-events-none" />
                <h3 className="text-2xl md:text-3xl font-black text-white mb-6 font-display relative z-10">
                  {lang === 'el' ? 'Γιατί είναι Δωρεάν;' : 'Why is it Free?'}
                </h3>
                <div className="relative z-10 space-y-5">
                  <p className="text-gray-200 text-lg leading-relaxed border-l-2 border-electric-cyan/60 pl-5">
                    {lang === 'el'
                      ? 'Στη σημερινή εποχή, δεν νοείται επιχείρηση ή επαγγελματίας χωρίς παρουσία στο διαδίκτυο. Μια δική σας ιστοσελίδα δεν είναι πολυτέλεια — είναι αναγκαιότητα: είναι ο χώρος όπου σας βρίσκουν όσοι σας αναζητούν και όπου παρουσιάζεστε όπως πραγματικά σας αξίζει — με το δικό σας περιεχόμενο, τα δικά σας λόγια, τη δική σας ταυτότητα. Ένα απρόσωπο προφίλ σε κάποιον κατάλογο, ανάμεσα σε δεκάδες ανταγωνιστές, δεν είναι δική σας παρουσία — είναι απλώς μια καταχώρηση.'
                      : "In today's world, no business or professional can afford to be invisible online. A website of your own isn't a luxury — it's a necessity: it's where people find you when they're looking for you, and where you present yourself the way you truly deserve — with your own content, your own words, your own identity. An impersonal profile in some directory, buried among dozens of competitors, isn't your presence — it's just a listing."}
                  </p>
                  <p className="text-gray-400 text-base leading-relaxed">
                    {lang === 'el'
                      ? 'Πιστεύουμε ότι κάθε επαγγελματίας αξίζει μια πραγματικά επαγγελματική παρουσία στο διαδίκτυο — όχι μόνο όσοι μπορούν να διαθέσουν χιλιάδες ευρώ. Γι’ αυτό αναλαμβάνουμε την κατασκευή εντελώς δωρεάν: για να στηρίξουμε μικρές επιχειρήσεις, ελεύθερους επαγγελματίες και όσους κάνουν τώρα τα πρώτα τους βήματα, χωρίς κανένα εμπόδιο στην εκκίνηση.'
                      : "We believe every professional deserves a truly professional online presence — not just those who can spend thousands of euros. That's why we build your website completely free: to support small businesses, freelancers, and anyone taking their first steps, with zero barriers to getting started."}
                  </p>
                  <p className="text-gray-400 text-base leading-relaxed">
                    {lang === 'el' ? (
                      <>Κερδίζουμε κι εμείς: κάθε ιστοσελίδα που παραδίδουμε μεγαλώνει το πορτφόλιό μας και μας φέρνει τους επόμενους πελάτες μέσα από τη δουλειά μας — όχι από διαφημίσεις. Εσείς αποκτάτε μια premium ιστοσελίδα χωρίς ρίσκο, εμείς ένα ακόμα δείγμα δουλειάς που μας κάνει περήφανους. <span className="text-electric-cyan font-bold">Όλοι κερδίζουν.</span></>
                    ) : (
                      <>We win too: every website we deliver grows our portfolio and brings us our next clients through our work — not through ads. You get a premium website with zero risk; we get one more project we&apos;re proud of. <span className="text-electric-cyan font-bold">Everyone wins.</span></>
                    )}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* ── Benefit cards ── */}
            <ScrollReveal delay={80}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
                {[
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
                    titleEl: 'Πρώτοι στη Google', titleEn: 'First on Google',
                    bodyEl: 'Μια σωστά δομημένη, γρήγορη ιστοσελίδα σας ανεβάζει στα αποτελέσματα αναζήτησης — εκεί όπου σας ψάχνουν οι αυριανοί σας πελάτες.',
                    bodyEn: "A well-structured, fast website lifts you up the search results — right where tomorrow's clients are looking for you.",
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></svg>,
                    titleEl: 'Επισκέπτες → Πελάτες', titleEn: 'Visitors → Clients',
                    bodyEl: 'Δεν φτιάχνουμε απλώς κάτι όμορφο. Κάθε ενότητα είναι σχεδιασμένη να εμπνέει εμπιστοσύνη και να οδηγεί τον επισκέπτη να σας καλέσει ή να κλείσει ραντεβού.',
                    bodyEn: "We don't just make something beautiful. Every section is designed to build trust and lead visitors to call you or book an appointment.",
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                    titleEl: 'Επαγγελματική Εικόνα 24/7', titleEn: 'A Professional Image, 24/7',
                    bodyEl: 'Η ιστοσελίδα σας δουλεύει για εσάς όλο το 24ωρο: παρουσιάζει τις υπηρεσίες σας, απαντά στις βασικές ερωτήσεις και κάνει την πρώτη εντύπωση — πάντα άψογη.',
                    bodyEn: 'Your website works for you around the clock: it showcases your services, answers the basics and makes the first impression — flawless, every time.',
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>,
                    titleEl: 'Χωρίς Ρίσκο, Χωρίς Δεσμεύσεις στην Αρχή', titleEn: 'No Risk, No Strings Attached',
                    bodyEl: 'Δεν πληρώνετε τίποτα προκαταβολικά. Βλέπετε πρώτα την ιστοσελίδα σας έτοιμη, κάνουμε δωρεάν όσες αλλαγές θέλετε — και μόνο τότε ξεκινά η συνδρομή.',
                    bodyEn: 'You pay nothing upfront. You see your finished website first, we make as many free changes as you want — and only then does your subscription begin.',
                  },
                ].map(({ icon, titleEl, titleEn, bodyEl, bodyEn }) => (
                  <div
                    key={titleEn}
                    className="group bg-white/4 border border-white/8 rounded-2xl p-6 h-full transition-all duration-300 hover:bg-white/8 hover:border-electric-cyan/30 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_24px_rgba(71,200,245,0.1)]"
                  >
                    <div className="w-11 h-11 rounded-xl bg-electric-cyan/10 border border-electric-cyan/20 flex items-center justify-center text-electric-cyan mb-4 group-hover:bg-electric-cyan/18 transition-colors duration-300">
                      {icon}
                    </div>
                    <h4 className="text-white font-bold text-base mb-2 leading-snug">{lang === 'el' ? titleEl : titleEn}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{lang === 'el' ? bodyEl : bodyEn}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <div className="mt-12">
              <div className="text-center mb-14">
                <span className="section-label">{lang === 'el' ? 'Βήμα - Βήμα' : 'Step by Step'}</span>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4 font-display tracking-tight">
                  {lang === 'el' ? 'Πανεύκολη Διαδικασία Κατασκευής' : 'Super Easy Creation Process'}
                </h3>
                <p className="text-gray-400 text-base max-w-2xl mx-auto">
                  {lang === 'el'
                    ? 'Για να σας εξοικονομήσουμε χρόνο, το μόνο που χρειαζόμαστε από εσάς είναι λίγα απλά πράγματα — από εκεί και πέρα, αναλαμβάνουμε εμείς.'
                    : 'To save you time, all we need from you is a few simple things — from there, we take over.'}
                </p>
              </div>

              {/* Roadmap / journey timeline */}
              <div className="relative">
                <div aria-hidden="true" className="roadmap-line absolute top-2 bottom-2 left-[23px] md:left-1/2 md:-translate-x-1/2 w-[2px]" />

                {[
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>,
                    titleEl: 'Φωτογραφίες', titleEn: 'Photos',
                    bodyEl: 'Δική σας επαγγελματική φωτογραφία, του χώρου ή/και του προσωπικού σας.',
                    bodyEn: 'A professional photo of you, your space and/or your team.',
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>,
                    titleEl: 'Βασικά Κείμενα', titleEn: 'Basic Texts',
                    bodyEl: 'Λίγα, μικρά κείμενα για την επιχείρησή σας. Την τελική κειμενογραφία την αναλαμβάνουμε εμείς.',
                    bodyEn: 'A few short texts about your business. We take care of the final copywriting.',
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>,
                    titleEl: 'Υπηρεσίες', titleEn: 'Services',
                    bodyEl: 'Μια λίστα με τις υπηρεσίες σας, επιγραμματικά.',
                    bodyEn: 'A simple bullet-point list of your services.',
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
                    titleEl: 'Στοιχεία Επικοινωνίας', titleEn: 'Contact Details',
                    bodyEl: 'Τηλέφωνο, email, διεύθυνση και ωράριο λειτουργίας.',
                    bodyEn: 'Phone, email, address and opening hours.',
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
                    titleEl: 'Λογότυπο', titleEn: 'Logo',
                    bodyEl: 'Αν έχετε λογότυπο, μας το στέλνετε. Αν όχι, σχεδιάζουμε εμείς ένα για εσάς — εντελώς δωρεάν.',
                    bodyEn: 'If you have a logo, send it over. If not, we design one for you — completely free.',
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                    titleEl: 'Πρώτο Draft σε 7–14 Ημέρες', titleEn: 'First Draft in 7–14 Days',
                    bodyEl: 'Μόλις λάβουμε το υλικό σας, παραδίδουμε το πρώτο draft της ιστοσελίδας σας μέσα σε 7–14 ημέρες.',
                    bodyEn: 'As soon as we receive your material, we deliver the first draft of your website within 7–14 days.',
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/></svg>,
                    titleEl: 'Απεριόριστες Αλλαγές μέχρι την Τελειότητα', titleEn: 'Unlimited Changes Until It\'s Perfect',
                    bodyEl: 'Κάνουμε όσες αλλαγές και αναθεωρήσεις χρειαστούν — όλες δωρεάν — μέχρι η ιστοσελίδα να είναι ακριβώς όπως την είχατε στο μυαλό σας και να σας ενθουσιάζει.',
                    bodyEn: 'We make as many changes and revisions as needed — all free — until your website is exactly how you imagined it and you absolutely love it.',
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
                    titleEl: 'Online!', titleEn: 'Online!',
                    bodyEl: 'Αγοράζουμε το domain name, ολοκληρώνουμε τις τελευταίες λεπτομέρειες και η ιστοσελίδα σας βγαίνει στον αέρα.',
                    bodyEn: 'We purchase your domain name, wrap up the final touches, and your website goes live.',
                    final: true,
                  },
                ].map(({ icon, titleEl, titleEn, bodyEl, bodyEn, final }, i) => {
                  const onLeft = i % 2 === 0;
                  return (
                    <ScrollReveal key={titleEn} direction={onLeft ? 'left' : 'right'} delay={80} threshold={0.3}>
                      <div className={`relative pl-16 pb-10 last:pb-0 md:pl-0 md:py-5 md:flex ${onLeft ? 'md:justify-start' : 'md:justify-end'}`}>
                        {/* Milestone node */}
                        <div
                          className={`absolute left-0 top-0 md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center font-black text-base border-2 transition-all duration-300 ${
                            final
                              ? 'bg-electric-cyan text-[#050a0e] border-electric-cyan shadow-[0_0_30px_rgba(71,200,245,0.65)]'
                              : 'bg-[#0a1418] text-electric-cyan border-electric-cyan/50 shadow-[0_0_18px_rgba(71,200,245,0.25)]'
                          }`}
                        >
                          {i + 1}
                        </div>
                        {/* Connector to card (desktop) */}
                        <div
                          aria-hidden="true"
                          className={`hidden md:block absolute top-1/2 h-px w-10 ${
                            onLeft
                              ? 'right-1/2 mr-[26px] bg-gradient-to-l from-electric-cyan/50 to-transparent'
                              : 'left-1/2 ml-[26px] bg-gradient-to-r from-electric-cyan/50 to-transparent'
                          }`}
                        />
                        {/* Step card */}
                        <div
                          className={`group bg-white/4 border p-6 rounded-2xl md:w-[calc(50%-4.5rem)] transition-all duration-300 hover:bg-white/8 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_24px_rgba(71,200,245,0.1)] ${
                            final ? 'border-electric-cyan/40 hover:border-electric-cyan/60' : 'border-white/8 hover:border-electric-cyan/30'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-electric-cyan/10 border border-electric-cyan/20 flex items-center justify-center text-electric-cyan shrink-0 group-hover:bg-electric-cyan/18 transition-colors duration-300">
                              {icon}
                            </div>
                            <h4 className="text-white font-bold text-lg leading-tight">{lang === 'el' ? titleEl : titleEn}</h4>
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed">{lang === 'el' ? bodyEl : bodyEn}</p>
                        </div>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>

              {/* Zero-risk guarantees */}
              <ScrollReveal delay={80} className="mt-16">
                <div className="text-center mb-8">
                  <span className="section-label">{lang === 'el' ? 'Μηδενικό Ρίσκο' : 'Zero Risk'}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
                      titleEl: 'Καμία Προκαταβολή', titleEn: 'No Upfront Payment',
                      bodyEl: 'Δεν πληρώνετε τίποτα για να ξεκινήσουμε. Η ετήσια συνδρομή φιλοξενίας εξοφλείται μόλις παραδοθεί το πρώτο draft — και συνεχίζουμε με απεριόριστες αλλαγές μέχρι την ολοκλήρωση.',
                      bodyEn: 'You pay nothing to get started. The annual hosting subscription is settled once the first draft is delivered — and we keep going with unlimited changes until completion.',
                    },
                    {
                      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/></svg>,
                      titleEl: 'Απεριόριστες Αλλαγές Δωρεάν', titleEn: 'Unlimited Free Changes',
                      bodyEl: 'Όσες αλλαγές και αναθεωρήσεις χρειαστούν, χωρίς καμία χρέωση — μέχρι η ιστοσελίδα να είναι ακριβώς όπως τη θέλετε.',
                      bodyEn: 'As many changes and revisions as it takes, at no charge — until your website is exactly how you want it.',
                    },
                    {
                      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>,
                      titleEl: 'Οι 365 Ημέρες Ξεκινούν όταν Βγείτε Online', titleEn: 'Your 365 Days Start When You Go Online',
                      bodyEl: 'Ο χρόνος της ετήσιας συνδρομής μετράει από την ημέρα που αγοράζουμε το domain name, έχουν ολοκληρωθεί όλες οι αλλαγές και η ιστοσελίδα σας είναι στον αέρα. Όχι νωρίτερα.',
                      bodyEn: 'Your annual subscription clock starts the day we purchase your domain name, every change is complete and your website is live. Not a day sooner.',
                    },
                  ].map(({ icon, titleEl, titleEn, bodyEl, bodyEn }) => (
                    <div
                      key={titleEn}
                      className="relative overflow-hidden rounded-2xl border border-electric-cyan/35 bg-gradient-to-b from-electric-cyan/10 via-electric-cyan/4 to-transparent p-7 shadow-[0_0_30px_rgba(71,200,245,0.08)] glow-border-hover badge-scan"
                    >
                      <div className="w-12 h-12 rounded-xl bg-electric-cyan/15 border border-electric-cyan/30 flex items-center justify-center text-electric-cyan mb-4 icon-glow">
                        {icon}
                      </div>
                      <h4 className="text-white font-black text-sm uppercase tracking-wider mb-3 leading-snug">
                        {lang === 'el' ? titleEl : titleEn}
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{lang === 'el' ? bodyEl : bodyEn}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>

        {/* ─── HOSTING PRICING TOGGLE ─── */}
        <ScrollReveal delay={60} direction="scale" className="mt-4">
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
              <div key="annual" className="pricing-swap-in pricing-featured glass-panel rounded-2xl p-8 border-2 border-electric-cyan/60 relative shadow-[0_0_50px_rgba(71,200,245,0.18)]">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-electric-cyan text-[#050a0e] text-[0.6rem] font-black tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(71,200,245,0.5)] whitespace-nowrap">
                  {lang === 'el' ? 'ΚΑΛΥΤΕΡΗ ΤΙΜΗ' : 'BEST VALUE'}
                </div>
                <div className="text-electric-cyan text-xs font-black uppercase tracking-widest mb-4 mt-1">
                  {lang === 'el' ? 'Ετήσια Χρέωση' : 'Annual Billing'}
                </div>
                <div className="flex items-end gap-2 mb-0.5">
                  <span className="text-5xl font-black text-white">10.83€</span>
                  <span className="text-gray-500 mb-1.5 text-sm">{lang === 'el' ? '/μήνα' : '/month'}</span>
                </div>
                <p className="text-gray-500 text-xs mb-1">{lang === 'el' ? '(+ΦΠΑ)' : '(+VAT)'}</p>
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
                      {lang === 'el' ? 'Ελάχιστη δέσμευση 1 έτος' : 'Minimum commitment 1 year'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Monthly card */
              <div key="monthly" className="pricing-swap-in glass-panel rounded-2xl p-8 border-2 border-electric-cyan/60 relative shadow-[0_0_50px_rgba(71,200,245,0.18)]">
                <div className="text-gray-300 text-xs font-black uppercase tracking-widest mb-4">
                  {lang === 'el' ? 'Μηνιαία Χρέωση' : 'Monthly Billing'}
                </div>
                <div className="flex items-end gap-2 mb-0.5">
                  <span className="text-5xl font-black text-white">15€</span>
                  <span className="text-gray-500 mb-1.5 text-sm">{lang === 'el' ? '/μήνα' : '/month'}</span>
                </div>
                <p className="text-gray-500 text-xs mb-1">{lang === 'el' ? '(+ΦΠΑ)' : '(+VAT)'}</p>
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

        {/* ─── HOSTING TECHNICAL FEATURES ─── */}
        <ScrollReveal delay={60} direction="fade" className="mt-20">
          <div className="text-center mb-12">
            <span className="section-label">{lang === 'el' ? 'Τεχνικά Χαρακτηριστικά' : 'Technical Features'}</span>
            <h2 className="text-3xl md:text-4xl font-black font-display mb-3 text-white tracking-tight">
              {lang === 'el' ? 'Enterprise-Grade Υποδομή' : 'Enterprise-Grade Infrastructure'}
            </h2>
            <p className="text-gray-500 text-base max-w-2xl mx-auto">
              {lang === 'el'
                ? 'Η ιστοσελίδα σας τρέχει σε υποδομή επιπέδου μεγάλης επιχείρησης — ασφαλής, γρήγορη, και πάντα online.'
                : 'Your website runs on enterprise-level infrastructure — secure, fast, and always online.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m13 2-2 2.5h3L12 7"/><path d="M10 14v-3"/><path d="M14 14v-3"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><circle cx="12" cy="14" r="8"/></svg>,
                titleEl: 'Ταχύτατη Φόρτωση μέσω Global CDN',
                titleEn: 'Lightning-Fast Loading via Global CDN',
                bodyEl: 'Η ιστοσελίδα εξυπηρετείται από παγκόσμιο δίκτυο διανομής περιεχομένου (CDN). Τα αρχεία της φορτώνουν από το πλησιέστερο data center σε κάθε επισκέπτη, εξαλείφοντας τις καθυστερήσεις και εξασφαλίζοντας εξαιρετικά γρήγορους χρόνους φόρτωσης.',
                bodyEn: 'The website is served from a globally distributed CDN. Files load from the data center closest to each visitor, eliminating lag and guaranteeing ultra-fast load times.',
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
                titleEl: 'Αυτόματη Κρυπτογράφηση SSL/TLS',
                titleEn: 'Automated SSL/TLS Encryption',
                bodyEl: 'Η ιστοσελίδα προστατεύεται με αυτόματα ανανεούμενο, επαγγελματικό πιστοποιητικό SSL. Κάθε σύνδεση πραγματοποιείται μέσω HTTPS, ώστε όλα τα δεδομένα που ανταλλάσσονται μεταξύ server και browser να παραμένουν κρυπτογραφημένα και απόλυτα ιδιωτικά.',
                bodyEn: 'Secured with a continuously renewed, enterprise-grade SSL certificate. Every connection is served over HTTPS — all data between server and browser stays strictly private and encrypted.',
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
                titleEl: 'Ενεργή Προστασία από DDoS',
                titleEn: 'Active DDoS Mitigation',
                bodyEl: 'Το υποκείμενο δίκτυο διαθέτει ενσωματωμένη προστασία DDoS σε Layer 3, 4 και 7, που απορροφά και εξουδετερώνει αυτόματα την κακόβουλη κίνηση από bots ή τις επιθέσεις υπερφόρτωσης, πριν προλάβουν να επηρεάσουν την απόδοση της ιστοσελίδας.',
                bodyEn: 'The edge network includes built-in Layer 3, 4, and 7 DDoS protection, automatically absorbing and neutralizing malicious bot traffic or server floods before they affect performance.',
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>,
                titleEl: 'Αμετάβλητα Deployments & Συνεχή Αντίγραφα Ασφαλείας',
                titleEn: 'Immutable Deployments & Continuous Backups',
                bodyEl: 'Κάθε ενημέρωση δημιουργεί ένα πλήρες, μη επεξεργάσιμο (read-only) snapshot ολόκληρης της ιστοσελίδας — ένα αυτόματο και αδιάσπαστο αντίγραφο ασφαλείας της ψηφιακής σας παρουσίας.',
                bodyEn: 'Every update generates a complete, read-only snapshot of the entire site — an automated, unbreakable backup of your entire web property.',
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.54"/></svg>,
                titleEl: 'Άμεση Επαναφορά με Ένα Κλικ',
                titleEn: 'Instant One-Click Rollbacks',
                bodyEl: 'Καθώς κάθε ενημέρωση αποθηκεύεται ως αμετάβλητο snapshot, η ιστοσελίδα μπορεί να επανέλθει σε οποιαδήποτε προηγούμενη, πλήρως λειτουργική έκδοση μέσα σε δευτερόλεπτα, αν ποτέ προκύψει κάποιο πρόβλημα.',
                bodyEn: 'Because every update is saved as an immutable snapshot, the site can be reverted to any previous working version in seconds if any issue ever occurs.',
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
                titleEl: 'Παγκόσμια Εφεδρεία & Μέγιστη Διαθεσιμότητα',
                titleEn: 'Global Redundancy & Maximum Uptime',
                bodyEl: 'Η ιστοσελίδα δεν φιλοξενείται σε έναν μόνο server, αλλά διανέμεται σε ένα τεράστιο παγκόσμιο δίκτυο. Αν ένα περιφερειακό data center παρουσιάσει πρόβλημα, η κίνηση ανακατευθύνεται αυτόματα στο πλησιέστερο διαθέσιμο, διασφαλίζοντας τη μέγιστη δυνατή διαθεσιμότητα.',
                bodyEn: 'The site is distributed across a massive global network, not a single server. If one regional data center goes down, traffic is seamlessly rerouted to keep the site online.',
              },
            ].map(({ icon, titleEl, titleEn, bodyEl, bodyEn }) => (
              <div key={titleEn} className="glass-panel card-sweep rounded-2xl p-6 flex gap-4 group hover:border-electric-cyan/30 transition-colors duration-300">
                <div className="w-11 h-11 bg-electric-cyan/10 border border-electric-cyan/20 rounded-xl flex items-center justify-center text-electric-cyan shrink-0 group-hover:bg-electric-cyan/18 transition-colors duration-300">
                  {icon}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1.5 leading-tight">{lang === 'el' ? titleEl : titleEn}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{lang === 'el' ? bodyEl : bodyEn}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ─── FUTURE CHANGES POLICY + ADD-ONS ─── */}
        <ScrollReveal delay={80} className="mt-20">
          <div className="text-center mb-10">
            <span className="section-label">{lang === 'el' ? 'Extras' : 'Extras'}</span>
            <h2 className="text-3xl md:text-4xl font-black font-display mb-3 text-white tracking-tight">
              {lang === 'el' ? 'Αλλαγές & Extras' : 'Changes & Extras'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Future changes policy */}
            <TiltCard className="h-full">
            <div className="glass-panel card-sweep rounded-2xl p-7 h-full border border-electric-cyan/20 hover:border-electric-cyan/40 transition-colors duration-300">
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
            </TiltCard>

            {/* Add-on: Articles/Seminars section */}
            <TiltCard className="h-full">
            <div className="glass-panel card-sweep rounded-2xl p-7 h-full border border-white/8 hover:border-electric-cyan/30 transition-colors duration-300 relative">
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
            </TiltCard>

            {/* Add-on: Contact form */}
            <TiltCard className="h-full">
            <div className="glass-panel card-sweep rounded-2xl p-7 h-full border border-white/8 hover:border-electric-cyan/30 transition-colors duration-300 relative">
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
            </TiltCard>

            {/* Add-on: Admin Panel */}
            <TiltCard className="h-full">
            <div className="glass-panel card-sweep rounded-2xl p-7 h-full border border-white/8 hover:border-electric-cyan/30 transition-colors duration-300 relative">
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-void-purple/80 border border-void-purple text-white text-[0.55rem] font-black tracking-widest uppercase">
                {lang === 'el' ? 'ΠΡΟΑΙΡΕΤΙΚΟ' : 'ADD-ON'}
              </div>
              <div className="w-12 h-12 bg-electric-cyan/10 border border-electric-cyan/20 rounded-xl flex items-center justify-center text-electric-cyan mb-5 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-black price-gradient">180€</span>
                <span className="text-gray-500 text-sm">{lang === 'el' ? 'εφάπαξ' : 'one-off'}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-3">
                {lang === 'el' ? 'Πίνακας Διαχείρισης (Admin Panel)' : 'Admin Panel'}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {lang === 'el'
                  ? 'Χτίζουμε και ενσωματώνουμε στον κώδικα της ιστοσελίδας σας έναν πίνακα διαχείρισης, ώστε να μπορείτε να αλλάζετε μόνοι σας κείμενα και εικόνες όποτε θέλετε — δωρεάν, έως 5 αλλαγές τον μήνα.'
                  : 'We build and integrate an admin panel into your website\'s code so you can change texts and images yourself whenever you want — free, up to 5 changes per month.'}
              </p>
            </div>
            </TiltCard>
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
      className="group img-shine relative overflow-hidden rounded-2xl border border-white/8 block bg-[#050a0e] glow-border-hover shadow-lg transition-transform duration-500 hover:-translate-y-1.5"
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
