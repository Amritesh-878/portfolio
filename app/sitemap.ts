import type { MetadataRoute } from 'next';

import { source } from '@/lib/source';

const BASE = 'https://portfolio-amritesh-praveen.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const urls = new Set(source.getPages().map((page) => page.url));
  urls.add('/release-notes');
  return [...urls].map((url) => ({ url: new URL(url, BASE).toString() }));
}
