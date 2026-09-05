/** @type {import('next').NextConfig} */

const NO_STORE = [
  { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, max-age=0' },
  { key: 'Pragma', value: 'no-cache' },
  { key: 'Expires', value: '0' },
];

// Third parties the site legitimately talks to. Keep this list in sync when
// adding an embed; anything not listed is blocked by the browser.
const ZOHO = 'https://*.zohobookings.eu https://*.zohobookings.com https://*.zoho.eu https://*.zoho.com https://*.zohostatic.eu https://*.zohostatic.com https://bookings.nimbuspop.com https://*.nimbuspop.com';
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://advon-services.vercel.app https://connect.facebook.net https://www.googletagmanager.com ${ZOHO}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  `connect-src 'self' https://advon-services.vercel.app https://formspree.io https://connect.facebook.net https://www.facebook.com https://api.github.com https://raw.githubusercontent.com https://fonts.googleapis.com https://fonts.gstatic.com ${ZOHO}`,
  `frame-src 'self' https://www.facebook.com https://www.google.com https://maps.google.com https://advon-services.vercel.app ${ZOHO}`,
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self' https://formspree.io",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const SECURITY = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
];

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.cdn.filesafe.space' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
    ],
  },
  async headers() {
    return [
      { source: '/:path*', headers: SECURITY },
      // The CRM shell and its endpoints must never be cached — a stale copy
      // on a second device is a data-loss risk, not just a display bug.
      { source: '/crm/:path*', headers: NO_STORE },
      { source: '/api/crm', headers: NO_STORE },
      { source: '/api/lead', headers: NO_STORE },
      { source: '/img/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      { source: '/og/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800' }] },
    ];
  },
};
export default nextConfig;
