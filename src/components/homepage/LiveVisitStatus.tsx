'use client';

import { useSyncExternalStore } from 'react';
import { Landmark } from 'lucide-react';
import {
  currentOpenState,
  serverOpenState,
  subscribeToClock,
  OPEN_LABEL,
  CLOSE_LABEL,
  LAST_ENTRY_LABEL,
} from '@/config/visiting-today';

/*
 * The right-hand half of the hero badge, told the truth.
 *
 * ── WHO THIS IS FOR ──
 *
 * Search Console files this site's best traffic under "Morocco": foreign
 * tourists searching from a Moroccan IP, 3.7% CTR against France's 0.4%, and
 * about half of them buy. They arrive from the knowledge panel's "Website"
 * button with a phone in their hand, usually the same day they mean to go.
 *
 * What that person needs first is not the history of the Bahia. It is: is it
 * open, and can I still get in today. The badge already occupied the first
 * line of the page and spent it on "a cool palace, no queue" — true of every
 * day at every hour, which is another way of saying it told them nothing.
 *
 * This was first built as its own section under the hero. On a 390px phone
 * that put it below the fold, under three CTAs and behind the cookie banner:
 * the one visitor it exists for had to scroll to reach it. It says the same
 * thing in the place they already look.
 *
 * ── WHY A CLIENT COMPONENT ──
 *
 * The site is served from cache, so a server-rendered "Open now" would be
 * whatever was true at build time — after five o'clock, a lie told
 * confidently. The clock is read through useSyncExternalStore, whose server
 * snapshot is null.
 *
 * Null does not mean empty here: it renders `fallback`, the same static
 * string the badge has always shown. So the server HTML is unchanged, a
 * visitor without JavaScript sees what they saw before, and the live status
 * replaces it only once a real clock has answered. Nothing flashes wrong and
 * nothing disappears.
 */

export type LiveVisitStatusStrings = {
  openNow: string;
  closingSoon: string;
  afterLastEntry: string;
  closedNow: string;
  untilClose: string;
  lastEntry: string;
  opensAt: string;
};

export function LiveVisitStatus({
  strings,
  fallback,
}: {
  strings: LiveVisitStatusStrings;
  /** What the badge says before a clock has answered, and without JS. */
  fallback: string;
}) {
  const state = useSyncExternalStore(subscribeToClock, currentOpenState, serverOpenState);

  let label = fallback;
  let open = true;

  if (state) {
    /*
     * Each state carries the one number that is actionable in it, and no
     * more: the pill is a single line on a phone. While the palace is simply
     * open, the closing time is enough; in the half hour before last entry it
     * is the last entry that matters; once that has passed, so has the day.
     */
    if (state.state === 'open') {
      label = `${strings.openNow} · ${strings.untilClose} ${CLOSE_LABEL}`;
    } else if (state.state === 'closing-soon') {
      label = `${strings.closingSoon} · ${strings.lastEntry} ${LAST_ENTRY_LABEL}`;
    } else if (state.state === 'after-last-entry') {
      label = strings.afterLastEntry;
      open = false;
    } else {
      label = `${strings.closedNow} · ${strings.opensAt} ${OPEN_LABEL}`;
      open = false;
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Landmark
        size={16}
        className={`shrink-0 sm:w-5 sm:h-5 ${open ? 'text-[#27906E]' : 'text-[#C4452D]'}`}
      />
      {/*
        * No whitespace-nowrap, unlike the temperature beside it. "Closing
        * soon - last entry 16:30" is half again as long as the string this
        * replaced, and a pill that cannot wrap would push itself off a 390px
        * screen for the half hour when it matters most.
        */}
      <span className="text-white text-xs sm:text-base font-semibold">{label}</span>
    </div>
  );
}
