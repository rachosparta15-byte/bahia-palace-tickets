import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * RETIRED — replaced by /api/checkout, which forwards to the shared payment
 * service held by the parent company.
 *
 * This route used to create its own Stripe session against this site's own
 * account. Payments for the whole network now run through one account, so that
 * there is one underwriting to pass, one order table holding the consent
 * records and dispute evidence, and one dashboard to work from.
 *
 * Left in place answering 410 rather than deleted: a cached page or an old
 * bookmark hitting a 404 looks like a broken deploy, whereas 410 says the thing
 * is gone on purpose and names its replacement.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'endpoint_retired',
      message: 'Checkout moved to /api/checkout, which uses the shared payment service.',
    },
    { status: 410 },
  );
}
