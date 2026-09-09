import { HISTORY_HREFLANG } from './blog-hreflang';

/**
 * Slugs that no longer have a page of their own.
 *
 * Every one of these 301/308s somewhere else — an older URL that was merged
 * into a better article, or a duplicate that existed only in English. They must
 * not appear in the sitemap (Google would be handed a URL that redirects) and
 * they must not appear on the blog index (a visitor would be shown a card whose
 * title differs from the article they land on).
 *
 * This list lived in two places: `sitemap.ts` and the blog index page. They
 * drifted — the sitemap grew to 24 entries while the index kept the original 3
 * — and the result was `bahia-palace-who-built-it` rendering a card on the
 * index, redirecting to `bahia-palace-history`, which already had a card of its
 * own. The same article, twice, under two titles.
 *
 * One list, imported by both. Adding a redirect in next.config now has exactly
 * one place to be recorded.
 */
export const REDIRECTED_BLOG_SLUGS = new Set([
  // All-locale redirects
  'how-to-get-to-bahia-palace',
  'history-of-bahia-palace',
  'marrakech-tourist-scams-guide',
  'bahia-palace-who-built-it',
  // EN-only duplicate slugs
  'bahia-palace-history-marrakech',
  'who-built-bahia-palace-history-ba-ahmed',
  'bahia-palace-entrance-fee-2026-tickets-prices',
  'how-to-get-to-bahia-palace-from-jemaa-el-fna',
  'is-bahia-palace-worth-visiting-honest-review-2026',
  'what-to-wear-bahia-palace-marrakech-dress-code',
  'bahia-palace-photography-guide-best-spots-tips',
  'what-to-see-inside-bahia-palace-room-by-room',
  'bahia-palace-opening-hours-best-time-to-visit',
  'best-time-to-visit-bahia-palace-marrakech-2026',
  'bahia-palace-vs-badi-palace-which-to-visit',
  'bahia-palace-vs-saadian-tombs-comparison',
  'jardin-majorelle-vs-bahia-palace-marrakech',
  'how-to-avoid-tourist-scams-marrakech-safety-guide-2026',
  'how-to-avoid-scams-in-the-souks-of-marrakech-complete-guide-for-travelers',
  '2-days-in-marrakech-perfect-weekend-itinerary-2026',
  // Deleted / merged posts (301 redirects added)
  'bahia-palace-skip-the-line-guide',
  'marrakech-the-red-city-where-history-comes-alive',
  'marrakech-la-ciudad-roja-donde-la-historia-cobra-vida',
  'best-colors-to-wear-for-a-photoshoot-at-bahia-palace-marrakech',
]);

/*
 * Slugs that redirect in ENGLISH ONLY.
 *
 * REDIRECTED_BLOG_SLUGS above is locale-agnostic, which is right for slugs
 * that exist in one language or redirect everywhere. It is wrong for a slug
 * that is dead in English and alive somewhere else: putting one in that set
 * pulls a perfectly good URL out of the sitemap.
 *
 * `the-and-solidary-guide-...` is exactly that case. It 308s in English (the
 * old slug generator dropped the words around "&"), and it is the live,
 * published Arabic URL. It was in neither list, so the sitemap kept handing
 * Google the English URL that redirects.
 */
export const REDIRECTED_EN_ONLY = new Set([
  'the-and-solidary-guide-understanding-mousawama-and-the-soul-of-marrakesh',
]);

/*
 * Is this slug a redirect in this locale?
 *
 * The sitemap must list final URLs. Three different rules decide that and
 * only one of them is locale-agnostic, so they are resolved in one place
 * rather than re-derived at each call site.
 *
 * The history article is the subtle one: `bahia-palace-history` is the real
 * English URL, and in French, German, Italian and Spanish it 308s to a
 * natively translated slug. Arabic has no native slug, so the English one
 * stays valid there. That is read straight off HISTORY_HREFLANG rather than
 * duplicated, so adding a native slug for a new language updates both at once.
 */
export function isRedirectedInLocale(locale: string, slug: string): boolean {
  if (REDIRECTED_BLOG_SLUGS.has(slug)) return true;
  if (locale === 'en' && REDIRECTED_EN_ONLY.has(slug)) return true;
  const native = HISTORY_HREFLANG[locale];
  if (slug === HISTORY_HREFLANG.en && native && native !== slug) return true;
  return false;
}
