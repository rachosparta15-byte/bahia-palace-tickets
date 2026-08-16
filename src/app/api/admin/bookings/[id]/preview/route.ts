/**
 * Send the ticket-delivery email to the admin, so it can be read before a
 * customer reads it.
 *
 * The real delivery route is irreversible: attaching the QR marks the booking
 * delivered, ends the refund right, and mails the customer. There was no way
 * to see what that email looks like without doing it to somebody.
 *
 * This route touches nothing. No status, no qrSentAt, no audit row — it
 * renders the same template with the same booking and sends it to whoever is
 * signed in. Two things are deliberately faked:
 *
 *   - the QR encodes the booking reference rather than a ministry code, since
 *     a preview by definition has no real ticket behind it;
 *   - the audio-guide links are placeholders, NOT the customer's codes. Those
 *     bind to the first device that opens them, so previewing a real one would
 *     burn the seat the customer paid for.
 *
 * The subject is prefixed so a preview sitting in the inbox next to a real
 * delivery cannot be mistaken for one.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/auth';
import { email } from '@/lib/email';
import { AUDIO_GUIDE_URL } from '@/lib/booking';
import { getWhatsAppNumber } from '@/lib/whatsapp';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  const admin = token ? await verifyAdminToken(token) : null;
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Sent to the signed-in admin, never to an address typed into a form: a
  // preview that can be addressed anywhere is a way to mail a stranger a
  // ticket-shaped email from our domain.
  const to = admin.email;
  if (!to) {
    return NextResponse.json(
      { error: 'This admin account has no email address to preview to.' },
      { status: 400 },
    );
  }

  const seats = Math.max(1, booking.adults + booking.children);

  try {
    await email.sendTicketDelivery({
      to,
      customerName: booking.customerName,
      reference: `${booking.reference} (PREVIEW)`,
      qrCode: booking.qrCode ?? booking.reference,
      visitDate: booking.visitDate.toISOString().split('T')[0],
      whatsapp: getWhatsAppNumber(),
      // Placeholders. Real codes are single-device and would be spent by the
      // first tap in this inbox.
      audioGuideUrls: Array.from(
        { length: seats },
        (_, i) => `${AUDIO_GUIDE_URL}/?k=PREVIEW-SEAT-${i + 1}`,
      ),
    });
  } catch (err) {
    console.error('[preview] ticket-delivery preview failed:', err);
    return NextResponse.json({ error: 'Could not send the preview.' }, { status: 502 });
  }

  console.log(`[preview] ${booking.reference} previewed to ${to} by ${admin.email}`);
  return NextResponse.json({ ok: true, to });
}
