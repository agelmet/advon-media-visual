// app/page.jsx
import HomeClient from '@/components/HomeClient';

export const metadata = {
  title: 'Κατασκευή Ιστοσελίδων & Ψηφιακά Εργαλεία | Advon Media',
  description:
    'Φτιάχνουμε την ιστοσελίδα σας δωρεάν — χωρίς προκαταβολή. Και τη βάζουμε να δουλεύει: κριτικές Google, online ραντεβού, direct booking, AI βοηθός, ψηφιακό μενού.',
  alternates: { canonical: '/' },
};

export default function Home() {
  return <HomeClient />;
}
