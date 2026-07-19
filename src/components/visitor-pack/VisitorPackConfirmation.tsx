import { getTranslations } from 'next-intl/server';
import { isStripeTestMode } from '@/lib/payments/guard';
import { Ticket, Headphones, Clock, FlaskConical } from 'lucide-react';

/**
 * Post-purchase panel for Visitor Pack orders.
 *
 * HONESTY CONSTRAINT: at this point in the build, `fulfillTicket()` has only
 * RECORDED the intent to buy the official entry ticket — no ticket exists and
 * no audio guide has been produced. This panel therefore shows both as
 * explicitly pending. It must not display a ticket-like artefact (barcode,
 * "valid for entry", downloadable voucher) for something the customer does
 * not actually have.
 *
 * When fulfilment is wired up, branch on the FulfillTicketResult status:
 * 'fulfilled' → show the real voucher; 'recorded'/'pending' → keep this.
 */
export async function VisitorPackConfirmation({
  locale,
  visitors,
  reference,
}: {
  locale: string;
  visitors: number;
  reference: string;
}) {
  const t = await getTranslations({ locale, namespace: 'visitorPack.confirmation' });
  const testMode = isStripeTestMode();

  return (
    <section className="mt-8 rounded-2xl border border-[rgba(232,163,61,0.20)] bg-[#251A0F] p-6 sm:p-8">
      <h2
        className="font-bold text-[#F5E8CC]"
        style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem' }}
      >
        {t('packTitle')}
      </h2>

      {testMode && (
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-[#E8A33D]/40 bg-[#2E1F12] px-4 py-3">
          <FlaskConical size={15} className="mt-0.5 shrink-0 text-[#E8A33D]" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-[#E8C88A]">{t('mockNotice')}</p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {/* Official entry ticket — pending, deliberately not ticket-shaped. */}
        <div className="rounded-xl border border-dashed border-[rgba(232,163,61,0.30)] bg-[#2E1F12]/50 p-5">
          <div className="flex items-center gap-2.5">
            <Ticket size={17} className="shrink-0 text-[#E8A33D]" aria-hidden="true" />
            <h3 className="font-semibold text-[#F5E8CC]">{t('ticketPending')}</h3>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#3D2817] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#E8A33D]">
              <Clock size={10} aria-hidden="true" />
              Pending
            </span>
          </div>
          <p className="mt-2.5 text-sm leading-relaxed text-[#C4A882]">{t('ticketPendingDesc')}</p>
          <p className="mt-3 text-xs text-[#C4A882]/70">
            {visitors} × official entry · ref {reference}
          </p>
        </div>

        {/* Audio guide access — stubbed. */}
        {/* TODO(audio): replace with the real access link / redemption code once
            the audio guide exists and a delivery mechanism is chosen. */}
        <div className="rounded-xl border border-dashed border-[rgba(232,163,61,0.30)] bg-[#2E1F12]/50 p-5">
          <div className="flex items-center gap-2.5">
            <Headphones size={17} className="shrink-0 text-[#E8A33D]" aria-hidden="true" />
            <h3 className="font-semibold text-[#F5E8CC]">{t('audioTitle')}</h3>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#3D2817] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#E8A33D]">
              <Clock size={10} aria-hidden="true" />
              Pending
            </span>
          </div>
          <p className="mt-2.5 text-sm leading-relaxed text-[#C4A882]">{t('audioPendingDesc')}</p>
        </div>
      </div>
    </section>
  );
}
