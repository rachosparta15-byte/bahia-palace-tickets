import type { MetadataRoute } from 'next';
import prisma from '@/lib/db';

const BASE    = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://visitbahiapalace.com';
const LOCALES = ['en', 'fr', 'it', 'de', 'es'] as const;

const STATIC: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '',                priority: 1.0,  freq: 'weekly'  },
  { path: '/tickets',        priority: 0.95, freq: 'weekly'  },
  { path: '/entrance-fee',   priority: 0.92, freq: 'monthly' },
  { path: '/opening-hours',  priority: 0.90, freq: 'monthly' },
  { path: '/location',       priority: 0.88, freq: 'monthly' },
  { path: '/history',        priority: 0.85, freq: 'monthly' },
  { path: '/safety',         priority: 0.82, freq: 'weekly'  },
  { path: '/blog',           priority: 0.80, freq: 'weekly'  },
  { path: '/faq',            priority: 0.75, freq: 'monthly' },
  { path: '/about',          priority: 0.60, freq: 'monthly' },
  { path: '/contact',        priority: 0.55, freq: 'monthly' },
];

const TICKET_SLUGS = [
  'skip-the-line',
  'guided-tour',
  'private-tour',
  'combo-saadian-tombs',
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

  // Published blog posts
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, locale: true, updatedAt: true },
    });
    for (const post of posts) {
      entries.push({
        url: `${BASE}/${post.locale}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.65,
      });
    }
  } catch { /* DB unavailable at build time — skip */ }

  return entries;
}
