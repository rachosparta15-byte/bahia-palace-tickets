import { TICKET_PRICES_USD, type TicketSlug } from '@/config/pricing';

export type { TicketSlug };

export const TICKET_PRICES: Record<TicketSlug, number> = TICKET_PRICES_USD;

export const TICKET_NAME_KEYS: Record<TicketSlug, string> = {
  'skip-the-line':        'skipTheLine',
  'guided-tour':          'guidedTour',
  'private-tour':         'privateTour',
  'combo-saadian-tombs':  'combo',
};

export const TICKET_SLUGS = Object.keys(TICKET_PRICES) as TicketSlug[];

export function isValidTicketSlug(s: string): s is TicketSlug {
  return TICKET_SLUGS.includes(s as TicketSlug);
}
