'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, Mail, Loader2 } from 'lucide-react';

interface Props {
  bookingId: string;
  status: string;
}

export function BookingActions({ bookingId, status }: Props) {
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
      if (res.ok) {
        setMessage('Booking cancelled.');
        router.refresh();
      } else {
        const { error } = await res.json() as { error: string };
        setMessage(error ?? 'Failed to cancel.');
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
      {status !== 'cancelled' && (
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg border border-red-200 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {cancelling ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} />}
          Cancel booking
        </button>
      )}
    </div>
  );
}
