// components/Header.jsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLangStore } from '@/store/langStore';
import { NAV_SERVICES as services } from '@/lib/nav';

function Logo({ lang }) {
  return (
    <Link href="/" className="flex items-center shrink-0" aria-label={lang === 'el' ? 'Advon Media — Αρχική' : 'Advon Media — Home'}>
      <img
        src="/img/advon-logo.webp"
        srcSet="/img/advon-logo.webp 1x, /img/advon-logo@2x.webp 2x"
        alt="Advon Media"
        width="190"
        height="96"
        className="h-9 md:h-10 w-auto"
        decoding="async"
      />
    </Link>
  );
}

function LangButton({ lang, toggleLang, small }) {
  return (
    <button
      type="button"
      onClick={toggleLang}
      className={`inline-flex items-center gap-1.5 rounded-md border border-line bg-ink-2 font-bold text-paper-2 hover:text-paper hover:border-aegean transition-colors ${small ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-1.5 text-xs'}`}
      aria-label={lang === 'el' ? 'EN — English' : 'EL — Ελληνικά'}
    >
      <span aria-hidden="true">{lang === 'el' ? '🇬🇧' : '🇬🇷'}</span>
      {lang === 'el' ? 'EN' : 'EL'}
    </button>
  );
}

export default function Header() {
  const { lang, toggleLang } = useLangStore();
  const pathname = usePathname();
  const isLP = pathname?.startsWith('/dorean-istoselida');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const shell = `fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled || open ? 'bg-ink/92 border-b border-line' : 'bg-transparent border-b border-transparent'}`;

  if (isLP) {
    return (
      <header className={shell} style={scrolled ? { backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' } : undefined}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <Logo lang={lang} />
          <div className="flex items-center gap-3">
            <a href="#form" className="btn-primary !py-2 !px-4 text-sm hidden sm:inline-flex">
              {lang === 'el' ? 'Δωρεάν δείγμα' : 'Free draft'}
            </a>
            <LangButton lang={lang} toggleLang={toggleLang} small />
          </div>
        </div>
      </header>
    );
  }

  const nav = [
    { href: '/#work', el: 'Πορτφόλιο', en: 'Portfolio' },
    { href: '/#reviews', el: 'Κριτικές', en: 'Reviews' },
    { href: '/#pricing', el: 'Τιμές', en: 'Pricing' },
    { href: '/faq', el: 'FAQ', en: 'FAQ' },
    { href: '/blog', el: 'Blog', en: 'Blog' },
  ];

  return (
    <header className={shell} style={scrolled || open ? { backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' } : undefined}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between gap-6">
        <Logo lang={lang} />

        {/* Desktop */}
        <nav className="hidden lg:flex items-center gap-7 text-[0.92rem] font-medium" aria-label={lang === 'el' ? 'Κύριο μενού' : 'Main menu'}>
          <div className="relative group py-2">
            <button type="button" className="flex items-center gap-1 text-paper-2 hover:text-paper transition-colors" aria-haspopup="true">
              {lang === 'el' ? 'Υπηρεσίες' : 'Services'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div className="absolute top-full left-0 hidden group-hover:block group-focus-within:block z-[100] pt-2">
              <div className="bg-ink-2 min-w-[260px] rounded-xl border border-line shadow-[0_20px_60px_rgba(0,0,0,0.6)] py-2 overflow-hidden">
                {services.map((service) => (
                  <Link key={service.slug} href={`/${service.slug}`} className="block text-paper-2 px-5 py-2.5 text-[0.9rem] hover:bg-ink-3 hover:text-paper transition-colors">
                    {service[lang]}
                  </Link>
                ))}
                <Link href="/diaxeirisi-social-media" className="block text-paper-2 px-5 py-2.5 text-[0.9rem] hover:bg-ink-3 hover:text-paper transition-colors">
                  {lang === 'el' ? 'Διαχείριση Social Media' : 'Social Media Management'}
                </Link>
              </div>
            </div>
          </div>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-paper-2 hover:text-paper transition-colors py-2">
              {lang === 'el' ? item.el : item.en}
            </Link>
          ))}
          <Link href="/dorean-istoselida" prefetch={false} className="btn-primary !py-2.5 !px-4 text-sm">
            {lang === 'el' ? 'Δωρεάν δείγμα' : 'Free draft'}
          </Link>
          <LangButton lang={lang} toggleLang={toggleLang} />
        </nav>

        {/* Mobile controls */}
        <div className="lg:hidden flex items-center gap-2">
          <LangButton lang={lang} toggleLang={toggleLang} small />
          <button
            type="button"
            className="text-paper p-2 rounded-md border border-line bg-ink-2"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? (lang === 'el' ? 'Κλείσιμο μενού' : 'Close menu') : (lang === 'el' ? 'Άνοιγμα μενού' : 'Open menu')}
          >
            {open ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div id="mobile-menu" hidden={!open} className="lg:hidden bg-ink border-b border-line max-h-[calc(100vh-4rem)] overflow-y-auto">
        <nav className="flex flex-col p-5 gap-1 text-base font-medium" aria-label={lang === 'el' ? 'Μενού κινητού' : 'Mobile menu'}>
          <Link href="/dorean-istoselida" className="btn-primary mb-3">{lang === 'el' ? 'Δείτε το δείγμα σας — δωρεάν' : 'See your free draft'}</Link>
          <span className="text-xs text-paper-3 uppercase font-bold tracking-widest mt-2 mb-1">{lang === 'el' ? 'Υπηρεσίες' : 'Services'}</span>
          {services.map((service) => (
            <Link key={service.slug} href={`/${service.slug}`} className="text-paper-2 hover:text-paper py-2 border-b border-line/60">
              {service[lang]}
            </Link>
          ))}
          <Link href="/diaxeirisi-social-media" className="text-paper-2 hover:text-paper py-2 border-b border-line/60">{lang === 'el' ? 'Διαχείριση Social Media' : 'Social Media Management'}</Link>
          <span className="text-xs text-paper-3 uppercase font-bold tracking-widest mt-4 mb-1">{lang === 'el' ? 'Πλοήγηση' : 'Explore'}</span>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-paper-2 hover:text-paper py-2 border-b border-line/60">
              {lang === 'el' ? item.el : item.en}
            </Link>
          ))}
          <Link href="/#contact" className="text-paper py-2 font-bold">{lang === 'el' ? 'Επικοινωνία' : 'Contact'}</Link>
        </nav>
      </div>
    </header>
  );
}
