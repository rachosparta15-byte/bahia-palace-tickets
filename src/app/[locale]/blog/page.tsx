import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { LeadButton } from '@/components/layout/LeadButton';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { Clock, ArrowRight } from 'lucide-react';
import prisma from '@/lib/db';
import { getBlogPosts } from '@/lib/blog';
import type { Metadata } from 'next';
import { buildAlternates, buildOG } from '@/lib/seo';

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: string }>;
}

const BLOG_TITLES: Record<string, string> = {
  en: 'Marrakech & Bahia Palace Blog | Travel Guide 2026',
  fr: 'Blog Palais Bahia | Guide Voyage Marrakech 2026',
  it: 'Blog Palazzo Bahia | Guida Viaggio Marrakech 2026',
  de: 'Bahia Palast Blog | Marrakesch Reiseführer 2026',
  es: 'Blog Palacio Bahia | Guía Viaje Marrakech 2026',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const title = BLOG_TITLES[locale] ?? BLOG_TITLES.en;
  const description = t('subtitle') as string;
  return {
    title,
    description,
    alternates: buildAlternates(locale, '/blog'),
    openGraph: buildOG(title, description, locale, '/blog'),
  };
}

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

type PostRow = {
  id: string;
  slug: string;
  category: string;
  coverImage: string | null;
  content: string | null;
  readTime?: number;
  title: string;
  excerpt: string | null;
};

function readTime(post: PostRow): number {
  if (post.readTime != null) return post.readTime;
  if (!post.content) return 1;
  return Math.max(1, Math.round(post.content.split(/\s+/).length / 200));
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;
  const t  = await getTranslations('blog');
  const tb = await getTranslations('breadcrumb');

  const dbPosts = await prisma.blogPost.findMany({
    where:   { locale, published: true },
    orderBy: { publishedAt: 'desc' },
  });

  const posts: PostRow[] = dbPosts.length > 0
    ? dbPosts
    : getBlogPosts(locale).map(p => ({
        id:        p.slug,
        slug:      p.slug,
        category:  p.category,
        coverImage: null,
        content:   null,
        readTime:  p.readTime,
        title:     p.title,
        excerpt:   p.excerpt,
      }));

  const REDIRECTED_SLUGS = new Set([
    'how-to-get-to-bahia-palace',
    'history-of-bahia-palace',
    'marrakech-tourist-scams-guide',
  ]);
  const filteredPosts = posts.filter(p => !REDIRECTED_SLUGS.has(p.slug));

  return (
    <div className="min-h-screen bg-[#1C1108]">
      <div className="bg-[#251A0F] border-b border-[rgba(232,163,61,0.15)] text-white px-6 py-14 md:px-10">
        <div className="max-w-5xl mx-auto">
          <Breadcrumb variant="light" items={[
            { label: tb('home'), href: '/' },
            { label: tb('blog') },
          ]} />
          <h1
            className="mt-6 font-bold text-white"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
          >
            {t('title')}
          </h1>
          <p className="mt-2 text-white/75 text-lg max-w-2xl">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {filteredPosts.length === 0 ? (
          <p className="text-[#C4A882] text-center py-16">Articles coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              const catLabel = t(`categories.${post.category}` as any) as string;
              const imgSrc   = post.coverImage ?? CATEGORY_IMAGES[post.category] ?? CATEGORY_IMAGES['visit-tips'];
              const mins     = readTime(post);
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}` as any}
                  className="group moroccan-card overflow-hidden flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={imgSrc}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#C4452D] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        {catLabel}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 text-xs text-[#C4A882] mb-3">
                      <Clock size={12} />
                      {t('readTime', { min: mins })}
                    </div>
                    <h2
                      className="font-bold text-[#F5E8CC] mb-2 leading-snug group-hover:text-[#E8A33D] transition-colors"
                      style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem' }}
                    >
                      {post.title}
                    </h2>
                    <p className="text-sm text-[#C4A882] leading-relaxed flex-1">{post.excerpt}</p>
                    <div className="flex items-center gap-1.5 text-sm text-[#C4452D] font-semibold mt-4">
                      {t('readMore')} <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-16 bg-[#C4452D] rounded-2xl p-8 text-center text-white">
          <LeadButton
            ticketType="skip-the-line"
            ctaLocation="blog_index"
            className="inline-flex items-center gap-2 bg-white text-[#C4452D] font-semibold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-colors"
          >
            {t('bookCta')}
          </LeadButton>
        </div>
      </div>
    </div>
  );
}
