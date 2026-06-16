import prisma from '@/lib/db';
import { Search, Mail, User, Globe, Tag, Calendar, MapPin, Smartphone, Link2, Wifi } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

/** Turns a raw document.referrer URL into a readable source label. */
function labelReferrer(raw: string | null): { label: string; title: string } {
  if (!raw) return { label: 'Direct', title: 'No referrer — typed URL or bookmark' };
  try {
    const host = new URL(raw).hostname.replace(/^www\./, '');
    const MAP: Record<string, string> = {
      'google.com': 'Google',
      'google.fr': 'Google',
      'google.de': 'Google',
      'google.es': 'Google',
      'google.it': 'Google',
      'google.co.uk': 'Google',
      'google.ca': 'Google',
      'bing.com': 'Bing',
      'yahoo.com': 'Yahoo',
      'duckduckgo.com': 'DuckDuckGo',
      'instagram.com': 'Instagram',
      'facebook.com': 'Facebook',
      'tiktok.com': 'TikTok',
      'youtube.com': 'YouTube',
      'pinterest.com': 'Pinterest',
      'twitter.com': 'X (Twitter)',
      'x.com': 'X (Twitter)',
      'reddit.com': 'Reddit',
      'tripadvisor.com': 'TripAdvisor',
      'viator.com': 'Viator',
      'getyourguide.com': 'GetYourGuide',
    };
    return { label: MAP[host] ?? host, title: raw };
  } catch {
    return { label: raw.slice(0, 30), title: raw };
  }
}

export default async function LeadsPage({ searchParams }: Props) {
  const { q } = await searchParams;

  const leads = await prisma.lead.findMany({
    where: q
      ? {
          OR: [
            { email:      { contains: q } },
            { name:       { contains: q } },
            { sourcePage: { contains: q } },
          ],
        }
      : {},
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  const withEmail    = leads.filter(l => l.email).length;
  const withoutEmail = leads.length - withEmail;

  // Traffic source breakdown
  const bySource: Record<string, number> = {};
  for (const l of leads) {
    const { label } = labelReferrer((l as any).referrer ?? null);
    bySource[label] = (bySource[label] ?? 0) + 1;
  }
  const topSources = Object.entries(bySource)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1
          className="text-2xl font-bold text-[#3D2817]"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Leads — Traffic Sources
        </h1>

        {/* Stats */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Total interactions', value: leads.length,  color: 'bg-[#3D2817] text-white' },
            { label: 'With email',         value: withEmail,     color: 'bg-[#6B7B3A]/20 text-[#4a5a28]' },
            { label: 'Skipped email',      value: withoutEmail,  color: 'bg-[#E8D5B7] text-[#8B6344]' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-xl px-4 py-2.5 text-center min-w-[90px] ${color}`}>
              <p className="text-xl font-bold">{value}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top sources mini-chart */}
      {topSources.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E8D5B7] p-5 mb-6">
          <p className="text-xs font-bold text-[#8B6344] uppercase tracking-widest mb-3">Top traffic sources</p>
          <div className="space-y-2">
            {topSources.map(([src, count]) => (
              <div key={src} className="flex items-center gap-3">
                <span className="text-sm text-[#3D2817] w-28 shrink-0">{src}</span>
                <div className="flex-1 bg-[#FAF3E7] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#C4452D] h-2 rounded-full"
                    style={{ width: `${Math.round((count / leads.length) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-[#8B6344] w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E8D5B7]">
        {/* Search */}
        <div className="px-6 py-4 border-b border-[#E8D5B7]">
          <form className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B6344]" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Search by email, name or page…"
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
                  { icon: Tag,      label: 'Ticket' },
                  { icon: Link2,    label: 'Traffic source' },
                  { icon: MapPin,   label: 'Source page' },
                  { icon: Smartphone, label: 'Device' },
                  { icon: Globe,    label: 'Locale' },
                  { icon: Wifi,     label: 'IP Address' },
                  { icon: Calendar, label: 'Date' },
                ].map(({ icon: Icon, label }) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-left text-xs font-semibold text-[#8B6344] uppercase tracking-wide whitespace-nowrap"
                  >
                    <span className="flex items-center gap-1.5">
                      <Icon size={11} />
                      {label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-[#8B6344]">
                    {q ? 'No leads match your search' : 'No interactions yet — they will appear here once visitors use the booking modal'}
                  </td>
                </tr>
              )}
              {leads.map(lead => {
                const l = lead as typeof lead & {
                  referrer?: string | null;
                  utmSource?: string | null;
                  utmMedium?: string | null;
                  utmCampaign?: string | null;
                  device?: string | null;
                };
                const { label: srcLabel, title: srcTitle } = labelReferrer(l.referrer ?? null);
                const hasUtm = l.utmSource || l.utmMedium || l.utmCampaign;
                const utmText = [l.utmSource, l.utmMedium, l.utmCampaign].filter(Boolean).join(' / ');

                return (
                  <tr
                    key={lead.id}
                    className="border-b border-[#E8D5B7]/60 hover:bg-[#FAF3E7]/60 transition-colors"
                  >
                    {/* Email */}
                    <td className="px-4 py-3">
                      {lead.email
                        ? <span className="text-[#2E4A7B] font-medium">{lead.email}</span>
                        : <span className="text-[#C4A882] italic text-xs">—</span>
                      }
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3 text-[#3D2817]">
                      {lead.name || <span className="text-[#C4A882] italic text-xs">—</span>}
                    </td>

                    {/* Ticket type */}
                    <td className="px-4 py-3">
                      <span className="bg-[#FAF3E7] text-[#5C3D20] text-xs px-2 py-0.5 rounded-full font-medium">
                        {lead.ticketType}
                      </span>
                    </td>

                    {/* Traffic source */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className="text-[#3D2817] text-xs font-medium"
                          title={srcTitle}
                        >
                          {srcLabel}
                        </span>
                        {hasUtm && (
                          <span className="text-[#8B6344] text-[10px] font-mono" title={utmText}>
                            {utmText.length > 24 ? utmText.slice(0, 24) + '…' : utmText}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Source page */}
                    <td className="px-4 py-3 text-[#8B6344] text-xs font-mono max-w-[200px] truncate" title={lead.sourcePage}>
                      {lead.sourcePage}
                    </td>

                    {/* Device */}
                    <td className="px-4 py-3 text-xs text-[#5C3D20] capitalize">
                      {l.device ?? <span className="text-[#C4A882] italic">—</span>}
                    </td>

                    {/* Locale */}
                    <td className="px-4 py-3 text-[#5C3D20] text-xs uppercase font-mono">
                      {lead.locale}
                    </td>

                    {/* IP Address */}
                    <td className="px-4 py-3 text-xs font-mono text-[#3D2817]">
                      {(lead as typeof lead & { ipAddress?: string | null }).ipAddress
                        ?? <span className="text-[#C4A882] italic">—</span>}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-[#5C3D20] text-xs whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-[#E8D5B7] text-xs text-[#8B6344]">
          {leads.length} interaction{leads.length !== 1 ? 's' : ''} shown
          {withEmail > 0 && <> &nbsp;·&nbsp; {withEmail} with email</>}
        </div>
      </div>
    </div>
  );
}
