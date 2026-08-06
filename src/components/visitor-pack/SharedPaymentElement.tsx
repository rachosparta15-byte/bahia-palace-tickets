'use client';

import { useMemo, useState } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, type Stripe } from '@stripe/stripe-js';

/**
 * The payment step, rendered on this site.
 *
 * The Payment Intent belongs to the parent company's Stripe account — one
 * account for the whole network — but the card form is mounted here, so the
 * customer finishes on visitbahiapalace.com instead of being sent to a hosted
 * checkout page on a domain they have never seen. Being bounced elsewhere at
 * the moment of payment is exactly when people abandon a booking, and rightly.
 *
 * The publishable key must therefore be the PARENT's. It is public by design —
 * it identifies the account, it does not authorise anything — but it has to
 * match the account that issued the client secret, or Stripe refuses to mount.
 */

/**
 * Created once per key, not per render.
 *
 * `loadStripe` injects a script tag; calling it inside the component body would
 * re-run it on every state change and remount the iframe under the customer
 * mid-typing.
 */
let stripePromise: Promise<Stripe | null> | null = null;
function getStripe(key: string) {
  if (!stripePromise) stripePromise = loadStripe(key);
  return stripePromise;
}

function PayButton({
  amountLabel,
  returnUrl,
  onError,
}: {
  amountLabel: string;
  returnUrl: string;
  onError: (message: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!stripe || !elements) return;

    setBusy(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });

    /*
     * We only get here when the payment did NOT redirect. Card errors and
     * validation errors land here; a successful payment, or one that needs
     * 3-D Secure, navigates away and this code never runs.
     *
     * `error.message` is Stripe's own wording, already localised and far more
     * specific than anything generic we could substitute — "your card has
     * insufficient funds" tells the customer what to do next.
     */
    onError(error?.message ?? 'The payment could not be completed. Please try again.');
    setBusy(false);
  }

  return (
    <form onSubmit={submit}>
      <PaymentElement options={{ layout: 'tabs' }} />
      <button
        type="submit"
        disabled={!stripe || busy}
        className="mt-5 w-full rounded-xl bg-[#C4452D] px-6 py-3.5 font-semibold text-white transition-colors hover:bg-[#a83826] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? 'Processing…' : `Pay ${amountLabel}`}
      </button>
    </form>
  );
}

export function SharedPaymentElement({
  clientSecret,
  amountLabel,
  returnUrl,
  publishableKey,
}: {
  clientSecret: string;
  amountLabel: string;
  returnUrl: string;
  publishableKey: string | undefined;
}) {
  const [error, setError] = useState<string | null>(null);

  const options = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: 'night' as const,
        variables: {
          colorPrimary: '#C4452D',
          colorBackground: '#251A0F',
          colorText: '#F5E8CC',
          borderRadius: '10px',
        },
      },
    }),
    [clientSecret],
  );

  /*
   * A missing key is a configuration fault, not a customer fault. Saying so
   * plainly beats mounting an empty box that looks like a broken site, and it
   * beats a blank screen with a console error nobody will see.
   */
  if (!publishableKey) {
    return (
      <p className="rounded-xl border border-[rgba(232,163,61,0.3)] bg-[#2E1F12] p-4 text-sm leading-relaxed text-[#C4A882]">
        Card payment is not configured on this site yet. Nothing has been charged. Message us and we
        will take the booking directly.
      </p>
    );
  }

  return (
    <div>
      <Elements stripe={getStripe(publishableKey)} options={options}>
        <PayButton amountLabel={amountLabel} returnUrl={returnUrl} onError={setError} />
      </Elements>

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-[#C4452D]/40 bg-[#C4452D]/10 px-3 py-2 text-sm text-[#F5E8CC]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
