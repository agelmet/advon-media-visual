// app/dorean-istoselida/efcharisto/page.jsx — thank-you page = the booking moment
import Bi from '@/components/Bi';
import ZohoInline from '@/components/ZohoInline';

export const metadata = {
  title: 'Ευχαριστούμε — κλείστε το 10λεπτο τηλεφώνημά σας | Advon Media',
  robots: { index: false, follow: false },
};

export default function ThankYou() {
  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <Bi as="span" className="eyebrow" el="Το λάβαμε" en="Received" />
        <h1 className="font-display text-paper mt-4 mb-4 leading-[1.02]" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)' }}>
          <Bi el="Ευχαριστούμε. Κλείστε τώρα το 10λεπτο τηλεφώνημά σας." en="Thank you. Book your 10-minute call now." />
        </h1>
        <Bi as="p" className="text-paper-2 text-lg leading-relaxed max-w-[40rem] mb-8" el="Διαλέξτε την ώρα που σας βολεύει — θα μιλήσετε απευθείας με τον Άγγελο, θα δείτε πώς δουλεύουμε και θα ξεκινήσουμε το δείγμα σας. Αν δεν κλείσετε ραντεβού, θα σας καλέσουμε εμείς σε λίγα λεπτά, σε ώρες γραφείου." en="Pick the time that suits you — you will speak directly with Angelos, see how we work, and we will start your draft. If you do not book, we will call you within minutes during office hours." />
        <div className="card-v2 p-4 md:p-6">
          <ZohoInline auto id="zoho-thankyou" />
        </div>
        <p className="mt-6 text-sm text-paper-3">
          <Bi el="Θα λάβετε το link του Google Meet στο email σας και μια υπενθύμιση 30 λεπτά πριν." en="You will receive the Google Meet link by email and a reminder 30 minutes before." />
        </p>
      </div>
    </section>
  );
}
