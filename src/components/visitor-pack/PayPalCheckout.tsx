'use client';

import { useEffect, useRef, useState } from 'react';
import { Lock, CreditCard } from 'lucide-react';

/**
 * PayPal checkout, embedded in this page.
 *
 * WHY NOT A REDIRECT: sending the customer to paypal.com at the moment they
 * decide to pay is the single most expensive thing a checkout can do. They
 * leave a page they were persuaded by, land on a login screen, and the ones
 * without a PayPal account — most of them — have to find the card option on
 * someone else's site. Everything here happens in place.
 *
 * TWO WAYS TO PAY, BOTH ON THIS PAGE:
 *   - the PayPal button, which opens PayPal's own popup and closes it again;
 *   - card fields, which are PayPal iframes styled to match this form. The
 *     card number never enters this document, so we stay out of PCI scope.
 *
 * Card fields need "Advanced Credit and Debit Card Payments" on the merchant
 * account. `isEligible()` reports whether it is switched on, and when it is
 * not the button alone is rendered — which still works, and still keeps the
 * customer here.
 *
 * APPROVAL IS NOT PAYMENT. `onApprove` fires when PayPal has the customer's
 * authorisation; the money moves when our server captures. So onApprove posts
 * to /api/checkout/capture and waits for its answer before showing anything
 * confirmed. A page that redirected on onApprove alone would be telling people
 * they had paid on the strength of a callback in their own browser.
 */

declare global {
  interface Window {
    paypal?: {
      Buttons: (opts: Record<string, unknown>) => {
        render: (sel: string | HTMLElement) => Promise<void>;
        isEligible?: () => boolean;
      };
      CardFields: (opts: Record<string, unknown>) => {
        isEligible: () => boolean;
        NumberField: (o?: Record<string, unknown>) => { render: (sel: string) => Promise<void> };
        ExpiryField: (o?: Record<string, unknown>) => { render: (sel: string) => Promise<void> };
        CVVField: (o?: Record<string, unknown>) => { render: (sel: string) => Promise<void> };
        NameField: (o?: Record<string, unknown>) => { render: (sel: string) => Promise<void> };
        submit: () => Promise<void>;
      };
    };
  }
}

export interface PayPalCheckoutProps {
  bookingId: string;
  paypalOrderId: string;
  clientId: string;
  environment: 'live' | 'sandbox';
  /** Where to send the customer once the capture succeeds. */
  confirmationUrl: string;
  /** Used only if the SDK cannot load at all. */
  fallbackUrl: string;
  amountLabel: string;
  locale: string;
  labels: {
    payWithCard: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    nameOnCard: string;
    pay: string;
    processing: string;
    error: string;
    orPayPal: string;
    chooseTitle: string;
    chooseHint: string;
  };
}

/**
 * Loads the SDK once per page.
 *
 * Kept outside the component because React may mount it twice in development
 * (StrictMode) and a second <script> for the same SDK leaves two competing
 * `window.paypal` objects, whose fields render into each other's containers.
 */
let sdkPromise: Promise<void> | null = null;

