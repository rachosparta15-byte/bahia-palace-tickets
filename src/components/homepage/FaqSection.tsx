import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Accordion } from '@/components/ui/Accordion';
import { OrnamentDivider } from '@/components/ui/ZelligePattern';
import { ArrowRight } from 'lucide-react';

export function FaqSection() {
  const t = useTranslations('faq');
  const items = t.raw('items') as { question: string; answer: string }[];

  return (
    <section className="py-20 bg-[#1C1108]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <OrnamentDivider />
          <h2
            className="text-[#F5E8CC] mt-6"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
          >
            {t('title')}
          </h2>
        </div>
        <Accordion items={items} />
        <div className="mt-8 text-center">
          <Link href="/faq" className="inline-flex items-center gap-2 text-[#E8A33D] font-semibold hover:gap-3 transition-all hover:text-[#F5C96A]">
            {t('viewAll')}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
