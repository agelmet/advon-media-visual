// components/BlogIndexClient.jsx
// Blog index cards — same card design the old modal-based blog used,
// now linking to real /blog/[slug] pages. The newest article is a full-width
// «featured» card on top, so the 3-column grid below always fills its rows.
'use client';

import Link from 'next/link';
import { useLangStore } from '@/store/langStore';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';

export default function BlogIndexClient({ posts }) {
  const { lang } = useLangStore();
  const [featured, ...rest] = posts;

  return (
    <section className="py-20 pt-16">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
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

        {featured && (
          <ScrollReveal direction="up" className="mb-8">
            <Link
              href={`/blog/${featured.slug}`}
              className="glass-panel card-sweep rounded-3xl p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-8 group glow-border-hover relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none" aria-hidden="true"
                style={{ background: 'radial-gradient(circle, rgba(71,200,245,0.16) 0%, rgba(71,200,245,0.05) 40%, transparent 70%)' }} />
              <div className="flex-1 relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[0.6rem] font-black tracking-[0.25em] uppercase px-3 py-1.5 rounded-full border border-electric-cyan/40 bg-electric-cyan/10 text-electric-cyan">
                    {lang === 'el' ? 'Νέο άρθρο' : 'New article'}
                  </span>
                  <span className="text-sm text-electric-cyan font-bold tracking-wide">{featured.date[lang]}</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold font-display text-white mb-4 leading-tight group-hover:text-electric-cyan transition-colors duration-300">
                  {featured.title[lang]}
                </h2>
                <p className="text-gray-400 leading-relaxed max-w-3xl">
                  {featured.excerpt[lang]}
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-electric-cyan text-[#050a0e] font-black text-xs uppercase tracking-widest group-hover:bg-white transition-colors duration-300 self-start md:self-center">
                {lang === 'el' ? 'ΔΙΑΒΑΣΤΕ ΤΟ' : 'READ IT'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
          </ScrollReveal>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((post, i) => (
            <ScrollReveal key={post.slug} delay={(i % 3) * 80} direction={i % 3 === 0 ? 'left' : i % 3 === 2 ? 'right' : 'up'} className="h-full">
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
