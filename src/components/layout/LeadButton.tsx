'use client';

import { useState } from 'react';
import { LeadModal } from './LeadModal';
import { LeadToast } from './LeadToast';
import { usePaymentsFlags } from './PaymentsFlagsProvider';
import { useRouter } from '@/i18n/navigation';
import { trackEvent } from '@/lib/analytics';

interface Props {
  /** Identifies which ticket/product triggered the CTA (for analytics). */
  ticketType?: string;
  /** Where on the page this CTA lives — sent as cta_location in GA4. */
  ctaLocation?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * THE single ticket call-to-action for the whole site (~14 usages).
 *
 * It has two behaviours, chosen by the payments kill switch, so that every
 * ticket button everywhere changes destination together — there is exactly
 * one place that decides where a buyer goes:
 *
 *   payments ON  → straight to /visitor-pack, in the visitor's own locale.
 *                  One product, one price, one checkout.
 *
 *   payments OFF → the existing lead modal → official Ministry of Culture
 *                  portal. This is today's live behaviour and it must keep
 *                  working: with the pack not purchasable, sending buyers to
 *                  it would turn every ticket button on the site into a
 *                  "Booking opens soon" dead end and stop lead capture.
 *
 * The name is historical — it is no longer only about lead capture. Kept to
 * avoid churning 14 call sites; the behaviour above is the contract.
 */
export function LeadButton({
  ticketType = 'general',
  ctaLocation = 'unknown',
  className,
  children,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { enabled: paymentsEnabled } = usePaymentsFlags();
  const router = useRouter();

  const track = () => {
    try {
      trackEvent('ticket_cta_click', { cta_location: ctaLocation, ticket_type: ticketType });
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'ticket_cta_click', { cta_location: ctaLocation, ticket_type: ticketType });
      }
    } catch {
      // analytics must never block the buyer
    }
  };

  const handleDone = () => {
    setModalOpen(false);
    setShowToast(true);
  };

  const handleClick = () => {
    track();

    if (paymentsEnabled) {
      // next-intl's router prepends the active locale, so a French visitor
      // goes to /fr/visitor-pack without us assembling the path by hand.
      router.push('/visitor-pack');
      return;
    }

    setModalOpen(true);
  };

  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        {children}
      </button>

      {modalOpen && (
        <LeadModal
          ticketType={ticketType}
          onClose={() => setModalOpen(false)}
          onDone={handleDone}
        />
      )}

      {showToast && <LeadToast />}
    </>
  );
}
