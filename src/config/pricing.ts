// Single source of truth for every price displayed on the site.
// Update a number here — not in individual pages, components, blog
// templates, or JSON-LD generators.

/** Official Bahia Palace door price, set by Morocco's Ministry of Culture. */
export const OFFICIAL_DOOR_PRICE_MAD = 100;

/**
 * The ministry's second rate: a foreign child aged 7 to 13 pays half.
 *
 * Read off the ministry portal on 2026-08-19, where "Foreigner Adult" and
 * "Foreigner Child between 7 and 13" are two separate rows with their own
 * counters. We charged one price for both and absorbed the difference, which
 * meant a family of four was quoted as four adults.
 *
 * The band is the ministry's, not ours, and the labels on the form repeat it
 * word for word — a child of 6 and a child of 14 are both priced by somebody
 * else's rule, and paraphrasing it is how a family arrives holding the wrong
 * ticket.
 */
export const OFFICIAL_CHILD_DOOR_PRICE_MAD = 50;

/** The ministry's band for the child rate, stated exactly as the portal does. */
export const CHILD_AGE_MIN = 7;
export const CHILD_AGE_MAX = 13;
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
// point `9.36 + 2.63 === 11.99` is false, so a breakdown that visibly sums
// correctly on screen would still fail its own assertion.
// Integers make the sum exact: 936 + 263 === 1199.

/** Integer cents → a "11.99"-style string. Always two decimals. */
export function formatEURAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}

/** Integer cents → "€11.99". */
export function formatEUR(cents: number): string {
  return `€${formatEURAmount(cents)}`;
}

/** Official door price in EUR cents, converted at the pinned rate above. */
export const OFFICIAL_DOOR_PRICE_EUR_CENTS = Math.round(
  OFFICIAL_DOOR_PRICE_MAD * MAD_TO_EUR_RATE * 100
);

/** Official child door price (50 MAD) in EUR cents, at the same pinned rate. */
export const OFFICIAL_CHILD_DOOR_PRICE_EUR_CENTS = Math.round(
  OFFICIAL_CHILD_DOOR_PRICE_MAD * MAD_TO_EUR_RATE * 100
);

export const OFFICIAL_DOOR_PRICE_LABEL = {
  mad: `${OFFICIAL_DOOR_PRICE_MAD} MAD`,
  eur: `≈ ${formatEUR(OFFICIAL_DOOR_PRICE_EUR_CENTS)}`,
} as const;

/**
 * What we charge per adult, in EUR cents.
 *
 * Covers the official 100 MAD ticket bought in their name, the multilingual
 * audio guide, the visitor map and support.
 *
 * 12.99 across the whole network, and the same figure in the hub's own config
 * — the brief exception on 19/08/2026, when this site alone sat at 11.99, was
 * closed the same day so that every document and every site quotes one price.
 */
export const ADULT_PRICE_EUR_CENTS = 1299;

/**
 * What we charge per child aged 7 to 13, in EUR cents.
 *
 * The official half-price ticket, bought in their name. NO AUDIO GUIDE — that
 * is the whole reason this is not simply half of the adult price, and every
 * surface that lists what the pack includes has to say so. A child priced at
 * 7.99 who arrives expecting a guide has been mis-sold, however small the
 * amount.
 */
export const CHILD_PRICE_EUR_CENTS = 799;

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
export const ENTRY_PRICE_EUR_CENTS = ADULT_PRICE_EUR_CENTS;

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
 * page went on showing the old figure long after this constant changed. They
 * still are, in about forty strings across fourteen files — changing this
 * number means sweeping those too, which is the whole reason for the warning.
 */
export const VISITOR_PACK_PRICE_EUR_CENTS = ENTRY_PRICE_EUR_CENTS;

/**
 * The transparent cost breakdown shown on the price card AND at checkout.
 *
 * LEGAL/ETHICAL: this exists so we never present €11.99 as if it were the
 * official entry price. The official ticket is 100 MAD, set by Morocco's
 * Ministry of Culture; the remainder is our own service. Any UI that shows
 * the €11.99 total must also show this breakdown.
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
/**
 * The same breakdown for a child, derived the same way round.
 *
 * The official line is the ministry's 50 MAD at the pinned rate; our service is
 * the residual. It is a smaller service than an adult's because it is a smaller
 * service — the ticket is bought and delivered the same way, and there is no
 * audio guide.
 */
