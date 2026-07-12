// app/layout.jsx
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import Contact from '@/components/Contact';
import CustomCursor from '@/components/CustomCursor';

export const metadata = {
  metadataBase: new URL('https://advonmedia.com'),
  title: 'Κατασκευή Ιστοσελίδων & Ψηφιακά Εργαλεία | Advon Media',
  description:
    'Ιστοσελίδες & ψηφιακά εργαλεία για ελληνικές επιχειρήσεις: κατασκευή ιστοσελίδων χωρίς προκαταβολή, κριτικές Google, online ραντεβού, direct booking, AI βοηθός.',
  icons: {
    icon: 'https://raw.githubusercontent.com/agelmet/Advon-Media/refs/heads/main/logo.png',
    apple: 'https://raw.githubusercontent.com/agelmet/Advon-Media/refs/heads/main/logo.png',
  },
  openGraph: {
    siteName: 'Advon Media',
    images: ['https://raw.githubusercontent.com/agelmet/Advon-Media/refs/heads/main/logo.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="el" className="scroll-smooth">
      <body className="font-body antialiased relative min-h-screen flex flex-col">
        <Background />
        <CustomCursor />
        <Header />
        <main className="relative z-10 pt-28 flex-1">
          {children}
        </main>
        <Contact />
        <Footer />
        {/* Advon AI assistant — live demo, embedded site-wide */}
        <script src="https://advon-services.vercel.app/widget.js" data-site-id="advon" defer></script>
      </body>
    </html>
  );
}
