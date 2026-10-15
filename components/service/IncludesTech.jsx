// components/service/IncludesTech.jsx — «Παροχές · Τι περιλαμβάνει» + «Τεχνικά χαρακτηριστικά»
// in ONE section (15 Oct 2026, Angelo: clearly stated, easy to view, chic, not boring).
//   left plate  = what every website includes (lib/services.js → includes), the first line as the
//                 headline, the next three as a checklist;
//   right plate = the six infrastructure features as small tabs + one description at a time
//                 (all descriptions share one grid cell, so switching never changes the height);
//                 it moves on by itself every 6 s while on screen, and stops for good once the
//                 visitor picks a tab or hovers the plate.
'use client';
import { useEffect, useRef, useState } from 'react';
import { useLangStore } from '@/store/langStore';
import ScrollReveal from '@/components/ScrollReveal';

const TECH = [
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="m13 2-2 2.5h3L12 7"/><path d="M10 14v-3"/><path d="M14 14v-3"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><circle cx="12" cy="14" r="8"/></svg>,
                shortEl: 'Global CDN', shortEn: 'Global CDN',
                titleEl: 'Ταχύτατη Φόρτωση μέσω Global CDN',
                titleEn: 'Lightning-Fast Loading via Global CDN',
                bodyEl: 'Η ιστοσελίδα εξυπηρετείται από παγκόσμιο δίκτυο διανομής περιεχομένου (CDN). Τα αρχεία της φορτώνουν από το πλησιέστερο data center σε κάθε επισκέπτη, εξαλείφοντας τις καθυστερήσεις και εξασφαλίζοντας εξαιρετικά γρήγορους χρόνους φόρτωσης.',
                bodyEn: 'The website is served from a globally distributed CDN. Files load from the data center closest to each visitor, eliminating lag and guaranteeing ultra-fast load times.',
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
                shortEl: 'SSL / HTTPS', shortEn: 'SSL / HTTPS',
                titleEl: 'Αυτόματη Κρυπτογράφηση SSL/TLS',
                titleEn: 'Automated SSL/TLS Encryption',
                bodyEl: 'Η ιστοσελίδα προστατεύεται με αυτόματα ανανεούμενο, επαγγελματικό πιστοποιητικό SSL. Κάθε σύνδεση πραγματοποιείται μέσω HTTPS, ώστε όλα τα δεδομένα που ανταλλάσσονται μεταξύ server και browser να παραμένουν κρυπτογραφημένα και απόλυτα ιδιωτικά.',
                bodyEn: 'Secured with a continuously renewed, enterprise-grade SSL certificate. Every connection is served over HTTPS — all data between server and browser stays strictly private and encrypted.',
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M12 2L2 7l10 5 10-4-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
                shortEl: 'Προστασία DDoS', shortEn: 'DDoS protection',
                titleEl: 'Ενεργή Προστασία από DDoS',
                titleEn: 'Active DDoS Mitigation',
                bodyEl: 'Το υποκείμενο δίκτυο διαθέτει ενσωματωμένη προστασία DDoS σε Layer 3, 4 και 7, που απορροφά και εξουδετερώνει αυτόματα την κακόβουλη κίνηση από bots ή τις επιθέσεις υπερφόρτωσης, πριν προλάβουν να επηρεάσουν την απόδοση της ιστοσελίδας.',
                bodyEn: 'The edge network includes built-in Layer 3, 4, and 7 DDoS protection, automatically absorbing and neutralizing malicious bot traffic or server floods before they affect performance.',
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>,
                shortEl: 'Αντίγραφα ασφαλείας', shortEn: 'Backups',
                titleEl: 'Αμετάβλητα Deployments & Συνεχή Αντίγραφα Ασφαλείας',
                titleEn: 'Immutable Deployments & Continuous Backups',
                bodyEl: 'Κάθε ενημέρωση δημιουργεί ένα πλήρες, μη επεξεργάσιμο (read-only) snapshot ολόκληρης της ιστοσελίδας — ένα αυτόματο και αδιάσπαστο αντίγραφο ασφαλείας της ψηφιακής σας παρουσίας.',
                bodyEn: 'Every update generates a complete, read-only snapshot of the entire site — an automated, unbreakable backup of your entire web property.',
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.54"/></svg>,
                shortEl: 'Επαναφορά σε 1 κλικ', shortEn: '1-click rollback',
                titleEl: 'Άμεση Επαναφορά με Ένα Κλικ',
                titleEn: 'Instant One-Click Rollbacks',
                bodyEl: 'Καθώς κάθε ενημέρωση αποθηκεύεται ως αμετάβλητο snapshot, η ιστοσελίδα μπορεί να επανέλθει σε οποιαδήποτε προηγούμενη, πλήρως λειτουργική έκδοση μέσα σε δευτερόλεπτα, αν ποτέ προκύψει κάποιο πρόβλημα.',
                bodyEn: 'Because every update is saved as an immutable snapshot, the site can be reverted to any previous working version in seconds if any issue ever occurs.',
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
                shortEl: 'Πάντα online', shortEn: 'Always online',
                titleEl: 'Παγκόσμια Εφεδρεία & Μέγιστη Διαθεσιμότητα',
                titleEn: 'Global Redundancy & Maximum Uptime',
                bodyEl: 'Η ιστοσελίδα δεν φιλοξενείται σε έναν μόνο server, αλλά διανέμεται σε ένα τεράστιο παγκόσμιο δίκτυο. Αν ένα περιφερειακό data center παρουσιάσει πρόβλημα, η κίνηση ανακατευθύνεται αυτόματα στο πλησιέστερο διαθέσιμο, διασφαλίζοντας τη μέγιστη δυνατή διαθεσιμότητα.',
                bodyEn: 'The site is distributed across a massive global network, not a single server. If one regional data center goes down, traffic is seamlessly rerouted to keep the site online.',
              },
            ];

