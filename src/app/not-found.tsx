import Link from 'next/link';

import { BASE } from '@/lib/seo';

/**
 * The 404 page.
 *
 * There was none, so Next served its built-in one: an unstyled white page
 * reading "404: This page could not be found." The status code was correct and
 * everything else about it was wrong — no header, no way back, and nothing to
 * say which site the visitor had landed on.
 *
 * It sits at the app root rather than under [locale] because the URLs that
 * reach it are the ones that matched no route at all, including those with no
 * locale segment. English is the only honest choice here: a path that matched
 * nothing carries no language to read a preference from.
 *
 * Deliberately noindex. A 404 already tells a crawler not to index the page;
 * the meta tag is for the case where something upstream rewrites the status.
 */
export const metadata = {
  title: 'Page not found — Bahia Palace Tickets',
  robots: { index: false, follow: true },
};

/** Where somebody who lands here most plausibly wanted to go. */
const LINKS = [
  { href: '/en', label: 'Home', hint: 'Visiting Bahia Palace, start to finish' },
  { href: '/en/tickets', label: 'Tickets', hint: 'What entry costs and how to book' },
  { href: '/en/opening-hours', label: 'Opening hours', hint: 'When the palace is open today' },
  { href: '/en/entrance-fee', label: 'Entrance fee', hint: '100 MAD at the gate, and who gets in free' },
];

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#1C1108] px-6 py-24 text-[#F5E8CC]">
      <div className="mx-auto max-w-xl">
        <p className="text-sm uppercase tracking-[0.2em] text-[#E8A33D]">404</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          That page is not here
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[#C4A882]">
          The link may be old, or mistyped. Nothing is wrong with your booking — if you have one, it
          is unaffected and your ticket still arrives by email.
        </p>

        <ul className="mt-10 space-y-3">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block rounded-xl border border-[rgba(232,163,61,0.22)] bg-[#251A0F] px-5 py-4 transition-colors hover:border-[rgba(232,163,61,0.5)]"
              >
                <span className="font-semibold text-[#F5E8CC]">{l.label}</span>
                <span className="mt-0.5 block text-sm text-[#C4A882]">{l.hint}</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm text-[#C4A882]/80">
          Still stuck? Write to{' '}
          <a href="mailto:support@marrakechlocal.com" className="text-[#E8A33D] underline">
            support@marrakechlocal.com
          </a>{' '}
          and a person will answer.
        </p>

        <p className="mt-6 text-xs text-[#C4A882]/60">
          <a href={BASE} className="underline">
            visitbahiapalace.com
          </a>{' '}
          — an independent booking service, not affiliated with the monument or the Moroccan
          Ministry of Culture.
        </p>
      </div>
    </main>
  );
}
