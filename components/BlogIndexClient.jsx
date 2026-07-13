// components/BlogIndexClient.jsx
// Blog index cards — same card design the old modal-based blog used,
// now linking to real /blog/[slug] pages.
'use client';

import Link from 'next/link';
import { useLangStore } from '@/store/langStore';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';

export default function BlogIndexClient({ posts }) {
  const { lang } = useLangStore();

  return (
    <section className="py-20 pt-16">
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
          {posts.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 80} direction={i % 3 === 0 ? 'left' : i % 3 === 2 ? 'right' : 'up'} className="h-full">
              <TiltCard className="h-full">
                <Link
                  href={`/blog/${post.slug}`}
                  className="glass-panel card-sweep p-8 rounded-3xl flex flex-col h-full group glow-border-hover"
                >
                  <div className="text-sm text-electric-cyan font-bold mb-4 tracking-wide">
                    {post.date[lang]}
                  </div>
                  <h2 className="text-xl font-bold font-display text-white mb-4 line-clamp-3 group-hover:text-electric-cyan transition-colors duration-300">
                    {post.title[lang]}
                  </h2>
                  <p className="text-gray-400 line-clamp-3 flex-grow text-sm leading-relaxed">
                    {post.excerpt[lang]}
                  </p>
                  <span className="mt-6 flex items-center gap-2 text-electric-cyan font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all duration-300">
                    {lang === 'el' ? 'ΔΙΑΒΑΣΤΕ ΤΟ ΑΡΘΡΟ' : 'READ ARTICLE'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
