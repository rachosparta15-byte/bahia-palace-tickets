/**
 * AdSense identifiers, in one place.
 *
 * The publisher id was written out twice in app/layout.tsx — once in the
 * verification <meta> and once in the loader's query string — which is two
 * chances to paste a wrong digit into a value that silently serves nothing.
 */
export const ADSENSE_CLIENT = 'ca-pub-1898580718776547';

/**
 * Ad unit slot ids, created in the AdSense dashboard (Ads -> By ad unit) and
 * supplied per environment. A slot id is account-specific and cannot be
 * guessed, so it is configuration, not source.
 *
 * Unset is a supported state: <AdSlot /> renders nothing at all rather than an
 * empty <ins>, so the site is safe to deploy before the unit exists. Set
 * NEXT_PUBLIC_ADSENSE_SLOT_BLOG in Vercel to switch it on.
 */
export const ADSENSE_SLOTS = {
  blogPost: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG,
} as const;
