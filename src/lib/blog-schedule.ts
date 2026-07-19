/**
 * Scheduled publishing for blog posts.
 *
 * A post becomes visible when BOTH are true:
 *   published   = true
 *   publishedAt <= now
 *
 * That second condition is what makes scheduling work. Give a post a future
 * publishedAt and it stays hidden until that moment arrives, with no cron
 * job, no API route and no secret to leak. The blog pages revalidate hourly
 * (see `export const revalidate` in the blog routes), so a scheduled post
 * appears within an hour of its timestamp.
 *
 * Why not a Vercel cron: a cron is one more thing that can silently stop
 * working, and it would only be flipping a boolean that the timestamp
 * already encodes. The database is the schedule.
 *
 * IMPORTANT: every query that lists or fetches posts for the public site
 * must spread this in. Miss one and a scheduled post leaks early through
 * that route — the sitemap and the "related articles" list are the two
 * easiest to forget.
 */

/** Prisma `where` fragment for posts that are live right now. */
export function livePostFilter() {
  return {
    published: true,
    publishedAt: { lte: new Date() },
  } as const;
}

/**
 * True if a single fetched post should be visible to the public.
 * Used where the post is loaded by unique key and cannot be filtered
 * in the query itself.
 */
export function isLive(post: { published: boolean; publishedAt: Date | null }): boolean {
  if (!post.published) return false;
  // A null publishedAt means "no scheduled date recorded". Treat it as live
  // rather than hiding it, so a post created without a timestamp does not
  // silently vanish from the site.
  if (!post.publishedAt) return true;
  return post.publishedAt.getTime() <= Date.now();
}
