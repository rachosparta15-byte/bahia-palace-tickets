'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, Mail, Loader2 } from 'lucide-react';

interface Props {
  bookingId: string;
  status: string;
  /**
   * QR already delivered → cancellation is closed (Terms of Sale, §5).
   *
   * This only hides the button. The server refuses independently in
   * /api/admin/bookings/[id]/cancel — a disabled control is a courtesy to
   * the operator, never the thing that enforces the policy.
   */
  qrDelivered: boolean;
}

export function BookingActions({ bookingId, status, qrDelivered }: Props) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [resending,  setResending]  = useState(false);
  const [message,    setMessage]    = useState('');

  async function handleCancel() {
    if (!confirm('Cancel this booking? This cannot be undone.')) return;
    setCancelling(true);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/cancel`, { method: 'POST' });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        refundAutomated?: boolean;
        alreadyRefunded?: boolean;
        refundId?: string;
        refundAmount?: number;
        refundCurrency?: string;
      };
      if (res.ok) {
        const amount =
          typeof data.refundAmount === 'number'
            ? `${data.refundCurrency} ${data.refundAmount.toFixed(2)}`
            : 'the payment';
        const ref = data.refundId ? ` (refund ${data.refundId})` : '';
        setMessage(
          data.refundAutomated
            ? data.alreadyRefunded
              ? `Booking cancelled. ${amount} had already been refunded${ref}.`
              : `Booking cancelled and ${amount} refunded automatically${ref}.`
            : // Fallback wording for the no-session / manual case.
              `Booking cancelled. Refund ${amount} manually in Stripe — this did NOT happen automatically.`
        );
        router.refresh();
      } else {
        // Prefer the server's explanation: for a refused cancellation it
        // cites the policy, which is more use than a bare error code.
        setMessage(data.message ?? data.error ?? 'Failed to cancel.');
      }
    } catch {
      setMessage('Network error.');
    } finally {
      setCancelling(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/resend`, { method: 'POST' });
      if (res.ok) {
        setMessage('Confirmation email sent.');
      } else {
        const { error } = await res.json() as { error: string };
        setMessage(error ?? 'Failed to resend.');
      }
    } catch {
      setMessage('Network error.');
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="space-y-3">
      {message && (
        <p className="text-sm text-[#5C3D20] bg-[#E8A33D]/10 border border-[#E8A33D]/30 rounded-lg px-4 py-2">
          {message}
        </p>
      )}
      <button
        onClick={handleResend}
        disabled={resending || status !== 'confirmed'}
        className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg border border-[#D4BC96] text-sm font-medium text-[#3D2817] hover:bg-[#FAF3E7] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {resending ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
        Resend confirmation email
      </button>
      {status !== 'cancelled' &&
        (qrDelivered ? (
          <p className="rounded-lg border border-[#D4BC96] bg-[#FAF3E7] px-4 py-2.5 text-xs text-[#5C3D20]">
            Cancellation is closed: the QR code has been delivered, so the service is
            provided under §5 of the Terms of Sale.
          </p>
        ) : (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg border border-red-200 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {cancelling ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} />}
            Cancel booking
          </button>
        ))}
    </div>
  );
}
