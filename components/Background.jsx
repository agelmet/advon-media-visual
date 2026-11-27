// components/Background.jsx — «Starlight» (Oct 2026), after the Rolls-Royce Starlight Headliner:
// a deep black ceiling with fine fibre-optic stars that breathe softly, an occasional slow
// shooting star, a whisper of warm light from above and a dark vignette.
//
// Lighter version (24 Nov 2026 — Angelo: «reduce animations that make the site a bit laggy»):
//   • the faint dust (~85% of the stars) is painted ONCE on its own canvas and never redrawn
//     until the window is resized — it costs nothing while you scroll;
//   • only the clearly visible stars (~15%) twinkle, on a second canvas, at 20 fps, with the
//     slow scroll parallax; the loop stops when the tab is hidden;
//   • about half the stars of the old version (the look stays dense, the work per frame is
//     roughly a tenth);
//   • light mode (html.light). 24 Nov 2026: slow light beams from above (CSS, .rr-beams).
//     27 Nov 2026 — Angelo: «stars black, shining super nicely and cleanly, as wow as dark mode»:
//     the stars are crisp INK-BLACK points; the brightest are clean eight-point stars that turn
//     slowly and, every few seconds, «glint» (rays stretch, a cyan halo flashes); faint hairline
//     constellations join nearby bright stars; the shooting star is an ink streak;
//   • prefers-reduced-motion: one still frame.
'use client';
import { useEffect, useRef } from 'react';

const TINTS = ['255,246,232', '255,255,255', '232,238,255']; // warm · white · cool fibres
const TINTS_L = ['10,13,20', '30,38,54', '8,122,172'];        // light mode: ink black · graphite · a little cyan

