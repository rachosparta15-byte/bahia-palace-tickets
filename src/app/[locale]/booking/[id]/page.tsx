import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import QRCode from 'qrcode';
import prisma from '@/lib/db';
import { ensureColumns } from '@/lib/db/ensure-columns';
import { payments } from '@/lib/payments';
import { confirmBookingPaid } from '@/lib/payments/confirm-booking';
import { mockConfirmationAllowed } from '@/lib/payments/guard';
import { qrIsDelivered, BOOKING_STATUS } from '@/lib/booking-lifecycle';
import { AUDIO_GUIDE_URL } from '@/lib/booking';
import { buildGuideAccessUrl } from '@/lib/guide-token';
import { VisitorPackConfirmation } from '@/components/visitor-pack/VisitorPackConfirmation';
import { CancellationNotice } from '@/components/booking/CancellationNotice';
import { CheckCircle2, Calendar, Users, Mail, Download, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params:       Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ mock_success?: string; session_id?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Booking Confirmed — Bahia Palace Tickets', robots: 'noindex' };
}

/** Currency-aware total. EUR keeps its cents; the legacy USD rows never had any. */
function formatTotal(amount: number, currency: string): string {
  return currency === 'EUR' ? `€${amount.toFixed(2)}` : `$${amount.toFixed(0)}`;
}

