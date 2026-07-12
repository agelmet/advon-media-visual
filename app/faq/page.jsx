// app/faq/page.jsx
'use client';
import { useState } from 'react';
import { useLangStore } from '@/store/langStore';
import { ChevronDown } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function FAQ() {
  const { lang } = useLangStore();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      qEl: 'Τι είναι η Advon Media;',
      qEn: 'What is Advon Media?',
      aEl: 'Φτιάχνουμε ιστοσελίδες & ψηφιακά εργαλεία για ελληνικές επιχειρήσεις. Δουλεύουμε κυρίως με τοπικές επιχειρήσεις και ελεύθερους επαγγελματίες — ψυχολόγους, θεραπευτές, γιατρούς, κομμωτήρια, καταλύματα, εστίαση — και κάθε επαγγελματία που θέλει να τον βρίσκουν, να τον εμπιστεύονται και να κλείνει δουλειές online.',
      aEn: 'We build websites & digital tools for Greek businesses. We primarily work with local businesses and freelancers — psychologists, therapists, doctors, hair salons, accommodations, restaurants — and any professional who wants to be found, trusted, and booked online.'
    },
    {
      qEl: 'Ποιες υπηρεσίες προσφέρετε;',
      qEn: 'What services do you offer?',
      aEl: 'Οι βασικές μας υπηρεσίες:<br><br>1. <strong>Κατασκευή Ιστοσελίδων</strong> — δίγλωσση, γρήγορη σελίδα χωρίς προκαταβολή.<br>2. <strong>Παρουσία στο Google</strong> — NFC stand για κριτικές και πλήρες στήσιμο του προφίλ σας στο Google Maps.<br>3. <strong>Online Ραντεβού</strong> — δική σας σελίδα κρατήσεων με αυτόματες υπενθυμίσεις.<br>4. <strong>AI Βοηθός Ιστοσελίδας</strong> — απαντά στους επισκέπτες σας όλο το 24ωρο.<br>5. <strong>Direct Booking για Τουρισμό</strong> — κρατήσεις χωρίς προμήθειες.<br>6. <strong>Ψηφιακό Μενού QR</strong> — δίγλωσσος κατάλογος χωρίς επανεκτυπώσεις.<br>7. <strong>Custom Μικρό Λογισμικό</strong> — πρόγραμμα φτιαγμένο για τον δικό σας τρόπο δουλειάς.<br><br>Ακόμη: ιστοσελίδες γάμου & βάπτισης, υπολογιστές κόστους και διαχείριση social media.',
      aEn: 'Our core services:<br><br>1. <strong>Website Creation</strong> — a bilingual, fast website with no deposit.<br>2. <strong>Google Presence</strong> — an NFC review stand plus full Google Maps profile setup.<br>3. <strong>Online Appointments</strong> — your own booking page with automatic reminders.<br>4. <strong>Website AI Assistant</strong> — answers your visitors around the clock.<br>5. <strong>Direct Booking for Tourism</strong> — commission-free bookings.<br>6. <strong>QR Digital Menu</strong> — a bilingual menu with no reprints.<br>7. <strong>Custom Small Software</strong> — built around the way you work.<br><br>Also: wedding & christening websites, cost calculators and social media management.'
    },
    {
      qEl: 'Γιατί η κατασκευή ιστοσελίδας είναι δωρεάν; Ποιο είναι το catch;',
      qEn: "Why is the website creation free? What's the catch?",
      aEl: 'Δεν υπάρχει catch. Πιστεύουμε ότι κάθε επαγγελματίας αξίζει να έχει αξιόπιστη online παρουσία — ανεξάρτητα από προϋπολογισμό.<br><br>Χτίζουμε την ιστοσελίδα χωρίς κόστος κατασκευής και χωρίς προκαταβολή. Το μόνο που πληρώνετε είναι η φιλοξενία — και αυτή, μόνο όταν παραδοθεί το πρώτο δείγμα της σελίδας σας. Δεν υπάρχουν κρυφές χρεώσεις.',
      aEn: 'There is no catch. We believe every professional deserves a reliable online presence — regardless of budget.<br><br>We build the website with no construction fee and no deposit. The only thing you pay is the hosting — and only once the first draft of your website is delivered. There are no hidden fees.'
    },
    {
      qEl: 'Τι σημαίνει «φιλοξενία» (hosting);',
      qEn: 'What does "hosting" mean?',
      aEl: 'Η φιλοξενία είναι το «ενοίκιο» για τον χώρο στον server όπου ζει η ιστοσελίδα σας — χωρίς αυτήν, η σελίδα δεν είναι ορατή στο διαδίκτυο. Καλύπτει τον server, το domain, την ασφάλεια, τα backups και τη συνεχή λειτουργία της σελίδας.',
      aEn: 'Hosting is the "rent" for the server space where your website lives — without it, the site isn\'t visible on the internet. It covers the server, the domain, security, backups, and keeping your site online.'
    },
    {
      qEl: 'Πόσο διαρκεί η παράδοση μιας ιστοσελίδας;',
      qEn: 'How long does website delivery take?',
      aEl: 'Από τη στιγμή που έχουμε λάβει όλο το υλικό — φωτογραφίες, κείμενα, λογότυπο, και ό,τι άλλο χρειαστεί — παραδίδουμε το πρώτο δείγμα σε <strong>7–14 ημέρες</strong>. Από εκεί, κάνουμε όσες αλλαγές χρειαστούν μέχρι να είναι ακριβώς όπως τη θέλετε.',
      aEn: 'Once we have received all the material — photos, texts, logo, and anything else needed — we deliver the first draft within <strong>7–14 days</strong>. From there, we make as many changes as needed until it\'s exactly how you want it.'
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
      <section className="py-32 relative overflow-hidden">
        {/* Ambient depth */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute rounded-full"
            style={{ top: '-8%', right: '-12%', width: 'min(50vw, 520px)', height: 'min(50vw, 520px)', background: 'radial-gradient(circle, rgba(71,200,245,0.08) 0%, transparent 65%)', filter: 'blur(80px)', animation: 'auroraFloat1 22s ease-in-out infinite' }}
          />
          <div
            className="absolute rounded-full"
            style={{ bottom: '-10%', left: '-10%', width: 'min(45vw, 460px)', height: 'min(45vw, 460px)', background: 'radial-gradient(circle, rgba(107,63,160,0.1) 0%, transparent 65%)', filter: 'blur(90px)', animation: 'auroraFloat2 28s ease-in-out infinite' }}
          />
        </div>
        <div className="max-w-3xl mx-auto px-6 relative z-10">
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
    </div>
  );
}
