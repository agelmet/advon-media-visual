// components/ZohoInline.jsx
// Zoho Bookings inline calendar. `auto` mounts it immediately (thank-you page);
// otherwise it renders a button and loads the embed only when clicked, so the
// third-party script never touches the first paint of the homepage.
'use client';
import { useEffect, useRef, useState } from 'react';
import { useLangStore } from '@/store/langStore';
import { track } from '@/components/MetaPixel';

const ZOHO_EMBED_SCRIPT = 'https://bookings.nimbuspop.com/assets/embed.js';
export const ZOHO_BOOKING_URL = 'https://advonmedia.zohobookings.eu/portal-embed#/264312000000038046';
const SCRIPT_ID = 'zoho-bookings-embed';

export default function ZohoInline({ auto = false, id = 'zoho-booking-inline', height = '640px', className = '' }) {
  const { lang } = useLangStore();
  const [active, setActive] = useState(auto);
  const [loading, setLoading] = useState(false);
  const parentRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    setLoading(true);

    const render = () => {
      if (cancelled) return;
      const parent = parentRef.current;
      if (!parent || !window.Bookings) return;
      parent.innerHTML = '';
      window.Bookings.inlineEmbed({ url: ZOHO_BOOKING_URL, parent: `#${id}`, height });
      setLoading(false);
      // Give the iframe an accessible name once Zoho injects it.
      setTimeout(() => {
        const f = parent.querySelector('iframe');
        if (f && !f.title) f.title = lang === 'el' ? 'Ημερολόγιο ραντεβού Advon Media' : 'Advon Media booking calendar';
      }, 800);
    };

    let script = document.getElementById(SCRIPT_ID);
    if (window.Bookings) render();
    else if (script) script.addEventListener('load', render);
    else {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = ZOHO_EMBED_SCRIPT;
      script.async = true;
      script.addEventListener('load', render);
      document.body.appendChild(script);
    }

    // Best-effort Schedule event: Zoho posts messages from its iframe on booking completion.
    const onMsg = (e) => {
      try {
        const o = String(e.origin || '');
        if (!/zoho|nimbuspop/i.test(o)) return;
        const s = typeof e.data === 'string' ? e.data : JSON.stringify(e.data || '');
        if (/book(ed|ing)[^"]{0,40}(success|confirm|complete)|appointment[^"]{0,40}(booked|confirmed)/i.test(s)) track('Schedule');
      } catch {}
    };
    window.addEventListener('message', onMsg);

    return () => {
      cancelled = true;
      window.removeEventListener('message', onMsg);
      if (script) script.removeEventListener('load', render);
    };
  }, [active, id, height, lang]);

  return (
    <div className={className}>
      {!active && (
        <button type="button" onClick={() => setActive(true)} className="btn-primary w-full sm:w-auto">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          {lang === 'el' ? 'Άνοιγμα ημερολογίου — 10λεπτο τηλεφώνημα' : 'Open the calendar — 10-minute call'}
        </button>
      )}
      {active && loading && (
        <p className="text-sm text-paper-3 mb-3" role="status">{lang === 'el' ? 'Φόρτωση ημερολογίου…' : 'Loading calendar…'}</p>
      )}
      <div id={id} ref={parentRef} className={active ? 'rounded-xl overflow-hidden bg-white' : ''} style={active ? { minHeight: height } : undefined} />
    </div>
  );
}
