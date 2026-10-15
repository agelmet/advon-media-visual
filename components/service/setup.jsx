// components/service/setup.jsx
// Shared pieces for the Social Media and Google Ads pages: the illustrated
// 3-step setup (each step next to a drawn phone screen with its time), the
// «total time» band, the «what we never do» lists and small page helpers.
// Every illustration is CSS/SVG only — no images, nothing loaded from outside.
'use client';

import Link from 'next/link';
import { useLangStore } from '@/store/langStore';
import ScrollReveal from '@/components/ScrollReveal';

/* ─── A drawn phone with a light screen (the real apps are light) ─── */
export function Phone({ children, caption, minH = 360, tone = 'white' }) {
  return (
    <div className="svc-phone-wrap">
      <div className="svc-phone">
        <div className="svc-scr" style={{ minHeight: minH, background: tone === 'grey' ? '#f4f6f8' : '#fff' }}>
          <div className="svc-notch" />
          {children}
        </div>
      </div>
      {caption && <div className="svc-illu">{caption}</div>}
    </div>
  );
}

/* ─── The chat page conversation used as step 3 on both pages ─── */
export function ChatMock({ lines, lang }) {
  return (
    <Phone tone="grey" minH={300} caption={lang === 'el' ? 'Η προσωπική σας σελίδα συνομιλίας με την Advon Media' : 'Your personal chat page with Advon Media'}>
      <div className="svc-bar" style={{ background: '#fff' }}>Advon Media<span className="svc-online">● online</span></div>
      <div className="svc-chat">
        {lines.map((l, i) => (
          <div key={i} className={l.me ? 'svc-bub me' : 'svc-bub'}>{l.t}</div>
        ))}
      </div>
    </Phone>
  );
}

/* ─── One numbered step: text on the left, illustration on the right ─── */
export function SetupStep({ n, title, time, children, tip, illustration }) {
  return (
    <ScrollReveal direction={n % 2 ? 'left' : 'right'} className="svc-step">
      <div>
        <h3 className="svc-step-h">
          <span className="svc-n">{n}</span>
          <span>{title}</span>
          <span className="svc-time">{time}</span>
        </h3>
        <div className="svc-step-p">{children}</div>
        {tip && <p className="svc-tip">{tip}</p>}
      </div>
      <div>{illustration}</div>
    </ScrollReveal>
  );
}

export function TotalBand({ total, totalNote, stopTitle, stopBody }) {
  return (
    <ScrollReveal direction="scale">
      <div className="svc-total">
        <div>
          <span className="section-label !mb-1">{total.label}</span>
          <div><b>{total.value}</b> <span className="svc-fine">{totalNote}</span></div>
        </div>
        <div className="svc-total-stop">
          <b>{stopTitle}</b>
          <div>{stopBody}</div>
        </div>
      </div>
    </ScrollReveal>
  );
}

/* ─── Rules: «what we never do» (crosses) / «what always holds» (ticks) ─── */
export function RuleList({ items, kind = 'no' }) {
  return (
    <ul className={`svc-rules ${kind === 'no' ? 'svc-rules-no' : ''}`}>
      {items.map((it, i) => (
        <li key={i}><b>{it.b}</b> {it.t}</li>
      ))}
    </ul>
  );
}

/* ─── Section heading with the small label on top ─── */
export function Head({ label, title, lead, center = false, className = '' }) {
  return (
    <ScrollReveal className={`${center ? 'text-center' : ''} ${className}`}>
      <span className="section-label">{label}</span>
      <h2 className="font-black font-display text-white tracking-tight leading-[1.1] mb-3" style={{ fontSize: 'clamp(1.9rem, 3.6vw, 2.8rem)' }}>
        {title}
      </h2>
      {lead && <p className={`text-gray-400 text-lg leading-relaxed ${center ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>{lead}</p>}
    </ScrollReveal>
  );
}

export function Chips({ items }) {
  return (
    <div className="svc-chips">
      {items.map((c) => (
        <span key={c} className="svc-chip"><i />{c}</span>
      ))}
    </div>
  );
}

/* ─── Price card (same look as the hosting cards) ─── */
export function PriceCard({ tier, price, priceNote, sub, items, cta, href = '#contact', hot = false, badge }) {
  return (
    <div className={`glass-panel card-sweep rounded-3xl p-7 flex flex-col h-full svc-price ${hot ? 'svc-price-hot' : 'border border-white/8'}`}>
      {hot && badge && <span className="svc-badge">{badge}</span>}
      <span className="svc-tier">{tier}</span>
      <div className="svc-amt">{price}<small>{priceNote}</small></div>
      {sub && <div className="svc-sub">{sub}</div>}
      <ul className="svc-list flex-1">
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
      {cta && (
        <Link href={href} className={`btn-premium flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold uppercase text-sm tracking-wide mt-6 transition-colors ${hot ? 'bg-electric-cyan text-[#050608] hover:bg-white' : 'border border-white/20 text-white hover:bg-white hover:text-[#050608]'}`}>
          {cta}
        </Link>
      )}
    </div>
  );
}

/* ─── Key/value rows («Τι κάνουμε σε κάθε post», «Τι στήνουμε, αναλυτικά») ─── */
export function KV({ rows }) {
  return (
    <ScrollReveal>
      <div className="svc-kv">
        {rows.map(([k, v]) => (
          <div key={k} className="svc-kv-row"><div>{k}</div><div>{v}</div></div>
        ))}
      </div>
    </ScrollReveal>
  );
}

export function Stat({ value, label }) {
  return (
    <div className="svc-stat"><b>{value}</b><span>{label}</span></div>
  );
}

export function useLang() {
  return useLangStore((s) => s.lang);
}
