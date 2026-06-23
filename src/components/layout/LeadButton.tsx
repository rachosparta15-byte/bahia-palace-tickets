'use client';

import { useState } from 'react';
import { LeadModal } from './LeadModal';
import { LeadToast } from './LeadToast';
import { trackEvent } from '@/lib/analytics';

interface Props {
  /** Identifies which ticket/product triggered the modal (for analytics). */
  ticketType?: string;
  /** Where on the page this CTA lives — sent as cta_location in GA4. */
  ctaLocation?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Drop-in replacement for <a href={BOOKING_URL}>.
 * Opens the lead-capture modal first, then redirects to the portal.
 */
export function LeadButton({ ticketType = 'general', ctaLocation = 'unknown', className, children }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleDone = () => {
    setModalOpen(false);
    setShowToast(true);
  };

  const handleClick = () => {
    trackEvent('ticket_cta_click', { cta_location: ctaLocation, ticket_type: ticketType });
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'ticket_cta_click', { cta_location: ctaLocation, ticket_type: ticketType });
    }
    setModalOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={className}
      >
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
