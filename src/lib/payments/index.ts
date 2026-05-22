// Active payment provider — swap by changing PAYMENT_PROVIDER env var.
// PAYMENT_PROVIDER=mock  → Phase A (no charges)
// PAYMENT_PROVIDER=stripe → Phase B (real Stripe)

const provider = process.env.PAYMENT_PROVIDER ?? 'mock';

export const payments =
  provider === 'stripe'
    ? await import('./stripe')
    : await import('./mock');

export type { CheckoutParams, CheckoutSession } from './mock';
