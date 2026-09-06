// components/Footer.jsx
'use client';
import Link from 'next/link';
import { useLangStore } from '@/store/langStore';
import { NAV_SERVICES as services, IDENTITY } from '@/lib/nav';

export default function Footer() {
  const { lang } = useLangStore();

  const siteLinks = [
    { href: '/', el: 'Αρχική', en: 'Home' },
    { href: '/kataskevi-istoselidas#portfolio', el: 'Πορτφόλιο', en: 'Portfolio' },
    { href: '/#reviews', el: 'Αξιολογήσεις', en: 'Reviews' },
    { href: '/faq', el: 'FAQ', en: 'FAQ' },
    { href: '/blog', el: 'Blog', en: 'Blog' },
    { href: '#contact', el: 'Επικοινωνία', en: 'Contact' },
  ];

  return (
    <footer className="bg-[#050a0e] border-t border-electric-cyan/20 text-gray-400 relative z-20">
      <div className="absolute top-0 left-0 right-0 cyber-divider" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center sm:text-left">
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start gap-4">
            <img src="https://assets.cdn.filesafe.space/NkFUgZER3rrdnofCwAIl/media/648dd017a1f733fa5b51e5e9.png" alt="Advon Media" className="h-8 w-auto opacity-60" loading="lazy" decoding="async" />
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
              {IDENTITY[lang]}
            </p>
          </div>

          {/* Services column */}
          <div className="lg:col-span-2">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-4">
              {lang === 'el' ? 'Υπηρεσίες' : 'Services'}
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/${service.slug}`} className="text-sm text-gray-400 hover:text-electric-cyan transition-colors">
                    {service[lang]}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/diaxeirisi-social-media" className="text-sm text-gray-400 hover:text-electric-cyan transition-colors">
                  {lang === 'el' ? 'Διαχείριση Social Media' : 'Social Media Management'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Site column */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-4">
              {lang === 'el' ? 'Πλοήγηση' : 'Explore'}
            </h4>
            <ul className="space-y-2.5">
              {siteLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-400 hover:text-electric-cyan transition-colors">
                    {lang === 'el' ? item.el : item.en}
                  </Link>
                </li>
              ))}
              <li>
                <a href="mailto:angelos@advonmedia.com" className="text-sm text-electric-cyan/90 hover:text-electric-cyan transition-colors font-semibold">
                  angelos@advonmedia.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-sm font-semibold">© 2026 Advon Media. {lang === 'el' ? 'Με επιφύλαξη παντός δικαιώματος.' : 'All rights reserved.'}</p>
          <div className="flex gap-4 md:gap-6 text-sm font-bold uppercase flex-wrap justify-center text-electric-cyan/80">
            <Link href="/privacy-policy" className="hover:text-electric-cyan transition-colors">{lang === 'el' ? 'Πολιτική Απορρήτου' : 'Privacy Policy'}</Link>
            <span className="text-white/20">|</span>
            <Link href="/terms" className="hover:text-electric-cyan transition-colors">{lang === 'el' ? 'Όροι Χρήσης' : 'Terms of Use'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
