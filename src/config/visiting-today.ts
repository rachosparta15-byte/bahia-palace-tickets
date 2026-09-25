/*
 * The opening hours, in one place, for the "visiting today" block.
 *
 * Every number here was already published on this site and is copied, not
 * invented: 9:00-17:00 with last entry 16:30 appears in practical.hoursVal,
 * faq.openingHoursVal and two FAQ answers; the Ramadan window comes from the
 * same FAQ answer. Nothing new is asserted.
 *
 * MONUMENT_TZ matches src/config/booking-window.ts, which already computes
 * the same-day cutoff against Africa/Casablanca. Two files disagreeing about
 * what time it is in Marrakech is exactly the bug this avoids.
 */
export const MONUMENT_TZ = 'Africa/Casablanca';

/** Minutes past midnight, so comparisons need no date arithmetic. */
export const OPEN_MINUTES = 9 * 60;        // 09:00
export const CLOSE_MINUTES = 17 * 60;      // 17:00
export const LAST_ENTRY_MINUTES = 16 * 60 + 30; // 16:30

export const OPEN_LABEL = '9:00';
export const CLOSE_LABEL = '17:00';
export const LAST_ENTRY_LABEL = '16:30';

/**
 * Ramadan hours, stated as approximate because the published FAQ says
 * "typically" — the exact window moves year to year and is set locally.
 * The block links to the hours page rather than asserting a time during
 * Ramadan; a visitor standing outside a closed door is the failure mode.
 */
export const RAMADAN_LABEL = '9:30 – 15:00';

export type OpenState =
  | { state: 'open'; minutesToLastEntry: number }
  | { state: 'closing-soon'; minutesToLastEntry: number }
  | { state: 'after-last-entry' }
  | { state: 'closed-now'; opensInMinutes: number };

/**
 * Where the palace is in its day, right now, in Marrakech.
 *
 * Computed from the visitor's clock converted to Africa/Casablanca, so it is
 * correct whether they are standing in the medina or reading from Lyon. This
 * runs in the browser: a static build cannot know the time, and pretending
 * otherwise would ship a cached "open now" that is wrong after five o'clock.
 */
export function openStateAt(now: Date): OpenState {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: MONUMENT_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0');
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');
  const mins = hour * 60 + minute;

  if (mins < OPEN_MINUTES) return { state: 'closed-now', opensInMinutes: OPEN_MINUTES - mins };
  if (mins >= CLOSE_MINUTES) return { state: 'closed-now', opensInMinutes: 24 * 60 - mins + OPEN_MINUTES };
  if (mins >= LAST_ENTRY_MINUTES) return { state: 'after-last-entry' };

  const toLastEntry = LAST_ENTRY_MINUTES - mins;
  return toLastEntry <= 60
    ? { state: 'closing-soon', minutesToLastEntry: toLastEntry }
    : { state: 'open', minutesToLastEntry: toLastEntry };
}

/*
 * The clock, as an external store.
 *
 * The block subscribes to this through useSyncExternalStore rather than
 * computing the state in an effect. Two reasons, and the second is the one
 * that matters:
 *
 *  - React treats "the current time" as exactly this: state owned by
 *    something outside React. Reading it in an effect and calling setState
 *    causes the cascading render the linter objects to.
 *  - getServerSnapshot returns null, so the server renders nothing and
 *    hydration renders nothing. The status appears only once the browser has
 *    a real clock. There is no flash of a wrong "Open now" and no mismatch.
 *
 * getSnapshot must return the SAME object until the answer actually changes,
 * or React re-renders forever. Hence the cache, keyed on the minute.
 */
let cachedMinute = -1;
let cachedState: OpenState | null = null;

export function currentOpenState(): OpenState {
  const minute = Math.floor(Date.now() / 60_000);
  if (minute !== cachedMinute || cachedState === null) {
    cachedMinute = minute;
    cachedState = openStateAt(new Date());
  }
  return cachedState;
}

/** Nothing is known about the time on the server, and nothing is claimed. */
export function serverOpenState(): null {
  return null;
}

/**
 * Half a minute, not a full one: a visitor can sit on the page across the
 * 16:30 boundary, and polling at the same period as the cache would let the
 * displayed minute lag behind by up to a minute.
 */
export function subscribeToClock(onChange: () => void): () => void {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
}

/** "1 h 20" / "45 min", in the reader's language, without a translation key. */
export function formatDuration(locale: string, minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const nf = new Intl.NumberFormat(locale);
  if (h === 0) return `${nf.format(m)} min`;
  return m === 0 ? `${nf.format(h)} h` : `${nf.format(h)} h ${nf.format(m)}`;
}
