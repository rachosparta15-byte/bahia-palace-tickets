/*
 * Shared by the homepage card components (client) and the admin (server).
 * No database import here, so the browser bundle never pulls in Prisma.
 */

/** One row of /admin/offers, as the homepage components receive it. */
export type OfferCardData = {
  id: string;
  section: 'featured' | 'grid';
  productKey: string | null;
  sortOrder: number;
  hidden: boolean;
  title: string | null;
  tagline: string | null;
  duration: string | null;
  includes: string | null;
  note: string | null;
  price: string | null;
  priceNote: string | null;
  buttonUrl: string | null;
  imageUrl: string | null;
  ribbon: string | null;
  badge: string | null;
};

/** Trimmed text, or null when empty, so "" never overrides a default. */
export function filled(value: string | null | undefined): string | null {
  const v = (value ?? '').trim();
  return v.length > 0 ? v : null;
}

/** One line per item; blank lines dropped. */
export function lines(value: string | null | undefined): string[] {
  return (value ?? '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}
