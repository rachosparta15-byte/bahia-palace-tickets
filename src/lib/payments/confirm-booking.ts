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
import { getWhatsAppNumber } from '@/lib/whatsapp';
import { issueGuideCodes } from '@/lib/guide-access';

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

  /*
   * ─── Audio-guide access codes ──────────────────────────────────────
   *
   * Issued HERE because this is the only place that knows a payment is real,
   * and it is already the exactly-once seam. One code per paid seat; each one
   * locks to the first phone that opens it, so a party of three gets three
   * links and nobody has to share.
   *
   * The links go in the confirmation email so the customer keeps them after
   * closing the tab. That matters more than it sounds: iOS clears idle site
   * storage after about a week, and when it does the email is the only way
   * back in.
   *
   * `issueGuideCodes` is idempotent, which is what makes it safe here — this
   * function is reached again by webhook retries and by a customer refreshing
   * the confirmation page, and a second call must not mint a second set of
   * codes for the same booking.
   */
  if (booking.ticketType === 'visitor-pack') {
    try {
      // Issued now, delivered later. The codes must exist the moment the
      // payment is real — this is the exactly-once seam — but they reach the
      // customer with the ticket, in one message, as the delivery policy says.
      await issueGuideCodes(booking);
    } catch (error) {
      // Never fail a confirmed payment over this. The customer has paid and is
      // confirmed; the codes can be issued again from the admin dashboard.
      console.error(
        `[confirm] Could not issue guide codes for ${booking.reference}. The booking ` +
          `stands and the customer is confirmed — re-issue from /admin.`,
        error
      );
    }
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
      /*
       * NOT the guide links. The delivery policy promises one delivery with
       * everything in it, and that is the ticket email. Sending them here made
       * two deliveries out of one and started the digital-content clock while
       * the terms still offered free cancellation until the ticket was sent.
       */
      whatsapp: getWhatsAppNumber(),
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