export default async function BookingConfirmPage({ params, searchParams }: Props) {
  const { locale, id }               = await params;
  const { mock_success, session_id } = await searchParams;

  await ensureColumns();

  let booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) notFound();

  // ─── Fallback confirmation ────────────────────────────────────────
  // The Stripe WEBHOOK (/api/webhooks/stripe) is the primary, reload-
  // independent path — a payment is confirmed even if the customer never
  // returns here. These two branches remain as a fallback for the customer
  // who DOES land back on this page (e.g. local dev with no webhook
  // forwarder). All side effects — status flip, order-confirmation email,
  // lead→paid, fulfilment intent — live in confirmBookingPaid(), which is
  // idempotent, so the webhook and a page load cannot double-fire.

  // Real (test-mode) Stripe return. Arriving at this URL is NOT proof of
  // payment — the id is guessable — so confirm only if Stripe says it was
  // paid, and only for the session we recorded against this booking.
  if (
    session_id &&
    booking.status === 'pending' &&
    booking.paymentSessionId === session_id
  ) {
    const { paid } = await payments.verifyCheckoutSession(session_id);
    if (paid) {
      await confirmBookingPaid(id, { via: 'return-page', paymentSessionId: session_id });
      booking = (await prisma.booking.findUnique({ where: { id } })) ?? booking;
    }
  }

  // Confirm mock payment if needed (idempotent — only runs once).
  // Gated on the mock provider being active: with a real provider this
  // query parameter would be a free-booking exploit.
  if (mock_success === '1' && mockConfirmationAllowed() && booking.status === 'pending') {
    await confirmBookingPaid(id, { via: 'mock', paymentSessionId: `mock_${Date.now()}` });
    booking = (await prisma.booking.findUnique({ where: { id } })) ?? booking;
  }

  const qrDataUrl = await QRCode.toDataURL(booking.reference, { width: 220, margin: 2, color: { dark: '#F5E8CC', light: '#1C1108' } });
  const visitDate = booking.visitDate.toISOString().split('T')[0];
  // Paid covers BOTH states after payment: 'confirmed' (QR not yet sent) and
  // 'qr_sent'. Testing only for 'confirmed' would make a fulfilled booking
  // suddenly render as 'pending payment' the moment its QR went out.
  const isConfirmed =
    booking.status === BOOKING_STATUS.paidAwaitingQr ||
    booking.status === BOOKING_STATUS.qrSent;

  // The Visitor Pack's official ticket is not issued at purchase time (see
  // lib/fulfillment), so this QR is an order reference — NOT an entry pass.
  // Captioning it "scan at entrance" for a pack order would be a false promise.
  const isVisitorPack = booking.ticketType === 'visitor-pack';

  // The tokenised audio-guide link, minted only for a PAID pack. Same
  // deterministic token as the one in the confirmation email, so both open the
  // same activation budget rather than each granting a fresh one. Null when
  // GUIDE_TOKEN_SECRET is unset — the panel then says the link is being
  // prepared instead of handing out the ungated URL.
  const audioGuideUrl =
    isVisitorPack && isConfirmed
      ? buildGuideAccessUrl(AUDIO_GUIDE_URL, {
          reference: booking.reference,
          partySize: booking.adults,
          visitDate,
        })
      : null;

  return (
    <div className="min-h-screen py-16 px-6 bg-[#1C1108]">
      <div className="max-w-2xl mx-auto">

        {/* Status banner */}
        {isConfirmed ? (
          <div className="flex items-center gap-3 bg-[#8FA63C]/08 border border-[#8FA63C]/25 rounded-xl px-5 py-4 mb-8">
            <CheckCircle2 size={22} className="text-[#8FA63C] shrink-0" />
            <div>
              <p className="font-semibold text-[#F5E8CC] text-sm">
                {isVisitorPack ? 'Payment confirmed!' : 'Booking confirmed!'}
              </p>
              {/* For the Visitor Pack the official ticket has NOT been issued yet
                  (see lib/fulfillment), so we must not claim it was sent. */}
              <p className="text-xs text-[#C4A882]">
                {isVisitorPack
                  ? `Your order confirmation has been sent to ${booking.customerEmail}. Your official entry ticket follows separately — see below.`
                  : `Your ticket has been sent to ${booking.customerEmail}`}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-[#E8A33D]/08 border border-[#E8A33D]/30 rounded-xl px-5 py-4 mb-8">
            <p className="font-semibold text-[#F5E8CC] text-sm">Booking pending — awaiting payment confirmation.</p>
          </div>
        )}

        {/* Main card */}
        <div className="bg-[#251A0F] rounded-2xl border border-[rgba(232,163,61,0.13)] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          {/* Header */}
          <div className="bg-[#2E1F12] px-8 py-6 text-white text-center">
            <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Booking Reference</p>
            <p
              className="text-4xl font-bold tracking-wider"
              style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.12em' }}
            >
              {booking.reference}
            </p>
          </div>

          {/* Body */}
          <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              {/* QR code */}
              <div className="flex flex-col items-center">
                <img
                  src={qrDataUrl}
                  alt={`QR code for booking ${booking.reference}`}
                  width={180}
                  height={180}
                  className="rounded-xl"
                />
                <p className="text-xs text-[#C4A882] mt-2 text-center">
                  {isVisitorPack ? 'Your order reference' : 'Scan at entrance'}
                </p>
              </div>

              {/* Booking details */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[#C4A882] uppercase tracking-wide mb-1">Ticket</p>
                  <p className="font-semibold text-[#F5E8CC] text-sm capitalize">
                    {booking.ticketType.replace(/-/g, ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#C4A882] uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Calendar size={10} /> Visit Date
                  </p>
                  <p className="font-semibold text-[#F5E8CC] text-sm">{visitDate}</p>
                </div>
                <div>
                  <p className="text-xs text-[#C4A882] uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Users size={10} /> Visitors
                  </p>
                  <p className="font-semibold text-[#F5E8CC] text-sm">
                    {booking.adults} adult{booking.adults !== 1 ? 's' : ''}
                    {booking.children > 0 && `, ${booking.children} child${booking.children !== 1 ? 'ren' : ''} (free)`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#C4A882] uppercase tracking-wide mb-1">Total Paid</p>
                  <p className="font-bold text-[#C4452D] text-xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {formatTotal(booking.totalAmount, booking.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#C4A882] uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Mail size={10} /> Sent to
                  </p>
                  <p className="font-semibold text-[#F5E8CC] text-sm break-all">{booking.customerEmail}</p>
                </div>
              </div>
            </div>

            {/* Info box */}
            <div className="bg-[#2E1F12] rounded-xl p-4 text-sm text-[#C4A882] space-y-1.5 mb-6">
              <p>📍 <strong>Meeting point:</strong> Main entrance, Rue Riad Zitoun el Jedid, Marrakech Medina</p>
              <p>🕘 <strong>Opening hours:</strong> Daily 9:00 AM – 5:00 PM (last entry 4:30 PM)</p>
              {!isVisitorPack && (
                <p>📱 Show this page or the email QR code at the entrance — no printing required.</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={qrDataUrl}
                download={`bahia-palace-${booking.reference}.png`}
                className="flex-1 flex items-center justify-center gap-2 border border-[rgba(232,163,61,0.25)] text-[#F5E8CC] font-semibold text-sm px-5 py-3 rounded-xl hover:border-[#C4452D] hover:text-[#C4452D] transition-colors"
              >
                <Download size={15} /> Save QR Code
              </a>
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 bg-[#C4452D] text-white font-semibold text-sm px-5 py-3 rounded-xl hover:bg-[#A33824] transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Visitor Pack: official ticket + audio guide status (both pending). */}
        {isVisitorPack && (
          <VisitorPackConfirmation
            locale={locale}
            visitors={booking.adults}
            reference={booking.reference}
            confirmed={isConfirmed}
            audioGuideUrl={audioGuideUrl}
            qrDelivered={qrIsDelivered(booking)}
            qrCode={booking.qrCode}
            hasQrFile={Boolean(booking.qrFileRef)}
            bookingId={booking.id}
          />
        )}

        {/* Cancellation — state-aware. Replaces the old unconditional
            "Need to cancel? Contact us" line, which offered cancellation
            even after the QR had gone out and the policy had closed it. */}
        <CancellationNotice
          locale={locale}
          reference={booking.reference}
          status={booking.status}
          qrDelivered={qrIsDelivered(booking)}
        />
      </div>
    </div>
  );
}
