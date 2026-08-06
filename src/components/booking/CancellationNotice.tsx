import { getTranslations } from 'next-intl/server';
import { MessageCircle, Mail, Lock, XCircle } from 'lucide-react';
import { getWhatsAppNumber, buildWhatsAppUrl } from '@/lib/whatsapp';
import { SITE } from '@/config/site';
import { BOOKING_STATUS } from '@/lib/booking-lifecycle';

/**
 * The customer's half of the cancellation policy (Terms of Sale, §5).
 *
 * The rule is enforced server-side in /api/admin/bookings/[id]/cancel; this
 * component's only job is to tell the customer, truthfully, which side of
 * the line they are currently on — and to make acting on it easy while they
 * still can.
 *
 * WHY THERE IS NO "CANCEL" BUTTON: cancellation is manual by design. The
 * owner receives the request, verifies it, and cancels from the dashboard,
 * which is what releases the refund. A self-service button would imply an
 * automatic refund that nothing yet performs — a promise the system cannot
 * keep is worse than an extra message.
 *
 * The window closes silently from the customer's point of view: nothing
 * happens on their screen when the QR is sent, it just becomes true that
 * they can no longer cancel. So the refundable state states the deadline
 * explicitly rather than only offering the contact links.
 */
export async function CancellationNotice({
  locale,
  reference,
  status,
  qrDelivered,
}: {
  locale: string;
  reference: string;
  status: string;
  qrDelivered: boolean;
}) {
  const t = await getTranslations({ locale, namespace: 'booking.cancellation' });

  // Already cancelled — nothing to offer, and "free cancellation" copy here
  // would be actively confusing.
  if (status === BOOKING_STATUS.cancelled) {
    return (
      <section className="mt-6 rounded-xl border border-[rgba(232,163,61,0.20)] bg-[#251A0F] px-5 py-4">
        <p className="flex items-center justify-center gap-2 text-sm text-[#C4A882]">
          <XCircle size={15} className="shrink-0" aria-hidden="true" />
          {t('alreadyCancelled')}
        </p>
      </section>
    );
  }

  // ── Window closed: the ticket is out ────────────────────────────────
  if (qrDelivered) {
    return (
      <section className="mt-6 rounded-xl border border-[rgba(232,163,61,0.20)] bg-[#251A0F] px-5 py-4">
        <p className="flex items-start justify-center gap-2 text-center text-sm text-[#C4A882]">
          <Lock size={15} className="mt-0.5 shrink-0 text-[#C4A882]" aria-hidden="true" />
          {t('closed')}
        </p>
      </section>
    );
  }

  // Unpaid: no money has moved, so there is no refund to describe.
  if (status !== BOOKING_STATUS.paidAwaitingQr) return null;

  // ── Window open: free cancellation ──────────────────────────────────
  const whatsapp = getWhatsAppNumber();
  const subject = t('emailSubject', { reference });

  return (
    <section className="mt-6 rounded-xl border border-[#8FA63C]/30 bg-[#251A0F] px-5 py-5">
      <h2 className="text-sm font-semibold text-[#F5E8CC]">{t('title')}</h2>
      <p className="mt-2 text-sm leading-relaxed text-[#C4A882]">{t('body')}</p>

      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
        {/* Hidden rather than shown-broken when no number is configured —
            getWhatsAppNumber() returns null for the placeholder value. */}
        {whatsapp && (
          <a
            href={buildWhatsAppUrl(whatsapp, t('whatsappMessage', { reference }))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1c7c54] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#166344]"
          >
            <MessageCircle size={15} aria-hidden="true" />
            {t('whatsappCta')}
          </a>
        )}

        <a
          href={`mailto:${SITE.supportEmail}?subject=${encodeURIComponent(subject)}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[rgba(232,163,61,0.30)] px-5 py-3 text-sm font-semibold text-[#F5E8CC] transition-colors hover:border-[#E8A33D] hover:text-[#E8A33D]"
        >
          <Mail size={15} aria-hidden="true" />
          {SITE.supportEmail}
        </a>
      </div>

      <p className="mt-3 text-xs text-[#C4A882]/70">
        {t('referenceHint', { reference })}
      </p>
    </section>
  );
}
