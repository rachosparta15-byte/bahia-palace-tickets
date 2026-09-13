'use client';

import { useEffect, useRef } from 'react';

import { ADSENSE_CLIENT } from '@/config/adsense';

interface Props {
  /** Slot id from ADSENSE_SLOTS. Undefined renders nothing. */
  slot: string | undefined;
  className?: string;
}

/**
 * One AdSense display unit.
 *
 * WHERE THESE MAY GO. Blog posts only, and below the booking CTA. The
 * arithmetic is not close: an AdSense click is worth roughly $0.05-0.30, a
 * Viator booking averages ~$3.40 in commission, and the commercial pages
 * convert at 10-50% in Search Console. An ad on /tickets, /entrance-fee or the
 * home page would have to be clicked ten times over to match one booking it
 * distracted away. A blog reader is mid-article, not mid-purchase, and the
 * attention an ad takes there is attention the booking CTA has already had its
 * turn at.
 *
 * The loader script lives in app/layout.tsx and is site-wide; this component
 * only declares a slot and asks the loader to fill it.
 */
export function AdSlot({ slot, className }: Props) {
  const requested = useRef(false);

  useEffect(() => {
    // React StrictMode runs effects twice in development. Pushing the same
    // <ins> twice makes AdSense log "already have ads in them" and leave the
    // slot blank, which looks exactly like a broken unit.
    if (!slot || requested.current) return;
    requested.current = true;
    try {
      const w = window as typeof window & { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle ?? []).push({});
    } catch {
      // Ad blocker, or the loader never arrived. Neither is worth an error:
      // the slot simply stays empty and the article is unaffected.
    }
  }, [slot]);

  // No unit configured yet — render nothing rather than an empty reserved box.
  if (!slot) return null;

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
