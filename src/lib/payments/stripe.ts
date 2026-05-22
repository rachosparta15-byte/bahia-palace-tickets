// PHASE B: Real Stripe integration.
// Set PAYMENT_PROVIDER=stripe and add STRIPE_SECRET_KEY in .env.
// npm install stripe

import type { CheckoutParams, CheckoutSession } from './mock';

export async function createCheckoutSession(
  params: CheckoutParams
): Promise<CheckoutSession> {
  // @ts-ignore — installed in Phase B: npm install stripe
  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: params.customerEmail,
    line_items: [
      {
        price_data: {
          currency: params.currency.toLowerCase(),
          unit_amount: Math.round(params.amount * 100),
          product_data: { name: params.ticketName },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.locale}/booking/${params.bookingId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.locale}/checkout`,
    metadata: { bookingId: params.bookingId, reference: params.reference },
  });

  return { id: session.id, url: session.url! };
}

export async function verifyWebhookSignature(payload: string, signature: string): Promise<boolean> {
  // @ts-ignore — installed in Phase B: npm install stripe
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
  // @ts-ignore — installed in Phase B: npm install stripe
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
