/**
 * Where the shared checkout lives.
 *
 * Payments for every site in the network are taken through one Stripe account,
 * held by the parent company. This site keeps its own brand, its own content and
 * its own analytics; what it does not keep is a second Stripe account, a second
 * order table and a second set of chargeback evidence.
 *
 * The customer never leaves visitbahiapalace.com to pay. The Payment Intent is
 * created by the parent's API and rendered here with Stripe's embedded Payment
 * Element, and the charge reaches the card statement as "MLOCAL* BAHIA" — the
 * brand they remember buying from, which is the single largest driver of
 * avoidable "I don't recognise this charge" disputes.
 */

/** This site's id in the parent's network config. Must match exactly. */
export const SITE_ID = 'visitbahiapalace';

/** The monument this site sells entry to, in the parent's config. */
export const MONUMENT_ID = 'bahia-palace';

/** This site's own origin, sent so the order's evidence records where the sale happened. */
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://visitbahiapalace.com';

/**
 * The parent that holds the Stripe account and the order store.
 *
 * Overridable for local development, where the parent runs on a port rather
 * than a domain. A wrong value here fails loudly at checkout rather than
 * silently taking money into the wrong place.
 */
export const CHECKOUT_ORIGIN =
  process.env.MARRAKECHLOCAL_ORIGIN?.replace(/\/$/, '') ?? 'https://marrakechlocal.com';
