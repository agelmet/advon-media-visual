// components/Footer.jsx
'use client';
import Link from 'next/link';
import { useLangStore } from '@/store/langStore';

export default function Footer() {
  const { lang } = useLangStore();
  
  return (
    <footer className="py-8 bg-[#050a0e] border-t border-electric-cyan/20 text-gray-400 relative z-20">
      <div className="absolute top-0 left-0 right-0 cyber-divider" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <img src="https://assets.cdn.filesafe.space/NkFUgZER3rrdnofCwAIl/media/648dd017a1f733fa5b51e5e9.png" alt="Advon Media" className="h-8 w-auto opacity-50" />
          <p className="text-sm font-semibold">© 2026 Advon Media. {lang === 'el' ? 'Με επιφύλαξη παντός δικαιώματος.' : 'All rights reserved.'}</p>
        </div>
        <div className="flex gap-4 md:gap-6 text-sm font-bold uppercase flex-wrap justify-center text-electric-cyan/80">
          <Link href="/privacy-policy" className="hover:text-electric-cyan transition-colors">{lang === 'el' ? 'Πολιτική Απορρήτου' : 'Privacy Policy'}</Link>
          <span className="text-white/20">|</span>
          <Link href="/terms" className="hover:text-electric-cyan transition-colors">{lang === 'el' ? 'Όροι Χρήσης' : 'Terms of Use'}</Link>
        </div>
      </div>
    </footer>
  );
}
