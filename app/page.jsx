// app/page.jsx — server-rendered homepage (Design System v2)
import Hero from '@/components/home/Hero';
import { NicheStrip, HowItWorks, Portfolio, Pricing, ReviewsGrid, ServicesTrio, HomeFaq } from '@/components/home/Sections';
import { HOME_FAQS, SITE_URL } from '@/lib/services';
import { REVIEWS_URL } from '@/lib/reviews';

export const metadata = {
  title: 'Κατασκευή Ιστοσελίδων χωρίς Προκαταβολή | Advon Media',
  description:
    'Φτιάχνουμε την ιστοσελίδα σας δωρεάν και σας τη δείχνουμε έτοιμη. Πληρώνετε μόνο τη φιλοξενία — 10,83€/μήνα — και μόνο αν σας αρέσει. 200+ ιστοσελίδες, 110+ κριτικές 5★ στο Google.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Η ιστοσελίδα σας. Δωρεάν. | Advon Media',
    description: 'Χωρίς προκαταβολή. Τη βλέπετε πρώτα έτοιμη — και μετά αποφασίζετε. Πληρώνετε μόνο τη φιλοξενία.',
    url: '/',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: HOME_FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q.el,
    acceptedAnswer: { '@type': 'Answer', text: a.el },
  })),
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Advon Media',
  url: SITE_URL,
  logo: `${SITE_URL}/img/advon-logo@2x.webp`,
  image: `${SITE_URL}/og/advon-og.jpg`,
  description: 'Κατασκευή ιστοσελίδων χωρίς προκαταβολή και ψηφιακά εργαλεία για ελληνικές επιχειρήσεις.',
  email: 'angelos@advonmedia.com',
  areaServed: { '@type': 'Country', name: 'Greece' },
  availableLanguage: ['el', 'en'],
  priceRange: '€',
  sameAs: ['https://www.instagram.com/advon_media', REVIEWS_URL],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <Hero />
      <NicheStrip />
      <HowItWorks />
      <Portfolio />
      <Pricing />
      <ReviewsGrid />
      <ServicesTrio />
      <HomeFaq />
    </>
  );
}
