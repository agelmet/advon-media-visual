// lib/schema.js
// JSON-LD builders for service pages (Service + FAQPage), consumed by the
// server page.jsx wrappers. Greek is the primary indexed language.

import { SITE_URL } from '@/lib/services';

export function serviceJsonLd(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.h1.el,
    description: service.seo.description,
    url: `${SITE_URL}/${service.slug}`,
    areaServed: { '@type': 'Country', name: 'Greece' },
    provider: {
      '@type': 'Organization',
      name: 'Advon Media',
      url: SITE_URL,
      email: 'angelos@advonmedia.com',
    },
  };
}

export function faqJsonLd(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q.el,
      acceptedAnswer: { '@type': 'Answer', text: a.el },
    })),
  };
}

/* Renders both schemas as <script type="application/ld+json"> tags (server component). */
export function ServiceSchema({ service }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(service)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(service)) }}
      />
    </>
  );
}

export function serviceMetadata(service) {
  return {
    title: service.seo.title,
    description: service.seo.description,
    alternates: { canonical: `${SITE_URL}/${service.slug}` },
    openGraph: {
      title: service.seo.title,
      description: service.seo.description,
      url: `${SITE_URL}/${service.slug}`,
    },
  };
}
