import { TICKET_PRICES_USD, type TicketSlug } from '@/config/pricing';

export type { TicketSlug };

export const TICKET_PRICES: Record<TicketSlug, number> = TICKET_PRICES_USD;

export const TICKET_NAME_KEYS: Record<TicketSlug, string> = {
  'skip-the-line':        'skipTheLine',
  'guided-tour':          'guidedTour',
  'private-tour':         'privateTour',
  'combo-saadian-tombs':  'combo',
  'visitor-pack':         'visitorPack',
};

/**
 * The Visitor Pack is sold through its own checkout (/api/visitor-pack/checkout),
 * which enforces the PAYMENTS_ENABLED kill switch and the transparent price
 * breakdown. It must NOT be bookable through the legacy /api/bookings route,
 * which has neither. Keep this list in sync if more products move over.
 */
export const LEGACY_BOOKING_EXCLUDED: readonly TicketSlug[] = ['visitor-pack'];

export function isLegacyBookableSlug(s: string): s is TicketSlug {
  return isValidTicketSlug(s) && !LEGACY_BOOKING_EXCLUDED.includes(s);
}

export const TICKET_SLUGS = Object.keys(TICKET_PRICES) as TicketSlug[];

export function isValidTicketSlug(s: string): s is TicketSlug {
  return TICKET_SLUGS.includes(s as TicketSlug);
}
