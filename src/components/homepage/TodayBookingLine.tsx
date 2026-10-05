'use client';

import { useSyncExternalStore } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  CLOSE_LABEL,
  LAST_ENTRY_LABEL,
  OPEN_LABEL,
  OPEN_MINUTES,
  currentOpenState,
  formatDuration,
  serverOpenState,
  subscribeToClock,
} from '@/config/visiting-today';

/**
 * "Open today until 17:00 · last entry 16:30 — Book now, show the QR on your
 * phone at the door", under the ticket options heading.
 *
 * Most visitors read this standing in Marrakech on a phone, deciding whether
 * to go today: the reason to book now is the palace's own clock, so the line
 * follows it (Marrakech time, whatever the visitor's own zone). Nothing here
 * is invented urgency — no seat counts, no timers that reset.
 *
 * Renders nothing on the server, which cannot know the time, and appears once
 * the browser has read the clock.
 */
export function TodayBookingLine() {
  const t = useTranslations('tickets');
  const locale = useLocale();
  const state = useSyncExternalStore(subscribeToClock, currentOpenState, serverOpenState);
  if (!state) return null;

  let dot = 'bg-[#27906E]';
  let status: string;
  let cta = t('todayCtaNow');

  if (state.state === 'open') {
    status = t('todayOpen', { close: CLOSE_LABEL, last: LAST_ENTRY_LABEL });
  } else if (state.state === 'closing-soon') {
    dot = 'bg-[#E8A33D]';
    status = t('todayClosing', {
      last: LAST_ENTRY_LABEL,
      left: formatDuration(locale, state.minutesToLastEntry),
    });
  } else if (state.state === 'after-last-entry') {
    dot = 'bg-[#C4452D]';
    status = t('todayAfter');
    cta = t('todayCtaTomorrow');
  } else {
    dot = 'bg-[#C4452D]';
    status = t('todayClosed', { open: OPEN_LABEL });
    // Before opening it is still today's visit; after closing, tomorrow's.
    if (state.opensInMinutes > OPEN_MINUTES) cta = t('todayCtaTomorrow');
  }

  return (
    <p className="mx-auto mt-4 flex w-fit max-w-xl flex-col items-center gap-1 rounded-2xl border border-[rgba(232,163,61,0.25)] bg-[rgba(232,163,61,0.08)] px-4 py-2.5 text-center text-xs leading-snug text-[#F5E8CC] sm:text-sm">
      <span className="inline-flex items-center gap-2">
        <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} aria-hidden />
        {status}
      </span>
      <span className="font-semibold text-[#E8A33D]">{cta}</span>
    </p>
  );
}
