import { useTranslations } from 'next-intl';
import { CheckCircle2, MessageCircle, ExternalLink } from 'lucide-react';
import { BOOKING_URL } from '@/lib/booking';
import { getWhatsAppNumber, buildWhatsAppUrl } from '@/lib/whatsapp';

interface BookingWidgetProps {
  price: number;
  slug: string;
  ticketName: string;
}

export function BookingWidget({ price, ticketName }: BookingWidgetProps) {
  const t  = useTranslations('ticketDetail');
  const tt = useTranslations('tickets');

  const whatsappNumber = getWhatsAppNumber();
  const whatsappUrl = whatsappNumber
    ? buildWhatsAppUrl(whatsappNumber, t('whatsappMsg', { ticket: ticketName }))
    : null;

  return (
    <div className="bg-white rounded-2xl border border-[#E8D5B7] shadow-[0_4px_24px_rgba(61,40,23,0.1)] overflow-hidden">

      {/* CTA banner */}
      <div className="bg-[#3D2817] px-5 py-3.5 text-center">
        <p className="text-[#E8A33D] text-[11px] font-bold uppercase tracking-[0.2em] mb-0.5">
          ⚡ Don&apos;t waste 2 hours in line
        </p>
        <p className="text-white text-sm font-semibold leading-snug">
          Secure your entry now — walk straight in
        </p>
      </div>

      <div className="p-6">
        {/* Price */}
        <div className="mb-6 pb-5 border-b border-[#E8D5B7]">
          <p className="text-xs text-[#5C3D20] uppercase tracking-wide mb-1">{tt('from')}</p>
          <p className="text-4xl font-bold text-[#C4452D] leading-none tabular-nums lining-nums"
             style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif', fontVariantNumeric: 'lining-nums tabular-nums' }}>
            {price} MAD
            <span className="text-sm font-normal text-[#5C3D20] ml-1.5">{tt('perPerson')}</span>
          </p>
        </div>

        {/* Official booking CTA */}
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold py-3.5 rounded-xl transition-colors mb-3 text-sm"
        >
          {t('proceedToCheckout')}
          <ExternalLink size={14} />
        </a>

        {/* Official site note */}
        <p className="text-center text-xs text-[#5C3D20] mb-5">
          🔒 Official booking via Moroccan Ministry of Culture
        </p>

        {/* Trust badges */}
        <div className="space-y-1.5 mb-5">
          {([t('instantConfirm'), t('freeCancelNote'), t('mobileTicket')] as string[]).map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-[#5C3D20]">
              <CheckCircle2 size={13} className="text-[#6B7B3A] shrink-0" />
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
