import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

/**
 * SWITCHING VARIANTS
 * In src/app/[locale]/layout.tsx, change the prop:
 *   <VideoPromoBar variant="A" />   ← gold gradient + gold-ring play icon
 *   <VideoPromoBar variant="B" />   ← dark luxe (near-black + gold text)
 *   <VideoPromoBar variant="C" />   ← gold gradient + zellige watermark
 * Default is "A" — no prop needed for variant A.
 */
type Variant = 'A' | 'B' | 'C';
interface Props { variant?: Variant }

const CONFIG = {
  A: {
    bar:    'vpb-bar vpb-a fixed top-20 left-0 right-0 z-[49] h-10 flex items-center overflow-hidden',
    link:   'flex items-center justify-center gap-2.5 w-full h-full text-[#2A1408] font-semibold text-[13px] hover:bg-black/[0.06] transition-colors',
    circle: 'vpb-play flex items-center justify-center w-5 h-5 rounded-full bg-[#2A1408]/70 border border-white/50 shrink-0',
    fill:   'white',
  },
  B: {
    bar:    'vpb-bar vpb-b fixed top-20 left-0 right-0 z-[49] h-10 flex items-center overflow-hidden',
    link:   'flex items-center justify-center gap-2.5 w-full h-full text-[#F0C048] font-semibold text-[13px] hover:bg-white/[0.05] transition-colors',
    circle: 'vpb-play flex items-center justify-center w-5 h-5 rounded-full bg-[#E8A33D] shrink-0 shadow-[0_0_8px_rgba(232,163,61,0.45)]',
    fill:   '#1A0E06',
  },
  C: {
    bar:    'vpb-bar vpb-c fixed top-20 left-0 right-0 z-[49] h-10 flex items-center overflow-hidden',
    link:   'flex items-center justify-center gap-2.5 w-full h-full text-[#2A1408] font-semibold text-[13px] hover:bg-black/[0.06] transition-colors',
    circle: 'vpb-play flex items-center justify-center w-5 h-5 rounded-full bg-[#2A1408]/70 border border-white/50 shrink-0',
    fill:   'white',
  },
} as const;

export async function VideoPromoBar({ variant = 'A' }: Props) {
  const t = await getTranslations('videos');
  const c = CONFIG[variant];
  return (
    <div className={c.bar}>
      <Link href="/videos" className={c.link}>
        <div className={c.circle}>
          <svg viewBox="0 0 24 24" fill={c.fill} className="w-2.5 h-2.5 ml-px" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span style={{ letterSpacing: '0.1em' }}>{t('promoBar')}</span>
      </Link>
    </div>
  );
}
