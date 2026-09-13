/**
 * AdSense identifiers, in one place.
 *
 * The publisher id was written out twice in app/layout.tsx — once in the
 * verification <meta> and once in the loader's query string — which is two
 * chances to paste a wrong digit into a value that silently serves nothing.
 */
export const ADSENSE_CLIENT = 'ca-pub-1898580718776547';

/**
 * Ad unit slot ids, created in the AdSense dashboard (Annonces -> Par bloc
 * d'annonces -> Annonces display).
 *
 * These are not secrets — every one of them ships in the page HTML — so they
 * live in source rather than in an environment variable there is no way to
 * notice is missing. The env var stays as an override for the rare case of
 * pointing a deployment at a different unit.
 */
export const ADSENSE_SLOTS = {
  /** "Blog post — sous CTA", responsive display. */
  blogPost: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG ?? '2920194808',
} as const;

/**
 * Whether this deployment may request real ads. SERVER-SIDE ONLY — VERCEL_ENV
 * is not exposed to the browser, so call this in a Server Component and pass
 * the result down.
 *
 * Preview deployments and local dev must not serve ads. Impressions and clicks
 * from a branch URL or from localhost are exactly what AdSense counts as
 * invalid traffic, and this account is still awaiting approval — the cost of a
 * false positive there is the whole account, against a few cents of upside.
 * Ads run on the production domain and nowhere else.
 */
export function adsAllowed(): boolean {
  return process.env.VERCEL_ENV === 'production';
}
