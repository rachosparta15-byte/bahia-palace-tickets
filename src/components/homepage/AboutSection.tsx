import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { OrnamentDivider } from '@/components/ui/ZelligePattern';
import Image from 'next/image';

export function AboutSection() {
  const t = useTranslations('about');

  return (
    <section className="py-20 bg-[#FAF3E7] zellige-bg">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text */}
          <div>
            <OrnamentDivider />
            <h2
              className="text-[#3D2817] mt-6 mb-5"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
            >
              {t('title')}
            </h2>
            <p className="text-[#5C3D20] leading-relaxed mb-6 text-base">{t('body')}</p>
            <Link href="/blog" className="inline-flex items-center gap-2 text-[#C4452D] font-semibold hover:gap-3 transition-all">
              {t('readMore')}
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Image */}
          {/* REPLACE with actual Bahia Palace photo */}
          <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/images/gallery/bahia-palace-arabic-calligraphy-stucco-zellige-courtyard.jpg"
              alt="Bahia Palace intricate zellige tiles and carved stucco — Marrakech"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D2817]/30 to-transparent" />
            {/* Decorative frame corner */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#E8A33D] opacity-70" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#E8A33D] opacity-70" />
          </div>
        </div>
      </div>
    </section>
  );
}
