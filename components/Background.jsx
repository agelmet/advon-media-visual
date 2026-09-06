// components/Background.jsx
// The starfield everybody knows — same stars, same twinkle, same drift, same aurora —
// rebuilt to cost a fraction of the CPU:
//   • glow stars are pre-rendered sprites (canvas shadowBlur on every star every frame was
//     the single most expensive thing on the page), the rest are plain dots;
//   • the aurora blobs are wide radial gradients instead of 80–120px blur filters, so the
//     GPU only moves layers instead of re-blurring them;
//   • the loop pauses while the tab is hidden, runs at 30fps on touch devices, and skips
//     the mouse particles where there is no mouse;
//   • plus two premium touches that were not there before: an occasional shooting star and
//     a faint film grain over everything.
'use client';
import { useEffect, useRef } from 'react';

function makeSprite(color, size) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const r = size / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, color);
  grad.addColorStop(0.35, color);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
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
    const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const frameGap = coarse ? 1000 / 30 : 0;

    let width, height, stars = [], particles = [], shooting = null, raf = 0, last = 0, running = false;
    let nextShot = performance.now() + 5000 + Math.random() * 6000;
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    const batches = {};
    const sprites = {
      '#ffffff': makeSprite('rgba(255,255,255,1)', 24),
      '#c9ff00': makeSprite('rgba(201,255,0,1)', 24),
      'rgba(147,51,234,0.8)': makeSprite('rgba(147,51,234,0.9)', 24),
      particle: makeSprite('rgba(71,200,245,1)', 20),
    };

    const initStars = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      stars = [];
      const numStars = Math.floor((width * height) / (coarse ? 1050 : 750));
      for (let i = 0; i < numStars; i++) {
        const depth = Math.random();
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: depth,
          size: depth * 1.6 + 0.15,
          opacity: Math.random(),
          speed: depth * 0.25 + 0.04,
          twinkleSpeed: Math.random() * 0.012 + 0.004,
          twinkleDir: Math.random() > 0.5 ? 1 : -1,
          color: Math.random() > 0.97 ? '#c9ff00' : Math.random() > 0.94 ? 'rgba(147,51,234,0.8)' : '#ffffff',
        });
      }
    };

    const handleMouseMove = (e) => { mouse.targetX = e.clientX; mouse.targetY = e.clientY; };

    const drawShooting = (now) => {
      if (!shooting && now > nextShot && !reduced) {
        const fromLeft = Math.random() > 0.5;
        shooting = {
          x: fromLeft ? -40 : width * (0.4 + Math.random() * 0.6),
          y: Math.random() * height * 0.45,
          vx: (fromLeft ? 1 : -1) * (9 + Math.random() * 5),
          vy: 3 + Math.random() * 2.5,
          life: 1,
        };
      }
      if (!shooting) return;
      const s = shooting;
      const tail = 110;
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * tail / 10, s.y - s.vy * tail / 10);
      grad.addColorStop(0, `rgba(255,255,255,${0.9 * s.life})`);
      grad.addColorStop(0.3, `rgba(71,200,245,${0.55 * s.life})`);
      grad.addColorStop(1, 'rgba(71,200,245,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * tail / 10, s.y - s.vy * tail / 10);
      ctx.stroke();
      ctx.drawImage(sprites['#ffffff'], s.x - 5, s.y - 5, 10, 10);
      s.x += s.vx; s.y += s.vy; s.life -= 0.012;
      if (s.life <= 0 || s.x < -200 || s.x > width + 200 || s.y > height + 100) {
        shooting = null;
        nextShot = now + 7000 + Math.random() * 9000;
      }
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (frameGap && now - last < frameGap) return;
      last = now;

      ctx.clearRect(0, 0, width, height);

      if (hasMouse) {
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;
        if (Math.abs(mouse.targetX - mouse.x) > 1 || Math.abs(mouse.targetY - mouse.y) > 1) {
          particles.push({
            x: mouse.x + (Math.random() - 0.5) * 10,
            y: mouse.y + (Math.random() - 0.5) * 10,
            size: Math.random() * 1.5 + 0.5,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: Math.random() * 0.5 + 0.5,
            opacity: 0.8,
            life: 0.02,
          });
        }
      }

      // Plain stars are batched: one fill per (colour, brightness step) instead of one per star.
      // Glow stars (the deep ones) are drawn from their pre-rendered sprite.
      for (const k in batches) batches[k].length = 0;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        if (!reduced) {
          star.opacity += star.twinkleSpeed * star.twinkleDir;
          if (star.opacity >= 1 || star.opacity <= 0.08) star.twinkleDir *= -1;
          star.y += star.speed;
        }
        if (hasMouse) {
          const dx = mouse.x - star.x;
          const dy = mouse.y - star.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 25600) { // 160px
            const distance = Math.sqrt(d2) || 1;
            star.x -= (dx / distance) * 0.6;
            star.y -= (dy / distance) * 0.6;
          }
        }
        if (star.y > height) { star.y = 0; star.x = Math.random() * width; }

        if (star.z > 0.8) {
          ctx.globalAlpha = Math.max(0, Math.min(1, star.opacity));
          const s = star.size * 4.2; // sprite includes its own glow halo
          ctx.drawImage(sprites[star.color], star.x - s / 2, star.y - s / 2, s, s);
        } else {
          const bucket = Math.max(0, Math.min(9, (star.opacity * 10) | 0));
          (batches[star.color + bucket] || (batches[star.color + bucket] = [])).push(star);
        }
      }
      for (const k in batches) {
        const list = batches[k];
        if (!list.length) continue;
        ctx.fillStyle = list[0].color;
        ctx.globalAlpha = (parseInt(k.slice(-1), 10) + 0.5) / 10;
        ctx.beginPath();
        for (let i = 0; i < list.length; i++) { const st = list[i]; ctx.moveTo(st.x + st.size, st.y); ctx.arc(st.x, st.y, st.size, 0, 6.2832); }
        ctx.fill();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX; p.y += p.speedY; p.opacity -= p.life; p.size -= 0.02;
        if (p.opacity <= 0 || p.size <= 0) { particles.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(0, p.opacity);
        const s = Math.max(0, p.size) * 6;
        ctx.drawImage(sprites.particle, p.x - s / 2, p.y - s / 2, s, s);
      }

      if (hasMouse && mouse.x > -1000) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 280);
        gradient.addColorStop(0, 'rgba(71, 200, 245, 0.07)');
        gradient.addColorStop(0.5, 'rgba(107, 63, 160, 0.03)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 280, 0, Math.PI * 2);
        ctx.fill();
      }

      drawShooting(now);
      ctx.globalAlpha = 1;
    };

    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const onVisibility = () => (document.hidden ? stop() : start());

    initStars();
    // The first frame of the page is the dark gradient; the stars fade in a moment later so
    // the headline and buttons are never waiting behind the animation loop.
    let startTimer = 0;
    const begin = () => { clearTimeout(startTimer); start(); canvas.style.opacity = '1'; };
    if ('requestIdleCallback' in window) { const id = window.requestIdleCallback(begin, { timeout: 900 }); startTimer = setTimeout(() => { window.cancelIdleCallback(id); begin(); }, 1200); }
    else startTimer = setTimeout(begin, 350);
    window.addEventListener('resize', initStars);
    if (hasMouse) window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      clearTimeout(startTimer);
      window.removeEventListener('resize', initStars);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ background: '#020406' }}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020406] via-[#050a0e] to-[#081219]" />

      {/* Aurora layers — identical placement and colours, drawn as wide soft gradients
          (no blur filter to recompute), moved by transform only. */}
      <div className="absolute aurora" style={{ top: '-22%', left: '-2%', width: '90%', height: '90%', background: 'radial-gradient(ellipse at center, rgba(71,200,245,0.065) 0%, rgba(71,200,245,0.035) 30%, rgba(71,200,245,0.012) 55%, transparent 72%)', animation: 'auroraFloat1 18s ease-in-out infinite' }} />
      <div className="absolute aurora" style={{ bottom: '-12%', right: '-12%', width: '80%', height: '80%', background: 'radial-gradient(ellipse at center, rgba(107,63,160,0.075) 0%, rgba(107,63,160,0.04) 30%, rgba(107,63,160,0.012) 55%, transparent 72%)', animation: 'auroraFloat2 24s ease-in-out infinite' }} />
      <div className="absolute aurora" style={{ top: '32%', left: '48%', width: '60%', height: '70%', background: 'radial-gradient(ellipse at center, rgba(201,255,0,0.035) 0%, rgba(201,255,0,0.018) 30%, rgba(201,255,0,0.006) 55%, transparent 72%)', animation: 'auroraFloat3 30s ease-in-out infinite' }} />
      <div className="absolute aurora" style={{ bottom: '2%', left: '12%', width: '65%', height: '55%', background: 'radial-gradient(ellipse at center, rgba(71,200,245,0.038) 0%, rgba(71,200,245,0.02) 30%, rgba(71,200,245,0.007) 55%, transparent 72%)', animation: 'auroraFloat1 22s ease-in-out infinite reverse' }} />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" style={{ opacity: 0, transition: 'opacity 1.1s ease' }} />

      {/* Film grain — a static 4% texture that makes the black feel like film, not a screen. */}
      <div className="absolute inset-0 grain" aria-hidden="true" />
    </div>
  );
}
