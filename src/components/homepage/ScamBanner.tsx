import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export function ScamBanner() {
  const t = useTranslations('scamBanner');

  return (
    <section className="bg-[#E8A33D]/10 border-y border-[#E8A33D]/30">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex flex-wrap items-center justify-center gap-3 text-center sm:text-left">
          <AlertTriangle size={18} className="text-[#C8882A] shrink-0" />
          <p className="text-sm text-[#5C3D20]">{t('text')}</p>
          <Link
            href="/safety"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C4452D] hover:underline"
          >
            {t('link')}
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
