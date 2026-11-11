import prisma from '@/lib/db';
import type { OfferCardData } from '@/lib/offer-card-utils';

export type { OfferCardData };


/**
 * The owner's edits to the homepage ticket cards.
 *
 * Never throws: a database without the OfferCard table yet (the first request
 * after a deploy, before anyone opened /admin/offers) returns no edits, and
 * the cards show exactly what they showed before this feature existed.
 */
export async function getOfferCards(): Promise<OfferCardData[]> {
  try {
    const rows = await prisma.offerCard.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
    return rows.map((r) => ({
      id: r.id,
      section: r.section === 'featured' ? 'featured' : 'grid',
      productKey: r.productKey,
      sortOrder: r.sortOrder,
      hidden: r.hidden,
      title: r.title,
      tagline: r.tagline,
      duration: r.duration,
      includes: r.includes,
      note: r.note,
      price: r.price,
      priceNote: r.priceNote,
      buttonUrl: r.buttonUrl,
      imageUrl: r.imageUrl,
      ribbon: r.ribbon,
      badge: r.badge,
    }));
  } catch {
    return [];
  }
}
