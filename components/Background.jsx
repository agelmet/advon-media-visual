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
      
      // Deep luxury density
      const numStars = Math.floor((width * height) / 800);
      
      for (let i = 0; i < numStars; i++) {
        const depth = Math.random(); 
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: depth,
          size: depth * 1.5 + 0.2, // Tiny elegant stars
          opacity: Math.random(),
          speed: depth * 0.3 + 0.05, // Very slow, majestic fall
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          twinkleDir: Math.random() > 0.5 ? 1 : -1,
          color: Math.random() > 0.95 ? '#c9ff00' : '#ffffff' 
        });
      }
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Smooth mouse interpolation (luxury cursor feel)
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Add fluid trail particles
      if (Math.abs(mouse.targetX - mouse.x) > 1 || Math.abs(mouse.targetY - mouse.y) > 1) {
        particles.push({
          x: mouse.x + (Math.random() - 0.5) * 10,
          y: mouse.y + (Math.random() - 0.5) * 10,
          size: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: Math.random() * 0.5 + 0.5,
          opacity: 0.8,
          life: 0.02 // Fades out quickly
        });
      }
      
      // Draw Stars
      stars.forEach(star => {
        star.opacity += star.twinkleSpeed * star.twinkleDir;
        if (star.opacity >= 1 || star.opacity <= 0.1) star.twinkleDir *= -1;
        
        star.y += star.speed;
        
        // Stars gently move away from mouse
        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 150) {
          star.x -= (dx / distance) * 0.5;
          star.y -= (dy / distance) * 0.5;
        }

        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width; 
        }
        
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, star.opacity));
        
        // Subtle glow for front stars
        if (star.z > 0.8) {
            ctx.shadowBlur = 5;
            ctx.shadowColor = star.color;
        } else {
            ctx.shadowBlur = 0;
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Interactive Stardust Trail
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

      // Draw Mouse Flashlight Glow
      if (mouse.x > -1000) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 250);
        gradient.addColorStop(0, 'rgba(71, 200, 245, 0.08)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 250, 0, Math.PI * 2);
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
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020406]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020406] via-[#050a0e] to-[#081219]"></div>
      
      {/* Slow pulsing nebula effect */}
      <div className="absolute top-0 left-1/4 w-3/4 h-[80vh] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[rgba(71,200,245,0.06)] via-transparent to-transparent blur-[100px] animate-glow-pulse gpu-accelerate"></div>
      
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
      
      <div className="laser-beam-main gpu-accelerate opacity-20"></div>
      <div className="laser-splash gpu-accelerate opacity-20"></div>
    </div>
  );
}