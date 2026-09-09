import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { Link } from '@/i18n/navigation';
import { PalacePlan } from '@/components/plan/PalacePlan';
import { buildAlternates, buildOG, buildBreadcrumbSchema, BASE } from '@/lib/seo';
import { SPACES, totalMinutes, type SpaceCopy, type PlanChrome } from '@/lib/history/plan';
import { BIBLIOGRAPHY, NAMES, NUMBERS, SOURCES } from '@/lib/history/facts';
import { getTranslations } from 'next-intl/server';
import { MapPin, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 86400;

/*
 * Why this page exists.
 *
 * The room-by-room guide runs to about 1,800 words describing seven spaces and
 * contains no drawing of any kind. A reader finishes it knowing what the
 * private apartments looked like and still unable to say whether they come
 * before or after the great court. That is the gap between an article about a
 * building and a reference on one.
 *
 * Deliberately NOT on this page: Google Maps. A map answers "where is the
 * palace in Marrakech", which /location already answers well. This page
 * answers "where am I inside it". Putting both on one screen makes each harder
 * to read, so getting-there is a link out, not an embed.
 *
 * All copy is translated here on the server and handed to the client component
 * as props, so the browser bundle carries no message catalogue.
 */

const META: Record<string, { title: string; description: string }> = {
  en: { title: 'Bahia Palace Plan: The Seven Spaces, in Order', description: 'An interactive schematic of the Bahia Palace visitor circuit. What each space is, what rewards a slower look, what happened there, and how long to spend.' },
  fr: { title: 'Plan du Palais Bahia : les sept espaces, dans l’ordre', description: 'Un schéma interactif du parcours de visite du palais Bahia. Ce qu’est chaque espace, ce qui mérite qu’on ralentisse, ce qui s’y est passé et combien de temps y consacrer.' },
  es: { title: 'Plano del Palacio Bahía: los siete espacios, en orden', description: 'Un esquema interactivo del recorrido del Palacio Bahía. Qué es cada espacio, qué merece una mirada lenta, qué ocurrió allí y cuánto tiempo dedicarle.' },
  de: { title: 'Plan des Bahia-Palasts: die sieben Räume der Reihe nach', description: 'Ein interaktives Schema des Besucherrundgangs im Bahia-Palast. Was jeder Raum ist, was genaueres Hinsehen lohnt, was dort geschah und wie lange man bleiben sollte.' },
  it: { title: 'Pianta del Palazzo Bahia: i sette spazi, in ordine', description: 'Uno schema interattivo del percorso di visita del Palazzo Bahia. Che cos’è ogni spazio, cosa merita uno sguardo lento, cosa vi accadde e quanto tempo dedicarvi.' },
  ar: { title: 'مخطط قصر الباهية: الفضاءات السبعة بالترتيب', description: 'مخطط تفاعلي لمسار زيارة قصر الباهية. ما هو كل فضاء، وما يستحق وقفة، وما جرى فيه، وكم من الوقت تمنحه.' },
  pt: { title: 'Planta do Palácio da Bahia: os sete espaços, por ordem', description: 'Um esquema interativo do percurso de visita do Palácio da Bahia. O que é cada espaço, o que merece um olhar demorado, o que ali aconteceu e quanto tempo dedicar.' },
};

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = META[locale] ?? META.en;
  return {
    title: meta.title,
    description: meta.description,
    alternates: buildAlternates(locale, '/plan'),
    openGraph: buildOG(meta.title, meta.description, locale, '/plan'),
  };
}