const Check = ({ big }) => (
  <span className={`inc-check ${big ? 'big' : ''}`} aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  </span>
);

export default function IncludesTech({ service }) {
  const { lang } = useLangStore();
  const L = (el, en) => (lang === 'el' ? el : en);
  const [first, ...more] = service.includes;
  // the 5th include («Για μεγαλύτερες ανάγκες, πολυσέλιδη premium κατασκευή») is not shown here (Angelo, 15 Oct 2026)
  const list = more.slice(0, 3);

  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [seen, setSeen] = useState(false);
  const plate = useRef(null);
  const hover = useRef(false);

  useEffect(() => {
    const el = plate.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setAuto(false); return; }
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!auto || !seen) return;
    const t = setInterval(() => { if (!hover.current && !document.hidden) setActive((a) => (a + 1) % TECH.length); }, 6000);
    return () => clearInterval(t);
  }, [auto, seen]);

  const pick = (i) => { setActive(i); setAuto(false); };

  return (
    <section className="py-24 mv-amb">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-12">
          <span className="section-label">{L('Παροχές', 'What You Get')}</span>
          <h2 className="text-3xl md:text-4xl font-black font-display text-white tracking-tight">
            {L('Τι περιλαμβάνει', "What's Included")}
          </h2>
        </ScrollReveal>

        <div className="grid lg:grid-cols-[1fr_1.08fr] gap-6 items-stretch">
          {/* ── what every website includes ── */}
          <ScrollReveal direction="left" className="h-full">
            <div className="inc-plate h-full flex flex-col">
              <div className="flex items-start gap-4 pb-6 mb-2 border-b border-white/10">
                <Check big />
                <p className="font-display font-bold text-white leading-snug" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.55rem)' }}>
                  {first[lang]}
                </p>
              </div>
              <ul className="divide-y divide-white/[0.07] flex-1 flex flex-col justify-around">
                {list.map((it) => (
                  <li key={it.en} className="flex items-start gap-3.5 py-4">
                    <Check />
                    <span className="text-gray-200 leading-relaxed">{it[lang]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* ── the infrastructure behind it ── */}
          <ScrollReveal direction="right" delay={120} className="h-full">
            <div
              ref={plate}
              className="tech-plate h-full"
              onMouseEnter={() => { hover.current = true; }}
              onMouseLeave={() => { hover.current = false; }}
            >
              <span className="tech-eyebrow">{L('Τεχνικά χαρακτηριστικά', 'Technical features')}</span>
              <h3 className="font-display font-black text-white text-2xl md:text-[1.7rem] tracking-tight mt-2 mb-2">
                {L('Enterprise-Grade Υποδομή', 'Enterprise-Grade Infrastructure')}
              </h3>
              <p className="text-gray-300 text-[0.95rem] leading-relaxed mb-6">
                {L('Η ιστοσελίδα σας τρέχει σε υποδομή επιπέδου μεγάλης επιχείρησης — ασφαλής, γρήγορη, και πάντα online.',
                   'Your website runs on enterprise-level infrastructure — secure, fast, and always online.')}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5" role="tablist" aria-label={L('Τεχνικά χαρακτηριστικά', 'Technical features')}>
                {TECH.map((t, i) => (
                  <button
                    key={t.titleEn}
                    type="button"
                    role="tab"
                    aria-selected={active === i}
                    aria-controls={`tech-panel-${i}`}
                    onClick={() => pick(i)}
                    className={`tech-tab ${active === i ? 'on' : ''}`}
                  >
                    <span className="tech-tab-ico" aria-hidden="true">{t.icon}</span>
                    <span className="tech-tab-txt">{L(t.shortEl, t.shortEn)}</span>
                    {active === i && auto && seen && <span key={`p${active}`} className="tech-tab-bar" aria-hidden="true" />}
                  </button>
                ))}
              </div>

              {/* one description at a time; all share one cell so the plate never jumps */}
              <div className="tech-stage mt-5">
                {TECH.map((t, i) => (
                  <div key={t.titleEn} id={`tech-panel-${i}`} role="tabpanel" aria-hidden={active !== i} className={`tech-panel ${active === i ? 'on' : ''}`}>
                    <div className="flex items-center gap-3 mb-2.5">
                      <span className="tech-panel-ico" aria-hidden="true">{t.icon}</span>
                      <h4 className="text-white font-bold leading-snug">{L(t.titleEl, t.titleEn)}</h4>
                    </div>
                    <p className="text-gray-300 text-[0.93rem] leading-relaxed">{L(t.bodyEl, t.bodyEn)}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
