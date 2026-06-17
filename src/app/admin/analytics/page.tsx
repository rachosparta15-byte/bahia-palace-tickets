import prisma from '@/lib/db';
import { BarChart2, Users, Eye, MousePointer, Mail, TrendingUp, Globe, Smartphone, Monitor, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

function pct(a: number, b: number) {
  if (!b) return '0%';
  return `${Math.round((a / b) * 100)}%`;
}

function Bar({ value, max, color = 'bg-[#C4452D]' }: { value: number; max: number; color?: string }) {
  const w = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex-1 bg-[#FAF3E7] rounded-full h-2 overflow-hidden">
      <div className={`${color} h-2 rounded-full`} style={{ width: `${w}%` }} />
    </div>
  );
}

export default async function AnalyticsPage() {
  // Ensure tables exist before querying
  await Promise.allSettled([
    prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "PageView" ("id" TEXT NOT NULL PRIMARY KEY, "sessionId" TEXT NOT NULL, "visitorId" TEXT NOT NULL, "path" TEXT NOT NULL, "locale" TEXT NOT NULL DEFAULT 'en', "referrer" TEXT, "referrerDomain" TEXT, "utmSource" TEXT, "utmMedium" TEXT, "utmCampaign" TEXT, "utmTerm" TEXT, "utmContent" TEXT, "country" TEXT, "city" TEXT, "device" TEXT, "browser" TEXT, "os" TEXT, "ipHash" TEXT NOT NULL DEFAULT '', "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`),
    prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Event" ("id" TEXT NOT NULL PRIMARY KEY, "sessionId" TEXT NOT NULL, "visitorId" TEXT NOT NULL, "name" TEXT NOT NULL, "metadata" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`),
    prisma.$executeRawUnsafe(`ALTER TABLE "Lead" ADD COLUMN "ipAddress" TEXT`).catch(() => {}),
  ]);

  const now = new Date();
  const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const since7d  = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);

  const [
    totalPageViews,
    pageViews24h,
    uniqueVisitors,
    uniqueVisitors24h,
    totalLeads,
    leadsWithEmail,
    leads24h,
    totalEvents,
    modalOpens,
    leadSubmits,
    leadSkips,
    topPages,
    topReferrers,
    byLocale,
    byDevice,
    eventsByName,
  ] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.count({ where: { createdAt: { gte: since24h } } }),
    prisma.pageView.findMany({ select: { visitorId: true }, distinct: ['visitorId'] }).then(r => r.length),
    prisma.pageView.findMany({ where: { createdAt: { gte: since24h } }, select: { visitorId: true }, distinct: ['visitorId'] }).then(r => r.length),
    prisma.lead.count(),
    prisma.lead.count({ where: { email: { not: null } } }),
    prisma.lead.count({ where: { createdAt: { gte: since24h } } }),
    prisma.event.count(),
    prisma.event.count({ where: { name: 'modal_open' } }),
    prisma.event.count({ where: { name: 'lead_submit' } }),
    prisma.event.count({ where: { name: 'lead_skip' } }),
    prisma.$queryRaw<{ path: string; n: bigint }[]>`
      SELECT path, COUNT(*) as n FROM "PageView" GROUP BY path ORDER BY n DESC LIMIT 8
    `,
    prisma.$queryRaw<{ referrerDomain: string | null; n: bigint }[]>`
      SELECT referrerDomain, COUNT(*) as n FROM "PageView"
      WHERE referrerDomain IS NOT NULL GROUP BY referrerDomain ORDER BY n DESC LIMIT 6
    `,
    prisma.$queryRaw<{ locale: string; n: bigint }[]>`
      SELECT locale, COUNT(*) as n FROM "Lead" GROUP BY locale ORDER BY n DESC
    `,
    prisma.$queryRaw<{ device: string | null; n: bigint }[]>`
      SELECT device, COUNT(*) as n FROM "Lead" WHERE device IS NOT NULL GROUP BY device ORDER BY n DESC
    `,
    prisma.$queryRaw<{ name: string; n: bigint }[]>`
      SELECT name, COUNT(*) as n FROM "Event" GROUP BY name ORDER BY n DESC LIMIT 10
    `,
  ]);

  const conversionRate = pct(totalLeads, totalPageViews);
  const emailRate      = pct(leadsWithEmail, totalLeads);
  const skipRate       = pct(leadSkips, modalOpens);

  const topPagesMax    = topPages[0]     ? Number(topPages[0].n)     : 1;
  const topRefMax      = topReferrers[0] ? Number(topReferrers[0].n) : 1;

  const statCards = [
    { label: 'Page Views',       value: totalPageViews, sub: `+${pageViews24h} today`,       icon: Eye,          color: 'text-[#2E4A7B]' },
    { label: 'Unique Visitors',  value: uniqueVisitors, sub: `+${uniqueVisitors24h} today`,  icon: Users,        color: 'text-[#5C8A4A]' },
    { label: 'Total Leads',      value: totalLeads,     sub: `+${leads24h} today`,           icon: Mail,         color: 'text-[#C4452D]' },
    { label: 'Conversion Rate',  value: conversionRate, sub: `${emailRate} left email`,      icon: TrendingUp,   color: 'text-[#E8A33D]' },
  ];

  const funnelSteps = [
    { label: 'Page Views',    value: totalPageViews, color: 'bg-[#2E4A7B]' },
    { label: 'Modal Opens',   value: modalOpens,     color: 'bg-[#5C8A4A]' },
    { label: 'Lead Captured', value: totalLeads,     color: 'bg-[#E8A33D]' },
    { label: 'With Email',    value: leadsWithEmail, color: 'bg-[#C4452D]' },
  ];
  const funnelMax = funnelSteps[0].value || 1;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-[#3D2817]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
        Analytics
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, sub, icon: Icon, color }) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Funnel */}
        <div className="bg-white rounded-2xl border border-[#E8D5B7] p-6">
          <p className="text-xs font-bold text-[#8B6344] uppercase tracking-widest mb-4">Conversion Funnel</p>
          <div className="space-y-3">
            {funnelSteps.map((step, i) => (
              <div key={step.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#3D2817]">{step.label}</span>
                  <span className="text-sm font-bold text-[#3D2817]">{step.value.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#FAF3E7] rounded-full h-3 overflow-hidden">
                    <div className={`${step.color} h-3 rounded-full transition-all`} style={{ width: `${Math.round((step.value / funnelMax) * 100)}%` }} />
                  </div>
                  <span className="text-xs text-[#8B6344] w-10 text-right">{pct(step.value, funnelMax)}</span>
                </div>
                {i < funnelSteps.length - 1 && (
                  <div className="flex justify-center mt-1">
                    <ArrowRight size={12} className="text-[#C4A882] rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal events */}
        <div className="bg-white rounded-2xl border border-[#E8D5B7] p-6">
          <p className="text-xs font-bold text-[#8B6344] uppercase tracking-widest mb-4">Modal Behaviour</p>
          <div className="space-y-4">
            {[
              { label: 'Opens',       value: modalOpens,  color: 'bg-[#2E4A7B]' },
              { label: 'Submitted',   value: leadSubmits, color: 'bg-[#5C8A4A]' },
              { label: 'Skipped',     value: leadSkips,   color: 'bg-[#E8A33D]' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-sm text-[#3D2817] w-24 shrink-0">{label}</span>
                <Bar value={value} max={modalOpens || 1} color={color} />
                <span className="text-sm font-bold text-[#3D2817] w-8 text-right">{value}</span>
                <span className="text-xs text-[#8B6344] w-10">{pct(value, modalOpens)}</span>
              </div>
            ))}
            <p className="text-xs text-[#8B6344] pt-1">Skip rate: <strong>{skipRate}</strong></p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E8D5B7]">
            <p className="text-xs font-bold text-[#8B6344] uppercase tracking-widest mb-3">All Events</p>
            <div className="space-y-1.5">
              {eventsByName.length === 0 && (
                <p className="text-xs text-[#C4A882] italic">No events yet — will appear after first interactions</p>
              )}
              {eventsByName.map(e => (
                <div key={e.name} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-xs text-[#5C3D20]">{e.name}</span>
                  <span className="font-bold text-[#3D2817]">{Number(e.n)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top pages */}
        <div className="bg-white rounded-2xl border border-[#E8D5B7] p-6">
          <p className="text-xs font-bold text-[#8B6344] uppercase tracking-widest mb-4">Top Pages</p>
          {totalPageViews === 0
            ? <p className="text-xs text-[#C4A882] italic">No page views yet</p>
            : (
            <div className="space-y-2.5">
              {topPages.map(p => (
                <div key={p.path} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#5C3D20] truncate w-40 shrink-0" title={p.path}>{p.path || '/'}</span>
                  <Bar value={Number(p.n)} max={topPagesMax} color="bg-[#2E4A7B]" />
                  <span className="text-xs font-bold text-[#3D2817] w-8 text-right">{Number(p.n)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Traffic sources + locale + device */}
        <div className="bg-white rounded-2xl border border-[#E8D5B7] p-6 space-y-6">

          {/* Referrers */}
          <div>
            <p className="text-xs font-bold text-[#8B6344] uppercase tracking-widest mb-3">Traffic Sources</p>
            {topReferrers.length === 0
              ? <p className="text-xs text-[#C4A882] italic">No referrer data yet</p>
              : (
              <div className="space-y-2">
                {topReferrers.map(r => (
                  <div key={r.referrerDomain} className="flex items-center gap-3">
                    <span className="text-xs text-[#3D2817] w-28 shrink-0 truncate">{r.referrerDomain}</span>
                    <Bar value={Number(r.n)} max={topRefMax} color="bg-[#C4452D]" />
                    <span className="text-xs font-bold text-[#3D2817] w-6 text-right">{Number(r.n)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Locale */}
          <div>
            <p className="text-xs font-bold text-[#8B6344] uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Globe size={11} /> Leads by Language
            </p>
            <div className="flex flex-wrap gap-2">
              {byLocale.length === 0
                ? <p className="text-xs text-[#C4A882] italic">No leads yet</p>
                : byLocale.map(l => (
                <div key={l.locale} className="flex items-center gap-1.5 bg-[#FAF3E7] rounded-full px-3 py-1">
                  <span className="text-xs font-mono font-bold text-[#3D2817] uppercase">{l.locale}</span>
                  <span className="text-xs text-[#8B6344]">{Number(l.n)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Device */}
          <div>
            <p className="text-xs font-bold text-[#8B6344] uppercase tracking-widest mb-3">Leads by Device</p>
            <div className="flex gap-4">
              {byDevice.length === 0
                ? <p className="text-xs text-[#C4A882] italic">No device data yet</p>
                : byDevice.map(d => (
                <div key={d.device} className="flex items-center gap-2">
                  {d.device === 'mobile' ? <Smartphone size={14} className="text-[#C4452D]" /> : <Monitor size={14} className="text-[#2E4A7B]" />}
                  <span className="text-sm font-bold text-[#3D2817]">{Number(d.n)}</span>
                  <span className="text-xs text-[#8B6344] capitalize">{d.device}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
