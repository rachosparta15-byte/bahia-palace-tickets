/**
 * What kind of machine an event came from.
 *
 * Server-side, from the User-Agent header, rather than from the browser. The
 * lead modal already sent a `device` field of its own, but only the lead modal
 * did — ticket_cta_click and every checkout step sent nothing, so the one
 * question worth asking ("do phones convert worse than desktops?") could not
 * be asked of the funnel at all. Deriving it where every event already passes
 * means it is filled in for all of them, and a new event added next month
 * cannot forget to include it.
 *
 * Deliberately coarse. This exists to split a funnel four ways, not to
 * fingerprint anyone: no version numbers, no screen size, no browser build.
 * The User-Agent is also freely editable by whoever sends it, which is fine
 * for reading a trend and would not be fine for anything that mattered.
 */

export type DeviceKind = 'phone' | 'tablet' | 'desktop' | 'bot' | 'unknown';
export type OsKind = 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'other' | 'unknown';

export interface UaSummary {
  device: DeviceKind;
  os: OsKind;
}

export function summariseUserAgent(raw: string | null | undefined): UaSummary {
  if (!raw) return { device: 'unknown', os: 'unknown' };
  const ua = raw.toLowerCase();

  /*
   * Bots first, and kept rather than discarded.
   *
   * Googlebot fetching a page is not a visitor who failed to convert. Counting
   * it as one quietly deflates every rate on the funnel, and the effect is
   * largest exactly when real traffic is smallest — which is now.
   */
  if (/bot|crawl|spider|slurp|bingpreview|headlesschrome|lighthouse|pingdom|gtmetrix/.test(ua)) {
    return { device: 'bot', os: 'other' };
  }

  /*
   * iOS before macOS: an iPhone's User-Agent contains "like Mac OS X", so a
   * Mac check written first claims every iPhone on the site.
   */
  let os: OsKind = 'unknown';
  if (/iphone|ipod/.test(ua)) os = 'iOS';
  else if (/ipad/.test(ua)) os = 'iOS';
  else if (/android/.test(ua)) os = 'Android';
  else if (/windows nt/.test(ua)) os = 'Windows';
  else if (/mac os x|macintosh/.test(ua)) os = 'macOS';
  else if (/linux|x11|cros/.test(ua)) os = 'Linux';
  else os = 'other';

  let device: DeviceKind;
  if (/ipad|tablet|playbook|silk/.test(ua) || (/android/.test(ua) && !/mobile/.test(ua))) {
    /*
     * Android tablets identify themselves by NOT saying "mobile", which is the
     * only reliable signal Google gives. iPadOS goes the other way and reports
     * itself as a Macintosh, so a modern iPad lands in `desktop` below and
     * nothing server-side can tell otherwise — telling them apart needs a
     * touch check in the browser. Noted rather than guessed at.
     */
    device = 'tablet';
  } else if (/mobi|iphone|ipod|android|windows phone/.test(ua)) {
    device = 'phone';
  } else {
    device = 'desktop';
  }

  return { device, os };
}

/** "Phone · iOS" — one readable cell for the admin tables. */
export function describeUa(device: string | null, os: string | null): string {
  if (!device && !os) return 'unknown';
  const d = device ?? 'unknown';
  const label = d.charAt(0).toUpperCase() + d.slice(1);
  return os && os !== 'unknown' && os !== 'other' ? `${label} · ${os}` : label;
}
