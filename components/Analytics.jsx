// components/Analytics.jsx
// Google Analytics 4 for advonmedia.com.
//
// - Loads only after the page has fully painted (window `load` + idle), so it
//   never touches LCP / the performance budget.
// - Counts every page change of the app router (Next only fires the first one).
// - Self-exclusion: open https://advonmedia.com/?me=1 once in a browser and that
//   browser is never counted again (flag stored in localStorage). Works for
//   Angelo's Mac, phone, and any tester — no IP rules needed.
// - Skips the CRM and the lead inbox paths (private tools, not visitors).
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const GA_ID = 'G-2JJP554SVE';
const ME_KEY = 'advon_me';
const PRIVATE = ['/crm', '/crm-demo', '/leads', '/api'];

function isMe() {
  try {
    if (new URLSearchParams(window.location.search).get('me') === '1') {
      localStorage.setItem(ME_KEY, '1');
      // Drop the ?me=1 from the address bar so it is not shared by accident.
      const clean = window.location.pathname + window.location.hash;
      window.history.replaceState(null, '', clean);
    }
    return localStorage.getItem(ME_KEY) === '1';
  } catch {
    return false;
  }
}

function isPrivate(pathname) {
  return PRIVATE.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export default function Analytics() {
  const pathname = usePathname();

  // Load gtag once, after the page is idle.
  useEffect(() => {
    if (isMe() || isPrivate(pathname || '/')) return;
    if (document.getElementById('ga4-script')) return;

    const load = () => {
      if (document.getElementById('ga4-script')) return;
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag('js', new Date());
      // send_page_view false: we send page views ourselves on every route change.
      gtag('config', GA_ID, { send_page_view: false, anonymize_ip: true });
      gtag('event', 'page_view', { page_path: window.location.pathname + window.location.search });

      const s = document.createElement('script');
      s.id = 'ga4-script';
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      s.async = true;
      document.head.appendChild(s);
    };

    const idle = () => (window.requestIdleCallback ? window.requestIdleCallback(load, { timeout: 4000 }) : setTimeout(load, 1500));
    if (document.readyState === 'complete') idle();
    else window.addEventListener('load', idle, { once: true });
    return () => window.removeEventListener('load', idle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Page view on every in-app navigation after the first.
  useEffect(() => {
    if (!window.gtag || !pathname || isPrivate(pathname)) return;
    window.gtag('event', 'page_view', { page_path: pathname + window.location.search });
  }, [pathname]);

  return null;
}
