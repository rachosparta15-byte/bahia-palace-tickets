import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { CHECKOUT_ORIGIN, MONUMENT_ID, SITE_ID, SITE_ORIGIN } from '@/config/network';
import { activeProvider, getPaymentsStatus } from '@/lib/payments/guard';
import { earliestVisitDate, isTooSoon } from '@/config/booking-window';
import {
  CHILD_AGE_MAX,
  CHILD_AGE_MIN,
  VISITOR_PACK_MAX_VISITORS,
  packTotalCents,
} from '@/config/pricing';
import { generateReference } from '@/lib/utils';
import { payments } from '@/lib/payments';
import prisma from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Checkout. Two paths, chosen by PAYMENT_PROVIDER.
 *
 * STRIPE — forwarded to the shared payment service. This route does almost
 * nothing: it does not price the order, create a Payment Intent, or write a
 * booking. All of that happens once, in the parent, for every site in the
 * network, so there is one Stripe account to get approved and one order table
 * holding the consent records and dispute evidence.
 *
 * PAYPAL — handled here, against this site's own database. The parent has no
 * PayPal merchant for this brand, and more importantly this site owns a
 * fulfilment pipeline the parent knows nothing about: `Booking` rows here,
 * `confirmBookingPaid()`, the two emails, and the per-seat guide codes. Sending
 * the payment upstream would create the order in the parent's store and leave
 * this site's booking pending forever — the pipeline that was tested end to end
 * would stop being the one that runs. See lib/payments/paypal.ts.
 *
 * THE PRICE IS NOT IN THIS REQUEST, on either path, and must never be. It comes
 * from config here and from the parent's config there; a body that carried an
 * amount would be a body a customer could edit.
 */

