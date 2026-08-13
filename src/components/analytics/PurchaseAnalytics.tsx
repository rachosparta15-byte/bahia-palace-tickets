'use client';

import { useEffect } from 'react';

/**
 * The GA4 `purchase` event, fired from the confirmation page.
 *
 * NOT from PayPal's onApprove, for two reasons. That callback ends in
 * `window.location.href = confirmationUrl`, so an event sent there races the
 * unload of the page it was sent from. And gtag.js loads with
 * `strategy="lazyOnload"` (see GoogleAnalytics), which routinely leaves
 * `window.gtag` undefined for the entire life of a checkout page — the event
 * would not have been dropped loudly, it would simply never have existed.
 *
 * This page is also where every payment path converges: the embedded PayPal
 * approval, PayPal's redirect fallback, the Stripe return, and mock. One
 * implementation covers all four, and the server has already confirmed the
 * money moved before this renders.
 */

interface Props {
  /** PayPal order id / Stripe session id. Falls back to our own reference. */
  transactionId: string;
  /** The order total, NOT the unit price: a four-person pack is 55.96. */
  value: number;
  currency: string;
  itemName: string;
  quantity: number;
}

const FIRED_KEY = 'bpt_ga4_purchase:';

export function PurchaseAnalytics({
  transactionId,
  value,
  currency,
  itemName,
  quantity,
}: Props) {
  useEffect(() => {
    if (!transactionId) return;

    /*
     * Once per transaction, ever.
     *
     * This URL is not a one-shot redirect target: it is linked from the
     * confirmation email and it is bookmarkable, so the same customer lands
     * here days later. Without this guard every one of those visits reports
     * another sale. localStorage rather than sessionStorage for exactly that
     * reason — the repeat visit is a new session.
     */
    const key = FIRED_KEY + transactionId;
    try {
      if (localStorage.getItem(key)) return;
    } catch {
      // Storage blocked (private mode). Continue: a possible double count is a
      // better failure than never reporting revenue at all.
    }

    let cancelled = false;
    let attempts = 0;

    const fire = () => {
      if (cancelled) return;

      // gtag.js sits behind the load event, so it is absent for the first
      // seconds here rather than missing altogether.
      if (typeof window.gtag !== 'function') {
        if (attempts++ > 40) return; // ~20s, then give up quietly
        window.setTimeout(fire, 500);
        return;
      }

      window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value,
        currency,
        items: [
          {
            item_name: itemName,
            price: quantity > 0 ? Number((value / quantity).toFixed(2)) : value,
            quantity,
          },
        ],
      });

      // Marked only once it has actually gone out, so a page closed during the
      // wait above reports on the customer's next visit rather than never.
      try {
        localStorage.setItem(key, '1');
      } catch {
        // as above
      }
    };

    fire();
    return () => {
      cancelled = true;
    };
  }, [transactionId, value, currency, itemName, quantity]);

  return null;
}
