// components/MobileBar.jsx
// Sticky bottom bar on phones: one tap to the free draft, one to contact.
// Hidden on the landing page (which has its own form) and on the CRM.
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLangStore } from '@/store/langStore';

export default function MobileBar() {
  const { lang } = useLangStore();
  const pathname = usePathname();
  if (!pathname || pathname.startsWith('/dorean-istoselida') || pathname.startsWith('/crm')) return null;
  return (
    <nav className="mobile-bar" aria-label={lang === 'el' ? 'Γρήγορες ενέργειες' : 'Quick actions'}>
      <Link href="/#contact">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true"><path d="M4 4h16v12H7l-3 3z"/></svg>
        {lang === 'el' ? 'Επικοινωνία' : 'Contact'}
      </Link>
      <Link href="/dorean-istoselida" className="primary">
        {lang === 'el' ? 'Δωρεάν δείγμα →' : 'Free draft →'}
      </Link>
    </nav>
  );
}
