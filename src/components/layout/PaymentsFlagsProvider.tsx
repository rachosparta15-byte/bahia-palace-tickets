'use client';

import { createContext, useContext } from 'react';

/**
 * Makes the server-evaluated payments flags available to client components
 * (the lead modal, ticket CTAs) without exposing any key material — booleans
 * only, produced by getPublicPaymentsFlags() in the server layout.
 *
 * Why a context rather than NEXT_PUBLIC_PAYMENTS_ENABLED: a second env var
 * could disagree with the server's own view of whether payments are on, and
 * the UI would then offer a checkout the API refuses. One source of truth.
 *
 * This is a UX signal only — never a security boundary. The checkout API
 * re-checks the real flag server-side on every request.
 */
interface PaymentsFlags {
  /** True when PAYMENTS_ENABLED=true AND usable keys are configured. */
  enabled: boolean;
  /** True when no live Stripe keys are present. */
  testMode: boolean;
}

const PaymentsFlagsContext = createContext<PaymentsFlags>({
  // Safe default: assume payments are OFF. A missing provider must never
  // cause a CTA to send someone into a checkout that cannot work.
  enabled: false,
  testMode: true,
});

export function PaymentsFlagsProvider({
  value,
  children,
}: {
  value: PaymentsFlags;
  children: React.ReactNode;
}) {
  return (
    <PaymentsFlagsContext.Provider value={value}>{children}</PaymentsFlagsContext.Provider>
  );
}

export function usePaymentsFlags(): PaymentsFlags {
  return useContext(PaymentsFlagsContext);
}
