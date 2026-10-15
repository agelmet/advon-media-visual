// components/Motion.jsx — Motion v4 (Oct 2026): the site-wide «alive» layer.
// Mounted once in the layout. Transform/opacity only, ONE rAF scroll handler,
// IntersectionObserver for the rest, everything off under prefers-reduced-motion
// and in background tabs. Nothing here blocks the first paint.
//
//  • --sp / --sv on <html>: hero progress (0–1 over the first screen) + scroll velocity
//    (.mv-hero-scrub lifts/fades the hero, .mv-skew leans the marquee).
//  • Section headings (every `main h2`): each gets its OWN entrance, cycling
//    mask → light → rise → centre → roll (or the one set with data-fx="…").
//  • [data-lit]: a statement whose words light up one by one as it passes the reading line.
//  • [data-io]: gets .in once in view (strike lines that draw, markers that sweep, icons…).
//  • [data-progress]: gets --p (0–1) while it crosses the screen (step connectors that fill).
//  EL/EN: React owns the original text nodes, so before every language switch they are
//  put back (restore) and the new text is split again.
'use client';

import { useEffect } from 'react';
import { useLangStore } from '@/store/langStore';

const FX = ['mask', 'light', 'rise', 'centre', 'roll'];

/* Split an element's text into word (and optionally letter) spans, keeping a record
   of the original text nodes so they can be handed back to React. */
function split(el, mode) {
  if (el._mv) return;
  const recs = [];
  let i = 0, a = 0;
  const letters = mode === 'centre';
  const walk = (n) => {
    Array.from(n.childNodes).forEach((c) => {
      if (c.nodeType === 3) {
        if (!c.textContent.trim()) return;
        const made = [];
        c.textContent.split(/(\s+)/).forEach((w) => {
          if (!w) return;
          if (/^\s+$/.test(w)) { made.push(document.createTextNode(' ')); return; }
          const ws = document.createElement('span');
          ws.className = 'mv-w';
          if (letters) {
            Array.from(w).forEach((ch) => {
              const s = document.createElement('span');
              s.className = 'mv-u'; s.textContent = ch;
              s.style.setProperty('--a', a++);
              ws.appendChild(s);
            });
          } else {
            const s = document.createElement('span');
            s.className = 'mv-u'; s.textContent = w;
            s.style.setProperty('--i', i++);
            ws.appendChild(s);
          }
          made.push(ws);
        });
        const parent = c.parentNode;
        made.forEach((m) => parent.insertBefore(m, c));
        parent.removeChild(c);
        recs.push({ node: c, made, parent });
      } else if (c.nodeType === 1 && c.tagName !== 'BR' && !c.classList.contains('mv-w')) walk(c);
    });
  };
  walk(el);
  if (letters) {
    // distance from the middle letter, so «centre» opens outwards
    const us = el.querySelectorAll('.mv-u'); const mid = (us.length - 1) / 2;
    us.forEach((u, k) => { u.style.setProperty('--a', Math.abs(k - mid).toFixed(1)); u.style.setProperty('--o', (k - mid) / Math.max(1, mid)); });
  }
  el._mv = recs;
}

function restore(el) {
  if (!el._mv) return;
  el._mv.forEach(({ node, made, parent }) => {
    const first = made.find((m) => m.parentNode === parent);
    if (first) parent.insertBefore(node, first); else parent.appendChild(node);
    made.forEach((m) => m.parentNode && m.parentNode.removeChild(m));
  });
  el._mv = null;
}

export default function Motion() {
  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.__mvOn = true;
    if (reduce) { html.classList.remove('mv-js'); html.classList.add('mv-static'); return; }
    html.classList.add('mv-js');

    /* ── in-view: headings, [data-io] ── */
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    let lit = [], prog = [];
    const prime = () => {
      if (document.hidden) {
        // background tab: show everything plainly, no motion bookkeeping
        document.querySelectorAll('main h2, [data-io]').forEach((e) => e.classList.add('in'));
        return;
      }
      let k = 0;
      document.querySelectorAll('main h2').forEach((h) => {
        if (h.closest('.no-fx') || h.querySelector('.text-shimmer, [class*="bg-clip-text"]')) return;
        const fx = h.dataset.fx || FX[k++ % FX.length];
        if (!h.dataset.mvfx) { h.dataset.mvfx = fx; h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim()); }
        if (!h._mv) { split(h, h.dataset.mvfx); if (!h.classList.contains('in')) io.observe(h); }
      });
      document.querySelectorAll('[data-io]').forEach((e) => { if (!e.classList.contains('in')) io.observe(e); });
      lit = Array.from(document.querySelectorAll('[data-lit]'));
      lit.forEach((e) => { if (!e._mv) { split(e, 'words'); e._w = Array.from(e.querySelectorAll('.mv-u')); e._n = -1; } });
      prog = Array.from(document.querySelectorAll('[data-progress]'));
      onScroll();
    };

    /* ── one scroll handler ── */
    let raf = 0, lastY = window.scrollY, lastT = performance.now(), idle = 0;
    let vh = window.innerHeight;
    const tick = () => {
      raf = 0;
      const y = window.scrollY, now = performance.now();
      html.style.setProperty('--sp', Math.min(1, Math.max(0, y / (vh * 0.9))).toFixed(3));
      const v = Math.max(-6, Math.min(6, ((y - lastY) / Math.max(16, now - lastT)) * 8));
      lastY = y; lastT = now;
      html.style.setProperty('--sv', v.toFixed(2));
      clearTimeout(idle); idle = setTimeout(() => html.style.setProperty('--sv', '0'), 140);
      // statements: words light up between 88% and 40% of the screen
      for (const e of lit) {
        const r = e.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh + 50) continue;
        const p = Math.min(1, Math.max(0, (vh * 0.88 - r.top) / (vh * 0.48 + r.height * 0.6)));
        const n = Math.round(p * e._w.length);
        if (n === e._n) continue;
        e._w.forEach((w, j) => w.classList.toggle('on', j < n));
        e._n = n;
      }
      // progress bars / connectors
      for (const e of prog) {
        const r = e.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) continue;
        const p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.35)));
        e.style.setProperty('--p', p.toFixed(3));
        e.classList.toggle('done', p > 0.98);
        if (!e._at) e._at = Array.from(e.querySelectorAll('[data-at]'));
        e._at.forEach((s) => s.classList.toggle('on', p >= parseFloat(s.dataset.at || 0)));
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const onResize = () => { if (Math.abs(window.innerWidth - (onResize.w || 0)) > 40 || !onResize.w) { vh = window.innerHeight; onResize.w = window.innerWidth; } onScroll(); };
    onResize.w = window.innerWidth;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    prime();
    const unsub = useLangStore.subscribe(() => {
      document.querySelectorAll('main h2, [data-lit]').forEach(restore);
      setTimeout(prime, 60);
    });
    let moTimer = 0;
    const mo = new MutationObserver(() => { clearTimeout(moTimer); moTimer = setTimeout(prime, 120); });
    const main = document.querySelector('main');
    if (main) mo.observe(main, { childList: true, subtree: true });
    const onVis = () => { if (!document.hidden) prime(); };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf); clearTimeout(idle); clearTimeout(moTimer);
      io.disconnect(); mo.disconnect(); unsub(); document.removeEventListener('visibilitychange', onVis);
    };
  }, []);
  return null;
}
