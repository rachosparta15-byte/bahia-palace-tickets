/**
 * How far ahead a visit must be booked.
 *
 * We do not hold a stock of official tickets. Every booking is sourced by hand
 * from the monument after the payment clears, and the QR is then delivered to
 * the customer. That takes a working day or two, so selling a visit for today
 * or tomorrow sells something we cannot reliably hand over — and a ticket that
 * arrives after the visit date is a full refund plus a ruined morning for a
 * family that has already planned around it.
 *
 * Two clear days is the shortest window that survives a Sunday, a public
 * holiday, or a payment that settles overnight.
 *
 * LOWERING THIS IS A COMMERCIAL DECISION, NOT A TECHNICAL ONE. It only becomes
 * safe once tickets are held in stock and assigned automatically; until then,
 * shrinking it moves the risk onto the customer.
 */
export const BOOKING_LEAD_DAYS = 2;

/**
 * Local calendar date as YYYY-MM-DD.
 *
 * Deliberately not `toISOString().slice(0, 10)`, which converts to UTC first:
 * for a visitor east of Greenwich that turns their evening into the next day
 * and shifts the whole window by one. Mirrors `toISODate` in the DatePicker.
 */
export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

/**
 * The earliest visit date on sale, as YYYY-MM-DD.
 *
 * Computed from the server's clock in the API and from the browser's clock in
 * the picker. Those can disagree by a day across a timezone boundary, which is
 * exactly why the server checks again rather than trusting the greyed-out
 * cells: the calendar is a courtesy, the API route is the rule.
 */
export function earliestVisitDate(now: Date = new Date()): string {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  d.setDate(d.getDate() + BOOKING_LEAD_DAYS);
  return toISODate(d);
}

/** True when `iso` (YYYY-MM-DD) falls inside the closed window. */
export function isTooSoon(iso: string, now: Date = new Date()): boolean {
  return iso < earliestVisitDate(now);
}
