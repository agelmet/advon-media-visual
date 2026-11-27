// app/layout.jsx
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import Contact from '@/components/Contact';
import DeferredWidget from '@/components/DeferredWidget';
import ScrollProgress from '@/components/ScrollProgress';
import Spotlight from '@/components/Spotlight';
import Analytics from '@/components/Analytics';
import Motion from '@/components/Motion';
import CookieConsent from '@/components/CookieConsent';
import IntroOverlay from '@/components/IntroOverlay';
import { displayFont, bodyFont } from '@/lib/fonts';

export const metadata = {
  metadataBase: new URL('https://advonmedia.com'),
  title: 'Κατασκευή Ιστοσελίδων & Ψηφιακά Εργαλεία | Advon Media',
  description:
    'Ιστοσελίδες & ψηφιακά εργαλεία για ελληνικές επιχειρήσεις: κατασκευή ιστοσελίδων χωρίς προκαταβολή, κριτικές Google, online ραντεβού, direct booking, AI βοηθός.',
  // The Advon mark on a white tile (27 Nov 2026, from the original logo file): /favicon.ico (16/32/48 —
  // what Google and most browsers ask for first; until now it was still the default Vercel triangle),
  // PNG 48/96/192 (Google wants a square multiple of 48), apple-touch 180, manifest 192/512 + maskable.
  icons: {
    icon: [
      { url: '/img/advon-icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/img/advon-icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/img/advon-icon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/img/advon-icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: { url: '/img/advon-icon-180.png', sizes: '180x180', type: 'image/png' },
  },
  openGraph: {
    siteName: 'Advon Media',
    images: ['/img/advon-icon-512.png'],
  },
};

// Who we are, for Google (27 Nov 2026): the logo Google may show next to the site and in the knowledge
// panel, the site name in results, and the social profiles that belong to the same business.
const ORG_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://advonmedia.com/#org',
      name: 'Advon Media',
      url: 'https://advonmedia.com/',
      logo: { '@type': 'ImageObject', url: 'https://advonmedia.com/img/advon-icon-512.png', width: 512, height: 512 },
      image: 'https://advonmedia.com/img/advon-icon-512.png',
      email: 'angelos@advonmedia.com',
      sameAs: [
        'https://www.instagram.com/advon_media',
        'https://www.facebook.com/people/Advon-Media/61552890781956/',
        'https://www.tiktok.com/@advonmedia',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://advonmedia.com/#website',
      name: 'Advon Media',
      alternateName: ['advonmedia.com', 'Advon'],
      url: 'https://advonmedia.com/',
      inLanguage: 'el',
      publisher: { '@id': 'https://advonmedia.com/#org' },
    },
  ],
};

export const viewport = { themeColor: '#050608' };

// Light / dark (24 Nov 2026): applied before the first paint so the page never flashes the other theme.
const THEME_BOOT = `(function(){try{var t=localStorage.getItem('advon-theme');if(t==='light'&&location.pathname.indexOf('/istoselida')!==0){var d=document.documentElement;d.classList.add('light');d.style.colorScheme='light';var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content','#f6f5f1')}}catch(e){}})();`;

const MV_BOOT = `(function(){var d=document.documentElement;try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('mv-js');var force=/[?&]intro=1/.test(location.search);if(!document.hidden&&(force||!sessionStorage.getItem('advon-intro'))){sessionStorage.setItem('advon-intro','1');d.classList.add('mv-intro');setTimeout(function(){d.classList.remove('mv-intro','mvi-dock')},3000)}}catch(e){}setTimeout(function(){if(!window.__mvOn){var n=document.querySelectorAll('[data-io],main h2');for(var i=0;i<n.length;i++)n[i].classList.add('in')}},6000)})();`;

// Ignition, step 2: at 1.1 s the lockup learns where the header logo is and glides into it.
const MV_DOCK = `(function(){var d=document.documentElement;if(!d.classList.contains('mv-intro'))return;setTimeout(function(){var L=document.getElementById('mvi-lock'),T=document.querySelector('.hd-logo img');if(!L)return;if(T){var a=L.getBoundingClientRect(),b=T.getBoundingClientRect();var dw=b.width,dh=dw*116/195,dt=b.top+(b.height-dh)/2;var cw=dw*.582,ch=dh*.496,cl=b.left+dw*.195,ct=dt+dh*.306;L.style.setProperty('--ds',(cw/a.width).toFixed(4));L.style.setProperty('--dx',((cl+cw/2)-(a.left+a.width/2)).toFixed(1)+'px');L.style.setProperty('--dy',((ct+ch/2)-(a.top+a.height/2)).toFixed(1)+'px')}else{L.style.setProperty('--ds','.3')}d.classList.add('mvi-dock')},1100)})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="el" suppressHydrationWarning className={`scroll-smooth ${displayFont.variable} ${bodyFont.variable}`}>
      <body className="font-body antialiased relative min-h-screen flex flex-col">
        {/* Motion v4 boot: marks JS on <html> before first paint and decides the once-per-session opening */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        <script dangerouslySetInnerHTML={{ __html: MV_BOOT }} />
        <IntroOverlay />
        <Background />
        <ScrollProgress />
        <Spotlight />
        <Motion />
        <Header />
        <main className="relative z-10 pt-28 flex-1">
          {children}
        </main>
        <Contact />
        <Footer />
        {/* Advon AI assistant — loaded after the visitor's first interaction (or a few idle
            seconds) so it never competes with the page's own first paint. */}
        <DeferredWidget />
        {/* Google Analytics 4 — loads after paint; visit /?me=1 once to exclude your own browser. */}
        <Analytics />
        {/* Cookie box — GA + Meta Pixel only after «Αποδοχή» (GDPR, 22 Oct 2026) */}
        <CookieConsent />
        <script dangerouslySetInnerHTML={{ __html: MV_DOCK }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_LD) }} />
      </body>
    </html>
  );
}
