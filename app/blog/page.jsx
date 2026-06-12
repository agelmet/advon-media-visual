// app/blog/page.jsx
'use client';
import { useState } from 'react';
import { useLangStore } from '@/store/langStore';
import { blogsData } from '@/lib/data';
import { ArrowRight, X } from 'lucide-react';
import Contact from '@/components/Contact';
import ScrollReveal from '@/components/ScrollReveal';

export default function Blog() {
  const { lang } = useLangStore();
  const [activeBlog, setActiveBlog] = useState(null);

  const blogList = [
    { id: 1, dateEl: '14 Φεβρουαρίου 2025', dateEn: 'February 14, 2025', titleEl: 'Η Ιστοσελίδα σου Κερδίζει Πελάτες — ή τους Χάνει;', titleEn: 'Your Website Wins Clients — Or Loses Them?', descEl: 'Αν η επιχείρησή σου δεν έχει επαγγελματική ιστοσελίδα...', descEn: 'If your business doesn\'t have a professional website...' },
    { id: 2, dateEl: '3 Απριλίου 2025', dateEn: 'April 3, 2025', titleEl: 'Google Reviews το 2025: Το Νόμισμα της Τοπικής Επιχείρησης', titleEn: 'Google Reviews in 2025: The Currency of Local Business', descEl: 'Οι αξιολογήσεις σου στη Google είναι η φήμη σου.', descEn: 'Your Google reviews are your reputation.' },
    { id: 3, dateEl: '19 Ιουνίου 2025', dateEn: 'June 19, 2025', titleEl: 'Social Media για Τοπικές Επιχειρήσεις: Τι Λειτουργεί Πραγματικά', titleEn: 'Social Media for Local Businesses: What Really Works', descEl: 'Τα social media, σωστά διαχειρισμένα, είναι cost-effective.', descEn: 'Social media, managed properly, is cost-effective.' },
    { id: 4, dateEl: '8 Σεπτεμβρίου 2025', dateEn: 'September 8, 2025', titleEl: 'Ο Κανόνας των 5 Δευτερολέπτων', titleEn: 'The 5-Second Rule', descEl: 'Αν ένας επισκέπτης δεν καταλάβει τι προσφέρεις σε 5 δευτερόλεπτα...', descEn: 'If a visitor doesn\'t understand what you offer in 5 seconds...' },
    { id: 5, dateEl: '27 Νοεμβρίου 2025', dateEn: 'November 27, 2025', titleEl: 'Πώς να Ανέβεις στην Κορυφή της Google', titleEn: 'How to Reach the Top of Google', descEl: 'Το οργανικό τοπικό SEO προσφέρει ένα πιο βιώσιμο μονοπάτι.', descEn: 'Organic local SEO offers a more sustainable path.' },
    { id: 6, dateEl: '12 Μαρτίου 2026', dateEn: 'March 12, 2026', titleEl: 'Το Ψηφιακό Marketing Stack', titleEn: 'The Digital Marketing Stack', descEl: 'Η ακριβής ψηφιακή υποδομή για να έχεις ροή πελατών.', descEn: 'The exact digital infrastructure to have a flow of clients.' },
  ];

  return (
    <div className="pt-20">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-20">
            <span className="section-label">{lang === 'el' ? 'ΑΡΘΡΑ' : 'ARTICLES'}</span>
            <h1 className="text-4xl md:text-5xl font-black font-display mb-4 text-white tracking-tight">
              {lang === 'el' ? 'Blog της Advon Media' : 'Advon Media Blog'}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              {lang === 'el'
                ? 'Χρήσιμες συμβουλές και insights για την ψηφιακή παρουσία τοπικών επιχειρήσεων και ελεύθερων επαγγελματιών.'
                : 'Useful tips and insights for the digital presence of local businesses and freelancers.'}
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogList.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 80} direction="up">
                <div
                  onClick={() => {
                    setActiveBlog(post.id);
                    document.body.style.overflow = 'hidden';
                  }}
                  className="glass-panel p-8 rounded-3xl cursor-pointer flex flex-col h-full group glow-border-hover"
                >
                  <div className="text-sm text-electric-cyan font-bold mb-4 tracking-wide">
                    {lang === 'el' ? post.dateEl : post.dateEn}
                  </div>
                  <h2 className="text-xl font-bold font-display text-white mb-4 line-clamp-3 group-hover:text-electric-cyan transition-colors duration-300">
                    {lang === 'el' ? post.titleEl : post.titleEn}
                  </h2>
                  <p className="text-gray-400 line-clamp-3 flex-grow text-sm leading-relaxed">
                    {lang === 'el' ? post.descEl : post.descEn}
                  </p>
                  <span className="mt-6 flex items-center gap-2 text-electric-cyan font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all duration-300">
                    {lang === 'el' ? 'ΔΙΑΒΑΣΤΕ ΤΟ ΑΡΘΡΟ' : 'READ ARTICLE'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Modal */}
      {activeBlog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#050a0e]/96 backdrop-blur-xl"
            onClick={() => {
              setActiveBlog(null);
              document.body.style.overflow = 'auto';
            }}
          />
          <div className="relative bg-[#0a1418] border border-electric-cyan/35 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_0_80px_rgba(71,200,245,0.2),0_0_160px_rgba(71,200,245,0.05)] z-10">
            <div className="sticky top-0 p-4 flex justify-end bg-gradient-to-b from-[#0a1418] via-[#0a1418]/90 to-transparent z-10">
              <button
                onClick={() => {
                  setActiveBlog(null);
                  document.body.style.overflow = 'auto';
                }}
                className="p-3 rounded-full bg-white/5 hover:bg-electric-cyan hover:text-[#050a0e] text-white transition-all duration-300 shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div
              className="px-8 pb-16 pt-2 text-gray-300 leading-relaxed max-w-3xl mx-auto [&>h1]:font-display [&>h1]:text-white [&>h1]:text-3xl [&>h1]:font-black [&>h1]:mb-8 [&>h1]:leading-tight [&>h2]:text-electric-cyan [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4 [&>p]:mb-5 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-5 [&>ul>li]:mb-2 [&>strong]:text-white"
              dangerouslySetInnerHTML={{ __html: lang === 'el' ? blogsData[activeBlog].el : blogsData[activeBlog].en }}
            />
          </div>
        </div>
      )}

      <Contact />
    </div>
  );
}
