import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * RETIRED — payment confirmation now arrives at the parent's webhook.
 *
 * Payment Intents are created by the shared checkout against the parent's
 * Stripe account, so that is where Stripe delivers the events. A second
 * endpoint listening here could only ever receive events for the old account,
 * and a webhook that silently confirms nothing is worse than one that is
 * plainly gone.
 *
 * REMOVE THE ENDPOINT IN THE STRIPE DASHBOARD TOO. An endpoint left registered
 * against a retired account retries failed deliveries for days and eventually
 * gets the whole account flagged for webhook failures.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'endpoint_retired',
      message: 'Payment events are handled by the parent account.',
    },
    { status: 410 },
  );
}
