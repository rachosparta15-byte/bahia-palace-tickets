'use client';

import { useState, useSyncExternalStore } from 'react';
import { Languages, X } from 'lucide-react';
import { isCrawler } from '@/lib/ar-language-redirect';

/*
 * The way back, and the offer that replaces a redirect.
 *
 * Two jobs, one component, because they are two halves of the same problem.
 *
 * ── ON A PAGE SOMEBODY WAS SENT TO ──
 *
 * The /ar redirect moves a French browser to /fr. An Arabic speaker whose
 * phone is set to French gets moved too, and until now had no way back except
 * the language menu — a redirect with no return is a trap. If the flag says
 * they were sent here, a single line offers the Arabic page.
 *
 * ── ON /ar ITSELF ──
 *
 * The redirect deliberately does nothing in several cases: a visitor who
 * arrived from another site, a second visit in the same tab, a browser with
 * storage blocked. Those people are still reading a language they may not
 * know. They are not moved — moving somebody who followed a link from
 * TripAdvisor to /ar would be wrong — but they are offered the choice.
 *
 * ── WHERE THE URL COMES FROM ──
 *
 * The page's own hreflang links, never a path built by hand. Swapping /ar for
 * /fr in a pathname assumes the French page exists at the mirrored slug, and
 * when it does not the offer is a 404 with a friendly label on it. hreflang is
 * already correct and reciprocal on every page here, so if there is no
 * alternate, there is no offer.
 *
 * ── AND WHY NO CRAWLER SEES ANY OF IT ──
 *
 * It renders nothing until the client says so, so the server HTML is
 * untouched. That is not sufficient on its own: Googlebot runs JavaScript,
 * and the first version of this showed it "This page is also available in
 * English" with a link to /en, on the Arabic page — a language signal
 * contradicting the hreflang beside it, added by the very branch that exists
 * to protect /ar's ranking.
 *
 * Hence the same crawler check the redirect uses, imported rather than
 * copied. The crawled page is the page as it was.
 */

const subscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

export type LanguageOffer = { available: string; view: string };

/** The URL this page declares for `lang`, or null if it declares none. */
function alternateFor(lang: string): string | null {
  try {
    const el = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);
    const href = el?.getAttribute('href');
    return href ? new URL(href, location.href).pathname + location.search + location.hash : null;
  } catch {
    return null;
  }
}

/** The first of the visitor's languages this site publishes, Arabic aside. */
function preferredTarget(offers: Record<string, LanguageOffer>): string | null {
  try {
    const list =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language || ''];
    for (const raw of list) {
      const tag = String(raw || '').toLowerCase();
      // An Arabic speaker on the Arabic page is where they belong.
      if (tag === 'ar' || tag.startsWith('ar-')) return null;
      const base = tag.split('-')[0];
      if (offers[base]) return base;
    }
  } catch {
    /* no navigator worth reading: offer nothing */
  }
  return null;
}

function wasRedirectedHere(): boolean {
  try {
    return sessionStorage.getItem('langRedirectDone') === '1';
  } catch {
    return false;
  }
}

/*
 * Quiet, and closable.
 *
 * The first version was a full-width bar with the type size of body copy,
 * sitting above the hero and pushing the whole page down. Seen on a phone
 * that is wrong in proportion to what it does: the line exists for an Arabic
 * speaker whose phone is set to French, and almost everybody who sees it is a
 * French or English tourist who will never use it. They got a strip of script
 * they cannot read, on every page, with no way to be rid of it.
 *
 * So: one compact line, and an × that ends it for the session. Small enough
 * to ignore, still legible to the one person it is for — making it any
 * smaller would fail them, which is the other half of the mistake.
 */
const BAR =
  'flex items-center justify-center gap-x-2 border-b border-[rgba(232,163,61,0.14)] bg-[#1C1309] px-3 py-1.5 text-center text-xs text-[#C4A882]';
const LINK = 'font-semibold text-[#E8A33D] underline underline-offset-2 hover:text-[#F5E8CC]';
const CLOSE =
  'ms-auto shrink-0 rounded p-1 text-[#C4A882]/70 transition-colors hover:text-[#F5E8CC]';

const DISMISSED_KEY = 'langNoticeDismissed';

function alreadyDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
}

export function LanguageNotice({
  locale,
  offers,
  arabicLabel,
  closeLabel,
}: {
  locale: string;
  /** Only passed on /ar: one entry per language this site publishes. */
  offers?: Record<string, LanguageOffer>;
  /** Always Arabic, because the person who needs it reads Arabic. */
  arabicLabel: string;
  /** For the close button, in the language of the page it sits on. */
  closeLabel: string;
}) {
  const isClient = useIsClient();
  // Set only by the close button, so this is genuine React state. The session
  // remembers it too, for the pages after this one.
  const [closed, setClosed] = useState(false);

  const dismiss = () => {
    try {
      sessionStorage.setItem(DISMISSED_KEY, '1');
    } catch {
      // Nothing can be stored; it closes here and returns on the next page.
    }
    setClosed(true);
  };

  if (!isClient || closed || alreadyDismissed()) return null;
  // A crawler is shown the page as it stands, in both modes.
  if (typeof navigator !== 'undefined' && isCrawler(navigator.userAgent)) return null;

  if (locale === 'ar') {
    if (!offers || wasRedirectedHere()) return null;
    const target = preferredTarget(offers);
    if (!target) return null;
    const href = alternateFor(target);
    if (!href) return null;
    const offer = offers[target];
    return (
      <div className={BAR} dir="ltr" lang={target}>
        <Languages size={13} className="shrink-0 text-[#E8A33D]" aria-hidden />
        <span className="truncate">{offer.available}</span>
        <a href={href} className={LINK}>
          {offer.view}
        </a>
        <button type="button" onClick={dismiss} aria-label={closeLabel} className={CLOSE}>
          <X size={14} aria-hidden />
        </button>
      </div>
    );
  }

  if (!wasRedirectedHere()) return null;
  const href = alternateFor('ar');
  if (!href) return null;
  /*
   * lang=ar on the way back, so the redirect script stands down. The session
   * flag would already stop it, but a visitor who bookmarks this link and
   * opens it in a fresh tab would otherwise be bounced straight out of the
   * page they asked for.
   */
  const sep = href.includes('?') ? '&' : '?';
  return (
    <div className={BAR} dir="rtl" lang="ar">
      <Languages size={13} className="shrink-0 text-[#E8A33D]" aria-hidden />
      <a href={`${href}${sep}lang=ar`} className={LINK}>
        {arabicLabel}
      </a>
      <button type="button" onClick={dismiss} aria-label={closeLabel} className={CLOSE}>
        <X size={14} aria-hidden />
      </button>
    </div>
  );
}
