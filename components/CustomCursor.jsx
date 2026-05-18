// components/CustomCursor.jsx
'use client';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const moveCursor = (e) => setPosition({ x: e.clientX, y: e.clientY });
    
    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, input, textarea, .cursor-pointer')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div 
      className="fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75 ease-out hidden md:block"
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
      {/* Center glowing dot */}
      <div className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric-cyan transition-all duration-300 ${isHovering ? 'w-1 h-1 opacity-0' : 'w-1.5 h-1.5 opacity-100 shadow-[0_0_10px_#47c8f5]'}`}></div>
      
      {/* Outer snapping ring */}
      <div className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ${isHovering ? 'w-12 h-12 border-electric-cyan bg-electric-cyan/10 backdrop-blur-sm shadow-[0_0_20px_rgba(71,200,245,0.4)]' : 'w-8 h-8 border-electric-cyan/40 shadow-[0_0_10px_rgba(71,200,245,0.1)]'}`}></div>
    </div>
  );
}