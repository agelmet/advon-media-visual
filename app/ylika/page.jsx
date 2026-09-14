// app/ylika/page.jsx — the page a new client uses to send the material for their website.
// Rebuilt 14 Sept 2026 to be as simple as possible: last name, drop the files, write a note, send.
// Not linked from the menu, not indexed: Angelo sends the link after the meeting.
// Everything lands in the private data repo (intake/<lastname-date>/) — Angelo sees it in the CRM
// (Home → «Client material») and the Intake-builder task builds the first draft from it.
import IntakeForm from '@/components/intake/IntakeForm';

export const metadata = {
  title: 'Στείλτε το υλικό για την ιστοσελίδα σας | Advon Media',
  description: 'Επώνυμο, αρχεία, δύο λόγια — τίποτα άλλο.',
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: '/ylika' },
};

export default function YlikaPage() {
  return (
    <section className="relative pb-20 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-[0.14]" style={{ background: 'radial-gradient(ellipse at center, #47c8f5 0%, transparent 62%)' }} aria-hidden="true" />
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <p className="text-electric-cyan text-xs font-semibold tracking-[0.2em] uppercase mb-4">Advon Media · Υλικό ιστοσελίδας</p>
        <h1 className="font-display text-white leading-[1.02] mb-4" style={{ fontSize: 'clamp(2.1rem, 5vw, 3.6rem)' }}>
          Στείλτε μας το υλικό σας.
        </h1>
        <p className="text-white/70 text-lg leading-relaxed max-w-[38rem] mb-8">
          Φωτογραφίες, λογότυπο, κείμενα — ό,τι έχετε. Γράψτε το επώνυμό σας, σύρετε τα αρχεία και πατήστε «Αποστολή». Ό,τι λείπει, το βρίσκουμε εμείς.
        </p>
        <IntakeForm />
      </div>
    </section>
  );
}
