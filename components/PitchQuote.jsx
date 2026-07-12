// components/PitchQuote.jsx
// Highlighted pitch blockquote — the highest-converting lines of each service.
// Used on every service page hero and on homepage cards (compact variant).
'use client';

export default function PitchQuote({ children, compact = false, className = '' }) {
  if (compact) {
    return (
      <blockquote className={`pitch-quote relative border-l-2 border-electric-cyan/70 pl-4 py-1 my-1 ${className}`}>
        <p className="text-gray-200 text-sm leading-relaxed font-medium italic">{children}</p>
      </blockquote>
    );
  }
  return (
    <blockquote
      className={`pitch-quote relative overflow-hidden rounded-2xl border border-electric-cyan/30 bg-gradient-to-br from-electric-cyan/10 via-electric-cyan/4 to-transparent p-7 md:p-9 shadow-[0_0_40px_rgba(71,200,245,0.1)] ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute -top-3 left-5 text-7xl font-display font-black text-electric-cyan/25 leading-none select-none"
      >
        &ldquo;
      </span>
      <div aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-electric-cyan via-electric-cyan/60 to-transparent" />
      <p className="relative z-10 text-white text-lg md:text-xl leading-relaxed font-semibold pl-4">
        {children}
      </p>
    </blockquote>
  );
}
