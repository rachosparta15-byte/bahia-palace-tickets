import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { LeadButton } from '@/components/layout/LeadButton';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { Clock, ArrowRight, User } from 'lucide-react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import { BASE, buildAlternates, buildBreadcrumbSchema } from '@/lib/seo';
import { getBlogPost } from '@/lib/blog';
import { HISTORY_HREFLANG, HISTORY_SLUGS } from '@/lib/blog-hreflang';
import { livePostFilter, isLive } from '@/lib/blog-schedule';

const ALL_LOCALES = ['en', 'fr', 'it', 'de', 'es'];

// Builds hreflang alternates for a blog post. Slugs are only shared across
// locales when the same slug is genuinely published in each — otherwise
// (e.g. a post that exists only in one locale) buildAlternates()'s "same
// path for every locale" assumption produces alternate links to 404s, which
// Google then dutifully crawls and reports as broken.
async function buildBlogAlternates(locale: string, slug: string) {
  if (HISTORY_SLUGS.has(slug)) {
    const languages = Object.fromEntries(
      Object.entries(HISTORY_HREFLANG).map(([l, s]) => [l, `${BASE}/${l}/blog/${s}`])
    );
    languages['x-default'] = `${BASE}/en/blog/${HISTORY_HREFLANG.en}`;
    return { canonical: `${BASE}/${locale}/blog/${slug}`, languages };
  }

  let presentLocales: string[] = [];
  try {
    const rows = await prisma.blogPost.findMany({ where: { slug, ...livePostFilter() }, select: { locale: true } });
    presentLocales = rows.map((r) => r.locale);
  } catch { /* db unavailable */ }
  if (presentLocales.length === 0) {
    presentLocales = ALL_LOCALES.filter((l) => getBlogPost(l, slug));
  }
  if (!presentLocales.includes(locale)) presentLocales.push(locale);

  const languages: Record<string, string> = {};
  for (const l of presentLocales) languages[l] = `${BASE}/${l}/blog/${slug}`;
  if (presentLocales.includes('en')) languages['x-default'] = `${BASE}/en/blog/${slug}`;

  return { canonical: `${BASE}/${locale}/blog/${slug}`, languages };
}

const CATEGORY_IMAGES: Record<string, string> = {
  'visit-tips':   '/images/gallery/bahia-palace-tourists-visiting-grand-courtyard.jpg',
  'history':      '/images/blog-real/bahia-palace-long-gallery-corridor-painted-ceiling-chandeliers.webp',
  'safety':       '/images/gallery/bahia-palace-zellige-floor-stucco-calligraphy-low-angle.jpg',
  'practical':    '/images/gallery/bahia-palace-stucco-column-zellige-floor-fountain.jpg',
  'comparisons':  '/images/blog-real/bahia-palace-courtyard-wall-fountain-alcove-zellige.webp',
  'guides':       '/images/blog-real/bahia-palace-entrance-gate-arabic-inscription-carving.webp',
  'tips':         '/images/blog-real/bahia-palace-garden-entrance-path-palm-trees.webp',
  'reviews':      '/images/blog-real/bahia-palace-ornate-ceiling-chandelier-stained-glass-skylight.webp',
  'itineraries':  '/images/gallery/bahia-palace-aerial-view-marrakech-medina-drone.jpg',
};

