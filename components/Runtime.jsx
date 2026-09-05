// components/Runtime.jsx
// The only page-wide client logic: language persistence + the reveal observer.
// Both are tiny, both run after hydration, neither blocks rendering.
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLangStore } from '@/store/langStore';

const LANG_KEY = 'advon_lang';

export default function Runtime() {
  const { lang, setLang } = useLangStore();
  const pathname = usePathname();

  // 1. Language: restore the visitor's choice once, then mirror the store onto <html>.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === 'en' || saved === 'el') setLang(saved);
    } catch {}
  }, [setLang]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dataset.lang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch {}
  }, [lang]);

  // 2. Reveal: content is visible by default; with JS we fade it in slightly before it enters view.
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    root.classList.add('js-reveal');
    const els = Array.from(document.querySelectorAll('.rv:not(.in)'));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 }
    );
    els.forEach((el) => io.observe(el));
    // Safety net: nothing may stay hidden for long, whatever the observer does.
    const t = setTimeout(() => els.forEach((el) => el.classList.add('in')), 1500);
    return () => { io.disconnect(); clearTimeout(t); };
  }, [pathname]);

  return null;
}
