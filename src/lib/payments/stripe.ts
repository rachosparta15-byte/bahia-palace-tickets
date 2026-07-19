// PHASE B: Real Stripe integration.
// Set PAYMENT_PROVIDER=stripe and add STRIPE_SECRET_KEY in .env.
//
// SERVER ONLY. This module reads STRIPE_SECRET_KEY; it must never be
// imported from a client component. Session creation additionally refuses
// to run unless the PAYMENTS_ENABLED switch is on — see ./guard.ts.

import type { CheckoutParams, CheckoutSession } from './mock';
import { getPaymentsStatus } from './guard';

export async function createCheckoutSession(
  params: CheckoutParams
): Promise<CheckoutSession> {
  // Refuse to create a session unless the hard safety switch is on AND keys
  // are present. The API routes check this too — this is defence in depth, so
  // no future caller can reach Stripe by bypassing a route-level check.
  const { enabled, reason } = getPaymentsStatus();
  if (!enabled) {
    throw new Error(
      `[payments] Refusing to create a Stripe session: payments are disabled (${reason}). ` +
        `Set PAYMENTS_ENABLED=true and supply Stripe keys to enable.`
    );
  }

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' });

  const quantity = params.quantity ?? 1;
  const cancelPath = params.cancelPath ?? `/${params.locale}/checkout`;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: params.customerEmail,
    line_items: [
      {
        price_data: {
          currency: params.currency.toLowerCase(),
          unit_amount: Math.round(params.amount * 100),
          product_data: {
            name: params.ticketName,
            // Carries the transparent price breakdown onto Stripe's own
            // checkout page, so the "what am I actually paying for" answer
            // survives the hand-off off our domain.
            ...(params.description ? { description: params.description } : {}),
          },
        },
        quantity,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.locale}/booking/${params.bookingId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}${cancelPath}`,
    metadata: { bookingId: params.bookingId, reference: params.reference },
  });

  return { id: session.id, url: session.url! };
}

/**
 * Ask Stripe whether this session was actually paid.
 *
 * Used by the confirmation page so a booking is only ever marked confirmed on
 * Stripe's word, never because the browser arrived at the success URL — that
 * URL is guessable and must not be treated as proof of payment.
 *
 * TODO(payments): for production this should be a webhook
 * (checkout.session.completed). Polling on page load misses customers who
 * pay and close the tab, leaving the booking pending despite a real charge.
 */
export async function verifyCheckoutSession(sessionId: string): Promise<{ paid: boolean }> {
  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' });
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return { paid: session.payment_status === 'paid' };
  } catch (err) {
    console.error('[payments] Could not verify checkout session:', err);
    return { paid: false };
  }
}

export async function verifyWebhookSignature(payload: string, signature: string): Promise<boolean> {
  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' });
  try {
    stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    return true;
  } catch {
    return false;
  }
}

export async function refundPayment(paymentSessionId: string, amount?: number): Promise<boolean> {
  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' });
  const session = await stripe.checkout.sessions.retrieve(paymentSessionId);
  if (!session.payment_intent) return false;
  await stripe.refunds.create({
    payment_intent: session.payment_intent as string,
    ...(amount ? { amount: Math.round(amount * 100) } : {}),
  });
  return true;
}
