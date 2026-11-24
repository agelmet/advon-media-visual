// components/ThemeToggle.jsx — light / dark switch (24 Nov 2026).
// The choice is kept in localStorage «advon-theme» and applied before the first paint by
// THEME_BOOT in app/layout.jsx (so a light page never flashes dark, or the other way round).
// Dark stays the default for a first visit — it is the brand's own look.
'use client';
import { useEffect, useState } from 'react';
import { useLangStore } from '@/store/langStore';

export function setTheme(t) {
  const d = document.documentElement;
  d.classList.toggle('light', t === 'light');
  d.style.colorScheme = t === 'light' ? 'light' : 'dark';
  try { localStorage.setItem('advon-theme', t); } catch (e) {}
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute('content', t === 'light' ? '#f6f5f1' : '#050608');
  window.dispatchEvent(new Event('advon-theme'));
}

export default function ThemeToggle({ className = '' }) {
  const lang = useLangStore((s) => s.lang);
  const [light, setLight] = useState(false);
  useEffect(() => {
    const sync = () => setLight(document.documentElement.classList.contains('light'));
    sync();
    window.addEventListener('advon-theme', sync);
    return () => window.removeEventListener('advon-theme', sync);
  }, []);
  const label = light
    ? (lang === 'el' ? 'Σκούρο θέμα' : 'Dark mode')
    : (lang === 'el' ? 'Φωτεινό θέμα' : 'Light mode');
  return (
    <button
      type="button"
      onClick={() => setTheme(light ? 'dark' : 'light')}
      className={`theme-toggle ${className}`}
      aria-label={label}
      title={label}
      aria-pressed={light}
    >
      {/* sun (shown in dark mode = «switch to light») / moon (shown in light mode) */}
      <svg className="tt-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
      <svg className="tt-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
    </button>
  );
}
