/**
 * OFFICIAL TICKET FULFILMENT — the single seam between "customer paid us"
 * and "customer has an official Bahia Palace entry ticket".
 *
 * ─────────────────────────────────────────────────────────────────────
 * WHY THIS MODULE EXISTS
 * ─────────────────────────────────────────────────────────────────────
 * How we source the official 100 MAD ticket is NOT decided yet. The two
 * candidates have very different mechanics:
 *
 *   (a) AFFILIATE — we redirect/hand off to a partner (GetYourGuide,
 *       Tiqets, etc.) who issues the ticket. Fulfilment is near-instant
 *       and we get back a partner booking reference + voucher URL.
 *
 *   (b) MANUAL — a human on our side buys the ticket at the gate or via
 *       the ministry portal and emails the voucher. Fulfilment is
 *       asynchronous, measured in hours, and can fail (sold out, closed).
 *
 * Rather than guess, everything above this module is written against
 * ONE function — `fulfillTicket()` — so that choosing (a) or (b) later
 * means implementing a strategy here and touching NO UI, NO checkout
 * route, and NO database schema.
 *
 * ─────────────────────────────────────────────────────────────────────
 * WHAT IT DOES TODAY
 * ─────────────────────────────────────────────────────────────────────
 * It records the INTENT to fulfil and returns `status: 'recorded'`.
 * It does not buy anything, call any partner, or promise the customer a
 * ticket. Callers must treat 'recorded' as "not yet fulfilled" and say so
 * in the UI — never render a recorded intent as a valid entry ticket.
 *
 * ─────────────────────────────────────────────────────────────────────
 * TO WIRE UP THE REAL THING LATER
 * ─────────────────────────────────────────────────────────────────────
 *   1. Implement `fulfillViaAffiliate()` or `fulfillViaManualPurchase()`.
 *   2. Point `resolveStrategy()` at it (env-driven, so it can be staged).
 *   3. Persist the returned reference/voucher against the booking.
 * The async, can-fail shape of the return type is deliberate: it already
 * accommodates (b), so adopting the slower path is not a rewrite.
 */

import type { TicketFulfillmentRecord } from './types';
export type * from './types';

import {
  type FulfillTicketParams,
  type FulfillTicketResult,
  type FulfillmentStrategy,
} from './types';

/**
 * Which sourcing strategy is active. Defaults to 'record-only' — the safe
 * no-op. This is separate from PAYMENTS_ENABLED on purpose: you may well
 * want payments live with fulfilment still manual, or fulfilment tested
 * with payments off.
 */
function resolveStrategy(): FulfillmentStrategy {
  const raw = process.env.TICKET_FULFILLMENT_STRATEGY;
  if (raw === 'affiliate' || raw === 'manual') return raw;
  return 'record-only';
}

/**
 * Record (and eventually perform) fulfilment of the official entry ticket.
 *
 * Callers should treat a non-'fulfilled' status as "the customer does not
 * have a ticket yet" and must not imply otherwise in any email or page.
 *
 * This never throws for business failures — it returns a result with
 * status 'failed' so the caller can decide (refund? retry? notify staff?).
 * Throwing is reserved for programmer error.
 */
export async function fulfillTicket(
  params: FulfillTicketParams
): Promise<FulfillTicketResult> {
  const strategy = resolveStrategy();
  const record: TicketFulfillmentRecord = {
    bookingId: params.bookingId,
    reference: params.reference,
    visitDate: params.visitDate,
    visitors: params.visitors,
    strategy,
    recordedAt: new Date().toISOString(),
  };

  switch (strategy) {
    case 'affiliate':
      return fulfillViaAffiliate(params, record);
    case 'manual':
      return fulfillViaManualPurchase(params, record);
    case 'record-only':
    default:
      return recordIntentOnly(record);
  }
}

/**
 * CURRENT BEHAVIOUR. Logs the intent so a human can see what would have
 * been purchased, and reports honestly that nothing was fulfilled.
 *
 * TODO(fulfilment): persist this to a `TicketFulfillment` table instead of
 * console — a log line is not durable and will be lost on redeploy. Left as
 * console deliberately: adding a table before the strategy is chosen would
 * bake in a schema we may have to migrate away from.
 */
async function recordIntentOnly(
  record: TicketFulfillmentRecord
): Promise<FulfillTicketResult> {
  console.info(
    '[fulfillTicket] INTENT RECORDED — no official ticket purchased.',
    record
  );

  return {
    status: 'recorded',
    strategy: 'record-only',
    record,
    customerMessage:
      'Your official entry ticket is being arranged. We will email it to you before your visit date.',
  };
}

/**
 * TODO(fulfilment): implement if we go the affiliate route.
 * Expected shape: call the partner's booking API with visitDate + visitors,
 * receive a voucher URL and partner reference, return status 'fulfilled'
 * with those attached. Watch for: partner-side availability failures, and
 * the commission/refund interaction with our own refund policy.
 */
async function fulfillViaAffiliate(
  _params: FulfillTicketParams,
  record: TicketFulfillmentRecord
): Promise<FulfillTicketResult> {
  console.warn(
    '[fulfillTicket] strategy=affiliate is not implemented; falling back to record-only.'
  );
  return recordIntentOnly({ ...record, strategy: 'record-only' });
}

/**
 * TODO(fulfilment): implement if we go the manual route.
 * Expected shape: create a staff task (email/dashboard row) with the visit
 * date and visitor count, return status 'pending'. A human later marks it
 * fulfilled and attaches the voucher. Watch for: same-day visits, where the
 * manual turnaround may be too slow to honour — that likely needs a cutoff
 * enforced at checkout, not here.
 */
async function fulfillViaManualPurchase(
  _params: FulfillTicketParams,
  record: TicketFulfillmentRecord
): Promise<FulfillTicketResult> {
  console.warn(
    '[fulfillTicket] strategy=manual is not implemented; falling back to record-only.'
  );
  return recordIntentOnly({ ...record, strategy: 'record-only' });
}
