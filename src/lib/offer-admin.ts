import prisma from '@/lib/db';
import { ensureColumns } from '@/lib/db/ensure-columns';
import en from '../../messages/en.json';
import {
  FEATURED_IMAGES,
  FEATURED_PRODUCT_KEY,
  GRID_IMAGES,
  GRID_NAME_KEYS,
  GRID_SLUGS,
  GRID_VIATOR_LINKS,
  type GridSlug,
} from '@/config/offer-defaults';

/** The cards that exist in code, each editable through one OfferCard row. */
export const BUILT_IN_CARDS: Array<{ section: 'featured' | 'grid'; productKey: string; label: string; order: number }> = [
  { section: 'featured', productKey: FEATURED_PRODUCT_KEY, label: 'Large card (Skip-the-Line / Visitor Pack)', order: 0 },
  ...GRID_SLUGS.map((slug, i) => ({ section: 'grid' as const, productKey: slug, label: slug, order: i })),
];

/** What a card shows today when a field is left empty, for the admin to see. */
export type OfferDefaults = {
  title: string;
  tagline: string;
  duration: string;
  includes: string;
  note: string;
  price: string;
  priceNote: string;
  buttonUrl: string;
  imageUrl: string;
  ribbon: string;
  badge: string;
};

type TicketTexts = { name?: string; tagline?: string; duration?: string; includes?: string[] };
const tickets = (en as unknown as { tickets: Record<string, unknown> }).tickets;
const textOf = (key: string): TicketTexts => (tickets[key] ?? {}) as TicketTexts;
const str = (key: string): string => (typeof tickets[key] === 'string' ? (tickets[key] as string) : '');

export function defaultsFor(section: string, productKey: string | null): OfferDefaults | null {
  if (!productKey) return null;
  if (section === 'featured') {
    const t = textOf('skipTheLine');
    return {
      title: t.name ?? '',
      tagline: t.tagline ?? '',
      duration: t.duration ?? '',
      includes: (t.includes ?? []).join('\n'),
      note: str('priceNotePartnerAudio'),
      price: 'Automatic: the Viator price, updated every day',
      priceNote: str('audioGuideValueNote'),
      buttonUrl: 'Automatic: Viator, or GetYourGuide for near dates',
      imageUrl: FEATURED_IMAGES['skip-the-line'],
      ribbon: 'Available Now',
      badge: str('audioGuideBadge'),
    };
  }
  const slug = productKey as GridSlug;
  const t = textOf(GRID_NAME_KEYS[slug]);
  const link = GRID_VIATOR_LINKS[slug];
  return {
    title: t.name ?? '',
    tagline: '',
    duration: t.duration ?? '',
    includes: '',
    note: slug === 'skip-the-line' ? str('priceNotePartnerAudio') : link ? str('priceNotePartner') : str('priceNoteOwn'),
    price: 'Automatic: the Viator price, updated every day',
    priceNote: '',
    buttonUrl: link
      ? slug === 'skip-the-line'
        ? 'Automatic: Viator, or GetYourGuide for near dates'
        : link
      : '',
    imageUrl: GRID_IMAGES[slug],
    ribbon: '',
    badge: '',
  };
}

/** Creates the empty rows for the built-in cards, once. Changes nothing on the site. */
export async function ensureBuiltInRows(): Promise<void> {
  await ensureColumns();
  for (const card of BUILT_IN_CARDS) {
    await prisma.offerCard.upsert({
      where: { section_productKey: { section: card.section, productKey: card.productKey } },
      create: { section: card.section, productKey: card.productKey, sortOrder: card.order },
      update: {},
    });
  }
}
