import { NextResponse, type NextRequest } from 'next/server';

import prisma from '@/lib/db';
import { payments } from '@/lib/payments';
import { activeProvider } from '@/lib/payments/guard';
import { confirmBookingPaid } from '@/lib/payments/confirm-booking';
import { verifyWebhookSignature } from '@/lib/payments/paypal';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * PayPal webhook — the path for customers who never come back.
 *
 * The normal flow captures on the return page: approve at PayPal, land on
 * /{locale}/booking/{id}?paypal=1, capture, confirm, email. That covers most
 * people, and it is the flow that was tested end to end.
 *
 * It does not cover the ones who close the tab on PayPal's "thanks" screen,
 * lose signal in a riad, or have their browser kill a backgrounded tab on a
 * phone. PayPal's approval and its capture are two separate steps: an approved
 * order that is never captured has taken no money at all. Without this endpoint
 * those bookings sit `pending` forever — the customer believes they have paid
 * and has an email from PayPal saying so, we have nothing, and the first anyone
 * hears of it is at the gate.
 *
 * SO THIS DOES THE SAME WORK, TRIGGERED BY PAYPAL INSTEAD OF THE BROWSER. It is
 * safe for both to run: `verifyCheckoutSession` treats ORDER_ALREADY_CAPTURED
 * as paid, and `confirmBookingPaid` moves only rows still awaiting payment, so
 * whichever arrives second does nothing and sends no second email.
 *
 * SETUP — in the PayPal dashboard, add a webhook on
 *   https://www.visitbahiapalace.com/api/webhooks/paypal
 * subscribed to CHECKOUT.ORDER.APPROVED, and set PAYPAL_WEBHOOK_ID to the id it
 * gives back. Without that variable every delivery is rejected (see below),
 * which is the correct failure: an unverified webhook that confirms bookings is
 * a free-tickets endpoint for anyone who learns the URL.
 */
export async function POST(request: NextRequest) {
  // Not the active provider — say so plainly rather than acting on events for a
  // payment method this deployment is not using.
  if (activeProvider() !== 'paypal') {
    return NextResponse.json({ error: 'paypal_not_active' }, { status: 410 });
  }

  // Raw text, not request.json(): the signature is computed over the exact
  // bytes PayPal sent, and re-serialising a parsed object changes them.
  const raw = await request.text();

  // PayPal verifies by calling their own API with the transmission headers, so
  // they are collected here and passed through as the "signature".
  const headers = JSON.stringify({
    'paypal-auth-algo': request.headers.get('paypal-auth-algo') ?? '',
    'paypal-cert-url': request.headers.get('paypal-cert-url') ?? '',
    'paypal-transmission-id': request.headers.get('paypal-transmission-id') ?? '',
    'paypal-transmission-sig': request.headers.get('paypal-transmission-sig') ?? '',
    'paypal-transmission-time': request.headers.get('paypal-transmission-time') ?? '',
  });

  if (!(await verifyWebhookSignature(raw, headers))) {
    // 401, not 200. A rejected delivery must be visible in PayPal's dashboard —
    // swallowing it would hide a misconfigured PAYPAL_WEBHOOK_ID behind a wall
    // of green ticks while bookings quietly failed to confirm.
    console.error('[paypal-webhook] signature verification failed');
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 });
  }

  let event: { event_type?: string; resource?: { id?: string; custom_id?: string } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  /*
   * CHECKOUT.ORDER.APPROVED is the one that matters: it fires the moment the
   * buyer approves, which is exactly the point the browser may vanish.
   *
   * PAYMENT.CAPTURE.COMPLETED fires after we capture, so by the time it lands
   * the work is already done. Subscribing to it is harmless; acting on it would
   * just be a second no-op. Anything else is acknowledged and ignored — a 200
   * with no action, so PayPal stops retrying an event we have no work for.
   */
  if (event.event_type !== 'CHECKOUT.ORDER.APPROVED') {
    return NextResponse.json({ received: true, ignored: event.event_type });
  }

  const orderId = event.resource?.id;
  if (!orderId) {
    return NextResponse.json({ received: true, ignored: 'no_order_id' });
  }

  /*
   * Look the booking up by the order id WE recorded, never by custom_id alone.
   *
   * custom_id is carried in the payload PayPal hands us; paymentSessionId was
   * written to our own database before the customer was ever sent to PayPal.
   * Matching on the stored value is what makes a forged or replayed event
   * unable to name a booking we did not open an order for.
   */
  const booking = await prisma.booking.findFirst({ where: { paymentSessionId: orderId } });
  if (!booking) {
    console.error(`[paypal-webhook] no booking holds PayPal order ${orderId}`);
    // 200: retrying will not conjure a booking, and a permanently failing
    // delivery counts against the account's webhook health.
    return NextResponse.json({ received: true, ignored: 'unknown_order' });
  }

  if (booking.status !== 'pending') {
    return NextResponse.json({ received: true, ignored: 'already_settled' });
  }

  const { paid } = await payments.verifyCheckoutSession(orderId);
  if (!paid) {
    // Approved but not captured, and the capture attempt failed — a declined
    // funding source or a PayPal-side error. Left pending on purpose: no money
    // moved, so confirming would promise a ticket nobody paid for.
    console.error(`[paypal-webhook] capture failed for order ${orderId} (${booking.reference})`);
    return NextResponse.json({ received: true, captured: false }, { status: 200 });
  }

  await confirmBookingPaid(booking.id, { via: 'webhook', paymentSessionId: orderId });
  console.log(`[paypal-webhook] captured and confirmed ${booking.reference} from ${orderId}`);

  return NextResponse.json({ received: true, captured: true });
}
