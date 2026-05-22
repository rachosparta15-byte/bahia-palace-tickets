export type TicketSlug =
  | 'skip-the-line'
  | 'guided-tour'
  | 'private-tour'
  | 'combo-saadian-tombs';

export const TICKET_PRICES: Record<TicketSlug, number> = {
  'skip-the-line':        10,
  'guided-tour':          10,
  'private-tour':         10,
  'combo-saadian-tombs':  10,
};

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
