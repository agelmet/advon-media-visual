// components/service/GrowthWhy.jsx
// 21 Sept 2026 — the «Γιατί όλα αυτά;» button on the Growth card and the
// window it opens. Rendered through a portal: the card and ScrollReveal use
// transforms, which would break position:fixed inside them.
// Wording rules: no promise of Google positions; market prices are given as
// ranges without naming any company (checked 21 Sept 2026: agency SEO
// 150–900€+/month, copywriter ≈0.07€/word ≈ 36€ per 600-word article).
'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const REASONS = [
  {
    icon: <><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"/></>,
    tEl: 'Κάθε άρθρο είναι μια νέα είσοδος από το Google',
    tEn: 'Every article is a new way in from Google',
    dEl: 'Οι πελάτες σας γράφουν ερωτήσεις στο Google: «πόσο κοστίζει…», «τι να κάνω όταν…». Κάθε άρθρο απαντά σε μια τέτοια ερώτηση και είναι μία ακόμη σελίδα που μπορεί να εμφανιστεί στα αποτελέσματα. Με 3 άρθρα τον μήνα, σε έναν χρόνο έχετε 36.',
    dEn: 'Your customers type questions into Google: “how much does … cost”, “what should I do when …”. Every article answers one of them and is one more page that can show up in the results. At 3 articles a month, you have 36 in a year.',
  },
  {
    icon: <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
    tEl: 'Η σελίδα που ανανεώνεται μένει μπροστά',
    tEn: 'A site that keeps growing stays ahead',
    dEl: 'Οι περισσότερες ιστοσελίδες μικρών επιχειρήσεων δεν αλλάζουν ποτέ μετά την κατασκευή τους. Όποιος προσθέτει σταθερά χρήσιμο περιεχόμενο αποκτά προβάδισμα απέναντι στους ανταγωνιστές της περιοχής του.',
    dEn: 'Most small-business websites never change after they are built. Whoever keeps adding useful content steadily pulls ahead of the competitors in their area.',
  },
  {
    icon: <><path d="M3 3v18h18"/><path d="M7 16v-5"/><path d="M12 16V8"/><path d="M17 16v-3"/></>,
    tEl: 'Ξέρετε τι σας φέρνει η ιστοσελίδα',
    tEn: 'You know what the website brings you',
    dEl: 'Πόσοι μπήκαν, με ποιες αναζητήσεις σας βρήκαν, πόσοι πάτησαν το τηλέφωνο ή έστειλαν φόρμα. Κάθε μήνα σε μια απλή αναφορά, με προτάσεις για το επόμενο βήμα.',
    dEn: 'How many people visited, which searches found you, how many tapped the phone button or sent a form. Every month in one simple report, with suggestions for the next step.',
  },
  {
    icon: <><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></>,
    tEl: 'Η σελίδα σας μένει πάντα ενημερωμένη',
    tEn: 'Your site is always up to date',
    dEl: 'Νέα υπηρεσία, νέο ωράριο, νέες φωτογραφίες, νέα κείμενα: κάθε μήνα μας στέλνετε σε ένα μήνυμα όλες τις αλλαγές που θέλετε και τις κάνουμε, χωρίς τα 50€ που κοστίζει κανονικά κάθε αίτημα αλλαγών.',
    dEn: 'A new service, new opening hours, new photos, new texts: every month you send us all the changes you want in one message and we make them, without the €50 a change request normally costs.',
  },
];

