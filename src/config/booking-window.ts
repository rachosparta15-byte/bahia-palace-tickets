/**
 * How far ahead a visit must be booked. Zero means today is on sale.
 *
 * This was 2, and the reason is worth keeping written down: we hold no stock
 * of official tickets. Every booking is sourced by hand from the monument
 * after the payment clears, and the QR is then delivered to the customer.
 * Two clear days was the shortest window that survived a Sunday, a public
 * holiday, or a payment that settled overnight.
 *
 * Opened to same-day on the owner's instruction, 15 August 2026. It is a
 * commercial decision, not a technical one, and it moves a real risk onto the
 * operation rather than removing it: an order placed at 16:00 for a visit at
 * 16:30 has to be collected and emailed inside half an hour, and a ticket that
 * arrives after the visit is a refund plus a ruined afternoon. The customer
 * cannot see that constraint, so the copy no longer promises delivery "24
 * hours before" for a same-day order — see visitorPack.faq.items.delivery.
 *
 * Raising it back is one number here; the four sentences in messages/*.json
 * that describe the window would need to move with it.
 */
export const BOOKING_LEAD_DAYS = 0;

/**
 * The monument's own timezone.
 *
 * The window is a promise about Marrakech: "we need two days to collect your
 * ticket from the palace" is two of the palace's days, not the server's. Vercel
 * runs in UTC, so between midnight and 01:00 Moroccan time the server still
 * believed it was yesterday and sold a visit date one day inside the window —
 * every single night, for an hour.
 */
const MONUMENT_TZ = 'Africa/Casablanca';

/**
 * Today's calendar date in Marrakech, as YYYY-MM-DD.
 *
 * `en-CA` because its short date format is already YYYY-MM-DD, which avoids
 * reassembling parts by hand and getting the order wrong.
 */
function todayInMorocco(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: MONUMENT_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

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
  // Anchored to Marrakech's calendar day, then walked forward. Built from the
  // Y/M/D parts at UTC noon so the arithmetic cannot drift across a boundary
  // on the way back out.
  const [y, m, d] = todayInMorocco(now).split('-').map(Number);
  const anchor = new Date(Date.UTC(y, m - 1, d, 12));
  anchor.setUTCDate(anchor.getUTCDate() + BOOKING_LEAD_DAYS);
  return anchor.toISOString().slice(0, 10);
}

/** True when `iso` (YYYY-MM-DD) falls inside the closed window. */
export function isTooSoon(iso: string, now: Date = new Date()): boolean {
  return iso < earliestVisitDate(now);
}
