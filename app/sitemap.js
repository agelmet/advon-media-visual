// app/sitemap.js
import { services, SITE_URL } from '@/lib/services';

export default function sitemap() {
  const now = new Date();

  const staticPages = [
    { url: `${SITE_URL}/`, priority: 1 },
    { url: `${SITE_URL}/faq`, priority: 0.5 },
    { url: `${SITE_URL}/blog`, priority: 0.5 },
    { url: `${SITE_URL}/diaxeirisi-social-media`, priority: 0.6 },
    { url: `${SITE_URL}/privacy-policy`, priority: 0.2 },
    { url: `${SITE_URL}/terms`, priority: 0.2 },
  ];

  const servicePages = services.map((service) => ({
    url: `${SITE_URL}/${service.slug}`,
    priority: 0.8,
  }));

  return [...staticPages, ...servicePages].map((page) => ({
    ...page,
    lastModified: now,
    changeFrequency: 'monthly',
  }));
}
