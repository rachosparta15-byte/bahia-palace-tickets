/**
 * Timestamps in the admin, in the clock the operator is actually looking at.
 *
 * `toLocaleString()` with no arguments formats in the runtime's timezone. In a
 * Server Component that runtime is the Cloudflare worker, which is UTC — so a
 * booking taken at 12:17 in Marrakech was displayed as "8/20/2026, 11:17:23
 * AM". Not wrong by the machine's reckoning, and an hour wrong to every person
 * who read it.
 *
 * It also disagreed with itself. GuideCodes and QrDelivery are client
 * components, so those two formatted in the browser — Morocco time — while
 * everything around them formatted in UTC. One booking page, two clocks, an
 * hour apart, with nothing on screen to say which was which.
 *
 * ZONE IS THE IANA NAME, NOT A FIXED +1. Morocco sits on UTC+1 all year and
 * drops to UTC+0 for Ramadan. A hardcoded offset is correct for eleven months
 * and an hour out for the twelfth — and the twelfth is the month this site
 * publishes an article about, when hours change and people write in asking.
 * `Africa/Casablanca` moves on its own.
 *
 * The locale is pinned too. Left to the runtime it produced US ordering
 * (8/20/2026) for an operator who reads day-first, which turns any date before
 * the 13th into a guess.
 */
const ZONE = 'Africa/Casablanca';
const LOCALE = 'en-GB';

/** "20 Aug 2026, 12:17" — for anything that records when something happened. */
export function adminDateTime(value: Date | string | number | null | undefined): string {
  if (value == null) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(LOCALE, {
    timeZone: ZONE,
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/**
 * "20 Aug 2026" — for a day, not a moment.
 *
 * A visit date is stored at midnight UTC and means a calendar day, not an
 * instant. Rendered in the zone it stays the day the customer chose; rendered
 * anywhere west of Greenwich it would slide to the day before.
 */
export function adminDate(value: Date | string | number | null | undefined): string {
  if (value == null) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(LOCALE, {
    timeZone: ZONE,
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

/** The same day, spelled out — "Monday, 21 September 2026". */
export function adminDateLong(value: Date | string | number | null | undefined): string {
  if (value == null) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(LOCALE, {
    timeZone: ZONE,
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}