function extractFaqSchema(html: string) {
  const pairs: { q: string; a: string }[] = [];
  const re = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const q = m[1].replace(/<[^>]+>/g, '').trim();
    const a = m[2].replace(/<[^>]+>/g, '').trim();
    if (q && a) pairs.push({ q, a });
  }
  if (pairs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export const revalidate = 3600;

const STATIC_PAGE_CANONICALS: Record<string, string> = {
  'bahia-palace-opening-hours-2026': '/opening-hours',
  'bahia-palace-entrance-fee-2026':  '/entrance-fee',
};

type NormalizedPost = {
  id: string;
  title: string;
  slug: string;
  locale: string;
  excerpt: string | null;
  content: string | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  coverImagePosition: string | null;
  category: string;
  seoTitle: string | null;
  seoDesc: string | null;
  ogImage: string | null;
  author: string;
  publishedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
};

async function getPost(locale: string, slug: string): Promise<NormalizedPost | null> {
  try {
    const db = await prisma.blogPost.findUnique({ where: { slug_locale: { slug, locale } } });
    // isLive() rather than db.published: a post scheduled for a future date is
    // published but must still 404 until its moment arrives.
    if (db && isLive(db)) return db as unknown as NormalizedPost;
  } catch { /* db unavailable */ }

  const s = getBlogPost(locale, slug);
  if (!s) return null;
  const body = s.body.map((p) => `<p>${p}</p>`).join('\n')
    + (s.tips?.length ? '<ul>' + s.tips.map((t) => `<li>${t}</li>`).join('') + '</ul>' : '');
  const now = new Date();
  return {
    id: s.slug,
    title: s.title,
    slug: s.slug,
    locale: s.locale,
    excerpt: s.excerpt,
    content: body,
    coverImage: null,
    coverImageAlt: null,
    coverImagePosition: null,
    category: s.category,
    seoTitle: null,
    seoDesc: s.excerpt,
    ogImage: null,
    author: 'Bahia Palace Team',
    publishedAt: new Date(s.publishedAt),
    updatedAt: now,
    createdAt: now,
  };
}

function toISO(v: Date | string | null | undefined): string {
  if (!v) return new Date().toISOString();
  const d = v instanceof Date ? v : new Date(v as string);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(locale, slug);
  if (!post) return {};

  /*
   * The site's own title, not Google's truncation.
   *
   * This reserved 15 characters for " | Bahia Palace" and then cut the article
   * title at 44 — mid-word, with an ellipsis. 124 of 139 posts were affected,
   * so most of this blog appeared in search as things like
   *
   *     "10 Hidden Details in Bahia Palace Most Touri… | Bahia Palace"
   *
   * A searcher reads that and learns nothing about the tenth word; the branding
   * suffix survived and the sentence did not. It is the wrong thing to protect.
   * Google renders roughly 60 characters and cuts at a word boundary itself, so
   * a title left whole is cut better by Google than by us.
   *
   * The rule now: append the suffix only when the whole thing still fits.
   * Otherwise ship the article's own title, untouched. Nothing is ever cut
   * mid-word here again, and a long title loses the branding rather than its
   * meaning.
   *
   * Titles that begin with a stray quote — nine of them do, e.g. 'La Guida
   * Umana… — are cleaned too: that character is a data artefact from the
   * source, and in a search result it reads as a typo.
   */
  const SUFFIX      = ' | Bahia Palace';
  const MAX_TITLE   = 60;
  const rawTitle    = (post.seoTitle ?? post.title).trim().replace(/^["'‘’“”]+/, '').trim();
  const title       = rawTitle.length + SUFFIX.length <= MAX_TITLE
    ? rawTitle + SUFFIX
    : rawTitle;
  const descFallback = `${rawTitle} — expert guide to visiting Bahia Palace Marrakech. Tips, hours & skip-the-line tickets for 2026.`.slice(0, 160);
  const description = post.seoDesc ?? post.excerpt ?? descFallback;
  const ogImg       = post.ogImage  ?? post.coverImage ?? CATEGORY_IMAGES[post.category];
  const canonical   = `${BASE}/${locale}/blog/${slug}`;

  const staticPath = STATIC_PAGE_CANONICALS[slug];
  const alternates = staticPath
    ? { canonical: `${BASE}/${locale}${staticPath}`, languages: buildAlternates(locale, staticPath).languages }
    : await buildBlogAlternates(locale, slug);
  return {
    title,
    description,
    alternates,
    openGraph: {
      title:  rawTitle,
      description,
      type:   'article',
      url:    canonical,
      images: ogImg ? [{ url: ogImg, width: 1200, height: 630, alt: post.title }] : undefined,
      publishedTime: toISO(post.publishedAt ?? post.createdAt),
      modifiedTime:  toISO(post.updatedAt),
      authors:       [post.author],
      locale,
    },
    twitter: {
      card:        'summary_large_image',
      title:       rawTitle,
      description,
      images:      ogImg ? [ogImg] : undefined,
    },
  };
}

function readTime(content: string | null): number {
  if (!content) return 1;
  return Math.max(1, Math.round(content.split(/\s+/).length / 200));
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = await getPost(locale, slug);
  if (!post) notFound();

  const t   = await getTranslations('blog');
  const tb  = await getTranslations('breadcrumb');

  const imgSrc   = post.coverImage ?? CATEGORY_IMAGES[post.category] ?? CATEGORY_IMAGES['visit-tips'];
  const catLabel = t(`categories.${post.category}` as any) as string;
  const mins     = readTime(post.content);

  const safeContent = post.content ?? '';

  let related: NormalizedPost[] = [];
  try {
    const dbRelated = await prisma.blogPost.findMany({
      where: { locale, ...livePostFilter(), slug: { not: slug } },
      orderBy: { publishedAt: 'desc' },
      take: 2,
    });
    related = dbRelated as unknown as NormalizedPost[];
  } catch { /* db unavailable */ }
  if (related.length === 0) {
    const { getBlogPosts } = await import('@/lib/blog');
    related = getBlogPosts(locale)
      .filter((p) => p.slug !== slug)
      .slice(0, 2)
      .map((s) => ({
        id: s.slug, title: s.title, slug: s.slug, locale: s.locale,
        excerpt: s.excerpt, content: null, coverImage: null, coverImageAlt: null, coverImagePosition: null, category: s.category,
        seoTitle: null, seoDesc: null, ogImage: null, author: 'Bahia Palace Team',
        publishedAt: new Date(s.publishedAt), updatedAt: new Date(), createdAt: new Date(),
      }));
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: imgSrc,
    author: { '@type': post.author === 'Bahia Palace Team' ? 'Organization' : 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'Bahia Palace Tickets',
      logo: { '@type': 'ImageObject', url: `${BASE}/og-image.jpg` },
    },
    datePublished: toISO(post.publishedAt ?? post.createdAt),
    dateModified: toISO(post.updatedAt),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/${locale}/blog/${slug}` },
    inLanguage: locale,
  };

  const faqSchema = extractFaqSchema(safeContent);

  return (
    <div className="min-h-screen bg-[#1C1108]">
      <JsonLd data={articleSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <JsonLd data={buildBreadcrumbSchema(locale, [
        { name: tb('home'), path: '' },
        { name: tb('blog'), path: '/blog' },
        { name: post.title },
      ])} />
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <Image src={imgSrc} alt={post.coverImageAlt ?? post.title} fill priority className="object-cover" sizes="100vw" style={{ objectPosition: post.coverImagePosition ?? 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/20 to-[#1C1108]/95" />
        {/* extra dark strip at the very top for breadcrumb readability */}
        <div className="absolute inset-x-0 top-0 h-14 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-between px-6 py-8 md:px-10 max-w-4xl mx-auto w-full left-0 right-0">
          <Breadcrumb variant="light" items={[
            { label: tb('home'), href: '/' },
            { label: tb('blog'), href: '/blog' },
            { label: post.title.length > 45 ? post.title.slice(0, 45) + '…' : post.title },
          ]} />
          <div>
            <span className="inline-block bg-[#C4452D] text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
              {catLabel}
            </span>
            <h1
              className="text-white font-bold leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
            >
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <article className="lg:col-span-8">
            <div className="flex items-center gap-4 text-sm text-[#C4A882] mb-8 pb-6 border-b border-[rgba(232,163,61,0.15)] flex-wrap">
              <span className="flex items-center gap-1.5">
                <Clock size={13} /> {t('readTime', { min: mins })}
              </span>
              {post.publishedAt && (
                <time dateTime={toISO(post.publishedAt)}>
                  {post.publishedAt.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              )}
              <span className="flex items-center gap-1.5">
                <User size={13} /> {post.author}
              </span>
            </div>

            <div
              className="prose prose-sm max-w-none mb-10 leading-relaxed"
              style={{ fontSize: '1.05rem' }}
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />

            {/* Book CTA */}
            <div className="bg-[#C4452D] text-white rounded-xl p-6 text-center">
              <LeadButton
                ticketType="skip-the-line"
                ctaLocation="blog_post"
                className="inline-flex items-center gap-2 bg-white text-[#C4452D] font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
              >
                {t('bookCta')} <ArrowRight size={14} />
              </LeadButton>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {related.length > 0 && (
              <div>
                <h3
                  className="text-lg font-bold text-[#F5E8CC] mb-4"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {t('relatedPosts')}
                </h3>
                <div className="space-y-4">
                  {related.map((rel) => {
                    const relImg = rel.coverImage ?? CATEGORY_IMAGES[rel.category] ?? CATEGORY_IMAGES['visit-tips'];
                    return (
                      <Link
                        key={rel.id}
                        href={`/blog/${rel.slug}` as any}
                        className="group flex gap-3 bg-[#251A0F] rounded-xl border border-[rgba(232,163,61,0.13)] p-3 hover:border-[#E8A33D]/30 transition-colors"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <Image src={relImg} alt={rel.title} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-semibold text-[#F5E8CC] leading-snug group-hover:text-[#E8A33D] transition-colors line-clamp-2"
                            style={{ fontFamily: 'Cormorant Garamond, serif' }}
                          >
                            {rel.title}
                          </p>
                          <p className="text-xs text-[#C4A882] mt-1 flex items-center gap-1">
                            <Clock size={10} /> {t('readTime', { min: readTime(rel.content) })}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
