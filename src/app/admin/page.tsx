import prisma from '@/lib/db';
import { Euro, Users, CalendarCheck, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function statusColor(status: string) {
  if (status === 'confirmed') return 'bg-emerald-100 text-emerald-800';
  if (status === 'pending')   return 'bg-amber-100   text-amber-800';
  if (status === 'cancelled') return 'bg-red-100     text-red-800';
  return 'bg-gray-100 text-gray-700';
}

export default async function AdminDashboard() {
  const today = startOfDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [todayBookings, allBookings, recentBookings] = await Promise.all([
    prisma.booking.findMany({
      where: { createdAt: { gte: today, lt: tomorrow } },
    }),
    prisma.booking.findMany({ where: { status: { not: 'cancelled' } } }),
    prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  const todayRevenue   = todayBookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.totalAmount, 0);
  const todayConfirmed = todayBookings.filter(b => b.status === 'confirmed').length;
  const allRevenue     = allBookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.totalAmount, 0);
  const allConfirmed   = allBookings.filter(b => b.status === 'confirmed').length;

  const stats = [
    { label: "Today's bookings", value: todayBookings.length, sub: `${todayConfirmed} confirmed`, icon: CalendarCheck, color: 'text-[#2E4A7B]' },
    { label: "Today's revenue",  value: `$${todayRevenue.toFixed(2)}`, sub: 'confirmed only', icon: Euro, color: 'text-[#C4452D]' },
    { label: 'All-time confirmed', value: allConfirmed, sub: 'total bookings', icon: Users, color: 'text-[#5C8A4A]' },
    { label: 'All-time revenue',  value: `$${allRevenue.toFixed(2)}`, sub: 'confirmed only', icon: TrendingUp, color: 'text-[#E8A33D]' },
  ];

  return (
    <div className="p-8">
      <h1
        className="text-2xl font-bold text-[#3D2817] mb-8"
        style={{ fontFamily: 'Cormorant Garamond, serif' }}
      >
        Dashboard
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#E8D5B7] p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-[#8B6344] uppercase tracking-wide">{label}</p>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-bold text-[#3D2817]">{value}</p>
            <p className="text-xs text-[#8B6344] mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#E8D5B7]">
        <div className="px-6 py-4 border-b border-[#E8D5B7]">
          <h2 className="font-semibold text-[#3D2817]">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8D5B7]">
                {['Reference', 'Name', 'Ticket', 'Date', 'Pax', 'Amount', 'Status', 'Created'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#8B6344] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[#8B6344]">No bookings yet</td>
                </tr>
              )}
              {recentBookings.map(b => (
                <tr key={b.id} className="border-b border-[#E8D5B7]/60 hover:bg-[#FAF3E7]/60 transition-colors">
                  <td className="px-4 py-3">
                    <a href={`/admin/bookings/${b.id}`} className="font-mono text-xs text-[#2E4A7B] hover:underline">
                      {b.reference}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-[#3D2817]">{b.customerName}</td>
                  <td className="px-4 py-3 text-[#5C3D20] text-xs">{b.ticketType}</td>
                  <td className="px-4 py-3 text-[#5C3D20] text-xs">{new Date(b.visitDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-[#5C3D20]">{b.adults + b.children}</td>
                  <td className="px-4 py-3 font-medium text-[#3D2817]">${b.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#8B6344]">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
