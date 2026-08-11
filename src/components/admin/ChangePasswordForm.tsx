'use client';

import { useState } from 'react';
import { KeyRound, Check } from 'lucide-react';

/**
 * Change your own admin password.
 *
 * The confirm field is compared here rather than on the server: a mistyped
 * repeat is the user's own typo, and a round trip to be told about it is
 * slower and no safer. Everything that decides whether the change is allowed —
 * the current password, the length, whether the account exists — is checked
 * on the server, where it cannot be edited.
 */
export function ChangePasswordForm() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const MIN = 12;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(false);

    if (next !== confirm) {
      setError('The two new passwords do not match.');
      return;
    }
    if (next.length < MIN) {
      setError(`Use at least ${MIN} characters.`);
      return;
    }

    setBusy(true);
    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        const messages: Record<string, string> = {
          wrong_password: 'That is not your current password.',
          password_too_short: `Use at least ${MIN} characters.`,
          same_password: 'The new password is the same as the old one.',
          unauthorised: 'Your session has expired. Sign in again.',
        };
        setError(messages[payload?.error] ?? 'Could not change the password.');
        return;
      }

      setDone(true);
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch {
      setError('Could not reach the server.');
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#C4452D] focus:outline-none focus:ring-2 focus:ring-[#C4452D]/20';

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
        <KeyRound size={16} className="text-[#C4452D]" aria-hidden="true" />
        Change your password
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        This account can read every customer&apos;s name, email and travel dates, and can issue
        refunds. Use at least {MIN} characters and do not reuse a password from anywhere else.
      </p>

      <form onSubmit={submit} className="mt-5 max-w-sm space-y-4">
        <div>
          <label htmlFor="pw-current" className="mb-1.5 block text-sm font-medium text-gray-700">
            Current password
          </label>
          <input
            id="pw-current"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="pw-new" className="mb-1.5 block text-sm font-medium text-gray-700">
            New password
          </label>
          <input
            id="pw-new"
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            required
            minLength={MIN}
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="pw-confirm" className="mb-1.5 block text-sm font-medium text-gray-700">
            Repeat new password
          </label>
          <input
            id="pw-confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className={inputCls}
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-[#C4452D] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A33824] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? 'Changing…' : 'Change password'}
        </button>

        {error && (
          <p role="alert" className="text-sm text-[#C4452D]">
            {error}
          </p>
        )}
        {done && (
          <p className="flex items-center gap-1.5 text-sm font-medium text-green-700">
            <Check size={14} aria-hidden="true" />
            Password changed. Use it the next time you sign in.
          </p>
        )}
      </form>
    </section>
  );
}
