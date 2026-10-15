// components/Motion.jsx — Motion v3 (Oct 2026): the site-wide «alive» layer.
// Mounted once in the layout. Everything is transform/opacity, one rAF scroll
// handler, IntersectionObserver for the rest, and it all switches off under
// prefers-reduced-motion. Nothing here blocks the first paint.
//
//  1. --sp / --sv on <html>: hero scroll progress (0–1 over the first screen)
//     and scroll velocity, read by CSS (.mv-hero-scrub, .mv-skew).
//  2. Letter cascade on every section <h2> (life layer v4): letters slide in
//     one after another when the heading reaches the viewport. Re-applied when
//     the EL/EN toggle re-renders the heading text.
//  3. Magnetic buttons: .btn-premium leans towards the pointer (mouse only).
'use client';

import { useEffect } from 'react';
import { useLangStore } from '@/store/langStore';

/* Split a heading into letter spans. React still owns the original text nodes
   (it updates their nodeValue on EL/EN), so we keep them and put them back
   before every re-render — see restore(). */
function split(h) {
  if (h.querySelector('.lc-c')) return;
  h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
  let i = 0;
  const recs = [];
  const walk = (n) => {
    Array.from(n.childNodes).forEach((c) => {
      if (c.nodeType === 3) {
        if (!c.textContent.trim()) return;
        const made = [];
        c.textContent.split(/(\s+)/).forEach((w) => {
          if (!w) return;
          if (/^\s+$/.test(w)) { made.push(document.createTextNode(' ')); return; }
          const ws = document.createElement('span'); ws.className = 'lc-w'; ws.setAttribute('aria-hidden', 'true');
          Array.from(w).forEach((ch) => { const s = document.createElement('span'); s.className = 'lc-c'; s.style.setProperty('--i', i++); s.textContent = ch; ws.appendChild(s); });
          made.push(ws);
        });
        const parent = c.parentNode;
        made.forEach((m) => parent.insertBefore(m, c));
        parent.removeChild(c);
        recs.push({ node: c, made, parent });
      } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
    });
  };
  walk(h);
  h._lc = recs;
}

function restore(h) {
  if (!h._lc) return;
  h._lc.forEach(({ node, made, parent }) => {
    const first = made.find((m) => m.parentNode === parent);
    if (first) parent.insertBefore(node, first);
    else parent.appendChild(node);
    made.forEach((m) => m.parentNode && m.parentNode.removeChild(m));
  });
  h._lc = null;
}

export default function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const html = document.documentElement;
    if (reduce) return;

    /* 1. scroll progress + velocity */
    let raf = 0, lastY = window.scrollY, lastT = performance.now(), idle = 0;
    const tick = () => {
      raf = 0;
      const y = window.scrollY, now = performance.now();
      const sp = Math.min(1, Math.max(0, y / (window.innerHeight * 0.9)));
      const v = Math.max(-6, Math.min(6, (y - lastY) / Math.max(16, now - lastT) * 8));
      lastY = y; lastT = now;
      html.style.setProperty('--sp', sp.toFixed(3));
      html.style.setProperty('--sv', v.toFixed(2));
      clearTimeout(idle);
      idle = setTimeout(() => html.style.setProperty('--sv', '0'), 120);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener('scroll', onScroll, { passive: true });
    tick();

    /* 2. letter cascade on section headings */
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    const prime = () => {
      if (document.hidden) return; // background tab: leave headings plain and visible
      document.querySelectorAll('main h2').forEach((h) => {
        if (h.closest('.no-lc') || h.querySelector('.text-shimmer, [class*="bg-clip-text"]')) return;
        if (!h.classList.contains('lc')) { h.classList.add('lc'); split(h); io.observe(h); }
        else if (!h.querySelector('.lc-c')) { split(h); h.classList.remove('in'); io.observe(h); } // text re-rendered (EL/EN)
      });
    };
    prime();
    /* EL/EN toggle: give React its text nodes back, then split the new text */
    const unsub = useLangStore.subscribe(() => {
      document.querySelectorAll('main h2.lc').forEach(restore);
      setTimeout(prime, 60);
    });
    let moTimer = 0;
    const mo = new MutationObserver(() => { clearTimeout(moTimer); moTimer = setTimeout(prime, 80); });
    const main = document.querySelector('main');
    if (main) mo.observe(main, { childList: true, subtree: true, characterData: true });

    /* 3. magnetic buttons */
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let mag = null;
    const onMove = (e) => {
      const b = e.target.closest ? e.target.closest('.btn-premium:not([data-no-mag])') : null;
      if (mag && mag !== b) { mag.style.transform = ''; mag = null; }
      if (!b) return;
      mag = b;
      const r = b.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / r.width, y = (e.clientY - r.top - r.height / 2) / r.height;
      b.style.transform = `translate(${(x * 10).toFixed(1)}px, ${(y * 8).toFixed(1)}px)`;
    };
    const onLeave = () => { if (mag) { mag.style.transform = ''; mag = null; } };
    if (fine) { document.addEventListener('mousemove', onMove, { passive: true }); document.addEventListener('mouseleave', onLeave); }

    return () => {
      window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); clearTimeout(idle);
      io.disconnect(); mo.disconnect(); clearTimeout(moTimer); unsub();
      if (fine) { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseleave', onLeave); }
    };
  }, []);
  return null;
}
