import prisma from '@/lib/db';
import { Search, Mail, User, Globe, Tag, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function LeadsPage({ searchParams }: Props) {
  const { q } = await searchParams;

  const leads = await prisma.lead.findMany({
    where: q
      ? {
          OR: [
            { email: { contains: q } },
            { name:  { contains: q } },
          ],
        }
      : {},
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  const withEmail    = leads.filter(l => l.email).length;
  const withoutEmail = leads.length - withEmail;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1
          className="text-2xl font-bold text-[#3D2817]"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Leads — Email Capture
        </h1>

        {/* Stats */}
        <div className="flex gap-3">
          {[
            { label: 'Total leads',   value: leads.length,  color: 'bg-[#3D2817] text-white' },
            { label: 'With email',    value: withEmail,     color: 'bg-[#6B7B3A]/20 text-[#4a5a28]' },
            { label: 'Skipped email', value: withoutEmail,  color: 'bg-[#E8D5B7] text-[#8B6344]' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-xl px-4 py-2.5 text-center min-w-[90px] ${color}`}>
              <p className="text-xl font-bold">{value}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8D5B7]">
        {/* Search */}
        <div className="px-6 py-4 border-b border-[#E8D5B7]">
          <form className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B6344]" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Search by email or name…"
                className="pl-8 pr-4 py-2 text-sm border border-[#D4BC96] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4452D]/30 focus:border-[#C4452D] w-72 bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-[#3D2817] text-white rounded-lg hover:bg-[#5C3D20] transition-colors"
            >
              Search
            </button>
            {q && (
              <a href="/admin/leads" className="text-sm text-[#8B6344] hover:text-[#3D2817]">
                Clear
              </a>
            )}
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8D5B7]">
                {[
                  { icon: Mail,     label: 'Email' },
                  { icon: User,     label: 'Name' },
                  { icon: Tag,      label: 'Ticket type' },
                  { icon: Globe,    label: 'Locale' },
                  { icon: Calendar, label: 'Date' },
                  { icon: null,     label: 'Source page' },
                ].map(({ icon: Icon, label }) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-left text-xs font-semibold text-[#8B6344] uppercase tracking-wide"
                  >
                    <span className="flex items-center gap-1.5">
                      {Icon && <Icon size={11} />}
                      {label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-[#8B6344]">
                    {q ? 'No leads match your search' : 'No leads yet — they will appear here once visitors use the booking modal'}
                  </td>
                </tr>
              )}
              {leads.map(lead => (
                <tr
                  key={lead.id}
                  className="border-b border-[#E8D5B7]/60 hover:bg-[#FAF3E7]/60 transition-colors"
                >
                  <td className="px-4 py-3">
                    {lead.email
                      ? <span className="text-[#2E4A7B] font-medium">{lead.email}</span>
                      : <span className="text-[#C4A882] italic text-xs">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-[#3D2817]">
                    {lead.name || <span className="text-[#C4A882] italic text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-[#FAF3E7] text-[#5C3D20] text-xs px-2 py-0.5 rounded-full font-medium">
                      {lead.ticketType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#5C3D20] text-xs uppercase font-mono">
                    {lead.locale}
                  </td>
                  <td className="px-4 py-3 text-[#5C3D20] text-xs whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 text-[#8B6344] text-xs font-mono max-w-[180px] truncate">
                    {lead.sourcePage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-[#E8D5B7] text-xs text-[#8B6344]">
          {leads.length} lead{leads.length !== 1 ? 's' : ''} shown
          {withEmail > 0 && <> &nbsp;·&nbsp; {withEmail} with email</>}
        </div>
      </div>
    </div>
  );
}
