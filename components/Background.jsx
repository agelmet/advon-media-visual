// components/Background.jsx — «Starlight» (Oct 2026), after the Rolls-Royce Starlight Headliner:
// a deep black ceiling with fine fibre-optic stars that stay where they are and breathe
// softly, an occasional slow shooting star, a whisper of warm light from above and a
// leather-dark vignette. Nothing falls, nothing chases the mouse, no coloured stars.
//   • stars are drawn in brightness buckets (≈30 fills a frame, not one per star);
//   • 30 fps everywhere (the twinkle is slow, more frames buy nothing), paused when hidden;
//   • a very slow parallax with the scroll gives the ceiling depth;
//   • prefers-reduced-motion: one still frame.
'use client';
import { useEffect, useRef } from 'react';

const TINTS = ['255,246,232', '255,255,255', '232,238,255']; // warm · white · cool fibres

function makeGlow(rgb, size) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const r = size / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.18, `rgba(${rgb},0.85)`);
  grad.addColorStop(0.45, `rgba(${rgb},0.18)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const glow = TINTS.map((t) => makeGlow(t, 32));

    let W = 0, H = 0, stars = [], raf = 0, last = 0, running = false, shot = null;
    let nextShot = performance.now() + 6000 + Math.random() * 8000;
    let scrollY = window.scrollY;

    const init = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.floor((W * H) / (coarse ? 620 : 380));
      stars = [];
      for (let i = 0; i < n; i++) {
        const r = Math.random();
        const big = r > 0.988;                      // ~1 in 80: brighter «feature» fibres
        const mid = !big && r > 0.93;              // a layer of clearly visible stars                       // a few brighter «feature» fibres
        const tint = Math.random() > 0.82 ? 2 : Math.random() > 0.45 ? 0 : 1;
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H * 1.6,                 // taller than the screen, for the parallax
          d: 0.25 + Math.random() * 0.75,             // depth: deeper fibres move less
          s: big ? 1.2 + Math.random() * 0.6 : mid ? 0.75 + Math.random() * 0.35 : 0.3 + Math.pow(Math.random(), 2.4) * 0.6,
          b: big ? 0.95 : mid ? 0.7 + Math.random() * 0.3 : 0.18 + Math.random() * 0.55, // base brightness
          w: 0.35 + Math.random() * 1.3,              // twinkle speed (rad/s)
          p: Math.random() * 6.283,                   // phase
          t: tint,
          big,
        });
      }
      if (reduced) draw(performance.now());
    };

    const draw = (now) => {
      ctx.clearRect(0, 0, W, H);
      const sec = now / 1000;
      const buckets = [[], [], []].map(() => Array.from({ length: 10 }, () => []));
      const H2 = H * 1.6;
      for (let i = 0; i < stars.length; i++) {
        const st = stars[i];
        let y = (st.y - scrollY * 0.05 * st.d) % H2; if (y < 0) y += H2;
        if (y > H + 4) continue;
        const a = reduced ? st.b : st.b * (0.55 + 0.45 * Math.sin(sec * st.w + st.p));
        if (st.big) {
          ctx.globalAlpha = Math.max(0, Math.min(1, a));
          const z = st.s * 9;
          ctx.drawImage(glow[st.t], st.x - z / 2, y - z / 2, z, z);
        } else {
          buckets[st.t][Math.max(0, Math.min(9, (a * 10) | 0))].push(st.x, y, st.s);
        }
      }
      for (let t = 0; t < 3; t++) {
        ctx.fillStyle = `rgb(${TINTS[t]})`;
        for (let k = 0; k < 10; k++) {
          const L = buckets[t][k];
          if (!L.length) continue;
          ctx.globalAlpha = (k + 0.5) / 10;
          ctx.beginPath();
          for (let j = 0; j < L.length; j += 3) { ctx.moveTo(L[j] + L[j + 2], L[j + 1]); ctx.arc(L[j], L[j + 1], L[j + 2], 0, 6.2832); }
          ctx.fill();
        }
      }
      if (!reduced) drawShot(now);
      ctx.globalAlpha = 1;
    };

    // a slow, thin, warm shooting star — rare, the way the headliner does it
    const drawShot = (now) => {
      if (!shot && now > nextShot) {
        const ltr = Math.random() > 0.5;
        shot = { x: ltr ? W * (0.05 + Math.random() * 0.4) : W * (0.55 + Math.random() * 0.4), y: H * (0.05 + Math.random() * 0.35), vx: (ltr ? 1 : -1) * (3.2 + Math.random() * 1.6), vy: 1.1 + Math.random() * 0.9, life: 1 };
      }
      if (!shot) return;
      const s = shot, len = 26;
      const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * len, s.y - s.vy * len);
      g.addColorStop(0, `rgba(255,246,232,${0.85 * s.life})`);
      g.addColorStop(1, 'rgba(255,246,232,0)');
      ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 1.1; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * len, s.y - s.vy * len); ctx.stroke();
      ctx.globalAlpha = s.life; ctx.drawImage(glow[0], s.x - 5, s.y - 5, 10, 10);
      s.x += s.vx; s.y += s.vy; s.life -= 0.0075;
      if (s.life <= 0 || s.x < -60 || s.x > W + 60 || s.y > H + 60) { shot = null; nextShot = now + 9000 + Math.random() * 11000; }
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (now - last < 33) return; // 30 fps
      last = now;
      draw(now);
    };
    const start = () => { if (!running && !reduced) { running = true; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const onVis = () => (document.hidden ? stop() : start());
    const onScroll = () => { scrollY = window.scrollY; if (reduced) draw(performance.now()); };

    init();
    let t0 = 0;
    const begin = () => { clearTimeout(t0); start(); canvas.style.opacity = '1'; };
    if ('requestIdleCallback' in window) { const id = window.requestIdleCallback(begin, { timeout: 700 }); t0 = setTimeout(() => { window.cancelIdleCallback(id); begin(); }, 900); }
    else t0 = setTimeout(begin, 300);
    window.addEventListener('resize', init);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    return () => {
      stop(); clearTimeout(t0);
      window.removeEventListener('resize', init);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden rr-sky" aria-hidden="true">
      {/* the ceiling: deep black, a whisper of warm light from above, a dark vignette */}
      <div className="absolute inset-0 rr-sky-light" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0, transition: 'opacity 1.4s ease' }} />
      <div className="absolute inset-0 rr-vignette" />
      {/* film grain — the black reads like fine leather, not like a screen */}
      <div className="absolute inset-0 grain" />
    </div>
  );
}
