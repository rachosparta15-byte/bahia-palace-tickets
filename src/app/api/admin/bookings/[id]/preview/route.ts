/**
 * Send the ticket-delivery email to the admin, so it can be read before a
 * customer reads it.
 *
 * The real delivery route is irreversible: attaching the QR marks the booking
 * delivered, ends the refund right, and mails the customer. There was no way
 * to see what that email looks like without doing it to somebody.
 *
 * It takes the SAME payload as the real route — the file staged in the form,
 * the code typed into it — so what arrives is the message that would arrive,
 * attachment included. A preview that describes the email instead of being it
 * is worth nothing: the first version left the file out and reported "no
 * ticket", which was true of the preview and would have been true of the
 * delivery.
 *
 * It writes nothing: no status, no qrSentAt, no stored file, no audit row.
 * Two things are deliberately faked:
 *
 *   - with no code and no file, the QR box falls back to the booking
 *     reference, since a preview has no ministry ticket behind it;
 *   - the audio-guide links are placeholders, NOT the customer's codes. Those
 *     bind to the first device that opens them, so previewing a real one would
 *     burn the seat the customer paid for.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/auth';
import { email } from '@/lib/email';
import { AUDIO_GUIDE_URL } from '@/lib/booking';
import { getWhatsAppNumber } from '@/lib/whatsapp';
import { detectQrType, MAX_QR_MB } from '@/lib/qr-storage';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  // Same reading as the real route, minus the persistence.
  let code: string | null = null;
  let attachment: { filename: string; content: string } | undefined;

  if ((req.headers.get('content-type') ?? '').includes('multipart/form-data')) {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const typed = form.get('code');

    if (file && file.size > 0) {
      if (file.size > MAX_QR_MB * 1024 * 1024) {
        return NextResponse.json(
          { error: 'file_too_large', message: `Max ${MAX_QR_MB} MB.` },
          { status: 400 },
        );
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const detected = detectQrType(buffer);
      if (!detected) {
        return NextResponse.json(
          { error: 'unsupported_type', message: 'QR must be a PNG, JPG or PDF.' },
          { status: 400 },
        );
      }
      attachment = {
        filename: `bahia-palace-ticket-${booking.reference}.${detected.ext}`,
        content: buffer.toString('base64'),
      };
    }

    if (typeof typed === 'string' && typed.trim()) code = typed.trim().slice(0, 200);
  }

  const seats = Math.max(1, booking.adults + booking.children);

  try {
    await email.sendTicketDelivery({
      to,
      customerName: booking.customerName,
      reference: `${booking.reference} (PREVIEW)`,
      qrCode: code ?? booking.qrCode ?? (attachment ? undefined : booking.reference),
      visitDate: booking.visitDate.toISOString().split('T')[0],
      whatsapp: getWhatsAppNumber(),
      ...(attachment ? { attachment } : {}),
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

  console.log(
    `[preview] ${booking.reference} previewed to ${to} by ${admin.email}` +
      `${attachment ? ' with attachment' : ''}`,
  );
  return NextResponse.json({ ok: true, to, attached: Boolean(attachment) });
}
