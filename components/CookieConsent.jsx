// components/CookieConsent.jsx — ONE small box on the first visit («Cookies» · Απόρριψη / Αποδοχή,
// same size and style). «Αποδοχή» loads Google Analytics + the Meta Pixel (components/Analytics.jsx
// listens for the choice); «Απόρριψη» keeps the page exactly as it is. Footer «Ρυθμίσεις cookies»
// reopens it. Private tools (/crm, /api, …) never show it.
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLangStore } from '@/store/langStore';
import { getConsent, setConsent } from '@/lib/consent';

const PRIVATE = ['/crm', '/crm-demo', '/leads', '/api', '/c/', '/ylika'];

export default function CookieConsent() {
  const { lang } = useLangStore();
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const priv = PRIVATE.some((p) => pathname === p || pathname.startsWith(p.endsWith('/') ? p : p + '/'));

  useEffect(() => {
    if (priv) return;
    if (getConsent() === null) {
      // a beat after the first paint, so the hero lands first
      const t = setTimeout(() => setOpen(true), 900);
      return () => clearTimeout(t);
    }
  }, [priv]);

  useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener('advon-consent-open', reopen);
    return () => window.removeEventListener('advon-consent-open', reopen);
  }, []);

  useEffect(() => {
    if (open) { const r = requestAnimationFrame(() => setShown(true)); document.documentElement.dataset.cc = '1'; return () => cancelAnimationFrame(r); }
    setShown(false);
    delete document.documentElement.dataset.cc;
  }, [open]);

  if (priv || !open) return null;

  const choose = (v) => { setConsent(v); setOpen(false); };
  const el = lang === 'el';

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="cc-title" className={`cc-box ${shown ? 'is-in' : ''}`}>
      <div className="cc-head">
        <span className="cc-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg>
        </span>
        <p id="cc-title" className="cc-title">Cookies</p>
      </div>
      <p className="cc-text">
        {el
          ? 'Χρησιμοποιούμε cookies για στατιστικά (Google Analytics) και για τη μέτρηση των διαφημίσεών μας (Meta), μόνο αν συμφωνείτε.'
          : 'We use cookies for statistics (Google Analytics) and to measure our ads (Meta), only if you agree.'}{' '}
        <Link href="/privacy-policy" className="cc-link">{el ? 'Πολιτική cookies' : 'Cookie policy'}</Link>
      </p>
      <div className="cc-btns">
        <button type="button" className="cc-btn" onClick={() => choose('no')}>{el ? 'Απόρριψη' : 'Reject'}</button>
        <button type="button" className="cc-btn" onClick={() => choose('yes')}>{el ? 'Αποδοχή' : 'Accept'}</button>
      </div>
    </div>
  );
}
