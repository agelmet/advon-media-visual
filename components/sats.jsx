// components/Stats.jsx
'use client';
import { useEffect, useState, useRef } from 'react';
import { useLangStore } from '@/store/langStore';

// 4-Second Animated Number Counter
const AnimatedCounter = ({ end, suffix = "", duration = 4000, hasTriggered }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (hasTriggered) {
      let start = null;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        
        // Cinematic quartic ease-out deceleration
        const easeOut = 1 - Math.pow(1 - progress, 4); 
        setCount(Math.floor(easeOut * end));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(end); // Ensure it stops exactly on the target
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [end, duration, hasTriggered]);

  return <span>{count}{suffix}</span>;
};

export default function Stats() {
  const { lang } = useLangStore();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer to trigger when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 } // Trigger when 20% visible
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef} 
      className={`py-20 relative z-10 transition-all duration-1000 ease-out cursor-none ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        
        {/* Stat 1 */}
        <div className="stat-card group flex flex-col items-center justify-center cursor-none">
          <div className="text-4xl md:text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:from-electric-cyan group-hover:to-[#c9ff00] mb-3 transition-transform duration-500 group-hover:scale-110 relative z-10">
            <AnimatedCounter end={3} suffix="+" hasTriggered={isVisible} />
          </div>
          <div className="w-8 h-[2px] bg-electric-cyan/40 mb-3 group-hover:w-full group-hover:bg-electric-cyan transition-all duration-500 relative z-10"></div>
          <div className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase relative z-10 group-hover:text-white transition-colors duration-500">
            {lang === 'el' ? 'ΧΡΟΝΙΑ ΕΜΠΕΙΡΙΑΣ' : 'YEARS EXPERIENCE'}
          </div>
        </div>

        {/* Stat 2 */}
        <div className="stat-card group flex flex-col items-center justify-center cursor-none">
          <div className="text-4xl md:text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:from-electric-cyan group-hover:to-[#c9ff00] mb-3 transition-transform duration-500 group-hover:scale-110 relative z-10">
            <AnimatedCounter end={130} suffix="+" hasTriggered={isVisible} />
          </div>
          <div className="w-8 h-[2px] bg-electric-cyan/40 mb-3 group-hover:w-full group-hover:bg-electric-cyan transition-all duration-500 relative z-10"></div>
          <div className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase relative z-10 group-hover:text-white transition-colors duration-500">
            {lang === 'el' ? 'ΠΕΛΑΤΕΣ' : 'CLIENTS'}
          </div>
        </div>

        {/* Stat 3 */}
        <div className="stat-card group flex flex-col items-center justify-center cursor-none">
          <div className="text-4xl md:text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:from-electric-cyan group-hover:to-[#c9ff00] mb-3 transition-transform duration-500 group-hover:scale-110 relative z-10">
            <AnimatedCounter end={100} suffix="%" hasTriggered={isVisible} />
          </div>
          <div className="w-8 h-[2px] bg-electric-cyan/40 mb-3 group-hover:w-full group-hover:bg-electric-cyan transition-all duration-500 relative z-10"></div>
          <div className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase relative z-10 group-hover:text-white transition-colors duration-500">
            {lang === 'el' ? 'ΕΠΙΤΥΧΙΑ' : 'SUCCESS'}
          </div>
        </div>

        {/* Stat 4 */}
        <div className="stat-card group flex flex-col items-center justify-center cursor-none">
          <div className="text-4xl md:text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:from-electric-cyan group-hover:to-[#c9ff00] mb-3 transition-transform duration-500 group-hover:scale-110 relative z-10">
            <AnimatedCounter end={80} suffix="+" hasTriggered={isVisible} />
          </div>
          <div className="w-8 h-[2px] bg-electric-cyan/40 mb-3 group-hover:w-full group-hover:bg-electric-cyan transition-all duration-500 relative z-10"></div>
          <div className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase relative z-10 group-hover:text-white transition-colors duration-500">
            5-STAR REVIEWS
          </div>
        </div>

      </div>
    </section>
  );
}