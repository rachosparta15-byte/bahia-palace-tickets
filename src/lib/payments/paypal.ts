// PayPal Business — a third provider behind the same interface as mock and
// stripe, so `PAYMENT_PROVIDER=paypal` is the only change needed to switch.
//
// WHY THIS TALKS TO PAYPAL DIRECTLY AND NOT THROUGH marrakechlocal:
//
// The parent already implements PayPal, and the other three monument sites
// route their checkout through it. This site does not, because it owns a
// booking pipeline the parent knows nothing about: `Booking` rows in this
// database, `confirmBookingPaid()`, the two emails, and the per-seat guide
// codes in this project's `GuideCode` table. Sending the payment to the parent
// would create the order in the parent's store and leave this site's booking
// unpaid forever — the pipeline that was actually tested end to end would stop
// being the one that runs.
//
// The duplication is real and deliberate. It is a few dozen lines of REST
// against a stable API, against splitting one purchase across two databases.

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
  quantity?: number;
}

const SANDBOX = 'https://api-m.sandbox.paypal.com';
const LIVE = 'https://api-m.paypal.com';

/**
 * Live only when explicitly asked for.
 *
 * Defaulting to live would mean a missing or mistyped env var takes real
 * money, which is the wrong direction to fail in. Anything that is not the
 * exact string "live" is sandbox.
 */
function apiBase(): string {
  return process.env.PAYPAL_ENVIRONMENT === 'live' ? LIVE : SANDBOX;
}

function siteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.visitbahiapalace.com').replace(/\/$/, '');
}

async function accessToken(): Promise<string> {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error('PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET are not set');

  const res = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    throw new Error(`PayPal auth failed: ${res.status} ${await res.text().catch(() => '')}`);
  }
  return (await res.json()).access_token as string;
}

/**
 * Creates the PayPal order and returns its approval link.
 *
 * The amount is computed here from unit price × quantity, exactly as the mock
 * and Stripe providers do. It is never taken from the client: a total posted
 * by a browser is a total a browser can edit.
 */
export async function createCheckoutSession(params: CheckoutParams): Promise<CheckoutSession> {
  const quantity = params.quantity ?? 1;
  const total = (params.amount * quantity).toFixed(2);
  const token = await accessToken();

  const res = await fetch(`${apiBase()}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      // Same booking retried = same PayPal order, rather than a second one the
      // customer could also approve.
      'PayPal-Request-Id': params.bookingId,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: params.reference,
          // What appears on the buyer's PayPal statement. An unrecognisable
          // line here is the most common first step toward a dispute.
          description: `${params.ticketName} — ${quantity} visitor(s)`,
          custom_id: params.bookingId,
          amount: { currency_code: params.currency.toUpperCase(), value: total },
        },
      ],
      application_context: {
        brand_name: 'Visit Bahia Palace',
        locale: params.locale,
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING',
        // Back to this site. The booking page reads the status and finishes.
        return_url: `${siteOrigin()}/booking/${params.bookingId}?paypal=1`,
        cancel_url: `${siteOrigin()}/booking/${params.bookingId}?cancelled=1`,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`PayPal order creation failed: ${res.status} ${await res.text().catch(() => '')}`);
  }

  const order = await res.json();
  const approve = (order.links ?? []).find((l: { rel: string }) => l.rel === 'approve');
  if (!approve?.href) throw new Error('PayPal returned no approval link');

  return { id: order.id as string, url: approve.href as string };
}

/**
 * Captures an approved order, and reports whether the money actually moved.
 *
 * `verifyCheckoutSession` in the other providers only reads a status. Here it
 * must also capture, because PayPal's approval and its capture are two steps
 * and an approved-but-uncaptured order has taken nothing. Treating approval as
 * payment is how a visitor walks away with a confirmed booking we were never
 * paid for.
 *
 * Safe to call twice: an already-captured order returns ORDER_ALREADY_CAPTURED,
 * which is a success for our purposes, not a failure.
 */
export async function verifyCheckoutSession(sessionId: string): Promise<{ paid: boolean }> {
  const token = await accessToken();

  const capture = await fetch(`${apiBase()}/v2/checkout/orders/${sessionId}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });

  if (capture.ok) {
    const body = await capture.json().catch(() => ({}));
    return { paid: body.status === 'COMPLETED' };
  }

  const detail = await capture.text().catch(() => '');
  if (detail.includes('ORDER_ALREADY_CAPTURED')) {
    // The customer double-tapped, or the webhook got here first. Already paid.
    return { paid: true };
  }

  console.error(`[paypal] capture failed for ${sessionId}: ${capture.status} ${detail.slice(0, 300)}`);
  return { paid: false };
}

/**
 * Verifies a webhook came from PayPal.
 *
 * PayPal verifies by callback rather than by local HMAC, so this asks their
 * API. Without PAYPAL_WEBHOOK_ID there is nothing to verify against, and the
 * honest answer is no — accepting unverified webhooks would let anyone who
 * knows the URL mark bookings as paid.
 */
export async function verifyWebhookSignature(payload: string, _signature: string): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    console.error('[paypal] PAYPAL_WEBHOOK_ID is not set — refusing to trust this webhook');
    return false;
  }

  try {
    const headers = JSON.parse(_signature) as Record<string, string>;
    const token = await accessToken();
    const res = await fetch(`${apiBase()}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_algo: headers['paypal-auth-algo'],
        cert_url: headers['paypal-cert-url'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: webhookId,
        webhook_event: JSON.parse(payload),
      }),
    });
    if (!res.ok) return false;
    return (await res.json()).verification_status === 'SUCCESS';
  } catch (error) {
    console.error('[paypal] webhook verification threw', error);
    return false;
  }
}

/**
 * Refunds a captured payment. Amount omitted = full refund.
 *
 * `idempotencyKey` is not decoration. Without it the sequence "refund
 * succeeds, then our own database write fails, then someone retries" issues a
 * second refund and we pay the customer twice. PayPal deduplicates on
 * PayPal-Request-Id exactly as Stripe does on its idempotency key.
 */
export async function refundPayment(
  captureId: string,
  amount?: number,
  idempotencyKey?: string,
  currency = 'EUR',
): Promise<{ ok: boolean; refundId?: string }> {
  try {
    const token = await accessToken();
    const res = await fetch(`${apiBase()}/v2/payments/captures/${captureId}/refund`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(idempotencyKey ? { 'PayPal-Request-Id': idempotencyKey } : {}),
      },
      body: JSON.stringify(
        amount === undefined
          ? {}
          : { amount: { value: amount.toFixed(2), currency_code: currency.toUpperCase() } },
      ),
    });
    if (!res.ok) {
      console.error(`[paypal] refund failed: ${res.status} ${await res.text().catch(() => '')}`);
      return { ok: false };
    }
    const body = await res.json().catch(() => ({}));
    return { ok: true, refundId: body.id as string | undefined };
  } catch (error) {
    console.error('[paypal] refund threw', error);
    return { ok: false };
  }
}
