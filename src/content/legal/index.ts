import en from './en.json';
import fr from './fr.json';
import it from './it.json';
import de from './de.json';
import es from './es.json';
import ar from './ar.json';
import pt from './pt.json';

/**
 * The legal documents, synced from marrakechlocal by `npm run sync:legal`.
 *
 * This replaced a hand-written module that named a different selling entity
 * from the rest of the network. One order has one counterparty, and one Stripe
 * account belongs to one legal entity, so the text has to come from the same
 * place the consent record taken at checkout quotes.
 *
 * Read from JSON committed to this repository rather than fetched at build
 * time: a build that depends on the network is a build that fails when the
 * network does, and a legal page that fails to render is worse than one that is
 * a day out of date. It also means a change to a legal term arrives as a
 * reviewable diff instead of appearing in production unannounced.
 */

export type LegalDocSection = {
  id: string;
  heading: string;
  paragraphs?: string[];
  list?: string[];
  table?: { head: string[]; rows: string[][] };
};

export type LegalDoc = {
  slug: string;
  locale: string;
  brand: string | null;
  title: string;
  updated: string;
  lede: string;
  sections: LegalDocSection[];
  notice?: string;
};

export type LegalBundle = Record<string, LegalDoc>;

const bundles: Record<string, LegalBundle> = {
  en: en as unknown as LegalBundle,
  fr: fr as unknown as LegalBundle,
  it: it as unknown as LegalBundle,
  de: de as unknown as LegalBundle,
  es: es as unknown as LegalBundle,
  ar: ar as unknown as LegalBundle,
  pt: pt as unknown as LegalBundle,
};

/** Display order: what a customer needs most often first. */
export const legalSlugs = [
  'terms',
  'refunds',
  'delivery',
  'payments',
  'privacy',
  'cookies',
  'accessibility',
  'notice',
  'affiliate-disclosure',
] as const;

export type LegalSlug = (typeof legalSlugs)[number];

export function isLegalSlug(value: string): value is LegalSlug {
  return (legalSlugs as readonly string[]).includes(value);
}

export function getLegalBundle(locale: string): LegalBundle {
  return bundles[locale] ?? bundles.en;
}

export function getLegalDoc(locale: string, slug: string): LegalDoc | null {
  return getLegalBundle(locale)[slug] ?? null;
}

/** In display order, with anything added upstream appended rather than lost. */
export function getLegalDocs(locale: string): LegalDoc[] {
  const bundle = getLegalBundle(locale);
  const known = legalSlugs.filter((slug) => bundle[slug]);
  const extra = Object.keys(bundle).filter((slug) => !legalSlugs.includes(slug as LegalSlug));
  return [...known, ...extra].map((slug) => bundle[slug]);
}

/**
 * The publisher block of the Legal Notice — entity, address, contacts.
 * Used by the footer so the trader identification cannot say one thing there
 * and another on the legal page.
 */
export function getImprintLines(locale: string): string[] {
  const notice = getLegalDoc(locale, 'notice');
  return notice?.sections.find((section) => section.id === 'publisher')?.list ?? [];
}
