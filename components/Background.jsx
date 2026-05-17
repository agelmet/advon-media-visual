// components/Background.jsx
'use client';
import { useEffect, useRef } from 'react';

export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height, stars = [], animationFrameId;

    const initStars = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      stars = [];
      
      const density = width < 768 ? 2000 : 1000; 
      const numStars = Math.floor((width * height) / density);
      
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2.5 + 0.5, // Larger stars for more visibility
          opacity: Math.random(),
          speed: Math.random() * 0.8 + 0.2, // Faster downward falling
          twinkleSpeed: Math.random() * 0.05 + 0.01, // Faster shining
          twinkleDir: Math.random() > 0.5 ? 1 : -1,
          color: Math.random() > 0.85 ? '#c9ff00' : '#47c8f5' // Brand colors
        });
      }
    };

    const animateStars = () => {
      ctx.clearRect(0, 0, width, height);
      
      stars.forEach(star => {
        // High intensity shining
        star.opacity += star.twinkleSpeed * star.twinkleDir;
        if (star.opacity >= 1 || star.opacity <= 0) star.twinkleDir *= -1;
        
        // Falling downwards (+= instead of -=)
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0; // Reset to top when it falls off bottom
          star.x = Math.random() * width; // Randomize X position again
        }
        
        ctx.fillStyle = star.color;
        // Intense glow
        ctx.globalAlpha = Math.max(0, Math.min(1, star.opacity));
        ctx.shadowBlur = star.size * 3;
        ctx.shadowColor = star.color;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.shadowBlur = 0; // Reset
      ctx.globalAlpha = 1; 
      animationFrameId = requestAnimationFrame(animateStars);
    };

    initStars();
    animateStars();

    const handleResize = () => initStars();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050a0e]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050a0e] via-[#0a1418] to-[#0d1a20]"></div>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
      <div className="laser-beam-main gpu-accelerate"></div>
      <div className="laser-splash gpu-accelerate"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[60vh] bg-[rgba(71,200,245,0.06)] blur-[120px] gpu-accelerate"></div>
      <div className="absolute bottom-1/4 left-0 w-1/2 h-1/2 bg-[rgba(71,200,245,0.04)] blur-[150px] rounded-full gpu-accelerate"></div>
    </div>
  );
}