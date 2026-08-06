'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Headphones, Loader2, Smartphone, Unlock, AlertTriangle } from 'lucide-react';

/**
 * The audio guide's support screen: who is holding which code, and the one
 * button that can take it back.
 *
 * Exists because "one code, one device, forever" is an absolute rule, and
 * absolute rules need somewhere for the exception to live where a person can
 * see it. Without this panel the only honest answer to "my phone wiped itself
 * and now the guide says the link is in use" is a database query.
 *
 * The unlock count is on the screen rather than hidden in the row, because it
 * is the number that turns a support decision from a guess into a judgement.
 * A code on its first unlock is a customer with a bad week; a code on its
 * fourth is a link that has been forwarded, and the operator should know that
 * before pressing the button again.
 */

export interface GuideCodeRow {
  code: string;
  /** Dashed, for reading aloud on WhatsApp. */
  display: string;
  seat: number;
  claimed: boolean;
  claimedAt: string | null;
  lastSeenAt: string | null;
  unlockCount: number;
}

interface Props {
  reference: string;
  codes: GuideCodeRow[];
}

function when(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function GuideCodes({ reference, codes }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (codes.length === 0) return null;

  async function unlock(code: string, seat: number) {
    // A destructive-ish action on a live customer's access. Cheap to confirm,
    // expensive to do by accident while scrolling a support queue.
    if (!confirm(`Release seat ${seat} of ${reference} from its device?\n\nThe next phone to open that link will claim it.`)) {
      return;
    }
    setBusy(code);
    setError(null);
    try {
      const res = await fetch(`/api/admin/guide-codes/${encodeURIComponent(code)}/unlock`, {
        method: 'POST',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error === 'not_found_or_already_free'
          ? 'That code is already free — nothing to release.'
          : 'Could not release the code. Try again.');
        return;
      }
      router.refresh();
    } catch {
      setError('Could not reach the server.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <Headphones size={17} className="shrink-0 text-neutral-500" aria-hidden="true" />
        <h3 className="font-semibold text-neutral-900">Audio guide access</h3>
        <span className="ms-auto text-xs text-neutral-500">
          {codes.length} {codes.length === 1 ? 'seat' : 'seats'}
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
        One code per paid seat. The first phone to open a link keeps it; every other device is
        refused. Release a code only when a customer&apos;s own phone lost its storage — the count
        below is how you tell that from a shared link.
      </p>

      {error && (
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <ul className="mt-4 flex flex-col gap-2">
        {codes.map((c) => (
          <li
            key={c.code}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-neutral-150 bg-neutral-50 px-4 py-3"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Seat {c.seat}
            </span>

            <code className="font-mono text-sm tracking-wide text-neutral-900">{c.display}</code>

            {c.claimed ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-neutral-600">
                <Smartphone size={13} aria-hidden="true" />
                In use since {when(c.claimedAt)}
                {c.lastSeenAt && <span className="text-neutral-400">· last opened {when(c.lastSeenAt)}</span>}
              </span>
            ) : (
              <span className="text-xs text-neutral-500">Not opened yet</span>
            )}

            {c.unlockCount > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  c.unlockCount >= 3
                    ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-800'
                }`}
                title="Times this code has been released from a device"
              >
                released {c.unlockCount}×
              </span>
            )}

            {c.claimed && (
              <button
                type="button"
                onClick={() => unlock(c.code, c.seat)}
                disabled={busy === c.code}
                className="ms-auto inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 disabled:opacity-50"
              >
                {busy === c.code ? (
                  <Loader2 size={13} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Unlock size={13} aria-hidden="true" />
                )}
                Release
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
