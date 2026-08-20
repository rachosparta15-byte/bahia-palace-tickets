import prisma from '@/lib/db';
import { Euro, Users, CalendarCheck, TrendingUp, Clock } from 'lucide-react';
import { BOOKING_STATUS } from '@/lib/booking-lifecycle';
import { adminDate } from '@/lib/admin/when';

export const dynamic = 'force-dynamic';

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Whole days from today to a visit date, both taken at local midnight.
 *
 * Midnight on both sides on purpose: a booking made at 23:00 for tomorrow
 * morning is one day away, not eleven hours, and a subtraction of instants
 * would round it to zero and print "Today" against a visit nobody is on yet.
 */
function daysUntil(visitDate: Date): number {
  const a = startOfDay(new Date());
  const b = startOfDay(visitDate);
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

function countdownLabel(days: number): string {
  if (days < 0) return `${Math.abs(days)}d ago`;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days < 7) return `in ${days} days`;
  if (days < 14) return 'in 1 week';
  if (days < 61) return `in ${Math.round(days / 7)} weeks`;
  return `in ${Math.round(days / 30)} months`;
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

  const [todayBookings, allBookings, recentBookings, upcoming] = await Promise.all([
    prisma.booking.findMany({
      where: { createdAt: { gte: today, lt: tomorrow } },
    }),
    prisma.booking.findMany({ where: { status: { not: 'cancelled' } } }),
    prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    /*
     * Paid visits still ahead of us, soonest first.
     *
     * PAID only — `pending` is an unfinished checkout, not a visitor, and
     * mixing the two turns this list back into the thing it was built to
     * replace. Cancelled is excluded for the same reason.
     *
     * From the start of today rather than from now: someone visiting this
     * afternoon must not drop off the list at lunchtime, which is exactly
     * when their ticket is most likely to be the one still unsent.
     */
    prisma.booking.findMany({
      where: {
        status: { in: [BOOKING_STATUS.paidAwaitingQr, BOOKING_STATUS.qrSent] },
        visitDate: { gte: startOfDay(new Date()) },
      },
      orderBy: { visitDate: 'asc' },
      take: 40,
    }),
  ]);

  const todayRevenue   = todayBookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.totalAmount, 0);
  const todayConfirmed = todayBookings.filter(b => b.status === 'confirmed').length;
  const allRevenue     = allBookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.totalAmount, 0);
  const allConfirmed   = allBookings.filter(b => b.status === 'confirmed').length;

  // The count that belongs in the panel header: paid, ahead of us, no ticket
  // bought yet. Everything else on this page is history.
  const ticketsOwed = upcoming.filter(b => b.status === BOOKING_STATUS.paidAwaitingQr).length;

  const stats = [
    { label: "Today's bookings", value: todayBookings.length, sub: `${todayConfirmed} confirmed`, icon: CalendarCheck, color: 'text-[#2E4A7B]' },
    { label: "Today's revenue",  value: `€${todayRevenue.toFixed(2)}`, sub: 'confirmed only', icon: Euro, color: 'text-[#C4452D]' },
    { label: 'All-time confirmed', value: allConfirmed, sub: 'total bookings', icon: Users, color: 'text-[#5C8A4A]' },
    { label: 'All-time revenue',  value: `€${allRevenue.toFixed(2)}`, sub: 'confirmed only', icon: TrendingUp, color: 'text-[#E8A33D]' },
  ];

  return (
    <div className="p-8">
      <h1
        className="text-2xl font-bold text-[#3D2817] mb-8"
        style={{ fontFamily: 'var(--font-heading)' }}
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

      {/*
        Visits still ahead, closest first.

        The bookings table is ordered by when someone paid, which answers "what
        came in" and hides the only question with a deadline on it: who is
        arriving, when, and does their ticket still need buying. A visit three
        days out sits fourteen rows down that table between two visits in
        October.

        Sorted by visit date, so the top of this list is always the next thing
        that has to happen. The countdown is the point of the panel — a date
        alone still needs arithmetic done on it every time you look.
      */}
      <div className="bg-white rounded-2xl border border-[#E8D5B7] mb-10">
        <div className="px-6 py-4 border-b border-[#E8D5B7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#2E4A7B]" />
            <h2 className="font-semibold text-[#3D2817]">Upcoming visits</h2>
          </div>
          <p className="text-xs text-[#8B6344]">
            Paid bookings, soonest first · {ticketsOwed} still need a ticket
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8D5B7]">
                {['When', 'Visit date', 'Reference', 'Name', 'Pax', 'Ticket'].map(h => (
                  <th key={h} className="px-4 py-3 text-start text-xs font-semibold text-[#8B6344] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {upcoming.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#8B6344]">
                    No paid visits ahead
                  </td>
                </tr>
              )}
              {upcoming.map(b => {
                const days = daysUntil(b.visitDate);
                const sent = b.status === BOOKING_STATUS.qrSent;
                /*
                 * Red is for work with a deadline, not for "soon". A visit
                 * tomorrow whose ticket has already gone needs nothing from
                 * anybody; the same visit with no ticket yet is the row this
                 * whole panel exists to surface.
                 */
                const urgent = !sent && days <= 2;
                return (
                  <tr
                    key={b.id}
                    className={`border-b border-[#E8D5B7]/60 transition-colors ${
                      urgent ? 'bg-[#C4452D]/[0.06] hover:bg-[#C4452D]/[0.10]' : 'hover:bg-[#FAF3E7]/60'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                          urgent
                            ? 'bg-red-100 text-red-800'
                            : days <= 2
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-[#FAF3E7] text-[#8B6344]'
                        }`}
                      >
                        {countdownLabel(days)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#5C3D20] text-xs whitespace-nowrap">
                      {adminDate(b.visitDate)}
                    </td>
                    <td className="px-4 py-3">
                      <a href={`/admin/bookings/${b.id}`} className="font-mono text-xs text-[#2E4A7B] hover:underline">
                        {b.reference}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-[#3D2817]">{b.customerName}</td>
                    <td className="px-4 py-3 text-[#5C3D20]">{b.adults + b.children}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          sent ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sent ? 'sent' : 'to buy'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
                  <th key={h} className="px-4 py-3 text-start text-xs font-semibold text-[#8B6344] uppercase tracking-wide">
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
                  <td className="px-4 py-3 text-[#5C3D20] text-xs">{adminDate(b.visitDate)}</td>
                  <td className="px-4 py-3 text-[#5C3D20]">{b.adults + b.children}</td>
                  <td className="px-4 py-3 font-medium text-[#3D2817]">€{b.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#8B6344]">
                    {adminDate(b.createdAt)}
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
