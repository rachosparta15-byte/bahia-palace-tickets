/**
 * Streams a booking's delivered QR ticket.
 *
 * ACCESS MODEL — read before changing: this is guarded by knowledge of the
 * booking id (a cuid), which is the same level of protection the
 * confirmation page at /[locale]/booking/[id] already relies on. That is a
 * deliberate match, not an oversight: a customer arriving from their own
 * confirmation link must be able to see their ticket without an account,
 * and this route must not be weaker OR stronger than the page that links
 * to it.
 *
 * It is nonetheless a bearer URL. Two consequences are enforced below:
 * nothing is served before delivery is recorded, and the response is marked
 * private and no-store so it is never held in a shared cache or CDN.
 *
 * TODO(security): if bookings ever gain accounts or a lookup form, gate
 * this on the customer's email as a second factor. A cuid is unguessable in
 * practice but it travels in URLs, referrers and screenshots.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { ensureColumns } from '@/lib/db/ensure-columns';
import { qrIsDelivered } from '@/lib/booking-lifecycle';
import { readQrFile, mimeForRef } from '@/lib/qr-storage';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await ensureColumns();

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Not delivered yet → 404 rather than 403. A "forbidden" would confirm
  // that a ticket exists for this id and is merely being withheld.
  if (!qrIsDelivered(booking) || !booking.qrFileRef) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const file = await readQrFile(booking.qrFileRef);
  if (!file) {
    console.error(
      `[qr] Booking ${booking.reference} is marked delivered but its file ` +
        `(${booking.qrFileRef}) is missing from storage.`
    );
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file), {
    headers: {
      'Content-Type': mimeForRef(booking.qrFileRef),
      'Content-Disposition': `inline; filename="bahia-palace-${booking.reference}"`,
      // private + no-store: this is one customer's ticket. It must never be
      // retained by a CDN or shared proxy where another request could hit it.
      'Cache-Control': 'private, no-store, max-age=0',
    },
  });
}
