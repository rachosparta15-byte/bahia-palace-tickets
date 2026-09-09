import { LeadButton } from '@/components/layout/LeadButton';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { Link } from '@/i18n/navigation';
import { buildAlternates, buildOG, buildBreadcrumbSchema, BASE } from '@/lib/seo';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPublicPaymentsFlags } from '@/lib/payments/guard';
import { BIBLIOGRAPHY, NAMES, NUMBERS, SOURCES } from '@/lib/history/facts';

export const revalidate = 86400;

/*
 * This page took the question the history article's title does not ask. "Who
 * was Ba Ahmed" is a person, not a building: a different search, answered by
 * content that was always mostly about him.
 *
 * It is now also the first of the static pages to be translated. Its prose
 * lives in the palaceHistory namespace and every digit is interpolated from
 * NUMBERS, so a translator is handed a sentence with a slot rather than a date
 * to retype. Years, counts and the death date are formatted through Intl for
 * the active locale, which is why 410,141 becomes 410 141 in French and the
 * date renders in each language's own convention without anyone deciding so.
 *
 * The bibliography itself stays untranslated. A citation is an address, and
 * translating a book's title makes it harder to find, not easier to read.
 */

const META: Record<string, { title: string; description: string }> = {
  en: { title: "Who Was Ba Ahmed? The Vizier Who Built Bahia Palace", description: "Three generations from an enslaved grandfather to the man who ruled Morocco in all but name. Ba Ahmed turned his father's 1866 house into the Bahia between 1894 and 1900 — and it was stripped bare the week he died." },
  fr: { title: "Qui était Ba Ahmed ? Le Vizir du Palais Bahia", description: "Petit-fils d'un esclave devenu maître du Maroc. Ba Ahmed transforma la maison paternelle de 1866 en palais Bahia entre 1894 et 1900 — pillé dans la semaine suivant sa mort." },
  es: { title: "¿Quién fue Ba Ahmed? El Visir del Palacio Bahía", description: "Nieto de un esclavo que gobernó Marruecos en todo salvo el nombre. Ba Ahmed convirtió la casa paterna de 1866 en el Palacio Bahía entre 1894 y 1900, saqueado la semana de su muerte." },
  de: { title: "Wer war Ba Ahmed? Der Wesir hinter dem Bahia Palast", description: "Enkel eines Sklaven, der Marokko faktisch regierte. Ba Ahmed baute das Haus seines Vaters von 1866 zwischen 1894 und 1900 zum Bahia Palast aus — geplündert in der Woche seines Todes." },
  it: { title: "Chi era Ba Ahmed? Il Visir del Palazzo Bahia", description: "Nipote di uno schiavo, governò il Marocco di fatto. Ba Ahmed trasformò la casa paterna del 1866 nel Palazzo Bahia fra il 1894 e il 1900 — saccheggiato la settimana della sua morte." },
  ar: { title: "من هو با أحمد؟ الوزير الذي بنى قصر الباهية", description: "حفيد عبد مُحرَّر حكم المغرب فعلياً دون لقب. حوَّل با أحمد دار أبيه المؤرخة بـ1866 إلى قصر الباهية بين 1894 و1900 — ونُهب القصر في الأسبوع الذي توفي فيه." },
  pt: { title: "Quem Foi Ba Ahmed? O Vizir Que Construiu o Palácio da Bahia", description: "Neto de um escravo que governou Marrocos sem o título. Ba Ahmed transformou a casa paterna de 1866 no Palácio da Bahia entre 1894 e 1900 — saqueado na semana da sua morte." },
};

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = META[locale] ?? META.en;
  return {
    title: meta.title,
    description: meta.description,
    alternates: buildAlternates(locale, '/history'),
    openGraph: { ...buildOG(meta.title, meta.description, locale, '/history'), type: 'article' },
  };
}

function getHistorySchema(locale: string) {
  const meta = META[locale] ?? META.en;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.description,
    url: `${BASE}/${locale}/history`,
    inLanguage: locale,
    author: { '@type': 'Organization', name: 'Visit Bahia Palace' },
    publisher: { '@type': 'Organization', name: 'Visit Bahia Palace', logo: { '@type': 'ImageObject', url: `${BASE}/og-image.jpg` } },
    about: {
      '@type': 'TouristAttraction',
      name: 'Bahia Palace',
      // The dated inscription, not the 1859 accession year that stood here.
      foundingDate: String(NUMBERS.foundedFrom),
      address: { '@type': 'PostalAddress', addressLocality: 'Marrakech', addressCountry: 'MA' },
    },
    citation: BIBLIOGRAPHY.map(k => SOURCES[k].citation),
  };
}

