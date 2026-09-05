// app/page.jsx
import HomeClient from '@/components/HomeClient';
import { HOME_FAQS } from '@/lib/services';

export const metadata = {
  title: 'Κατασκευή Ιστοσελίδων & Ψηφιακά Εργαλεία | Advon Media',
  description:
    'Φτιάχνουμε την ιστοσελίδα σας δωρεάν — χωρίς προκαταβολή. Και τη βάζουμε να δουλεύει: κριτικές Google, online ραντεβού, direct booking, AI βοηθός, ψηφιακό μενού.',
  alternates: { canonical: '/' },
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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeClient />
    </>
  );
}
