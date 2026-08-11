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
    priceEUR: 13.99,
    ticketsOpen: false,
  },
  {
    name: 'Saadian Tombs',
    location: 'Marrakech — beside the Kasbah Mosque',
    url: 'https://saadian-tombs.com',
    blurb:
      'Sealed for two centuries and reopened in 1917. The Hall of Twelve Columns is the finest room in the city.',
    priceEUR: 13.99,
    ticketsOpen: false,
  },
  {
    name: 'Caves of Hercules',
    location: 'Tangier — a day trip from the north coast',
    url: 'https://herculescaves.com',
    blurb:
      'A sea cave whose opening onto the Atlantic is shaped, from the inside, like the map of Africa.',
    priceEUR: 11.99,
    ticketsOpen: false,
  },
];

/** The sites worth showing a customer who has just bought from us. */
export function crossSellSites(): NetworkSite[] {
  return NETWORK_SITES;
}
