'use client';

import { useSyncExternalStore } from 'react';
import {
  currencyForTimeZone,
  formatDisplayPrice,
  viatorPriceFor,
  type Currency,
  type DisplayPrice,
  type TicketSlug,
} from '@/config/pricing';

const subscribe = () => () => {};
const clientCurrency = (): Currency => currencyForTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
const serverCurrency = (): Currency => 'USD';

/**
 * The visitor's display currency for Viator prices: EUR in the eurozone, USD
 * elsewhere. The server (and the first client render) always says USD, so the
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
