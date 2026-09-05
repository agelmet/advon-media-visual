// components/Footer.jsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLangStore } from '@/store/langStore';
import { NAV_SERVICES as services, IDENTITY } from '@/lib/nav';

export default function Footer() {
  const { lang } = useLangStore();
  const pathname = usePathname();
  const isLP = pathname?.startsWith('/dorean-istoselida');

  if (isLP) {
    return (
      <footer className="border-t border-line text-paper-3 text-xs relative z-20">
        <div className="max-w-6xl mx-auto px-5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Advon Media · <a href="mailto:angelos@advonmedia.com" className="hover:text-paper">angelos@advonmedia.com</a></p>
          <p className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-paper">{lang === 'el' ? 'Πολιτική Απορρήτου' : 'Privacy Policy'}</Link>
            <Link href="/terms" className="hover:text-paper">{lang === 'el' ? 'Όροι Χρήσης' : 'Terms'}</Link>
          </p>
        </div>
      </footer>
    );
  }

  const siteLinks = [
    { href: '/', el: 'Αρχική', en: 'Home' },
    { href: '/#work', el: 'Πορτφόλιο', en: 'Portfolio' },
    { href: '/#reviews', el: 'Κριτικές', en: 'Reviews' },
    { href: '/#pricing', el: 'Τιμές', en: 'Pricing' },
    { href: '/faq', el: 'FAQ', en: 'FAQ' },
    { href: '/blog', el: 'Blog', en: 'Blog' },
    { href: '/#contact', el: 'Επικοινωνία', en: 'Contact' },
  ];

  return (
    <footer className="bg-ink border-t border-line text-paper-2 relative z-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="flex flex-col gap-4">
            <img src="/img/advon-logo.webp" srcSet="/img/advon-logo.webp 1x, /img/advon-logo@2x.webp 2x" alt="Advon Media" width="190" height="96" className="h-9 w-auto" loading="lazy" decoding="async" />
            <p className="text-sm leading-relaxed text-paper-3 max-w-xs">{IDENTITY[lang]}</p>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-paper text-xs font-bold uppercase tracking-[0.2em] mb-4">{lang === 'el' ? 'Υπηρεσίες' : 'Services'}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/${service.slug}`} className="text-sm hover:text-paper transition-colors">{service[lang]}</Link>
                </li>
              ))}
              <li>
                <Link href="/diaxeirisi-social-media" className="text-sm hover:text-paper transition-colors">{lang === 'el' ? 'Διαχείριση Social Media' : 'Social Media Management'}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-paper text-xs font-bold uppercase tracking-[0.2em] mb-4">{lang === 'el' ? 'Πλοήγηση' : 'Explore'}</h2>
            <ul className="space-y-2.5">
              {siteLinks.map((item) => (
                <li key={item.href}><Link href={item.href} className="text-sm hover:text-paper transition-colors">{lang === 'el' ? item.el : item.en}</Link></li>
              ))}
              <li><a href="mailto:angelos@advonmedia.com" className="text-sm text-aegean-2 hover:text-paper transition-colors font-semibold">angelos@advonmedia.com</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-sm text-paper-3">© 2026 Advon Media. {lang === 'el' ? 'Με επιφύλαξη παντός δικαιώματος.' : 'All rights reserved.'}</p>
          <div className="flex gap-5 text-xs font-bold uppercase tracking-wide text-paper-3">
            <Link href="/privacy-policy" className="hover:text-paper transition-colors">{lang === 'el' ? 'Πολιτική Απορρήτου' : 'Privacy Policy'}</Link>
            <Link href="/terms" className="hover:text-paper transition-colors">{lang === 'el' ? 'Όροι Χρήσης' : 'Terms of Use'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
