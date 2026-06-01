import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Accordion } from '@/components/ui/Accordion';
import { OrnamentDivider } from '@/components/ui/ZelligePattern';
import { ArrowRight } from 'lucide-react';

export function FaqSection() {
  const t = useTranslations('faq');
  const items = t.raw('items') as { question: string; answer: string }[];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <OrnamentDivider />
          <h2
            className="text-[#3D2817] mt-6"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
          >
            {t('title')}
          </h2>
        </div>
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 text-sm text-amber-800">
          <strong>⚠️ Note (May 2026):</strong> Part of Bahia Palace is currently under renovation. Some rooms may be inaccessible. Main courtyards remain open.
        </div>
        <Accordion items={items} />
        <div className="mt-8 text-center">
          <Link href="/faq" className="inline-flex items-center gap-2 text-[#C4452D] font-semibold hover:gap-3 transition-all">
            {t('viewAll')}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
