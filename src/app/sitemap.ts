import type { MetadataRoute } from 'next';
import prisma from '@/lib/db';
import { BASE } from '@/lib/seo';
import { getAllSlugs, getBlogPost } from '@/lib/blog';

export const dynamic = 'force-dynamic';
const LOCALES = ['en', 'fr', 'it', 'de', 'es'] as const;

const REDIRECTED_BLOG_SLUGS = new Set([
  // All-locale redirects
  'how-to-get-to-bahia-palace',
  'history-of-bahia-palace',
  'marrakech-tourist-scams-guide',
  'bahia-palace-who-built-it',
  // EN-only duplicate slugs
  'bahia-palace-history-marrakech',
  'who-built-bahia-palace-history-ba-ahmed',
  'bahia-palace-entrance-fee-2026-tickets-prices',
  'how-to-get-to-bahia-palace-from-jemaa-el-fna',
  'is-bahia-palace-worth-visiting-honest-review-2026',
  'what-to-wear-bahia-palace-marrakech-dress-code',
  'bahia-palace-photography-guide-best-spots-tips',
  'what-to-see-inside-bahia-palace-room-by-room',
  'bahia-palace-opening-hours-best-time-to-visit',
  'best-time-to-visit-bahia-palace-marrakech-2026',
  'bahia-palace-vs-badi-palace-which-to-visit',
  'bahia-palace-vs-saadian-tombs-comparison',
  'jardin-majorelle-vs-bahia-palace-marrakech',
  'how-to-avoid-tourist-scams-marrakech-safety-guide-2026',
  'how-to-avoid-scams-in-the-souks-of-marrakech-complete-guide-for-travelers',
  '2-days-in-marrakech-perfect-weekend-itinerary-2026',
  // Deleted / merged posts (301 redirects added)
  'bahia-palace-skip-the-line-guide',
  'marrakech-the-red-city-where-history-comes-alive',
  'marrakech-la-ciudad-roja-donde-la-historia-cobra-vida',
  'best-colors-to-wear-for-a-photoshoot-at-bahia-palace-marrakech',
]);

const STATIC: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '',                priority: 1.0,  freq: 'weekly'  },
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
      where: { published: true },
      select: { slug: true, locale: true, updatedAt: true },
    });
  } catch { /* DB unavailable at sitemap generation time */ }

  // History posts use different slugs per locale — hardcode their cross-slug hreflang
  const HISTORY_HREFLANG: Record<string, string> = {
    en: 'bahia-palace-history',
    fr: 'palais-de-la-bahia-marrakech-histoire',
    de: 'palast-bahia-marrakesch-geschichte',
    it: 'palazzo-bahia-marrakech-storia',
    es: 'palacio-bahia-marrakech-historia',
  };
  const HISTORY_SLUGS = new Set(Object.values(HISTORY_HREFLANG));
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
