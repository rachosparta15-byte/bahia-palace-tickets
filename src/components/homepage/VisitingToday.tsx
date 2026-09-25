'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import {
  currentOpenState,
  serverOpenState,
  subscribeToClock,
  formatDuration,
  OPEN_LABEL,
  CLOSE_LABEL,
  LAST_ENTRY_LABEL,
  type OpenState,
} from '@/config/visiting-today';

/*
 * For the visitor who is already in Marrakech.
 *
 * Search Console files this site's best traffic under "Morocco" — foreign
 * tourists searching from a Moroccan IP, 3.7% CTR against France's 0.4%,
 * and about half of them buy. They arrive from the knowledge panel's
 * "Website" button with a phone in their hand, usually the same day they
 * intend to go.
 *
 * What that person needs first is not history. It is: is it open, how long
 * have I got, and can I still get in today.
 *
 * ── WHY THIS IS A CLIENT COMPONENT ──
 *
 * The site is served from cache. A server-rendered "open now" would be
 * whatever was true when the page was built, which after five o'clock is a
 * lie told confidently. The state is computed in the browser, from the
 * visitor's own clock converted to Africa/Casablanca.
 *
 * The clock is read through useSyncExternalStore, whose server snapshot is
 * null — so the server renders nothing, hydration renders nothing, and the
 * status appears only once a real clock has answered. No flash of a wrong
 * status, no hydration mismatch, and no setState in an effect.
 *
 * ── AND WHY THERE IS NO HEADING IN HERE ──
 *
 * This sits directly under the hero, so it is the first thing after the
 * headline on a phone — close enough to the top to be read, without moving
 * anything. The <h1> stays in Hero and stays first in the markup. Reordering
 * a document to win a layout is how a page loses the one element Google reads
 * first, and the status line is not a heading anyway: aria-label carries it
 * for a screen reader.
 */

export type VisitingTodayStrings = {
  openNow: string;
  closingSoon: string;
  afterLastEntry: string;
  closedNow: string;
  opensAt: string;
  lastEntry: string;
  timeLeft: string;
  queueNote: string;
  cta: string;
  directions: string;
};

const MAPS_URL = 'https://maps.google.com/?q=Bahia+Palace+Marrakech';

/*
 * Which campaign this click belongs to.
 *
 * The whole point of the /ar work is to find out whether the knowledge
 * panel's "Website" button actually sells anything. It cannot be answered
 * from a server-rendered link, because the answer depends on how this
 * particular visitor arrived — so the campaign is decided here, in the
 * browser, and appended to the product URL.
 *
 *   maps-panel    arrived with utm_source=google_maps
 *   ar-redirect   was sent here from /ar by the language redirect
 *   visiting-today  everybody else who books from this block
 *
 * The ar-redirect case reads the same sessionStorage flag the redirect
 * sets, so the two cannot drift apart.
 */
function campaignFor(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('utm_source') === 'google_maps') return 'maps-panel';
    if (sessionStorage.getItem('langRedirectDone')) return 'ar-redirect';
  } catch {
    // Storage or URL blocked: fall through to the default rather than fail.
  }
  return 'visiting-today';
}

function withCampaign(url: string, campaign: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('campaign', `visitbahiapalace-${campaign}`);
    return u.toString();
  } catch {
    return url;
  }
}

export function VisitingToday({
  locale,
  strings,
  ticketUrl,
}: {
  locale: string;
  strings: VisitingTodayStrings;
  /** The skip-the-line product URL. The campaign is set per visitor here. */
  ticketUrl: string;
}) {
  const state: OpenState | null = useSyncExternalStore(
    subscribeToClock,
    currentOpenState,
    serverOpenState,
  );

  // A non-null state means a browser clock answered, so window is safe to
  // read. Memoised on that, not on every tick.
  const mounted = state !== null;
  const href = useMemo(
    () => (mounted ? withCampaign(ticketUrl, campaignFor()) : ticketUrl),
    [mounted, ticketUrl],
  );

  if (!state) return null;

  const isOpen = state.state === 'open' || state.state === 'closing-soon';
  const dot = isOpen ? 'bg-[#8FA63C]' : 'bg-[#C4452D]';

  let headline: string;
  let detail: string;
  if (state.state === 'open') {
    headline = strings.openNow;
    detail = `${strings.lastEntry} ${LAST_ENTRY_LABEL} · ${strings.timeLeft.replace(
      '{time}',
      formatDuration(locale, state.minutesToLastEntry),
    )}`;
  } else if (state.state === 'closing-soon') {
    headline = strings.closingSoon;
    detail = strings.timeLeft.replace('{time}', formatDuration(locale, state.minutesToLastEntry));
  } else if (state.state === 'after-last-entry') {
    headline = strings.afterLastEntry;
    detail = `${strings.opensAt} ${OPEN_LABEL}`;
  } else {
    headline = strings.closedNow;
    detail = `${strings.opensAt} ${OPEN_LABEL} · ${OPEN_LABEL}–${CLOSE_LABEL}`;
  }

  return (
    <section
      aria-label={headline}
      className="rounded-2xl border border-[rgba(232,163,61,0.22)] bg-[#251A0F] p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[#F5E8CC]">{headline}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-sm text-[#C4A882]">
            <Clock size={13} className="shrink-0 text-[#E8A33D]" aria-hidden />
            {detail}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#C4A882]">{strings.queueNote}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href={href}
              rel="sponsored nofollow noopener"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl bg-[#C4452D] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a83826]"
            >
              {strings.cta}
              <ArrowRight size={15} aria-hidden />
            </a>
            <a
              href={MAPS_URL}
              rel="noopener"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E8A33D] underline-offset-4 hover:underline"
            >
              <MapPin size={14} aria-hidden />
              {strings.directions}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
