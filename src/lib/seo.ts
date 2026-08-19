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
  /*
   * This said "free return, 1-day window", which is not the policy. What
   * legal/refunds actually promises is a full refund at any time *before* we
   * send the QR code, and none after — the service is performed the moment the
   * code lands, and a delivered code cannot be taken back.
   *
   * Those are not the same offer. "One day from purchase" and "until delivery"
   * diverge in both directions, and the divergence pointed the wrong way: a
   * buyer who read the rich result had a free-return claim to wave at a refund
   * request our own terms decline.
   *
   * NotPermitted is the honest category for the delivered product. The
   * pre-delivery cancellation right is not a return — it is a cancellation,
   * and it stays documented on the page merchantReturnLink points at.
   */
  hasMerchantReturnPolicy: {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: 'MA',
    returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
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
