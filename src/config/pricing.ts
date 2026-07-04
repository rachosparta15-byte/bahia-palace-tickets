// Single source of truth for every price displayed on the site.
// Update a number here — not in individual pages, components, blog
// templates, or JSON-LD generators.

/** Official Bahia Palace door price, set by Morocco's Ministry of Culture. */
export const OFFICIAL_DOOR_PRICE_MAD = 100;
export const OFFICIAL_DOOR_PRICE_USD_APPROX = 10;
export const OFFICIAL_DOOR_PRICE_EUR_APPROX = 9;

export const OFFICIAL_DOOR_PRICE_LABEL = {
  mad: `${OFFICIAL_DOOR_PRICE_MAD} MAD`,
  usd: `~$${OFFICIAL_DOOR_PRICE_USD_APPROX}`,
  eur: `~€${OFFICIAL_DOOR_PRICE_EUR_APPROX}`,
} as const;

/** USD -> EUR approximation, derived from the door price ratio (9/10). Used
 *  to show a EUR estimate next to any USD ticket price on the site. */
export const USD_TO_EUR_APPROX = OFFICIAL_DOOR_PRICE_EUR_APPROX / OFFICIAL_DOOR_PRICE_USD_APPROX;

export function approxEUR(usd: number): number {
  return Math.round(usd * USD_TO_EUR_APPROX);
}

export type TicketSlug =
  | 'skip-the-line'
  | 'guided-tour'
  | 'private-tour'
  | 'combo-saadian-tombs';

/** What we actually charge for the only currently live product. */
export const SKIP_THE_LINE_PRICE_USD = 10;

// guided-tour, private-tour, and combo-saadian-tombs are not yet live (see
// TICKET_LIVE in ticket-data.ts) — these are the prices already committed
// to in each product's own /tickets/<slug> page (and, before this file
// existed, duplicated nowhere else consistently — the homepage ticket
// cards and the entrance-fee comparison page both independently guessed
// different numbers for the same products). Change a price here only.
export const TICKET_PRICES_USD: Record<TicketSlug, number> = {
  'skip-the-line':       SKIP_THE_LINE_PRICE_USD,
  'guided-tour':         28,
  'private-tour':        75,
  'combo-saadian-tombs': 18,
};
