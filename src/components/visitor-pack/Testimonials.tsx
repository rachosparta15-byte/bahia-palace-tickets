import { getTranslations } from 'next-intl/server';
import { Star, AlertTriangle } from 'lucide-react';
import { OrnamentDivider } from '@/components/ui/ZelligePattern';

/**
 * PLACEHOLDER — replace with real reviews before launch.
 *
 * These are NOT real customer reviews. They are deliberately written as
 * obvious layout filler rather than as plausible testimonials:
 *   - no invented full names (a fake "Sarah M., London" is a fabricated
 *     endorsement, and reads as real the moment the banner is removed)
 *   - no invented dates or trip details
 *   - a visible on-page notice, not just this comment
 *
 * Publishing fabricated reviews is illegal in the EU/UK (unfair commercial
 * practices) and under the FTC's rule on consumer reviews in the US, so the
 * failure mode of "we forgot to swap these out" must be embarrassing and
 * obvious, never quietly convincing.
 *
 * When real reviews exist: delete PLACEHOLDER_REVIEWS, delete the notice
 * banner, and source from the existing `Review` model used by the homepage
 * ReviewsCarousel.
 */
const PLACEHOLDER_REVIEWS = [
  {
    id: 1,
    label: 'Sample review 1',
    body: 'Placeholder review text. This block shows how a three-line customer review will sit in the layout once real reviews are collected.',
  },
  {
    id: 2,
    label: 'Sample review 2',
    body: 'Placeholder review text. Replace this with a verified review before launch — see the comment in Testimonials.tsx.',
  },
  {
    id: 3,
    label: 'Sample review 3',
    body: 'Placeholder review text. No real customer has said this. Layout filler only.',
  },
] as const;

export async function Testimonials({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'visitorPack.testimonials' });

  return (
    <section className="py-20 bg-[#1C1108]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-8">
          <OrnamentDivider />
          <h2
            className="text-[#F5E8CC] mt-6"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}
          >
            {t('title')}
          </h2>
        </div>

        {/* Visible placeholder notice — must be removed together with the data. */}
        <div
          role="note"
          className="flex items-center justify-center gap-2.5 mb-8 mx-auto max-w-2xl rounded-lg border border-dashed border-[#E8A33D]/50 bg-[#2E1F12]/60 px-4 py-3"
        >
          <AlertTriangle size={15} className="shrink-0 text-[#E8A33D]" aria-hidden="true" />
          <p className="text-xs sm:text-sm text-[#E8C88A] font-medium text-center">
            {t('placeholderNotice')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLACEHOLDER_REVIEWS.map((r) => (
            <figure
              key={r.id}
              className="rounded-2xl border border-dashed border-[rgba(232,163,61,0.30)] bg-[#251A0F] p-6"
            >
              <div className="flex gap-0.5 mb-3" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="text-[#C4A882]/40" />
                ))}
              </div>
              <blockquote className="text-sm text-[#C4A882] leading-relaxed italic">
                {r.body}
              </blockquote>
              <figcaption className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#C4A882]/60">
                {r.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