export default async function HistoryPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('palaceHistory');
  const { enabled: paymentsEnabled } = getPublicPaymentsFlags();

  /* Numbers formatted by the locale, never by a translator. */
  const nf = new Intl.NumberFormat(locale);
  const yr = (y: number) => nf.format(y).replace(/ | |,|\./g, '');
  const range = (a: number, b: number) => `${yr(a)}–${yr(b)}`;
  const founded = range(NUMBERS.foundedFrom, NUMBERS.foundedTo);
  const expansion = range(NUMBERS.expansionFrom, NUMBERS.expansionTo);
  const marble = range(NUMBERS.marbleFrom, NUMBERS.marbleTo);
  const birth = range(NUMBERS.birthFrom, NUMBERS.birthTo);
  /*
   * timeZone UTC is not decoration. new Date('1900-05-17') parses as midnight
   * UTC, and formatting that in any negative-offset zone renders 16 May. The
   * server's timezone must not be able to move a historical date.
   */
  const death = new Intl.DateTimeFormat(locale, {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(NUMBERS.death));

  const N = {
    founded, expansion, marble,
    expansionFrom: yr(NUMBERS.expansionFrom),
    expansionTo: yr(NUMBERS.expansionTo),
    hajibFrom: yr(NUMBERS.hajibFrom),
    protectorate: yr(NUMBERS.protectorate),
    unescoYear: yr(NUMBERS.unescoYear),
    unescoRef: nf.format(NUMBERS.unescoRef),
    houses: nf.format(NUMBERS.housesAbsorbed),
    gardens: nf.format(NUMBERS.gardensAcquired),
    sultanAge: nf.format(NUMBERS.sultanAge),
    visitors: nf.format(NUMBERS.visitors),
    visitorsYear: yr(NUMBERS.visitorsYear),
    ...NAMES,
    architect: NAMES.architect,
    sultanMuhammad: NAMES.sultanMuhammad,
    sultanHassan: NAMES.sultanHassan,
    sultanYoung: NAMES.sultanYoung,
    sultanSlimane: NAMES.sultanSlimane,
  };

  const facts: [string, string, string][] = [
    [t('labelFirstPhase'), founded, t('srcInscription')],
    [t('labelExpansion'), expansion, t('srcDeverdunMinistry')],
    [t('labelBuiltArea'), t('valBuiltArea', { ha: nf.format(NUMBERS.areaBuiltHa) }), t('srcDeverdun')],
    [t('labelGrounds'), t('valGrounds', { ha: nf.format(NUMBERS.areaTotalHa) }), t('srcMinistry')],
    [t('labelRooms'), t('valRooms', { n: nf.format(NUMBERS.rooms) }), t('srcGhachem')],
    [t('labelArchitect'), t('valArchitect', { name: NAMES.architect, born: yr(NUMBERS.architectBorn), died: yr(NUMBERS.architectDied), from: NAMES.architectFrom }), t('srcDeverdun')],
    [t('labelBaAhmed'), t('valBaAhmed', { birth, death }), t('srcChronicles')],
    [t('labelLocation'), NAMES.street, t('srcMinistry')],
  ];

  const timeline: [string, string, string, string][] = [
    [founded, t('tl1Title', N), t('tl1Text', N), t('srcDeverdun')],
    [yr(NUMBERS.hajibFrom), t('tl2Title', N), t('tl2Text', N), t('srcDeverdun')],
    [yr(NUMBERS.expansionFrom), t('tl3Title', N), t('tl3Text', N), t('srcDeverdun')],
    [expansion, t('tl4Title', N), t('tl4Text', N), t('srcDeverdun')],
    [death, t('tl5Title', N), t('tl5Text', N), t('srcDeverdun')],
    [yr(NUMBERS.protectorate), t('tl6Title', N), t('tl6Text', N), t('srcMinistry')],
    [yr(NUMBERS.unescoYear), t('tl7Title', N), t('tl7Text', N), t('srcMinistry')],
  ];

  const materials: [string, string, string | null, string | null][] = [
    [t('matZelligeLabel'), t('matZelligeDesc'), '/images/gallery/bahia-palace-blue-door-courtyard.webp', 'Blue-painted door and zellige-tiled courtyard at Bahia Palace, Marrakech'],
    [t('matCedarLabel'), t('matCedarDesc'), '/images/gallery/bahia-palace-brass-chandelier-ceiling.webp', 'Brass chandelier beneath a painted wooden ceiling, Bahia Palace Marrakech'],
    [t('matGebsLabel'), t('matGebsDesc'), '/images/gallery/bahia-palace-carved-stucco-archway.webp', 'Finely carved gebs plaster archway and zellige walls inside Bahia Palace, Marrakech'],
    [t('matMarbleLabel'), t('matMarbleDesc', { marble }), null, null],
  ];

  return (
    <div className="min-h-screen bg-[#1C1108]">
      <JsonLd data={getHistorySchema(locale)} />
      <JsonLd data={buildBreadcrumbSchema(locale, [{ name: t('crumbHome'), path: '' }, { name: t('crumbHistory') }])} />

      {/* Hero */}
      <div className="relative h-72 md:h-96">
        <Image src="/images/gallery/bahia-palace-octagonal-cedar-ceiling-carved-wood.jpg" alt="Bahia Palace Marrakech ornate painted cedar wood ceiling — 19th century Moroccan architecture" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-[#1C1108]/90" />
        <div className="absolute inset-0 flex flex-col justify-between px-6 py-8 md:px-10 max-w-4xl mx-auto w-full left-0 right-0">
          <Breadcrumb variant="light" items={[{ label: t('crumbHome'), href: '/' }, { label: t('crumbHistory') }]} />
          <div>
            <span className="inline-block bg-[#C4452D] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {t('badge', { from: yr(NUMBERS.foundedFrom), to: yr(NUMBERS.expansionTo) })}
            </span>
            <h1 className="text-white font-bold leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
              {t('h1')}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* Introduction */}
        <div className="prose prose-lg max-w-none">
          <p className="text-[#C4A882] leading-relaxed text-lg">{t('introA', N)}</p>
          <p className="text-[#C4A882] leading-relaxed mt-4">{t('introB')}</p>
          <p className="text-xs text-[#8C7355] mt-4 italic">{t('sourcedNote')}</p>
        </div>

        {/* Who built it */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#251A0F] rounded-2xl border border-[rgba(232,163,61,0.13)] p-6">
            <h2 className="font-bold text-[#F5E8CC] mb-3" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem' }}>
              {t('whoTitle')}
            </h2>
            <p className="text-sm text-[#C4A882] leading-relaxed mb-3">{t('whoA', N)}</p>
            <p className="text-sm text-[#C4A882] leading-relaxed mb-3">{t('whoB', N)}</p>
            <p className="text-sm text-[#C4A882] leading-relaxed mb-3">{t('whoC', N)}</p>
            <p className="text-sm text-[#C4A882] leading-relaxed">{t('whoD', N)}</p>
          </div>

          <div className="bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-6 text-white">
            <h3 className="font-bold text-[#F5E8CC] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem' }}>{t('factsTitle')}</h3>
            {/*
              * "8 hectares, 150 rooms" on one line was the worst number on the
              * site: it read as eight hectares of building, four times the
              * truth. The two figures count different things and are separated.
              */}
            <div className="space-y-2.5">
              {facts.map(([key, val, src]) => (
                <div key={key} className="border-b border-[rgba(232,163,61,0.12)] pb-2">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-[#C4A882] shrink-0">{key}</span>
                    <span className="font-semibold text-[#F5E8CC] text-end">{val}</span>
                  </div>
                  <p className="text-[10px] text-[#8C7355] mt-0.5">{src}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="text-2xl font-bold text-[#F5E8CC] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('timelineTitle')}
          </h2>
          <div className="relative">
            <div className="absolute start-6 top-0 bottom-0 w-0.5 bg-[rgba(232,163,61,0.25)]" />
            <div className="space-y-6">
              {timeline.map(([year, title, text, src]) => (
                <div key={title} className="ps-14 relative">
                  <div className="absolute start-3.5 top-1.5 w-5 h-5 rounded-full bg-[#C4452D] border-2 border-[#1C1108] shadow" />
                  <span className="text-xs font-bold text-[#C4452D] uppercase tracking-widest">{year}</span>
                  <h3 className="font-bold text-[#F5E8CC] mt-0.5 mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem' }}>{title}</h3>
                  <p className="text-sm text-[#C4A882] leading-relaxed">{text}</p>
                  <p className="text-[10px] text-[#8C7355] mt-1.5">{src}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Architecture */}
        <div>
          <h2 className="text-2xl font-bold text-[#F5E8CC] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('archTitle')}
          </h2>
          {/*
            * This paragraph used to gloss the carved plasterwork as "tadelakt".
            * Tadelakt is a polished waterproof lime render for hammams; the
            * carved arabesque panels are gebs. Different trade, different
            * material.
            */}
          <p className="text-[#C4A882] leading-relaxed mb-4">{t('archIntro')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {materials.map(([label, desc, img, alt]) => (
              <div key={label} className="bg-[#251A0F] rounded-xl border border-[rgba(232,163,61,0.13)] overflow-hidden text-center">
                <div className="h-24 bg-[#2E1F12] overflow-hidden">
                  {img && (
                    <Image src={img} alt={alt!} width={600} height={400}
                      className="w-full h-full object-cover" loading="lazy"
                      sizes="(max-width:640px) 50vw, 25vw" />
                  )}
                </div>
                <div className="p-4">
                  <p className="font-bold text-[#F5E8CC] text-sm mb-1">{label}</p>
                  <p className="text-xs text-[#C4A882] leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { src: '/images/gallery/bahia-palace-painted-dome-ceiling.webp',  alt: 'Ornate painted octagonal ceiling with floral motifs, Bahia Palace Marrakech' },
            { src: '/images/gallery/bahia-palace-tiled-passage-lantern.webp', alt: 'Arched passage with herringbone zellige floor and Moroccan lantern, Bahia Palace' },
            { src: '/images/gallery/bahia-palace-grand-doorway-zellige.webp', alt: 'Grand decorated doorway with blue zellige tilework, Bahia Palace Marrakech' },
          ].map(({ src, alt }) => (
            <div key={src} className="rounded-2xl overflow-hidden">
              <Image src={src} alt={alt} width={800} height={533}
                className="w-full h-48 object-cover" loading="lazy"
                sizes="(max-width:640px) 100vw, 33vw" />
            </div>
          ))}
        </div>

        {/* The history is a sequence of rooms as much as of years. */}
        <div className="bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-[#F5E8CC] mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem' }}>
              {t('planTitle')}
            </h2>
            <p className="text-sm text-[#C4A882] max-w-md">{t('planBody')}</p>
          </div>
          <Link href="/plan" className="inline-flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-6 py-3 rounded-xl transition-colors shrink-0">
            {t('planBtn')} <ArrowRight size={16} />
          </Link>
        </div>

        {/* Today */}
        <div>
          <h2 className="text-2xl font-bold text-[#F5E8CC] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('todayTitle')}
          </h2>
          <p className="text-[#C4A882] leading-relaxed mb-3">{t('todayA', N)}</p>
          <p className="text-[#C4A882] leading-relaxed">{t('todayB', N)}</p>
        </div>

        {/* Sources. The citations stay in their original languages on purpose. */}
        <div className="bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-6">
          <h2 className="font-bold text-[#F5E8CC] mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem' }}>
            {t('srcTitle')}
          </h2>
          <p className="text-xs text-[#8C7355] mb-4">{t('srcIntro')}</p>
          <ol className="space-y-2 list-decimal ps-5">
            {BIBLIOGRAPHY.map(k => (
              <li key={k} className="text-xs text-[#C4A882] leading-relaxed">
                {SOURCES[k].url
                  ? <a href={SOURCES[k].url} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#F5E8CC]">{SOURCES[k].citation}</a>
                  : SOURCES[k].citation}
              </li>
            ))}
          </ol>
          <p className="text-xs text-[#8C7355] mt-4">
            {t.rich('srcFooter', {
              link: () => <Link href="/sources" className="underline hover:text-[#F5E8CC]">{t('srcLinkText')}</Link>,
            })}
          </p>
        </div>

        {/* CTA */}
        <div className="bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-8 text-center">
          <p className="text-[#E8A33D] text-xs font-bold uppercase tracking-widest mb-2">{t('ctaKicker')}</p>
          <h2 className="text-[#F5E8CC] font-bold text-2xl mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('ctaTitle')}
          </h2>
          <p className="text-[#C4A882] text-sm mb-5 max-w-md mx-auto">
            {paymentsEnabled ? t('ctaBodyPaid') : t('ctaBodyFree')}
          </p>
          <LeadButton ticketType="skip-the-line" className="inline-flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            {t('ctaBtn')} <ArrowRight size={16} />
          </LeadButton>
        </div>
      </div>
    </div>
  );
}
