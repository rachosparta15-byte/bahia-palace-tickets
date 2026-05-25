import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { BOOKING_URL } from '@/lib/booking';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { Clock, ArrowRight, User } from 'lucide-react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import type { Metadata } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://visitbahiapalace.com';

const CATEGORY_IMAGES: Record<string, string> = {
  'visit-tips':   '/images/gallery/bahia-palace-tourists-visiting-grand-courtyard.jpg',
  'history':      '/images/gallery/bahia-palace-zellige-column-entrance-arch.jpg',
  'safety':       '/images/gallery/bahia-palace-zellige-floor-stucco-calligraphy-low-angle.jpg',
  'practical':    '/images/gallery/bahia-palace-stucco-column-zellige-floor-fountain.jpg',
  'comparisons':  '/images/gallery/bahia-palace-arch-view-green-dome-fountain-palm.jpg',
  'guides':       '/images/gallery/bahia-palace-main-entrance-sign-lantern-marrakech.jpg',
  'tips':         '/images/gallery/bahia-palace-bahia-inscription-arch-zellige-garden.jpg',
  'reviews':      '/images/gallery/bahia-palace-arabic-calligraphy-stucco-zellige-courtyard.jpg',
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
  const post = await prisma.blogPost.findUnique({ where: { slug_locale: { slug, locale } } });
  if (!post) return {};

  const title       = post.seoTitle ?? post.title;
  const description = post.seoDesc  ?? post.excerpt ?? undefined;
  const ogImg       = post.ogImage  ?? post.coverImage ?? CATEGORY_IMAGES[post.category];
  const canonical   = `${BASE}/${locale}/blog/${slug}`;

  return {
    title:       `${title} — Bahia Palace Tickets`,
    description,
    alternates:  { canonical },
    openGraph: {
      title,
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
      title,
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
  const post = await prisma.blogPost.findUnique({
    where: { slug_locale: { slug, locale } },
  });
  if (!post || !post.published) notFound();

  const t   = await getTranslations('blog');
  const tb  = await getTranslations('breadcrumb');

  const imgSrc   = post.coverImage ?? CATEGORY_IMAGES[post.category] ?? CATEGORY_IMAGES['visit-tips'];
  const catLabel = t(`categories.${post.category}` as any) as string;
  const mins     = readTime(post.content);

  const safeContent = post.content ?? '';

  const related = await prisma.blogPost.findMany({
    where:   { locale, published: true, id: { not: post.id } },
    orderBy: { publishedAt: 'desc' },
    take: 2,
  });

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: imgSrc,
    author: { '@type': 'Organization', name: post.author },
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
    <div className="bg-[#FAF3E7] min-h-screen">
      <JsonLd data={articleSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <Image src={imgSrc} alt={post.title} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/20 to-[#3D2817]/90" />
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
            <div className="flex items-center gap-4 text-sm text-[#5C3D20] mb-8 pb-6 border-b border-[#E8D5B7] flex-wrap">
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
              className="prose prose-sm max-w-none mb-10 text-[#3D2817] leading-relaxed"
              style={{ fontSize: '1.05rem' }}
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />

            {/* Book CTA */}
            <div className="bg-[#C4452D] text-white rounded-xl p-6 text-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#C4452D] font-semibold px-6 py-3 rounded-lg hover:bg-[#FAF3E7] transition-colors"
              >
                {t('bookCta')} <ArrowRight size={14} />
              </a>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {related.length > 0 && (
              <div>
                <h3
                  className="text-lg font-bold text-[#3D2817] mb-4"
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
                        className="group flex gap-3 bg-white rounded-xl border border-[#E8D5B7] p-3 hover:border-[#C4452D]/30 transition-colors"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <Image src={relImg} alt={rel.title} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-semibold text-[#3D2817] leading-snug group-hover:text-[#C4452D] transition-colors line-clamp-2"
                            style={{ fontFamily: 'Cormorant Garamond, serif' }}
                          >
                            {rel.title}
                          </p>
                          <p className="text-xs text-[#5C3D20] mt-1 flex items-center gap-1">
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
