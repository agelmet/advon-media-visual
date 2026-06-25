// components/Preloader.jsx
'use client';
import { useState, useEffect } from 'react';

const LOGO_URL = 'https://raw.githubusercontent.com/agelmet/Advon-Media/refs/heads/main/logo.png';

// Deterministic star field — avoids hydration mismatch with Math.random()
function makeStars(n) {
  const out = [];
  let s = 42;
  const rng = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < n; i++) {
    out.push({
      x: rng() * 100,
      y: rng() * 100,
      r: 0.5 + rng() * 1.5,
      tw: 1.5 + rng() * 2.5,
      td: rng() * 4,
      df: 9 + rng() * 14,
      dd: rng() * 5,
    });
  }
  return out;
}

const STARS = makeStars(160);

export default function Preloader() {
  const [phase, setPhase] = useState('idle'); // idle | show | fade | done

  useEffect(() => {
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('adv_pl')) return;
    setPhase('show');
    const t1 = setTimeout(() => setPhase('fade'), 2100);
    const t2 = setTimeout(() => {
      setPhase('done');
      sessionStorage.setItem('adv_pl', '1');
    }, 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === 'idle' || phase === 'done') return null;

  const fading = phase === 'fade';

  return (
    <div
      className="preloader"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse 130% 90% at 50% 55%, #0e1d42 0%, #06091e 45%, #020408 100%)',
        opacity: fading ? 0 : 1,
        transition: fading ? 'opacity 0.8s ease' : 'opacity 0.3s ease',
        pointerEvents: fading ? 'none' : 'all',
        userSelect: 'none',
      }}
    >
      {/* Nebula blobs */}
      <div style={{ position:'absolute', top:'12%', left:'5%', width:'clamp(180px,38vw,580px)', height:'clamp(180px,38vw,580px)', background:'radial-gradient(circle, rgba(71,200,245,0.10) 0%, transparent 70%)', filter:'blur(80px)', animation:'pl-neb1 14s ease-in-out infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'8%', right:'4%', width:'clamp(160px,33vw,520px)', height:'clamp(160px,33vw,520px)', background:'radial-gradient(circle, rgba(107,63,160,0.14) 0%, transparent 70%)', filter:'blur(100px)', animation:'pl-neb2 18s ease-in-out infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'35%', left:'35%', width:'clamp(120px,25vw,400px)', height:'clamp(120px,25vw,400px)', background:'radial-gradient(circle, rgba(71,200,245,0.05) 0%, transparent 65%)', filter:'blur(60px)', animation:'pl-neb1 10s ease-in-out infinite reverse', pointerEvents:'none' }} />

      {/* Star field */}
      {STARS.map((st, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: `${st.r}px`,
            height: `${st.r}px`,
            borderRadius: '50%',
            background: 'white',
            opacity: 0.4,
            pointerEvents: 'none',
            animation: `pl-twinkle ${st.tw}s ${st.td}s ease-in-out infinite, pl-drift ${st.df}s ${st.dd}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Logo + orbit rings */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Slow outer orbit */}
        <div style={{ position:'absolute', inset:'-56px', borderRadius:'50%', border:'1px solid rgba(71,200,245,0.12)', animation:'pl-orbit 14s linear infinite reverse', pointerEvents:'none' }}>
          <span style={{ position:'absolute', top:'-3px', left:'50%', transform:'translateX(-50%)', width:'6px', height:'6px', borderRadius:'50%', background:'rgba(107,63,160,0.75)', boxShadow:'0 0 8px rgba(107,63,160,0.9)' }} />
        </div>
        {/* Main orbit */}
        <div style={{ position:'absolute', inset:'-36px', borderRadius:'50%', border:'1px solid rgba(71,200,245,0.28)', animation:'pl-orbit 7.5s linear infinite', pointerEvents:'none' }}>
          <span style={{ position:'absolute', top:'-4px', left:'50%', transform:'translateX(-50%)', width:'8px', height:'8px', borderRadius:'50%', background:'#47c8f5', boxShadow:'0 0 12px #47c8f5, 0 0 24px rgba(71,200,245,0.55)' }} />
        </div>

        {/* Logo */}
        <img
          src={LOGO_URL}
          alt="Advon Media"
          width={128}
          height={128}
          style={{
            display: 'block',
            width: 'clamp(96px, 20vw, 128px)',
            height: 'clamp(96px, 20vw, 128px)',
            borderRadius: '50%',
            objectFit: 'cover',
            animation: 'pl-pulse 2.5s ease-in-out infinite',
          }}
        />
      </div>

      {/* Brand wordmark */}
      <p style={{
        marginTop: 'clamp(64px, 13vw, 84px)',
        color: 'rgba(71,200,245,0.65)',
        fontSize: '0.6rem',
        fontWeight: 900,
        letterSpacing: '0.38em',
        textTransform: 'uppercase',
        zIndex: 10,
        animation: 'pl-fadein 1s 0.4s ease both',
      }}>
        ADVON MEDIA
      </p>
    </div>
  );
}
