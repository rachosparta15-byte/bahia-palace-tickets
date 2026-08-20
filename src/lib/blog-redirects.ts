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
