// app/layout.jsx
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import Contact from '@/components/Contact';
import CustomCursor from '@/components/CustomCursor';

export const metadata = {
  title: 'Κατασκευή Ιστοσελίδων | Web Design & SEO - Advon Media',
  description: 'Κορυφαία κατασκευή ιστοσελίδων στην Ελλάδα.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="el" className="scroll-smooth">
      <body className="font-body antialiased relative min-h-screen flex flex-col">
        {/* Luxury Hardware Cursor */}
        <CustomCursor />
        
        {/* Global Background */}
        <Background />
        
        {/* Global Header */}
        <Header />
        
        {/* Dynamic Page Content */}
        <main className="relative z-10 pt-20 flex-1">
          {children}
        </main>
        
        {/* Global Contact & Footer */}
        <Contact />
        <Footer />
      </body>
    </html>
  );
}