'use client';

import { useState } from 'react';
import { LeadModal } from './LeadModal';
import { LeadToast } from './LeadToast';

interface Props {
  /** Identifies which ticket/product triggered the modal (for analytics). */
  ticketType?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Drop-in replacement for <a href={BOOKING_URL}>.
 * Opens the lead-capture modal first, then redirects to the portal.
 */
export function LeadButton({ ticketType = 'general', className, children }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleDone = () => {
    setModalOpen(false);
    setShowToast(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
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
