'use client';

import { usePathname } from 'next/navigation';

const LOCALES = ['en', 'fr', 'it', 'de', 'es'] as const;

function getBase(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.visitbahiapalace.com';
  try {
    const u = new URL(raw);
    if (u.hostname === 'visitbahiapalace.com') u.hostname = 'www.visitbahiapalace.com';
    return u.origin;
  } catch {
    return 'https://www.visitbahiapalace.com';
  }
}

const BASE = getBase();
const LOCALE_RE = /^\/(en|fr|it|de|es)/;

// React 19 automatically hoists <link> elements to <head> from any component.
// This component generates the full hreflang set for the current page
// by stripping the locale prefix from the pathname and rebuilding for all locales.
export function HreflangLinks() {
  const pathname = usePathname();
  // /fr/blog/some-article → /blog/some-article   /fr → ''
  const path = pathname.replace(LOCALE_RE, '');

  return (
    <>
      {LOCALES.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`${BASE}/${locale}${path}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${BASE}/en${path}`}
      />
    </>
  );
}
