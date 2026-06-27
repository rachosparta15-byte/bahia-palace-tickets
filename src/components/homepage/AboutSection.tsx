import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { OrnamentDivider } from '@/components/ui/ZelligePattern';
import Image from 'next/image';

export function AboutSection() {
  const t = useTranslations('about');

  return (
    <section className="py-20 tadelakt-bg">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text */}
          <div>
            <OrnamentDivider />
            <h2
              className="text-[#F5E8CC] mt-6 mb-5"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
            >
              {t('title')}
            </h2>
            <p className="text-[#C4A882] leading-relaxed mb-6 text-base">{t('body')}</p>
            <Link href="/blog" className="inline-flex items-center gap-2 text-[#E8A33D] font-semibold hover:gap-3 transition-all hover:text-[#F5C96A]">
              {t('readMore')}
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Image — Moorish arch frame */}
          <div className="relative">
            {/* Brass border ring behind the arch */}
            <div
              className="absolute inset-0 rounded-[50%_50%_6px_6px/40%_40%_6px_6px] border border-[rgba(232,163,61,0.30)] translate-x-2 translate-y-2"
              aria-hidden="true"
            />
            <div className="relative h-80 lg:h-96 overflow-hidden rounded-[50%_50%_6px_6px/40%_40%_6px_6px] shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
              <Image
                src="/images/gallery/bahia-palace-arabic-calligraphy-stucco-zellige-courtyard.jpg"
                alt="Bahia Palace intricate zellige tiles and carved stucco — Marrakech"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#160D06]/45 to-transparent" />
              {/* Gold corner accents */}
              <div className="absolute top-6 left-6 w-10 h-10 border-l-2 border-t-2 border-[#E8A33D]/60" aria-hidden="true" />
              <div className="absolute bottom-6 right-6 w-10 h-10 border-r-2 border-b-2 border-[#E8A33D]/60" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
