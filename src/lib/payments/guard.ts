/**
 * HARD SAFETY SWITCH for all payment functionality.
 *
 * Why this exists: this codebase auto-deploys to production from `main`
 * (Vercel). Without a switch that defaults to OFF, a merge could put a
 * working checkout in front of real customers before the company is
 * registered, the legal pages are finalised, and ticket fulfilment is
 * actually wired up. This module is the single place that decides.
 *
 * Going live is deliberately a TWO-part act:
 *   1. set PAYMENTS_ENABLED=true, AND
 *   2. supply live Stripe keys.
 * Neither alone does anything.
 *
 * The default is OFF. Absent, empty, or malformed values are OFF. Only the
 * exact string "true" enables payments — so PAYMENTS_ENABLED=1, =yes, or
 * =TRUE will NOT switch it on by accident.
 */

export type PaymentsDisabledReason =
  | 'flag-off'
  | 'missing-secret-key'
  | 'missing-publishable-key';

export interface PaymentsStatus {
  enabled: boolean;
  /** Set only when enabled === false. */
  reason?: PaymentsDisabledReason;
  /** True when the configured keys are Stripe TEST keys. */
  testMode: boolean;
}

/** Only the exact lowercase string "true" counts. Everything else is off. */
function flagEnabled(): boolean {
  // ⚠️ Before setting this to true, complete GO-LIVE.md in the repo root.
  // Several claims on the site ("no booking fees", "official tickets only",
  // "free to use") become false once payments are enabled.
  return process.env.PAYMENTS_ENABLED === 'true';
}

/** Which payment adapter is live. Mirrors the switch in ./index.ts. */
export function activeProvider(): 'mock' | 'stripe' {
  return process.env.PAYMENT_PROVIDER === 'stripe' ? 'stripe' : 'mock';
}

/**
 * Whether the mock provider's `?mock_success=1` shortcut may confirm a
 * booking. This must be false whenever a real provider is active — otherwise
 * anyone could mark their own booking paid by appending a query parameter.
 */
export function mockConfirmationAllowed(): boolean {
  return activeProvider() === 'mock';
}

/**
 * Test mode is inferred from the key material itself, never from a separate
 * flag that could disagree with reality. A pk_test_/sk_test_ key cannot move
 * real money, so this is the honest signal to show the user.
 *
 * NOTE: a missing publishable key reads as test mode. That is intentional —
 * the UI should fail toward showing the "TEST MODE" warning, never toward
 * silently implying a live payment is possible.
 */
export function isStripeTestMode(): boolean {
  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
  return !pk.startsWith('pk_live_');
}

/**
 * Server-side authority on whether a checkout may be created.
 * Call this at the top of every payment route. Never trust the client.
 */
export function getPaymentsStatus(): PaymentsStatus {
  const testMode = isStripeTestMode();

  if (!flagEnabled()) {
    return { enabled: false, reason: 'flag-off', testMode };
  }

  // Key checks apply only to the real Stripe provider. The mock provider
  // touches no network and has no keys, so demanding them would make the
  // offline dev path impossible to exercise.
  if (activeProvider() !== 'stripe') {
    return { enabled: true, testMode };
  }

  // The flag alone is not enough — refuse rather than fail deep inside the
  // Stripe SDK with a less obvious error.
  const sk = process.env.STRIPE_SECRET_KEY ?? '';
  if (!sk || sk.includes('REPLACE_WITH')) {
    return { enabled: false, reason: 'missing-secret-key', testMode };
  }

  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
  if (!pk || pk.includes('REPLACE_WITH')) {
    return { enabled: false, reason: 'missing-publishable-key', testMode };
  }

  return { enabled: true, testMode };
}

/**
 * Safe to send to the browser: booleans only, never key material.
 * Used to decide between a working button and "Booking opens soon".
 */
export function getPublicPaymentsFlags(): { enabled: boolean; testMode: boolean } {
  const { enabled, testMode } = getPaymentsStatus();
  return { enabled, testMode };
}
