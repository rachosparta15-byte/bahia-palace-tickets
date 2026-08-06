import { getTranslations } from 'next-intl/server';
import { isStripeTestMode } from '@/lib/payments/guard';
import { Ticket, Headphones, Clock, FlaskConical, ArrowUpRight, Smartphone } from 'lucide-react';

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
 *
 * The audio guide is the exception: it exists and is deliverable now, so it
 * is shown as a real link — but only once `confirmed` is true. See below.
 */
export async function VisitorPackConfirmation({
  locale,
  visitors,
  reference,
  confirmed,
  audioGuideUrls,
  qrDelivered,
  qrCode,
  hasQrFile,
  bookingId,
}: {
  locale: string;
  visitors: number;
  reference: string;
  /** Payment verified. Gates access to the audio guide, which is paid-for content. */
  confirmed: boolean;
  /**
   * The guide link WITH its signed access token, or null when none could be
   * minted (GUIDE_TOKEN_SECRET unset). Null is NOT a reason to fall back to
   * the bare guide URL — that ungated link is exactly what the token replaces.
   */
  audioGuideUrls: readonly string[];
  /** The owner has bought and sent the official ticket. */
  qrDelivered: boolean;
  /** Ticket code, when delivery was a code rather than a file. */
  qrCode: string | null;
  /** A QR image/PDF is available at /api/bookings/<id>/qr. */
  hasQrFile: boolean;
  bookingId: string;
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
        {/* Official entry ticket. Two states, and the difference is the whole
            refund policy: before delivery the customer can still cancel for a
            full refund, after it they cannot. The copy has to make which one
            they are in unmistakable. */}
        {qrDelivered ? (
          <div className="rounded-xl border border-[#8FA63C]/40 bg-[#2E1F12]/50 p-5">
            <div className="flex items-center gap-2.5">
              <Ticket size={17} className="shrink-0 text-[#8FA63C]" aria-hidden="true" />
              <h3 className="font-semibold text-[#F5E8CC]">{t('ticketReady')}</h3>
              <span className="ms-auto inline-flex items-center gap-1 rounded-full bg-[#8FA63C]/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#B7CC5C]">
                {t('ticketReadyBadge')}
              </span>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-[#C4A882]">{t('ticketReadyDesc')}</p>

            {hasQrFile && (
              <a
                href={`/api/bookings/${bookingId}/qr`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#C4452D] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#A33824]"
              >
                {t('ticketView')}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            )}

            {qrCode && (
              <div className="mt-4 rounded-lg border border-[rgba(232,163,61,0.20)] bg-[#1C1108] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#C4A882]">
                  {t('ticketCodeLabel')}
                </p>
                <p className="mt-1 font-mono text-sm break-all text-[#F5E8CC]">{qrCode}</p>
              </div>
            )}

            <p className="mt-3 text-xs text-[#C4A882]/70">
              {visitors} × official entry · ref {reference}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[rgba(232,163,61,0.30)] bg-[#2E1F12]/50 p-5">
            <div className="flex items-center gap-2.5">
              <Ticket size={17} className="shrink-0 text-[#E8A33D]" aria-hidden="true" />
              <h3 className="font-semibold text-[#F5E8CC]">{t('ticketPending')}</h3>
              <span className="ms-auto inline-flex items-center gap-1 rounded-full bg-[#3D2817] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#E8A33D]">
                <Clock size={10} aria-hidden="true" />
                Pending
              </span>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-[#C4A882]">{t('ticketPendingDesc')}</p>
            {/* Their cancellation right is live right now and ends silently
                when the QR arrives — worth saying while it still applies. */}
            <p className="mt-3 text-xs leading-relaxed text-[#8FA63C]">{t('ticketPendingRefundable')}</p>
            <p className="mt-3 text-xs text-[#C4A882]/70">
              {visitors} × official entry · ref {reference}
            </p>
          </div>
        )}

        {/* Audio guide access — live, and the one part of the pack we can
            actually deliver at this moment.

            Gated on `confirmed` rather than shown unconditionally: the guide
            is what the service half of the price buys, and this page is
            reachable while a booking is still pending (the id is in the URL).
            Showing the link before payment verifies would hand the paid
            product to anyone who starts a checkout and abandons it. */}
        {confirmed && audioGuideUrls.length > 0 ? (
          <div className="rounded-xl border border-[rgba(232,163,61,0.30)] bg-[#2E1F12]/50 p-5">
            <div className="flex items-center gap-2.5">
              <Headphones size={17} className="shrink-0 text-[#E8A33D]" aria-hidden="true" />
              <h3 className="font-semibold text-[#F5E8CC]">{t('audioTitle')}</h3>
              <span className="ms-auto inline-flex items-center gap-1 rounded-full bg-[#8FA63C]/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#B7CC5C]">
                {t('audioReadyBadge')}
              </span>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-[#C4A882]">{t('audioReadyDesc')}</p>
            {/* One button per person. Each link binds to the first phone that
                opens it, so a party of three must not be handed one button and
                left to guess — the numbering is what stops two people tapping
                the same link and the second being refused at the palace. */}
            <div className="mt-4 flex flex-col items-start gap-2">
              {audioGuideUrls.map((url, i) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#C4452D] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#A33824]"
                >
                  {audioGuideUrls.length > 1
                    ? `${t('audioOpen')} — ${i + 1}/${audioGuideUrls.length}`
                    : t('audioOpen')}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              ))}
            </div>

            {/* The two sentences that decide whether the guide still works on
                the day. iOS drops idle Cache Storage after about a week, so
                "activate early" is the advice that quietly fails; installing
                to the home screen is what survives it. */}
            <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-[#251A0F] px-4 py-3">
              <Smartphone size={14} className="mt-0.5 shrink-0 text-[#E8A33D]" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-[#C4A882]">{t('audioOfflineTip')}</p>
            </div>
          </div>
        ) : confirmed && audioGuideUrls.length === 0 ? (
          /* Paid, but we could not sign an access link — GUIDE_TOKEN_SECRET is
             unset or too short. Say so as OUR delay, and never fall back to the
             bare guide URL: an ungated link is the thing the token replaces. */
          <div className="rounded-xl border border-dashed border-[rgba(232,163,61,0.30)] bg-[#2E1F12]/50 p-5">
            <div className="flex items-center gap-2.5">
              <Headphones size={17} className="shrink-0 text-[#E8A33D]" aria-hidden="true" />
              <h3 className="font-semibold text-[#F5E8CC]">{t('audioTitle')}</h3>
              <span className="ms-auto inline-flex items-center gap-1 rounded-full bg-[#3D2817] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#E8A33D]">
                <Clock size={10} aria-hidden="true" />
                Preparing
              </span>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-[#C4A882]">{t('audioLinkPendingDesc')}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[rgba(232,163,61,0.30)] bg-[#2E1F12]/50 p-5">
            <div className="flex items-center gap-2.5">
              <Headphones size={17} className="shrink-0 text-[#E8A33D]" aria-hidden="true" />
              <h3 className="font-semibold text-[#F5E8CC]">{t('audioTitle')}</h3>
              <span className="ms-auto inline-flex items-center gap-1 rounded-full bg-[#3D2817] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#E8A33D]">
                <Clock size={10} aria-hidden="true" />
                Pending
              </span>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-[#C4A882]">{t('audioPendingDesc')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
