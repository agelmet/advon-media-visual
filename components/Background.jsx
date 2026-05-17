// components/Background.jsx
'use client';
import { useEffect, useRef } from 'react';

export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height, stars = [], stardust = [], animationFrameId;
    let mouseX = -1000, mouseY = -1000;

    const initStars = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      stars = [];
      
      // Rolls Royce density: Many small, elegant stars
      const density = width < 768 ? 1200 : 700; 
      const numStars = Math.floor((width * height) / density);
      
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.2 + 0.2, // Smaller, premium sizing
          opacity: Math.random(),
          twinkleSpeed: Math.random() * 0.01 + 0.002, // Slower, elegant twinkle
          twinkleDir: Math.random() > 0.5 ? 1 : -1,
          color: Math.random() > 0.95 ? '#c9ff00' : '#ffffff' // Mostly pristine white, rare lime
        });
      }
    };

    // Track mouse for the interactive Stardust effect
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Generate 3 stardust particles per mouse movement
      for (let i = 0; i < 3; i++) {
        stardust.push({
          x: mouseX + (Math.random() - 0.5) * 20,
          y: mouseY + (Math.random() - 0.5) * 20,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 1,
          speedY: (Math.random() - 0.5) * 1 + 0.5, // Float slightly downwards
          opacity: 1,
          life: Math.random() * 30 + 30 // Lifespan of particle
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw Static Starlight Ceiling
      stars.forEach(star => {
        star.opacity += star.twinkleSpeed * star.twinkleDir;
        if (star.opacity >= 1 || star.opacity <= 0.1) star.twinkleDir *= -1;
        
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, star.opacity));
        ctx.shadowBlur = star.opacity > 0.8 ? 4 : 0;
        ctx.shadowColor = star.color;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Interactive Hover Stardust
      ctx.fillStyle = '#47c8f5';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#47c8f5';
      
      for (let i = stardust.length - 1; i >= 0; i--) {
        let p = stardust[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity -= 1 / p.life;
        p.size -= 0.02;

        if (p.opacity <= 0 || p.size <= 0) {
          stardust.splice(i, 1); // Remove dead particles
        } else {
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0, p.size), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      ctx.shadowBlur = 0; 
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
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
      {/* Luxurious Darker Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#03070a] to-[#050a0e]"></div>
      
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
      
      {/* Subtle Laser Elements */}
      <div className="laser-beam-main gpu-accelerate opacity-40"></div>
      <div className="laser-splash gpu-accelerate opacity-40"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[60vh] bg-[rgba(71,200,245,0.03)] blur-[120px] gpu-accelerate"></div>
    </div>
  );
}