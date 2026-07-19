/**
 * Complete Visitor Pack checkout.
 *
 * Separate from the legacy /api/bookings route because this one enforces
 * two things that route does not: the PAYMENTS_ENABLED kill switch, and the
 * transparent official-ticket/service price breakdown.
 *
 * SECURITY: the price is taken from src/config/pricing.ts and NEVER from the
 * request body. The client sends only a date and a visitor count.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { payments } from '@/lib/payments';
import { getPaymentsStatus } from '@/lib/payments/guard';
import { generateReference } from '@/lib/utils';
import { fulfillTicket } from '@/lib/fulfillment';
import {
  VISITOR_PACK_PRICE_USD,
  VISITOR_PACK_BREAKDOWN,
  VISITOR_PACK_MAX_VISITORS,
  OFFICIAL_DOOR_PRICE_MAD,
  visitorPackBreakdownIsValid,
} from '@/config/pricing';

const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  visitors: z.coerce.number().int().min(1).max(VISITOR_PACK_MAX_VISITORS),
  customerName: z.string().min(2).max(120),
  customerEmail: z.string().email(),
  locale: z.string().default('en'),
});

/** Reject visit dates in the past (compared in UTC, matching how we store them). */
function isPastDate(iso: string): boolean {
  const visit = new Date(`${iso}T00:00:00.000Z`).getTime();
  const now = new Date();
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return visit < todayUTC;
}

export async function POST(req: NextRequest) {
  try {
    // ─── HARD SAFETY SWITCH ───────────────────────────────────────────
    // Checked before anything else, and before any DB write, so a disabled
    // deployment cannot even create a pending booking row.
    const status = getPaymentsStatus();
    if (!status.enabled) {
      return NextResponse.json(
        {
          error: 'payments_disabled',
          message: 'Booking opens soon. No payment can be taken yet.',
        },
        { status: 503 }
      );
    }

    // Guards against the displayed breakdown drifting from the charged total.
    // Refusing to sell is the correct failure here: charging a total we cannot
    // truthfully itemise is exactly the transparency problem we are avoiding.
    if (!visitorPackBreakdownIsValid()) {
      console.error(
        '[visitor-pack] Price breakdown does not sum to the total — refusing to sell.',
        VISITOR_PACK_BREAKDOWN
      );
      return NextResponse.json({ error: 'pricing_misconfigured' }, { status: 500 });
    }

    const body = await req.json();
    const input = schema.safeParse(body);
    if (!input.success) {
      return NextResponse.json({ error: input.error.flatten() }, { status: 400 });
    }

    const { date, visitors, customerName, customerEmail, locale } = input.data;

    if (isPastDate(date)) {
      return NextResponse.json({ error: 'date_in_past' }, { status: 400 });
    }

    // Server-side price. Never trust a client-supplied amount.
    const unitPrice = VISITOR_PACK_PRICE_USD;
    const totalAmount = unitPrice * visitors;
    const reference = generateReference();

    const booking = await prisma.booking.create({
      data: {
        reference,
        ticketType: 'visitor-pack',
        visitDate: new Date(`${date}T00:00:00.000Z`),
        adults: visitors,
        children: 0,
        totalAmount,
        currency: 'USD',
        customerName,
        customerEmail,
        locale,
        status: 'pending',
        paymentProvider: process.env.PAYMENT_PROVIDER ?? 'mock',
      },
    });

    // Record the intent to source the official 100 MAD entry ticket.
    //
    // Deliberately BEFORE payment completes and deliberately non-fatal: today
    // this only logs, and a logging failure must never cost us a sale. Once a
    // real strategy is wired up, revisit this — an affiliate purchase should
    // most likely happen AFTER payment confirmation (in a webhook), not here.
    try {
      await fulfillTicket({
        bookingId: booking.id,
        reference: booking.reference,
        visitDate: date,
        visitors,
        customerEmail,
        locale,
      });
    } catch (err) {
      console.error('[visitor-pack] fulfillTicket failed (non-fatal):', err);
    }

    const session = await payments.createCheckoutSession({
      bookingId: booking.id,
      reference: booking.reference,
      ticketName: 'Bahia Palace — Complete Visitor Pack',
      amount: unitPrice,
      quantity: visitors,
      currency: 'USD',
      customerEmail,
      locale,
      // The breakdown follows the customer onto Stripe's hosted page.
      description:
        `Official Bahia Palace entry ticket (${OFFICIAL_DOOR_PRICE_MAD} MAD, purchased for you) ` +
        `$${VISITOR_PACK_BREAKDOWN.officialTicketUSD} + audio guide, map & support ` +
        `$${VISITOR_PACK_BREAKDOWN.serviceUSD} = $${VISITOR_PACK_BREAKDOWN.totalUSD} per person`,
      cancelPath: `/${locale}/visitor-pack`,
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { paymentSessionId: session.id },
    });

    return NextResponse.json({
      url: session.url,
      bookingId: booking.id,
      reference,
      testMode: status.testMode,
    });
  } catch (err) {
    console.error('[POST /api/visitor-pack/checkout]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
