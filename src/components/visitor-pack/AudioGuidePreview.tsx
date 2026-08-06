import { getTranslations } from 'next-intl/server';
import { Headphones, Play, Lock } from 'lucide-react';
import { OrnamentDivider } from '@/components/ui/ZelligePattern';

/**
 * Audio-guide preview section.
 *
 * TODO(audio): no audio has been recorded yet. This renders the chapter list
 * and a DISABLED play control — deliberately not a fake player, because a
 * play button that does nothing (or plays silence) reads as a broken product
 * rather than an unfinished one.
 *
 * To wire up for real:
 *   1. Put the sample clip at /public/audio/preview-grand-courtyard.mp3
 *   2. Replace the disabled control with an <audio controls preload="none">
 *   3. Per-locale clips: /public/audio/{locale}/… and pick by `locale`.
 */

// PLACEHOLDER — chapter titles are indicative of planned content, not a
// recorded product. Replace with the real chapter list before launch.
const PLACEHOLDER_CHAPTERS = [
  { n: 1, title: 'Arrival & the Marble Courtyard', duration: '4:12' },
  { n: 2, title: 'The Grand Courtyard', duration: '6:30' },
  { n: 3, title: 'The Harem Quarters', duration: '5:48' },
  { n: 4, title: 'Painted Ceilings & Zellige', duration: '7:05' },
  { n: 5, title: 'The Private Riad Gardens', duration: '3:54' },
] as const;

export async function AudioGuidePreview({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'visitorPack.audioPreview' });

  return (
    <section className="py-20 bg-[#251A0F]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <OrnamentDivider />
          <h2
            className="text-[#F5E8CC] mt-6"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[#C4A882] mt-3 max-w-xl mx-auto leading-relaxed">{t('subtitle')}</p>
        </div>

        <div className="bg-[#2E1F12] border border-[rgba(232,163,61,0.18)] rounded-2xl p-6 sm:p-8">
          {/* Disabled player — see TODO(audio) above. */}
          <div className="flex items-center gap-4 pb-6 border-b border-[rgba(232,163,61,0.15)]">
            <div
              className="w-14 h-14 rounded-full bg-[#3D2817] border border-[rgba(232,163,61,0.25)] flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <Play size={20} className="text-[#C4A882] ms-0.5" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#F5E8CC] flex items-center gap-2">
                <Headphones size={15} className="text-[#E8A33D] shrink-0" />
                {PLACEHOLDER_CHAPTERS[1].title}
              </p>
              <p className="text-sm text-[#C4A882] mt-1 flex items-center gap-1.5">
                <Lock size={12} aria-hidden="true" />
                {t('unavailable')}
              </p>
            </div>
          </div>

          <p className="text-xs uppercase tracking-wider text-[#C4A882] font-semibold mt-6 mb-3">
            {t('chapters')}
          </p>
          <ol className="space-y-2.5">
            {PLACEHOLDER_CHAPTERS.map((c) => (
              <li key={c.n} className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-[#F5E8CC]">
                  <span className="text-[#E8A33D] font-semibold me-2.5 tabular-nums">
                    {String(c.n).padStart(2, '0')}
                  </span>
                  {c.title}
                </span>
                <span className="text-[#C4A882] tabular-nums shrink-0">{c.duration}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
