import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { SafetyTipForm } from '@/components/admin/SafetyTipForm';

export const dynamic = 'force-dynamic';

export default async function EditSafetyTipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tip = await prisma.safetyTip.findUnique({ where: { id } });
  if (!tip) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-[#3D2817] mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
        Edit Safety Tip
      </h1>
      <p className="text-sm text-[#8B6344] mb-8 truncate">"{tip.title}"</p>
      <div className="bg-white rounded-2xl border border-[#E8D5B7] p-6">
        <SafetyTipForm mode="edit" initial={{ ...tip, order: tip.order }} />
      </div>
    </div>
  );
}
