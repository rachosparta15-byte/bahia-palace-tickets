'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { GETYOURGUIDE_URL } from '@/config/booking-partners';
import {
  type BookingMode,
  DEFAULT_BOOKING_MODE,
  gygLeadDays,
  parseBookingMode,
} from '@/lib/booking-mode';

/**
 * The owner's booking-partner choice (see lib/booking-mode.ts), fetched once
 * per page from /api/booking-mode so the pages stay static.
 *
 * Two jobs:
 *  - the date-aware ticket cards read useGygLeadDays() to decide, for the
 *    date the visitor picked, whether to link GetYourGuide or Viator;
 *  - in all_gyg mode, every other Viator link on the site (header button,
 *    entrance-fee page, mobile bar...) is switched to GetYourGuide at the
 *    moment it is clicked, so no page has to know about the setting.
 */
const BookingModeContext = createContext<BookingMode>(DEFAULT_BOOKING_MODE);

export function useBookingMode(): BookingMode {
  return useContext(BookingModeContext);
}

export function useGygLeadDays(): number {
  return gygLeadDays(useBookingMode());
}

/** The GetYourGuide link a switched Viator link becomes, keeping its campaign. */
export function gygUrlFor(viatorHref: string): string {
  if (!GETYOURGUIDE_URL) return viatorHref;
  try {
    const campaign = new URL(viatorHref).searchParams.get('campaign');
    const url = new URL(GETYOURGUIDE_URL);
    if (campaign) url.searchParams.set('cmp', `${campaign}-switched`);
    return url.toString();
  } catch {
    return GETYOURGUIDE_URL;
  }
}

export function BookingModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<BookingMode>(DEFAULT_BOOKING_MODE);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/booking-mode')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d) setMode(parseBookingMode(d.mode));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (mode !== 'all_gyg' || !GETYOURGUIDE_URL) return;
    const onClick = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      try {
        if (!/(^|\.)viator\.com$/i.test(new URL(anchor.href).hostname)) return;
      } catch {
        return;
      }
      anchor.href = gygUrlFor(anchor.href);
    };
    // Capture phase: some cards stop click propagation, so a bubbling listener
    // would never hear them. Registered after ViatorArrival's (this effect
    // runs once the mode has been fetched), so the campaign it has already
    // tagged with how the visitor arrived survives into cmp.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [mode]);

  return <BookingModeContext.Provider value={mode}>{children}</BookingModeContext.Provider>;
}
