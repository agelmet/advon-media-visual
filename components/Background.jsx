// components/Background.jsx
'use client';
import { useEffect, useRef } from 'react';

export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, stars = [], particles = [], animationFrameId;
    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    const initStars = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      stars = [];

      const numStars = Math.floor((width * height) / 750);

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

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

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

      stars.forEach(star => {
        star.opacity += star.twinkleSpeed * star.twinkleDir;
        if (star.opacity >= 1 || star.opacity <= 0.08) star.twinkleDir *= -1;

        star.y += star.speed;

        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 160) {
          star.x -= (dx / distance) * 0.6;
          star.y -= (dy / distance) * 0.6;
        }

        if (star.y > height) { star.y = 0; star.x = Math.random() * width; }

        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, star.opacity));

        if (star.z > 0.8) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = star.color;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = '#47c8f5';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#47c8f5';

      for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity -= p.life;
        p.size -= 0.02;

        if (p.opacity <= 0 || p.size <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0, p.size), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (mouse.x > -1000) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 280);
        gradient.addColorStop(0, 'rgba(71, 200, 245, 0.07)');
        gradient.addColorStop(0.5, 'rgba(107, 63, 160, 0.03)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 280, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animate);
    };

    initStars();
    animate();

    window.addEventListener('resize', initStars);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', initStars);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ background: '#020406' }}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020406] via-[#050a0e] to-[#081219]" />

      {/* Aurora layer 1 — cyan */}
      <div
        className="absolute gpu-accelerate"
        style={{
          top: '-15%', left: '5%',
          width: '75%', height: '75%',
          background: 'radial-gradient(ellipse at center, rgba(71,200,245,0.07) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'auroraFloat1 18s ease-in-out infinite',
        }}
      />

      {/* Aurora layer 2 — deep violet */}
      <div
        className="absolute gpu-accelerate"
        style={{
          bottom: '-5%', right: '-5%',
          width: '65%', height: '65%',
          background: 'radial-gradient(ellipse at center, rgba(107,63,160,0.08) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'auroraFloat2 24s ease-in-out infinite',
        }}
      />

      {/* Aurora layer 3 — lime accent */}
      <div
        className="absolute gpu-accelerate"
        style={{
          top: '40%', left: '55%',
          width: '45%', height: '55%',
          background: 'radial-gradient(ellipse at center, rgba(201,255,0,0.04) 0%, transparent 70%)',
          filter: 'blur(120px)',
          animation: 'auroraFloat3 30s ease-in-out infinite',
        }}
      />

      {/* Aurora layer 4 — bottom teal */}
      <div
        className="absolute gpu-accelerate"
        style={{
          bottom: '10%', left: '20%',
          width: '50%', height: '40%',
          background: 'radial-gradient(ellipse at center, rgba(71,200,245,0.04) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'auroraFloat1 22s ease-in-out infinite reverse',
        }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
