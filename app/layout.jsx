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

export default function RootLayout({ children }) {
  return (
    <html lang="el" className={`scroll-smooth ${displayFont.variable} ${bodyFont.variable}`}>
      <body className="font-body antialiased relative min-h-screen flex flex-col">
        <Background />
        <CustomCursor />
        <ScrollProgress />
        <Spotlight />
        <Header />
        <main className="relative z-10 pt-28 flex-1">
          {children}
        </main>
        <Contact />
        <Footer />
        {/* Advon AI assistant — loaded after the visitor's first interaction (or a few idle
            seconds) so it never competes with the page's own first paint. */}
        <DeferredWidget />
      </body>
    </html>
  );
}
