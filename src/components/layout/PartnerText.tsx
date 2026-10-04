'use client';

import { useBookingMode } from '@/components/layout/BookingModeProvider';
import { partnerText } from '@/lib/booking-mode';

/**
 * For server components (footer, "why book with us"): renders a translated
 * sentence naming Viator, switched to GetYourGuide while the owner has every
 * entry ticket on GetYourGuide (/admin/settings). The server HTML keeps the
 * Viator wording, which is also what the site says in its normal mode.
 */
export function PartnerText({ text, both = false }: { text: string; both?: boolean }) {
  const allGyg = useBookingMode() === 'all_gyg';
  // `both`: copy about the site as a whole. In all_gyg mode the ticket is on
  // GetYourGuide and the tours on Viator, so it names both.
  if (both) return <>{allGyg ? text.replace(/Viator/g, 'GetYourGuide/Viator') : text}</>;
  return <>{partnerText(text, allGyg)}</>;
}
