// components/GoogleAnalytics.jsx
// Google Analytics 4 (GA4), loaded after the page is interactive.
// Measurement ID: NEXT_PUBLIC_GA_ID (Netlify → Environment variables),
// falling back to the Advon Media property. Measurement IDs are public by
// design — they ship in the page source of every GA4-tagged site.
// page_view is sent manually on every route change, because the App Router
// navigates client-side and GA's automatic page_view only fires on first load.
// (No useSearchParams here on purpose — it would force a Suspense boundary
// and opt static pages out of prerendering; window.location.search is enough.)
'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-2JJP554SVE';

export function gaEvent(name, params) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', name, params || {});
  } catch {}
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const loaded = useRef(false);

  useEffect(() => {
    if (!GA_ID) return;

    if (!loaded.current) {
      loaded.current = true;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', GA_ID, { send_page_view: false });

      const s = document.createElement('script');
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(s);
    }

    window.gtag('event', 'page_view', {
      page_path: `${pathname}${window.location.search}`,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
}
