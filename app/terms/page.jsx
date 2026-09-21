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
              <p>Η Advon Media σχεδιάζει και κατασκευάζει ιστοσελίδες για λογαριασμό των πελατών της. Κάθε πληροφορία που εμφανίζεται σε ιστοσελίδα πελάτη — ενδεικτικά κείμενα, περιγραφές υπηρεσιών, τίτλοι σπουδών, ειδικότητες και πιστοποιήσεις, βιογραφικά στοιχεία, τιμές, ωράρια, διευθύνσεις και στοιχεία επικοινωνίας, φωτογραφίες, λογότυπα, κριτικές και άρθρα — προέρχεται από τον ίδιο τον πελάτη ή από δημόσιες πηγές που τον αφορούν (όπως το προφίλ του στο Google ή σε πλατφόρμες κράτησης ραντεβού), ή έχει διατυπωθεί από εμάς αποκλειστικά με βάση αυτές. Η Advon Media δεν διαθέτει ούτε τα μέσα ούτε επαρκή στοιχεία για να επαληθεύσει την ακρίβεια των πληροφοριών αυτών.</p>
              <p>Για τον λόγο αυτό, κάθε ιστοσελίδα παραδίδεται πρώτα στον πελάτη για έλεγχο. Με την έγκριση της δημοσίευσης, ο πελάτης δηλώνει ότι έχει διαβάσει και ελέγξει το σύνολο του περιεχομένου, ότι αυτό είναι αληθές, ακριβές, πλήρες και επίκαιρο, και ότι διαθέτει κάθε απαραίτητο δικαίωμα ή άδεια για τη χρήση του (πνευματικά δικαιώματα κειμένων και φωτογραφιών, σήματα, εικόνα προσώπων, συγκατάθεση των εικονιζόμενων ή των προσώπων που αναφέρονται). Το ίδιο ισχύει για κάθε αλλαγή ή προσθήκη μετά τη δημοσίευση, καθώς και για περιεχόμενο που ο πελάτης προσθέτει ή δημοσιεύει ο ίδιος (π.χ. μέσω διαχειριστικού περιβάλλοντος ή ενότητας άρθρων).</p>
              <p>Ο πελάτης είναι αποκλειστικά υπεύθυνος για το περιεχόμενο της ιστοσελίδας του και για τη συμμόρφωσή του με την ισχύουσα νομοθεσία και τους κανόνες του επαγγέλματός του — ενδεικτικά κώδικες δεοντολογίας, κανόνες προβολής και διαφήμισης επαγγελματιών υγείας και νομικών, προστασία του καταναλωτή και προστασία προσωπικών δεδομένων (GDPR), ιδίως για τα στοιχεία που συλλέγονται μέσω φορμών της ιστοσελίδας του, για τα οποία ο πελάτης είναι ο υπεύθυνος επεξεργασίας. Η Advon Media δεν φέρει καμία ευθύνη για ανακριβείς, παραπλανητικές, ελλιπείς ή ξεπερασμένες πληροφορίες, για προσβολή δικαιωμάτων τρίτων, ούτε για οποιαδήποτε άμεση ή έμμεση ζημία προκύψει από το περιεχόμενο ιστοσελίδας πελάτη. Εάν τρίτος προβάλει αξίωση κατά της Advon Media εξαιτίας τέτοιου περιεχομένου, ο πελάτης αναλαμβάνει να την καλύψει πλήρως, μαζί με κάθε σχετική δαπάνη.</p>
              <p>Εάν εντοπιστεί λάθος σε ιστοσελίδα πελάτη, ο πελάτης οφείλει να μας ενημερώσει και η διόρθωση γίνεται σύμφωνα με τους όρους της συνεργασίας μας. Οι παρόντες όροι ισχύουν για όλες τις ιστοσελίδες που έχει κατασκευάσει ή θα κατασκευάσει η Advon Media.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Περιορισμός Ευθύνης</h2>
              <p>Η Advon Media δεν ευθύνεται για τυχόν τεχνικά προβλήματα που μπορεί να προκύψουν κατά την πρόσβαση των χρηστών στον ιστότοπο. Επίσης, δεν φέρουμε ευθύνη για το περιεχόμενο εξωτερικών συνδέσμων που ενδέχεται να υπάρχουν στην ιστοσελίδα μας.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Υποχρεώσεις Χρηστών</h2>
              <p>Οι χρήστες της ιστοσελίδας οφείλουν να τη χρησιμοποιούν σύμφωνα με τον νόμο και τα χρηστά ήθη. Απαγορεύεται η χρήση της ιστοσελίδας για την αποστολή κακόβουλου λογισμικού, ανεπιθύμητης αλληλογραφίας (spam) ή περιεχομένου που είναι παράνομο ή προσβλητικό.</p>

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
              <p>Advon Media designs and builds websites on behalf of its clients. All information shown on a client website — including texts, service descriptions, qualifications, specialties and certifications, biographical details, prices, opening hours, addresses and contact details, photos, logos, reviews and articles — comes from the client, or from public sources about the client (such as their Google profile or appointment-booking platforms), or has been written by us solely on the basis of these. Advon Media has neither the means nor sufficient information to verify the accuracy of this information.</p>
              <p>For this reason, every website is first delivered to the client for review. By approving publication, the client confirms that they have read and checked all of the content, that it is true, accurate, complete and up to date, and that they hold every right or permission needed to use it (copyright in texts and photos, trademarks, image rights, consent of the people shown or mentioned). The same applies to every change or addition after publication, and to any content the client adds or publishes themselves (e.g. through an admin panel or an articles section).</p>
              <p>The client is solely responsible for the content of their website and for its compliance with applicable law and the rules of their profession — including codes of conduct, rules on advertising by health and legal professionals, consumer protection and data protection (GDPR), in particular for data collected through forms on their website, for which the client is the data controller. Advon Media accepts no liability for inaccurate, misleading, incomplete or outdated information, for any infringement of third-party rights, or for any direct or indirect damage arising from the content of a client website. If a third party brings a claim against Advon Media because of such content, the client undertakes to cover it in full, together with any related costs.</p>
              <p>If an error is found on a client website, the client must inform us and the correction is made according to the terms of our cooperation. These terms apply to every website Advon Media has built or will build.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">Limitation of Liability</h2>
              <p>Advon Media is not responsible for any technical problems that may arise during users' access to the site. Furthermore, we bear no responsibility for the content of external links that may exist on our website.</p>

              <h2 className="text-xl font-bold text-electric-cyan pt-4">User Obligations</h2>
              <p>Users of the website must use it in accordance with the law and good morals. It is prohibited to use the website to send malware, spam, or content that is illegal or offensive.</p>

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