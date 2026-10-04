import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { BOOKING_MODE_KEY, DEFAULT_BOOKING_MODE, parseBookingMode } from '@/lib/booking-mode';

/*
 * Public and read-only: the one setting the ticket buttons need, so the pages
 * themselves can stay static. Cached at the edge for a minute, which is how
 * long a change in /admin/settings takes to reach visitors.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  let mode = DEFAULT_BOOKING_MODE;
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: BOOKING_MODE_KEY } });
    mode = parseBookingMode(row?.value);
  } catch {
    // A database hiccup must not break the buttons: fall back to the default.
  }
  return NextResponse.json(
    { mode },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
  );
}
