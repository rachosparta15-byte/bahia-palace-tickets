import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { BOOKING_URL } from '@/lib/booking';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { Clock, ArrowRight } from 'lucide-react';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import { buildAlternates, buildOG } from '@/lib/seo';

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const title = `${t('title')} — Bahia Palace Tickets`;
  const description = t('subtitle') as string;
  return {
    title,
    description,
    alternates: buildAlternates(locale, '/blog'),
    openGraph: buildOG(title, description, locale, '/blog'),
  };
}

const CATEGORY_IMAGES: Record<string, string> = {
  'visit-tips': 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=75',
  'history':    'https://images.unsplash.com/photo-1560148218-1a83060f7b32?w=800&q=75',
  'safety':     'https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=800&q=75',
  'practical':  'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=75',
  'comparisons':'https://images.unsplash.com/photo-1559386455-0673430b28c8?w=800&q=75',
};

function readTime(content: string | null): number {
  if (!content) return 1;
  return Math.max(1, Math.round(content.split(/\s+/).length / 200));
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;
  const t  = await getTranslations('blog');
  const tb = await getTranslations('breadcrumb');

  const posts = await prisma.blogPost.findMany({
    where:   { locale, published: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="bg-[#FAF3E7] min-h-screen">
      <div className="bg-[#3D2817] text-white px-6 py-14 md:px-10">
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
        {posts.length === 0 ? (
          <p className="text-[#5C3D20] text-center py-16">Articles coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => {
              const catLabel = t(`categories.${post.category}` as any) as string;
              const imgSrc   = post.coverImage ?? CATEGORY_IMAGES[post.category] ?? CATEGORY_IMAGES['visit-tips'];
              const mins     = readTime(post.content);
              return (
                <Link
                  key={post.id}
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
                    <div className="flex items-center gap-1.5 text-xs text-[#5C3D20] mb-3">
                      <Clock size={12} />
                      {t('readTime', { min: mins })}
                    </div>
                    <h2
                      className="font-bold text-[#3D2817] mb-2 leading-snug group-hover:text-[#C4452D] transition-colors"
                      style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem' }}
                    >
                      {post.title}
                    </h2>
                    <p className="text-sm text-[#5C3D20] leading-relaxed flex-1">{post.excerpt}</p>
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
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#C4452D] font-semibold px-8 py-3.5 rounded-xl hover:bg-[#FAF3E7] transition-colors"
          >
            {t('bookCta')}
          </a>
        </div>
      </div>
    </div>
  );
}
