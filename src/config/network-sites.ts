/**
 * The other monuments in the network, for cross-selling after a purchase.
 *
 * Shown on the confirmation page and in the confirmation email — the two
 * moments a customer has just decided we are worth paying and is still
 * planning the rest of their trip.
 *
 * `ticketsOpen` IS THE WHOLE POINT OF THIS FILE. Three of these sites are live
 * as visitor guides but cannot take payment yet. Sending someone who has just
 * paid us to a "Book now" button that answers "Booking opens soon" spends the
 * trust of a completed sale on a dead end — worse than not advertising at all,
 * because it was our email that sent them.
 *
 * So each entry states plainly whether tickets can be bought, and the copy
 * follows: an open site invites a booking, a closed one offers the visitor
 * guide and nothing more. No "coming soon" countdowns and no email capture —
 * a promise with no date is still a promise.
 *
 * TO OPEN ONE: flip `ticketsOpen` to true here at the same moment payments go
 * live on that site, not before. The confirmation page and the email both read
 * this file, so one edit changes both.
 */

export interface NetworkSite {
  /** Monument name as a visitor would say it. */
  name: string;
  /** Where it is, in one short phrase — most buyers are planning on a map. */
  location: string;
  url: string;
  /** One line on why it is worth the visit. Not marketing copy; a reason. */
  blurb: string;
  /** Price in EUR when tickets are open. Null while they are not. */
  priceEUR: number | null;
  /** Whether that site can actually complete a purchase today. */
  ticketsOpen: boolean;
}

export const NETWORK_SITES: NetworkSite[] = [
  {
    name: 'El Badi Palace',
    location: 'Marrakech — 8 minutes from Bahia',
    url: 'https://badi-palace.com',
    blurb:
      'The ruined sixteenth-century palace of Ahmad al-Mansur, and the storks that now nest on its walls.',
    /*
     * OPEN, and this file said otherwise.
     *
     * El Badi has been selling for some time — order BDP-TTREEW was paid at
     * EUR23.98 for two on 19/08/2026 — while `ticketsOpen: false` here made
     * every Bahia confirmation email tell the customer that tickets were not
     * on sale and offer them a visitor guide instead. The one moment a buyer
     * has just decided we are worth paying, spent on a "we can't sell you
     * this" that was not true.
     *
     * The price is the hub's `allInclusivePriceEur`, which is what actually
     * gets charged — 13.99 here was a figure nothing on that site quotes.
     *
     * It then went stale the other way: this said 11.99 while badi-palace.com
     * charged 12.99, so the cross-sell email invited people to "Book from
     * €11.99" and the checkout they landed on asked for a euro more. Verified
     * against the live button: data-unit-cents="1299".
     */
    priceEUR: 12.99,
    ticketsOpen: true,
  },
  {
    name: 'Saadian Tombs',
    location: 'Marrakech — beside the Kasbah Mosque',
    url: 'https://saadian-tombs.com',
    blurb:
      'Sealed for two centuries and reopened in 1917. The Hall of Twelve Columns is the finest room in the city.',
    // Also open: saadian-tombs.com carries a live "Book Now" into
    // /tickets/#checkout. Verified against the live button: 1299.
    priceEUR: 12.99,
    ticketsOpen: true,
  },
  {
    name: 'Caves of Hercules',
    location: 'Tangier — a day trip from the north coast',
    url: 'https://herculescaves.com',
    blurb:
      'A sea cave whose opening onto the Atlantic is shaped, from the inside, like the map of Africa.',
    // Left closed deliberately: this one was NOT verified as selling, and the
    // rule in this file is that `ticketsOpen` flips when payments go live on
    // that site, not when somebody assumes they have.
    // 10.00, not 11.99: Cap Spartel is 80 MAD at the gate, not 100, and the
    // pack is priced against it. Verified against the live button: 1000.
    priceEUR: 10.0,
    ticketsOpen: false,
  },
];

/** The sites worth showing a customer who has just bought from us. */
export function crossSellSites(): NetworkSite[] {
  return NETWORK_SITES;
}
