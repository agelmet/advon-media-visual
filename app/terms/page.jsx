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