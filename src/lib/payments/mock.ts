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
  amount: number;
  currency: string;
  customerEmail: string;
  locale: string;
}

export async function createCheckoutSession(
  params: CheckoutParams
): Promise<CheckoutSession> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 1500));

  console.log('[MOCK PAYMENT] Checkout session created:', params);

  return {
    id: `mock_session_${Date.now()}`,
    url: `/booking/${params.bookingId}?mock_success=1`,
  };
}

export async function verifyWebhookSignature(_payload: string, _signature: string): Promise<boolean> {
  return true;
}

export async function refundPayment(paymentSessionId: string, amount?: number): Promise<boolean> {
  console.log('[MOCK PAYMENT] Refund processed:', { paymentSessionId, amount });
  return true;
}
