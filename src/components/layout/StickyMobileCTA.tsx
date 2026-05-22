import { useTranslations } from 'next-intl';
import { Ticket } from 'lucide-react';
import { BOOKING_URL } from '@/lib/booking';

export function StickyMobileCTA() {
  const t = useTranslations('cta');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white border-t border-[#E8D5B7] px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_20px_rgba(61,40,23,0.1)]">
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary w-full justify-center gap-2 min-h-[48px]"
      >
        <Ticket size={18} />
        {t('stickyMobile')}
      </a>
    </div>
  );
}
