import prisma from '@/lib/db';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

function statusBadge(published: boolean) {
  return published
    ? 'bg-emerald-100 text-emerald-800'
    : 'bg-amber-100 text-amber-800';
}

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-2xl font-bold text-[#3D2817]"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Blog Articles
        </h1>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C4452D] text-white text-sm font-medium rounded-lg hover:bg-[#A33824] transition-colors"
        >
          <PlusCircle size={16} />
          New Article
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8D5B7]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8D5B7]">
                {['Title', 'Public URL', 'Locale', 'Category', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#8B6344] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[#8B6344]">
                    No articles yet.{' '}
                    <Link href="/admin/blog/new" className="text-[#C4452D] hover:underline">
                      Create the first one →
                    </Link>
                  </td>
                </tr>
              )}
              {posts.map(p => (
                <tr key={p.id} className="border-b border-[#E8D5B7]/60 hover:bg-[#FAF3E7]/60 transition-colors">
                  <td className="px-4 py-3 font-medium text-[#3D2817] max-w-xs truncate">{p.title}</td>
                  <td className="px-4 py-3">
                    {p.published ? (
                      <a
                        href={`/${p.locale}/blog/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#2E4A7B] hover:underline font-mono"
                      >
                        🔗 /{p.locale}/blog/{p.slug}
                      </a>
                    ) : (
                      <span className="text-xs text-[#8B6344] font-mono">
                        🔒 /{p.locale}/blog/{p.slug}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#5C3D20] uppercase text-xs">{p.locale}</td>
                  <td className="px-4 py-3 text-[#5C3D20] text-xs">{p.category}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(p.published)}`}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#8B6344]">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <Link href={`/admin/blog/${p.id}`} className="text-xs text-[#2E4A7B] hover:underline font-medium">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-[#E8D5B7] text-xs text-[#8B6344]">
          {posts.length} article{posts.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
