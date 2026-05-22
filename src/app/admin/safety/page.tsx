import prisma from '@/lib/db';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const ICON_MAP: Record<string, string> = {
  warning: '⚠️', scam: '🚨', money: '💰', photo: '📸',
  guide: '🧭', taxi: '🚕', shop: '🛍️', dress: '👗',
  health: '🏥', info: 'ℹ️',
};

export default async function AdminSafetyPage() {
  const tips = await prisma.safetyTip.findMany({ orderBy: { order: 'asc' } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#3D2817]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Safety Tips
          </h1>
          <p className="text-sm text-[#8B6344] mt-0.5">Scam alerts &amp; visitor warnings shown on the Safety Guide page</p>
        </div>
        <Link
          href="/admin/safety/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
        >
          <PlusCircle size={16} />
          New Tip
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8D5B7]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8D5B7]">
                {['#', 'Icon', 'Title', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#8B6344] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tips.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[#8B6344]">
                    No tips yet.{' '}
                    <Link href="/admin/safety/new" className="text-amber-600 hover:underline">Add the first one →</Link>
                  </td>
                </tr>
              )}
              {tips.map(tip => (
                <tr key={tip.id} className="border-b border-[#E8D5B7]/60 hover:bg-amber-50/40 transition-colors">
                  <td className="px-4 py-3 text-[#8B6344] text-xs">{tip.order}</td>
                  <td className="px-4 py-3 text-xl">{ICON_MAP[tip.icon] ?? '⚠️'}</td>
                  <td className="px-4 py-3 font-medium text-[#3D2817] max-w-sm truncate">{tip.title}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${tip.published ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {tip.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#8B6344]">{new Date(tip.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/safety/${tip.id}`} className="text-xs text-[#2E4A7B] hover:underline font-medium">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-[#E8D5B7] text-xs text-[#8B6344]">
          {tips.length} tip{tips.length !== 1 ? 's' : ''} • {tips.filter(t => t.published).length} published
        </div>
      </div>
    </div>
  );
}
