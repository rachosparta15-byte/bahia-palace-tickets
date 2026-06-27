import { useTranslations } from 'next-intl';
import { Clock, MapPin, Ticket } from 'lucide-react';

export function PracticalBar() {
  const t = useTranslations('practicalBar');

  return (
    <div className="bg-[#0F0804] border-y border-[#E8A33D]/10">
      <div className="max-w-5xl mx-auto px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 text-sm">
          {/* Hours */}
          <div className="flex items-center gap-2.5">
            <Clock size={15} className="text-[#E8A33D] shrink-0" />
            <span className="text-[#C4A882]">
              <span className="text-[#9A8060] mr-1">{t('hoursLabel')}:</span>
              <span className="text-[#F5E8CC] font-medium">{t('hoursVal')}</span>
            </span>
          </div>

          {/* Separator */}
          <div className="hidden sm:block w-px h-4 bg-[#E8A33D]/15" />

          {/* Price */}
          <div className="flex items-center gap-2.5">
            <Ticket size={15} className="text-[#E8A33D] shrink-0" />
            <span className="text-[#C4A882]">
              <span className="text-[#9A8060] mr-1">{t('priceLabel')}:</span>
              <span className="text-[#F5E8CC] font-medium">{t('priceVal')}</span>
            </span>
          </div>

          {/* Separator */}
          <div className="hidden sm:block w-px h-4 bg-[#E8A33D]/15" />

          {/* Location */}
          <div className="flex items-center gap-2.5">
            <MapPin size={15} className="text-[#E8A33D] shrink-0" />
            <span className="text-[#C4A882]">
              <span className="text-[#9A8060] mr-1">{t('locationLabel')}:</span>
              <span className="text-[#F5E8CC] font-medium">{t('locationVal')}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
