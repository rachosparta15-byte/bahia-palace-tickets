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
 *   2. supply live provider credentials (Stripe keys, or PayPal client id
 *      and secret with PAYPAL_ENVIRONMENT=live).
 * Neither alone does anything.
 *
 * The default is OFF. Absent, empty, or malformed values are OFF. Only the
 * exact string "true" enables payments — so PAYMENTS_ENABLED=1, =yes, or
 * =TRUE will NOT switch it on by accident.
 */

export type PaymentsDisabledReason =
  | 'flag-off'
  | 'missing-secret-key'
  | 'missing-publishable-key'
  | 'missing-paypal-credentials';

export interface PaymentsStatus {
  enabled: boolean;
  /** Set only when enabled === false. */
  reason?: PaymentsDisabledReason;
  /** True when the active provider cannot move real money. */
  testMode: boolean;
}

/**
 * FORCED OFF 2026-08-22, above the environment variable.
 *
 * PayPal permanently deactivated the account that took every payment on this
 * network — "there was information used to create this account that we cannot
 * verify" — and may hold funds for up to 180 days. There is no processor
 * behind this checkout now, so a live form would collect a name, an email, a
 * date and a card and fail at the last step.
 *
 * Hardcoded rather than done by unsetting PAYMENTS_ENABLED in Vercel, because
 * this must not depend on a dashboard someone can change without a review, or
 * on remembering which environment holds which value. It is one line, it is in
 * the diff, and it cannot be switched on by accident.
 *
 * TO RESTORE: delete the early return, then satisfy BOTH halves of the switch
 * described above — the flag AND live credentials for whatever processor
 * replaces PayPal. Read GO-LIVE.md first; several claims on the site ("no
 * booking fees", "official tickets only", "free to use") have to be checked
 * again against whatever the new processor charges.
 */
const PAYMENTS_HALTED = true;

/** Only the exact lowercase string "true" counts. Everything else is off. */
function flagEnabled(): boolean {
  if (PAYMENTS_HALTED) return false;
  // ⚠️ Before setting this to true, complete GO-LIVE.md in the repo root.
  // Several claims on the site ("no booking fees", "official tickets only",
  // "free to use") become false once payments are enabled.
  return process.env.PAYMENTS_ENABLED === 'true';
}

/**
 * Which payment adapter is live. Mirrors the switch in ./index.ts.
 *
 * PayPal was added to ./index.ts and this function still recognised only
 * 'stripe' — so PAYMENT_PROVIDER=paypal fell through to 'mock' here while a
 * real provider was actually charging cards. That is not a cosmetic mismatch:
 * `mockShortcutAllowed()` below is keyed on this, so the `?mock_success=1`
 * shortcut would have stayed live and anyone could have marked their own
 * booking paid by appending a query parameter to a URL.
 *
 * Any new provider must be added here at the same time as in ./index.ts.
 */
export function activeProvider(): 'mock' | 'stripe' | 'paypal' {
  const p = process.env.PAYMENT_PROVIDER;
  if (p === 'stripe') return 'stripe';
  if (p === 'paypal') return 'paypal';
  return 'mock';
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
 * Test mode for the ACTIVE provider, whichever it is.
 *
 * `isStripeTestMode()` reads a Stripe publishable key, and this site no longer
 * has one: under PayPal it found an empty string and reported test mode
 * forever, so a live PayPal checkout would have rendered a bright "TEST MODE —
 * no money will be taken" banner directly above a button that charges a real
 * card. Customers believe that banner.
 *
 * PayPal's own signal is the environment: anything that is not exactly "live"
 * points at the sandbox host and cannot take money. Mock is always test.
 */
export function isTestMode(): boolean {
  switch (activeProvider()) {
    case 'stripe':
      return isStripeTestMode();
    case 'paypal':
      return process.env.PAYPAL_ENVIRONMENT !== 'live';
    default:
      return true;
  }
}

/**
 * Server-side authority on whether a checkout may be created.
 * Call this at the top of every payment route. Never trust the client.
 */
export function getPaymentsStatus(): PaymentsStatus {
  const testMode = isTestMode();

  if (!flagEnabled()) {
    return { enabled: false, reason: 'flag-off', testMode };
  }

  /*
   * PayPal needs both halves of its credential pair before the button may
   * work. Without this the route reported "enabled", the form swapped to the
   * pay step, and the failure surfaced as a generic error deep inside the
   * adapter — after the customer had entered their details. Refuse up front
   * and show "Booking opens soon" instead.
   */
  if (activeProvider() === 'paypal') {
    const id = process.env.PAYPAL_CLIENT_ID ?? '';
    const secret = process.env.PAYPAL_CLIENT_SECRET ?? '';
    if (!id || !secret || id.includes('REPLACE_WITH') || secret.includes('REPLACE_WITH')) {
      return { enabled: false, reason: 'missing-paypal-credentials', testMode };
    }
    return { enabled: true, testMode };
  }

  // The mock provider touches no network and has no keys, so demanding them
  // would make the offline dev path impossible to exercise.
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
