// Normalise to plain www origin — defensive against two common Vercel
// misconfigurations: (1) trailing path like /en causing double-locale URLs,
// (2) missing www causing canonical/og:url without the subdomain.
const _raw = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.visitbahiapalace.com';
const _url  = new URL(_raw);
if (_url.hostname === 'visitbahiapalace.com') _url.hostname = 'www.visitbahiapalace.com';
export const BASE = _url.origin; // always https://www.visitbahiapalace.com

const LOCALES = ['en', 'fr', 'it', 'de', 'es'] as const;

export function buildAlternates(locale: string, path: string) {
  const langs: Record<string, string> = { 'x-default': `${BASE}/en${path}` };
  for (const l of LOCALES) langs[l] = `${BASE}/${l}${path}`;
  return { canonical: `${BASE}/${locale}${path}`, languages: langs };
}

export function buildOG(title: string, description: string, locale: string, path: string) {
  return {
    title,
    description,
    url: `${BASE}/${locale}${path}`,
    type: 'website' as const,
    locale,
    siteName: 'Bahia Palace Tickets',
    // Absolute URL — avoids Next.js resolving a relative path against the
    // request URL (which includes the locale segment) and producing /en/og-image.jpg
    images: [{ url: `${BASE}/og-image.jpg`, width: 1200, height: 630, alt: title }],
  };
}
