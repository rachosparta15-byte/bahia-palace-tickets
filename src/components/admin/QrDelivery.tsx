'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, Upload, Loader2, CheckCircle2, AlertTriangle, ExternalLink, Mail } from 'lucide-react';

interface Props {
  bookingId: string;
  status: string;
  qrSentAt: string | null;
  qrCode: string | null;
  hasFile: boolean;
  qrDeliveredBy: string | null;
  customerEmail: string;
  customerPhone: string | null;
  /** Digits only, no "+". Empty when no WhatsApp number is configured. */
  whatsappNumber: string;
  reference: string;
}

/**
 * Attach the QR ticket and record it as delivered.
 *
 * This is the single most consequential button in the admin: pressing it
 * ends the customer's right to a refund under Section 5 of the Terms of
 * Sale, and there is no undo — `qrSentAt` is one-way because the customer
 * really does have the code afterwards. The UI states that in words before
 * the click, and the confirm dialog repeats it.
 */
export function QrDelivery({
  bookingId,
  status,
  qrSentAt,
  qrCode,
  hasFile,
  qrDeliveredBy,
  customerEmail,
  customerPhone,
  whatsappNumber,
  reference,
}: Props) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [previewing, setPreviewing] = useState(false);
  const [previewed, setPreviewed] = useState('');
  const [previewAttached, setPreviewAttached] = useState(false);

  const delivered = Boolean(qrSentAt) || status === 'qr_sent';
  const payable = status === 'confirmed';

  async function handleSubmit() {
    if (!file && !code.trim()) {
      setError('Attach a QR file or enter a ticket code first.');
      return;
    }
    if (
      !confirm(
        'Mark this QR as delivered?\n\n' +
          'This ends the customer’s right to cancel and be refunded, and it ' +
          'cannot be undone.'
      )
    ) {
      return;
    }

    setBusy(true);
    setError('');
    try {
      const body = new FormData();
      if (file) body.append('file', file);
      if (code.trim()) body.append('code', code.trim());

      const res = await fetch(`/api/admin/bookings/${bookingId}/qr`, {
        method: 'POST',
        body,
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
        setError(data.message ?? data.error ?? 'Could not mark as delivered.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setBusy(false);
    }
  }

  // ── Already delivered ────────────────────────────────────────────────
  if (delivered) {
    const waMessage = encodeURIComponent(
      `Your Bahia Palace ticket (ref ${reference}) — here is your QR code.`
    );
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-700" />
          <h3 className="text-sm font-semibold text-emerald-900">QR delivered</h3>
        </div>
        <dl className="mt-3 space-y-1 text-xs text-emerald-900/80">
          <div>
            <dt className="inline font-semibold">Marked at: </dt>
            <dd className="inline">
              {qrSentAt ? new Date(qrSentAt).toLocaleString('en-GB') : '—'}
            </dd>
          </div>
          {qrDeliveredBy && (
            <div>
              <dt className="inline font-semibold">By: </dt>
              <dd className="inline">{qrDeliveredBy}</dd>
            </div>
          )}
          {qrCode && (
            <div>
              <dt className="inline font-semibold">Code: </dt>
              <dd className="inline font-mono">{qrCode}</dd>
            </div>
          )}
        </dl>

        <div className="mt-3 flex flex-wrap gap-2">
          {hasFile && (
            <a
              href={`/api/bookings/${bookingId}/qr`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
            >
              <QrCode size={13} /> View QR file
            </a>
          )}
          {/* Sending stays manual — these just save retyping. */}
          {whatsappNumber && customerPhone && (
            <a
              href={`https://wa.me/${customerPhone.replace(/[^\d]/g, '')}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
            >
              <ExternalLink size={13} /> WhatsApp customer
            </a>
          )}
          <a
            href={`mailto:${customerEmail}?subject=${encodeURIComponent(`Your Bahia Palace ticket — ${reference}`)}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
          >
            <ExternalLink size={13} /> Email customer
          </a>
        </div>

        <p className="mt-3 text-xs text-emerald-900/70">
          This booking can no longer be cancelled or refunded (Terms of Sale, §5).
        </p>
      </div>
    );
  }

  // ── Not payable yet ──────────────────────────────────────────────────
  if (!payable) {
    return (
      <div className="rounded-lg border border-[#D4BC96] bg-[#FAF3E7] p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={15} className="shrink-0 text-[#8B6344]" />
          <h3 className="text-sm font-semibold text-[#3D2817]">QR delivery unavailable</h3>
        </div>
        <p className="mt-2 text-xs text-[#5C3D20]">
          {status === 'cancelled'
            ? 'This booking was cancelled — do not deliver a ticket for it.'
            : 'This booking is not paid yet. Do not buy or send a ticket until payment confirms.'}
        </p>
      </div>
    );
  }

  // ── Ready to deliver ─────────────────────────────────────────────────
  /*
   * Read the email before a customer does.
   *
   * Attaching the QR is irreversible — it ends the refund right and mails the
   * customer — so there was no safe way to see what that email looks like.
   * This sends the same template to whoever is signed in and changes nothing
   * about the booking.
   */
  async function handlePreview() {
    setPreviewing(true);
    setError('');
    setPreviewed('');
    try {
      // The same payload the real button sends, so the preview is the email
      // that would actually go out — with the file, not a description of it.
      const body = new FormData();
      if (file) body.append('file', file);
      if (code.trim()) body.append('code', code.trim());
      const res = await fetch(`/api/admin/bookings/${bookingId}/preview`, {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      setPreviewed(data.to);
      setPreviewAttached(Boolean(data.attached));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the preview.');
    } finally {
      setPreviewing(false);
    }
  }

  return (
    <div className="rounded-lg border border-[#D4BC96] bg-white p-4">
      <div className="flex items-center gap-2">
        <QrCode size={16} className="shrink-0 text-[#3D2817]" />
        <h3 className="text-sm font-semibold text-[#3D2817]">Deliver QR ticket</h3>
      </div>
      <p className="mt-2 text-xs text-[#5C3D20]">
        Buy the official ticket on the Ministry portal, then attach the QR here. Either
        a file or a code is enough — both is better.
      </p>

      <label className="mt-4 block">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#8B6344]">
          QR file (PNG, JPG or PDF)
        </span>
        <input
          type="file"
          accept="image/png,image/jpeg,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1.5 block w-full text-xs text-[#3D2817] file:me-3 file:rounded-lg file:border file:border-[#D4BC96] file:bg-[#FAF3E7] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-[#3D2817]"
        />
      </label>

      <label className="mt-3 block">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#8B6344]">
          or ticket code
        </span>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Code from the Ministry portal"
          className="mt-1.5 w-full rounded-lg border border-[#D4BC96] px-3 py-2 text-sm focus:border-[#C4452D] focus:outline-none focus:ring-2 focus:ring-[#C4452D]/30"
        />
      </label>

      <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
        <AlertTriangle size={13} className="mt-0.5 shrink-0" />
        Marking this delivered ends the customer’s right to a refund, and cannot be undone.
      </p>

      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-700">
          {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={busy}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#3D2817] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5C3D20] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
        Attach &amp; mark as sent
      </button>

      {/* Below the real button and visibly quieter: this one is safe to press,
          which is exactly why it must not be mistaken for the one that is not. */}
      <button
        onClick={handlePreview}
        disabled={previewing}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[#D4BC96] px-4 py-2 text-xs font-medium text-[#8B6344] transition-colors hover:bg-[#F7EFE3] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {previewing ? <Loader2 size={13} className="animate-spin" /> : <Mail size={13} />}
        Send a preview to me
      </button>
      {previewed && (
        <p className="mt-1.5 text-xs text-[#6B7F5E]">
          Preview sent to {previewed}
          {previewAttached ? ' with the ticket attached' : ' — no file staged, so no attachment'}. The
          booking was not touched.
        </p>
      )}
    </div>
  );
}
