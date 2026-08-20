'use client';

import { useState } from 'react';

export type Candidate = {
  id: string;
  reference: string;
  name: string;
  email: string;
  visitDate: string;
  party: string;
  total: number;
  /** ISO instant the checkout was opened — drives the "Started" column. */
  createdAt: string;
};

/**
 * Below this, a row is as likely to be mid-payment as abandoned.
 *
 * The eligibility window is twenty minutes, which is also how long a 3-D
 * Secure challenge can take: a phone leaves the browser for an SMS code and
 * comes back. Nobody is excluded for being new — that would be the four-hour
 * wait again under another name — but the operator is told, because "you did
 * not finish" landing while someone is still paying is the one failure this
 * screen can cause and cannot take back.
 */
const STILL_PAYING_MINUTES = 45;

/** "12 min ago" / "3 h ago" — how long the checkout has been sitting. */
function sinceLabel(iso: string): { text: string; fresh: boolean } {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  const text = mins < 60 ? `${mins} min ago` : mins < 1440 ? `${Math.round(mins / 60)} h ago` : `${Math.round(mins / 1440)} d ago`;
  return { text, fresh: mins < STILL_PAYING_MINUTES };
}

/**
 * One list, with the choice of who is on it.
 *
 * Everyone is ticked when the page loads. The rows are here because they
 * already passed every eligibility rule, so "all of them" is the honest
 * default — but a booking can be one you recognise, or one you have already
 * phoned, and unticking is faster than remembering not to press the button.
 *
 * The count on the button is the SELECTION, not the list, and it is the number
 * the confirm repeats back. That is the number that matters.
 */
export function FollowUpList({
  kind,
  title,
  note,
  rows,
}: {
  kind: 'abandoned' | 'crossSell';
  title: string;
  note: string;
  rows: Candidate[];
}) {
  const [picked, setPicked] = useState<Set<string>>(() => new Set(rows.map((r) => r.id)));
  const [testTo, setTestTo] = useState('');
  const [busy, setBusy] = useState<'test' | 'live' | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const allOn = rows.length > 0 && picked.size === rows.length;

  function toggle(id: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function post(payload: Record<string, unknown>, mode: 'test' | 'live') {
    setBusy(mode);
    setResult(null);
    try {
      const res = await fetch('/api/admin/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult(data.error ?? 'Something went wrong');
        return;
      }
      if (data.test) {
        setResult(
          `Test sent to ${data.to}, rendered from ${data.renderedFrom}. Nobody was marked as contacted.`,
        );
      } else {
        setResult(
          `Sent ${data.sent} of ${data.attempted}` +
            (data.failed?.length ? ` — ${data.failed.length} failed` : ''),
        );
        setTimeout(() => location.reload(), 1500);
      }
    } catch {
      setResult('Could not reach the server. Nothing was sent.');
    } finally {
      setBusy(null);
    }
  }

  function sendLive() {
    const n = picked.size;
    if (busy || n === 0) return;
    if (!confirm(`Send this email to ${n} ${n === 1 ? 'person' : 'people'}? It cannot be taken back.`))
      return;
    void post({ ids: [...picked] }, 'live');
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8D5B7] mb-8">
      <div className="px-6 py-4 border-b border-[#E8D5B7] flex items-start justify-between gap-6">
        <div>
          <h2 className="font-semibold text-[#3D2817]">{title}</h2>
          <p className="text-xs text-[#8B6344] mt-1 max-w-xl">{note}</p>
        </div>

        <div className="shrink-0 text-end">
          <div className="flex items-center justify-end gap-2">
            <input
              type="email"
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
              placeholder="your@email.com"
              className="w-52 rounded-lg border border-[#E8D5B7] px-3 py-2 text-sm text-[#3D2817] placeholder:text-[#C0A886]"
            />
            <button
              type="button"
              onClick={() => testTo.trim() && void post({ testTo: testTo.trim() }, 'test')}
              disabled={busy !== null || !testTo.trim() || rows.length === 0}
              className="rounded-lg border border-[#C4452D] px-3 py-2 text-sm font-semibold text-[#C4452D] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy === 'test' ? 'Sending…' : 'Test to me'}
            </button>
          </div>

          <button
            type="button"
            onClick={sendLive}
            disabled={busy !== null || picked.size === 0}
            className="mt-2 w-full rounded-lg bg-[#C4452D] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy === 'live'
              ? 'Sending…'
              : picked.size === 0
                ? 'Nobody selected'
                : `Send to ${picked.size} selected`}
          </button>

          {result && <p className="mt-2 max-w-xs text-xs text-[#8B6344]">{result}</p>}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8D5B7]">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allOn}
                  onChange={() => setPicked(allOn ? new Set() : new Set(rows.map((r) => r.id)))}
                  disabled={rows.length === 0}
                  aria-label="Select everyone on this list"
                  className="h-4 w-4 accent-[#C4452D]"
                />
              </th>
              {['Reference', 'Name', 'Email', 'Visit date', 'Party', 'Total', 'Started'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-start text-xs font-semibold text-[#8B6344] uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-[#8B6344]">
                  Nobody waiting
                </td>
              </tr>
            )}
            {rows.map((b) => {
              const on = picked.has(b.id);
              return (
                <tr
                  key={b.id}
                  onClick={() => toggle(b.id)}
                  className={`border-b border-[#E8D5B7]/60 cursor-pointer ${on ? '' : 'opacity-45'}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle(b.id)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Include ${b.reference}`}
                      className="h-4 w-4 accent-[#C4452D]"
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#2E4A7B]">{b.reference}</td>
                  <td className="px-4 py-3 text-[#3D2817]">{b.name}</td>
                  <td className="px-4 py-3 text-xs text-[#5C3D20]">{b.email}</td>
                  <td className="px-4 py-3 text-xs text-[#5C3D20]">{b.visitDate}</td>
                  <td className="px-4 py-3 text-xs text-[#5C3D20]">{b.party}</td>
                  <td className="px-4 py-3 font-medium text-[#3D2817]">&euro;{b.total.toFixed(2)}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">
                    {(() => {
                      const { text, fresh } = sinceLabel(b.createdAt);
                      return fresh ? (
                        <span
                          className="inline-flex items-center gap-1 rounded-full bg-[#F6E2C8] px-2 py-0.5 font-semibold text-[#8A5A16]"
                          title={`Opened ${text}. A 3-D Secure challenge can take this long — they may still be at PayPal.`}
                        >
                          {text} &middot; may still be paying
                        </span>
                      ) : (
                        <span className="text-[#5C3D20]">{text}</span>
                      );
                    })()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
