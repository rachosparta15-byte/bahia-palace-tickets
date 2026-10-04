'use client';

import { useBookingMode } from '@/components/layout/BookingModeProvider';

/**
 * For server components: shows `normal` in the site's usual modes and `gyg`
 * while the owner has every ticket button on GetYourGuide (/admin/settings).
 *
 * Needed because the GetYourGuide ticket is NON-REFUNDABLE (checked on its
 * product page, 2026-10-04) while the Viator copy promises free cancellation
 * up to 24 hours before: in all_gyg mode those promises would be false. Pass
 * gyg={null} to show nothing at all in that mode.
 */
export function ModeText({ normal, gyg }: { normal: React.ReactNode; gyg: React.ReactNode | null }) {
  return <>{useBookingMode() === 'all_gyg' ? gyg : normal}</>;
}
