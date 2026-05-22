'use client';

import { useTranslations, useLocale } from 'next-intl';
import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const t = useTranslations('whatsapp');
  const locale = useLocale();

  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '212600000000';
  const message = encodeURIComponent(t('message'));
  const href = `https://wa.me/${number}?text=${message}`;

  const handleClick = () => {
    // Fire analytics event
    if (typeof window !== 'undefined' && (window as any).__bpTrack) {
      (window as any).__bpTrack('whatsapp_click', { locale });
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label="Chat on WhatsApp"
      className="
        fixed bottom-[calc(6rem+env(safe-area-inset-bottom,0px))] right-5 z-[45]
        w-14 h-14 rounded-full
        bg-[#25D366] text-white
        flex items-center justify-center
        shadow-[0_4px_20px_rgba(37,211,102,0.4)]
        hover:scale-110 hover:shadow-[0_6px_28px_rgba(37,211,102,0.55)]
        transition-all duration-200
        group
      "
    >
      <MessageCircle size={26} fill="white" strokeWidth={0} />
      <span className="
        absolute right-full mr-3 px-3 py-1.5 rounded-lg
        bg-[#3D2817] text-white text-sm font-medium whitespace-nowrap
        opacity-0 group-hover:opacity-100
        pointer-events-none transition-opacity duration-200
      ">
        {t('tooltip')}
      </span>
    </a>
  );
}
