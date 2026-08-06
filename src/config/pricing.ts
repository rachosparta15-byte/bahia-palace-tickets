// Single source of truth for every price displayed on the site.
// Update a number here — not in individual pages, components, blog
// templates, or JSON-LD generators.

/** Official Bahia Palace door price, set by Morocco's Ministry of Culture. */
export const OFFICIAL_DOOR_PRICE_MAD = 100;
// Removed: the site quotes MAD and EUR only. A USD figure beside a EUR
// charge is a third number the customer has to reconcile.

// ─────────────────────────────────────────────────────────────────────
// Exchange rate
// ─────────────────────────────────────────────────────────────────────
/**
 * MAD → EUR, used to convert the official door price for display and to
 * derive the official-entry line of the Visitor Pack breakdown.
 *
 * WHY THIS IS PINNED AND DATED, not fetched live: the number appears in a
 * legally load-bearing claim ("the official ticket costs X, the rest is our
 * service"). A live rate would make that claim silently change under us and
 * would make the charged total move between the page and the card statement.
 * A pinned rate is checkable: anyone can verify what we claimed and when.
 *
 * The trade-off is that it goes stale. That is why every place showing the
 * EUR figure must ALSO show the MAD original and the date below — "≈ €9.36,
 * converted at the rate of 21 July 2026" stays true forever, whereas
 * "today's rate" becomes a false statement the next day.
 *
 * TO UPDATE: re-check the rate, change both constants together, and confirm
 * `visitorPackBreakdownIsValid()` still passes (it will refuse to sell if the
 * official entry has drifted up past what we charge for the whole pack).
 *
 * Verified 21 July 2026 against two independent sources (open.er-api.com:
 * 1 MAD = 0.093601 EUR; xe.com: 1 MAD = 0.0936 EUR).
 */
export const MAD_TO_EUR_RATE = 0.0936;

/** ISO date the rate above was verified. Shown to visitors next to any EUR figure. */
export const MAD_TO_EUR_RATE_CHECKED_ON = '2026-07-21';

/** The rate-check date, written out for display in the visitor's language. */
export function rateCheckedOnLabel(locale: string): string {
  return new Date(`${MAD_TO_EUR_RATE_CHECKED_ON}T00:00:00Z`).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}


// ─────────────────────────────────────────────────────────────────────
// Money formatting
// ─────────────────────────────────────────────────────────────────────
// Prices are held as integer cents, never as floats. In binary floating
// point `9.36 + 4.63 === 13.99` is false, so a breakdown that visibly sums
// correctly on screen would still fail its own assertion.
// Integers make the sum exact: 936 + 463 === 1399.

/** Integer cents → a "13.99"-style string. Always two decimals. */
export function formatEURAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}

/** Integer cents → "€13.99". */
export function formatEUR(cents: number): string {
  return `€${formatEURAmount(cents)}`;
}

/** Official door price in EUR cents, converted at the pinned rate above. */
export const OFFICIAL_DOOR_PRICE_EUR_CENTS = Math.round(
  OFFICIAL_DOOR_PRICE_MAD * MAD_TO_EUR_RATE * 100
);

export const OFFICIAL_DOOR_PRICE_LABEL = {
  mad: `${OFFICIAL_DOOR_PRICE_MAD} MAD`,
  eur: `≈ ${formatEUR(OFFICIAL_DOOR_PRICE_EUR_CENTS)}`,
} as const;

export type TicketSlug =
  | 'skip-the-line'
  | 'guided-tour'
  | 'private-tour'
  | 'combo-saadian-tombs'
  | 'visitor-pack';

/** What we actually charge for the only currently live product. */
/**
 * What we charge per person, in EUR cents. One price, one product.
 *
 * This replaced two overlapping entries — a USD "skip-the-line" and a EUR
 * "visitor pack" — that bundled the same 100 MAD official ticket at different
 * prices in different currencies. It covers the official ticket, the
 * multilingual audio guide, support and WhatsApp.
 */
