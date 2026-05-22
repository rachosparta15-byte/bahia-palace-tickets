import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { payments } from '@/lib/payments';
import { generateReference } from '@/lib/utils';
import { isValidTicketSlug, TICKET_PRICES } from '@/lib/ticket-data';

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

export async function POST(req: NextRequest) {
  try {
    const body  = await req.json();
    const input = schema.safeParse(body);
    if (!input.success) {
      return NextResponse.json({ error: input.error.flatten() }, { status: 400 });
    }

    const { ticket, date, adults, children, customerName, customerEmail, customerPhone, locale, specialRequests } = input.data;

    if (!isValidTicketSlug(ticket)) {
      return NextResponse.json({ error: 'Unknown ticket type' }, { status: 400 });
    }

    const price       = TICKET_PRICES[ticket];
    const totalAmount = adults * price;
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
