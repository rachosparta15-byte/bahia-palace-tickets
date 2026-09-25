'use client';

import { useSyncExternalStore } from 'react';
import { Languages } from 'lucide-react';
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

const BAR =
  'flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-b border-[rgba(232,163,61,0.18)] bg-[#1C1309] px-4 py-2 text-center text-sm text-[#C4A882]';
const LINK = 'font-semibold text-[#E8A33D] underline underline-offset-4 hover:text-[#F5E8CC]';

export function LanguageNotice({
  locale,
  offers,
  arabicLabel,
}: {
  locale: string;
  /** Only passed on /ar: one entry per language this site publishes. */
  offers?: Record<string, LanguageOffer>;
  /** Always Arabic, because the person who needs it reads Arabic. */
  arabicLabel: string;
}) {
  const isClient = useIsClient();
  if (!isClient) return null;
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
        <Languages size={15} className="shrink-0 text-[#E8A33D]" aria-hidden />
        <span>{offer.available}</span>
        <a href={href} className={LINK}>
          {offer.view}
        </a>
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
      <Languages size={15} className="shrink-0 text-[#E8A33D]" aria-hidden />
      <a href={`${href}${sep}lang=ar`} className={LINK}>
        {arabicLabel}
      </a>
    </div>
  );
}
