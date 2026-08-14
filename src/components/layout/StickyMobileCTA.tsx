'use client';

import { useTranslations } from 'next-intl';
import { Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LeadButton } from './LeadButton';
import { buyingPathPriceLabel } from '@/config/pricing';

export function StickyMobileCTA() {
  const t = useTranslations('cta');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const anchor = document.getElementById('ticket-book-btn');
    if (!anchor) {
      setShow(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed left-0 right-0 z-[47] sm:hidden bg-[#251A0F] border-t border-[rgba(232,163,61,0.15)] px-4 pt-3 pb-3 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] transition-transform duration-300 ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ bottom: 'calc(56px + env(safe-area-inset-bottom, 0px))' }}
    >
      <LeadButton
        ticketType="skip-the-line"
        ctaLocation="sticky_mobile"
        className="btn-primary w-full justify-center gap-2 min-h-[48px]"
      >
        <Ticket size={18} />
        {/* The figure comes from pricing.ts, not from the message file. It used
            to be typed into all seven translations, which is exactly what
            pricing.ts warns against: the constant changes and the bar goes on
            advertising last month's price in six languages. */}
        {t('stickyMobile', { price: buyingPathPriceLabel() })}
      </LeadButton>
    </div>
  );
}
