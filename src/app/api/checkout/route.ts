import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { CHECKOUT_ORIGIN, MONUMENT_ID, SITE_ID, SITE_ORIGIN } from '@/config/network';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Checkout, forwarded to the shared payment service.
 *
 * This route deliberately does almost nothing. It does not price the order, it
 * does not create a Payment Intent, and it does not write a booking. All of
 * that happens once, in the parent, for every site in the network — so there is
 * one Stripe account to get approved, one order table holding the consent
 * records and dispute evidence, and one dashboard to work from in the morning.
 *
 * WHAT IT DOES DO is keep the customer here. It returns a client secret, and
 * the page mounts Stripe's embedded Payment Element with it, so nobody is
 * bounced to a hosted checkout page on another domain at the exact moment they
 * are deciding whether to trust the site.
 *
 * THE PRICE IS NOT IN THIS REQUEST, and must never be. The parent reads it from
 * its own config; a body that carried an amount would be a body a customer
 * could edit.
 */

const schema = z.object({
  visitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  quantity: z.coerce.number().int().min(1).max(20),
  locale: z.string().min(2).max(5).default('en'),
  customer: z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    email: z.string().email().max(254),
    phone: z.string().max(32).optional(),
  }),
  consent: z.object({
    waiverAndTerms: z.literal(true),
  }),
});

export async function POST(request: NextRequest) {
  let parsed;
  try {
    parsed = schema.safeParse(await request.json());
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    // `consent` failing the literal(true) check is the common case and deserves
    // its own code, because the form can highlight the right checkbox.
    const isConsent = issue?.path?.[0] === 'consent';
    return NextResponse.json(
      { error: isConsent ? 'consent_required' : 'invalid_field', field: issue?.path?.join('.') },
      { status: isConsent ? 422 : 400 },
    );
  }

  const body = parsed.data;

  let upstream: Response;
  try {
    upstream = await fetch(`${CHECKOUT_ORIGIN}/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Sent explicitly so the parent's CORS allowlist recognises us and the
        // order's evidence snapshot records the site the sale actually
        // happened on, not the server that relayed it.
        Origin: SITE_ORIGIN,
      },
      body: JSON.stringify({
        siteId: SITE_ID,
        monumentId: MONUMENT_ID,
        visitDate: body.visitDate,
        quantity: body.quantity,
        locale: body.locale,
        customer: body.customer,
        consent: body.consent,
      }),
    });
  } catch (error) {
    console.error('[checkout] shared checkout unreachable', error);
    return NextResponse.json({ error: 'checkout_unavailable' }, { status: 502 });
  }

  const payload = await upstream.json().catch(() => ({}));

  if (!upstream.ok) {
    // Pass the parent's own error code through: it distinguishes a past date
    // from a sold-out product from a rate limit, and the form has copy for each.
    console.error('[checkout] shared checkout refused', upstream.status, payload);
    return NextResponse.json(payload, { status: upstream.status });
  }

  return NextResponse.json({
    orderId: payload.orderId,
    clientSecret: payload.clientSecret,
    amount: payload.amount,
    currency: payload.currency,
    statementDescriptor: payload.statementDescriptor,
  });
}
