import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function VideoPromoBar() {
  const t = await getTranslations('videos');
  return (
    <div className="vpb-bar fixed top-20 left-0 right-0 z-[49] h-10 bg-[#E8A33D] flex items-center overflow-hidden">
      <Link
        href="/videos"
        className="flex items-center justify-center gap-2.5 w-full h-full text-[#3D2817] font-semibold text-sm hover:bg-[#d4922a] transition-colors"
      >
        <div className="vpb-play flex items-center justify-center w-5 h-5 rounded-full bg-[#3D2817] shrink-0">
          <svg
            viewBox="0 0 24 24"
            fill="white"
            className="w-2.5 h-2.5 ml-px"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span>{t('promoBar')}</span>
      </Link>
    </div>
  );
}
