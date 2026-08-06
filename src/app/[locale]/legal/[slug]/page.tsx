import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { LegalPage } from '@/components/legal/LegalPage';
import { getLegalDoc, isLegalSlug, legalSlugs } from '@/content/legal';
import { locales } from '@/i18n/routing';

/**
 * A legal document on visitbahiapalace.com.
 *
 * Text is synced from marrakechlocal (`npm run sync:legal`) and rendered on the
 * server, so the terms exist in the HTML rather than appearing after JavaScript
 * runs. A crawler, a reviewer with scripting off, and a customer on a weak
 * connection all need to see them.
 *
 * `noindex` is deliberate: the same nine documents appear on four domains in
 * this network. They must exist and be one click away — which is what matters
 * legally and to a card acquirer's reviewer — but four copies competing in
 * search is duplicate content aimed at ourselves.
 */

export const revalidate = 86400;

export function generateStaticParams() {
  return locales.flatMap((locale) => legalSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const doc = getLegalDoc(locale, slug);
  if (!doc) return { robots: 'noindex' };

  return {
    title: `${doc.title} — Visit Bahia Palace`,
    description: doc.lede.slice(0, 155),
    robots: 'noindex, follow',
  };
}

export default async function LegalDocPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLegalSlug(slug)) notFound();

  const doc = getLegalDoc(locale, slug);
  if (!doc) notFound();

  const t = await getTranslations('breadcrumb');

  return (
    <LegalPage
      homeLabel={t('home')}
      title={doc.title}
      subtitle={doc.lede}
      lastUpdated={doc.updated}
      notice={doc.notice}
      sections={doc.sections}
    />
  );
}
