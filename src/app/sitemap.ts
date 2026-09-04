import type { MetadataRoute } from 'next';
import prisma from '@/lib/db';
import { BASE } from '@/lib/seo';
import { getAllSlugs, getBlogPost } from '@/lib/blog';
import { HISTORY_HREFLANG, HISTORY_SLUGS } from '@/lib/blog-hreflang';
import { REDIRECTED_BLOG_SLUGS } from '@/lib/blog-redirects';
import { locales } from '@/i18n/routing';
import { getPublicPaymentsFlags } from '@/lib/payments/guard';

export const dynamic = 'force-dynamic';
/*
 * Taken from the routing config, not written out again here.
 *
 * This line used to be a hand-kept list of five, and the site has had seven
 * locales since Arabic and Portuguese were added. Every /ar and /pt page —
 * sixteen static paths each, all returning 200 and all index,follow — was
 * therefore live, canonical to itself, and absent from the file that tells
 * search engines it exists. Bing's report flagged one URL, /pt, because it
 * samples; the real number was thirty-two pages plus their ticket detail.
 *
 * Deriving it means the next locale is in the sitemap the moment it is in the
 * router, which is the only version of this that stays correct.
 */
const LOCALES = locales;

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

  /*
   * Pages that go noindex when payments are off must leave the sitemap with
   * them.
   *
   * /visitor-pack is listed above at priority 0.98 — the highest on the site
   * after the home page — and its generateMetadata returns `noindex, nofollow`
   * and the title "Not Found" whenever payments are halted, which they have
   * been since PayPal closed the account. So seven URLs were being submitted as
   * the most important pages here while each of them told the crawler to go
   * away, and Bing duly reported them as having no usable description, because
   * a noindex page never gets one.
   *
   * Submitting a URL and then refusing it is worse than doing neither: it
   * spends crawl budget and it is the kind of contradiction that makes the rest
   * of the file less trusted. The flag that hides the page now hides its
   * sitemap entry too, from one source, so the two cannot drift apart again.
   */
  const { enabled: paymentsEnabled } = getPublicPaymentsFlags();
  const PAYMENT_GATED = new Set(['/visitor-pack']);
  const staticPages = STATIC.filter(
    ({ path }) => paymentsEnabled || !PAYMENT_GATED.has(path),
  );

  // Static pages × locales
  for (const { path, priority, freq } of staticPages) {
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
