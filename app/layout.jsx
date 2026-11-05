// app/layout.jsx
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import Contact from '@/components/Contact';
import CustomCursor from '@/components/CustomCursor';
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
  icons: {
    icon: [
      { url: '/img/advon-icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/img/advon-icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
    apple: '/img/advon-icon-180.png',
  },
  openGraph: {
    siteName: 'Advon Media',
    images: ['/img/advon-icon-512.png'],
  },
};

const MV_BOOT = `(function(){var d=document.documentElement;try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('mv-js');var force=/[?&]intro=1/.test(location.search);if(!document.hidden&&(force||!sessionStorage.getItem('advon-intro'))){sessionStorage.setItem('advon-intro','1');d.classList.add('mv-intro');setTimeout(function(){d.classList.remove('mv-intro','mvi-dock')},3000)}}catch(e){}setTimeout(function(){if(!window.__mvOn){var n=document.querySelectorAll('[data-io],main h2');for(var i=0;i<n.length;i++)n[i].classList.add('in')}},6000)})();`;

// Ignition, step 2: at 1.1 s the lockup learns where the header logo is and glides into it.
const MV_DOCK = `(function(){var d=document.documentElement;if(!d.classList.contains('mv-intro'))return;setTimeout(function(){var L=document.getElementById('mvi-lock'),T=document.querySelector('.hd-logo img');if(!L)return;if(T){var a=L.getBoundingClientRect(),b=T.getBoundingClientRect();var dw=b.width,dh=dw*116/195,dt=b.top+(b.height-dh)/2;var cw=dw*.582,ch=dh*.496,cl=b.left+dw*.195,ct=dt+dh*.306;L.style.setProperty('--ds',(cw/a.width).toFixed(4));L.style.setProperty('--dx',((cl+cw/2)-(a.left+a.width/2)).toFixed(1)+'px');L.style.setProperty('--dy',((ct+ch/2)-(a.top+a.height/2)).toFixed(1)+'px')}else{L.style.setProperty('--ds','.3')}d.classList.add('mvi-dock')},1100)})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="el" suppressHydrationWarning className={`scroll-smooth ${displayFont.variable} ${bodyFont.variable}`}>
      <body className="font-body antialiased relative min-h-screen flex flex-col">
        {/* Motion v4 boot: marks JS on <html> before first paint and decides the once-per-session opening */}
        <script dangerouslySetInnerHTML={{ __html: MV_BOOT }} />
        <IntroOverlay />
        <Background />
        <CustomCursor />
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
      </body>
    </html>
  );
}
