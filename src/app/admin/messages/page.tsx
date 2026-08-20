import prisma from '@/lib/db';
import { adminDateTime } from '@/lib/admin/when';
import { Search, Mail, User, MessageSquare, Globe, Wifi, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function MessagesPage({ searchParams }: Props) {
  const { q } = await searchParams;

  // Ensure the table exists before querying (idempotent, matches leads pattern)
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "locale" TEXT,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).catch(() => {});

  const messages = await prisma.contactMessage.findMany({
    where: q
      ? {
          OR: [
            { email:   { contains: q } },
            { name:    { contains: q } },
            { subject: { contains: q } },
            { message: { contains: q } },
          ],
        }
      : {},
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  const now = Date.now();
  const last7days = messages.filter(
    m => now - new Date(m.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
  ).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1
          className="text-2xl font-bold text-[#3D2817]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Contact Messages
        </h1>

        {/* Stats */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Total messages', value: messages.length, color: 'bg-[#3D2817] text-white' },
            { label: 'Last 7 days',    value: last7days,       color: 'bg-[#6B7B3A]/20 text-[#4a5a28]' },
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
                placeholder="Search by name, email, subject or message…"
                className="ps-8 pe-4 py-2 text-sm border border-[#D4BC96] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4452D]/30 focus:border-[#C4452D] w-80 bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-[#3D2817] text-white rounded-lg hover:bg-[#5C3D20] transition-colors"
            >
              Search
            </button>
            {q && (
              <a href="/admin/messages" className="text-sm text-[#8B6344] hover:text-[#3D2817]">
                Clear
              </a>
            )}
          </form>
        </div>

        {/* Messages list */}
        {messages.length === 0 ? (
          <div className="px-6 py-16 text-center text-[#8B6344]">
            {q ? 'No messages match your search' : 'No messages yet — they will appear here when a visitor uses the contact form'}
          </div>
        ) : (
          <div className="divide-y divide-[#E8D5B7]/60">
            {messages.map(m => (
              <div key={m.id} className="px-6 py-5 hover:bg-[#FAF3E7]/60 transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#3D2817] flex items-center gap-2 flex-wrap">
                      <MessageSquare size={14} className="text-[#C4452D] shrink-0" />
                      {m.subject}
                    </p>
                    <p className="mt-1 text-xs text-[#8B6344] flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <User size={11} />
                        {m.name}
                      </span>
                      <a href={`mailto:${m.email}`} className="flex items-center gap-1 text-[#2E4A7B] font-medium hover:underline">
                        <Mail size={11} />
                        {m.email}
                      </a>
                      {m.locale && (
                        <span className="flex items-center gap-1 uppercase font-mono">
                          <Globe size={11} />
                          {m.locale}
                        </span>
                      )}
                      {m.ipAddress && (
                        <span className="flex items-center gap-1 font-mono">
                          <Wifi size={11} />
                          {m.ipAddress}
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-xs text-[#5C3D20] whitespace-nowrap flex items-center gap-1 shrink-0">
                    <Calendar size={11} />
                    {adminDateTime(m.createdAt)}
                  </p>
                </div>
                <p className="mt-3 text-sm text-[#5C3D20] leading-relaxed whitespace-pre-wrap bg-[#FAF3E7] rounded-xl px-4 py-3 border border-[#E8D5B7]/60">
                  {m.message}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="px-6 py-3 border-t border-[#E8D5B7] text-xs text-[#8B6344]">
          {messages.length} message{messages.length !== 1 ? 's' : ''} shown
        </div>
      </div>
    </div>
  );
}
