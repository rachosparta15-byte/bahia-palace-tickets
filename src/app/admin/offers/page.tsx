import prisma from '@/lib/db';
import Link from 'next/link';
import { Pencil, EyeOff } from 'lucide-react';
import { defaultsFor, ensureBuiltInRows } from '@/lib/offer-admin';
import { OfferListControls, AddOfferButton } from '@/components/admin/OfferListControls';

export const dynamic = 'force-dynamic';

const SECTIONS = [
  {
    id: 'featured' as const,
    title: 'Large card',
    help: 'The big card under "Choose Your Bahia Palace Experience". Add more cards here and they appear side by side.',
  },
  {
    id: 'grid' as const,
    title: 'Grid of offers',
    help: 'The cards under "Choose how you experience Bahia".',
  },
];

export default async function AdminOffersPage() {
  await ensureBuiltInRows();
  const cards = await prisma.offerCard.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-[#3D2817]" style={{ fontFamily: 'var(--font-heading)' }}>
        Homepage offers
      </h1>
      <p className="text-sm text-[#8B6344] mt-1 mb-8">
        Edit the ticket cards on the homepage: text, price, link and photo. Everything you edit shows in every language
        (texts as you write them). Fields you leave empty keep the site's own text, translated.
      </p>

      {SECTIONS.map((section) => {
        const list = cards.filter((c) => c.section === section.id);
        return (
          <section key={section.id} className="mb-10">
            <div className="flex items-end justify-between gap-4 mb-3">
              <div>
                <h2 className="text-lg font-bold text-[#3D2817]">{section.title}</h2>
                <p className="text-xs text-[#8B6344]">{section.help}</p>
              </div>
              <AddOfferButton section={section.id} />
            </div>
            <div className="space-y-3">
              {list.map((card, i) => {
                const d = defaultsFor(card.section, card.productKey);
                const title = card.title || d?.title || '(no title)';
                const image = card.imageUrl || d?.imageUrl || '';
                const price = card.price || (d ? 'Automatic' : '—');
                return (
                  <div key={card.id} className="flex items-center gap-4 bg-white rounded-2xl border border-[#E8D5B7] p-3">
                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F5EFE4]">
                      {image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#3D2817] truncate">{title}</p>
                      <p className="text-xs text-[#8B6344]">
                        {price}
                        {card.productKey ? ' · built-in card' : ' · added by you'}
                        {card.hidden && (
                          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#FBE9E4] px-2 py-0.5 text-[#C4452D]">
                            <EyeOff size={11} /> hidden
                          </span>
                        )}
                      </p>
                    </div>
                    <OfferListControls
                      id={card.id}
                      hidden={card.hidden}
                      upId={i > 0 ? list[i - 1].id : null}
                      downId={i < list.length - 1 ? list[i + 1].id : null}
                      order={card.sortOrder}
                      upOrder={i > 0 ? list[i - 1].sortOrder : null}
                      downOrder={i < list.length - 1 ? list[i + 1].sortOrder : null}
                    />
                    <Link
                      href={`/admin/offers/${card.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#3D2817] px-3 py-2 text-xs font-semibold text-white hover:bg-[#5C3D20]"
                    >
                      <Pencil size={13} /> Edit
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
