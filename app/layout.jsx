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

const MV_BOOT = `(function(){var d=document.documentElement;try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('mv-js');if(!document.hidden&&!sessionStorage.getItem('advon-intro')){sessionStorage.setItem('advon-intro','1');d.classList.add('mv-intro');setTimeout(function(){d.classList.remove('mv-intro')},2600)}}catch(e){}setTimeout(function(){if(!window.__mvOn){var n=document.querySelectorAll('[data-io],main h2');for(var i=0;i<n.length;i++)n[i].classList.add('in')}},6000)})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="el" suppressHydrationWarning className={`scroll-smooth ${displayFont.variable} ${bodyFont.variable}`}>
      <body className="font-body antialiased relative min-h-screen flex flex-col">
        {/* Motion v4 boot: marks JS on <html> before first paint and decides the once-per-session opening */}
        <script dangerouslySetInnerHTML={{ __html: MV_BOOT }} />
        <div id="mv-intro" aria-hidden="true">
          <div className="mvi-half mvi-top"><span className="mvi-logo"><img src="/img/advon-logo-232.webp" alt="" width="86" height="51" /></span></div>
          <div className="mvi-half mvi-bot" />
          <div className="mvi-line" />
        </div>
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
      </body>
    </html>
  );
}
