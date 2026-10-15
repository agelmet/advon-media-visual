// components/service/GoogleAdsClient.jsx
// «Google Ads» — services v3, Oct 2026. Signature: a drawn Google result with the
// client in first position, the 60-day guarantee seal, «5 things that decide it»,
// the 3-step illustrated setup (≈5 minutes, no password) and the live calculator.
'use client';

import { useState } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';
import { FaqSection } from '@/components/service/blocks';
import { Phone, ChatMock, SetupStep, TotalBand, RuleList, Head, Chips, PriceCard, KV, Stat, useLang } from '@/components/service/setup';

const T = {
  el: {
    label: 'Google Ads', h1: 'Πρώτοι στο Google, τη στιγμή που σας αναζητούν.',
    chips: ['Χωρίς κωδικούς', 'Ρύθμιση σε 5 λεπτά', 'Στήσιμο 0€', 'Εγγύηση 60 ημερών'],
    cta1: 'Δωρεάν έλεγχος περιοχής', cta2: 'Πώς ξεκινάμε',
    q: 'ψυχολόγος περιστέρι', sp: 'Χορηγούμενο', adName: 'Ελένη Παπαδοπούλου', adT: 'Ψυχολόγος στο Περιστέρι — Κλείστε Ραντεβού', adD: 'Ατομική ψυχοθεραπεία ενηλίκων, δια ζώσης και online. Δείτε το γραφείο και τις κριτικές.', ex: ['Κλήση', 'Υπηρεσίες', 'Κριτικές', 'Ραντεβού'], org: 'Ψυχολόγοι στο Περιστέρι — Κατάλογος',
    heroCap: 'Παράδειγμα. Πρώτη θέση, με το κουμπί κλήσης δίπλα στο όνομά σας.',
    wLabel: 'Γιατί Google', wTitle: 'Δεν πείθουμε κανέναν. Του δείχνουμε πού να πάει.',
    cLabel: 'Κόστος', cTitle: 'Ξεκινάτε με 0€.', cLead: 'Δύο ξεχωριστά ποσά, ξεκάθαρα: η δική μας διαχείριση, και η διαφήμιση που πληρώνετε απευθείας στη Google.',
    p1: ['Διαχείριση από την Advon Media', '59€', '/μήνα + ΦΠΑ', 'Από τον 2ο μήνα · κανονική τιμή 79€ · μένει ίδια όσο συνεργαζόμαστε', ['Στήσιμο λογαριασμού και καμπάνιας: 0€ (αξία 250€)', 'Μέτρηση κλήσεων στην ιστοσελίδα σας: 0€ (αξία 120€)', 'Πρώτος μήνας διαχείρισης: 0€', 'Έλεγχος και βελτίωση κάθε εβδομάδα', 'Απεριόριστες αλλαγές: νέα υπηρεσία, άλλες ώρες, διακοπές', 'Μηνιαία γραπτή αναφορά σε απλά ελληνικά'], 'Τιμή ιδρυτικού πελάτη · 20 θέσεις'],
    p2: ['Διαφημιστικό ποσό · προς τη Google', '5€', '/ημέρα από', 'Περίπου 150€ τον μήνα · το ορίζετε εσείς', ['Πληρώνεται απευθείας στη Google, με τη δική σας κάρτα', 'Εμείς δεν το αγγίζουμε ποτέ', 'Η Google δεν χρεώνει πάνω από το μηνιαίο όριο', 'Το αλλάζετε ή το σταματάτε όποτε θέλετε', 'Το τιμολόγιο της Google έρχεται στο ΑΦΜ σας', 'Στον δωρεάν έλεγχο σας λέμε το σωστό ποσό για την ειδικότητα και την περιοχή σας']],
    gT: 'Αν δεν φέρει αποτέλεσμα, δεν πληρώνετε εμάς.', gB: 'Αν στις πρώτες 60 ημέρες οι διαφημίσεις δεν σας φέρουν τουλάχιστον 10 επαφές — κλήσεις ή αιτήματα ραντεβού — δεν πληρώνετε διαχείριση και συνεχίζουμε δωρεάν μέχρι να έρθουν.', gF: 'Αρκεί οι διαφημίσεις να τρέχουν όλο το διάστημα με το ημερήσιο ποσό που ορίσαμε μαζί στον δωρεάν έλεγχο. Κάθε επαφή φαίνεται στη μηνιαία αναφορά.', gSeal: 'ημέρες εγγύηση',
    mLabel: 'Η μέθοδος', mTitle: 'Πέντε πράγματα κρίνουν αν μια διαφήμιση φέρνει ραντεβού.', mLead: 'Τα περισσότερα χρήματα στο Google Ads χάνονται σε λάθος αναζητήσεις, λάθος περιοχές και καμπάνιες που δεν μετράνε τίποτα. Αυτό φροντίζουμε από την πρώτη μέρα.',
    five: [
      ['Οι σωστές λέξεις', '«ψυχολόγος Περιστέρι» ναι· «ψυχολόγος μισθός» όχι. Αποκλείουμε φοιτητές, αγγελίες εργασίας, δωρεάν και δημόσιες υπηρεσίες, ώστε να πληρώνετε μόνο για πιθανούς πελάτες.'],
      ['Η σωστή περιοχή', 'Ακτίνα γύρω από το γραφείο σας ή συγκεκριμένοι δήμοι — και μόνο άτομα που βρίσκονται εκεί, όχι όσοι «ενδιαφέρονται» για την περιοχή από αλλού.'],
      ['Οι σωστές ώρες', 'Οι διαφημίσεις τρέχουν όταν μπορεί κάποιος να σας καλέσει ή να κλείσει online. Βράδια και Κυριακές ο κόσμος ψάχνει βοήθεια — τα κρατάμε όταν υπάρχει online ραντεβού.'],
      ['Μέτρηση', 'Μετράμε κάθε πάτημα στο τηλέφωνο και κάθε κλικ για ραντεβού που ήρθε από διαφήμιση. Χωρίς μέτρηση, μια καμπάνια είναι τυφλή· με μέτρηση, η Google μαθαίνει ποιοι καλούν.'],
      ['Υπομονή με σχέδιο', 'Οι πρώτες 2–3 εβδομάδες είναι περίοδος εκμάθησης. Ο 2ος μήνας είναι πιο αποδοτικός από τον 1ο και ο 3ος ακόμη περισσότερο, γιατί κόβουμε ό,τι δεν φέρνει κλήσεις.'],
      ['Το πλεονέκτημά σας', 'Ιστοσελίδα και διαφήμιση από την ίδια ομάδα. Η σελίδα στην οποία καταλήγει ο επισκέπτης είναι φτιαγμένη για να πάρει τηλέφωνο — και τη μέτρηση τη στήνουμε εμείς, χωρίς τίποτα από εσάς.'],
    ],
    kvTitle: 'Τι στήνουμε, αναλυτικά',
    kv: [
      ['Τύπος καμπάνιας', 'Αναζήτηση (Search). Εμφανίζεστε μόνο σε όποιον ψάχνει ήδη αυτό που κάνετε — όχι σε banners ή βίντεο.'],
      ['Ομάδες διαφημίσεων', '2–4, μία ανά υπηρεσία (π.χ. ψυχολόγος · ψυχοθεραπεία · ψυχολόγος online), με 10–20 λέξεις-κλειδιά η καθεμία, σε ακριβή αντιστοίχιση και αντιστοίχιση φράσης, ελληνικά και greeklish.'],
      ['Αρνητικές λέξεις', 'Έτοιμη λίστα που αποκλείει όσους δεν είναι πελάτες: δωρεάν, δημόσιο, νοσοκομείο, ΕΟΠΥΥ, σπουδές, μεταπτυχιακό, μισθός, αγγελίες, pdf — συμπληρωμένη κάθε εβδομάδα από τις πραγματικές αναζητήσεις.'],
      ['Διαφημίσεις', 'Responsive αγγελίες με 12–15 τίτλους ανά ομάδα: περιοχή, υπηρεσία, «Κλείστε ραντεβού», «Και online», τα πραγματικά σας πτυχία. Η Google δοκιμάζει τους συνδυασμούς και κρατά όσους φέρνουν κλήσεις.'],
      ['Επεκτάσεις', 'Κουμπί κλήσης, σύνδεσμοι προς Υπηρεσίες · Κριτικές · Ραντεβού · Επικοινωνία, σύντομα πλεονεκτήματα (π.χ. «Συνεδρίες και online»).'],
      ['Μέτρηση', 'Πάτημα τηλεφώνου, κλικ για online ραντεβού, αποστολή φόρμας — στην ιστοσελίδα σας, σύμφωνα με τον GDPR: μόνο μετά την αποδοχή cookies, με Consent Mode της Google.'],
      ['Στρατηγική προσφορών', 'Τις πρώτες 2–3 εβδομάδες «Μεγιστοποίηση κλικ» με ανώτατο κόστος ανά κλικ. Μόλις καταγραφούν περίπου 15 επαφές, «Μεγιστοποίηση μετατροπών», ώστε η Google να βρίσκει ανθρώπους που καλούν.'],
      ['Εβδομαδιαίος έλεγχος', 'Οι πραγματικές αναζητήσεις που έφεραν κλικ: ό,τι δεν ταιριάζει αποκλείεται, ό,τι φέρνει κλήσεις δυναμώνει. Ο προϋπολογισμός δεν ξεπερνιέται ποτέ.'],
    ],
    sLabel: 'Πώς ξεκινάμε', sTitle: 'Τρία βήματα. Περίπου 5 λεπτά.', sLead: 'Τον λογαριασμό, την καμπάνια και τη μέτρηση τα στήνουμε εμείς. Εσείς αποδέχεστε μία πρόσκληση και βάζετε την κάρτα σας. Κανένας κωδικός.',
    s1: ['Πατάτε «Αποδοχή» στο email της Google', '1 λεπτό', 'Έχετε ήδη λογαριασμό Google Ads; Μας στέλνετε τον 10ψήφιο αριθμό του (πάνω δεξιά) και πατάτε «Αποδοχή» στο αίτημα σύνδεσης. Το ίδιο απλό.'],
    s2: ['Βάζετε την κάρτα σας και το ΑΦΜ', '3 λεπτά', 'Με το ΑΦΜ, η Google εκδίδει τιμολόγιο στην επιχείρησή σας κάθε μήνα — για τον λογιστή σας. Η κάρτα χρεώνεται μόνο για τα κλικ, ποτέ πάνω από το όριο.'],
    s3: ['Μας γράφετε «έγινε»', '10 δευτερόλεπτα', 'Μετά από λίγες εβδομάδες η Google μπορεί να ζητήσει επιβεβαίωση της επιχείρησης. Σας στέλνουμε ακριβώς τι να ανεβάσετε — περίπου 5 λεπτά.'],
    illu: 'Ενδεικτική απεικόνιση',
    m1: { inbox: 'Εισερχόμενα', subj: 'Πρόσκληση για πρόσβαση σε λογαριασμό Google Ads', from: 'Google Ads', to: 'προς εσάς', body1: 'Η Advon Media σας προσκάλεσε στον λογαριασμό Google Ads', acc: '«Ελένη Παπαδοπούλου — Ψυχολόγος»', lvl: 'Επίπεδο πρόσβασης:', lvlV: 'Διαχειριστής', btn: 'Αποδοχή πρόσκλησης' },
    m2: { bar: 'Ρύθμιση χρέωσης', f: [['Χώρα', 'Ελλάδα', 0], ['Τύπος λογαριασμού', 'Επιχείρηση', 1], ['Επωνυμία', 'Ελένη Παπαδοπούλου', 0], ['ΑΦΜ (VAT)', 'EL 123456789', 1], ['Κάρτα', '•••• •••• •••• 4821', 0]], btn: 'Υποβολή' },
    chat: [{ t: 'Έβαλα την κάρτα, έγινε!', me: true }, { t: 'Ευχαριστούμε! Η καμπάνια σας είναι έτοιμη για έγκριση από τη Google. Σε 3–5 εργάσιμες τρέχει, και θα σας ενημερώσουμε.' }],
    total: 'Συνολικός χρόνος', totalV: '≈ 5 λεπτά', totalN: 'μία φορά', stopT: 'Και αν θελήσετε να σταματήσουμε;', stopB: 'Μας αφαιρείτε από τον λογαριασμό με ένα κλικ. Ο λογαριασμός, οι διαφημίσεις και όλο το ιστορικό μένουν δικά σας.',
    rLabel: 'Κάθε μήνα', rTitle: 'Μία σελίδα. Πόσοι σας βρήκαν, πόσοι σας κάλεσαν, πόσο κόστισε.', rLead: 'Γραπτή αναφορά, χωρίς τηλεφωνήματα και συναντήσεις — μαζί με το τι αλλάξαμε και γιατί.', rS: 'ΔΕΙΓΜΑ · ΕΝΔΕΙΚΤΙΚΑ ΝΟΥΜΕΡΑ',
    rep: [['2.140', 'Σας είδαν στο Google'], ['168', 'Πάτησαν τη διαφήμιση'], ['14', 'Σας κάλεσαν'], ['5', 'Ζήτησαν ραντεβού online'], ['8€', 'Κόστος ανά επαφή']],
    calcT: 'Αρκεί ένας νέος άνθρωπος τον μήνα για να βγει.', calcL: 'Ένας νέος θεραπευόμενος ή ασθενής σπάνια έρχεται μόνο μία φορά. Βάλτε τα δικά σας νούμερα.',
    c1: 'Τιμή συνεδρίας / επίσκεψης (€)', c2: 'Πόσες φορές έρχεται ένας νέος, κατά μέσο όρο', c3: 'Ποσό διαφήμισης την ημέρα (€)', o1: 'Κόστος τον μήνα, όλα μαζί', o2: 'Τι αφήνει ένας νέος άνθρωπος', o3: 'Για να καλυφθεί όλο το κόστος αρκεί', one: 'νέος τον μήνα', many: 'νέοι τον μήνα',
    nLabel: 'Οι κανόνες μας', nTitle: 'Τι δεν κάνουμε ποτέ.', yLabel: 'Οι δεσμεύσεις μας', yTitle: 'Τι ισχύει πάντα.',
    never: [
      { b: 'Δεν ζητάμε κωδικούς.', t: 'Δουλεύουμε από τον λογαριασμό διαχειριστή της Advon Media.' },
      { b: 'Δεν ξοδεύουμε σε banners, YouTube ή «Performance Max»', t: 'για ένα γραφείο. Φέρνουν προβολές σε ανθρώπους που δεν έψαχναν.' },
      { b: 'Δεν χρησιμοποιούμε τις «έξυπνες» καμπάνιες', t: 'που προτείνει η Google σε νέους λογαριασμούς. Κρύβουν ποιες αναζητήσεις πληρώνετε.' },
      { b: 'Δεν αγγίζουμε τα χρήματά σας.', t: 'Η Google χρεώνει τη δική σας κάρτα.' },
      { b: 'Δεν υποσχόμαστε αριθμό ασθενών.', t: 'Υποσχόμαστε επαφές — κλήσεις και αιτήματα ραντεβού — που μετριούνται.' },
      { b: 'Δεν γράφουμε υπερβολές', t: '(«ο καλύτερος», «Νο1») ή υποσχέσεις θεραπείας. Ούτε ο κώδικας δεοντολογίας ούτε η πολιτική υγείας της Google το επιτρέπουν.' },
    ],
    always: [
      { b: 'Ένας ανά ειδικότητα, ανά περιοχή.', t: 'Δεν διαφημίζουμε δύο συναδέλφους στην ίδια περιοχή.' },
      { b: 'Ο λογαριασμός είναι δικός σας.', t: 'Αν σταματήσετε, κρατάτε τον λογαριασμό, τις διαφημίσεις και όλο το ιστορικό.' },
      { b: 'Παύση στις διακοπές.', t: 'Κλείνετε τον Αύγουστο; Παγώνουμε διαφημίσεις και χρέωση, έως έναν μήνα τον χρόνο.' },
      { b: 'Χωρίς δέσμευση.', t: 'Σταματάτε με ένα μήνυμα, χωρίς ποινές και ψιλά γράμματα.' },
      { b: 'Ειλικρίνεια από την αρχή.', t: 'Αν ο δωρεάν έλεγχος δείξει ότι δεν αξίζει στην περιοχή σας, σας το λέμε — και δεν ξεκινάμε.' },
    ],
    bandLabel: 'Δωρεάν έλεγχος περιοχής', bandTitle: 'Αξίζει για εσάς; Ας το δούμε δωρεάν.', bandLead: 'Στείλτε μας την ειδικότητα και την περιοχή σας. Σε 2 εργάσιμες σας λέμε πόσοι σας αναζητούν και τι κόστος να περιμένετε — χωρίς καμία υποχρέωση.', bandCta: 'Θέλω τον δωρεάν έλεγχο',
    trust: ['220+ ιστοσελίδες επαγγελματιών', '125+ κριτικές στο Google, όλες 5 αστέρων', '20 θέσεις με τιμή ιδρυτικού πελάτη'],
  },
  en: {
    label: 'Google Ads', h1: 'First on Google, the moment they search for you.',
    chips: ['No passwords', '5-minute setup', 'Setup €0', '60-day guarantee'],
    cta1: 'Free area check', cta2: 'How we start',
    q: 'psychologist peristeri', sp: 'Sponsored', adName: 'Eleni Papadopoulou', adT: 'Psychologist in Peristeri — Book an Appointment', adD: 'Individual psychotherapy for adults, in person and online. See the office and the reviews.', ex: ['Call', 'Services', 'Reviews', 'Booking'], org: 'Psychologists in Peristeri — Directory',
    heroCap: 'Example. First position, with the call button next to your name.',
    wLabel: 'Why Google', wTitle: 'We convince nobody. We show them where to go.',
    cLabel: 'Cost', cTitle: 'You start with €0.', cLead: 'Two separate amounts, clearly: our management, and the advertising you pay directly to Google.',
    p1: ['Management by Advon Media', '€59', '/month + VAT', 'From the 2nd month · regular price €79 · stays the same as long as we work together', ['Account and campaign setup: €0 (worth €250)', 'Call measurement on your website: €0 (worth €120)', 'First month of management: €0', 'A check and improvement every week', 'Unlimited changes: new service, other hours, holidays', 'Monthly written report in plain language'], 'Founder price · 20 places'],
    p2: ['Ad budget · to Google', '€5', '/day from', 'About €150 a month · you set it', ['Paid directly to Google, with your own card', 'We never touch it', 'Google never charges above the monthly limit', 'Change or stop it whenever you want', 'Google’s invoice comes to your tax number', 'In the free check we tell you the right amount for your specialty and area']],
    gT: 'If it brings no result, you do not pay us.', gB: 'If in the first 60 days the ads do not bring you at least 10 contacts — calls or booking requests — you pay no management and we keep working for free until they come.', gF: 'As long as the ads run for the whole period with the daily budget we set together in the free check. Every contact appears in the monthly report.', gSeal: 'day guarantee',
    mLabel: 'The method', mTitle: 'Five things decide whether an ad brings appointments.', mLead: 'Most Google Ads money is lost on the wrong searches, the wrong areas and campaigns that measure nothing. We take care of that from day one.',
    five: [
      ['The right words', '“psychologist Peristeri” yes; “psychologist salary” no. We exclude students, job ads, free and public services, so you pay only for potential clients.'],
      ['The right area', 'A radius around your office or specific municipalities — and only people who are there, not people “interested in” the area from elsewhere.'],
      ['The right hours', 'Ads run when someone can call you or book online. Evenings and Sundays people look for help — we keep them on when online booking exists.'],
      ['Measurement', 'We measure every phone tap and every booking click that came from an ad. Without measurement a campaign is blind; with it, Google learns who calls.'],
      ['Patience with a plan', 'The first 2–3 weeks are a learning period. Month 2 performs better than month 1 and month 3 better still, because we cut what brings no calls.'],
      ['Your advantage', 'Website and ads from the same team. The page the visitor lands on is built to make them call — and we set up the measurement ourselves, nothing needed from you.'],
    ],
    kvTitle: 'What we set up, in detail',
    kv: [
      ['Campaign type', 'Search. You appear only to someone already looking for what you do — not on banners or videos.'],
      ['Ad groups', '2–4, one per service (e.g. psychologist · psychotherapy · online psychologist), 10–20 keywords each, in exact and phrase match, Greek and Greeklish.'],
      ['Negative keywords', 'A ready list that excludes non-clients: free, public, hospital, insurance fund, studies, masters, salary, jobs, pdf — extended every week from the real searches.'],
      ['Ads', 'Responsive ads with 12–15 headlines per group: area, service, “Book an appointment”, “Also online”, your real credentials. Google tests the combinations and keeps those that bring calls.'],
      ['Extensions', 'Call button, links to Services · Reviews · Booking · Contact, short callouts (e.g. “Sessions also online”).'],
      ['Measurement', 'Phone tap, online booking click, form submission — on your website, GDPR-compliant: only after cookie consent, with Google Consent Mode.'],
      ['Bidding', 'The first 2–3 weeks “Maximise clicks” with a cost-per-click cap. Once about 15 contacts are recorded, “Maximise conversions”, so Google finds people who call.'],
      ['Weekly check', 'The real searches that brought clicks: what does not fit is excluded, what brings calls is strengthened. The budget is never exceeded.'],
    ],
    sLabel: 'How we start', sTitle: 'Three steps. About 5 minutes.', sLead: 'We set up the account, the campaign and the measurement. You accept one invitation and add your card. No password.',
    s1: ['Press “Accept” in Google’s e-mail', '1 minute', 'Already have a Google Ads account? Send us its 10-digit number (top right) and press “Accept” on the link request. Just as simple.'],
    s2: ['Add your card and tax number', '3 minutes', 'With your tax number, Google invoices your business every month — for your accountant. The card is charged only for clicks, never above the limit.'],
    s3: ['Write us “done”', '10 seconds', 'After a few weeks Google may ask you to verify the business. We tell you exactly what to upload — about 5 minutes.'],
    illu: 'Illustration',
    m1: { inbox: 'Inbox', subj: 'Invitation to access a Google Ads account', from: 'Google Ads', to: 'to you', body1: 'Advon Media invited you to the Google Ads account', acc: '“Eleni Papadopoulou — Psychologist”', lvl: 'Access level:', lvlV: 'Admin', btn: 'Accept invitation' },
    m2: { bar: 'Billing setup', f: [['Country', 'Greece', 0], ['Account type', 'Business', 1], ['Business name', 'Eleni Papadopoulou', 0], ['Tax number (VAT)', 'EL 123456789', 1], ['Card', '•••• •••• •••• 4821', 0]], btn: 'Submit' },
    chat: [{ t: 'Card added, done!', me: true }, { t: 'Thank you! Your campaign is ready for Google’s approval. It runs within 3–5 working days, and we will let you know.' }],
    total: 'Total time', totalV: '≈ 5 minutes', totalN: 'once', stopT: 'And if you want us to stop?', stopB: 'You remove us from the account with one click. The account, the ads and all the history stay yours.',
    rLabel: 'Every month', rTitle: 'One page. How many found you, how many called, what it cost.', rLead: 'A written report, no calls and no meetings — with what we changed and why.', rS: 'SAMPLE · INDICATIVE NUMBERS',
    rep: [['2,140', 'Saw you on Google'], ['168', 'Clicked the ad'], ['14', 'Called you'], ['5', 'Booked online'], ['€8', 'Cost per contact']],
    calcT: 'One new person a month is enough to cover it.', calcL: 'A new client or patient rarely comes only once. Put in your own numbers.',
    c1: 'Price of a session / visit (€)', c2: 'How many times a new person comes, on average', c3: 'Ad budget per day (€)', o1: 'Cost per month, all in', o2: 'What one new person brings', o3: 'To cover the whole cost you need', one: 'new person a month', many: 'new people a month',
    nLabel: 'Our rules', nTitle: 'What we never do.', yLabel: 'Our commitments', yTitle: 'What always holds.',
    never: [
      { b: 'We never ask for passwords.', t: 'We work from Advon Media’s manager account.' },
      { b: 'We never spend on banners, YouTube or “Performance Max”', t: 'for a practice. They bring views to people who were not searching.' },
      { b: 'We never use the “smart” campaigns', t: 'Google suggests to new accounts. They hide which searches you pay for.' },
      { b: 'We never touch your money.', t: 'Google charges your own card.' },
      { b: 'We never promise a number of patients.', t: 'We promise contacts — calls and booking requests — that are measured.' },
      { b: 'We never write superlatives', t: '(“the best”, “No 1”) or promises of a cure. Neither the code of conduct nor Google’s health policy allows it.' },
    ],
    always: [
      { b: 'One per specialty, per area.', t: 'We never advertise two colleagues in the same area.' },
      { b: 'The account is yours.', t: 'If you stop, you keep the account, the ads and all the history.' },
      { b: 'Pause for holidays.', t: 'Closed in August? We freeze ads and fees, up to one month a year.' },
      { b: 'No commitment.', t: 'Stop with one message, no penalties and no small print.' },
      { b: 'Honesty from the start.', t: 'If the free check shows it is not worth it in your area, we tell you — and we do not start.' },
    ],
    bandLabel: 'Free area check', bandTitle: 'Is it worth it for you? Let’s see for free.', bandLead: 'Send us your specialty and your area. Within 2 working days we tell you how many people search for you and what cost to expect — no obligation.', bandCta: 'I want the free check',
    trust: ['220+ websites for professionals', '125+ Google reviews, all 5 stars', '20 places at the founder price'],
  },
};

