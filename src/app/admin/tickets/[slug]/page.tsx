import prisma from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TicketEditForm } from '@/components/admin/TicketEditForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function TicketEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ticket = await prisma.ticketType.findUnique({ where: { slug } });
  if (!ticket) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/tickets" className="inline-flex items-center gap-2 text-sm text-[#5C3D20] hover:text-[#3D2817] mb-6">
        <ArrowLeft size={14} />
        Back to tickets
      </Link>
      <h1
        className="text-2xl font-bold text-[#3D2817] mb-2"
        style={{ fontFamily: 'Cormorant Garamond, serif' }}
      >
        {ticket.nameEn}
      </h1>
      <p className="text-sm text-[#8B6344] mb-8">Slug: <code className="font-mono bg-[#F5EFE4] px-1.5 py-0.5 rounded">{ticket.slug}</code></p>

      <TicketEditForm ticket={ticket} />
    </div>
  );
}
