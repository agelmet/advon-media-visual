// app/istoselida/page.jsx — ads landing page: the homepage hero, then ONLY the website
// service (portfolio, price, steps, packages, reviews, FAQ, booking). Not in the menu,
// not in the sitemap, noindex (the SEO page for this service is /kataskevi-istoselidas).
import LandingClient from '@/components/landing/LandingClient';

export const metadata = {
  title: 'Η ιστοσελίδα σας. Δωρεάν. | Advon Media',
  description:
    'Κατασκευή ιστοσελίδας χωρίς κόστος κατασκευής και χωρίς προκαταβολή: βλέπετε πρώτα το σχέδιο, κάνουμε όσες αλλαγές θέλετε, πληρώνετε μόνο φιλοξενία και domain — 130€ τον χρόνο + ΦΠΑ. 220+ ιστοσελίδες, 130+ κριτικές 5★ στο Google.',
  alternates: { canonical: '/istoselida' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Η ιστοσελίδα σας. Δωρεάν. — Advon Media',
    description: 'Η κατασκευή δεν χρεώνεται. Πληρώνετε μόνο φιλοξενία και domain: 130€ τον χρόνο + ΦΠΑ. 220+ ιστοσελίδες online.',
    url: '/istoselida',
  },
};

export default function Page() {
  return <LandingClient />;
}
