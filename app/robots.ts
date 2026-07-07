import type { MetadataRoute } from 'next';

const BASE = 'https://portfolio-amritesh-praveen.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/internals' },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
