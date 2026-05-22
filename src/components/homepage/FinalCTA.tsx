import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { BOOKING_URL } from '@/lib/booking';
import { ZelligePattern } from '@/components/ui/ZelligePattern';

export function FinalCTA() {
  const t = useTranslations('cta');

  return (
    <section className="relative py-24 bg-[#C4452D] overflow-hidden">
      {/* Decorative zellige patterns */}
      <ZelligePattern className="absolute top-6 left-8 w-24 h-24 text-white/10 hidden lg:block" />
      <ZelligePattern className="absolute bottom-6 right-8 w-24 h-24 text-white/10 hidden lg:block" />
      <ZelligePattern className="absolute top-1/2 left-1/4 -translate-y-1/2 w-16 h-16 text-white/5 hidden xl:block" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2
          className="text-white mb-4"
          style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          {t('title')}
        </h2>
        <p className="text-white/80 text-lg mb-8">{t('subtitle')}</p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-[#C4452D] font-semibold text-base px-8 py-4 rounded-lg hover:bg-[#FAF3E7] transition-colors shadow-lg"
        >
          {t('button')}
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
}
