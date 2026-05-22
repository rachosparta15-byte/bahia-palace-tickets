import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/auth';
import { email } from '@/lib/email';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (booking.status !== 'confirmed') {
    return NextResponse.json({ error: 'Can only resend for confirmed bookings' }, { status: 400 });
  }

  await email.sendBookingConfirmation({
    to:           booking.customerEmail,
    customerName: booking.customerName,
    reference:    booking.reference,
    ticketType:   booking.ticketType,
    visitDate:    new Date(booking.visitDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    adults:       booking.adults,
    children:     booking.children,
    totalAmount:  booking.totalAmount,
    currency:     booking.currency,
    locale:       booking.locale,
  });

  return NextResponse.json({ ok: true });
}
