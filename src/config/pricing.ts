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
  | 'combo-saadian-tombs'
  | 'visitor-pack';

/** What we actually charge for the only currently live product. */
export const SKIP_THE_LINE_PRICE_USD = 10;

// guided-tour, private-tour, and combo-saadian-tombs are not yet live (see
// TICKET_LIVE in ticket-data.ts) — these are the prices already committed
// to in each product's own /tickets/<slug> page (and, before this file
// existed, duplicated nowhere else consistently — the homepage ticket
// cards and the entrance-fee comparison page both independently guessed
// different numbers for the same products). Change a price here only.
// ─────────────────────────────────────────────────────────────────────
// Complete Visitor Pack
// ─────────────────────────────────────────────────────────────────────
// NOTE (product overlap, unresolved): this bundles the same 100 MAD
// official entry as `skip-the-line` ($10), at $14. Both are currently
// offered. Positioning between the two is an open business decision —
// do not treat either price as settled.

/** What we charge per person for the Complete Visitor Pack. */
export const VISITOR_PACK_PRICE_USD = 14;

/**
 * The transparent cost breakdown shown on the price card AND at checkout.
 *
 * LEGAL/ETHICAL: this exists so we never present $14 as if it were the
 * official entry price. The official ticket is 100 MAD (~$10) and is set
 * by Morocco's Ministry of Culture; the remainder is our own service.
 * Any UI that shows the $14 total must also show this breakdown. If you
 * change these numbers, they must continue to sum to VISITOR_PACK_PRICE_USD
 * — `visitorPackBreakdownIsValid()` asserts this.
 */
export const VISITOR_PACK_BREAKDOWN = {
  /** Official Bahia Palace entry, purchased on the visitor's behalf. */
  officialTicketUSD: OFFICIAL_DOOR_PRICE_USD_APPROX,
  /** Our own premium audio guide, visitor map and support. */
  serviceUSD: VISITOR_PACK_PRICE_USD - OFFICIAL_DOOR_PRICE_USD_APPROX,
  totalUSD: VISITOR_PACK_PRICE_USD,
} as const;

/** Guard against the breakdown silently drifting out of sync with the total. */
export function visitorPackBreakdownIsValid(): boolean {
  return (
    VISITOR_PACK_BREAKDOWN.officialTicketUSD + VISITOR_PACK_BREAKDOWN.serviceUSD ===
    VISITOR_PACK_BREAKDOWN.totalUSD
  );
}

/** Max visitors per single Visitor Pack order. */
export const VISITOR_PACK_MAX_VISITORS = 20;

export const TICKET_PRICES_USD: Record<TicketSlug, number> = {
  'skip-the-line':       SKIP_THE_LINE_PRICE_USD,
  'guided-tour':         28,
  'private-tour':        75,
  'combo-saadian-tombs': 18,
  'visitor-pack':        VISITOR_PACK_PRICE_USD,
};
