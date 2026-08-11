import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import prisma from '@/lib/db';
import { payments } from '@/lib/payments';
import { activeProvider } from '@/lib/payments/guard';
import { confirmBookingPaid } from '@/lib/payments/confirm-booking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Captures a PayPal order approved in the embedded checkout.
 *
 * Called from the browser's `onApprove`, which fires when the customer has
 * finished with PayPal's card fields or button. That callback is only a signal
 * that approval happened — the money has not moved until this route captures,
 * and the browser is not trusted to say whether it did.
 *
 * WHY THE ORDER ID FROM THE CLIENT IS SAFE HERE: it is never used to decide
 * what to confirm. The booking is looked up by its own id, and the order id in
 * the request must equal the one this server recorded on that booking before
 * the customer was shown anything. A request naming someone else's order, or a
 * booking we never opened an order for, is refused. Without that check this
 * would be an endpoint for confirming any booking you know the id of.
 */

const schema = z.object({
  bookingId: z.string().min(1).max(64),
  orderId: z.string().min(1).max(64),
});

export async function POST(request: NextRequest) {
  if (activeProvider() !== 'paypal') {
    return NextResponse.json({ error: 'paypal_not_active' }, { status: 410 });
  }

  let parsed;
  try {
    parsed = schema.safeParse(await request.json());
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_field' }, { status: 400 });
  }

  const { bookingId, orderId } = parsed.data;

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    return NextResponse.json({ error: 'unknown_booking' }, { status: 404 });
  }

  // The order id must be the one we opened against this booking. Not a
  // formality: it is what stops a caller pairing a cheap order they really did
  // pay for with an expensive booking they did not.
  if (!booking.paymentSessionId || booking.paymentSessionId !== orderId) {
    console.error(
      `[capture] order/booking mismatch: ${booking.reference} holds ${booking.paymentSessionId}, request sent ${orderId}`,
    );
    return NextResponse.json({ error: 'order_mismatch' }, { status: 409 });
  }

  // Already settled — the webhook got here first, or the customer submitted
  // twice. Not an error: report success so the browser moves on to the
  // confirmation instead of showing a failure for a booking that is paid.
  if (booking.status !== 'pending') {
    return NextResponse.json({ paid: true, bookingId: booking.id, alreadyDone: true });
  }

  const { paid } = await payments.verifyCheckoutSession(orderId);
  if (!paid) {
    console.error(`[capture] PayPal did not capture ${orderId} for ${booking.reference}`);
    return NextResponse.json({ error: 'capture_failed' }, { status: 402 });
  }

  await confirmBookingPaid(booking.id, { via: 'return-page', paymentSessionId: orderId });

  return NextResponse.json({ paid: true, bookingId: booking.id });
}
