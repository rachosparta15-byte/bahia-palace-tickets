/**
 * The single seam between "Stripe says this booking is paid" and everything
 * that must happen exactly once as a result: mark it confirmed, email the
 * order confirmation, mark the originating lead paid, and record the intent
 * to source the official ticket.
 *
 * WHY ONE FUNCTION: payment can be confirmed from two places — the Stripe
 * webhook (the reliable path) and, as a fallback, the return page when the
 * customer lands back on /booking/[id]?session_id=…. If both fire for the
 * same booking (a webhook arriving while the tab is still open), they must
 * NOT both send an email or double-count the lead.
 *
 * The idempotency guard is an atomic conditional update: only the caller that
 * flips `pending → confirmed` proceeds to the side effects. Everyone else
 * sees count === 0 and returns quietly. No locks, no "have we emailed yet?"
 * flag that could disagree with reality.
 *
 * The official ticket is NOT issued here — sourcing is manual (see
 * src/lib/fulfillment). What fires on payment is the ORDER confirmation; the
 * QR ticket is emailed later, when the owner attaches it (admin QR route).
 */

import prisma from '@/lib/db';
import { ensureColumns } from '@/lib/db/ensure-columns';
import { email } from '@/lib/email';
import { fulfillTicket } from '@/lib/fulfillment';
import { BOOKING_STATUS } from '@/lib/booking-lifecycle';
import { AUDIO_GUIDE_URL } from '@/lib/booking';
import { buildGuideAccessUrl } from '@/lib/guide-token';

export type ConfirmVia = 'webhook' | 'return-page' | 'mock';

export interface ConfirmResult {
  /** True only for the ONE caller that won the pending→confirmed transition. */
  confirmed: boolean;
  /** True when the booking was already confirmed (or beyond) — a no-op. */
  alreadyDone: boolean;
}

export async function confirmBookingPaid(
  bookingId: string,
  opts: { via: ConfirmVia; paymentSessionId?: string }
): Promise<ConfirmResult> {
  await ensureColumns();

  // Atomic, idempotent transition. Only pending rows move; a second caller
  // (webhook vs. page load) finds nothing to update and does no side effects.
  const res = await prisma.booking.updateMany({
    where: { id: bookingId, status: BOOKING_STATUS.awaitingPayment },
    data: {
      status: BOOKING_STATUS.paidAwaitingQr,
      ...(opts.paymentSessionId ? { paymentSessionId: opts.paymentSessionId } : {}),
    },
  });

  if (res.count === 0) {
    return { confirmed: false, alreadyDone: true };
  }

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return { confirmed: false, alreadyDone: true };

  const visitDate = booking.visitDate.toISOString().split('T')[0];

  // ─── Audio-guide access token ─────────────────────────────────────
  // Minted HERE because this is the only place that knows a payment is real,
  // and it is already the exactly-once seam. The token goes in the
  // confirmation email so the customer keeps it even if they close the tab —
  // which matters more than usual, since iOS can evict the guide's stored
  // activation after ~7 days idle and the email is then the only way back in.
  //
  // Null when GUIDE_TOKEN_SECRET is unset. Deliberately NOT falling back to
  // the bare guide URL: that ungated link is the thing this replaces.
  const guideUrl =
    booking.ticketType === 'visitor-pack'
      ? buildGuideAccessUrl(AUDIO_GUIDE_URL, {
          reference: booking.reference,
          partySize: booking.adults,
          visitDate,
        })
      : null;

  if (booking.ticketType === 'visitor-pack' && !guideUrl) {
    console.error(
      `[confirm] No audio-guide link for ${booking.reference}: GUIDE_TOKEN_SECRET is ` +
        `unset or too short. The customer has paid for a guide they cannot open. ` +
        `Set it in Vercel → Settings → Environment Variables.`
    );
  }

  // Order confirmation email. Non-fatal: a customer who has paid is confirmed
  // regardless of whether our mail provider is up.
  try {
    await email.sendBookingConfirmation({
      to: booking.customerEmail,
      customerName: booking.customerName,
      reference: booking.reference,
      ticketType: booking.ticketType,
      visitDate,
      adults: booking.adults,
      children: booking.children,
      totalAmount: booking.totalAmount,
      currency: booking.currency,
      locale: booking.locale,
      audioGuideUrl: guideUrl,
    });
  } catch (err) {
    console.error('[confirm] order-confirmation email failed (non-fatal):', err);
  }

  // Mark the originating lead paid — downstream of a verified payment.
  if (booking.leadId) {
    await prisma.lead
      .updateMany({
        where: { id: booking.leadId, status: { not: 'paid' } },
        data: { status: 'paid', bookingId: booking.id },
      })
      .catch((err) => console.error('[confirm] mark lead paid failed:', err));
  }

  // Record the intent to source the official 100 MAD ticket, now that the
  // payment is real (the checkout route recorded it pre-payment; this is the
  // post-payment record the fulfillment module's comments call for).
  try {
    await fulfillTicket({
      bookingId: booking.id,
      reference: booking.reference,
      visitDate,
      visitors: booking.adults,
      customerEmail: booking.customerEmail,
      locale: booking.locale,
    });
  } catch (err) {
    console.error('[confirm] fulfillTicket failed (non-fatal):', err);
  }

  console.log(
    `[confirm] Booking ${booking.reference} confirmed via ${opts.via}. ` +
      `Order confirmation sent to ${booking.customerEmail}. ` +
      `Official QR still to be sourced + delivered (manual).`
  );

  return { confirmed: true, alreadyDone: false };
}
