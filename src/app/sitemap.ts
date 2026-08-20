import type { MetadataRoute } from 'next';
import prisma from '@/lib/db';
import { BASE } from '@/lib/seo';
import { getAllSlugs, getBlogPost } from '@/lib/blog';
import { HISTORY_HREFLANG, HISTORY_SLUGS } from '@/lib/blog-hreflang';
import { REDIRECTED_BLOG_SLUGS } from '@/lib/blog-redirects';

export const dynamic = 'force-dynamic';
const LOCALES = ['en', 'fr', 'it', 'de', 'es'] as const;

const STATIC: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '',                priority: 1.0,  freq: 'weekly'  },
  /*
   * The page that actually sells, and it was not in this list.
   *
   * /visitor-pack is index,follow and its own title reads "Bahia Palace Ticket
   * + Audio Guide (€11.99)" — nothing was blocking it. It was simply never
   * submitted, which left Google to find the one commercial page on the site
   * by crawling links to it and nothing else.
   *
   * Search Console shows six pages competing for "bahia palace tickets" —
   * /entrance-fee, the English home page, the SPANISH home page, skip-the-line
   * — and this one appearing for none of them. Being listed here does not win
   * that fight on its own, but being absent from it is not a position to fight
   * from.
   */
  { path: '/visitor-pack',   priority: 0.98, freq: 'weekly'  },
  { path: '/tickets',        priority: 0.95, freq: 'weekly'  },
  { path: '/entrance-fee',   priority: 0.92, freq: 'monthly' },
  { path: '/opening-hours',  priority: 0.90, freq: 'monthly' },
  { path: '/location',       priority: 0.88, freq: 'monthly' },
  { path: '/history',        priority: 0.85, freq: 'monthly' },
  { path: '/safety',         priority: 0.82, freq: 'weekly'  },
  { path: '/blog',           priority: 0.78, freq: 'weekly'  },
  { path: '/faq',            priority: 0.75, freq: 'monthly' },
  { path: '/gallery',        priority: 0.72, freq: 'monthly' },
  { path: '/videos',         priority: 0.70, freq: 'weekly'  },
  { path: '/about',              priority: 0.60, freq: 'monthly' },
  { path: '/about/editorial',   priority: 0.55, freq: 'yearly'  },
  { path: '/contact',        priority: 0.55, freq: 'monthly' },
];

// Only include tickets that are live (available). Coming-soon tickets are noindexed.
const TICKET_SLUGS = [
  'skip-the-line',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Static pages × locales
  for (const { path, priority, freq } of STATIC) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}${path}`,
        lastModified: now,
        changeFrequency: freq,
        priority,
        alternates: {
          languages: Object.fromEntries(LOCALES.map(l => [l, `${BASE}/${l}${path}`])),
        },
      });
    }
  }

  // Ticket detail pages × locales
  for (const slug of TICKET_SLUGS) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}/tickets/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.90,
        alternates: {
          languages: Object.fromEntries(LOCALES.map(l => [l, `${BASE}/${l}/tickets/${slug}`])),
        },
      });
    }
  }

  // Published blog posts — grouped by slug for hreflang.
  // Primary: DB (when Phase B is live and posts are seeded).
  // Fallback: blog.ts static array — used whenever DB is empty or unavailable,
  //   which is always the case in Phase A (ephemeral SQLite, never seeded).
  let dbPosts: { slug: string; locale: string; updatedAt: Date }[] = [];
  try {
    dbPosts = await prisma.blogPost.findMany({
      // Scheduled posts must stay out of the sitemap too, or Google is told
      // about a URL that still 404s.
      where: { published: true, publishedAt: { lte: new Date() } },
      select: { slug: true, locale: true, updatedAt: true },
    });
  } catch { /* DB unavailable at sitemap generation time */ }

  // History posts use different slugs per locale — hardcode their cross-slug hreflang
  const historyLanguages = Object.fromEntries(
    Object.entries(HISTORY_HREFLANG).map(([l, s]) => [l, `${BASE}/${l}/blog/${s}`])
  );

  if (dbPosts.length > 0) {
    // DB path — preserve hreflang across only the locales that exist in the DB
    const bySlug = new Map<string, typeof dbPosts>();
    for (const post of dbPosts.filter(p => !REDIRECTED_BLOG_SLUGS.has(p.slug))) {
      const group = bySlug.get(post.slug) ?? [];
      group.push(post);
      bySlug.set(post.slug, group);
    }
    for (const group of bySlug.values()) {
      const isHistory = HISTORY_SLUGS.has(group[0].slug);
      const languages = isHistory
        ? historyLanguages
        : Object.fromEntries(group.map(p => [p.locale, `${BASE}/${p.locale}/blog/${p.slug}`]));
      for (const post of group) {
        entries.push({
          url: `${BASE}/${post.locale}/blog/${post.slug}`,
          lastModified: post.updatedAt,
          changeFrequency: 'monthly',
          priority: 0.65,
          alternates: { languages },
        });
      }
    }
  } else {
    // Static fallback — all slugs defined in blog.ts, all 5 locales
    for (const slug of getAllSlugs()) {
      if (REDIRECTED_BLOG_SLUGS.has(slug)) continue;
      const languages: Record<string, string> = {};
      for (const locale of LOCALES) {
        if (getBlogPost(locale, slug)) languages[locale] = `${BASE}/${locale}/blog/${slug}`;
      }
      for (const locale of LOCALES) {
        if (!getBlogPost(locale, slug)) continue;
        entries.push({
          url: `${BASE}/${locale}/blog/${slug}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.65,
          alternates: { languages },
        });
      }
    }
  }

  return entries;
}