function GoogleMock({ t }) {
  return (
    <div>
      <div className="svc-gs">
        <div className="q"><i />{t.q}</div>
        <div className="ad">
          <div className="sp">{t.sp}</div>
          <div className="site"><div className="fav">Ψ</div><div><b>{t.adName}</b><span>papadopoulou-psychologos.gr</span></div></div>
          <div className="t">{t.adT}</div>
          <div className="d">{t.adD}</div>
          <div className="ex">{t.ex.map((e, i) => <span key={e} className={i === 0 ? 'c' : ''}>{e}</span>)}</div>
        </div>
        <div className="org"><div className="ln" style={{ width: '40%' }} /><div className="t">{t.org}</div><div className="ln" style={{ width: '90%' }} /><div className="ln" style={{ width: '70%' }} /></div>
      </div>
      <div className="svc-illu">{t.heroCap}</div>
    </div>
  );
}

function Calculator({ t }) {
  const [v, setV] = useState({ c1: 50, c2: 8, c3: 5 });
  const num = (x) => Math.max(0, parseFloat(x) || 0);
  const cost = num(v.c3) * 30.4 + 59;
  const val = num(v.c1) * Math.max(1, num(v.c2));
  const need = val > 0 ? Math.max(1, Math.ceil(cost / val)) : 0;
  const f = (n) => Math.round(n).toLocaleString('el-GR') + '€';
  const field = (k, label) => (
    <label key={k}>{label}<input type="number" min="0" value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} /></label>
  );
  return (
    <div className="grid md:grid-cols-2 gap-8 svc-calc">
      <div>{field('c1', t.c1)}{field('c2', t.c2)}{field('c3', t.c3)}</div>
      <div className="svc-calc-out self-center">
        <span className="svc-fine">{t.o1}</span><b>{f(cost)}</b>
        <span className="svc-fine">{t.o2}</span><b>{f(val)}</b>
        <span className="svc-fine">{t.o3}</span><b style={{ color: '#c9ff00' }}>{need ? `${need} ${need === 1 ? t.one : t.many}` : '—'}</b>
      </div>
    </div>
  );
}

