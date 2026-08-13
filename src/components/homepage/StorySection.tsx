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

        {/*
         * Upright, not italic.
         *
         * A full paragraph of italic display serif is what made this hard to
         * read — not its colour, which measured 8.18:1 against this background
         * and already passed AAA. Italic is for the pull-quote this looks like,
         * not for the only piece of narrative on the page.
         *
         * fontWeight 300 went with it because it was never real: layout.tsx
         * loads Cormorant at 400 and 600 only, so the browser has been
         * rendering 400 here regardless.
         */}
        <p
          className="text-ivory leading-relaxed max-w-[65ch] mx-auto"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)',
            fontWeight: 400,
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
