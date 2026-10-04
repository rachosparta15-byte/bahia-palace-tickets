'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { GETYOURGUIDE_URL } from '@/config/booking-partners';
import {
  type BookingMode,
  DEFAULT_BOOKING_MODE,
  ENTRY_TICKET_VIATOR_CODE,
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
 *  - in all_gyg mode, every other link to the Viator ENTRY TICKET (header
 *    button, entrance-fee page, mobile bar...) is switched to GetYourGuide
 *    at the moment it is clicked. Tour links are left on Viator.
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
        // Only the entry ticket moves: tour links stay on Viator.
        const url = new URL(anchor.href);
        if (!/(^|\.)viator\.com$/i.test(url.hostname)) return;
        if (!url.pathname.includes(ENTRY_TICKET_VIATOR_CODE)) return;
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
