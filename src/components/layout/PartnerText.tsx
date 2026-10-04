'use client';

import { useBookingMode } from '@/components/layout/BookingModeProvider';
import { partnerText } from '@/lib/booking-mode';

/**
 * For server components (footer, "why book with us"): renders a translated
 * sentence naming Viator, switched to GetYourGuide while the owner has every
 * ticket button on GetYourGuide (/admin/settings). The server HTML keeps the
 * Viator wording, which is also what the site says in its normal mode.
 */
export function PartnerText({ text }: { text: string }) {
  return <>{partnerText(text, useBookingMode() === 'all_gyg')}</>;
}
