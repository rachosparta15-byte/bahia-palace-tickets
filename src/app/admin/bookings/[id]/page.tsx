import prisma from '@/lib/db';
import { ensureColumns } from '@/lib/db/ensure-columns';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BookingActions } from '@/components/admin/BookingActions';
import { QrDelivery } from '@/components/admin/QrDelivery';
import { GuideCodes, type GuideCodeRow } from '@/components/admin/GuideCodes';
import { formatGuideCode } from '@/lib/guide-code';
import { qrIsDelivered } from '@/lib/booking-lifecycle';
import { getWhatsAppNumber } from '@/lib/whatsapp';
import { adminDateLong, adminDateTime } from '@/lib/admin/when';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

function statusColor(status: string) {
  if (status === 'confirmed') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (status === 'qr_sent')   return 'bg-sky-100     text-sky-800     border-sky-200';
  if (status === 'pending')   return 'bg-amber-100   text-amber-800   border-amber-200';
  if (status === 'cancelled') return 'bg-red-100     text-red-800     border-red-200';
  return 'bg-gray-100 text-gray-700 border-gray-200';
}

/** Human label — "confirmed" alone doesn't say whether the ticket went out. */
function statusLabel(status: string) {
  if (status === 'confirmed') return 'paid — QR not sent';
  if (status === 'qr_sent')   return 'QR delivered';
  if (status === 'pending')   return 'awaiting payment';
  return status;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-[#E8D5B7]/60 last:border-0">
      <dt className="w-40 shrink-0 text-xs font-semibold text-[#8B6344] uppercase tracking-wide pt-0.5">{label}</dt>
      <dd className="text-sm text-[#3D2817]">{value}</dd>
    </div>
  );
}

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params;
  await ensureColumns();
  const booking = await prisma.booking.findUnique({ where: { id } });

  /*
   * The guide codes for this booking, if any. Read rather than issued: this
   * page must show what the customer actually holds, not conjure codes for a
   * booking that was never paid.
   */
  const guideCodes: GuideCodeRow[] = booking
    ? (
        await prisma.guideCode.findMany({
          where: { bookingId: booking.id },
          orderBy: { seat: 'asc' },
        })
      ).map((row) => ({
        code: row.code,
        display: formatGuideCode(row.code),
        seat: row.seat,
        claimed: row.deviceId !== null,
        claimedAt: row.claimedAt ? row.claimedAt.toISOString() : null,
        lastSeenAt: row.lastSeenAt ? row.lastSeenAt.toISOString() : null,
        unlockCount: row.unlockCount,
      }))
    : [];
  if (!booking) notFound();

  return (
    <div className="p-8 max-w-4xl">
      <Link
        href="/admin/bookings"
        className="inline-flex items-center gap-2 text-sm text-[#5C3D20] hover:text-[#3D2817] mb-6"
      >
        <ArrowLeft size={14} />
        Back to bookings
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <h1
          className="text-2xl font-bold text-[#3D2817]"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Booking {booking.reference}
        </h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColor(booking.status)}`}>
          {statusLabel(booking.status)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E8D5B7] px-6 py-4">
            <h2 className="font-semibold text-[#3D2817] mb-4">Booking Details</h2>
            <dl>
              <Row label="Reference"     value={<span className="font-mono">{booking.reference}</span>} />
              <Row label="Ticket"        value={booking.ticketType} />
              <Row label="Visit Date"    value={adminDateLong(booking.visitDate)} />
              <Row label="Adults"        value={booking.adults} />
              <Row label="Children"      value={booking.children} />
              <Row label="Total Amount"  value={<span className="font-semibold">${booking.totalAmount.toFixed(2)} {booking.currency}</span>} />
              <Row label="Payment"       value={booking.paymentProvider} />
              {booking.paymentSessionId && (
                <Row label="Session ID"  value={<span className="font-mono text-xs">{booking.paymentSessionId}</span>} />
              )}
              {booking.specialRequests && (
                <Row label="Requests"    value={booking.specialRequests} />
              )}
            </dl>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8D5B7] px-6 py-4">
            <h2 className="font-semibold text-[#3D2817] mb-4">Customer</h2>
            <dl>
              <Row label="Name"    value={booking.customerName} />
              <Row label="Email"   value={<a href={`mailto:${booking.customerEmail}`} className="text-[#2E4A7B] hover:underline">{booking.customerEmail}</a>} />
              {booking.customerPhone && <Row label="Phone"   value={booking.customerPhone} />}
              {booking.customerCountry && <Row label="Country" value={booking.customerCountry} />}
              <Row label="Locale"  value={booking.locale} />
            </dl>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8D5B7] px-6 py-4">
            <h2 className="font-semibold text-[#3D2817] mb-4">Timestamps</h2>
            <dl>
              <Row label="Created" value={adminDateTime(booking.createdAt)} />
              <Row label="Updated" value={adminDateTime(booking.updatedAt)} />
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          {/* QR delivery sits above Actions on purpose: it is the step that
              decides whether "Cancel booking" below is still permitted. */}
          <div className="bg-white rounded-2xl border border-[#E8D5B7] px-5 py-5">
            <h2 className="font-semibold text-[#3D2817] mb-4">Fulfilment</h2>
            <QrDelivery
              bookingId={booking.id}
              status={booking.status}
              qrSentAt={booking.qrSentAt ? booking.qrSentAt.toISOString() : null}
              qrCode={booking.qrCode}
              hasFile={Boolean(booking.qrFileRef)}
              qrDeliveredBy={booking.qrDeliveredBy}
              customerEmail={booking.customerEmail}
              customerPhone={booking.customerPhone}
              whatsappNumber={getWhatsAppNumber() ?? ''}
              reference={booking.reference}
            />
          </div>

          {/* Below fulfilment because it is a support tool, not a step: the
              codes issue themselves on payment and need no action unless a
              customer's phone lost them. */}
          <GuideCodes reference={booking.reference} codes={guideCodes} />

          <div className="bg-white rounded-2xl border border-[#E8D5B7] px-5 py-5">
            <h2 className="font-semibold text-[#3D2817] mb-4">Actions</h2>
            <BookingActions
              bookingId={booking.id}
              status={booking.status}
              qrDelivered={qrIsDelivered(booking)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