export default function GrowthWhy({ lang, billingAnnual }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef(null);
  const closeRef = useRef(null);
  const panelRef = useRef(null);
  const el = lang === 'el';
  const price = billingAnnual ? '39.58€' : '49€';

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) return undefined;
    const trigger = btnRef.current;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll('a[href], button:not([disabled])');
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prevOverflow;
      trigger?.focus();
    };
  }, [open]);

  const COMPARE = [
    { el: 'Μηνιαία υπηρεσία SEO από εταιρεία', en: 'Monthly SEO service from an agency', vEl: '150–900€ / μήνα', vEn: '€150–900 / month', w: 1 },
    { el: '3 άρθρα από επαγγελματία κειμενογράφο', en: '3 articles from a professional copywriter', vEl: '≈ 100€ / μήνα', vEn: '≈ €100 / month', w: 0.34 },
    { el: '1 αίτημα αλλαγών στην ιστοσελίδα', en: '1 change request on the website', vEl: '50€', vEn: '€50', w: 0.2 },
  ];

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="why-btn group w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3 mb-6 border border-dashed border-electric-cyan/45 bg-electric-cyan/5 text-left hover:bg-electric-cyan/10 hover:border-electric-cyan/80 transition-colors duration-300"
      >
        <span className="flex items-center gap-3">
          <span className="why-dot relative w-7 h-7 rounded-full bg-electric-cyan/15 border border-electric-cyan/40 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-electric-cyan" aria-hidden="true"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          </span>
          <span>
            <span className="block text-white font-bold text-sm">{el ? 'Γιατί όλα αυτά;' : 'Why all this?'}</span>
            <span className="block text-gray-400 text-xs">{el ? 'Τι κερδίζετε κάθε μήνα, και πόσο κοστίζει αλλού' : 'What you gain every month, and what it costs elsewhere'}</span>
          </span>
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-electric-cyan shrink-0 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </button>

      {mounted && open && createPortal(
        <div
          className="why-backdrop fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-5"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="why-title"
            className="why-panel relative w-full sm:max-w-2xl flex flex-col rounded-t-3xl sm:rounded-3xl border border-white/12 bg-[#0a1017] shadow-[0_30px_120px_rgba(0,0,0,0.7),0_0_80px_rgba(71,200,245,0.12)]"
          >
            <div className="why-glow" aria-hidden="true" />
            {/* head */}
            <div className="relative flex items-start justify-between gap-4 px-6 sm:px-8 pt-6 sm:pt-7 pb-4 border-b border-white/8">
              <div>
                <span className="inline-block text-electric-cyan text-[0.65rem] font-black uppercase tracking-[0.22em] mb-1.5">Growth</span>
                <h3 id="why-title" className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight leading-tight">
                  {el ? 'Γιατί όλα αυτά;' : 'Why all this?'}
                </h3>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label={el ? 'Κλείσιμο' : 'Close'}
                className="w-10 h-10 shrink-0 rounded-full border border-white/15 bg-white/5 text-gray-300 hover:text-white hover:border-white/40 flex items-center justify-center transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {/* body */}
            <div className="why-body relative flex-1 min-h-0 overflow-y-auto px-6 sm:px-8 py-6 space-y-7">
              <p className="why-in text-gray-300 text-[0.95rem] leading-relaxed" style={{ '--d': '60ms' }}>
                {el
                  ? 'Μια ιστοσελίδα δεν φέρνει πελάτες επειδή απλώς υπάρχει. Φέρνει πελάτες όταν τη βρίσκουν στο Google, και αυτό θέλει λίγη δουλειά κάθε μήνα. Αυτή τη δουλειά την αναλαμβάνουμε εμείς.'
                  : 'A website does not bring customers just by existing. It brings customers when people find it on Google, and that takes a little work every month. We take that work off your hands.'}
              </p>

              <ol className="space-y-4">
                {REASONS.map((r, i) => (
                  <li key={r.tEn} className="why-in flex gap-4" style={{ '--d': `${140 + i * 90}ms` }}>
                    <span className="w-11 h-11 shrink-0 rounded-xl bg-electric-cyan/10 border border-electric-cyan/30 flex items-center justify-center shadow-[0_8px_24px_rgba(71,200,245,0.12)]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-electric-cyan" aria-hidden="true">{r.icon}</svg>
                    </span>
                    <div>
                      <h4 className="text-white font-bold text-[0.95rem] leading-snug mb-1">{el ? r.tEl : r.tEn}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{el ? r.dEl : r.dEn}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* what it costs elsewhere */}
              <div className="why-in rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6" style={{ '--d': '520ms' }}>
                <h4 className="text-white font-bold text-base mb-4">{el ? 'Πόσο κοστίζουν αυτά αλλού' : 'What this costs elsewhere'}</h4>
                <ul className="space-y-3.5">
                  {COMPARE.map((c, i) => (
                    <li key={c.en}>
                      <div className="flex items-baseline justify-between gap-3 text-sm mb-1.5">
                        <span className="text-gray-300">{el ? c.el : c.en}</span>
                        <span className="text-gray-200 font-bold whitespace-nowrap font-mono text-[0.8rem]">{el ? c.vEl : c.vEn}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                        <div className="why-bar h-full rounded-full bg-white/30" style={{ '--w': c.w, '--d': `${700 + i * 120}ms` }} />
                      </div>
                    </li>
                  ))}
                  <li className="pt-3 mt-1 border-t border-white/10">
                    <div className="flex items-baseline justify-between gap-3 mb-1.5">
                      <span className="text-white font-bold text-sm">{el ? 'Growth: όλα τα παραπάνω μαζί' : 'Growth: all of the above together'}</span>
                      <span className="text-electric-cyan font-black whitespace-nowrap text-lg">{price}<span className="text-xs font-bold text-electric-cyan/70"> {el ? '/ μήνα' : '/ month'}</span></span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                      <div className="why-bar h-full rounded-full bg-electric-cyan shadow-[0_0_12px_rgba(71,200,245,0.7)]" style={{ '--w': billingAnnual ? 0.12 : 0.15, '--d': '1080ms' }} />
                    </div>
                  </li>
                </ul>
                <p className="text-gray-500 text-xs mt-4 leading-relaxed">
                  {el
                    ? 'Ενδεικτικές τιμές της ελληνικής αγοράς. Όλες οι τιμές χωρίς ΦΠΑ.'
                    : 'Indicative prices in the Greek market. All prices exclude VAT.'}
                </p>
              </div>

              <div className="why-in" style={{ '--d': '620ms' }}>
                <h4 className="text-white font-bold text-base mb-2">{el ? 'Πώς γίνεται σε αυτή την τιμή;' : 'How is this price possible?'}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {el
                    ? 'Ξέρουμε ότι σήμερα όλα έχουν ακριβύνει και ότι για μια μικρή επιχείρηση ή έναν επαγγελματία κάθε ευρώ μετράει. Θέλουμε να βοηθήσουμε όσους δεν έχουν τον προϋπολογισμό μιας μεγάλης εταιρείας να έχουν κι αυτοί μια ιστοσελίδα που δουλεύει για αυτούς, γι\' αυτό κρατάμε την τιμή χαμηλή. Και επειδή την ιστοσελίδα σας την έχουμε φτιάξει εμείς, τη γνωρίζουμε ήδη.'
                    : 'We know that everything has become more expensive and that for a small business or a professional every euro counts. We want to help people without a big company\'s budget to also have a website that works for them, so we keep the price low. And because we built your website ourselves, we already know it.'}
                </p>
              </div>

              <p className="why-in flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-gray-300 text-sm leading-relaxed" style={{ '--d': '700ms' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-electric-cyan shrink-0 mt-0.5" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
                <span>
                  {el
                    ? 'Δεν υποσχόμαστε «πρώτη θέση στο Google», γιατί κανείς δεν μπορεί να την εγγυηθεί. Υποσχόμαστε σταθερή δουλειά κάθε μήνα και αποτελέσματα που τα βλέπετε σε νούμερα.'
                    : 'We do not promise “first place on Google”, because nobody can guarantee it. We promise steady work every month and results you can see in numbers.'}
                </span>
              </p>
            </div>

            {/* foot */}
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-6 sm:px-8 py-4 border-t border-white/8 bg-[#0a1017] rounded-b-none sm:rounded-b-3xl">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="btn-premium flex-1 inline-flex items-center justify-center text-center gap-2 px-6 py-3.5 rounded-xl bg-electric-cyan text-[#050a0e] font-black text-sm shadow-[0_0_30px_rgba(71,200,245,0.35)] hover:shadow-[0_0_44px_rgba(71,200,245,0.55)] transition-shadow duration-300"
              >
                {el ? 'Θέλω το Growth · δωρεάν 15λεπτη κλήση' : 'I want Growth · free 15-minute call'}
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="hidden sm:inline-flex items-center justify-center px-5 py-3 rounded-xl border border-white/12 text-gray-300 hover:text-white hover:border-white/30 text-sm font-bold transition-colors duration-200"
              >
                {el ? 'Κλείσιμο' : 'Close'}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
