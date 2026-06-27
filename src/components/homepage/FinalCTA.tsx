import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { ZelligePattern } from '@/components/ui/ZelligePattern';
import { LeadButton } from '@/components/layout/LeadButton';

export function FinalCTA() {
  const t = useTranslations('cta');

  return (
    <section className="relative py-24 bg-[#160D06] overflow-hidden">
      {/* Zellige accent patterns */}
      <ZelligePattern className="absolute top-6 left-8 w-28 h-28 text-[#E8A33D]/12 hidden lg:block" />
      <ZelligePattern className="absolute bottom-6 right-8 w-28 h-28 text-[#E8A33D]/12 hidden lg:block" />
      <ZelligePattern className="absolute top-1/2 left-1/4 -translate-y-1/2 w-20 h-20 text-[#E8A33D]/06 hidden xl:block" />

      {/* Brass top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8A33D]/35 to-transparent" />

      {/* Palm silhouette accent — pure SVG, aria-hidden */}
      <svg
        className="absolute right-12 top-8 w-16 h-24 opacity-[0.07] hidden lg:block"
        viewBox="0 0 60 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M30 90 L30 45" stroke="#E8A33D" strokeWidth="3" strokeLinecap="round"/>
        <path d="M30 55 Q18 40 8 30 Q14 38 20 50" stroke="#E8A33D" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M30 50 Q42 35 52 25 Q46 33 38 45" stroke="#E8A33D" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M30 45 Q20 28 12 15 Q18 25 24 38" stroke="#E8A33D" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M30 42 Q40 25 48 12 Q42 22 36 35" stroke="#E8A33D" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M30 90 Q28 95 30 100 Q32 95 30 90" stroke="#E8A33D" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Cormorant Garamond display heading for maximum elegance */}
        <h2
          className="text-[#F5E8CC] mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            lineHeight: 1.15,
            letterSpacing: '0.01em',
          }}
        >
          {t('title')}
        </h2>
        <p className="text-[#C4A882] text-lg mb-8">{t('subtitle')}</p>
        <LeadButton
          ticketType="skip-the-line"
          ctaLocation="final_cta"
          className="inline-flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold text-base px-8 py-4 rounded-lg transition-all shadow-[0_4px_20px_rgba(196,69,45,0.45)] hover:shadow-[0_6px_28px_rgba(196,69,45,0.60)] hover:-translate-y-0.5"
        >
          {t('button')}
          <ArrowRight size={18} />
        </LeadButton>
      </div>
    </section>
  );
}
