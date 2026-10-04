import { useTranslations } from 'next-intl';
import { ModeText } from '@/components/layout/ModeText';
import { CheckCircle, Ban, Smartphone, ShieldCheck } from 'lucide-react';

export function TrustStrip() {
  const t = useTranslations('trustStrip');

  const items = [
    { icon: CheckCircle, label: t('instantConfirm'), color: '#8FA63C' },
    { icon: Ban,         label: t('freeCancel'),     color: '#3B65C8' },
    { icon: Smartphone,  label: t('mobileTicket'),   color: '#C4452D' },
    { icon: ShieldCheck, label: t('secureBooking'),  color: '#8FA63C' },
  ];

  return (
    <section className="bg-[#251A0F] border-y border-[rgba(232,163,61,0.15)] py-3 relative">
      <div className="absolute end-0 top-0 bottom-0 w-10 bg-linear-to-l from-[#251A0F] to-transparent z-10 pointer-events-none sm:hidden rtl:bg-linear-to-r" />

      <div
        className="flex items-center gap-2.5 overflow-x-auto px-4 max-w-6xl mx-auto sm:justify-center"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map(({ icon: Icon, label, color }, i) => {
          const item = (
            <div key={i} className="contents">
              <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-medium text-[#F5E8CC]">
                <Icon size={12} style={{ color }} className="shrink-0" />
                <span className="whitespace-nowrap">{label}</span>
              </div>
              {i < items.length - 1 && (
                <div className="w-px h-3 bg-[rgba(232,163,61,0.20)] shrink-0" />
              )}
            </div>
          );
          // Item 1 is "free cancel": not true of GetYourGuide's ticket, so it
          // is left out while every button goes there.
          return i === 1 ? <ModeText key={i} normal={item} gyg={null} /> : item;
        })}
      </div>
    </section>
  );
}