function loadSdk(clientId: string, locale: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.paypal) return Promise.resolve();
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    const params = new URLSearchParams({
      'client-id': clientId,
      currency: 'EUR',
      // buttons for the PayPal path, card-fields for the card path.
      components: 'buttons,card-fields',
      // No credit/pay-later upsell in the checkout: those are separate consumer
      // credit products and advertising them next to our price is a regulated
      // act we have made no arrangements for.
      'disable-funding': 'credit,paylater',
      locale: sdkLocale(locale),
    });
    script.src = `https://www.paypal.com/sdk/js?${params.toString()}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      sdkPromise = null; // let a retry try again
      reject(new Error('PayPal SDK failed to load'));
    };
    document.head.appendChild(script);
  });

  return sdkPromise;
}

/** PayPal wants xx_XX. Our locales are bare language codes. */
function sdkLocale(locale: string): string {
  const map: Record<string, string> = {
    en: 'en_GB',
    fr: 'fr_FR',
    es: 'es_ES',
    it: 'it_IT',
    de: 'de_DE',
    pt: 'pt_PT',
    ar: 'ar_EG',
  };
  return map[locale] ?? 'en_GB';
}

export function PayPalCheckout({
  bookingId,
  paypalOrderId,
  clientId,
  environment,
  confirmationUrl,
  fallbackUrl,
  amountLabel,
  locale,
  labels,
}: PayPalCheckoutProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'paying' | 'error'>('loading');
  const [message, setMessage] = useState<string | null>(null);
  const [cardEligible, setCardEligible] = useState(false);
  /**
   * Why the card fields did or did not appear. Shown only with ?ppdebug=1,
   * because "not eligible" and "my render call was broken" look identical from
   * the outside — and one of them was in fact my bug.
   */
  const [diagnostic, setDiagnostic] = useState<string | null>(null);

  const buttonsRef = useRef<HTMLDivElement>(null);
  const cardButtonRef = useRef<HTMLDivElement>(null);
  const cardFieldsRef = useRef<{
    submit: () => Promise<void>;
    NumberField: (o?: Record<string, unknown>) => { render: (s: string) => Promise<void> };
    ExpiryField: (o?: Record<string, unknown>) => { render: (s: string) => Promise<void> };
    CVVField: (o?: Record<string, unknown>) => { render: (s: string) => Promise<void> };
    NameField: (o?: Record<string, unknown>) => { render: (s: string) => Promise<void> };
  } | null>(null);
  /** Stops a re-render mounting a second set of PayPal iframes. */
  const fieldsRenderedRef = useRef(false);
  // Guards against a second mount rendering a second set of PayPal iframes
  // into containers that already hold one.
  const mountedRef = useRef(false);

  /**
   * Sends the approved order to our server and follows its verdict.
   *
   * Shared by the button and the card fields: both approve the same order, and
   * both must be confirmed by the same server-side capture.
   */
  async function captureOnServer() {
    setStatus('paying');
    try {
      const res = await fetch('/api/checkout/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, orderId: paypalOrderId }),
      });
      const payload = await res.json().catch(() => ({}));

      if (!res.ok || !payload.paid) {
        setStatus('error');
        setMessage(labels.error);
        return;
      }
      window.location.href = confirmationUrl;
    } catch {
      setStatus('error');
      setMessage(labels.error);
    }
  }

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    /*
     * Bring the payment step into view.
     *
     * The details form is replaced by this one in place, so someone who
     * submitted from halfway down a long page stays exactly where they were —
     * looking at whatever now occupies that scroll position rather than at
     * the card form that just appeared above or below it.
     */
    document.getElementById('checkout')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    let cancelled = false;

    loadSdk(clientId, locale)
      .then(async () => {
        if (cancelled || !window.paypal) return;

        // The order already exists — it was created server-side before this
        // component rendered, at a price the browser never supplied. So
        // createOrder just hands back its id rather than opening a new one.
        const shared = {
          createOrder: () => Promise.resolve(paypalOrderId),
          onApprove: () => captureOnServer(),
          onError: () => {
            setStatus('error');
            setMessage(labels.error);
          },
          // Not an error: the customer closed PayPal's popup. Leave the form
          // exactly as it was so they can try again or switch to a card.
          onCancel: () => setStatus('ready'),
        };

        await window.paypal
          .Buttons({
            ...shared,
            style: { layout: 'horizontal', color: 'gold', shape: 'rect', height: 45, tagline: false },
          })
          .render(buttonsRef.current!)
          .catch(() => {});

        /*
         * A separate "Debit or Credit Card" button, on our page.
         *
         * Without Advanced Checkout the card option exists but is buried:
         * the customer must press the yellow PayPal button, wait for the
         * popup, and find "Pay with Debit or Credit Card" underneath a login
         * form. Most people who do not have a PayPal account read that popup
         * as "you need a PayPal account" and leave.
         *
         * Rendering the card funding source as its own button says plainly,
         * on this page, that a card is accepted. The card form is still
         * PayPal's and still opens in their popup — that part needs Advanced
         * Checkout to change — but the choice is visible before the customer
         * commits to anything.
         *
         * isEligible() guards it: on a merchant or in a country where card
         * funding is not offered, this renders nothing rather than a button
         * that opens an error.
         */
        const cardButton = window.paypal.Buttons({
          ...shared,
          fundingSource: 'card',
          style: { layout: 'horizontal', color: 'black', shape: 'rect', height: 45, tagline: false },
        });
        if (cardButton.isEligible?.() !== false && cardButtonRef.current) {
          await cardButton.render(cardButtonRef.current).catch(() => {});
        }

        /*
         * Eligibility is decided here; the fields are rendered in the effect
         * below, not now.
         *
         * They cannot be rendered here because their containers do not exist
         * yet: #pp-card-number and the rest live inside a block that only
         * renders once `cardEligible` is true, and React has not committed
         * that state at this point. Calling render() against a selector that
         * matches nothing fails silently — an eligible merchant would still
         * have seen no card fields, and the cause would have looked exactly
         * like being ineligible.
         */
        const fields = window.paypal.CardFields(shared);
        if (fields.isEligible()) {
          cardFieldsRef.current = fields;
          if (!cancelled) setCardEligible(true);
          if (!cancelled) setDiagnostic('card fields: eligible');
        } else {
          console.info('[paypal] card fields not available on this account — button only');
          if (!cancelled) {
            setDiagnostic(
              'card fields: NOT eligible — Advanced (Expanded) Checkout is off for this PayPal account',
            );
          }
        }

        if (!cancelled) setStatus('ready');
      })
      .catch(() => {
        // The SDK never arrived. Rather than leave an empty box, send the
        // customer to PayPal's own page — slower, but it completes.
        if (!cancelled) window.location.href = fallbackUrl;
      });

    return () => {
      cancelled = true;
    };
    // Mount-only: every value here is fixed for the life of this component,
    // and re-running would render a second set of PayPal iframes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Renders the four card fields, once their containers are actually on the
   * page. Runs when `cardEligible` flips to true, which is the render that
   * puts them there.
   */
  useEffect(() => {
    if (!cardEligible || !cardFieldsRef.current) return;
    if (fieldsRenderedRef.current) return;
    fieldsRenderedRef.current = true;

    const fields = cardFieldsRef.current;
    const style = {
      input: {
        'font-size': '14px',
        'font-family': 'sans-serif',
        color: '#F5E8CC',
        padding: '10px 14px',
      },
      ':focus': { color: '#F5E8CC' },
      '.invalid': { color: '#C4452D' },
    };

    Promise.all([
      fields.NumberField({ style }).render('#pp-card-number'),
      fields.ExpiryField({ style }).render('#pp-card-expiry'),
      fields.CVVField({ style }).render('#pp-card-cvv'),
      fields.NameField({ style }).render('#pp-card-name'),
    ]).catch(() => {
      // The fields could not mount after all. Drop back to the PayPal button
      // rather than leaving four empty boxes with a pay button under them.
      setCardEligible(false);
      fieldsRenderedRef.current = false;
    });
  }, [cardEligible]);

  async function submitCard() {
    if (!cardFieldsRef.current) return;
    setStatus('paying');
    setMessage(null);
    try {
      // Resolves once PayPal has the card; onApprove then does the capture.
      await cardFieldsRef.current.submit();
    } catch {
      setStatus('error');
      setMessage(labels.error);
    }
  }

  const busy = status === 'paying';
  const fieldCls =
    'h-[44px] rounded-lg border border-[rgba(232,163,61,0.20)] bg-[#2E1F12] overflow-hidden';

  return (
    <div>
      {environment !== 'live' && (
        <p className="mb-4 rounded-lg border border-[#E8A33D]/40 bg-[#7A2E12]/40 px-3 py-2.5 text-center text-xs font-semibold text-[#F5C96A]">
          Sandbox — no money will be taken.
        </p>
      )}

      {status === 'loading' && (
        <p className="py-8 text-center text-sm text-[#C4A882]">…</p>
      )}

      {/* Card first: most visitors do not have a PayPal account, and putting
          the button on top makes the card look like the fallback.

          Deliberately NOT hidden with `display: none` while loading. PayPal's
          buttons and fields measure their container as they mount, and a
          container with no box gives them nothing to measure — the same class
          of failure as rendering into an element that does not exist yet. An
          empty area for a moment is the safer trade. */}
      <div>
        {cardEligible && (
          <div className="mb-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#F5E8CC]">
              <CreditCard size={14} className="text-[#E8A33D]" aria-hidden="true" />
              {labels.payWithCard}
            </p>

            <div className="space-y-3">
              <div>
                <label htmlFor="pp-card-number" className="mb-1.5 block text-xs text-[#C4A882]">
                  {labels.cardNumber}
                </label>
                <div id="pp-card-number" className={fieldCls} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="pp-card-expiry" className="mb-1.5 block text-xs text-[#C4A882]">
                    {labels.expiry}
                  </label>
                  <div id="pp-card-expiry" className={fieldCls} />
                </div>
                <div>
                  <label htmlFor="pp-card-cvv" className="mb-1.5 block text-xs text-[#C4A882]">
                    {labels.cvv}
                  </label>
                  <div id="pp-card-cvv" className={fieldCls} />
                </div>
              </div>

              <div>
                <label htmlFor="pp-card-name" className="mb-1.5 block text-xs text-[#C4A882]">
                  {labels.nameOnCard}
                </label>
                <div id="pp-card-name" className={fieldCls} />
              </div>
            </div>

            <button
              type="button"
              onClick={submitCard}
              disabled={busy}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C4452D] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#A33824] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Lock size={15} aria-hidden="true" />
              {busy ? labels.processing : `${labels.pay} ${amountLabel}`}
            </button>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-[rgba(232,163,61,0.20)]" />
              <span className="text-xs uppercase tracking-wide text-[#C4A882]/60">
                {labels.orPayPal}
              </span>
              <span className="h-px flex-1 bg-[rgba(232,163,61,0.20)]" />
            </div>
          </div>
        )}

        {/* PayPal's own buttons. Dimmed and inert while a capture is in
            flight so neither can be pressed a second time behind the
            spinner. The card button renders only when the merchant has no
            embedded card fields — with those on the page it would be a
            second, worse route to the same thing. */}
        {/*
         * `isolate` and a stacking context of our own.
         *
         * PayPal's card form expands to full height inside this container and
         * paints with its own z-indexes. Without a stacking context here those
         * competed with the page's — the sticky header and the section behind
         * the checkout showed through the middle of the form, so the customer
         * saw "Bahia in Video" running across their card fields.
         *
         * `min-h` reserves room before the iframe arrives, so the page does
         * not jump under the pointer at the moment someone reaches to click.
         */}
        {/*
         * Says what the two buttons are, before they are pressed.
         *
         * A yellow PayPal button next to a black one is not self-explanatory:
         * the most common reading is "you need a PayPal account", and someone
         * who does not have one leaves rather than press either. Naming the
         * card option and saying plainly that no account is needed is the
         * whole point of showing the second button at all.
         */}
        {!cardEligible && (
          <div className="mb-3">
            <p className="text-sm font-semibold text-[#F5E8CC]">{labels.chooseTitle}</p>
            <p className="mt-1 text-xs leading-relaxed text-[#C4A882]">{labels.chooseHint}</p>
          </div>
        )}

        {/*
         * A light panel under PayPal's own UI, on purpose.
         *
         * Everything PayPal renders here lives in their iframe: the white card
         * inputs, and the grey "You acknowledge the terms… No PayPal account
         * required" note beneath them. None of it can be restyled from this
         * document — that is what the iframe is for, and it is why the card
         * number never reaches our servers.
         *
         * On the site's dark brown, their light-mode grey text was unreadable
         * and the white boxes looked pasted on. Giving them the cream they were
         * designed for fixes both, and reads as a deliberate payment panel
         * rather than a broken one. It is the same cream as the confirmation
         * email, so it is not a colour from nowhere.
         *
         * Restyling the fields to match the dark form needs Advanced (Expanded)
         * Checkout, where the fields are ours and the `style` object above
         * applies. Until then this is the honest best.
         */}
        <div
          className={`relative isolate z-10 min-h-[100px] space-y-2.5 rounded-xl bg-[#FAF3E7] p-4 ${
            busy ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          <div ref={buttonsRef} />
          {!cardEligible && <div ref={cardButtonRef} />}
        </div>
      </div>

      {message && (
        <p role="alert" className="mt-4 text-center text-sm text-[#C4452D]">
          {message}
        </p>
      )}

      {diagnostic && typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).has('ppdebug') && (
          <p className="mt-4 rounded-lg border border-[#E8A33D]/30 bg-[#2E1F12] px-3 py-2 text-center font-mono text-[11px] text-[#C4A882]">
            {diagnostic}
          </p>
        )}

      <p className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-[#8FA63C]/25 bg-[#8FA63C]/10 px-3.5 py-2.5 text-center text-xs leading-relaxed text-[#C4A882]">
        <Lock size={13} className="shrink-0 text-[#8FA63C]" aria-hidden="true" />
        <span>Your card details go straight to PayPal and never reach our servers.</span>
      </p>
    </div>
  );
}
