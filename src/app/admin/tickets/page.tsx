import prisma from '@/lib/db';
import Link from 'next/link';
import { TicketQuickToggle } from '@/components/admin/TicketQuickToggle';
import { Pencil, ImageIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

const SLUG_ORDER = ['skip-the-line', 'guided-tour', 'private-tour', 'combo-saadian-tombs'];

export default async function AdminTicketsPage() {
  // Auto-seed if needed
  const count = await prisma.ticketType.count();
  if (count === 0) {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'}/api/admin/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seed: true }),
    }).catch(() => null);
  }

  const tickets = await prisma.ticketType.findMany();
  const sorted = SLUG_ORDER.map(s => tickets.find(t => t.slug === s)).filter(Boolean) as typeof tickets;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-[#3D2817]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Ticket Management
          </h1>
          <p className="text-sm text-[#8B6344] mt-1">Edit prices, images and availability for each ticket type.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sorted.map((ticket) => {
          const imgs: string[] = (() => { try { return JSON.parse(ticket.images ?? '[]'); } catch { return []; } })();
          const imgUrl = imgs[0] ?? '';
          return (
            <div
              key={ticket.slug}
              className="bg-white rounded-2xl border border-[#E8D5B7] overflow-hidden shadow-sm"
            >
              <div className="relative h-40 bg-[#F5EFE4]">
                {imgUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imgUrl} alt={ticket.nameEn} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-[#C8A882]">
                    <ImageIcon size={40} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3D2817]/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <h2
                    className="text-white font-bold text-base leading-tight"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {ticket.nameEn}
                  </h2>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${ticket.available ? 'bg-emerald-500 text-white' : 'bg-[#3D2817] text-[#E8A33D]'}`}>
                    {ticket.available ? 'Live' : 'Soon'}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#8B6344] uppercase tracking-wide mb-1">Adult price</p>
                    <p className="text-2xl font-bold text-[#C4452D]" style={{ fontFamily: 'var(--font-heading)' }}>
                      ${ticket.priceAdult}
                    </p>
                  </div>
                  <TicketQuickToggle slug={ticket.slug} available={ticket.available} />
                </div>

                <Link
                  href={`/admin/tickets/${ticket.slug}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#FAF3E7] border border-[#E8D5B7] rounded-xl text-sm font-medium text-[#3D2817] hover:bg-[#F0E8D8] transition-colors"
                >
                  <Pencil size={14} />
                  Edit details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
