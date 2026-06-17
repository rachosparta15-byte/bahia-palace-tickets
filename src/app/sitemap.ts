import type { MetadataRoute } from 'next';
import prisma from '@/lib/db';
import { BASE } from '@/lib/seo';
import { getAllSlugs, getBlogPost } from '@/lib/blog';

export const dynamic = 'force-dynamic';
const LOCALES = ['en', 'fr', 'it', 'de', 'es'] as const;

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
  { path: '/about',          priority: 0.60, freq: 'monthly' },
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

  if (dbPosts.length > 0) {
    // DB path — preserve hreflang across only the locales that exist in the DB
    const bySlug = new Map<string, typeof dbPosts>();
    for (const post of dbPosts) {
      const group = bySlug.get(post.slug) ?? [];
      group.push(post);
      bySlug.set(post.slug, group);
    }
    for (const group of bySlug.values()) {
      const languages = Object.fromEntries(
        group.map(p => [p.locale, `${BASE}/${p.locale}/blog/${p.slug}`])
      );
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