export const CHILD_BREAKDOWN_EUR_CENTS = {
  officialTicket: OFFICIAL_CHILD_DOOR_PRICE_EUR_CENTS,
  service: CHILD_PRICE_EUR_CENTS - OFFICIAL_CHILD_DOOR_PRICE_EUR_CENTS,
  total: CHILD_PRICE_EUR_CENTS,
} as const;

export function visitorPackBreakdownIsValid(): boolean {
  const { officialTicket, service, total } = VISITOR_PACK_BREAKDOWN_EUR_CENTS;
  const child = CHILD_BREAKDOWN_EUR_CENTS;
  return (
    officialTicket > 0 &&
    service > 0 &&
    officialTicket + service === total &&
    // The child tier gets the same guard, and for the same reason: if the rate
    // ever drifts far enough that 50 MAD costs what we charge for the child
    // pack, "official ticket plus our service" has stopped being true of it.
    child.officialTicket > 0 &&
    child.service > 0 &&
    child.officialTicket + child.service === child.total
  );
}

/**
 * What a party costs, in integer cents. The one place this arithmetic lives.
 *
 * The form displays it, the checkout route charges it and PayPal is handed the
 * result. Three copies of `adults * X + children * Y` is three chances for the
 * screen and the card statement to disagree by a cent.
 */
export function packTotalCents(adults: number, children: number): number {
  return adults * ADULT_PRICE_EUR_CENTS + children * CHILD_PRICE_EUR_CENTS;
}

// ─────────────────────────────────────────────────────────────────────
// PRICE TEASER TEST — temporary, owner-directed, revert with one line
// ─────────────────────────────────────────────────────────────────────
/**
 * While this is true, the buying path advertises the official door price
 * (100 DH) and the real total (€11.99) is not shown until the payment step.
 *
 * WHAT THIS IS. The owner wants to know whether the price is what stops people
 * buying. The design they asked for: show 100 DH beside the button, take the
 * click straight into the form, keep every total off the form, and reveal
 * €11.99 with the included services only at the payment step.
 *
 * WHAT IT IS NOT. It is not a price change. `VISITOR_PACK_PRICE_EUR_CENTS` is
 * untouched, the breakdown guard above still runs, and nobody is charged a cent
 * they have not seen and agreed to on the payment step. Only the ADVERTISED
 * figure moves.
 *
 * WHAT I TOLD THE OWNER, recorded here because the code should be honest about
 * itself even while the page is not:
 *
 *   1. It will not answer the question. Someone who leaves at the payment step
 *      after seeing 100 DH turn into €11.99 tells you people leave when a price
 *      changes under them — which would happen at any price. Nobody in this
 *      test ever decides about €11.99 on its merits, so "is €11.99 too much"
 *      comes back unanswered. An A/B of two honest totals answers it directly.
 *   2. 100 DH is not our price to advertise. It is the Ministry of Culture's
 *      door price, which is why OFFICIAL_DOOR_PRICE_MAD exists and why the
 *      breakdown above is written the way it is.
 *   3. Advertising a total lower than the one charged is drip pricing, and the
 *      buyers here are EU consumers (en/fr/de/es/it): the Consumer Rights
 *      Directive requires the total payable up front.
 *
 * The owner read all three and chose to run it. Their call, their business.
 *
 * TO END THE TEST: set this to false. Every display goes back to the true
 * total, because every one of them reads it through the helper below rather
 * than deciding for itself.
 *
 * ENDED 2026-08-21, on the owner's instruction, and point 3 above is why. The
 * hero and the ticket cards read "100 DH per person" over buttons going to
 * /visitor-pack#checkout, which charges €12.99 — a total advertised below the
 * one payable, to EU consumers, which is what the Consumer Rights Directive
 * calls drip pricing. Point 1 said the test could not answer its own question
 * either, so nothing is being given up by stopping.
 *
 * The flag stays rather than being deleted. It is one line to run again, the
 * branches it guards record exactly what the test changed, and the three
 * arguments above are worth keeping next to it.
 */
export const TEASER_PRICE_ENABLED = false;

/**
 * What a price display in the BUYING PATH should say — hero, ticket cards,
 * sticky bar, pack landing page.
 *
 * Never call this on the payment step or in the confirmation: those must show
 * the amount actually being charged, and they call formatEUR directly.
 */
export function buyingPathPriceLabel(): string {
  return TEASER_PRICE_ENABLED
    ? `${OFFICIAL_DOOR_PRICE_MAD} DH`
    : formatEUR(VISITOR_PACK_PRICE_EUR_CENTS);
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
