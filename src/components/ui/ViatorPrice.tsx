'use client';

import { useSyncExternalStore } from 'react';
import {
  currencyForPage,
  formatDisplayPrice,
  viatorPriceFor,
  type Currency,
  type DisplayPrice,
  type TicketSlug,
} from '@/config/pricing';

const subscribe = () => () => {};

/** Every URL on this site starts with its locale, so the path is the page's language. */
const pageLocale = (): string | undefined => window.location.pathname.split('/')[1] || undefined;

const clientCurrency = (): Currency =>
  currencyForPage(pageLocale(), Intl.DateTimeFormat().resolvedOptions().timeZone, navigator.language);
const serverCurrency = (): Currency => 'USD';

/**
 * The visitor's display currency for Viator prices (see currencyForPage). The server (and the first client render) always says USD, so the
 * cached HTML is the same for everyone and hydration never mismatches; React
 * then re-renders with the browser's answer.
 */
export function useViatorCurrency(): Currency {
  return useSyncExternalStore(subscribe, clientCurrency, serverCurrency);
}

/**
 * Same contract as displayPriceFor() in config/pricing: Viator's own price
 * where Viator sells the slug, now in the visitor's currency; otherwise the
 * slug's EUR fallback.
 */
export function useDisplayPrice(slug: TicketSlug, eurFallback: number): DisplayPrice {
  const currency = useViatorCurrency();
  return viatorPriceFor(slug, currency) ?? { amount: eurFallback, currency: 'EUR' };
}

/** A price in the visitor's currency, for server components to drop in. */
export function ViatorPrice({ slug, eurFallback }: { slug: TicketSlug; eurFallback?: number }) {
  const currency = useViatorCurrency();
  const price = viatorPriceFor(slug, currency) ?? (eurFallback !== undefined ? { amount: eurFallback, currency: 'EUR' as const } : undefined);
  return <>{price ? formatDisplayPrice(price) : null}</>;
}
