// components/Stats.jsx
'use client';
import { useEffect, useState, useRef } from 'react';
import { useLangStore } from '@/store/langStore';

// The 2.5-second smooth number counter
const AnimatedCounter = ({ end, suffix = "", duration = 2500, hasTriggered }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (hasTriggered) {
      let start = null;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        
        // Ease-out cubic formula for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3); 
        setCount(Math.floor(easeOut * end));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(end); // Stop exactly on the target number
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

  // Intersection Observer to trigger reveal on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 } // Triggers when 20% of section is visible
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef} 
      /* Container fade-in/slide-up reveal effect */
      className={`py-20 border-y border-electric-cyan/10 bg-[#0a1418]/50 backdrop-blur-sm transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        
        {/* Stat 1 */}
        <div className="group flex flex-col items-center">
          <div className="text-4xl md:text-6xl font-black font-display text-electric-cyan mb-2 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_20px_rgba(71,200,245,0.3)]">
            <AnimatedCounter end={3} suffix="+" hasTriggered={isVisible} />
          </div>
          {/* Expanding dividing line on hover */}
          <div className="h-[2px] w-4 bg-electric-cyan/40 mb-2 transition-all duration-300 group-hover:w-16 group-hover:bg-electric-cyan"></div>
          <div className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase transition-colors duration-300 group-hover:text-gray-300">
            {lang === 'el' ? 'ΧΡΟΝΙΑ ΕΜΠΕΙΡΙΑΣ' : 'YEARS EXPERIENCE'}
          </div>
        </div>

        {/* Stat 2 */}
        <div className="group flex flex-col items-center">
          <div className="text-4xl md:text-6xl font-black font-display text-electric-cyan mb-2 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_20px_rgba(71,200,245,0.3)]">
            <AnimatedCounter end={120} suffix="+" hasTriggered={isVisible} />
          </div>
          <div className="h-[2px] w-4 bg-electric-cyan/40 mb-2 transition-all duration-300 group-hover:w-16 group-hover:bg-electric-cyan"></div>
          <div className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase transition-colors duration-300 group-hover:text-gray-300">
            {lang === 'el' ? 'ΠΕΛΑΤΕΣ' : 'CLIENTS'}
          </div>
        </div>

        {/* Stat 3 */}
        <div className="group flex flex-col items-center">
          <div className="text-4xl md:text-6xl font-black font-display text-electric-cyan mb-2 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_20px_rgba(71,200,245,0.3)]">
            <AnimatedCounter end={100} suffix="%" hasTriggered={isVisible} />
          </div>
          <div className="h-[2px] w-4 bg-electric-cyan/40 mb-2 transition-all duration-300 group-hover:w-16 group-hover:bg-electric-cyan"></div>
          <div className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase transition-colors duration-300 group-hover:text-gray-300">
            {lang === 'el' ? 'ΕΠΙΤΥΧΙΑ' : 'SUCCESS'}
          </div>
        </div>

        {/* Stat 4 */}
        <div className="group flex flex-col items-center">
          <div className="text-4xl md:text-6xl font-black font-display text-electric-cyan mb-2 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_20px_rgba(71,200,245,0.3)]">
            <AnimatedCounter end={80} suffix="+" hasTriggered={isVisible} />
          </div>
          <div className="h-[2px] w-4 bg-electric-cyan/40 mb-2 transition-all duration-300 group-hover:w-16 group-hover:bg-electric-cyan"></div>
          <div className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase transition-colors duration-300 group-hover:text-gray-300">
            5-STAR REVIEWS
          </div>
        </div>

      </div>
    </section>
  );
}