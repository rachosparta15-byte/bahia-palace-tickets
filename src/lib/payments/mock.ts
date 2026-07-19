// PHASE A: Mock payment provider — no real charges.
// PHASE B: Replace by setting PAYMENT_PROVIDER=stripe in .env and implementing stripe.ts.

export interface CheckoutSession {
  id: string;
  url: string;
}

export interface CheckoutParams {
  bookingId: string;
  reference: string;
  ticketName: string;
  /**
   * Price of ONE unit. The charge is `amount * quantity`.
   * NOTE: /api/bookings (legacy) passes the pre-multiplied order total and
   * omits `quantity`, which defaults to 1 — so it still charges correctly.
   */
  amount: number;
  currency: string;
  customerEmail: string;
  locale: string;
  /** Number of units (visitors). Defaults to 1 for existing callers. */
  quantity?: number;
  /** Shown under the line item at Stripe checkout — used for the price breakdown. */
  description?: string;
  /** Path to return to on cancel, e.g. "/en/visitor-pack". Defaults to /checkout. */
  cancelPath?: string;
}

export async function createCheckoutSession(
  params: CheckoutParams
): Promise<CheckoutSession> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 1500));

  const quantity = params.quantity ?? 1;
  console.log('[MOCK PAYMENT] Checkout session created:', {
    ...params,
    quantity,
    // Mirror the same arithmetic Stripe would apply, so switching providers
    // never silently changes what the customer is charged.
    computedTotal: params.amount * quantity,
  });

  return {
    id: `mock_session_${Date.now()}`,
    // Locale-LESS path on purpose: callers navigate with next-intl's router,
    // which prepends the active locale itself. Including it here produced
    // /en/en/booking/… — verified by driving the flow in a browser.
    url: `/booking/${params.bookingId}?mock_success=1`,
  };
}

export async function verifyWebhookSignature(_payload: string, _signature: string): Promise<boolean> {
  return true;
}

/**
 * Confirm a checkout session actually resulted in payment.
 *
 * The mock provider has no real session to inspect, so it reports unpaid —
 * the mock flow confirms via its own `?mock_success=1` path instead. Returning
 * `paid: true` here would let any caller mark a booking paid by inventing a
 * session id, so the safe answer is the honest one.
 */
export async function verifyCheckoutSession(_sessionId: string): Promise<{ paid: boolean }> {
  return { paid: false };
}

export async function refundPayment(paymentSessionId: string, amount?: number): Promise<boolean> {
  console.log('[MOCK PAYMENT] Refund processed:', { paymentSessionId, amount });
  return true;
}
