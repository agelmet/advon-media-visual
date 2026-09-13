// app/ylika/page.jsx — private page where a new client sends the material for their website
// (details, photos, logo, instructions, or a WeTransfer/Drive link). Not linked from the menu,
// not indexed: Angelo sends the link after the meeting. Submissions land in the private data repo
// (intake/<id>/) and the intake agent builds the first draft from them.
import IntakeForm from '@/components/intake/IntakeForm';

export const metadata = {
  title: 'Στείλτε το υλικό για την ιστοσελίδα σας | Advon Media',
  description: 'Στοιχεία, φωτογραφίες και οδηγίες για την ιστοσελίδα σας — σε 3 λεπτά.',
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: '/ylika' },
};

const STEPS = [
  { n: '1', t: 'Τα στοιχεία σας', d: 'Όνομα, ειδικότητα, τηλέφωνο — 1 λεπτό.' },
  { n: '2', t: 'Φωτογραφίες & λογότυπο', d: 'Σύρετε τα αρχεία εδώ ή στείλτε ένα link WeTransfer.' },
  { n: '3', t: 'Αποστολή', d: 'Ξεκινάμε αμέσως. Το πρώτο δείγμα σε 2–3 εργάσιμες.' },
];

export default function YlikaPage() {
  return (
    <section className="relative pb-20 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-[0.14]" style={{ background: 'radial-gradient(ellipse at center, #47c8f5 0%, transparent 62%)' }} aria-hidden="true" />
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <p className="text-electric-cyan text-xs font-semibold tracking-[0.2em] uppercase mb-4">Advon Media · Υλικό ιστοσελίδας</p>
        <h1 className="font-display text-white leading-[1.02] mb-5" style={{ fontSize: 'clamp(2.2rem, 5.2vw, 3.9rem)' }}>
          Στείλτε μας το υλικό<br /><span className="text-electric-cyan">για την ιστοσελίδα σας.</span>
        </h1>
        <p className="text-white/70 text-lg leading-relaxed max-w-[42rem] mb-10">
          Τρία λεπτά από εσάς. Ό,τι δεν έχετε, το βρίσκουμε εμείς — δεν χρειάζεται να είναι όλα τέλεια.
        </p>
        <ol className="grid sm:grid-cols-3 gap-4 mb-12">
          {STEPS.map((s) => (
            <li key={s.n} className="glass-panel rounded-2xl p-5">
              <span className="inline-grid place-items-center w-9 h-9 rounded-full bg-electric-cyan/15 text-electric-cyan font-bold mb-3">{s.n}</span>
              <p className="text-white font-semibold">{s.t}</p>
              <p className="text-white/60 text-sm mt-1">{s.d}</p>
            </li>
          ))}
        </ol>
        <IntakeForm />
      </div>
    </section>
  );
}
