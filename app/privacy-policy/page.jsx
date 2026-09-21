// app/privacy-policy/page.jsx
'use client';
import { useLangStore } from '@/store/langStore';
import ScrollReveal from '@/components/ScrollReveal';

export default function PrivacyPolicy() {
  const { lang } = useLangStore();

  return (
    <div className="pt-28 pb-32">
      <section className="py-20">
        <ScrollReveal direction="fade">
        <div className="max-w-4xl mx-auto px-6 legal-format glass-panel p-10 rounded-3xl">
          <h1 className="text-3xl md:text-4xl font-black text-white text-center mb-8 font-display">
            {lang === 'el' ? 'Πολιτική Απορρήτου & Προστασίας Προσωπικών Δεδομένων' : 'Privacy Policy & Personal Data Protection'}
          </h1>
          
          {lang === 'el' ? (
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p><strong>Εισαγωγή:</strong> Η Advon Media (εφεξής η "Εταιρεία", "εμείς", "μας") σέβεται απόλυτα το απόρρητό σας και δεσμεύεται να προστατεύει τα προσωπικά σας δεδομένα. Η παρούσα Πολιτική Απορρήτου σας ενημερώνει για το πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τα δεδομένα σας όταν επισκέπτεστε την ιστοσελίδα μας ή χρησιμοποιείτε τις υπηρεσίες μας, σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (GDPR).</p>
              
              <h2 className="text-xl font-bold text-electric-cyan pt-4">Ποια δεδομένα συλλέγουμε</h2>
              <p>Συλλέγουμε μόνο τα απαραίτητα δεδομένα για την παροχή των υπηρεσιών μας:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Στοιχεία Επικοινωνίας:</strong> Όνομα/Επωνυμία, Email, Τηλέφωνο, καθώς και οποιαδήποτε πληροφορία μοιράζεστε μαζί μας μέσω της φόρμας επικοινωνίας.</li>
                <li><strong>Τεχνικά Δεδομένα:</strong> Διεύθυνση IP, τύπος περιηγητή (browser), συσκευή, και δεδομένα πλοήγησης (βλ. Πολιτική Cookies).</li>
              </ul>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Πώς χρησιμοποιούμε τα δεδομένα σας</h2>
              <p>Τα δεδομένα σας χρησιμοποιούνται αποκλειστικά για:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Την επικοινωνία μαζί σας και την απάντηση στα αιτήματά σας (π.χ. ραντεβού, εκδήλωση ενδιαφέροντος).</li>
                <li>Την παροχή των υπηρεσιών Web Design, SEO, και διαχείρισης Social Media που έχετε ζητήσει.</li>
                <li>Τη βελτίωση της εμπειρίας χρήστη στην ιστοσελίδα μας.</li>
                <li>Την αποστολή ενημερώσεων ή προσφορών, μόνο εφόσον έχετε δώσει τη ρητή συγκατάθεσή σας.</li>
              </ul>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Πώς προστατεύουμε τα δεδομένα σας</h2>
              <p>Λαμβάνουμε όλα τα απαραίτητα τεχνικά και οργανωτικά μέτρα (π.χ. κρυπτογράφηση SSL, ασφαλείς servers) για να διασφαλίσουμε ότι τα προσωπικά σας δεδομένα είναι ασφαλή έναντι μη εξουσιοδοτημένης πρόσβασης, αλλοίωσης ή απώλειας.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Τα δικαιώματά σας</h2>
              <p>Βάσει του GDPR, έχετε τα εξής δικαιώματα:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Δικαίωμα πρόσβασης:</strong> Να ζητήσετε αντίγραφο των δεδομένων που διατηρούμε για εσάς.</li>
                <li><strong>Δικαίωμα διόρθωσης:</strong> Να ζητήσετε τη διόρθωση ανακριβών στοιχείων.</li>
                <li><strong>Δικαίωμα διαγραφής (δικαίωμα στη λήθη):</strong> Να ζητήσετε τη διαγραφή των δεδομένων σας, εφόσον δεν υπάρχει νομική υποχρέωση διατήρησής τους.</li>
                <li><strong>Δικαίωμα ανάκλησης συγκατάθεσης:</strong> Να ανακαλέσετε οποιαδήποτε στιγμή τη συγκατάθεσή σας.</li>
              </ul>
              
              <p>Για να ασκήσετε οποιοδήποτε από τα παραπάνω δικαιώματα, επικοινωνήστε μαζί μας στο: <a href="mailto:angelos@advonmedia.com" className="text-electric-cyan hover:underline">angelos@advonmedia.com</a></p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Συνεργάτες που επεξεργάζονται δεδομένα για λογαριασμό μας</h2>
              <p>Για τη λειτουργία της ιστοσελίδας και των υπηρεσιών μας χρησιμοποιούμε αξιόπιστους παρόχους, οι οποίοι επεξεργάζονται δεδομένα μόνο για λογαριασμό μας: φιλοξενία (Netlify), ασφαλή αποθήκευση (GitHub), φόρμες επικοινωνίας (Formspree), αποστολή email (Resend), κράτηση ραντεβού (Google Calendar, Zoho), πληρωμές (Stripe) και στατιστικά επισκεψιμότητας (Google Analytics). Ορισμένοι από αυτούς βρίσκονται εκτός Ευρωπαϊκής Ένωσης· στις περιπτώσεις αυτές η διαβίβαση γίνεται με τις εγγυήσεις που προβλέπει ο GDPR (π.χ. τυποποιημένες συμβατικές ρήτρες). Δεν πουλάμε και δεν ενοικιάζουμε ποτέ προσωπικά δεδομένα.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Cookies & Στατιστικά</h2>
              <p>Χρησιμοποιούμε το Google Analytics για να καταλαβαίνουμε, σε συγκεντρωτική μορφή, πώς χρησιμοποιείται η ιστοσελίδα μας (π.χ. ποιες σελίδες διαβάζονται). Μπορείτε να αποκλείσετε ή να διαγράψετε τα cookies από τις ρυθμίσεις του browser σας· η ιστοσελίδα θα συνεχίσει να λειτουργεί κανονικά.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Υλικό και μηνύματα πελατών</h2>
              <p>Τα μηνύματα, τα αρχεία και οι φωτογραφίες που μας στέλνουν οι πελάτες μας (μέσω email, της σελίδας επικοινωνίας έργου ή άλλων μέσων) χρησιμοποιούνται μόνο για την κατασκευή και τη συντήρηση της ιστοσελίδας τους και φυλάσσονται όσο διαρκεί η συνεργασία και όσο απαιτεί ο νόμος (π.χ. φορολογικές υποχρεώσεις).</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Ιστοσελίδες που κατασκευάζουμε για πελάτες</h2>
              <p>Για κάθε ιστοσελίδα που έχουμε κατασκευάσει ή θα κατασκευάσουμε για πελάτη, υπεύθυνος επεξεργασίας των δεδομένων των επισκεπτών της (π.χ. μηνύματα από φόρμες, αιτήματα ραντεβού) είναι ο πελάτης, ιδιοκτήτης της ιστοσελίδας, και όχι η Advon Media. Στον βαθμό που φιλοξενούμε ή συντηρούμε μια τέτοια ιστοσελίδα, ενεργούμε μόνο ως εκτελούντες την επεξεργασία, με βάση τις οδηγίες του πελάτη. Ο πελάτης είναι υπεύθυνος για τη δική του πολιτική απορρήτου και τη συμμόρφωσή του με τον GDPR. Οι επισκέπτες μιας τέτοιας ιστοσελίδας απευθύνονται για τα δεδομένα τους απευθείας στον ιδιοκτήτη της.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Χρόνος διατήρησης</h2>
              <p>Διατηρούμε τα δεδομένα σας μόνο για όσο χρονικό διάστημα είναι απαραίτητο για την εκπλήρωση των σκοπών για τους οποίους συλλέχθηκαν ή μέχρι να μας ζητήσετε τη διαγραφή τους.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Αλλαγές στην Πολιτική</h2>
              <p>Ενδέχεται να ανανεώνουμε την παρούσα πολιτική περιστασιακά. Σας προτείνουμε να την ελέγχετε τακτικά.</p>
              <p>Εάν θεωρείτε ότι η επεξεργασία των δεδομένων σας παραβιάζει τον GDPR, έχετε δικαίωμα να υποβάλετε καταγγελία στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (<a href="https://www.dpa.gr" target="_blank" rel="noopener noreferrer" className="text-electric-cyan hover:underline">www.dpa.gr</a>).</p>
              <p>Τελευταία ενημέρωση: 21 Σεπτεμβρίου 2026.</p>
            </div>
          ) : (
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p><strong>Introduction:</strong> Advon Media (hereinafter the "Company", "we", "us") fully respects your privacy and is committed to protecting your personal data. This Privacy Policy informs you about how we collect, use, and protect your data when you visit our website or use our services, in accordance with the General Data Protection Regulation (GDPR).</p>
              
              <h2 className="text-xl font-bold text-electric-cyan pt-4">What data we collect</h2>
              <p>We only collect data necessary to provide our services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Contact Details:</strong> Name/Company Name, Email, Phone number, and any information you share with us via our contact form.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device type, and navigation data (see Cookies Policy).</li>
              </ul>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">How we use your data</h2>
              <p>Your data is used exclusively for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Communicating with you and responding to your requests (e.g., appointments, expressions of interest).</li>
                <li>Providing Web Design, SEO, and Social Media management services you have requested.</li>
                <li>Improving the user experience on our website.</li>
                <li>Sending updates or offers, only if you have given explicit consent.</li>
              </ul>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">How we protect your data</h2>
              <p>We take all necessary technical and organizational measures (e.g., SSL encryption, secure servers) to ensure that your personal data is secure against unauthorized access, alteration, or loss.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Your rights</h2>
              <p>Under the GDPR, you have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Right of access:</strong> To request a copy of the data we hold about you.</li>
                <li><strong>Right to rectification:</strong> To request correction of inaccurate data.</li>
                <li><strong>Right to erasure (right to be forgotten):</strong> To request the deletion of your data, provided there is no legal obligation to retain it.</li>
                <li><strong>Right to withdraw consent:</strong> To withdraw your consent at any time.</li>
              </ul>
              
              <p>To exercise any of the above rights, contact us at: <a href="mailto:angelos@advonmedia.com" className="text-electric-cyan hover:underline">angelos@advonmedia.com</a></p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Partners who process data on our behalf</h2>
              <p>To run our website and services we use trusted providers who process data only on our behalf: hosting (Netlify), secure storage (GitHub), contact forms (Formspree), email delivery (Resend), appointment booking (Google Calendar, Zoho), payments (Stripe) and visitor statistics (Google Analytics). Some of them are located outside the European Union; in those cases the transfer takes place with the safeguards provided by the GDPR (e.g. standard contractual clauses). We never sell or rent personal data.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Cookies & Statistics</h2>
              <p>We use Google Analytics to understand, in aggregate, how our website is used (e.g. which pages are read). You can block or delete cookies in your browser settings; the website will keep working normally.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Client material and messages</h2>
              <p>Messages, files and photos that our clients send us (by email, through the project chat page or otherwise) are used only to build and maintain their website and are kept for as long as the cooperation lasts and as long as the law requires (e.g. tax obligations).</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Websites we build for clients</h2>
              <p>For every website we have built or will build for a client, the controller of its visitors’ data (e.g. form messages, appointment requests) is the client who owns the website, not Advon Media. To the extent that we host or maintain such a website, we act only as a processor, on the client’s instructions. The client is responsible for their own privacy policy and GDPR compliance. Visitors of such a website should contact its owner directly about their data.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Retention Period</h2>
              <p>We retain your data only for as long as necessary to fulfill the purposes for which it was collected, or until you request its deletion.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Changes to this Policy</h2>
              <p>We may update this policy occasionally. We recommend checking it regularly.</p>
              <p>If you believe that the processing of your data breaches the GDPR, you have the right to lodge a complaint with the Hellenic Data Protection Authority (<a href="https://www.dpa.gr" target="_blank" rel="noopener noreferrer" className="text-electric-cyan hover:underline">www.dpa.gr</a>).</p>
              <p>Last updated: 21 September 2026.</p>
            </div>
          )}
        </div>
        </ScrollReveal>
      </section>
    </div>
  );
}