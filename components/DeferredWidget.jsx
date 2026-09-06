// components/DeferredWidget.jsx
// The Advon AI chat widget is loaded only after the visitor's first interaction
// (or after a few idle seconds), so it never competes with the page's own load.
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SRC = 'https://advon-services.vercel.app/widget.js';

export default function DeferredWidget() {
  const pathname = usePathname();
  const isLP = pathname?.startsWith('/dorean-istoselida'); // (future ads landing page)

  useEffect(() => {
    if (isLP) return; // the landing page has one job: the form
    if (document.getElementById('advon-widget-script')) return;
    let done = false;
    const load = () => {
      if (done) return;
      done = true;
      const s = document.createElement('script');
      s.id = 'advon-widget-script';
      s.src = SRC;
      s.async = true;
      s.setAttribute('data-site-id', 'advon');
      document.body.appendChild(s);
      cleanup();
    };
    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll'];
    const cleanup = () => events.forEach((e) => window.removeEventListener(e, load));
    events.forEach((e) => window.addEventListener(e, load, { passive: true, once: true }));
    const t = setTimeout(load, 7000);
    return () => { cleanup(); clearTimeout(t); };
  }, [isLP]);

  return null;
}
