// app/terms/page.jsx
'use client';
import { useLangStore } from '@/store/langStore';
import Contact from '@/components/Contact';
import ScrollReveal from '@/components/ScrollReveal';

export default function Terms() {
  const { lang } = useLangStore();

  return (
    <div className="pt-28">
      <section className="py-20">
        <ScrollReveal direction="fade">
        <div className="max-w-4xl mx-auto px-6 legal-format glass-panel p-10 rounded-3xl">
          <h1 className="text-3xl md:text-4xl font-black text-white text-center mb-8 font-display">
            {lang === 'el' ? 'Όροι Χρήσης' : 'Terms of Use'}
          </h1>
          
          {lang === 'el' ? (
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <h2 className="text-xl font-bold text-electric-cyan pt-4">Αποδοχή των Όρων</h2>
              <p>Η χρήση της ιστοσελίδας της Advon Media συνεπάγεται την πλήρη και ανεπιφύλακτη αποδοχή των παρακάτω όρων χρήσης. Εάν δεν συμφωνείτε με αυτούς τους όρους, παρακαλούμε να μην χρησιμοποιείτε την ιστοσελίδα μας.</p>
              
              <h2 className="text-xl font-bold text-electric-cyan pt-4">Παρεχόμενες Υπηρεσίες & Πληροφορίες</h2>
              <p>Οι πληροφορίες που παρουσιάζονται στην ιστοσελίδα σχετικά με τις υπηρεσίες μας είναι ακριβείς και ενημερωμένες. Ωστόσο, η Advon Media διατηρεί το δικαίωμα να τροποποιεί τις υπηρεσίες και τις τιμές (όπου αναγράφονται) χωρίς προειδοποίηση.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Πνευματική Ιδιοκτησία</h2>
              <p>Όλο το περιεχόμενο της ιστοσελίδας αποτελεί πνευματική ιδιοκτησία της Advon Media και προστατεύεται από την ελληνική και διεθνή νομοθεσία περί πνευματικών δικαιωμάτων. Απαγορεύεται η αντιγραφή, αναπαραγωγή ή αναδημοσίευση χωρίς την έγγραφη άδειά μας.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Περιεχόμενο Ιστοσελίδων Πελατών</h2>
              <p>Η ενότητα αυτή αφορά <strong>κάθε ιστοσελίδα</strong> που έχει σχεδιάσει, κατασκευάσει, φιλοξενήσει ή συντηρήσει η Advon Media ή ο ιδρυτής της, στο παρελθόν, σήμερα ή στο μέλλον — ανεξάρτητα από το αν εμφανίζεται στο portfolio μας ή όχι, από το domain ή την υπηρεσία φιλοξενίας της, και ακόμη και μετά τη λήξη της συνεργασίας. Η ένδειξη «Designed by Advon Media» στο κάτω μέρος μιας ιστοσελίδας σημαίνει μόνο ότι τον σχεδιασμό της τον κάναμε εμείς· δεν σημαίνει ότι εγγυόμαστε ή υιοθετούμε το περιεχόμενό της.</p>
              <p>Η Advon Media σχεδιάζει και κατασκευάζει ιστοσελίδες για λογαριασμό των πελατών της. Κάθε πληροφορία που εμφανίζεται σε ιστοσελίδα πελάτη — ενδεικτικά κείμενα, περιγραφές υπηρεσιών, τίτλοι σπουδών, ειδικότητες και πιστοποιήσεις, βιογραφικά στοιχεία, τιμές, ωράρια, διευθύνσεις και στοιχεία επικοινωνίας, φωτογραφίες, λογότυπα, κριτικές και άρθρα — προέρχεται από τον ίδιο τον πελάτη ή από δημόσιες πηγές που τον αφορούν (όπως το προφίλ του στο Google ή σε πλατφόρμες κράτησης ραντεβού), ή έχει διατυπωθεί από εμάς αποκλειστικά με βάση αυτές. Η Advon Media δεν διαθέτει ούτε τα μέσα ούτε επαρκή στοιχεία για να επαληθεύσει την ακρίβεια των πληροφοριών αυτών. Κείμενα, μεταφράσεις, φωτογραφίες και άλλα στοιχεία που προτείνουμε εμείς αποτελούν προτάσεις, τις οποίες ο πελάτης οφείλει να ελέγξει πριν τις εγκρίνει.</p>
              <p>Για τον λόγο αυτό, κάθε ιστοσελίδα παραδίδεται πρώτα στον πελάτη για έλεγχο. Με την έγκριση της δημοσίευσης, ο πελάτης δηλώνει ότι έχει διαβάσει και ελέγξει το σύνολο του περιεχομένου, ότι αυτό είναι αληθές, ακριβές, πλήρες και επίκαιρο, και ότι διαθέτει κάθε απαραίτητο δικαίωμα ή άδεια για τη χρήση του (πνευματικά δικαιώματα κειμένων και φωτογραφιών, σήματα, εικόνα προσώπων, συγκατάθεση των εικονιζόμενων ή των προσώπων που αναφέρονται). Το ίδιο ισχύει για κάθε αλλαγή ή προσθήκη μετά τη δημοσίευση, καθώς και για περιεχόμενο που ο πελάτης προσθέτει ή δημοσιεύει ο ίδιος (π.χ. μέσω διαχειριστικού περιβάλλοντος ή ενότητας άρθρων).</p>
              <p>Ο πελάτης είναι αποκλειστικά υπεύθυνος για το περιεχόμενο της ιστοσελίδας του και για τη συμμόρφωσή του με την ισχύουσα νομοθεσία και τους κανόνες του επαγγέλματός του — ενδεικτικά κώδικες δεοντολογίας, κανόνες προβολής και διαφήμισης επαγγελματιών υγείας και νομικών, προστασία του καταναλωτή και προστασία προσωπικών δεδομένων (GDPR), ιδίως για τα στοιχεία που συλλέγονται μέσω φορμών της ιστοσελίδας του, για τα οποία ο πελάτης είναι ο υπεύθυνος επεξεργασίας. Η Advon Media δεν φέρει καμία ευθύνη για ανακριβείς, παραπλανητικές, ελλιπείς ή ξεπερασμένες πληροφορίες, για προσβολή δικαιωμάτων τρίτων, ούτε για οποιαδήποτε άμεση ή έμμεση ζημία προκύψει από το περιεχόμενο ιστοσελίδας πελάτη. Εάν τρίτος προβάλει αξίωση κατά της Advon Media εξαιτίας τέτοιου περιεχομένου, ο πελάτης αναλαμβάνει να την καλύψει πλήρως, μαζί με κάθε σχετική δαπάνη.</p>
              <p>Εάν εντοπιστεί λάθος σε ιστοσελίδα πελάτη, ο πελάτης οφείλει να μας ενημερώσει και η διόρθωση γίνεται σύμφωνα με τους όρους της συνεργασίας μας.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Φιλοξενία, Domain & Τρίτοι Πάροχοι</h2>
              <p>Οι ιστοσελίδες λειτουργούν σε υποδομές τρίτων παρόχων (ενδεικτικά φιλοξενία, καταχωρητές domain, υπηρεσίες email, φορμών, χαρτών, κρατήσεων ραντεβού και στατιστικών). Καταβάλλουμε κάθε εύλογη προσπάθεια για τη σωστή λειτουργία τους, δεν εγγυόμαστε όμως αδιάλειπτη ή απρόσκοπτη λειτουργία και δεν ευθυνόμαστε για διακοπές, σφάλματα, απώλεια δεδομένων, αλλαγές όρων ή τιμών, ή τερματισμό υπηρεσιών που οφείλονται σε τρίτους.</p>
              <p>Η καταχώριση και η ανανέωση ενός domain διέπονται και από τους όρους του καταχωρητή. Η Advon Media δεν ευθύνεται για απώλεια domain ή διακοπή λειτουργίας λόγω μη έγκαιρης πληρωμής, μη ανανέωσης ή λανθασμένων στοιχείων που δόθηκαν από τον πελάτη.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Αποτελέσματα & Προβολή</h2>
              <p>Δεν εγγυόμαστε συγκεκριμένη θέση στα αποτελέσματα αναζήτησης της Google ή άλλων μηχανών, αριθμό επισκεπτών, κλήσεων, ραντεβού, πελατών, πωλήσεων ή αποτελέσματα διαφημίσεων. Κάθε εκτίμηση ή παράδειγμα που αναφέρουμε είναι ενδεικτικό. Οι μηχανές αναζήτησης και οι διαφημιστικές πλατφόρμες αλλάζουν τους κανόνες τους χωρίς προειδοποίηση και εκτός του δικού μας ελέγχου.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Πληρωμές, Ανανεώσεις & Λήξη Συνεργασίας</h2>
              <p>Οι τιμές, ο τρόπος πληρωμής και η διάρκεια κάθε υπηρεσίας ορίζονται στη συμφωνία μας με κάθε πελάτη. Σε περίπτωση μη πληρωμής ή μη ανανέωσης της φιλοξενίας ή άλλης συνδρομής, η Advon Media δικαιούται, αφού ενημερώσει τον πελάτη, να θέσει την ιστοσελίδα εκτός λειτουργίας και στη συνέχεια να την αφαιρέσει.</p>
              <p>Ο πελάτης οφείλει να διατηρεί δικά του αντίγραφα του υλικού του (κείμενα, φωτογραφίες, λογότυπα, στοιχεία). Μετά τη λήξη της συνεργασίας δεν έχουμε υποχρέωση να διατηρούμε αντίγραφα της ιστοσελίδας ή του υλικού.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Πνευματικά Δικαιώματα Έργων</h2>
              <p>Ο πελάτης αποκτά δικαίωμα χρήσης του σχεδιασμού για την ιστοσελίδα του. Ο κώδικας, οι τεχνικές, τα εργαλεία και τα επαναχρησιμοποιούμενα στοιχεία σχεδιασμού παραμένουν της Advon Media, η οποία μπορεί να τα χρησιμοποιεί και σε άλλα έργα. Γραμματοσειρές, εικονίδια και άλλα στοιχεία τρίτων χρησιμοποιούνται σύμφωνα με τις άδειες των δημιουργών τους.</p>
              <p>Η Advon Media δικαιούται να παρουσιάζει τις ιστοσελίδες που έχει κατασκευάσει (όνομα, εικόνες, σύνδεσμο) στο portfolio και στην προβολή της, εκτός αν ο πελάτης ζητήσει γραπτώς να μην το κάνει.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Κωδικοί & Πρόσβαση</h2>
              <p>Ο πελάτης είναι υπεύθυνος να φυλάσσει με ασφάλεια κάθε κωδικό ή πρόσβαση που του δίνουμε (π.χ. διαχειριστικό περιβάλλον, λογαριασμούς). Δεν ευθυνόμαστε για αλλαγές, απώλειες ή ζημίες που προκαλούνται από τον πελάτη ή από τρίτους που χρησιμοποίησαν την πρόσβαση αυτή.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Περιορισμός Ευθύνης</h2>
              <p>Η Advon Media δεν ευθύνεται για τυχόν τεχνικά προβλήματα που μπορεί να προκύψουν κατά την πρόσβαση των χρηστών στον ιστότοπο. Επίσης, δεν φέρουμε ευθύνη για το περιεχόμενο εξωτερικών συνδέσμων που ενδέχεται να υπάρχουν στην ιστοσελίδα μας.</p>
              <p>Στο μέτρο που επιτρέπει ο νόμος, η Advon Media δεν ευθύνεται για έμμεσες ή αποθετικές ζημίες, όπως διαφυγόντα κέρδη, απώλεια πελατών, φήμης ή δεδομένων, και η συνολική ευθύνη της για οποιαδήποτε αιτία δεν υπερβαίνει το ποσό που κατέβαλε ο πελάτης για τη συγκεκριμένη υπηρεσία τους τελευταίους 12 μήνες. Οι περιορισμοί αυτοί δεν ισχύουν σε περίπτωση δόλου ή βαριάς αμέλειας.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Υποχρεώσεις Χρηστών</h2>
              <p>Οι χρήστες της ιστοσελίδας οφείλουν να τη χρησιμοποιούν σύμφωνα με τον νόμο και τα χρηστά ήθη. Απαγορεύεται η χρήση της ιστοσελίδας για την αποστολή κακόβουλου λογισμικού, ανεπιθύμητης αλληλογραφίας (spam) ή περιεχομένου που είναι παράνομο ή προσβλητικό.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Ανωτέρα Βία</h2>
              <p>Δεν ευθυνόμαστε για καθυστέρηση ή αδυναμία εκτέλεσης που οφείλεται σε γεγονότα εκτός του ελέγχου μας, όπως φυσικές καταστροφές, διακοπές ρεύματος ή διαδικτύου, κυβερνοεπιθέσεις, βλάβες τρίτων παρόχων, ασθένεια ή αποφάσεις αρχών.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Εφαρμοστέο Δίκαιο</h2>
              <p>Οι παρόντες όροι διέπονται από το ελληνικό δίκαιο. Κάθε διαφορά επιδιώκουμε πρώτα να επιλυθεί φιλικά· διαφορετικά, αρμόδια είναι τα ελληνικά δικαστήρια.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Τροποποιήσεις</h2>
              <p>Μπορούμε να ενημερώνουμε τους παρόντες όρους. Η ισχύουσα μορφή είναι πάντα αυτή που δημοσιεύεται στη σελίδα αυτή. Αν κάποιος όρος κριθεί άκυρος, οι υπόλοιποι εξακολουθούν να ισχύουν.</p>
              <p>Τελευταία ενημέρωση: 21 Σεπτεμβρίου 2026.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Επικοινωνία</h2>
              <p>Για οποιαδήποτε απορία σχετικά με τους Όρους Χρήσης, μπορείτε να επικοινωνήσετε μαζί μας: Email: <a href="mailto:angelos@advonmedia.com" className="text-electric-cyan hover:underline">angelos@advonmedia.com</a></p>
            </div>
          ) : (
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <h2 className="text-xl font-bold text-electric-cyan pt-4">Acceptance of Terms</h2>
              <p>The use of the Advon Media website implies full and unconditional acceptance of the following terms of use. If you do not agree with these terms, please do not use our website.</p>
              
              <h2 className="text-xl font-bold text-electric-cyan pt-4">Services Provided & Information</h2>
              <p>The information presented on the website regarding our services is accurate and up-to-date. However, Advon Media reserves the right to modify services and prices (where listed) without prior notice.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Intellectual Property</h2>
              <p>All content on the website is the intellectual property of Advon Media and is protected by Greek and international copyright laws. Copying, reproduction, or republication without our written permission is prohibited.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Content of Client Websites</h2>
              <p>This section applies to <strong>every website</strong> that Advon Media or its founder has designed, built, hosted or maintained, in the past, now or in the future — whether or not it appears in our portfolio, whatever its domain or hosting provider, and even after our cooperation has ended. The credit «Designed by Advon Media» at the bottom of a website only means that we made its design; it does not mean that we guarantee or endorse its content.</p>
              <p>Advon Media designs and builds websites on behalf of its clients. All information shown on a client website — including texts, service descriptions, qualifications, specialties and certifications, biographical details, prices, opening hours, addresses and contact details, photos, logos, reviews and articles — comes from the client, or from public sources about the client (such as their Google profile or appointment-booking platforms), or has been written by us solely on the basis of these. Advon Media has neither the means nor sufficient information to verify the accuracy of this information. Texts, translations, photos and other material that we propose are suggestions, which the client must check before approving them.</p>
              <p>For this reason, every website is first delivered to the client for review. By approving publication, the client confirms that they have read and checked all of the content, that it is true, accurate, complete and up to date, and that they hold every right or permission needed to use it (copyright in texts and photos, trademarks, image rights, consent of the people shown or mentioned). The same applies to every change or addition after publication, and to any content the client adds or publishes themselves (e.g. through an admin panel or an articles section).</p>
              <p>The client is solely responsible for the content of their website and for its compliance with applicable law and the rules of their profession — including codes of conduct, rules on advertising by health and legal professionals, consumer protection and data protection (GDPR), in particular for data collected through forms on their website, for which the client is the data controller. Advon Media accepts no liability for inaccurate, misleading, incomplete or outdated information, for any infringement of third-party rights, or for any direct or indirect damage arising from the content of a client website. If a third party brings a claim against Advon Media because of such content, the client undertakes to cover it in full, together with any related costs.</p>
              <p>If an error is found on a client website, the client must inform us and the correction is made according to the terms of our cooperation.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Hosting, Domains & Third-Party Providers</h2>
              <p>Websites run on the infrastructure of third-party providers (including hosting, domain registrars, and email, form, map, appointment-booking and analytics services). We make every reasonable effort to keep them working properly, but we do not guarantee uninterrupted or error-free operation and are not responsible for outages, errors, data loss, changes of terms or prices, or discontinued services caused by third parties.</p>
              <p>Registering and renewing a domain is also subject to the registrar’s terms. Advon Media is not responsible for the loss of a domain or for downtime caused by late payment, non-renewal or incorrect details provided by the client.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Results & Visibility</h2>
              <p>We do not guarantee any particular position in Google or other search results, or any number of visitors, calls, appointments, customers, sales, or advertising results. Any estimate or example we give is indicative only. Search engines and advertising platforms change their rules without notice and outside our control.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Payments, Renewals & End of Cooperation</h2>
              <p>Prices, payment method and the duration of each service are set in our agreement with each client. If hosting or another subscription is not paid or renewed, Advon Media may, after informing the client, take the website offline and later remove it.</p>
              <p>The client must keep their own copies of their material (texts, photos, logos, details). After the cooperation ends we have no obligation to keep copies of the website or the material.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Intellectual Property in Our Work</h2>
              <p>The client receives the right to use the design for their website. The code, techniques, tools and reusable design elements remain the property of Advon Media, which may also use them in other projects. Fonts, icons and other third-party elements are used under their creators’ licences.</p>
              <p>Advon Media may show the websites it has built (name, images, link) in its portfolio and promotion, unless the client asks in writing that we do not.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Passwords & Access</h2>
              <p>The client is responsible for keeping safe any password or access we give them (e.g. an admin panel or accounts). We are not responsible for changes, losses or damage caused by the client or by third parties who used that access.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Limitation of Liability</h2>
              <p>Advon Media is not responsible for any technical problems that may arise during users' access to the site. Furthermore, we bear no responsibility for the content of external links that may exist on our website.</p>
              <p>To the extent permitted by law, Advon Media is not liable for indirect or consequential damage, such as lost profits, loss of customers, reputation or data, and its total liability for any cause does not exceed the amount the client paid for the specific service in the last 12 months. These limits do not apply in cases of intent or gross negligence.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">User Obligations</h2>
              <p>Users of the website must use it in accordance with the law and good morals. It is prohibited to use the website to send malware, spam, or content that is illegal or offensive.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Force Majeure</h2>
              <p>We are not responsible for delay or failure to perform caused by events outside our control, such as natural disasters, power or internet outages, cyber-attacks, failures of third-party providers, illness or decisions of the authorities.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Governing Law</h2>
              <p>These terms are governed by Greek law. We will always first try to resolve any dispute amicably; otherwise, the Greek courts have jurisdiction.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Changes</h2>
              <p>We may update these terms. The version in force is always the one published on this page. If any term is found to be invalid, the rest remain in force.</p>
              <p>Last updated: 21 September 2026.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Contact</h2>
              <p>For any questions regarding the Terms of Use, you can contact us: Email: <a href="mailto:angelos@advonmedia.com" className="text-electric-cyan hover:underline">angelos@advonmedia.com</a></p>
            </div>
          )}
        </div>
        </ScrollReveal>
      </section>
      <Contact />
    </div>
  );
}