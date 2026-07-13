// app/blog/page.jsx
// Blog index — server component for metadata/schema; cards are client
// (language toggle). Posts live in lib/blog.js as real /blog/[slug] pages.
import { sortedPosts } from '@/lib/blog';
import { SITE_URL } from '@/lib/services';
import BlogIndexClient from '@/components/BlogIndexClient';

export const metadata = {
  title: 'Blog — Συμβουλές για Ελληνικές Επιχειρήσεις | Advon Media',
  description:
    'Πρακτικές συμβουλές για ιστοσελίδες, κριτικές Google, online ραντεβού και ψηφιακά εργαλεία — γραμμένες για ελληνικές μικρές επιχειρήσεις.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'Blog — Συμβουλές για Ελληνικές Επιχειρήσεις | Advon Media',
    description:
      'Πρακτικές συμβουλές για ιστοσελίδες, κριτικές Google, online ραντεβού και ψηφιακά εργαλεία.',
    url: `${SITE_URL}/blog`,
  },
};

export default function BlogIndex() {
  const posts = sortedPosts();

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Advon Media Blog',
    url: `${SITE_URL}/blog`,
    inLanguage: 'el',
    publisher: { '@type': 'Organization', name: 'Advon Media', url: SITE_URL },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title.el,
      url: `${SITE_URL}/blog/${p.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <BlogIndexClient posts={posts} />
    </>
  );
}
