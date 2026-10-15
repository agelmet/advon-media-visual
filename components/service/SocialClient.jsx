// components/service/SocialClient.jsx
// «Social Media» (Instagram & Facebook) — services v3, Oct 2026.
// Signature: a phone-framed Instagram profile in the SITE's brand that fills in
// tile by tile, the 3-step illustrated setup (≈3 minutes, no password), the
// content mix bar and the monthly timeline. Copy lives here + lib/services.js.
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';
import { FaqSection, CtaBand } from '@/components/service/blocks';
import { Phone, ChatMock, SetupStep, TotalBand, RuleList, Head, Chips, PriceCard, KV, Stat, useLang } from '@/components/service/setup';

const T = {
  el: {
    label: 'Social Media · Instagram & Facebook',
    h1: 'Ένα Instagram που μοιάζει με την ιστοσελίδα σας.',
    chips: ['Χωρίς κωδικούς', 'Ρύθμιση σε 3 λεπτά', 'Χωρίς δέσμευση', 'Από 49€ τον μήνα'],
    cta1: 'Δείτε τα πακέτα', cta2: 'Πώς ξεκινάμε',
    heroCap: 'Παράδειγμα. Τα χρώματα, οι γραμματοσειρές και το λογότυπο έρχονται από την ιστοσελίδα σας.',
    srcLabel: 'Το περιεχόμενο', srcTitle: 'Δεν χρειάζεται να μας στείλετε τίποτα.',
    srcLead: 'Έχουμε φτιάξει την ιστοσελίδα σας και πάνω από 220 ιστοσελίδες επαγγελματιών. Ξέρουμε τι ρωτάει ο κόσμος για τη δουλειά σας — και από πού θα έρθει κάθε post.',
    src: [
      ['Η ιστοσελίδα σας', 'Υπηρεσίες, κείμενα, φωτογραφίες, χρώματα και λογότυπο — η ταυτότητα υπάρχει ήδη.'],
      ['Οι αληθινές κριτικές σας', 'Από το Google και τις πλατφόρμες σας, αυτολεξεί. Ποτέ επινοημένες.'],
      ['Οι ερωτήσεις του κοινού σας', 'Τι ψάχνει ο κόσμος για την ειδικότητά σας, στην περιοχή σας — κάθε ερώτηση γίνεται ένα post.'],
      ['Προαιρετικά: δικές σας λήψεις', 'Αν θέλετε, στέλνετε φωτογραφίες ή μικρά βίντεο από το κινητό. Αν όχι, τα posts είναι εξίσου πλήρη.'],
    ],
    pkLabel: 'Πακέτα', pkTitle: 'Τρία πακέτα. Όλα με την ίδια ποιότητα.',
    pkLead: 'Η διαφορά είναι πόσο συχνά σας βλέπει το κοινό σας. Instagram και Facebook μαζί, σε όλα.',
    per: '/μήνα + ΦΠΑ', choose: 'Επιλογή', hot: 'Η πιο συχνή επιλογή',
    pk: [
      ['Βασικό', '49€', 'Σταθερή, επαγγελματική παρουσία', ['8 posts τον μήνα · 2 την εβδομάδα', '6 σχεδιασμένα posts & carousels', '2 reels με υπότιτλους', 'Κείμενα και στοχευμένα hashtags', 'Δημοσίευση στις καλύτερες ώρες του κοινού σας', 'Βελτίωση προφίλ στην αρχή: bio, σύνδεσμος, highlights', 'Μηνιαία γραπτή αναφορά']],
      ['Ανάπτυξη', '79€', 'Ό,τι χρειάζεται για να μεγαλώσει ο λογαριασμός', ['12 posts τον μήνα · 3 την εβδομάδα', '8 σχεδιασμένα posts & carousels', '4 reels με υπότιτλους', 'Κάθε post και ως story', 'Οι αληθινές κριτικές σας σε σχεδιασμένα posts', 'Ημερολόγιο με τις ημέρες της ειδικότητάς σας', 'Όλα όσα περιλαμβάνει το Βασικό']],
      ['Pro', '99€', 'Παρουσία σχεδόν κάθε μέρα', ['16 posts τον μήνα · 4 την εβδομάδα', '10 σχεδιασμένα posts & carousels', '6 reels, ένα από αυτά περιήγηση στην ιστοσελίδα σας', 'Κάθε post και ως story', 'Οι αληθινές κριτικές σας σε σχεδιασμένα posts', 'Αναφορά με σύγκριση μήνα με μήνα και προτάσεις', 'Όλα όσα περιλαμβάνει η Ανάπτυξη']],
    ],
    pkFine: 'Χωρίς κόστος ρύθμισης · Πρώτα βλέπετε ολόκληρο τον πρώτο μήνα έτοιμο και η πληρωμή γίνεται με την έγκρισή σας · Τραπεζική κατάθεση με τιμολόγιο · Ετήσια προπληρωμή: 2 μήνες δώρο · Χωρίς δέσμευση',
    mLabel: 'Η μέθοδος', mTitle: 'Κάθε μήνας έχει σχέδιο, όχι τυχαία posts.',
    mLead: 'Ένας λογαριασμός που μόνο διαφημίζει δεν τον ακολουθεί κανείς. Μοιράζουμε τον μήνα έτσι ώστε το κοινό σας να μαθαίνει, να σας γνωρίζει και να σας εμπιστεύεται.',
    mix: [['35% Γνώση', 'Απαντήσεις σε ερωτήσεις, μύθοι, συμβουλές'], ['20% Υπηρεσίες', 'Για ποιον είναι, πώς γίνεται, τι περιμένει'], ['15% Εσείς', 'Ο άνθρωπος και ο χώρος πίσω από το όνομα'], ['15% Κριτικές', 'Αληθινές, αυτολεξεί, με την άδειά σας'], ['15% Επικαιρότητα', 'Γιορτές, παγκόσμιες ημέρες, ωράρια']],
    kvTitle: 'Τι κάνουμε σε κάθε post',
    kv: [
      ['Μορφή', '4:5 (1080×1350) για τα posts, ώστε να πιάνουν όση οθόνη επιτρέπει το Instagram. 9:16 για reels και stories, με το κείμενο μέσα στις ασφαλείς ζώνες.'],
      ['Πρώτη διαφάνεια', 'Ένα σαφές θέμα που σταματά το scroll. Η τελευταία δείχνει πώς κλείνει κανείς ραντεβού μαζί σας.'],
      ['Κείμενο', 'Στο δικό σας ύφος, με τις λέξεις που αναζητά ο κόσμος (π.χ. «ψυχολόγος Χαλάνδρι»). Το Instagram λειτουργεί πλέον και ως μηχανή αναζήτησης.'],
      ['Hashtags', '5–10 στοχευμένα: ειδικότητα, περιοχή, θέμα. Όχι 30 γενικά που δεν φέρνουν κανέναν.'],
      ['Reels', 'Υπότιτλοι σε κάθε reel, γιατί οι περισσότεροι βλέπουν χωρίς ήχο. Εξώφυλλο που κρατά το προφίλ σας ενιαίο.'],
      ['Ώρα δημοσίευσης', 'Από τα στατιστικά του δικού σας κοινού, όχι στην τύχη.'],
      ['Προσβασιμότητα', 'Περιγραφή εικόνας (alt text) σε κάθε post, για όσους χρησιμοποιούν αναγνώστη οθόνης.'],
      ['Ταυτότητα', 'Τα χρώματα, οι γραμματοσειρές και το λογότυπο της ιστοσελίδας σας. Όποιος δει ένα post, αναγνωρίζει εσάς.'],
    ],
    sLabel: 'Πώς ξεκινάμε', sTitle: 'Τρία βήματα. Περίπου 3 λεπτά.',
    sLead: 'Δεν μας δίνετε κανέναν κωδικό. Μας δίνετε «πρόσβαση συνεργάτη» — τον επίσημο τρόπο της Meta για να δουλεύει ένα γραφείο στα προφίλ σας. Τα προφίλ μένουν 100% δικά σας.',
    s1: ['Το Instagram σας να είναι επαγγελματικό', '1 λεπτό', 'Τις περισσότερες φορές είναι ήδη επαγγελματικό. Αν βλέπετε την επιλογή «Επαγγελματικός πίνακας ελέγχου» στο προφίλ σας, προχωράτε κατευθείαν στο βήμα 2.'],
    s2: ['Πατάτε «Έγκριση» στο αίτημά μας', '1 λεπτό', 'Ζητάμε μόνο ό,τι χρειάζεται: δημοσίευση περιεχομένου και ανάγνωση στατιστικών. Όχι πληρωμές, όχι διαχείριση της Σελίδας.'],
    s3: ['Μας γράφετε «έγινε»', '10 δευτερόλεπτα', 'Δεν υπάρχει τηλεφώνημα, συνάντηση ή φόρμα να συμπληρώσετε.'],
    illu: 'Ενδεικτική απεικόνιση',
    total: 'Συνολικός χρόνος', totalV: '≈ 3 λεπτά', totalN: 'μία φορά, ποτέ ξανά',
    stopT: 'Και αν θελήσετε να σταματήσουμε;', stopB: 'Ρυθμίσεις → Συνεργάτες → Advon Media → Κατάργηση. Ένα κλικ, χωρίς να μας ρωτήσετε.',
    moLabel: 'Κάθε μήνα', moTitle: 'Εσείς πατάτε «Εγκρίνω». Αυτό είναι όλο.',
    moLead: 'Χωρίς τηλεφωνήματα και συναντήσεις. Όλα γραπτά, στην προσωπική σας σελίδα συνομιλίας.',
    tl: [['20', 'Ετοιμάζουμε τον μήνα', 'Θέματα, σχέδια, κείμενα και reels για τον επόμενο μήνα.'], ['21', 'Σας στέλνουμε έναν σύνδεσμο', 'Όλος ο μήνας σε μία σελίδα, όπως θα φαίνεται στο κινητό.'], ['24', 'Εγκρίνετε ή ζητάτε αλλαγή', 'Αν δεν απαντήσετε σε 3 ημέρες, προχωράμε όπως είναι.'], ['1', 'Δημοσίευση και αναφορά', 'Τα posts βγαίνουν μόνα τους. Λαμβάνετε την αναφορά του μήνα που πέρασε.']],
    repT: 'Η μηνιαία αναφορά σας', repS: 'ΔΕΙΓΜΑ · ΕΝΔΕΙΚΤΙΚΑ ΝΟΥΜΕΡΑ',
    rep: [['18.420', 'Προβολές των posts σας'], ['4.105', 'Άνθρωποι που σας είδαν'], ['+86', 'Νέοι ακόλουθοι'], ['142', 'Πατήματα στην ιστοσελίδα σας']],
    repF: 'Μία σελίδα, σε απλά ελληνικά: τι πήγε καλά, ποιο post άρεσε περισσότερο και τι αλλάζουμε τον επόμενο μήνα.',
    nLabel: 'Οι κανόνες μας', nTitle: 'Τι δεν κάνουμε ποτέ.',
    nLead: 'Ένας επαγγελματικός λογαριασμός χτίζεται με εμπιστοσύνη. Αυτά τα όρια ισχύουν για κάθε πελάτη, χωρίς εξαίρεση.',
    never: [
      { b: 'Δεν ζητάμε κωδικούς.', t: 'Ούτε για «διευκόλυνση». Η Meta το απαγορεύει, και ο λογαριασμός σας κλειδώνει όταν συνδέεται άγνωστη συσκευή.' },
      { b: 'Δεν αγοράζουμε ακόλουθους ή likes.', t: 'Το Instagram περιορίζει τους λογαριασμούς που το κάνουν.' },
      { b: 'Δεν γράφουμε ψεύτικες κριτικές ή υπερβολές', t: 'όπως «ο καλύτερος» ή «Νο1».' },
      { b: 'Δεν υποσχόμαστε θεραπεία ή αποτελέσματα', t: 'και δεν δημοσιεύουμε τίποτα που αντιβαίνει στον κώδικα δεοντολογίας του επαγγέλματός σας.' },
      { b: 'Δεν απαντάμε στα μηνύματα των πελατών σας.', t: 'Μια ερώτηση υγείας ή μια προσωπική ιστορία ανήκει σε εσάς.' },
      { b: 'Δεν σας δεσμεύουμε.', t: 'Σταματάτε με ένα μήνυμα, χωρίς ποινές.' },
    ],
    ig: { name: 'Ελένη Παπαδοπούλου · Ψυχολόγος', bio1: 'Ατομική ψυχοθεραπεία ενηλίκων · Χαλάνδρι & online', bio2: 'Ραντεβού από την ιστοσελίδα', hls: ['Υπηρεσίες', 'Ο χώρος', 'Κριτικές', 'Ραντεβού'], tiles: ['5 σημάδια ότι το άγχος σάς κουράζει', 'Πώς είναι η πρώτη συνεδρία', null, 'Μύθος ή αλήθεια; «Ψυχολόγο πάνε μόνο όσοι…»', 'Ένα λεπτό στο γραφείο', 'Ατομική ψυχοθεραπεία: για ποιον είναι', '3 ασκήσεις αναπνοής', null, 'Online συνεδρίες: πώς γίνονται'] },
    ph1: { bar: 'Ρυθμίσεις και δραστηριότητα', cap1: 'Ο λογαριασμός σας', r1: 'Κέντρο λογαριασμών', r2: 'Αποθηκευμένα', cap2: 'Για επαγγελματίες', hl: 'Τύπος λογαριασμού και εργαλεία', r3: 'Επαληθευμένο', last: 'Εναλλαγή σε επαγγελματικό λογαριασμό' },
    ph2: { bar: 'Αιτήματα', who: 'Advon Media', what: 'ζήτησε πρόσβαση συνεργάτη στη Σελίδα σας', perm: 'Δικαιώματα που ζητούνται', permV: 'Περιεχόμενο · Στατιστικά', no: 'Απόρριψη', yes: 'Έγκριση', what2: 'ζήτησε πρόσβαση στον λογαριασμό Instagram σας' },
    chat: [{ t: 'Σας στείλαμε το αίτημα. Πατήστε «Έγκριση» και πείτε μας.' }, { t: 'Έγινε!', me: true }, { t: 'Τέλεια. Σε 5 εργάσιμες θα δείτε όλο τον πρώτο μήνα έτοιμο.' }],
    bandLabel: 'Ξεκινήστε', bandTitle: 'Δείτε τον πρώτο σας μήνα έτοιμο.', bandLead: 'Τρία λεπτά από εσάς. Τα υπόλοιπα, από εμάς.', bandCta: 'Ξεκινάμε',
    trust: ['220+ ιστοσελίδες επαγγελματιών', '125+ κριτικές στο Google, όλες 5 αστέρων', '0 κωδικοί'],
  },
  en: {
    label: 'Social Media · Instagram & Facebook',
    h1: 'An Instagram that looks like your website.',
    chips: ['No passwords', '3-minute setup', 'No commitment', 'From €49 a month'],
    cta1: 'See the packages', cta2: 'How we start',
    heroCap: 'Example. The colours, fonts and logo come from your website.',
    srcLabel: 'The content', srcTitle: 'You do not need to send us anything.',
    srcLead: 'We built your website and over 220 websites for professionals. We know what people ask about your work — and where every post comes from.',
    src: [
      ['Your website', 'Services, texts, photos, colours and logo — the identity already exists.'],
      ['Your real reviews', 'From Google and your platforms, word for word. Never invented.'],
      ['Your audience’s questions', 'What people search for in your specialty, in your area — every question becomes a post.'],
      ['Optional: your own shots', 'If you want, send phone photos or short clips. If not, the posts are just as complete.'],
    ],
    pkLabel: 'Packages', pkTitle: 'Three packages. All the same quality.',
    pkLead: 'The difference is how often your audience sees you. Instagram and Facebook together, in all of them.',
    per: '/month + VAT', choose: 'Choose', hot: 'Most popular',
    pk: [
      ['Basic', '€49', 'A steady, professional presence', ['8 posts a month · 2 a week', '6 designed posts & carousels', '2 reels with subtitles', 'Captions and targeted hashtags', 'Published at your audience’s best times', 'Profile tidy-up at the start: bio, link, highlights', 'Monthly written report']],
      ['Growth', '€79', 'What it takes for the account to grow', ['12 posts a month · 3 a week', '8 designed posts & carousels', '4 reels with subtitles', 'Every post also as a story', 'Your real reviews as designed posts', 'A calendar of your profession’s days', 'Everything in Basic']],
      ['Pro', '€99', 'A presence almost every day', ['16 posts a month · 4 a week', '10 designed posts & carousels', '6 reels, one of them a tour of your website', 'Every post also as a story', 'Your real reviews as designed posts', 'Report with month-on-month comparison and suggestions', 'Everything in Growth']],
    ],
    pkFine: 'No setup fee · You first see the whole first month ready and pay on approval · Bank transfer with invoice · Yearly prepayment: 2 months free · No commitment',
    mLabel: 'The method', mTitle: 'Every month has a plan, not random posts.',
    mLead: 'Nobody follows an account that only advertises. We split the month so your audience learns, gets to know you and trusts you.',
    mix: [['35% Knowledge', 'Answers to questions, myths, tips'], ['20% Services', 'Who it is for, how it works, what to expect'], ['15% You', 'The person and the space behind the name'], ['15% Reviews', 'Real, word for word, with your permission'], ['15% Timely', 'Holidays, world days, opening hours']],
    kvTitle: 'What we do on every post',
    kv: [
      ['Format', '4:5 (1080×1350) for posts, to take as much screen as Instagram allows. 9:16 for reels and stories, text inside the safe zones.'],
      ['First slide', 'One clear topic that stops the scroll. The last one shows how to book with you.'],
      ['Caption', 'In your own tone, with the words people search for (e.g. “psychologist Chalandri”). Instagram now works as a search engine too.'],
      ['Hashtags', '5–10 targeted: specialty, area, topic. Not 30 generic ones that bring nobody.'],
      ['Reels', 'Subtitles on every reel, because most people watch without sound. A cover that keeps your profile consistent.'],
      ['Posting time', 'From your own audience’s statistics, not by chance.'],
      ['Accessibility', 'Image description (alt text) on every post, for screen-reader users.'],
      ['Identity', 'Your website’s colours, fonts and logo. Anyone who sees a post recognises you.'],
    ],
    sLabel: 'How we start', sTitle: 'Three steps. About 3 minutes.',
    sLead: 'You give us no password. You give us “partner access” — Meta’s official way for an agency to work on your profiles. The profiles stay 100% yours.',
    s1: ['Make your Instagram professional', '1 minute', 'Most of the time it already is. If you see “Professional dashboard” on your profile, go straight to step 2.'],
    s2: ['Press “Approve” on our request', '1 minute', 'We ask only for what is needed: publishing content and reading statistics. No payments, no Page management.'],
    s3: ['Write us “done”', '10 seconds', 'There is no call, meeting or form to fill in.'],
    illu: 'Illustration',
    total: 'Total time', totalV: '≈ 3 minutes', totalN: 'once, never again',
    stopT: 'And if you want us to stop?', stopB: 'Settings → Partners → Advon Media → Remove. One click, without asking us.',
    moLabel: 'Every month', moTitle: 'You press “Approve”. That is all.',
    moLead: 'No calls, no meetings. Everything in writing, on your personal chat page.',
    tl: [['20', 'We prepare the month', 'Topics, designs, captions and reels for next month.'], ['21', 'We send you one link', 'The whole month on one page, as it will look on the phone.'], ['24', 'You approve or ask for a change', 'If you do not answer in 3 days, we go ahead as prepared.'], ['1', 'Publishing and report', 'The posts go out by themselves. You receive last month’s report.']],
    repT: 'Your monthly report', repS: 'SAMPLE · INDICATIVE NUMBERS',
    rep: [['18,420', 'Views of your posts'], ['4,105', 'People who saw you'], ['+86', 'New followers'], ['142', 'Taps to your website']],
    repF: 'One page, in plain language: what went well, which post people liked most and what we change next month.',
    nLabel: 'Our rules', nTitle: 'What we never do.',
    nLead: 'A professional account is built on trust. These limits apply to every client, no exception.',
    never: [
      { b: 'We never ask for passwords.', t: 'Not even “for convenience”. Meta forbids it, and your account locks when an unknown device signs in.' },
      { b: 'We never buy followers or likes.', t: 'Instagram restricts accounts that do.' },
      { b: 'We never write fake reviews or superlatives', t: 'like “the best” or “No 1”.' },
      { b: 'We never promise a cure or results', t: 'and never post anything against your profession’s code of conduct.' },
      { b: 'We never answer your clients’ messages.', t: 'A health question or a personal story belongs to you.' },
      { b: 'We never lock you in.', t: 'You stop with one message, no penalties.' },
    ],
    ig: { name: 'Eleni Papadopoulou · Psychologist', bio1: 'Adult psychotherapy · Chalandri & online', bio2: 'Book from the website', hls: ['Services', 'The space', 'Reviews', 'Booking'], tiles: ['5 signs anxiety is wearing you down', 'What the first session is like', null, 'Myth or truth? “Only … see a psychologist”', 'One minute at the office', 'Individual therapy: who it is for', '3 breathing exercises', null, 'Online sessions: how they work'] },
    ph1: { bar: 'Settings and activity', cap1: 'Your account', r1: 'Accounts Centre', r2: 'Saved', cap2: 'For professionals', hl: 'Account type and tools', r3: 'Verified', last: 'Switch to professional account' },
    ph2: { bar: 'Requests', who: 'Advon Media', what: 'requested partner access to your Page', perm: 'Permissions requested', permV: 'Content · Insights', no: 'Decline', yes: 'Approve', what2: 'requested access to your Instagram account' },
    chat: [{ t: 'We sent the request. Press “Approve” and tell us.' }, { t: 'Done!', me: true }, { t: 'Perfect. In 5 working days you will see the whole first month ready.' }],
    bandLabel: 'Start', bandTitle: 'See your first month ready.', bandLead: 'Three minutes from you. The rest, from us.', bandCta: 'Let’s start',
    trust: ['220+ websites for professionals', '125+ Google reviews, all 5 stars', '0 passwords'],
  },
};

