import prisma from '@/lib/db';
import Link from 'next/link';
import { Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ status?: string; q?: string }>;
}

function statusColor(status: string) {
  if (status === 'confirmed') return 'bg-emerald-100 text-emerald-800';
  if (status === 'pending')   return 'bg-amber-100   text-amber-800';
  if (status === 'cancelled') return 'bg-red-100     text-red-800';
  return 'bg-gray-100 text-gray-700';
}

const STATUS_TABS = ['all', 'confirmed', 'pending', 'cancelled'];

export default async function BookingsPage({ searchParams }: Props) {
  const { status, q } = await searchParams;
  const activeStatus = STATUS_TABS.includes(status ?? '') ? status : 'all';

  const bookings = await prisma.booking.findMany({
    where: {
      ...(activeStatus !== 'all' ? { status: activeStatus } : {}),
      ...(q ? {
        OR: [
          { reference: { contains: q } },
          { customerEmail: { contains: q } },
          { customerName: { contains: q } },
        ],
      } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  function tabHref(s: string) {
    const params = new URLSearchParams();
    if (s !== 'all') params.set('status', s);
    if (q) params.set('q', q);
    const qs = params.toString();
    return `/admin/bookings${qs ? `?${qs}` : ''}`;
  }

  return (
    <div className="p-8">
      <h1
        className="text-2xl font-bold text-[#3D2817] mb-8"
        style={{ fontFamily: 'Cormorant Garamond, serif' }}
      >
        Bookings
      </h1>

      <div className="bg-white rounded-2xl border border-[#E8D5B7]">
        <div className="px-6 py-4 border-b border-[#E8D5B7] flex items-center gap-4 flex-wrap">
          <div className="flex gap-1">
            {STATUS_TABS.map(s => (
              <a
                key={s}
                href={tabHref(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  activeStatus === s
                    ? 'bg-[#3D2817] text-white'
                    : 'text-[#5C3D20] hover:bg-[#FAF3E7]'
                }`}
              >
                {s}
              </a>
            ))}
          </div>

          <form className="ml-auto flex items-center gap-2">
            {activeStatus && activeStatus !== 'all' && (
              <input type="hidden" name="status" value={activeStatus} />
            )}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B6344]" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Reference, name or email…"
                className="pl-8 pr-4 py-2 text-sm border border-[#D4BC96] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4452D]/30 focus:border-[#C4452D] w-64 bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-[#3D2817] text-white rounded-lg hover:bg-[#5C3D20] transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8D5B7]">
                {['Reference', 'Name', 'Email', 'Ticket', 'Visit Date', 'Pax', 'Amount', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#8B6344] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-[#8B6344]">
                    No bookings found
                  </td>
                </tr>
              )}
              {bookings.map(b => (
                <tr key={b.id} className="border-b border-[#E8D5B7]/60 hover:bg-[#FAF3E7]/60 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-[#2E4A7B]">{b.reference}</span>
                  </td>
                  <td className="px-4 py-3 text-[#3D2817] font-medium">{b.customerName}</td>
                  <td className="px-4 py-3 text-[#5C3D20] text-xs">{b.customerEmail}</td>
                  <td className="px-4 py-3 text-[#5C3D20] text-xs">{b.ticketType}</td>
                  <td className="px-4 py-3 text-[#5C3D20] text-xs">{new Date(b.visitDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-[#5C3D20]">{b.adults}{b.children > 0 ? `+${b.children}` : ''}</td>
                  <td className="px-4 py-3 font-medium text-[#3D2817]">${b.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="text-xs text-[#2E4A7B] hover:underline font-medium"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-[#E8D5B7] text-xs text-[#8B6344]">
          {bookings.length} booking{bookings.length !== 1 ? 's' : ''} shown
        </div>
      </div>
    </div>
  );
}
