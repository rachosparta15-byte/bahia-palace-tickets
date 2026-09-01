'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { getWhatsAppNumber, buildWhatsAppUrl } from '@/lib/whatsapp';
import { LeadButton } from '@/components/layout/LeadButton';
import { usePaymentsFlags } from '@/components/layout/PaymentsFlagsProvider';
import { OFFICIAL_DOOR_PRICE_MAD, OFFICIAL_DOOR_PRICE_EUR_CENTS, formatEUR } from '@/config/pricing';

interface BookingWidgetProps {
  price: number;
  slug: string;
  ticketName: string;
}

export function BookingWidget({ price, slug, ticketName }: BookingWidgetProps) {
  const t  = useTranslations('ticketDetail');
  const tt = useTranslations('tickets');
  // OFF → portal hand-off, so the gate-price breakdown below is the honest
  // thing to show. ON → the paid pack, where a zero-margin breakdown would be
  // false. One flag, shared with the funnel.
  //
  // Note the flag no longer licenses "free to use" in the off branch: the same
  // site sells packages above the gate price and carries paid partner links, so
  // that claim is untrue of the site regardless of what this page hands off to.
  const { enabled: paymentsEnabled } = usePaymentsFlags();

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
            €{price.toFixed(2)}
            <span className="text-sm font-normal text-[#C4A882] ms-1.5 block sm:inline">{tt('perPerson')}</span>
          </p>
        </div>

        {/* What you're paying for — the "same price as the gate, no fee added"
            breakdown is only true on the free hand-off (payments OFF). Once
            payments are on this page's product is the paid pack, so hide it
            rather than assert a zero margin that no longer exists. */}
        {slug === 'skip-the-line' && !paymentsEnabled && (
          <div className="mb-6 rounded-xl bg-[#2E1F12] border border-[rgba(232,163,61,0.15)] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#E8A33D] mb-2.5">
              What you&apos;re paying for
            </p>
            <div className="flex items-center justify-between text-xs text-[#C4A882] mb-1.5">
              <span>Official gate price</span>
              <span className="font-semibold text-[#F5E8CC]">{OFFICIAL_DOOR_PRICE_MAD} MAD ({formatEUR(OFFICIAL_DOOR_PRICE_EUR_CENTS)})</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#C4A882] mb-2.5">
              <span>Our price, all in</span>
              <span className="font-semibold text-[#8FA63C]">€{price.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-[#C4A882]/80 leading-relaxed border-t border-[rgba(232,163,61,0.12)] pt-2.5">
              We charge more than the gate, and here is exactly what the difference buys: we queue and buy the ticket for you, you get an audio guide in your own language, WhatsApp support before and during the visit, and free cancellation until we send your code. You can always buy at the gate for {OFFICIAL_DOOR_PRICE_MAD} MAD instead — in cash, in dirhams, in the queue.
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

        {/* "Free to use" used to sit here, directly under a panel headed
            "What you're paying for" that opens "We charge more than the gate".
            One of those two had to go, and it was not the honest one. */}
        <p className="text-center text-xs text-[#C4A882] mb-5">
          {paymentsEnabled
            ? '🔒 Official ticket included · free cancellation'
            : '🔒 Official tickets — we hand you to the Ministry portal'}
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