const schema = z
  .object({
    visitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
    /*
     * Two counts, because the ministry charges two prices: 100 MAD for a
     * foreign adult and 50 MAD for a child aged 7 to 13.
     *
     * `adults` is at least one. A party with nobody over 13 on it is not a
     * booking this site can honestly sell, and it is the same question the
     * gate would ask.
     */
    adults: z.coerce.number().int().min(1).max(VISITOR_PACK_MAX_VISITORS),
    children: z.coerce.number().int().min(0).max(VISITOR_PACK_MAX_VISITORS).default(0),
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
  })
  /*
   * The cap belongs to the party, not to either count on its own. Twenty and
   * twenty pass two `max(20)` checks and add up to a forty-person booking
   * against a limit that says twenty.
   */
  .refine((v) => v.adults + v.children <= VISITOR_PACK_MAX_VISITORS, {
    path: ['adults'],
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

  /*
   * The booking window, checked here rather than only in the calendar.
   *
   * The picker greys these days out, but the picker runs in the customer's
   * browser: it can be edited, it can be bypassed by posting to this route
   * directly, and its clock can legitimately be a day off ours across a
   * timezone boundary. We do not hold ticket stock, so a visit booked for
   * today is one we cannot source in time — that is a refund and a family
   * turned away at the gate, not a cosmetic problem.
   */
  if (isTooSoon(body.visitDate)) {
    return NextResponse.json(
      { error: 'visit_date_too_soon', earliest: earliestVisitDate() },
      { status: 422 },
    );
  }

  // Both paths need the switch to be on. Checked before either provider is
  // touched, so a disabled site never creates a booking row or a PayPal order.
  const status = getPaymentsStatus();
  if (!status.enabled) {
    return NextResponse.json({ error: 'booking_not_open' }, { status: 503 });
  }

  if (activeProvider() === 'paypal') {
    return createPayPalCheckout(body);
  }

  if (body.children > 0) {
    // Never a silent overcharge. The Stripe path is not live on this site
    // (PAYMENT_PROVIDER=paypal), and if it is ever switched on this refuses
    // instead of billing a child at the adult rate.
    console.error('[checkout] child tier is not supported on the shared checkout path');
    return NextResponse.json({ error: 'child_tier_unavailable' }, { status: 503 });
  }

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
        /*
         * The hub prices `allInclusivePriceEur * quantity` and has one rate.
         * Until it learns the child tier, this path would silently charge a
         * child as an adult — so it only ever sees a party it can price
         * correctly, and refuses the rest rather than overcharging.
         */
        quantity: body.adults + body.children,
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

/**
 * PayPal: write the booking, open the order, hand back the approval link.
 *
 * Returns `redirectUrl` rather than a client secret. PayPal's approval happens
 * on their domain — there is no embedded equivalent for this flow — so the
 * browser leaves the site, approves, and comes back to
 * /{locale}/booking/{id}?paypal=1, which captures and confirms.
 *
 * The booking is written BEFORE the PayPal order and its id is used as the
 * order's PayPal-Request-Id and custom_id. That ordering is what makes the two
 * systems agree: a payment can always be traced back to exactly one booking,
 * and a customer who submits twice gets the same PayPal order rather than a
 * second one they could also approve.
 */
async function createPayPalCheckout(body: {
  visitDate: string;
  adults: number;
  children: number;
  locale: string;
  customer: { firstName: string; lastName: string; email: string; phone?: string };
}) {
  /*
   * Priced here, from the counts, by the same helper the form calls — so the
   * total on screen and the total at PayPal cannot drift apart. The body
   * carries no amount, and never should: a body that carried one would be a
   * body the customer could edit.
   */
  const totalCents = packTotalCents(body.adults, body.children);
  const totalEUR = totalCents / 100;
  const reference = generateReference();

  let booking;
  try {
    booking = await prisma.booking.create({
      data: {
        reference,
        ticketType: 'visitor-pack',
        // Midnight UTC: the visit date is a calendar day, not an instant, and
        // storing it with a local offset would shift it for half the world.
        visitDate: new Date(`${body.visitDate}T00:00:00.000Z`),
        adults: body.adults,
        children: body.children,
        totalAmount: totalEUR,
        currency: 'EUR',
        customerName: `${body.customer.firstName} ${body.customer.lastName}`.trim(),
        customerEmail: body.customer.email,
        customerPhone: body.customer.phone ?? null,
        locale: body.locale,
        status: 'pending',
        paymentProvider: 'paypal',
      },
    });
  } catch (error) {
    console.error('[checkout] could not create booking', error);
    return NextResponse.json({ error: 'checkout_unavailable' }, { status: 502 });
  }

  let session;
  try {
    session = await payments.createCheckoutSession({
      bookingId: booking.id,
      reference: booking.reference,
      ticketName: 'Complete Visitor Pack',
      /*
       * The party total, not a unit price times a count — two rates cannot be
       * expressed that way. `quantity` stays for the description PayPal shows
       * the buyer, and the amount is already the whole thing.
       */
      amount: totalEUR,
      currency: 'EUR',
      customerEmail: body.customer.email,
      locale: body.locale,
      quantity: 1,
      lineDescription: describeParty(body.adults, body.children),
      // Prefills PayPal's guest form with what they already typed here.
      customerFirstName: body.customer.firstName,
      customerLastName: body.customer.lastName,
      customerPhone: body.customer.phone,
    });
  } catch (error) {
    console.error('[checkout] PayPal order creation failed', error);
    // The booking stays `pending` and unpaid, which is the correct resting
    // state: nothing was charged, and it will never be confirmed without a
    // capture. Deliberately not deleted — an unexplained gap in the reference
    // sequence is worse to debug than a pending row.
    return NextResponse.json({ error: 'payment_setup_failed' }, { status: 502 });
  }

  // Recorded before the customer is sent anywhere: the booking page will only
  // capture an order id it already holds against this booking, so a `paypal=1`
  // return for an order we never opened confirms nothing.
  await prisma.booking.update({
    where: { id: booking.id },
    data: { paymentSessionId: session.id },
  });

  return NextResponse.json({
    orderId: booking.reference,
    bookingId: booking.id,
    /*
     * The PayPal order id, for the embedded checkout to approve in place.
     *
     * `redirectUrl` is still returned beside it as a fallback. If the SDK
     * cannot load — an ad blocker, a corporate proxy, a browser that refuses
     * third-party frames — the page falls back to sending the customer to
     * PayPal rather than showing a dead box. One of the two always works.
     */
    paypalOrderId: session.id,
    redirectUrl: session.url,
    amount: totalCents,
    currency: 'EUR',
    adults: body.adults,
    children: body.children,
    // Safe to expose: the client id is public by design, it is in every PayPal
    // SDK script tag on the internet. The secret never leaves the server.
    paypalClientId: process.env.PAYPAL_CLIENT_ID ?? '',
    paypalEnvironment: process.env.PAYPAL_ENVIRONMENT === 'live' ? 'live' : 'sandbox',
  });
}

/**
 * "2 adults + 1 child (7-13)" — what the buyer sees on their PayPal statement.
 *
 * The line has to name the child rate. A statement that reads "3 visitors" for
 * an amount that is not three times any price on the site is the sort of
 * mismatch that starts a chargeback.
 */
function describeParty(adults: number, children: number): string {
  const parts = [`${adults} adult${adults === 1 ? '' : 's'}`];
  if (children > 0) {
    parts.push(`${children} child${children === 1 ? '' : 'ren'} (${CHILD_AGE_MIN}-${CHILD_AGE_MAX})`);
  }
  return parts.join(' + ');
}
