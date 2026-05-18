// app/privacy-policy/page.jsx
'use client';
import { useLangStore } from '@/store/langStore';

export default function PrivacyPolicy() {
  const { lang } = useLangStore();

  return (
    <div className="pt-20 pb-32">
      <section className="py-20">
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

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Χρόνος διατήρησης</h2>
              <p>Διατηρούμε τα δεδομένα σας μόνο για όσο χρονικό διάστημα είναι απαραίτητο για την εκπλήρωση των σκοπών για τους οποίους συλλέχθηκαν ή μέχρι να μας ζητήσετε τη διαγραφή τους.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Αλλαγές στην Πολιτική</h2>
              <p>Ενδέχεται να ανανεώνουμε την παρούσα πολιτική περιστασιακά. Σας προτείνουμε να την ελέγχετε τακτικά.</p>
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

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Retention Period</h2>
              <p>We retain your data only for as long as necessary to fulfill the purposes for which it was collected, or until you request its deletion.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Changes to this Policy</h2>
              <p>We may update this policy occasionally. We recommend checking it regularly.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}