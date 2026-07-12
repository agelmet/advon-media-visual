// components/service/KataskeviClient.jsx
// «Κατασκευή Ιστοσελίδων» — flagship page. Standard service structure,
// plus the "why is it free" story and the full portfolio grid kept from
// the previous version (all pricing removed per the site-wide rule).
'use client';

import Image from 'next/image';
import { useLangStore } from '@/store/langStore';
import { portfolioData } from '@/lib/data';
import { getService } from '@/lib/services';
import ScrollReveal from '@/components/ScrollReveal';
import {
  ServiceHero,
  PainSection,
  StepsSection,
  IncludesSection,
  ProofStrip,
  FaqSection,
  CtaBand,
} from '@/components/service/blocks';

export default function KataskeviClient() {
  const { lang } = useLangStore();
  const service = getService('kataskevi-istoselidas');

  return (
    <>
      <ServiceHero service={service} />
      <PainSection service={service} />
      <StepsSection service={service} />
      <IncludesSection service={service} />

      {/* ── Why is it free? — story block (kept from previous version) ── */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal delay={60}>
            <div className="relative overflow-hidden rounded-3xl border border-electric-cyan/30 bg-gradient-to-br from-electric-cyan/8 via-transparent to-transparent p-8 md:p-12 shadow-[0_0_40px_rgba(71,200,245,0.1)]">
              <div aria-hidden="true" className="absolute -right-24 -top-24 w-72 h-72 bg-electric-cyan/8 rounded-full blur-[90px] pointer-events-none" />
              <h3 className="text-2xl md:text-3xl font-black text-white mb-6 font-display relative z-10">
                {lang === 'el' ? 'Γιατί είναι Δωρεάν;' : 'Why is it Free?'}
              </h3>
              <div className="relative z-10 space-y-5">
                <p className="text-gray-200 text-lg leading-relaxed border-l-2 border-electric-cyan/60 pl-5">
                  {lang === 'el'
                    ? 'Στη σημερινή εποχή, δεν νοείται επιχείρηση ή επαγγελματίας χωρίς παρουσία στο διαδίκτυο. Μια δική σας ιστοσελίδα δεν είναι πολυτέλεια — είναι αναγκαιότητα: είναι ο χώρος όπου σας βρίσκουν όσοι σας αναζητούν και όπου παρουσιάζεστε όπως πραγματικά σας αξίζει — με το δικό σας περιεχόμενο, τα δικά σας λόγια, τη δική σας ταυτότητα.'
                    : "In today's world, no business or professional can afford to be invisible online. A website of your own isn't a luxury — it's a necessity: it's where people find you when they're looking for you, and where you present yourself the way you truly deserve — with your own content, your own words, your own identity."}
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
        </div>
      </section>

      <ProofStrip />

      {/* ─── PORTFOLIO (kept) ─── */}
      <section
        id="portfolio"
        className="py-24 bg-[#0a1418]/60 border-t border-electric-cyan/8 backdrop-blur-sm scroll-mt-24"
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <ScrollReveal className="text-center mb-14">
            <span className="section-label">{lang === 'el' ? 'Πορτφόλιο' : 'Portfolio'}</span>
            <h2 className="text-4xl md:text-5xl font-black font-display mb-3 text-white tracking-tight">
              {lang === 'el' ? 'Δείτε μερικές από τις Δουλειές μας' : 'Check Out Some Of Our Work'}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {portfolioData.map((item, index) => (
              <PortfolioCard key={index} item={item} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      <FaqSection service={service} />
      <CtaBand service={service} />
    </>
  );
}

/* ─── Portfolio card (kept from previous version) ─── */
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
