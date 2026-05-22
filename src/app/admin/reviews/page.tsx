import prisma from '@/lib/db';
import Link from 'next/link';
import { PlusCircle, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: { order: 'asc' } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#3D2817]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Reviews
          </h1>
          <p className="text-sm text-[#8B6344] mt-1">Manage visitor testimonials shown on the site.</p>
        </div>
        <Link
          href="/admin/reviews/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C4452D] text-white text-sm font-medium rounded-lg hover:bg-[#A33824] transition-colors"
        >
          <PlusCircle size={16} />
          Add review
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8D5B7]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8D5B7]">
                {['Author', 'Country', 'Rating', 'Review', 'Locale', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#8B6344] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[#8B6344]">
                    No reviews yet.{' '}
                    <Link href="/admin/reviews/new" className="text-[#C4452D] hover:underline">Add the first →</Link>
                  </td>
                </tr>
              )}
              {reviews.map(r => (
                <tr key={r.id} className="border-b border-[#E8D5B7]/60 hover:bg-[#FAF3E7]/60">
                  <td className="px-4 py-3 font-medium text-[#3D2817]">{r.authorName}</td>
                  <td className="px-4 py-3 text-[#5C3D20] text-xs">{r.country ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={12} className="fill-[#E8A33D] text-[#E8A33D]" />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#5C3D20] max-w-xs truncate text-xs">{r.body}</td>
                  <td className="px-4 py-3 text-xs uppercase text-[#8B6344]">{r.locale}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${r.published ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {r.published ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/reviews/${r.id}`} className="text-xs text-[#2E4A7B] hover:underline font-medium">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-[#E8D5B7] text-xs text-[#8B6344]">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
