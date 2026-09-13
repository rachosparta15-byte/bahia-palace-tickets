import { Link } from '@/i18n/navigation';
import { getBlogPosts } from '@/lib/blog';

const CATEGORY_COLORS: Record<string, string> = {
  'visit-tips':  '#E8A33D',
  'history':     '#8FA63C',
  'safety':      '#C4452D',
  'practical':   '#2E4A7B',
  'comparisons': '#8B6B4A',
};

interface Props {
  locale: string;
}

type TickerPost = ReturnType<typeof getBlogPosts>[number];

/** The visible row. Identical in both copies — only the wrapper differs. */
function TickerItem({ post }: { post: TickerPost }) {
  return (
    <>
      <span
        className="text-[10px] font-bold uppercase tracking-widest shrink-0"
        style={{ color: CATEGORY_COLORS[post.category] ?? '#E8A33D' }}
      >
        {post.category.replace('-', ' ')}
      </span>
      <span className="w-px h-3 bg-white/20 shrink-0" />
      <span className="text-white/80 text-sm whitespace-nowrap group-hover:text-white transition-colors">
        {post.title}
      </span>
      <span className="text-white/20 text-sm shrink-0 ms-2">·</span>
    </>
  );
}

const ITEM_CLASS = 'flex items-center gap-3 px-6 group shrink-0';

export function ArticleTicker({ locale }: Props) {
  const posts = getBlogPosts(locale);
  if (posts.length === 0) return null;

  /*
   * The marquee needs the list twice so the scroll can wrap without a visible
   * jump. The second copy is decoration, and it used to be indistinguishable
   * from the first: `[...posts, ...posts]` rendered as real <Link>s, so every
   * article appeared on the home page as two crawlable links with identical
   * anchor text — and a third time in <BlogPreview /> just below, which shows
   * the same top three posts.
   *
   * The clone is now aria-hidden and its rows are plain <span>s, so it scrolls
   * exactly as before and is invisible to a crawler, a screen reader and the
   * keyboard. Only the first copy is a link.
   */
  return (
    <div className="bg-[#160D06] border-y border-[rgba(232,163,61,0.12)] py-2.5 overflow-hidden">
      <div className="marquee-track flex items-center gap-0 w-max">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={ITEM_CLASS}>
            <TickerItem post={post} />
          </Link>
        ))}
        {posts.map((post) => (
          <span key={`clone-${post.slug}`} className={ITEM_CLASS} aria-hidden="true">
            <TickerItem post={post} />
          </span>
        ))}
      </div>
    </div>
  );
}
