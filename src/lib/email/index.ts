// Active email provider — swap by changing EMAIL_PROVIDER env var.
// EMAIL_PROVIDER=mock   → Phase A (console.log)
// EMAIL_PROVIDER=resend → Phase B (real email)

const provider = process.env.EMAIL_PROVIDER ?? 'mock';

export const email =
  provider === 'resend'
    ? await import('./resend')
    : await import('./mock');

export type { BookingEmailParams, RefundEmailParams, ContactEmailParams } from './mock';
