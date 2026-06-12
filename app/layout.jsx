// app/layout.jsx
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import Contact from '@/components/Contact';
import CustomCursor from '@/components/CustomCursor';

export const metadata = {
  title: 'Κατασκευή Ιστοσελίδων | Web Design & SEO - Advon Media',
  description: 'Κορυφαία κατασκευή ιστοσελίδων στην Ελλάδα. Επαγγελματικό Web Design, ταχύτατη φόρτωση, Mobile Responsive και πλήρης SEO βελτιστοποίηση. Ανεβείτε στην 1η σελίδα της Google.',
  icons: {
    icon: 'https://assets.cdn.filesafe.space/NkFUgZER3rrdnofCwAIl/media/648dd017a1f733fa5b51e5e9.png',
    apple: 'https://assets.cdn.filesafe.space/NkFUgZER3rrdnofCwAIl/media/648dd017a1f733fa5b51e5e9.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="el" className="scroll-smooth">
      <body className="font-body antialiased relative min-h-screen flex flex-col">
        <Background />
        <CustomCursor />
        <Header />
        <main className="relative z-10 pt-20 flex-1">
          {children}
        </main>
        <Contact />
        <Footer />
      </body>
    </html>
  );
}
