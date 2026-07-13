// app/blog/[slug]/page.jsx
// Individual blog post — statically generated from lib/blog.js.
// Article JSON-LD deliberately omits datePublished: the displayed dates
// are editorial, and we don't present fabricated publish dates to
// search engines.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { posts, getPost, sortedPosts } from '@/lib/blog';
import { SITE_URL } from '@/lib/services';

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title.el} | Advon Media`,
    description: post.excerpt.el,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title.el,
      description: post.excerpt.el,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: 'article',
    },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title.el,
    description: post.excerpt.el,
    inLanguage: 'el',
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    author: { '@type': 'Organization', name: 'Advon Media', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'Advon Media', url: SITE_URL },
  };

  // Two other posts as "read next" — the neighbours in the sorted list.
  const all = sortedPosts();
  const idx = all.findIndex((p) => p.slug === post.slug);
  const readNext = [all[(idx + 1) % all.length], all[(idx + 2) % all.length]];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[420px] bg-[radial-gradient(ellipse,rgba(71,200,245,0.08)_0%,transparent_65%)] blur-[80px]" />
        </div>

        <div className="max-w-3xl mx-auto px-6 pt-10 pb-20 relative z-10">
          {/* Breadcrumb / back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-electric-cyan text-xs font-bold uppercase tracking-widest hover:gap-3 transition-all duration-300 mb-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Blog
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="text-sm text-electric-cyan font-bold tracking-wide mb-4">{post.date.el}</div>
            <h1
              className="font-black font-display text-white tracking-tight leading-[1.12] mb-6"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)' }}
            >
              {post.title.el}
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">{post.excerpt.el}</p>
            <div className="cyber-divider mt-10" />
          </div>

          {/* Body */}
          <div
            className="text-gray-300 leading-relaxed [&>h2]:text-electric-cyan [&>h2]:font-display [&>h2]:text-xl [&>h2]:md:text-2xl [&>h2]:font-bold [&>h2]:mt-12 [&>h2]:mb-4 [&>p]:mb-5 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-5 [&>ul]:space-y-2 [&_strong]:text-white [&_a]:text-electric-cyan [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-electric-cyan/40 hover:[&_a]:decoration-electric-cyan"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          {/* CTA to the relevant service */}
          <div className="mt-14 relative overflow-hidden rounded-3xl border border-electric-cyan/30 bg-gradient-to-br from-electric-cyan/8 via-transparent to-transparent p-8 text-center shadow-[0_0_40px_rgba(71,200,245,0.1)]">
            <p className="text-white font-display font-bold text-xl mb-5">
              Θέλετε να το δείτε στημένο για τη δική σας επιχείρηση;
            </p>
            <Link
              href={post.cta.href}
              className="btn-premium inline-flex items-center gap-2 px-8 py-3.5 bg-electric-cyan text-[#050a0e] font-black rounded-xl hover:bg-white transition-colors text-sm uppercase tracking-[0.08em]"
              style={{ boxShadow: '0 0 30px rgba(71,200,245,0.35)' }}
            >
              {post.cta.label.el}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>

          {/* Read next */}
          <div className="mt-16">
            <div className="text-xs font-black tracking-[0.2em] uppercase text-gray-600 mb-5">
              Διαβάστε επίσης
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {readNext.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="glass-panel rounded-2xl p-5 group glow-border-hover"
                >
                  <div className="text-[0.7rem] text-electric-cyan font-bold tracking-wide mb-2">{p.date.el}</div>
                  <div className="text-white font-bold text-sm leading-snug group-hover:text-electric-cyan transition-colors duration-300">
                    {p.title.el}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