// light mode: a clean eight-point star drawn as solid tapering rays (crisp, no blur)
function makeStarL(rgb, size) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const r = size / 2;
  g.fillStyle = `rgb(${rgb})`;
  const ray = (ang, len, w) => {
    const ca = Math.cos(ang), sa = Math.sin(ang), cp = Math.cos(ang + Math.PI / 2), sp = Math.sin(ang + Math.PI / 2);
    g.beginPath();
    g.moveTo(r + cp * w, r + sp * w);
    g.lineTo(r + ca * len, r + sa * len);
    g.lineTo(r - cp * w, r - sp * w);
    g.lineTo(r - ca * len * 0.08, r - sa * len * 0.08);
    g.closePath(); g.fill();
  };
  for (let k = 0; k < 4; k++) ray(k * Math.PI / 2, r * 0.98, r * 0.06);           // long rays
  for (let k = 0; k < 4; k++) ray(Math.PI / 4 + k * Math.PI / 2, r * 0.4, r * 0.04); // short diagonals
  g.beginPath(); g.arc(r, r, r * 0.075, 0, 6.2832); g.fill();
  return c;
}
// light mode: a crisp small point (hard edge, tiny soft rim)
function makeDot(rgb, size) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const r = size / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.5, `rgba(${rgb},1)`);
  grad.addColorStop(0.72, `rgba(${rgb},0.35)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad; g.fillRect(0, 0, size, size);
  return c;
}

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

const isLight = () => document.documentElement.classList.contains('light');

export default function Background() {
  const dustRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const dust = dustRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !dust) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    const dctx = dust.getContext('2d', { alpha: true });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const glowD = TINTS.map((t) => makeGlow(t, 32));
    const glowL = TINTS_L.map((t) => makeGlow(t, 32));
    const starL = TINTS_L.map((t) => makeStarL(t, 96));
    const dotL = TINTS_L.map((t) => makeDot(t, 16));
    const halo = makeGlow('71,200,245', 64);
    let links = [];                                              // light-mode constellation lines
    let light = isLight(), glow = light ? glowL : glowD, tints = light ? TINTS_L : TINTS, dustN = 0;

    let W = 0, H = 0, stars = [], raf = 0, last = 0, running = false, shot = null;
    let nextShot = performance.now() + 6000 + Math.random() * 8000;
    let scrollY = window.scrollY;

    const paintDust = (n) => {
      dctx.clearRect(0, 0, W, H);
      const buckets = [[], [], []].map(() => Array.from({ length: 6 }, () => []));
      for (let i = 0; i < n; i++) {
        const t = Math.random() > 0.82 ? 2 : Math.random() > 0.45 ? 0 : 1;
        const b = 0.14 + Math.random() * 0.46;
        buckets[t][Math.min(5, (b * 10 - 1.4) | 0)].push(Math.random() * W, Math.random() * H, 0.3 + Math.pow(Math.random(), 2.4) * 0.55);
      }
      for (let t = 0; t < 3; t++) {
        dctx.fillStyle = `rgb(${tints[t]})`;
        for (let k = 0; k < 6; k++) {
          const L = buckets[t][k];
          if (!L.length) continue;
          dctx.globalAlpha = light ? 0.07 + k * 0.05 : 0.16 + k * 0.08;
          dctx.beginPath();
          for (let j = 0; j < L.length; j += 3) { dctx.moveTo(L[j] + L[j + 2], L[j + 1]); dctx.arc(L[j], L[j + 1], L[j + 2], 0, 6.2832); }
          dctx.fill();
        }
      }
      dctx.globalAlpha = 1;
    };

    const init = () => {
      W = window.innerWidth; H = window.innerHeight;
      for (const c of [canvas, dust]) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const area = W * H;
      dustN = Math.floor(area / (coarse ? 1100 : 700));
      paintDust(dustN);                                          // static faint dust
      const n = Math.floor(area / (coarse ? 5200 : 3400));       // the stars that breathe
      stars = [];
      for (let i = 0; i < n; i++) {
        const big = Math.random() > 0.9;                         // a few brighter «feature» fibres
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H * 1.6,                            // taller than the screen, for the parallax
          d: 0.25 + Math.random() * 0.75,                        // depth: deeper fibres move less
          s: big ? 1.2 + Math.random() * 0.6 : 0.75 + Math.random() * 0.35,
          b: big ? 0.95 : 0.7 + Math.random() * 0.3,
          w: 0.35 + Math.random() * 1.3,                         // twinkle speed (rad/s)
          p: Math.random() * 6.283,
          t: Math.random() > 0.82 ? 2 : Math.random() > 0.45 ? 0 : 1,
          big,
        });
      }
      // constellations: join each bright star to its nearest bright neighbours (light mode only)
      links = [];
      const bigs = stars.map((st, i) => (st.big ? i : -1)).filter((i) => i >= 0);
      const deg = new Map();
      for (const i of bigs) {
        const a = stars[i];
        const near = bigs.filter((j) => j !== i).map((j) => [j, Math.hypot(stars[j].x - a.x, stars[j].y - a.y)])
          .filter(([, d]) => d < Math.min(W, 1400) * 0.17).sort((p, q) => p[1] - q[1]).slice(0, 2);
        for (const [j] of near) {
          if (i < j && (deg.get(i) || 0) < 3 && (deg.get(j) || 0) < 3) { links.push([i, j]); deg.set(i, (deg.get(i) || 0) + 1); deg.set(j, (deg.get(j) || 0) + 1); }
        }
      }
      if (reduced) draw(performance.now());
    };

    const draw = (now) => {
      ctx.clearRect(0, 0, W, H);
      const sec = now / 1000;
      const H2 = H * 1.6;
      if (light) { drawLight(sec, H2); if (!reduced) drawShot(now); ctx.globalAlpha = 1; return; }
      for (let i = 0; i < stars.length; i++) {
        const st = stars[i];
        let y = (st.y - scrollY * 0.05 * st.d) % H2; if (y < 0) y += H2;
        if (y > H + 4) continue;
        const a = reduced ? st.b : st.b * (0.55 + 0.45 * Math.sin(sec * st.w + st.p));
        ctx.globalAlpha = Math.max(0, Math.min(1, a));
        const z = st.s * (st.big ? 9 : 5);
        ctx.drawImage(glow[st.t], st.x - z / 2, y - z / 2, z, z);
      }
      if (!reduced) drawShot(now);
      ctx.globalAlpha = 1;
    };

    // light mode: ink stars on paper — crisp points, turning eight-point stars that glint, hairline constellations
    const ys = new Float32Array(4096);
    const drawLight = (sec, H2) => {
      const n = Math.min(stars.length, ys.length);
      for (let i = 0; i < n; i++) {
        const st = stars[i];
        let y = (st.y - scrollY * 0.05 * st.d) % H2; if (y < 0) y += H2;
        ys[i] = y;
      }
      // hairline constellations (only when both ends are on screen and did not wrap apart)
      ctx.lineWidth = 0.6; ctx.strokeStyle = 'rgb(20,28,42)';
      for (const [i, j] of links) {
        const y1 = ys[i], y2 = ys[j];
        if (Math.abs(y1 - y2) > H * 0.4 || (y1 > H + 20 && y2 > H + 20)) continue;
        ctx.globalAlpha = reduced ? 0.12 : 0.07 + 0.06 * (0.5 + 0.5 * Math.sin(sec * 0.4 + i));
        ctx.beginPath(); ctx.moveTo(stars[i].x, y1); ctx.lineTo(stars[j].x, y2); ctx.stroke();
      }
      for (let i = 0; i < n; i++) {
        const st = stars[i], y = ys[i];
        if (y > H + 30) continue;
        const tw = reduced ? 1 : 0.6 + 0.4 * Math.sin(sec * st.w + st.p);
        if (!st.big) {
          ctx.globalAlpha = Math.min(1, st.b * tw);
          const z = st.s * 3.4;
          ctx.drawImage(dotL[st.t], st.x - z / 2, y - z / 2, z, z);
          continue;
        }
        // glint: a sharp pulse every few seconds, different per star
        const gl = reduced ? 0 : Math.pow(Math.max(0, Math.sin(sec * 0.55 * st.w + st.p)), 14);
        if (gl > 0.02) {                                         // the cyan halo that flashes behind it
          const hz = st.s * 34 * (0.6 + gl);
          ctx.globalAlpha = 0.55 * gl;
          ctx.drawImage(halo, st.x - hz / 2, y - hz / 2, hz, hz);
        }
        const z = st.s * 17 * (0.85 + 0.15 * tw + 0.9 * gl);
        const ang = (reduced ? st.p : st.p + sec * 0.12 * (st.w > 1 ? 1 : -1)) % 6.2832;
        ctx.globalAlpha = 0.9;
        ctx.save(); ctx.translate(st.x, y); ctx.rotate(ang);
        ctx.drawImage(starL[st.t], -z / 2, -z / 2, z, z);
        ctx.restore();
      }
    };

    // a slow, thin, warm shooting star — rare, the way the headliner does it
    const drawShot = (now) => {
      if (!shot && now > nextShot) {
        const ltr = Math.random() > 0.5;
        shot = { x: ltr ? W * (0.05 + Math.random() * 0.4) : W * (0.55 + Math.random() * 0.4), y: H * (0.05 + Math.random() * 0.35), vx: (ltr ? 1 : -1) * (4.8 + Math.random() * 2.4), vy: 1.6 + Math.random() * 1.3, life: 1 };
      }
      if (!shot) return;
      const s = shot, len = light ? 26 : 18, c = light ? '14,20,32' : '255,246,232';
      const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * len, s.y - s.vy * len);
      g.addColorStop(0, `rgba(${c},${0.85 * s.life})`);
      g.addColorStop(1, `rgba(${c},0)`);
      ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = light ? 1.4 : 1.1; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * len, s.y - s.vy * len); ctx.stroke();
      ctx.globalAlpha = s.life; if (light) ctx.drawImage(starL[0], s.x - 11, s.y - 11, 22, 22); else ctx.drawImage(glow[0], s.x - 5, s.y - 5, 10, 10);
      s.x += s.vx; s.y += s.vy; s.life -= 0.011;
      if (s.life <= 0 || s.x < -60 || s.x > W + 60 || s.y > H + 60) { shot = null; nextShot = now + 12000 + Math.random() * 14000; }
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (now - last < 50) return; // 20 fps — the twinkle is slow, more frames buy nothing
      last = now;
      draw(now);
    };
    const start = () => { if (!running && !reduced && !document.hidden) { running = true; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const onVis = () => (document.hidden ? stop() : start());
    const onScroll = () => { scrollY = window.scrollY; if (reduced) draw(performance.now()); };
    const onTheme = () => {                                      // repaint the same sky in the other palette
      light = isLight(); glow = light ? glowL : glowD; tints = light ? TINTS_L : TINTS;
      paintDust(dustN); draw(performance.now()); start();
    };

    init();
    let t0 = 0;
    const begin = () => { clearTimeout(t0); start(); canvas.style.opacity = '1'; dust.style.opacity = '1'; };
    if ('requestIdleCallback' in window) { const id = window.requestIdleCallback(begin, { timeout: 700 }); t0 = setTimeout(() => { window.cancelIdleCallback(id); begin(); }, 900); }
    else t0 = setTimeout(begin, 300);
    let rs = 0;
    const onResize = () => { clearTimeout(rs); rs = setTimeout(init, 150); };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('advon-theme', onTheme);
    return () => {
      stop(); clearTimeout(t0); clearTimeout(rs);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('advon-theme', onTheme);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden rr-sky" aria-hidden="true">
      {/* the ceiling: deep black, a whisper of warm light from above, a dark vignette */}
      <div className="absolute inset-0 rr-sky-light" />
      {/* light mode only: slow light beams from above + a soft sun (CSS shows them under html.light) */}
      <div className="absolute inset-0 rr-beams">
        <b className="rr-sun" />
        <i style={{ '--r': '-34deg', '--w': '9vw', '--d': '19s', '--o': '.75' }} />
        <i className="w" style={{ '--r': '-21deg', '--w': '5vw', '--d': '15s', '--o': '.9' }} />
        <i style={{ '--r': '-9deg', '--w': '13vw', '--d': '23s', '--o': '.55' }} />
        <i className="w" style={{ '--r': '4deg', '--w': '6vw', '--d': '17s', '--o': '.85' }} />
        <i style={{ '--r': '16deg', '--w': '10vw', '--d': '21s', '--o': '.7' }} />
        <i className="w" style={{ '--r': '28deg', '--w': '4.5vw', '--d': '14s', '--o': '.9' }} />
        <i style={{ '--r': '39deg', '--w': '8vw', '--d': '25s', '--o': '.6' }} />
      </div>
      <canvas ref={dustRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0, transition: 'opacity 1.4s ease' }} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0, transition: 'opacity 1.4s ease' }} />
      <div className="absolute inset-0 rr-vignette" />
      {/* film grain — static, plain opacity (no blend mode: a blended full-screen layer is re-composited on every scroll) */}
      <div className="absolute inset-0 grain" />
    </div>
  );
}
