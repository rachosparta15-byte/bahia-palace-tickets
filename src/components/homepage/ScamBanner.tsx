import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export function ScamBanner() {
  const t = useTranslations('scamBanner');

  return (
    <section className="bg-[#2E1F12] border-y border-[#E8A33D]/20">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex flex-wrap items-center justify-center gap-3 text-center sm:text-left">
          <AlertTriangle size={18} className="text-[#E8A33D] shrink-0" />
          <p className="text-sm text-[#C4A882]">{t('text')}</p>
          <Link
            href="/safety"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C4452D] hover:text-[#D96048] hover:underline transition-colors"
          >
            {t('link')}
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
