/**
 * Mark a booking's QR ticket as delivered (manual fulfilment).
 *
 * The owner buys the official ticket on the Ministry portal by hand and
 * sends the QR to the customer by hand. This endpoint records that it
 * happened. It deliberately does NOT fetch or generate a ticket.
 *
 * Recording delivery is irreversible and consequential: it ends the
 * customer's right to a refund under Section 5 of the Terms of Sale. So it
 * requires an admin session, refuses on anything not paid-and-undelivered,
 * and writes an audit trail of who did it and when.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { ensureColumns } from '@/lib/db/ensure-columns';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/auth';
import { BOOKING_STATUS, canMarkQrSent } from '@/lib/booking-lifecycle';
import { detectQrType, saveQrFile, MAX_QR_MB } from '@/lib/qr-storage';
import { email } from '@/lib/email';
import { AUDIO_GUIDE_URL } from '@/lib/booking';
import { buildGuideCodeUrl } from '@/lib/guide-code';
import { getWhatsAppNumber } from '@/lib/whatsapp';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  const admin = token ? await verifyAdminToken(token) : null;
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await ensureColumns();

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // State check BEFORE reading the body or touching disk: nothing should be
  // written for a booking that must not be fulfilled.
  const decision = canMarkQrSent(booking);
  if (!decision.allowed) {
    return NextResponse.json(
      { error: decision.reason, message: decision.message },
      { status: decision.status }
    );
  }

  const contentType = req.headers.get('content-type') ?? '';
  let qrCode: string | null = null;
  let qrFileRef: string | null = null;

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const code = form.get('code');

    if (file && file.size > 0) {
      if (file.size > MAX_QR_MB * 1024 * 1024) {
        return NextResponse.json(
          { error: 'file_too_large', message: `Max ${MAX_QR_MB} MB.` },
          { status: 400 }
        );
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const detected = detectQrType(buffer);
      if (!detected) {
        return NextResponse.json(
          { error: 'unsupported_type', message: 'QR must be a PNG, JPG or PDF.' },
          { status: 400 }
        );
      }
      qrFileRef = await saveQrFile(id, buffer, detected.ext);
    }

    if (typeof code === 'string' && code.trim()) qrCode = code.trim().slice(0, 200);
  } else {
    const body = (await req.json().catch(() => ({}))) as { code?: string };
    if (typeof body.code === 'string' && body.code.trim()) {
      qrCode = body.code.trim().slice(0, 200);
    }
  }

  // Refuse to mark delivered with nothing recorded. An empty "delivered"
  // would take away the refund right while leaving no evidence of what the
  // customer actually received.
  if (!qrCode && !qrFileRef) {
    return NextResponse.json(
      {
        error: 'nothing_to_deliver',
        message: 'Attach a QR file or enter a ticket code before marking as sent.',
      },
      { status: 400 }
    );
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status: BOOKING_STATUS.qrSent,
      qrSentAt: new Date(),
      qrDeliveredBy: `admin:${admin.email}`,
      ...(qrCode ? { qrCode } : {}),
      ...(qrFileRef ? { qrFileRef } : {}),
    },
  });

  // EMAIL delivery is now automated: the customer gets their ticket the moment
  // it is attached here, without the owner copy-pasting. Non-fatal — the QR is
  // already recorded as delivered, so a mail failure must not roll that back
  // (it would wrongly reopen the refund window). WHATSAPP delivery stays
  // manual: there is no server-side WhatsApp API wired up, only the wa.me
  // link the owner uses by hand.
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? '';
    await email.sendTicketDelivery({
      to: updated.customerEmail,
      customerName: updated.customerName,
      reference: updated.reference,
      qrCode: qrCode ?? undefined,
      bookingUrl: base ? `${base}/${updated.locale}/booking/${updated.id}` : undefined,
      visitDate: updated.visitDate.toISOString().split('T')[0],
      whatsapp: getWhatsAppNumber(),
      /*
       * The guide links ride along with the ticket, which is what the published
       * delivery policy promises: one delivery containing everything, nothing
       * sent piecemeal. They used to go out with the order confirmation, which
       * also started the digital-content clock while the terms were still
       * offering free cancellation until delivery.
       *
       * Read, not issued. Issuing here would mint codes for a booking that was
       * never paid — the issuer runs at payment confirmation.
       */
      audioGuideUrls: (
        await prisma.guideCode.findMany({
          where: { bookingId: updated.id },
          orderBy: { seat: 'asc' },
        })
      ).map((row) => buildGuideCodeUrl(AUDIO_GUIDE_URL, row.code)),
    });
  } catch (err) {
    console.error('[qr] ticket-delivery email failed (non-fatal):', err);
  }

  console.log(
    `[qr] Booking ${updated.reference} marked delivered by ${admin.email}. ` +
      `Ticket email sent to ${updated.customerEmail}` +
      (updated.customerPhone ? `; WhatsApp to ${updated.customerPhone} still manual` : '') +
      `. ${qrFileRef ? `file=${qrFileRef}` : ''}${qrCode ? ' code=(recorded)' : ''}`
  );

  return NextResponse.json({
    ok: true,
    status: updated.status,
    qrSentAt: updated.qrSentAt,
    // The customer's refund right ends here — surfaced so the admin UI can
    // say so plainly rather than just flipping a badge.
    refundableFromNowOn: false,
  });
}
