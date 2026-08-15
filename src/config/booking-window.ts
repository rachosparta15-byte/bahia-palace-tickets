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
 * When the palace stops letting people in, and how much of that day we need.
 *
 * Same-day booking is only honest while there is time left to do the work: the
 * payment has to clear, the ticket has to be collected at the palace, and the
 * QR has to reach the customer's phone before they walk up to the gate. An
 * order at 16:45 for a palace that closes at 17:00 is a refund with extra
 * steps.
 *
 * So today comes off sale three hours before closing — 14:00 in Marrakech —
 * and tomorrow becomes the earliest date. This is the operational half of
 * BOOKING_LEAD_DAYS = 0: the day is open, but not the last hours of it.
 */
const CLOSING_HOUR = 17;
const HOURS_NEEDED_BEFORE_CLOSING = 3;
const SAME_DAY_CUTOFF_HOUR = CLOSING_HOUR - HOURS_NEEDED_BEFORE_CLOSING;

/**
 * The hour of the day in Marrakech, 0–23.
 *
 * `hourCycle: 'h23'` because the default for en-GB gives "24" at midnight,
 * which parses as 24 and pushes every midnight order into tomorrow.
 */
function hourInMorocco(now: Date): number {
  return Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: MONUMENT_TZ,
      hour: '2-digit',
      hourCycle: 'h23',
    }).format(now),
  );
}

/** True once today is too late to be sourced and delivered. */
export function sameDayClosed(now: Date = new Date()): boolean {
  return hourInMorocco(now) >= SAME_DAY_CUTOFF_HOUR;
}

/** The cutoff as "14:00", for the copy that has to state it. */
export const SAME_DAY_CUTOFF_LABEL = `${String(SAME_DAY_CUTOFF_HOUR).padStart(2, '0')}:00`;

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
  // The lead in days, plus one more if today is already too late to fulfil.
  // Only relevant while the lead is zero; with a lead of 1 or more, today was
  // never on sale and the cutoff has nothing left to close.
  const skipToday = BOOKING_LEAD_DAYS === 0 && sameDayClosed(now) ? 1 : 0;
  anchor.setUTCDate(anchor.getUTCDate() + BOOKING_LEAD_DAYS + skipToday);
  return anchor.toISOString().slice(0, 10);
}

/** True when `iso` (YYYY-MM-DD) falls inside the closed window. */
export function isTooSoon(iso: string, now: Date = new Date()): boolean {
  return iso < earliestVisitDate(now);
}
