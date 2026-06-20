import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Clock } from 'lucide-react';
import { OrnamentDivider } from '@/components/ui/ZelligePattern';
import { getBlogPosts } from '@/lib/blog';

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  'visit-tips':  { en: 'Visit Tips', fr: 'Conseils visite', it: 'Consigli', de: 'Besuchstipps', es: 'Consejos' },
  'history':     { en: 'History',    fr: 'Histoire',       it: 'Storia',    de: 'Geschichte',  es: 'Historia' },
  'safety':      { en: 'Safety',     fr: 'Sécurité',       it: 'Sicurezza', de: 'Sicherheit',  es: 'Seguridad' },
  'practical':   { en: 'Practical',  fr: 'Pratique',       it: 'Pratico',   de: 'Praktisch',   es: 'Práctico' },
  'comparisons': { en: 'Compare',    fr: 'Comparatif',     it: 'Confronto', de: 'Vergleich',   es: 'Comparar' },
};

export function BlogPreview() {
  const t = useTranslations('blogPreview');
  const locale = useLocale();
  const posts = getBlogPosts(locale).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-12 section-head">
          <OrnamentDivider />
          <h2
            className="text-[#3D2817] mt-6 mb-4"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[#5C3D20] max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E8D5B5] hover:shadow-lg transition-shadow"
            >
              <div className="p-6 flex flex-col flex-1">
                <span className="inline-block text-xs font-semibold uppercase tracking-wide text-[#C4452D] mb-3">
                  {CATEGORY_LABELS[post.category]?.[locale] ?? post.category}
                </span>
                <h3
                  className="text-[#3D2817] font-semibold mb-3 leading-snug group-hover:text-[#C4452D] transition-colors flex-1"
                  style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}
                >
                  {post.title}
                </h3>
                <p className="text-[#5C3D20] text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#8B6B4A] mt-auto">
                  <Clock size={12} />
                  <span>{post.readTime} {t('minRead')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#C4452D] font-semibold hover:gap-3 transition-all"
          >
            {t('viewAll')}
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}
