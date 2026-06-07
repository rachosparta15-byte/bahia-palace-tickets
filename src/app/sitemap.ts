import type { MetadataRoute } from 'next';
import prisma from '@/lib/db';
import { BASE } from '@/lib/seo';

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

  // Published blog posts — grouped by slug for hreflang
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, locale: true, updatedAt: true },
    });
    // Group by slug so each locale entry carries alternates for all other locales
    const bySlug = new Map<string, typeof posts>();
    for (const post of posts) {
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
  } catch { /* DB unavailable at build time — skip */ }

  return entries;
}
