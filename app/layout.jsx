// app/layout.jsx
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import Runtime from '@/components/Runtime';
import DeferredWidget from '@/components/DeferredWidget';
import MetaPixel from '@/components/MetaPixel';
import MobileBar from '@/components/MobileBar';
import { displayFont, bodyFont } from '@/lib/fonts';

export const metadata = {
  metadataBase: new URL('https://advonmedia.com'),
  title: 'Κατασκευή Ιστοσελίδων & Ψηφιακά Εργαλεία | Advon Media',
  description:
    'Ιστοσελίδες & ψηφιακά εργαλεία για ελληνικές επιχειρήσεις: κατασκευή ιστοσελίδων χωρίς προκαταβολή, κριτικές Google, online ραντεβού, direct booking, AI βοηθός.',
  icons: {
    icon: [{ url: '/img/advon-icon-32.png', sizes: '32x32', type: 'image/png' }, { url: '/img/advon-icon-180.png', sizes: '180x180', type: 'image/png' }],
    apple: '/img/advon-icon-180.png',
  },
  openGraph: {
    siteName: 'Advon Media',
    locale: 'el_GR',
    type: 'website',
    images: [{ url: '/og/advon-og.jpg', width: 1200, height: 630, alt: 'Advon Media — Η ιστοσελίδα σας. Δωρεάν.' }],
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport = {
  themeColor: '#0B0E12',
  colorScheme: 'dark',
};

export default function RootLayout({ children }) {
  return (
    <html lang="el" className={`scroll-smooth ${displayFont.variable} ${bodyFont.variable}`}>
      <body className="font-body antialiased relative min-h-screen flex flex-col bg-ink text-paper grain has-mobile-bar">
        <Runtime />
        <Header />
        <main className="relative z-10 flex-1">{children}</main>
        <Contact />
        <Footer />
        <MobileBar />
        <MetaPixel />
        <DeferredWidget />
      </body>
    </html>
  );
}
