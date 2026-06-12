// components/Header.jsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLangStore } from '@/store/langStore';

export default function Header() {
  const { lang, toggleLang } = useLangStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? 'rgba(5,10,14,0.85)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'blur(0px)',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'blur(0px)',
        borderBottom: scrolled
          ? '1px solid rgba(71,200,245,0.12)'
          : '1px solid transparent',
        boxShadow: scrolled
          ? '0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(71,200,245,0.03)'
          : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="https://raw.githubusercontent.com/agelmet/Advon-Media/refs/heads/main/logo.png"
            alt="Advon Media"
            className="h-10 w-auto transition-all duration-300"
            style={{ filter: 'drop-shadow(0 0 10px rgba(71,200,245,0.5))' }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">

          <Link href="/" className="text-electric-cyan hover:text-white transition-colors relative group py-2">
            {lang === 'el' ? 'Αρχική' : 'Home'}
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-electric-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left duration-300" />
          </Link>

          {/* Services dropdown */}
          <div className="relative group py-2">
            <div className="flex items-center gap-1 text-electric-cyan hover:text-white transition-colors">
              {lang === 'el' ? 'Υπηρεσίες' : 'Services'}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            <div className="absolute top-full left-[-20px] hidden group-hover:block z-[100] pt-2">
              <div className="bg-[rgba(5,10,14,0.97)] min-w-[250px] rounded-2xl border border-electric-cyan/20 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(71,200,245,0.05)] py-2 overflow-hidden">
                {[
                  { href: '/kataskevi-istoselidas', el: 'Κατασκευή Ιστοσελίδας', en: 'Website Creation' },
                  { href: '/google-reviews-nfc',    el: 'Βάση Αξιολογήσεων',    en: 'Reviews Base' },
                  { href: '/diaxeirisi-social-media', el: 'Διαχείριση Social Media', en: 'Social Media Management' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-[#d1d5db] px-5 py-3 text-[0.875rem] hover:bg-electric-cyan/8 hover:text-electric-cyan border-l-2 border-transparent hover:border-electric-cyan transition-all duration-200"
                  >
                    {lang === 'el' ? item.el : item.en}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {[
            { href: '/kataskevi-istoselidas#portfolio', el: 'Πορτφόλιο', en: 'Portfolio' },
            { href: '/#reviews', el: 'Αξιολογήσεις', en: 'Reviews' },
            { href: '/faq', el: 'FAQ', en: 'FAQ' },
            { href: '/blog', el: 'Blog', en: 'Blog' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="text-electric-cyan hover:text-white transition-colors relative group py-2">
              {lang === 'el' ? item.el : item.en}
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-electric-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left duration-300" />
            </Link>
          ))}

          <Link
            href="#contact"
            className="btn-premium px-5 py-2.5 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 text-xs font-bold text-electric-cyan hover:bg-electric-cyan hover:text-[#050a0e] transition-all duration-300 shadow-[0_0_20px_rgba(71,200,245,0.15)]"
          >
            {lang === 'el' ? 'Επικοινωνία' : 'Contact'}
          </Link>

          <button
            onClick={toggleLang}
            className="btn-premium flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-electric-cyan/40 bg-electric-cyan/8 text-xs font-bold text-electric-cyan hover:bg-electric-cyan hover:text-[#050a0e] transition-all duration-300"
          >
            {lang === 'el' ? '🇬🇧 EN' : '🇬🇷 EL'}
          </button>
        </nav>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-electric-cyan/40 bg-electric-cyan/10 text-xs font-bold text-electric-cyan hover:bg-electric-cyan hover:text-[#050a0e] transition-all"
          >
            {lang === 'el' ? '🇬🇧 EN' : '🇬🇷 EL'}
          </button>
          <button
            className="text-electric-cyan p-2 bg-electric-cyan/10 rounded-lg hover:bg-electric-cyan/20 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-[#050a0e]/97 backdrop-blur-xl border-b border-electric-cyan/15 overflow-hidden transition-all duration-400 ${isMobileMenuOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <nav className="flex flex-col p-6 gap-4 text-lg font-medium text-electric-cyan">
          <Link href="/"                        onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-electric-cyan transition-colors">{lang === 'el' ? 'Αρχική' : 'Home'}</Link>
          <div className="pl-4 border-l border-electric-cyan/20 flex flex-col gap-3 my-1">
            <span className="text-xs text-gray-500 uppercase font-black tracking-widest">{lang === 'el' ? 'Υπηρεσίες' : 'Services'}</span>
            <Link href="/kataskevi-istoselidas"    onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-electric-cyan transition-colors">{lang === 'el' ? 'Κατασκευή Ιστοσελίδας' : 'Website Creation'}</Link>
            <Link href="/google-reviews-nfc"       onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-electric-cyan transition-colors">{lang === 'el' ? 'Βάση Αξιολογήσεων' : 'Reviews Base'}</Link>
            <Link href="/diaxeirisi-social-media"  onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-electric-cyan transition-colors">{lang === 'el' ? 'Διαχείριση Social Media' : 'Social Media Management'}</Link>
          </div>
          <Link href="/kataskevi-istoselidas#portfolio" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-electric-cyan transition-colors">{lang === 'el' ? 'Πορτφόλιο' : 'Portfolio'}</Link>
          <Link href="/#reviews"                onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-electric-cyan transition-colors">{lang === 'el' ? 'Αξιολογήσεις' : 'Reviews'}</Link>
          <Link href="/faq"                     onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-electric-cyan transition-colors">FAQ</Link>
          <Link href="/blog"                    onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-electric-cyan transition-colors">Blog</Link>
          <Link href="#contact"                 onClick={() => setIsMobileMenuOpen(false)} className="text-electric-cyan font-black tracking-wide">{lang === 'el' ? 'Επικοινωνία' : 'Contact'}</Link>
        </nav>
      </div>
    </header>
  );
}
