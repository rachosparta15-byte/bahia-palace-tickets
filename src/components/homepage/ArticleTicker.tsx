import { Link } from '@/i18n/navigation';
import { getBlogPosts } from '@/lib/blog';

const CATEGORY_COLORS: Record<string, string> = {
  'visit-tips':  '#E8A33D',
  'history':     '#6B7B3A',
  'safety':      '#C4452D',
  'practical':   '#2E4A7B',
  'comparisons': '#8B6B4A',
};

interface Props {
  locale: string;
}

export function ArticleTicker({ locale }: Props) {
  const posts = getBlogPosts(locale);
  if (posts.length === 0) return null;

  // duplicate posts for seamless loop
  const items = [...posts, ...posts];

  return (
    <div className="bg-[#3D2817] border-y border-[#5C3D20] py-2.5 overflow-hidden">
      <div className="marquee-track flex items-center gap-0 w-max">
        {items.map((post, i) => (
          <Link
            key={i}
            href={`/blog/${post.slug}`}
            className="flex items-center gap-3 px-6 group shrink-0"
          >
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
            <span className="text-white/20 text-sm shrink-0 ml-2">·</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