export default function GoogleAdsClient({ service }) {
  const lang = useLang();
  const t = T[lang];

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
                <a href="#elegxos" className="btn-premium inline-flex items-center gap-2 px-8 py-4 bg-electric-cyan text-[#050608] font-black text-sm uppercase tracking-[0.1em] rounded-xl hover:bg-white transition-colors" style={{ boxShadow: '0 0 30px rgba(71,200,245,0.35)' }}>{t.cta1}</a>
                <a href="#ksekinima" className="btn-premium inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-black text-sm uppercase tracking-[0.1em] rounded-xl hover:bg-white hover:text-[#050608] transition-colors">{t.cta2}</a>
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={160} direction="scale"><GoogleMock t={t} /></ScrollReveal>
        </div>
      </section>

      {/* ─── WHY GOOGLE ─── */}
      <section className="py-20 bg-[#0b0c10]/60 border-y border-electric-cyan/8 mv-shoulder mv-amb">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
          <Head label={t.wLabel} title={t.wTitle} />
          <ScrollReveal direction="right"><p className="text-white text-xl leading-relaxed mv-readable" data-lit>{service.pain[0][lang]}</p></ScrollReveal>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <Head center label={t.cLabel} title={t.cTitle} lead={t.cLead} />
          <div className="grid md:grid-cols-2 gap-6 mt-14 items-stretch">
            <ScrollReveal direction="left" className="h-full"><PriceCard tier={t.p1[0]} price={t.p1[1]} priceNote={t.p1[2]} sub={t.p1[3]} items={t.p1[4]} hot badge={t.p1[5]} /></ScrollReveal>
            <ScrollReveal direction="right" delay={100} className="h-full"><PriceCard tier={t.p2[0]} price={t.p2[1]} priceNote={t.p2[2]} sub={t.p2[3]} items={t.p2[4]} /></ScrollReveal>
          </div>
          <ScrollReveal direction="scale" delay={120} className="mt-6">
            <div className="glass-panel rounded-3xl p-7 md:p-9 grid md:grid-cols-[180px_1fr] gap-8 items-center">
              <div className="svc-seal"><b>60</b><span>{t.gSeal}</span></div>
              <div>
                <h3 className="text-white font-bold text-2xl mb-3">{t.gT}</h3>
                <p className="text-gray-300 leading-relaxed mb-3">{t.gB}</p>
                <p className="text-sm text-gray-500">{t.gF}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── METHOD ─── */}
      <section className="py-24 bg-[#0b0c10]/60 border-y border-electric-cyan/8 mv-shoulder mv-amb alt">
        <div className="max-w-6xl mx-auto px-6">
          <Head label={t.mLabel} title={t.mTitle} lead={t.mLead} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {t.five.map(([h, b], i) => (
              <ScrollReveal key={h} delay={(i % 3) * 90} direction="deal" className="h-full" style={{ '--rz': `${(i % 2 ? 1 : -1) * 1.5}deg` }}>
                <TiltCard className="h-full">
                  <div className={`glass-panel card-sweep rounded-2xl p-6 h-full ${i === 5 ? 'border border-electric-cyan/30' : ''}`} style={i === 5 ? { background: 'linear-gradient(180deg, rgba(71,200,245,.08), transparent)' } : undefined}>
                    <span className="section-label !mb-3">{i === 5 ? '+' : `0${i + 1}`}</span>
                    <h3 className="text-white font-bold text-lg mb-2">{h}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{b}</p>
                  </div>
                </TiltCard>
              </ScrollReveal>
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
              <Phone caption={t.illu} minH={380}>
                <div className="svc-bar"><span className="bk">‹</span><span style={{ fontWeight: 400, color: '#5f6368', fontSize: 13 }}>{t.m1.inbox}</span></div>
                <div style={{ padding: '14px 16px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>{t.m1.subj}</div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '12px 0' }}><div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e8f0fe', color: '#1a73e8', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>G</div><div style={{ fontSize: 12 }}><b>{t.m1.from}</b><br /><span style={{ color: '#5f6368' }}>{t.m1.to}</span></div></div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.55, color: '#3c4043' }}>{t.m1.body1}<br /><b>{t.m1.acc}</b>.<br /><br />{t.m1.lvl} <b>{t.m1.lvlV}</b></div>
                  <div className="svc-bt" style={{ marginTop: 16 }}><div className="g">{t.m1.btn}</div><span className="svc-tap" style={{ left: '42%', top: -4 }} /></div>
                </div>
              </Phone>
            }>
              <p>{service.steps[0].body[lang]}</p>
            </SetupStep>
            <SetupStep n={2} title={t.s2[0]} time={t.s2[1]} tip={t.s2[2]} illustration={
              <Phone caption={t.illu} minH={400}>
                <div className="svc-bar"><span className="bk">‹</span>{t.m2.bar}</div>
                {t.m2.f.map(([l, v, on]) => <div key={l} className={`svc-fld ${on ? 'on' : ''}`}><small>{l}</small>{v}</div>)}
                <div className="svc-bt" style={{ padding: '0 14px 16px' }}><div className="g">{t.m2.btn}</div><span className="svc-tap" style={{ left: '45%', top: -4 }} /></div>
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

      {/* ─── REPORT + CALCULATOR ─── */}
      <section className="py-24 bg-[#0b0c10]/60 border-y border-electric-cyan/8 mv-shoulder mv-amb">
        <div className="max-w-6xl mx-auto px-6">
          <Head label={t.rLabel} title={t.rTitle} lead={t.rLead} />
          <ScrollReveal direction="scale" className="mt-10">
            <div className="glass-panel rounded-3xl p-6 md:p-8">
              <div className="text-right text-xs text-gray-500 tracking-wider">{t.rS}</div>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">{t.rep.map(([v, l]) => <Stat key={l} value={v} label={l} />)}</div>
            </div>
          </ScrollReveal>
          <ScrollReveal id="elegxos" className="mt-6 scroll-mt-28">
            <div className="glass-panel rounded-3xl p-6 md:p-8">
              <h3 className="text-white font-bold text-2xl mb-2">{t.calcT}</h3>
              <p className="text-gray-400 mb-4">{t.calcL}</p>
              <Calculator t={t} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── NEVER + ALWAYS ─── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-start">
          <ScrollReveal direction="left"><Head label={t.nLabel} title={t.nTitle} /><RuleList items={t.never} kind="no" /></ScrollReveal>
          <ScrollReveal direction="right" delay={100}><Head label={t.yLabel} title={t.yTitle} /><RuleList items={t.always} kind="yes" /></ScrollReveal>
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
              <p className="text-gray-400 text-lg mb-7 max-w-2xl mx-auto">{t.bandLead}</p>
              <Link href="#contact" className="btn-premium inline-flex items-center gap-3 px-10 py-4 bg-electric-cyan text-[#050608] font-black text-base uppercase tracking-[0.1em] rounded-xl hover:bg-white transition-all" style={{ boxShadow: '0 0 30px rgba(71,200,245,0.4)' }}>{t.bandCta}</Link>
              <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 mt-6 text-sm text-gray-400">{t.trust.map((s) => <span key={s}><b className="text-white">{s.split(' ')[0]}</b> {s.split(' ').slice(1).join(' ')}</span>)}</div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
