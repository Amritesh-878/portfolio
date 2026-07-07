import type { MetadataRoute } from 'next';

const BASE = 'https://amritesh.net';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/internals' },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
