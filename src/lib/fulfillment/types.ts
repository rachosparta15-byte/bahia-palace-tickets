/**
 * Types for official-ticket fulfilment. Kept in their own module so UI and
 * route code can import the shapes without pulling in the implementation
 * (and so the eventual affiliate SDK never leaks into a client bundle).
 */

/** How we source the official 100 MAD entry ticket. See ./index.ts. */
export type FulfillmentStrategy = 'record-only' | 'affiliate' | 'manual';

export type FulfillmentStatus =
  /** Intent logged; nothing purchased. The only status possible today. */
  | 'recorded'
  /** Handed off to a human or partner; ticket expected but not in hand. */
  | 'pending'
  /** Customer has a real, usable official ticket. */
  | 'fulfilled'
  /** Sourcing failed — caller must decide on refund/retry. */
  | 'failed';

export interface FulfillTicketParams {
  bookingId: string;
  /** Human-facing order reference, e.g. BP-4F2K9A. */
  reference: string;
  /** ISO date (YYYY-MM-DD) of the intended visit. */
  visitDate: string;
  /** Number of official entry tickets required — one per visitor. */
  visitors: number;
  customerEmail: string;
  locale: string;
}

/** What we durably know about a fulfilment attempt. */
export interface TicketFulfillmentRecord {
  bookingId: string;
  reference: string;
  visitDate: string;
  visitors: number;
  strategy: FulfillmentStrategy;
  /** ISO timestamp. */
  recordedAt: string;
  /** Partner/staff reference, once one exists. */
  externalReference?: string;
  /** URL of the issued voucher, once one exists. */
  voucherUrl?: string;
}

export interface FulfillTicketResult {
  status: FulfillmentStatus;
  strategy: FulfillmentStrategy;
  record: TicketFulfillmentRecord;
  /**
   * Honest, customer-safe sentence about the ticket's actual state.
   * Must never imply a ticket exists when status is 'recorded' or 'pending'.
   */
  customerMessage: string;
  /** Operator-facing detail when status is 'failed'. Never shown to customers. */
  failureReason?: string;
}
