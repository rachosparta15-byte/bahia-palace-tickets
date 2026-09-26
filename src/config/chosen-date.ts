'use client';

import { useSyncExternalStore } from 'react';

/*
 * The visit date, shared between the hero and the ticket cards.
 *
 * The hero asks for it; the cards a screen below have to act on it. They are
 * separate components with no parent state between them, and the hero's button
 * is an in-page anchor — the page never reloads, so nothing is re-rendered from
 * the server and a prop could not reach them anyway.
 *
 * So: one value, written by the hero, subscribed to by the cards. A window
 * event carries the change, and sessionStorage carries it across a navigation
 * to another page in the same tab.
 *
 * Deliberately NOT in a query string. The hero button points at
 * #ticket-options; adding ?date= would change the URL of the home page, and
 * leaving the home page's URL exactly as it is has been the rule for all of
 * this work.
 */

export const CHOSEN_DATE_KEY = 'chosenVisitDate';
const EVENT = 'visitdatechange';

export function setChosenDate(iso: string): void {
  try {
    sessionStorage.setItem(CHOSEN_DATE_KEY, iso);
  } catch {
    // Storage blocked. The event still fires, so the cards follow along for
    // this page view; only the carry-over to the next page is lost.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: iso }));
}

function readChosenDate(): string | null {
  try {
    return sessionStorage.getItem(CHOSEN_DATE_KEY);
  } catch {
    return null;
  }
}

/*
 * getSnapshot must return the same value until it genuinely changes, or React
 * re-renders forever. sessionStorage returns a fresh string each call, which
 * is equal but not identical — fine for a string compared with Object.is, but
 * the cache also spares seven cards a storage read per render.
 */
let cached: string | null = null;
let cacheValid = false;

function getSnapshot(): string | null {
  if (!cacheValid) {
    cached = readChosenDate();
    cacheValid = true;
  }
  return cached;
}

function subscribe(onChange: () => void): () => void {
  const handler = () => {
    cacheValid = false;
    onChange();
  };
  window.addEventListener(EVENT, handler);
  // Another tab writing the same key: rare, harmless to follow.
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

/** Null on the server and until the visitor has chosen — never a guess. */
export function useChosenDate(): string | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

/*
 * Today, as an external store.
 *
 * Reading the clock in a component body is an impure call during render, and
 * React's lint rule is right to refuse it: a render that depends on the time
 * gives a different answer each time it runs. Here the value is cached per
 * minute and handed out by useSyncExternalStore, the same shape
 * config/visiting-today.ts uses for the opening-hours clock.
 *
 * The server snapshot is null. Nothing that depends on today's date may be
 * baked into a cached page.
 */
let cachedToday: string | null = null;
let cachedMinute = -1;

function todaySnapshot(): string {
  const minute = Math.floor(Date.now() / 60_000);
  if (minute !== cachedMinute || cachedToday === null) {
    cachedMinute = minute;
    const d = new Date();
    cachedToday = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate(),
    ).padStart(2, '0')}`;
  }
  return cachedToday;
}

/** Ticks once a minute, so a page left open across midnight corrects itself. */
function subscribeToDay(onChange: () => void): () => void {
  const id = setInterval(onChange, 60_000);
  return () => clearInterval(id);
}

export function useToday(): string | null {
  return useSyncExternalStore(subscribeToDay, todaySnapshot, () => null);
}
