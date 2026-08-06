/**
 * Booking lifecycle and the cancellation rule it exists to enforce.
 *
 * This is the code half of Section 5 of the Terms of Sale:
 *
 *     "Before the QR code is delivered: free cancellation.
 *      After the QR code is delivered: no refund."
 *
 * A promise in a legal document that nothing enforces is not a policy, it
 * is a hope. Everything that can cancel a booking must go through
 * `canCancel()` so the document and the software cannot disagree.
 */

import type { Booking } from '../generated/prisma/client';

/**
 * STATUS VOCABULARY — and how it maps to the owner's spec.
 *
 * The owner described three states: 'pending' (paid, QR not sent),
 * 'qr_sent', and 'cancelled'. The codebase already used 'pending' to mean
 * something different — awaiting payment — across 5 live bookings, the
 * admin filter tabs, and the checkout route. Reusing that name for "paid"
 * would have silently reclassified every unpaid booking as refund-eligible.
 *
 * So the owner's three states map onto four here:
 *
 *   'pending'    awaiting payment. No money taken, nothing to refund.
 *   'confirmed'  PAID, QR not yet delivered   → the owner's "pending".
 *                THIS is the free-cancellation window.
 *   'qr_sent'    QR delivered                 → no cancellation, no refund.
 *   'cancelled'  cancelled and refunded. Reachable only from 'confirmed'.
 *
 * The rule itself does not depend on these labels: it is decided by
 * `qrSentAt`. Renaming states later cannot break the refund guarantee.
 */
export const BOOKING_STATUS = {
  awaitingPayment: 'pending',
  paidAwaitingQr: 'confirmed',
  qrSent: 'qr_sent',
  cancelled: 'cancelled',
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

/** The subset of a booking this module needs. Keeps it testable and cheap to call. */
type LifecycleView = Pick<Booking, 'status' | 'qrSentAt'>;

/**
 * Has a QR been delivered? Answers for the two-and-a-half states `qrSentAt`
 * can really be in.
 *
 * `null` means "definitely not sent". But the field can also arrive as
 * `undefined` — when the column is missing from the database, which really
 * happened: the schema gained these fields while an existing database did
 * not, and `qrSentAt !== null` then read `undefined` as DELIVERED and
 * silently refused every cancellation. `ensureColumns()` now creates the
 * column, so this should not recur.
 *
 * It still fails CLOSED on purpose. If we cannot tell whether the customer
 * is holding a valid ticket, refusing the automated refund is the
 * recoverable mistake: the owner can always refund manually in Stripe,
 * whereas an automatic refund on a ticket that was in fact delivered is
 * money that cannot be clawed back. Loud, because a silent "no refunds"
 * would breach the terms we publish.
 */
function deliveryState(booking: LifecycleView): 'sent' | 'not-sent' {
  if (booking.status === BOOKING_STATUS.qrSent) return 'sent';
  if (booking.qrSentAt === null) return 'not-sent';
  if (booking.qrSentAt === undefined) {
    console.error(
      '[booking-lifecycle] qrSentAt is undefined — the column is probably ' +
        'missing from the database. Treating the QR as delivered and refusing ' +
        'cancellation. Run ensureColumns() / prisma db push.'
    );
    return 'sent';
  }
  return 'sent';
}

export type CancelRefusal =
  | 'qr_already_delivered'
  | 'already_cancelled'
  | 'not_paid';

export type CancelDecision =
  | { allowed: true }
  | { allowed: false; reason: CancelRefusal; status: number; message: string };

/**
 * May this booking still be cancelled and refunded?
 *
 * Decided by `qrSentAt` FIRST, before status is even considered. The
 * timestamp is the fact the customer was promised a rule about; status is
 * a label we maintain alongside it. If the two ever disagree — a failed
 * write, a hand-edited row — the safe reading is that delivery happened,
 * because refunding a ticket the customer already holds is the loss we
 * cannot claw back.
 */
export function canCancel(booking: LifecycleView): CancelDecision {
  if (deliveryState(booking) === 'sent') {
    return {
      allowed: false,
      reason: 'qr_already_delivered',
      // 409, not 403: the request is well-formed and would have been valid
      // earlier. It conflicts with the booking's current state.
      status: 409,
      message:
        'The QR code for this booking has already been delivered. Under Section 5 ' +
        'of the Terms of Sale the service is provided at that point, so it can no ' +
        'longer be cancelled or refunded.',
    };
  }

  if (booking.status === BOOKING_STATUS.cancelled) {
    return {
      allowed: false,
      reason: 'already_cancelled',
      status: 409,
      message: 'This booking is already cancelled.',
    };
  }

  if (booking.status !== BOOKING_STATUS.paidAwaitingQr) {
    return {
      allowed: false,
      reason: 'not_paid',
      status: 409,
      message:
        'This booking has not been paid, so there is nothing to cancel or refund.',
    };
  }

  return { allowed: true };
}

/**
 * May the QR be marked delivered?
 *
 * Only for a paid booking. Marking an unpaid or cancelled booking as
 * delivered would destroy the customer's cancellation right on a booking
 * that never earned us the money, and `qrSentAt` is deliberately one-way —
 * there is no "unsend", because the customer really does have the code.
 */
export function canMarkQrSent(booking: LifecycleView): CancelDecision {
  if (deliveryState(booking) === 'sent') {
    return {
      allowed: false,
      reason: 'qr_already_delivered',
      status: 409,
      message: 'A QR code has already been recorded as delivered for this booking.',
    };
  }

  if (booking.status === BOOKING_STATUS.cancelled) {
    return {
      allowed: false,
      reason: 'already_cancelled',
      status: 409,
      message: 'This booking was cancelled — it cannot be fulfilled.',
    };
  }

  if (booking.status !== BOOKING_STATUS.paidAwaitingQr) {
    return {
      allowed: false,
      reason: 'not_paid',
      status: 409,
      message: 'This booking is not paid yet. Do not deliver a QR code for it.',
    };
  }

  return { allowed: true };
}

/** True once the customer may be shown their QR. */
export function qrIsDelivered(booking: LifecycleView): boolean {
  return deliveryState(booking) === 'sent';
}
