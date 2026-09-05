// components/MetaPixel.jsx
// Meta Pixel, loaded after the page is interactive. Renders nothing unless
// NEXT_PUBLIC_META_PIXEL_ID is set (Netlify → Environment variables).
// Events fired elsewhere: Lead (landing-page form), Schedule (booking).
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function track(event, params) {
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') window.fbq('track', event, params || {});
  } catch {}
}

export default function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (!PIXEL_ID) return;
    if (!window.fbq) {
      /* eslint-disable */
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq('init', PIXEL_ID);
    }
    window.fbq('track', 'PageView');
  }, [pathname]);

  if (!PIXEL_ID) return null;
  return (
    <noscript>
      <img height="1" width="1" style={{ display: 'none' }} alt="" src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`} />
    </noscript>
  );
}
