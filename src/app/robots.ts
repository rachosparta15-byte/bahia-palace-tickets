import type { MetadataRoute } from 'next';
import { BASE } from '@/lib/seo';

/*
 * The three test slugs — /blog/z, /blog/test, /blog/xdxxxxxxxx — used to be
 * listed here as well. They are already handled properly: next.config.mjs
 * redirects all fifteen of them (three slugs x five locales) with a permanent
 * 308 to the blog index, which is exactly how a junk URL should die.
 *
 * Disallowing them on top of that was what kept them alive. A crawler that is
 * forbidden from fetching a URL never sees the redirect, so the URL stays in
 * the index as a bare link with no snippet — which is what Search Console
 * reported on 5 August as "indexed, though blocked by robots.txt". robots.txt
 * controls crawling, never indexing; removing a page from the index requires
 * the crawler to be ALLOWED in, so it can be told 404, 308 or noindex.
 *
 * Left in place: /admin (private) and /api/ (not content).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
