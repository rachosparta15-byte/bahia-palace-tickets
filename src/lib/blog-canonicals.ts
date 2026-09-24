/*
 * Blog posts whose canonical points at a static page instead of themselves.
 *
 * Both of these cover the same ground as an evergreen page and defer to it, so
 * the post answers 200 but tells Google the real address is elsewhere.
 *
 * It lives here rather than inside the blog post page because the sitemap has
 * to know about it too. Submitting a URL and then telling the crawler the
 * content belongs somewhere else is a contradiction: it spends crawl budget
 * and makes the rest of the file less trusted. Twelve URLs were doing exactly
 * that — these two slugs across six locales.
 *
 * Add a slug here and it disappears from the sitemap automatically. The page
 * itself stays live and keeps its canonical; nothing is deleted or redirected.
 */
export const STATIC_PAGE_CANONICALS: Record<string, string> = {
  'bahia-palace-opening-hours-2026': '/opening-hours',
  'bahia-palace-entrance-fee-2026': '/entrance-fee',
};

/** True when this post defers its canonical to a static page. */
export function canonicalisedElsewhere(slug: string): boolean {
  return slug in STATIC_PAGE_CANONICALS;
}
