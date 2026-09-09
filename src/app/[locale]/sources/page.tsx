import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { Link } from '@/i18n/navigation';
import { buildAlternates, buildOG, buildBreadcrumbSchema, BASE } from '@/lib/seo';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { BIBLIOGRAPHY, NAMES, NUMBERS, SOURCES } from '@/lib/history/facts';

export const revalidate = 86400;

/*
 * A site becomes a reference by being checkable, not by sounding certain.
 *
 * This page exists because the alternative is what the site used to do: assert
 * a date, a headcount and a visitor total in seven languages with no way for a
 * reader to test any of them, and cite an encyclopedia entry that did not
 * exist. Publishing the bibliography, naming the points where the sources
 * genuinely disagree, and printing an address for corrections costs one page
 * and is the difference between a travel blog and something citable.
 *
 * The prose is translated; the citations are not. A bibliographic entry is an
 * address, and translating a book's title makes it harder to find rather than
 * easier to read.
 */

const META: Record<string, { title: string; description: string }> = {
  en: { title: 'Sources & Corrections — How This Site Establishes Its Facts', description: 'The scholarly sources behind every date and figure on visitbahiapalace.com, the points where those sources disagree, and how to report an error.' },
  fr: { title: 'Sources et corrections — comment ce site établit ses faits', description: 'Les sources savantes derrière chaque date et chaque chiffre de visitbahiapalace.com, les points de désaccord entre elles, et comment signaler une erreur.' },
  es: { title: 'Fuentes y correcciones — cómo este sitio establece sus datos', description: 'Las fuentes académicas tras cada fecha y cifra de visitbahiapalace.com, los puntos en que discrepan y cómo informar de un error.' },
  de: { title: 'Quellen und Korrekturen — wie diese Seite ihre Fakten belegt', description: 'Die wissenschaftlichen Quellen hinter jedem Datum und jeder Zahl auf visitbahiapalace.com, wo sie sich widersprechen, und wie man einen Fehler meldet.' },
  it: { title: 'Fonti e correzioni — come questo sito stabilisce i suoi dati', description: 'Le fonti scientifiche dietro ogni data e cifra di visitbahiapalace.com, i punti in cui divergono e come segnalare un errore.' },
  ar: { title: 'المصادر والتصحيحات — كيف يُثبت هذا الموقع معطياته', description: 'المصادر العلمية وراء كل تاريخ ورقم في visitbahiapalace.com، ومواضع الاختلاف بينها، وكيفية الإبلاغ عن خطأ.' },
  pt: { title: 'Fontes e correções — como este site estabelece os seus factos', description: 'As fontes académicas por trás de cada data e número em visitbahiapalace.com, onde divergem e como comunicar um erro.' },
};

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = META[locale] ?? META.en;
  return {
    title: meta.title,
    description: meta.description,
    alternates: buildAlternates(locale, '/sources'),
    openGraph: buildOG(meta.title, meta.description, locale, '/sources'),
  };
}

export default async function SourcesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('palaceSources');
  const meta = META[locale] ?? META.en;

  const nf = new Intl.NumberFormat(locale);
  const yr = (y: number) => nf.format(y).replace(/ | |,|\./g, '');
  const founded = `${yr(NUMBERS.foundedFrom)}–${yr(NUMBERS.foundedTo)}`;
  const birth = `${yr(NUMBERS.birthFrom)}–${yr(NUMBERS.birthTo)}`;

  const N = {
    founded, birth,
    // The year the internet gives for the first phase, and why it is wrong.
    wrongYear: yr(1859),
    visitors: nf.format(NUMBERS.visitors),
    visitorsYear: yr(NUMBERS.visitorsYear),
    sultanMuhammad: NAMES.sultanMuhammad,
    sultanSlimane: NAMES.sultanSlimane,
  };

  const disputed = [1, 2, 3, 4, 5].map(i => ({
    q: t(`q${i}` as 'q1'),
    a: t(`a${i}` as 'a1', N),
    d: t(`d${i}` as 'd1', N),
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: meta.title,
    description: meta.description,
    url: `${BASE}/${locale}/sources`,
    inLanguage: locale,
    publisher: { '@type': 'Organization', name: 'Visit Bahia Palace', url: BASE },
    citation: BIBLIOGRAPHY.map(k => SOURCES[k].citation),
  };

  return (
    <div className="min-h-screen bg-[#1C1108]">
      <JsonLd data={schema} />
      <JsonLd data={buildBreadcrumbSchema(locale, [{ name: t('crumbHome'), path: '' }, { name: t('crumbSources') }])} />

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">
        <div>
          <Breadcrumb variant="light" items={[{ label: t('crumbHome'), href: '/' }, { label: t('crumbSources') }]} />
          <h1 className="text-[#F5E8CC] font-bold leading-tight mt-6"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.9rem, 4vw, 2.9rem)' }}>
            {t('h1')}
          </h1>
          <p className="text-[#C4A882] leading-relaxed text-lg mt-4">{t('intro')}</p>
        </div>

        {/* Bibliography — untranslated on purpose. */}
        <section>
          <h2 className="text-2xl font-bold text-[#F5E8CC] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('citedTitle')}
          </h2>
          <ol className="space-y-3 list-decimal ps-5">
            {BIBLIOGRAPHY.map(k => (
              <li key={k} className="text-sm text-[#C4A882] leading-relaxed">
                {SOURCES[k].url
                  ? <a href={SOURCES[k].url} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#F5E8CC]">{SOURCES[k].citation}</a>
                  : SOURCES[k].citation}
              </li>
            ))}
          </ol>
          <p className="text-xs text-[#8C7355] mt-4 leading-relaxed">{t('citedNote')}</p>
        </section>

        {/* The open questions. Naming them is the point of the page. */}
        <section>
          <h2 className="text-2xl font-bold text-[#F5E8CC] mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('disagreeTitle')}
          </h2>
          <p className="text-sm text-[#C4A882] mb-6">{t('disagreeIntro')}</p>
          <div className="space-y-5">
            {disputed.map(({ q, a, d }) => (
              <div key={q} className="bg-[#251A0F] rounded-2xl border border-[rgba(232,163,61,0.13)] p-5">
                <h3 className="font-bold text-[#F5E8CC] mb-1.5" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem' }}>{q}</h3>
                <p className="text-sm font-semibold text-[#E8A33D] mb-2">{a}</p>
                <p className="text-sm text-[#C4A882] leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Method */}
        <section>
          <h2 className="text-2xl font-bold text-[#F5E8CC] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('methodTitle')}
          </h2>
          <ul className="space-y-3 text-sm text-[#C4A882] leading-relaxed list-disc ps-5">
            {(['m1', 'm2', 'm3', 'm4', 'm5'] as const).map(k => <li key={k}>{t(k)}</li>)}
            <li>
              {t.rich('m6', {
                link: chunks => <Link href="/about/editorial" className="underline hover:text-[#F5E8CC]">{chunks}</Link>,
              })}
            </li>
          </ul>
        </section>

        {/* Corrections */}
        <section className="bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-6">
          <h2 className="font-bold text-[#F5E8CC] mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem' }}>
            {t('errorTitle')}
          </h2>
          <p className="text-sm text-[#C4A882] leading-relaxed">{t('errorBody')}</p>
          <p className="text-sm text-[#E8A33D] mt-3 font-semibold">support@marrakechlocal.com</p>
        </section>
      </div>
    </div>
  );
}
