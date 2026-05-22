const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://visitbahiapalace.com';

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
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: title }],
  };
}
