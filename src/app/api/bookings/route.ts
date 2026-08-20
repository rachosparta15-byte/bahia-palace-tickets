import { NextRequest, NextResponse } from 'next/server';
import { clientIp, isSubmissionLimited, recordSubmission } from '@/lib/rate-limit';
import { z } from 'zod';
import prisma from '@/lib/db';
import { payments } from '@/lib/payments';
import { generateReference } from '@/lib/utils';
import { isLegacyBookableSlug, TICKET_PRICES } from '@/lib/ticket-data';
import { earliestVisitDate, isTooSoon } from '@/config/booking-window';
import { getPaymentsStatus } from '@/lib/payments/guard';

const schema = z.object({
  ticket:          z.string(),
  date:            z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  adults:          z.coerce.number().int().min(1).max(20),
  children:        z.coerce.number().int().min(0).max(20),
  customerName:    z.string().min(2).max(120),
  customerEmail:   z.string().email(),
  customerPhone:   z.string().optional(),
  locale:          z.string().default('en'),
  specialRequests: z.string().max(500).optional(),
});

/*
 * Same ceiling as /api/checkout, and for the same reason: this route writes a
 * booking row from anonymous input and had nothing stopping a loop. Ten an hour
 * sits above anything a real person does — a retried card, a changed date — and
 * well below anything a script does.
 */
const BOOKINGS_MAX_PER_HOUR = 10;
const BOOKINGS_WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    if (await isSubmissionLimited('bookings', ip, BOOKINGS_MAX_PER_HOUR, BOOKINGS_WINDOW_MS)) {
      return NextResponse.json(
        { error: 'Too many booking attempts from this connection. Please try again later.' },
        { status: 429 },
      );
    }

    const body  = await req.json();
    const input = schema.safeParse(body);
    if (!input.success) {
      return NextResponse.json({ error: input.error.flatten() }, { status: 400 });
    }

    const { ticket, date, adults, children, customerName, customerEmail, customerPhone, locale, specialRequests } = input.data;

    // Rejects both unknown slugs and products that have moved to their own
    // gated checkout (e.g. visitor-pack) — see isLegacyBookableSlug.
    await recordSubmission('bookings', ip);

    if (!isLegacyBookableSlug(ticket)) {
      return NextResponse.json({ error: 'Unknown ticket type' }, { status: 400 });
    }

    /*
     * The booking window. This route had no date check at all beyond the
     * YYYY-MM-DD shape, so it would happily take money for a visit last March.
     * We source each ticket from the monument by hand after payment clears,
     * which is why the window exists — see config/booking-window.ts.
     */
    if (isTooSoon(date)) {
      return NextResponse.json(
        { error: 'visit_date_too_soon', earliest: earliestVisitDate() },
        { status: 422 },
      );
    }

    // The switch is the authority on whether any checkout may start, and this
    // route was never asking it.
    if (!getPaymentsStatus().enabled) {
      return NextResponse.json({ error: 'booking_not_open' }, { status: 503 });
    }

    const price       = TICKET_PRICES[ticket];
    /*
     * Everyone who needs a ticket is charged the same. The gate tariff is
     * 100 MAD for an adult and 50 MAD for a child aged 7 to 13, and children
     * under 7 enter free — so `children` here means 7 to 13, and the form
     * labels it that way. Under-7s are simply not entered.
     *
     * This used to be `adults * price` while the form showed children as
     * "Free", which meant a family could be told their ten-year-old was free,
     * arrive, and be turned away for a ticket we never bought. One price per
     * head removes both the contradiction and the refusal.
     */
    const totalAmount = (adults + children) * price;
    const reference   = generateReference();
    const visitDate   = new Date(date + 'T00:00:00.000Z');

    const booking = await prisma.booking.create({
      data: {
        reference,
        ticketType:    ticket,
        visitDate,
        adults,
        children,
        totalAmount,
        currency:      'EUR',
        customerName,
        customerEmail,
        customerPhone: customerPhone ?? null,
        locale,
        specialRequests: specialRequests ?? null,
        status:        'pending',
        paymentProvider: process.env.PAYMENT_PROVIDER ?? 'mock',
      },
    });

    const session = await payments.createCheckoutSession({
      bookingId:     booking.id,
      reference:     booking.reference,
      ticketName:    ticket,
      amount:        totalAmount,
      currency:      'EUR',
      customerEmail,
      locale,
    });

    return NextResponse.json({ url: session.url, bookingId: booking.id, reference });
  } catch (err) {
    console.error('[POST /api/bookings]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
