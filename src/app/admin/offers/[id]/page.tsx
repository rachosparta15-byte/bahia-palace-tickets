import prisma from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { defaultsFor, ensureBuiltInRows } from '@/lib/offer-admin';
import { OfferEditForm } from '@/components/admin/OfferEditForm';

export const dynamic = 'force-dynamic';

export default async function OfferEditPage({ params }: { params: Promise<{ id: string }> }) {
  await ensureBuiltInRows();
  const { id } = await params;
  const card = await prisma.offerCard.findUnique({ where: { id } });
  if (!card) notFound();
  const defaults = defaultsFor(card.section, card.productKey);

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/offers" className="inline-flex items-center gap-2 text-sm text-[#5C3D20] hover:text-[#3D2817] mb-6">
        <ArrowLeft size={14} />
        Back to offers
      </Link>
      <h1 className="text-2xl font-bold text-[#3D2817] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
        {card.title || defaults?.title || 'New offer'}
      </h1>
      <p className="text-sm text-[#8B6344] mb-8">
        {card.section === 'featured' ? 'Large card' : 'Grid of offers'} ·{' '}
        {card.productKey ? 'built-in card: leave a field empty to keep what the site shows today' : 'card added by you'}
      </p>
      <OfferEditForm
        card={{
          id: card.id,
          section: card.section,
          builtIn: Boolean(card.productKey),
          hidden: card.hidden,
          title: card.title ?? '',
          tagline: card.tagline ?? '',
          duration: card.duration ?? '',
          includes: card.includes ?? '',
          note: card.note ?? '',
          price: card.price ?? '',
          priceNote: card.priceNote ?? '',
          buttonUrl: card.buttonUrl ?? '',
          imageUrl: card.imageUrl ?? '',
          ribbon: card.ribbon ?? '',
          badge: card.badge ?? '',
        }}
        defaults={defaults}
      />
    </div>
  );
}
