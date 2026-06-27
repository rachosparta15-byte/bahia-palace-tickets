import { useTranslations } from 'next-intl';
import { ZelligePattern } from '@/components/ui/ZelligePattern';

export function StorySection() {
  const t = useTranslations('story');

  return (
    <section className="relative bg-[#1C1108] py-16 sm:py-20 overflow-hidden">
      {/* Subtle zellige accent */}
      <ZelligePattern className="absolute top-4 right-8 w-24 h-24 text-[#E8A33D]/08 hidden lg:block" />

      {/* Thin gold top rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8A33D]/25 to-transparent" />

      <div className="max-w-3xl mx-auto px-6 text-center">
        {/* Ornamental divider */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#E8A33D]/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#E8A33D]/60" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#E8A33D]/50" />
        </div>

        <p
          className="text-[#C4A882] leading-relaxed"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)',
            fontStyle: 'italic',
            fontWeight: 300,
            lineHeight: 1.75,
          }}
        >
          {t('body')}
        </p>

        {/* Bottom ornamental divider */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#E8A33D]/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#E8A33D]/60" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#E8A33D]/50" />
        </div>
      </div>
    </section>
  );
}
