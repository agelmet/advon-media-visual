// app/faq/page.jsx
'use client';
import { useState } from 'react';
import { useLangStore } from '@/store/langStore';
import { ChevronDown } from 'lucide-react';
import Contact from '@/components/Contact';
import ScrollReveal from '@/components/ScrollReveal';

export default function FAQ() {
  const { lang } = useLangStore();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      qEl: 'Τι είναι η Advon Media;',
      qEn: 'What is Advon Media?',
      aEl: 'Είμαστε ένα ψηφιακό marketing agency που ειδικεύεται σε στρατηγική, social media και περιεχόμενο. Δουλεύουμε κυρίως με τοπικές επιχειρήσεις και ελεύθερους επαγγελματίες — ψυχολόγους, θεραπευτές, οδοντίατρους, παιδίατρους, φυσικοθεραπευτές, coaches και κάθε επαγγελματία που θέλει να χτίσει αξιόπιστη ψηφιακή παρουσία και να προσελκύσει νέους πελάτες online.',
      aEn: 'We are a digital marketing agency specializing in strategy, social media, and content. We primarily work with local businesses and freelancers — psychologists, therapists, dentists, pediatricians, physiotherapists, coaches, and any professional wanting to build a reliable digital presence and attract new clients online.'
    },
    {
      qEl: 'Ποιες υπηρεσίες προσφέρετε;',
      qEn: 'What services do you offer?',
      aEl: 'Προσφέρουμε τρεις βασικές υπηρεσίες:<br><br>1. <strong>Κατασκευή Ιστοσελίδας</strong> — Επαγγελματική, SEO-βελτιστοποιημένη ιστοσελίδα.<br>2. <strong>Βάση Αξιολογήσεων (NFC)</strong> — Σύστημα που βοηθά την επιχείρησή σου να συλλέγει 50+ νέες αξιολογήσεις Google κάθε μήνα.<br>3. <strong>Διαχείριση Social Media</strong> — Επαγγελματικά posts, έρευνα hashtag, copywriting και μηνιαίες αναφορές.',
      aEn: 'We offer three core services:<br><br>1. <strong>Website Creation</strong> — Professional, SEO-optimized website.<br>2. <strong>Reviews Base (NFC)</strong> — System helping your business collect 50+ new Google reviews monthly.<br>3. <strong>Social Media Management</strong> — Professional posts, hashtag research, copywriting, and monthly reports.'
    },
    {
      qEl: 'Γιατί η κατασκευή ιστοσελίδας είναι δωρεάν; Ποιο είναι το catch;',
      qEn: "Why is the website creation free? What's the catch?",
      aEl: 'Δεν υπάρχει catch. Πιστεύουμε ότι κάθε επαγγελματίας αξίζει να έχει αξιόπιστη online παρουσία — ανεξάρτητα από προϋπολογισμό. Ο στόχος μας είναι να βοηθήσουμε να είσαι ορατός στο διαδίκτυο, χωρίς να επενδύσεις χιλιάδες ευρώ στην κατασκευή.<br><br>Χτίζουμε την ιστοσελίδα χωρίς κόστος κατασκευής. Το μόνο που χρειάζεται να πληρώσεις είναι το hosting — <strong>€10,83 τον μήνα</strong>. Δεν υπάρχουν κρυφές χρεώσεις και δεν υπάρχει «δέσμευση» συμβολαίου.',
      aEn: 'There is no catch. We believe every professional deserves a reliable online presence — regardless of budget. Our goal is to help you become visible online without investing thousands in web development.<br><br>We build the website with no construction fees. You only pay for the hosting — <strong>€10.83 per month</strong>. There are no hidden fees and no lock-in contracts.'
    },
    {
      qEl: 'Τι σημαίνει «hosting» και γιατί κοστίζει €10,83/μήνα;',
      qEn: 'What does "hosting" mean and why does it cost €10.83/mo?',
      aEl: 'Το hosting είναι το «ενοίκιο» που πληρώνεις για τον χώρο στον server όπου φιλοξενείται η ιστοσελίδα σου. Χωρίς αυτό η σελίδα δεν είναι ορατή στο διαδίκτυο. Τα €10,83/μήνα καλύπτουν τον server, την ασφάλεια, τα backups και τη συνεχή λειτουργία της. Μπορείς να σταματήσεις οποιαδήποτε στιγμή.',
      aEn: 'Hosting is the "rent" you pay for space on a server where your website lives. Without it, your site isn\'t visible on the internet. The €10.83/month covers the server, security, backups, and uptime. You can cancel at any time.'
    },
    {
      qEl: 'Πόσο διαρκεί η παράδοση μιας ιστοσελίδας;',
      qEn: 'How long does website delivery take?',
      aEl: 'Από τη στιγμή που έχουμε λάβει όλο το υλικό — φωτογραφίες, κείμενα, λογότυπο, και ό,τι άλλο χρειαστεί — μπορούμε να ολοκληρώσουμε την κατασκευή σε <strong>5–10 εργάσιμες ημέρες</strong>.',
      aEn: 'Once we have received all the necessary material — photos, text, logo, etc. — we can complete the website construction in <strong>5–10 business days</strong>.'
    },
    {
      qEl: 'Πώς μπορώ να επικοινωνήσω μαζί σας;',
      qEn: 'How can I contact you?',
      aEl: 'Στείλτε μας email στο <strong>angelos@advonmedia.com</strong> και θα επικοινωνήσουμε άμεσα μαζί σας. Μπορείτε επίσης να κλείσετε απευθείας ένα δωρεάν ραντεβού (μέσω της φόρμας στο τέλος της σελίδας) επιλέγοντας την ημέρα και ώρα που σας εξυπηρετεί για μια δωρεάν συμβουλευτική κλήση — χωρίς υποχρεώσεις.',
      aEn: 'Email us at <strong>angelos@advonmedia.com</strong> and we will get back to you immediately. You can also book a free appointment directly (via the form at the bottom of the page) by picking a day and time that suits you for a free consultation call — no strings attached.'
    }
  ];

  return (
    <div className="pt-28">
      <section className="py-32">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <span className="section-label">{lang === 'el' ? 'ΠΛΗΡΟΦΟΡΙΕΣ' : 'INFORMATION'}</span>
            <h1 className="text-4xl md:text-5xl font-black font-display mb-4 text-white tracking-tight">
              {lang === 'el' ? 'Συχνές Ερωτήσεις' : 'Frequently Asked Questions'}
            </h1>
          </ScrollReveal>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <ScrollReveal key={index} delay={index * 50} direction="up">
                <div className="bg-[#081219]/80 border border-electric-cyan/10 rounded-2xl overflow-hidden hover:border-electric-cyan/25 transition-colors duration-300">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className={`w-full flex items-center justify-between p-6 text-left font-medium hover:text-electric-cyan transition-colors text-lg ${openIndex === index ? 'text-electric-cyan' : 'text-white'}`}
                  >
                    <span>{lang === 'el' ? faq.qEl : faq.qEn}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 text-gray-400 shrink-0 ml-4 ${openIndex === index ? 'rotate-180 text-electric-cyan' : 'rotate-0'}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-400 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                    <div
                      className="px-6 pb-6 text-gray-400 leading-relaxed text-base border-t border-white/5 pt-4"
                      dangerouslySetInnerHTML={{ __html: lang === 'el' ? faq.aEl : faq.aEn }}
                    />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      <Contact />
    </div>
  );
}
