import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { ensureColumns } from '@/lib/db/ensure-columns';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/auth';
import { BOOKING_STATUS, canCancel } from '@/lib/booking-lifecycle';
import { payments } from '@/lib/payments';
import { email } from '@/lib/email';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await ensureColumns();

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Section 5 of the Terms of Sale, enforced. The rule lives in
  // booking-lifecycle.ts so this route and any future customer-facing
  // cancellation cannot drift apart and reach different answers about the
  // same booking. Note this fires even for an admin: once the QR is out,
  // the customer holds a ticket the Ministry will not refund us for, so
  // "cancel and refund" is not ours to grant either.
  const decision = canCancel(booking);
  if (!decision.allowed) {
    return NextResponse.json(
      { error: decision.reason, message: decision.message },
      { status: decision.status }
    );
  }

  // ─── Refund, then cancel ───────────────────────────────────────────
  // Order of operations is deliberate: refund FIRST, and only mark cancelled
  // once the money is actually on its way back. Marking cancelled on a refund
  // that then fails would tell the customer they have been refunded when they
  // have not — the one outcome §5 of the Terms of Sale must never produce.

  // Idempotency guard: a retried request must not refund twice. `refundId`
  // is set only after a successful refund, so its presence means "done".
  if (booking.refundId) {
    if (booking.status !== BOOKING_STATUS.cancelled) {
      await prisma.booking.update({
        where: { id },
        data: { status: BOOKING_STATUS.cancelled },
      });
    }
    return NextResponse.json({
      ok: true,
      refundAutomated: true,
      alreadyRefunded: true,
      refundId: booking.refundId,
      refundAmount: booking.totalAmount,
      refundCurrency: booking.currency,
    });
  }

  // A paid booking always has a session id (set at checkout). If one is
  // missing, refuse rather than cancel-without-refund — surface it so the
  // owner can refund by hand.
  if (!booking.paymentSessionId) {
    return NextResponse.json(
      {
        error: 'no_payment_session',
        message:
          'This booking has no payment session on file. Refund it manually in Stripe, then cancel.',
      },
      { status: 409 }
    );
  }

  // booking.id as the idempotency key: a retried refund for the same booking
  // cannot become a second refund at the provider.
  const refund = await payments.refundPayment(booking.paymentSessionId, undefined, booking.id);
  if (!refund.ok) {
    // Do NOT mark cancelled — leave the booking exactly as it was so a retry
    // is safe and the admin sees an honest failure.
    return NextResponse.json(
      {
        error: 'refund_failed',
        message:
          'The refund could not be processed. The booking has NOT been cancelled. ' +
          'Try again, or refund manually in Stripe.',
      },
      { status: 502 }
    );
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status: BOOKING_STATUS.cancelled,
      refundId: refund.refundId ?? null,
      refundedAt: new Date(),
    },
  });

  // Refund confirmation email — non-fatal. The refund has already happened;
  // a mail failure must not make the route report the refund as failed.
  try {
    await email.sendRefundConfirmation({
      to: updated.customerEmail,
      customerName: updated.customerName,
      reference: updated.reference,
      amount: updated.totalAmount,
      currency: updated.currency,
    });
  } catch (err) {
    console.error('[cancel] refund-confirmation email failed (non-fatal):', err);
  }

  console.log(
    `[cancel] Booking ${updated.reference} refunded (${updated.currency} ` +
      `${updated.totalAmount.toFixed(2)}, refund ${refund.refundId}) and cancelled.`
  );

  return NextResponse.json({
    ok: true,
    refundAutomated: true,
    refundId: refund.refundId,
    refundAmount: updated.totalAmount,
    refundCurrency: updated.currency,
  });
}
