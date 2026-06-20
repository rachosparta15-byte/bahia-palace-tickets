import { getTranslations } from 'next-intl/server';
import { Star, ExternalLink } from 'lucide-react';
import { OrnamentDivider } from '@/components/ui/ZelligePattern';
import prisma from '@/lib/db';

const TRIPADVISOR_URL = 'https://www.tripadvisor.com/Attraction_Review-g293734-d317099-Reviews-Bahia_Palace-Marrakech_Marrakech_Safi.html';

export async function ReviewsCarousel() {
  const t = await getTranslations('reviews');

  let reviews: { id: string; authorName: string; country: string | null; rating: number; body: string }[] = [];
  try {
    reviews = await prisma.review.findMany({
      where: { published: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      select: { id: true, authorName: true, country: true, rating: true, body: true },
      take: 6,
    });
  } catch { /* DB unavailable — fall through to TripAdvisor CTA */ }

  // ── No verified reviews yet — show TripAdvisor CTA ──────────────
  if (reviews.length === 0) {
    return (
      <section className="py-20 bg-[#3D2817]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <OrnamentDivider label="" />
          <h2
            className="text-white mt-6 mb-4"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[#C4A882] mb-8 max-w-xl mx-auto">
            {t('tripAdvisorPrompt')}
          </p>
          <div className="inline-flex flex-col items-center gap-4">
            {/* TripAdvisor star row */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={22} className="text-[#34E0A1] fill-[#34E0A1]" />
              ))}
            </div>
            <a
              href={TRIPADVISOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#34E0A1] hover:bg-[#2bc98e] text-[#1a1a1a] font-semibold px-7 py-3 rounded-full transition-colors text-sm"
            >
              <span className="font-bold">●</span>
              {t('tripAdvisorCta')}
              <ExternalLink size={14} />
            </a>
            <p className="text-[#5C3D20] text-xs">{t('tripAdvisorNote')}</p>
          </div>
        </div>
      </section>
    );
  }

  // ── Verified reviews from DB ─────────────────────────────────────
  return (
    <section className="py-20 bg-[#3D2817] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <OrnamentDivider label="" />
          <h2
            className="text-white mt-6 mb-3"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[#C4A882]">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reviews.map((review) => {
            const initials = review.authorName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
            return (
              <div
                key={review.id}
                className="bg-[#5C3D20]/30 rounded-2xl p-4 sm:p-6 border border-[#5C3D20] relative"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-[#E8A33D] fill-[#E8A33D]" />
                  ))}
                </div>
                <p className="text-[#E8D5B7] text-sm leading-relaxed mb-5 italic">&ldquo;{review.body}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C4452D]/20 flex items-center justify-center text-sm font-semibold text-[#E8A33D]">
                    {initials}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{review.authorName}</p>
                    {review.country && <p className="text-[#C4A882] text-xs">{review.country}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <a
            href={TRIPADVISOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#C4A882] hover:text-white text-sm font-medium transition-colors border border-[#5C3D20] hover:border-[#C4A882] px-5 py-2.5 rounded-full"
          >
            <span className="text-[#34E0A1] font-bold text-xs">●</span>
            {t('seeAllOnTripAdvisor')}
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}
