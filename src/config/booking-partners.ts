/*
 * Which marketplace can actually sell a ticket for a given day.
 *
 * ── THE PROBLEM THIS EXISTS FOR ──
 *
 * The site's best traffic is somebody standing in Marrakech who means to go
 * today or tomorrow. On 2026-09-25 the Viator product answered a request for
 * the 26th with "Aucune disponibilité à cette date — la prochaine date
 * disponible est le 27 sept." The same experience was bookable for the 26th on
 * GetYourGuide.
 *
 * So the visitor we work hardest to reach was being handed the one answer that
 * ends a sale: not available. Not because the palace was full — because we
 * only ever offered one shop.
 *
 * ── HOW THE CHOICE IS MADE, AND WHY THAT IS NOT GOOD ENOUGH ──
 *
 * By lead time, from a rule observed by hand on one day. That is a weak basis
 * and it is stated here rather than hidden: real availability moves daily, per
 * product, and a rule that was right in September can be wrong in November
 * while the site goes on sounding certain.
 *
 * It is what can be built without an availability feed. Viator has an API and
 * we hold a key; GetYourGuide's is restricted to approved partners. Once both
 * can be asked, this file should ask them and delete the guess. Until then
 * VIATOR_LEAD_TIME_DAYS is the one number to correct when the pattern changes,
 * and it is worth re-checking every few weeks rather than trusting.
 *
 * ── THE FALLBACK IS ALWAYS VIATOR ──
 *
 * Every card keeps its Viator link unless this file says otherwise, and it
 * only says otherwise for a date it is sure about. An unparseable date, a date
 * in the past, a visitor who never touched the calendar, an empty
 * GETYOURGUIDE_URL — each of those leaves the page exactly as it was before
 * any of this existed.
 *
 * ── THE KILL SWITCH ──
 *
 * Set GETYOURGUIDE_URL to an empty string. Every date then routes to Viator
 * and the whole mechanism is off, without touching a component.
 */

/**
 * The same experience on GetYourGuide, with the owner's partner id.
 *
 * "Marrakech: Bahia Palace Entry Ticket with Digital Audioguide", activity
 * t1149727 — the product the owner found bookable for a date Viator could not
 * serve. Its own page states the palace hours as 9:00–17:00 with last entry at
 * 16:30, which is the third independent source to agree with what this site
 * publishes.
 *
 * NOT ASSEMBLED BY HAND. This is what GetYourGuide's own link builder
 * produces — partner dashboard, Tools → Links, with the campaign name typed
 * into its campaign field. The first version of this was built from the
 * activity URL plus partner_id and was missing utm_medium, which their
 * builder adds and which is not documented anywhere public.
 *
 * `cmp` is their campaign parameter, so bookings from this link show up under
 * Campaigns in their Analytics rather than as untagged traffic.
 *
 * Regenerate it from that tool rather than editing it here: the city slug is
 * "marrakesh" while the product name says "marrakech", which looks like a
 * typo worth fixing and is not one.
 *
 * ── IT LANDS ON A LISTING, NOT THE PRODUCT PAGE. THIS IS SETTLED. ──
 *
 * GetYourGuide redirects it to /s?…&et=1149727&lc=208 — a search page for
 * Marrakech with this activity first and highlighted. Do not go looking for
 * the cause again. It was chased down and the answer is that partner_id does
 * it, on this account:
 *
 *   product URL, no parameters                  -> product page
 *   product URL + partner_id                    -> listing
 *   product URL + partner_id + date             -> listing
 *   city slug corrected + partner_id            -> listing
 *   their own link builder's output (this one)  -> listing
 *
 * Tested by hand by the owner in a real browser, because GetYourGuide refuses
 * automated ones outright.
 *
 * It is accepted rather than worked around. partner_id, utm_medium and cmp all
 * survive the redirect, so the commission and the campaign are intact; the
 * right product is first on the page; and the listing also shows the guided
 * tours, which are exactly what Viator cannot sell for today. The cost is one
 * extra click, which is a great deal cheaper than "not available".
 */
export const GETYOURGUIDE_URL =
  '';

/**
 * How many days ahead Viator's earliest bookable date sits.
 *
 * ONE. Same day is the only day it cannot serve.
 *
 * Checked twice, and the first reading was misread. On 2026-09-25 a request
 * for the 26th was refused and the 27th offered, which looked like a two-day
 * lead. Checked again on 2026-09-26: the 26th — that day — was still refused
 * and the 27th, tomorrow, was bookable. So the refusal was never about two
 * days ahead. Viator simply does not sell for today.
 *
 * The difference matters in the direction that costs money: at 2, every
 * visitor asking for TOMORROW was sent to GetYourGuide although Viator could
 * serve them, and Viator carries three products this site sells that
 * GetYourGuide does not.
 *
 * Still an observation and not a published rule, so still worth re-checking:
 * open the Viator product, look at the earliest selectable day, and set this
 * to how many days ahead that is.
 */
export const VIATOR_LEAD_TIME_DAYS = 1;

/** Local calendar date as YYYY-MM-DD. Never round-trips through UTC. */
function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

/**
 * Whole days from today to `iso`, computed from local Y/M/D parts.
 *
 * Not from timestamps: an hour's difference either side of midnight would
 * otherwise turn "tomorrow" into "today" and route a visitor to the shop that
 * cannot serve them. Both dates are taken at local midnight first.
 */
export function daysUntil(iso: string, now: Date = new Date()): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const target = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

/*
 * NO DATE GOES ON THE PARTNER LINKS.
 *
 * It was tried. Appending date=YYYY-MM-DD to the GetYourGuide activity URL
 * does not open that activity on that day — it redirects to a search page
 * with 500+ results across Marrakech, the right product first but one more
 * click away, and the visitor dropped into a browse screen instead of a
 * booking one.
 *
 * Verified by the owner in a real browser. It could not be checked from here:
 * GetYourGuide refuses automated browsers outright, so the screenshot was the
 * only evidence available and it was enough to settle it.
 *
 * Landing on the product page and letting the visitor pick the day in the
 * partner's own calendar is fewer decisions and fewer screens. If a date
 * parameter is wanted later, confirm by hand where it actually lands first.
 */

/** Today, as the picker's minimum and its initial value. */
export function todayISO(now: Date = new Date()): string {
  return toISODate(now);
}
