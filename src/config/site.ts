/**
 * Brand-level facts for visitbahiapalace.com.
 *
 * WHAT DOES NOT BELONG HERE: the selling entity. Who the customer contracts
 * with, the company registration, the registered address and the trading terms
 * all come from the synced legal documents (src/content/legal), which are the
 * same across the network. This contact used to sit in a module that also
 * hard-coded a company block, and that is exactly how a site ends up telling a
 * customer they are buying from one company while another one charges them.
 *
 * WHAT DOES BELONG HERE: the customer-facing channels for this brand. A visitor
 * who bought on visitbahiapalace.com writes to the visitbahiapalace inbox, which
 * is normal and is not a claim about who the seller is.
 */
export const SITE = {
  domain: 'visitbahiapalace.com',
  brand: 'Visit Bahia Palace',
  /**
   * The company inbox — on a domain that can actually receive mail.
   *
   * This said admin@visitbahiapalace.com, the footer said
   * support@visitbahiapalace.com, and the legal documents said
   * support@marrakechlocal.com: three addresses for one business, and the first
   * two on a domain with NO MX RECORDS. Every message to either of them
   * bounced, including everything the contact form generated.
   *
   * A branded inbox is the nicer answer and is one DNS change away. Until it
   * exists, an address that works beats an address that matches — a processor
   * testing our contact channels should find a mailbox, not a bounce.
   */
  supportEmail: 'support@marrakechlocal.com',
} as const;