export default async function PlanPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('palacePlan');
  const meta = META[locale] ?? META.en;
  const [lo, hi] = totalMinutes();

  const nf = new Intl.NumberFormat(locale);
  const yr = (y: number) => nf.format(y).replace(/ | |,|\./g, '');
  const founded = `${yr(NUMBERS.foundedFrom)}–${yr(NUMBERS.foundedTo)}`;
  const marble = `${yr(NUMBERS.marbleFrom)}–${yr(NUMBERS.marbleTo)}`;
  const expansion = `${yr(NUMBERS.expansionFrom)}–${yr(NUMBERS.expansionTo)}`;
  // UTC-pinned: a server timezone must not move a historical date by a day.
  const death = new Intl.DateTimeFormat(locale, {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(NUMBERS.death));

  const N = {
    founded, marble, expansion, death,
    houses: nf.format(NUMBERS.housesAbsorbed),
    built: nf.format(NUMBERS.areaBuiltHa),
    total: nf.format(NUMBERS.areaTotalHa),
    sultanYoung: NAMES.sultanYoung,
  };

  /* Story sources, per space. Bibliographic strings stay untranslated. */
  const storySrc: Record<string, string | undefined> = {
    smallriad: SOURCES.deverdun.citation,
    grandriad: SOURCES.deverdun.citation,
    greatcourt: SOURCES.deverdun.citation,
    council: SOURCES.deverdun.citation,
    harem: undefined,
    gardens: SOURCES.minculture.citation,
    entrance: undefined,
  };

  const spaces: SpaceCopy[] = SPACES.map(s => {
    const k = s.key;
    const hasStory = k !== 'entrance';
    return {
      ...s,
      name: t(`s_${k}_name` as 's_entrance_name'),
      summary: t(`s_${k}_summary` as 's_entrance_summary'),
      notice: [0, 1, 2].map(i => t(`s_${k}_n${i}` as 's_entrance_n0')),
      story: hasStory ? t(`s_${k}_story` as 's_smallriad_story', N) : undefined,
      source: hasStory ? storySrc[k] : undefined,
      stopLabel: t('stopOf', { n: nf.format(s.n), total: nf.format(SPACES.length) }),
      minutesLabel: t('minutes', { lo: nf.format(s.minutes[0]), hi: nf.format(s.minutes[1]) }),
      minutesShortLabel: t('minutesShort', { lo: nf.format(s.minutes[0]), hi: nf.format(s.minutes[1]) }),
    };
  });

  const chrome: PlanChrome = {
    diagramLabel: t('diagramLabel'),
    legendRoute: t('legendRoute'),
    legendFountain: t('legendFountain'),
    legendRooms: t('legendRooms'),
    legendCourt: t('legendCourt'),
    schematicNote: t('schematicNote'),
    noticeTitle: t('noticeTitle'),
    storyTitle: t('storyTitle'),
    street: NAMES.street,
    totalTime: t('totalTime', { lo: nf.format(lo), hi: nf.format(hi) }),
  };

  /* An ItemList of the circuit: the one part a search engine or an assistant
   * can usefully lift, since the diagram itself is not text. */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: meta.title,
    description: meta.description,
    url: `${BASE}/${locale}/plan`,
    inLanguage: locale,
    numberOfItems: spaces.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: spaces.map(s => ({
      '@type': 'ListItem', position: s.n, name: s.name, description: s.summary,
    })),
  };

  return (
    <div className="min-h-screen bg-[#1C1108]">
      <JsonLd data={schema} />
      <JsonLd data={buildBreadcrumbSchema(locale, [{ name: t('crumbHome'), path: '' }, { name: t('crumbPlan') }])} />

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">

        <div className="max-w-3xl">
          <Breadcrumb variant="light" items={[{ label: t('crumbHome'), href: '/' }, { label: t('crumbPlan') }]} />
          <h1 className="text-[#F5E8CC] font-bold leading-tight mt-6"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.9rem, 4vw, 2.9rem)' }}>
            {t('h1')}
          </h1>
          <p className="text-[#C4A882] leading-relaxed text-lg mt-4">{t('introA')}</p>
          <p className="text-[#C4A882] leading-relaxed mt-3">{t('introB')}</p>
        </div>

        <PalacePlan spaces={spaces} chrome={chrome} />

        {/* The three numbers people arrive wanting, each labelled with what it counts. */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            [t('statTime'), t('minutes', { lo: nf.format(lo), hi: nf.format(hi) }), t('statTimeSrc')],
            [t('statBuilt'), t('valBuilt', { ha: nf.format(NUMBERS.areaBuiltHa) }), t('srcDeverdun')],
            [t('statRooms'), t('valRooms', { n: nf.format(NUMBERS.rooms) }), t('srcGhachem')],
          ].map(([k, v, src]) => (
            <div key={k} className="bg-[#251A0F] border border-[rgba(232,163,61,0.13)] rounded-2xl p-5">
              <p className="text-xs text-[#C4A882] mb-1">{k}</p>
              <p className="text-[#F5E8CC] font-bold text-lg" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{v}</p>
              <p className="text-[10px] text-[#8C7355] mt-1.5">{src}</p>
            </div>
          ))}
        </div>

        {/* Honesty note. This is the part that keeps the page citable. */}
        <div className="bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-6 max-w-3xl">
          <h2 className="font-bold text-[#F5E8CC] mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem' }}>
            {t('drawingTitle')}
          </h2>
          <p className="text-sm text-[#C4A882] leading-relaxed mb-3">{t('drawingA')}</p>
          <p className="text-sm text-[#C4A882] leading-relaxed">{t('drawingB', N)}</p>
        </div>

        {/* Getting there belongs to the other page, and says so. */}
        <div className="flex flex-wrap gap-3">
          <Link href="/location"
            className="inline-flex items-center gap-2 bg-[#251A0F] border border-[rgba(232,163,61,0.2)] text-[#F5E8CC] font-semibold px-6 py-3 rounded-xl hover:border-[rgba(232,163,61,0.45)] transition-colors">
            <MapPin size={16} /> {t('btnLocation')}
          </Link>
          <Link href="/blog/bahia-palace-room-by-room-guide"
            className="inline-flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            {t('btnRooms')} <ArrowRight size={16} />
          </Link>
        </div>

        {/* Sources */}
        <div className="max-w-3xl">
          <h2 className="text-xl font-bold text-[#F5E8CC] mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('srcTitle')}
          </h2>
          <ol className="space-y-2 list-decimal ps-5">
            {BIBLIOGRAPHY.map(k => (
              <li key={k} className="text-xs text-[#C4A882] leading-relaxed">
                {SOURCES[k].url
                  ? <a href={SOURCES[k].url} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#F5E8CC]">{SOURCES[k].citation}</a>
                  : SOURCES[k].citation}
              </li>
            ))}
          </ol>
          <p className="text-xs text-[#8C7355] mt-3">
            {t.rich('srcFooter', {
              link: chunks => <Link href="/sources" className="underline hover:text-[#F5E8CC]">{chunks}</Link>,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
