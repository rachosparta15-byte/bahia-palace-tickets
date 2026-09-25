'use client';

import { useEffect } from 'react';
import { ARRIVAL_KEY } from '@/lib/ar-language-redirect';

/*
 * Which arrivals actually buy.
 *
 * Every Viator link on the site already carries a campaign naming WHERE it
 * was clicked — ticketcards, opt-skipline, entrancefee-guided, and so on. What
 * no report can answer today is where the visitor CAME FROM, and that is the
 * question this whole branch exists to settle: Google's knowledge panel points
 * its "Website" button at /ar, and nobody knows whether that button has ever
 * produced a sale.
 *
 * The placement campaign is set on the server, at build time, and is the same
 * for everyone. The arrival is known only in the browser. So rather than
 * rewrite eleven call sites to take a prop they cannot fill, this listens for
 * the click and adds a suffix to the campaign already there:
 *
 *     visitbahiapalace-ticketcards            unchanged for everybody else
 *     visitbahiapalace-ticketcards-from-ar    landed on /ar first
 *     visitbahiapalace-ticketcards-from-maps  arrived tagged by Google Maps
 *
 * Existing campaigns keep their exact spelling when there is nothing to add,
 * so the numbers stay comparable with every month already reported.
 *
 * ── HOW THE ARRIVAL IS DECIDED ──
 *
 * By the FIRST page of the session, recorded once and not revised. Somebody
 * who lands on /ar, is moved to /fr, reads three pages and then books is a
 * knowledge-panel sale; judging by the page the click happened on would file
 * it under /fr and answer nothing.
 *
 * Landing on /ar is the signal because essentially nothing else sends people
 * there — it is the panel's button, and 1,334 clicks a week arrive through it.
 * utm_source=google_maps takes precedence when present, since that is Google
 * saying so outright rather than us inferring it.
 *
 * ── WHAT IT DOES NOT DO ──
 *
 * Read, store or send anything about the person. One word in sessionStorage,
 * cleared when the tab closes, and a string appended to an outbound URL the
 * visitor chose to follow. Nothing here needs consent and nothing here waits
 * for it, which also means it cannot be the reason a click is lost.
 */

/*
 * The same key the inline /ar script writes. On that page the arrival is
 * already recorded before this component exists — the script runs in <head>
 * and redirects before hydration, so anything decided here would see /fr and
 * call it an ordinary arrival. This fills it in for every other entry point.
 */
const KEY = ARRIVAL_KEY;

/** Recorded once per tab, on the first page seen. */
function rememberArrival(): void {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const params = new URLSearchParams(location.search);
    const fromMaps =
      params.get('utm_source') === 'google_maps' || params.get('utm_source') === 'google_maps_kp';
    const landedOnArabic = /^\/ar(\/|$)/.test(location.pathname);
    sessionStorage.setItem(KEY, fromMaps ? 'maps' : landedOnArabic ? 'ar' : 'other');
  } catch {
    /* storage blocked: the click simply goes out with its campaign unchanged */
  }
}

function arrival(): string | null {
  try {
    const v = sessionStorage.getItem(KEY);
    return v === 'ar' || v === 'maps' ? v : null;
  } catch {
    return null;
  }
}

/**
 * Append the arrival to the campaign already on a Viator URL.
 * Returns null when there is nothing to change, so the caller can leave the
 * anchor completely alone rather than rewrite it to an identical string.
 */
export function taggedViatorUrl(href: string, from: string | null): string | null {
  if (!from) return null;
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (!/(^|\.)viator\.com$/i.test(url.hostname)) return null;

  const campaign = url.searchParams.get('campaign');
  // No campaign means a link that was never being measured; adding one here
  // would invent a bucket rather than split an existing one.
  if (!campaign || campaign.includes('-from-')) return null;

  url.searchParams.set('campaign', `${campaign}-from-${from}`);
  return url.toString();
}

export function ViatorArrival() {
  useEffect(() => {
    rememberArrival();

    /*
     * Capture phase, so the href is corrected before any other handler reads
     * it. Rewriting the anchor rather than calling preventDefault and
     * navigating ourselves keeps middle-click, ctrl-click, "open in new tab"
     * and the browser's own status bar honest.
     */
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return null;
}

function handleClick(event: Event): void {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const anchor = target.closest('a[href]');
  if (!(anchor instanceof HTMLAnchorElement)) return;

  const tagged = taggedViatorUrl(anchor.href, arrival());
  if (tagged) anchor.href = tagged;
}