const MIX_COLORS = ['#47c8f5', '#6b8cf5', '#9b6bd6', '#c9ff00', '#f5b347'];
const MIX_W = [35, 20, 15, 15, 15];

function useInView(ref, cls = 'in', rootMargin = '0px 0px -12% 0px') {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden) { el.classList.add(cls); el.style.setProperty('--tl', 1); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add(cls); el.style.setProperty('--tl', 1); io.disconnect(); } }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, cls, rootMargin]);
}

function ProfilePhone({ t }) {
  const ig = t.ig;
  const kinds = ['a', 'b rl', 'c', 'b', 'a rl', 'b', 'c rl', 'a', 'b'];
  return (
    <Phone caption={t.heroCap} minH={420}>
      <div className="svc-ig">
        <div className="top"><div className="pic"><div>Ψ</div></div><div className="nums"><div><b>48</b>posts</div><div><b>1.204</b>{t === T.el ? 'ακόλουθοι' : 'followers'}</div><div><b>312</b>{t === T.el ? 'ακολουθεί' : 'following'}</div></div></div>
        <div className="nm">{ig.name}</div>
        <div className="bio">{ig.bio1}<br />{ig.bio2}<br /><span>papadopoulou-psychologos.gr</span></div>
        <div className="hls">{ig.hls.map((h) => <span key={h}><i />{h}</span>)}</div>
        <div className="svc-tiles">
          {ig.tiles.map((txt, i) => (
            <div key={i} className={kinds[i]} style={{ '--i': i }}>
              {txt === null ? (<><span className="st">★★★★★</span><span className="ln" style={{ width: '90%' }} /><span className="ln" style={{ width: '70%' }} /><span className="ln" style={{ width: '40%' }} /></>) : txt}
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

export default function SocialClient({ service }) {
  const lang = useLang();
  const t = T[lang];
  const mixRef = useRef(null);
  const tlRef = useRef(null);
  useInView(mixRef);
  useInView(tlRef);

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="pt-10 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-[20%] -left-[10%] w-[820px] h-[520px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(71,200,245,0.14) 0%, transparent 65%)' }} />
          <div className="absolute -bottom-[20%] -right-[10%] w-[520px] h-[520px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(107,63,160,0.2) 0%, transparent 65%)' }} />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative z-10 grid lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-10 items-center">
          <div>
            <ScrollReveal>
              <span className="section-label">{t.label}</span>
              <h1 className="font-black font-display text-white tracking-tight leading-[1.06] mb-6" style={{ fontSize: 'clamp(2.4rem, 5.6vw, 4.1rem)' }}>{t.h1}</h1>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <p className="text-gray-300 text-lg leading-relaxed max-w-xl">{service.pitch[lang]}</p>
              <Chips items={t.chips} />
              <div className="flex flex-wrap gap-3">
                <a href="#paketa" className="btn-premium inline-flex items-center gap-2 px-8 py-4 bg-electric-cyan text-[#050a0e] font-black text-sm uppercase tracking-[0.1em] rounded-xl hover:bg-white transition-colors" style={{ boxShadow: '0 0 30px rgba(71,200,245,0.35)' }}>{t.cta1}</a>
                <a href="#ksekinima" className="btn-premium inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-black text-sm uppercase tracking-[0.1em] rounded-xl hover:bg-white hover:text-[#050a0e] transition-colors">{t.cta2}</a>
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={160} direction="scale"><ProfilePhone t={t} /></ScrollReveal>
        </div>
      </section>

      {/* ─── CONTENT SOURCES ─── */}
      <section className="py-24 bg-[#0a1418]/60 border-y border-electric-cyan/8 mv-shoulder mv-amb">
        <div className="max-w-6xl mx-auto px-6">
          <Head center label={t.srcLabel} title={t.srcTitle} lead={t.srcLead} />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {t.src.map(([h, b], i) => (
              <ScrollReveal key={h} delay={i * 80} direction="deal" className="h-full" style={{ '--rz': `${(i % 2 ? 1 : -1) * 2}deg` }}>
                <TiltCard className="h-full">
                  <div className={`glass-panel card-sweep rounded-2xl p-6 h-full ${i === 3 ? 'border border-dashed border-white/15' : ''}`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${i === 3 ? 'bg-cyber-lime/8 border border-cyber-lime/25 text-cyber-lime' : 'bg-electric-cyan/10 border border-electric-cyan/20 text-electric-cyan'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        {i === 0 && <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" /></>}
                        {i === 1 && <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />}
                        {i === 2 && <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14" /><circle cx="12" cy="17.5" r=".6" fill="currentColor" /></>}
                        {i === 3 && <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>}
                      </svg>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{h}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{b}</p>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PACKAGES ─── */}
      <section id="paketa" className="py-24 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <Head center label={t.pkLabel} title={t.pkTitle} lead={t.pkLead} />
          <div className="grid lg:grid-cols-3 gap-6 mt-14 items-stretch">
            {t.pk.map(([tier, price, sub, items], i) => (
              <ScrollReveal key={tier} delay={i * 110} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'} className="h-full">
                <PriceCard tier={tier} price={price} priceNote={t.per} sub={sub} items={items} cta={t.choose} hot={i === 1} badge={t.hot} />
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={100}><p className="text-center text-xs text-gray-500 mt-7 max-w-3xl mx-auto leading-relaxed">{t.pkFine}</p></ScrollReveal>
        </div>
      </section>

      {/* ─── METHOD ─── */}
      <section className="py-24 bg-[#0a1418]/60 border-y border-electric-cyan/8 mv-shoulder mv-amb alt">
        <div className="max-w-6xl mx-auto px-6">
          <Head label={t.mLabel} title={t.mTitle} lead={t.mLead} />
          <div ref={mixRef} className="svc-mix" aria-hidden="true">
            {MIX_W.map((w, i) => <span key={i} style={{ width: `${w}%`, background: MIX_COLORS[i], transitionDelay: `${i * 90}ms` }} />)}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm text-gray-300">
            {t.mix.map(([h, b], i) => (
              <ScrollReveal key={h} delay={i * 70}><div><span className="inline-block w-2.5 h-2.5 rounded-sm mr-2 align-middle" style={{ background: MIX_COLORS[i] }} /><b className="text-white">{h}</b><div className="text-gray-400 mt-1">{b}</div></div></ScrollReveal>
            ))}
          </div>
          <ScrollReveal className="mt-16 mb-4"><h3 className="text-white font-bold text-2xl font-display">{t.kvTitle}</h3></ScrollReveal>
          <KV rows={t.kv} />
        </div>
      </section>

      {/* ─── SETUP ─── */}
      <section id="ksekinima" className="py-24 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <Head center label={t.sLabel} title={t.sTitle} lead={t.sLead} />
          <div className="mt-10">
            <SetupStep n={1} title={t.s1[0]} time={t.s1[1]} tip={t.s1[2]} illustration={
              <Phone caption={t.illu}>
                <div className="svc-bar"><span className="bk">‹</span>{t.ph1.bar}</div>
                <div className="svc-cap">{t.ph1.cap1}</div>
                <div className="svc-row">{t.ph1.r1}<span>›</span></div>
                <div className="svc-row">{t.ph1.r2}<span>›</span></div>
                <div className="svc-cap">{t.ph1.cap2}</div>
                <div className="svc-row hl">{t.ph1.hl}<span>›</span><span className="svc-tap" style={{ right: 6, top: -2 }} /></div>
                <div className="svc-row">{t.ph1.r3}<span>›</span></div>
                <div className="svc-row" style={{ border: 0, color: '#1877f2', fontWeight: 600 }}>{t.ph1.last}</div>
              </Phone>
            }>
              <p dangerouslySetInnerHTML={{ __html: service.steps[0].body[lang].replace(/(Τύπος λογαριασμού και εργαλεία|Εναλλαγή σε επαγγελματικό λογαριασμό|Account type and tools|Switch to professional account)/g, '<b>$1</b>') }} />
            </SetupStep>
            <SetupStep n={2} title={t.s2[0]} time={t.s2[1]} tip={t.s2[2]} illustration={
              <Phone caption={t.illu}>
                <div className="svc-bar"><span className="bk">‹</span>{t.ph2.bar}</div>
                <div className="svc-card">
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><div className="svc-av">A.</div><div><b>{t.ph2.who}</b><div style={{ fontSize: 11.5, color: '#666' }}>{t.ph2.what}</div></div></div>
                  <div style={{ fontSize: 11.5, color: '#444', marginTop: 12, lineHeight: 1.5 }}><b>{t.ph2.perm}</b><br />{t.ph2.permV}</div>
                  <div className="svc-bt"><div>{t.ph2.no}</div><div className="pri">{t.ph2.yes}</div><span className="svc-tap" style={{ right: 34, top: -4 }} /></div>
                </div>
                <div className="svc-card" style={{ opacity: .55 }}><div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><div className="svc-av">A.</div><div><b>{t.ph2.who}</b><div style={{ fontSize: 11.5, color: '#666' }}>{t.ph2.what2}</div></div></div></div>
              </Phone>
            }>
              <p>{service.steps[1].body[lang]}</p>
            </SetupStep>
            <SetupStep n={3} title={t.s3[0]} time={t.s3[1]} tip={t.s3[2]} illustration={<ChatMock lines={t.chat} lang={lang} />}>
              <p>{service.steps[2].body[lang]}</p>
            </SetupStep>
          </div>
          <TotalBand total={{ label: t.total, value: t.totalV }} totalNote={t.totalN} stopTitle={t.stopT} stopBody={t.stopB} />
        </div>
      </section>

      {/* ─── MONTHLY ─── */}
      <section className="py-24 bg-[#0a1418]/60 border-y border-electric-cyan/8 mv-shoulder mv-amb">
        <div className="max-w-6xl mx-auto px-6">
          <Head label={t.moLabel} title={t.moTitle} lead={t.moLead} />
          <div ref={tlRef} className="svc-timeline mt-12">
            {t.tl.map(([d, h, b], i) => (
              <ScrollReveal key={d} delay={i * 120} direction="up"><div data-d={d}><b>{h}</b><p>{b}</p></div></ScrollReveal>
            ))}
          </div>
          <ScrollReveal direction="scale" className="mt-14">
            <div className="glass-panel rounded-3xl p-6 md:p-8">
              <div className="flex justify-between flex-wrap gap-2 items-baseline"><h3 className="text-white font-bold text-xl">{t.repT}</h3><span className="text-xs text-gray-500 tracking-wider">{t.repS}</span></div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">{t.rep.map(([v, l]) => <Stat key={l} value={v} label={l} />)}</div>
              <p className="text-sm text-gray-500 mt-2 px-5">{t.repF}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── NEVER ─── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-start">
          <Head label={t.nLabel} title={t.nTitle} lead={t.nLead} />
          <ScrollReveal direction="right"><RuleList items={t.never} kind="no" /></ScrollReveal>
        </div>
      </section>

      <FaqSection service={service} />

      {/* ─── BAND ─── */}
      <section className="pb-8">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal direction="scale">
            <div className="relative overflow-hidden rounded-3xl border border-electric-cyan/30 p-10 md:p-14 text-center" style={{ background: 'radial-gradient(ellipse at top, rgba(71,200,245,.16), transparent 60%), rgba(255,255,255,.03)' }}>
              <span className="section-label">{t.bandLabel}</span>
              <h2 className="font-black font-display text-white tracking-tight mb-3" style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.8rem)' }}>{t.bandTitle}</h2>
              <p className="text-gray-400 text-lg mb-7">{t.bandLead}</p>
              <Link href="#contact" className="btn-premium inline-flex items-center gap-3 px-10 py-4 bg-electric-cyan text-[#050a0e] font-black text-base uppercase tracking-[0.1em] rounded-xl hover:bg-white transition-all" style={{ boxShadow: '0 0 30px rgba(71,200,245,0.4)' }}>{t.bandCta}</Link>
              <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 mt-6 text-sm text-gray-400">{t.trust.map((s) => <span key={s}><b className="text-white">{s.split(' ')[0]}</b> {s.split(' ').slice(1).join(' ')}</span>)}</div>
            </div>
          </ScrollReveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
