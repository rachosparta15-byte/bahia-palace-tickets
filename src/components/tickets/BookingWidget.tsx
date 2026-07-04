'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { getWhatsAppNumber, buildWhatsAppUrl } from '@/lib/whatsapp';
import { LeadButton } from '@/components/layout/LeadButton';
import { OFFICIAL_DOOR_PRICE_MAD, OFFICIAL_DOOR_PRICE_USD_APPROX, approxEUR } from '@/config/pricing';

interface BookingWidgetProps {
  price: number;
  slug: string;
  ticketName: string;
}

export function BookingWidget({ price, slug, ticketName }: BookingWidgetProps) {
  const t  = useTranslations('ticketDetail');
  const tt = useTranslations('tickets');

  const whatsappNumber = getWhatsAppNumber();
  const whatsappUrl = whatsappNumber
    ? buildWhatsAppUrl(whatsappNumber, t('whatsappMsg', { ticket: ticketName }))
    : null;

  return (
    <div className="bg-[#251A0F] rounded-2xl border border-[rgba(232,163,61,0.15)] shadow-[0_4px_24px_rgba(0,0,0,0.5)] overflow-hidden">

      {/* CTA banner */}
      <div className="bg-[#2E1F12] px-5 py-3.5 text-center">
        <p className="text-[#E8A33D] text-[11px] font-bold uppercase tracking-[0.2em] mb-0.5">
          ⚡ Don&apos;t waste 2 hours in line
        </p>
        <p className="text-white text-sm font-semibold leading-snug">
          Secure your entry now — walk straight in
        </p>
      </div>

      <div className="p-6">
        {/* Price */}
        <div className="mb-6 pb-5 border-b border-[rgba(232,163,61,0.15)]">
          <p className="text-xs text-[#C4A882] uppercase tracking-wide mb-1">{tt('from')}</p>
          <p className="text-4xl font-bold text-[#C4452D] leading-none tabular-nums lining-nums"
             style={{ fontFamily: 'var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif', fontVariantNumeric: 'lining-nums tabular-nums' }}>
            ${price}
            <span className="text-base font-normal text-[#C4A882] ml-1.5">/ €{approxEUR(price)}</span>
            <span className="text-sm font-normal text-[#C4A882] ml-1.5 block sm:inline">{tt('perPerson')}</span>
          </p>
        </div>

        {/* What you're paying for */}
        {slug === 'skip-the-line' && (
          <div className="mb-6 rounded-xl bg-[#2E1F12] border border-[rgba(232,163,61,0.15)] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#E8A33D] mb-2.5">
              What you&apos;re paying for
            </p>
            <div className="flex items-center justify-between text-xs text-[#C4A882] mb-1.5">
              <span>Official gate price</span>
              <span className="font-semibold text-[#F5E8CC]">{OFFICIAL_DOOR_PRICE_MAD} MAD (~${OFFICIAL_DOOR_PRICE_USD_APPROX})</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#C4A882] mb-2.5">
              <span>Our listed price</span>
              <span className="font-semibold text-[#8FA63C]">${price} — no fee added</span>
            </div>
            <p className="text-[11px] text-[#C4A882]/80 leading-relaxed border-t border-[rgba(232,163,61,0.12)] pt-2.5">
              Same price as the gate. What you get for using this site: verified visitor info, a pre-booking link so you skip the 30–45 min door queue, and WhatsApp support — not a markup.
            </p>
          </div>
        )}

        {/* Booking CTA */}
        <LeadButton
          ticketType={slug}
          ctaLocation="booking_widget"
          className="flex items-center justify-center gap-2 w-full bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold py-3.5 rounded-xl transition-colors mb-3 text-sm"
        >
          {t('proceedToCheckout')}
        </LeadButton>

        <p className="text-center text-xs text-[#C4A882] mb-5">
          🔒 Free to use — official tickets only
        </p>

        {/* Trust badges */}
        <div className="space-y-1.5 mb-5">
          {([t('instantConfirm'), t('freeCancelNote'), t('mobileTicket')] as string[]).map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-[#C4A882]">
              <CheckCircle2 size={13} className="text-[#8FA63C] shrink-0" />
              {item}
            </div>
          ))}
        </div>

        {/* WhatsApp — hidden until a real number is configured */}
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[#25D366] font-semibold hover:underline"
          >
            <MessageCircle size={15} />
            {t('whatsappCta')}
          </a>
        )}
      </div>
    </div>
  );
}