export const ENTRY_PRICE_EUR_CENTS = 1290;

/** @deprecated Use ENTRY_PRICE_EUR_CENTS. Kept so nothing silently reads a stale USD number. */
export const SKIP_THE_LINE_PRICE_EUR = ENTRY_PRICE_EUR_CENTS / 100;

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
// RESOLVED: the pack and the old skip-the-line entry bundled the same 100 MAD
// official ticket at two prices in two currencies. They are now one product at
// one price, in euro.

/**
 * What we charge per person, in EUR cents. Now the single network price.
 *
 * Because this is the total and the official-entry line is fixed by the pinned
 * exchange rate, any odd cent lands in our service fee — never in the figure we
 * attribute to the Ministry. That ordering is deliberate; see the breakdown
 * below.
 *
 * NOTE: prices must never be written into messages/*.json. They were, and the
 * page went on showing EUR 13.99 long after this constant changed.
 */
export const VISITOR_PACK_PRICE_EUR_CENTS = ENTRY_PRICE_EUR_CENTS;

/**
 * The transparent cost breakdown shown on the price card AND at checkout.
 *
 * LEGAL/ETHICAL: this exists so we never present €13.99 as if it were the
 * official entry price. The official ticket is 100 MAD, set by Morocco's
 * Ministry of Culture; the remainder is our own service. Any UI that shows
 * the €13.99 total must also show this breakdown.
 *
 * The official line is DERIVED from the 100 MAD price at the pinned rate,
 * and the service fee is whatever is left over — never the other way round.
 * That ordering matters: the official figure is a fact about someone else's
 * price that we must report accurately, while our own fee is the part we
 * are free to set. If the rate moves, the honest outcome is that our margin
 * absorbs it, not that we misstate the government's price.
 *
 * MAD is the primary figure everywhere it is displayed, because that is the
 * currency the price is actually fixed in. EUR is shown as a conversion.
 */
export const VISITOR_PACK_BREAKDOWN_EUR_CENTS = {
  /** Official Bahia Palace entry (100 MAD), purchased on the visitor's behalf. */
  officialTicket: OFFICIAL_DOOR_PRICE_EUR_CENTS,
  /** Our own premium audio guide, visitor map and support — the residual. */
  service: VISITOR_PACK_PRICE_EUR_CENTS - OFFICIAL_DOOR_PRICE_EUR_CENTS,
  total: VISITOR_PACK_PRICE_EUR_CENTS,
} as const;

/**
 * Refuse to sell if the breakdown has stopped being truthful.
 *
 * The sum is exact by construction now that `service` is a residual, so the
 * check that matters is a different one: has the exchange rate drifted far
 * enough that the official entry costs as much as (or more than) the whole
 * pack? If so our "official ticket + our service" story is no longer true —
 * we would be charging a service fee of zero or less while still claiming
 * one. Refusing to sell is the correct failure; the caller returns a 500 and
 * nobody is charged.
 */
export function visitorPackBreakdownIsValid(): boolean {
  const { officialTicket, service, total } = VISITOR_PACK_BREAKDOWN_EUR_CENTS;
  return (
    officialTicket > 0 && service > 0 && officialTicket + service === total
  );
}

/** Max visitors per single Visitor Pack order. */
export const VISITOR_PACK_MAX_VISITORS = 20;

/** Every price on the site, in euro. Nothing here is quoted in any other currency. */
export const TICKET_PRICES_EUR: Record<TicketSlug, number> = {
  'skip-the-line':       ENTRY_PRICE_EUR_CENTS / 100,
  // Not yet live (see TICKET_LIVE in ticket-data.ts). These were USD figures
  // and are converted at 0.88 pending the owner setting real euro prices.
  'guided-tour':         25,
  'private-tour':        66,
  'combo-saadian-tombs': 16,
  'visitor-pack':        ENTRY_PRICE_EUR_CENTS / 100,
};
