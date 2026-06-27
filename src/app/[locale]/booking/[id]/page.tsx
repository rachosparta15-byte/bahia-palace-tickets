import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import QRCode from 'qrcode';
import prisma from '@/lib/db';
import { email } from '@/lib/email';
import { CheckCircle2, Calendar, Users, Mail, Download, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params:       Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ mock_success?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Booking Confirmed — Bahia Palace Tickets', robots: 'noindex' };
}

export default async function BookingConfirmPage({ params, searchParams }: Props) {
  const { id }          = await params;
  const { mock_success } = await searchParams;

  let booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) notFound();

  // Confirm mock payment if needed (idempotent — only runs once)
  if (mock_success === '1' && booking.status === 'pending') {
    booking = await prisma.booking.update({
      where: { id },
      data:  { status: 'confirmed', paymentSessionId: `mock_${Date.now()}` },
    });
    await email.sendBookingConfirmation({
      to:           booking.customerEmail,
      customerName: booking.customerName,
      reference:    booking.reference,
      ticketType:   booking.ticketType,
      visitDate:    booking.visitDate.toISOString().split('T')[0],
      adults:       booking.adults,
      children:     booking.children,
      totalAmount:  booking.totalAmount,
      currency:     booking.currency,
      locale:       booking.locale,
    });
  }

  const qrDataUrl = await QRCode.toDataURL(booking.reference, { width: 220, margin: 2, color: { dark: '#F5E8CC', light: '#1C1108' } });
  const visitDate = booking.visitDate.toISOString().split('T')[0];
  const isConfirmed = booking.status === 'confirmed';

  return (
    <div className="min-h-screen py-16 px-6 bg-[#1C1108]">
      <div className="max-w-2xl mx-auto">

        {/* Status banner */}
        {isConfirmed ? (
          <div className="flex items-center gap-3 bg-[#8FA63C]/08 border border-[#8FA63C]/25 rounded-xl px-5 py-4 mb-8">
            <CheckCircle2 size={22} className="text-[#8FA63C] shrink-0" />
            <div>
              <p className="font-semibold text-[#F5E8CC] text-sm">Booking confirmed!</p>
              <p className="text-xs text-[#C4A882]">Your ticket has been sent to {booking.customerEmail}</p>
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
                <p className="text-xs text-[#C4A882] mt-2 text-center">Scan at entrance</p>
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
                    ${booking.totalAmount.toFixed(0)}
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
              <p>📱 Show this page or the email QR code at the entrance — no printing required.</p>
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

        {/* Cancel link */}
        <p className="text-center mt-6 text-sm text-[#C4A882]">
          Need to cancel?{' '}
          <Link href="/contact" className="text-[#C4452D] hover:underline">
            Contact us
          </Link>{' '}
          with reference{' '}
          <span className="font-semibold">{booking.reference}</span>
        </p>
      </div>
    </div>
  );
}
