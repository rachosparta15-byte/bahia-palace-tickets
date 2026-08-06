// Normalise to plain www origin — defensive against two common Vercel
// misconfigurations: (1) trailing path like /en causing double-locale URLs,
// (2) missing www causing canonical/og:url without the subdomain.
const _raw = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.visitbahiapalace.com';
const _url  = new URL(_raw);
if (_url.hostname === 'visitbahiapalace.com') _url.hostname = 'www.visitbahiapalace.com';
export const BASE = _url.origin; // always https://www.visitbahiapalace.com

import { locales as LOCALES } from '@/i18n/routing';

export function buildAlternates(locale: string, path: string) {
  const langs: Record<string, string> = { 'x-default': `${BASE}/en${path}` };
  for (const l of LOCALES) langs[l] = `${BASE}/${l}${path}`;
  return { canonical: `${BASE}/${locale}${path}`, languages: langs };
}

export const DIGITAL_TICKET_OFFER_EXTRAS = {
  shippingDetails: {
    '@type': 'OfferShippingDetails',
    shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'EUR' },
    shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'MA' },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
      transitTime:  { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
    },
  },
  hasMerchantReturnPolicy: {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: 'MA',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 1,
    returnFees: 'https://schema.org/FreeReturn',
    merchantReturnLink: `${BASE}/en/refund-policy`,
  },
};

/** Builds a schema.org BreadcrumbList matching the visual <Breadcrumb> trail on a page.
 *  `items` should mirror the same {label, href} list passed to <Breadcrumb>, in order,
 *  ending with the current (unlinked) page. */
export function buildBreadcrumbSchema(
  locale: string,
  items: Array<{ name: string; path?: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.path !== undefined ? { item: `${BASE}/${locale}${item.path}` } : {}),
    })),
  };
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
