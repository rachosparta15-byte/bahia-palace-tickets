import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { Link } from '@/i18n/navigation';
import { getLegalBundle, getLegalDocs } from '@/content/legal';
import { locales } from '@/i18n/routing';

/**
 * The legal hub — one link in the footer that reaches every policy, which is
 * what both a customer and a card acquirer's reviewer look for.
 */

export const revalidate = 86400;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const bundle = getLegalBundle(locale);
  return {
    title: `${bundle.notice.title} — Visit Bahia Palace`,
    description: bundle.terms.lede.slice(0, 155),
    robots: 'noindex, follow',
  };
}

export default async function LegalHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const docs = getLegalDocs(locale);
  const bundle = getLegalBundle(locale);
  const t = await getTranslations('breadcrumb');

  return (
    <div className="bg-[#1C1108] min-h-screen">
      <div className="bg-[#251A0F] border-b border-[rgba(232,163,61,0.15)] text-white px-6 py-12 md:px-10">
        <div className="max-w-3xl mx-auto">
          <Breadcrumb
            variant="light"
            items={[{ label: t('home'), href: '/' }, { label: bundle.notice.title }]}
          />
          <h1
            className="mt-6 font-bold text-white"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
          >
            {bundle.notice.title}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <ul className="grid gap-3">
          {docs.map((doc) => (
            <li key={doc.slug}>
              <Link
                href={`/legal/${doc.slug}`}
                className="block rounded-xl border border-[rgba(232,163,61,0.13)] bg-[#251A0F] p-5 transition-colors hover:border-[rgba(232,163,61,0.35)]"
              >
                <span
                  className="block font-bold text-[#F5E8CC]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {doc.title}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-[#C4A882]">{doc.lede}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
