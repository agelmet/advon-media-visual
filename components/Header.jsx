// components/Header.jsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLangStore } from '@/store/langStore';

export default function Header() {
  const { lang, toggleLang } = useLangStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#050a0e]/80 backdrop-blur-xl border-b border-electric-cyan/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO REDIRECT FIX */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <img src="https://assets.cdn.filesafe.space/NkFUgZER3rrdnofCwAIl/media/648dd017a1f733fa5b51e5e9.png" alt="Advon Media" className="h-10 w-auto filter drop-shadow-[0_0_8px_rgba(71,200,245,0.5)]" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-electric-cyan">
          <Link href="/" className="hover:text-white transition-colors relative group py-2">
            {lang === 'el' ? 'Αρχική' : 'Home'}
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-electric-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left duration-300"></span>
          </Link>
          
          {/* PERFECTED DROPDOWN MENU */}
          <div className="relative group py-2 cursor-pointer">
            <div className="flex items-center gap-1 hover:text-white transition-colors">
              {lang === 'el' ? 'Υπηρεσίες' : 'Services'} 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            {/* The Dropdown Content */}
            <div className="absolute top-full left-[-20px] hidden group-hover:block bg-[rgba(5,10,14,0.95)] min-w-[240px] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.8)] z-[100] rounded-xl border border-electric-cyan/20 backdrop-blur-md py-2 animate-fade-in">
              <Link href="/kataskevi-istoselidas" className="block text-[#d1d5db] px-5 py-3 text-[0.9rem] hover:bg-electric-cyan/5 hover:text-electric-cyan border-l-2 border-transparent hover:border-electric-cyan transition-all">
                {lang === 'el' ? 'Κατασκευή Ιστοσελίδας' : 'Website Creation'}
              </Link>
              <Link href="/google-reviews-nfc" className="block text-[#d1d5db] px-5 py-3 text-[0.9rem] hover:bg-electric-cyan/5 hover:text-electric-cyan border-l-2 border-transparent hover:border-electric-cyan transition-all">
                {lang === 'el' ? 'Βάση Αξιολογήσεων' : 'Reviews Base'}
              </Link>
              <Link href="/diaxeirisi-social-media" className="block text-[#d1d5db] px-5 py-3 text-[0.9rem] hover:bg-electric-cyan/5 hover:text-electric-cyan border-l-2 border-transparent hover:border-electric-cyan transition-all">
                {lang === 'el' ? 'Διαχείριση Social Media' : 'Social Media Management'}
              </Link>
            </div>
          </div>

          <Link href="/kataskevi-istoselidas#portfolio" className="hover:text-white transition-colors relative group py-2">
            {lang === 'el' ? 'Πορτφόλιο' : 'Portfolio'}
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-electric-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left duration-300"></span>
          </Link>
          <Link href="/#reviews" className="hover:text-white transition-colors relative group py-2">
            {lang === 'el' ? 'Αξιολογήσεις' : 'Reviews'}
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-electric-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left duration-300"></span>
          </Link>
          <Link href="/faq" className="hover:text-white transition-colors relative group py-2">
            FAQ
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-electric-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left duration-300"></span>
          </Link>
          <Link href="/blog" className="hover:text-white transition-colors relative group py-2">
            Blog
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-electric-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left duration-300"></span>
          </Link>

          <Link href="#contact" className="px-5 py-2.5 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 text-xs font-bold text-electric-cyan hover:bg-electric-cyan hover:text-[#050a0e] transition-all shadow-[0_0_15px_rgba(71,200,245,0.2)]">
            {lang === 'el' ? 'Επικοινωνία' : 'Contact'}
          </Link>
          
          <button onClick={toggleLang} className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-electric-cyan/40 bg-electric-cyan/10 text-xs font-bold text-electric-cyan hover:bg-electric-cyan hover:text-[#050a0e] transition-all cursor-pointer">
            {lang === 'el' ? '🇬🇧 EN' : '🇬🇷 EL'}
          </button>
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button onClick={toggleLang} className="flex items-center justify-center gap-2 px-2 py-1 rounded-lg border border-electric-cyan/40 bg-electric-cyan/10 text-xs font-bold text-electric-cyan hover:bg-electric-cyan hover:text-[#050a0e] transition-all cursor-pointer">
            {lang === 'el' ? '🇬🇧 EN' : '🇬🇷 EL'}
          </button>
          <button className="text-electric-cyan p-2 bg-electric-cyan/10 rounded-lg" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-[#050a0e]/95 backdrop-blur-xl border-b border-electric-cyan/20 overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
        <nav className="flex flex-col p-6 gap-4 text-lg font-medium text-electric-cyan">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-white">{lang === 'el' ? 'Αρχική' : 'Home'}</Link>
          <div className="pl-4 border-l border-electric-cyan/20 flex flex-col gap-3 my-1">
            <span className="text-sm text-gray-500 uppercase font-bold tracking-widest">{lang === 'el' ? 'Υπηρεσιες' : 'Services'}</span>
            <Link href="/kataskevi-istoselidas" onClick={() => setIsMobileMenuOpen(false)} className="text-white">{lang === 'el' ? 'Κατασκευή Ιστοσελίδας' : 'Website Creation'}</Link>
            <Link href="/google-reviews-nfc" onClick={() => setIsMobileMenuOpen(false)} className="text-white">{lang === 'el' ? 'Βάση Αξιολογήσεων' : 'Reviews Base'}</Link>
            <Link href="/diaxeirisi-social-media" onClick={() => setIsMobileMenuOpen(false)} className="text-white">{lang === 'el' ? 'Διαχείριση Social Media' : 'Social Media Management'}</Link>
          </div>
          <Link href="/kataskevi-istoselidas#portfolio" onClick={() => setIsMobileMenuOpen(false)} className="text-white">{lang === 'el' ? 'Πορτφόλιο' : 'Portfolio'}</Link>
          <Link href="/#reviews" onClick={() => setIsMobileMenuOpen(false)} className="text-white">{lang === 'el' ? 'Αξιολογήσεις' : 'Reviews'}</Link>
          <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="text-white">FAQ</Link>
          <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-white">Blog</Link>
          <Link href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-bold">{lang === 'el' ? 'Επικοινωνία' : 'Contact'}</Link>
        </nav>
      </div>
    </header>
  );
}