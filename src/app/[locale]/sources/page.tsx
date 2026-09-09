import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { Link } from '@/i18n/navigation';
import { buildAlternates, buildOG, buildBreadcrumbSchema, BASE } from '@/lib/seo';
import type { Metadata } from 'next';
import {
  BIBLIOGRAPHY, SOURCES, BA_AHMED_BIRTH, FOUNDED, NAME_ORIGIN, SI_MOUSSA_ROLE, VISITORS,
} from '@/lib/history/facts';

export const revalidate = 86400;

/*
 * A site becomes a reference by being checkable, not by sounding certain.
 *
 * This page exists because the alternative is what the site used to do:
 * assert a date, a headcount and a visitor total in seven languages with no
 * way for a reader to test any of them, and cite an encyclopedia entry that
 * did not exist. Publishing the bibliography, naming the four points where
 * the sources genuinely disagree, and printing an address for corrections
 * costs one page and is the difference between a travel blog and something a
 * researcher can cite.
 *
 * It is deliberately not translated per locale yet: a half-translated
 * bibliography is worse than an English one, since the citations themselves
 * are French and English titles. The prose should be localised when there is
 * a translator to do it properly.
 */

const TITLE = 'Sources & Corrections — How This Site Establishes Its Facts';
const DESCRIPTION =
  'The scholarly sources behind every date and figure on visitbahiapalace.com, the four points where those sources disagree, and how to report an error.';

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: buildAlternates(locale, '/sources'),
    openGraph: buildOG(TITLE, DESCRIPTION, locale, '/sources'),
  };
}

/* The disputes worth naming. Each is a real split in the literature, not a
 * hedge added for safety. */
const DISPUTED = [
  {
    q: 'When did building start?',
    a: FOUNDED.value,
    detail:
      'Many sites say 1859. That is the year Sultan Muhammad IV took the throne, not a construction date. The two chambers flanking the garden carry an inscription dating them to 1866–67, which is the earliest firm evidence the building offers about itself.',
    who: FOUNDED.source,
  },
  {
    q: 'Was Ba Ahmed the son of a slave?',
    a: 'No — the grandson of one.',
    detail:
      'His grandfather was owned by Sultan Moulay Slimane and rose to be his chamberlain. His father Si Moussa was already a court officer when Ba Ahmed was born, so the widely repeated "slave\'s son" is a generation out.',
    who: BA_AHMED_BIRTH.source,
  },
  {
    q: 'Where does the name come from?',
    a: NAME_ORIGIN.value,
    detail: NAME_ORIGIN.contested ?? '',
    who: NAME_ORIGIN.source,
  },
  {
    q: 'When did Si Moussa die?',
    a: 'Unresolved.',
    detail:
      SI_MOUSSA_ROLE.contested ??
      'The sources do not agree. This site does not pick one.',
    who: SI_MOUSSA_ROLE.source,
  },
  {
    q: 'How many people visit each year?',
    a: VISITORS.value,
    detail: VISITORS.contested ?? '',
    who: VISITORS.source,
  },
];

export default async function SourcesPage({ params }: Props) {
  const { locale } = await params;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: TITLE,
    description: DESCRIPTION,
    url: `${BASE}/${locale}/sources`,
    publisher: { '@type': 'Organization', name: 'Visit Bahia Palace', url: BASE },
    citation: BIBLIOGRAPHY.map(k => SOURCES[k].citation),
  };

  return (
    <div className="min-h-screen bg-[#1C1108]">
      <JsonLd data={schema} />
      <JsonLd data={buildBreadcrumbSchema(locale, [{ name: 'Home', path: '' }, { name: 'Sources' }])} />

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">
        <div>
          <Breadcrumb variant="light" items={[{ label: 'Home', href: '/' }, { label: 'Sources' }]} />
          <h1
            className="text-[#F5E8CC] font-bold leading-tight mt-6"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.9rem, 4vw, 2.9rem)' }}
          >
            Sources &amp; Corrections
          </h1>
          <p className="text-[#C4A882] leading-relaxed text-lg mt-4">
            Most of what circulates online about Bahia Palace traces back to the same handful of unsourced tourist pages, copying each other&rsquo;s dates. This page lists what this site reads instead, and where those readings are uncertain.
          </p>
        </div>

        {/* Bibliography */}
        <section>
          <h2 className="text-2xl font-bold text-[#F5E8CC] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Works cited
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
          <p className="text-xs text-[#8C7355] mt-4 leading-relaxed">
            Deverdun remains the standard survey of Marrakesh before 1912 and is the source for the palace&rsquo;s dated inscriptions. Wilbaux is the reference on how the medina&rsquo;s built fabric formed. Ghachem-Benkirane and Saharoff document the interiors.
          </p>
        </section>

        {/* Where the sources disagree */}
        <section>
          <h2 className="text-2xl font-bold text-[#F5E8CC] mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Where the sources disagree
          </h2>
          <p className="text-sm text-[#C4A882] mb-6">
            These are stated as open rather than resolved in favour of whichever version reads better.
          </p>
          <div className="space-y-5">
            {DISPUTED.map(({ q, a, detail, who }) => (
              <div key={q} className="bg-[#251A0F] rounded-2xl border border-[rgba(232,163,61,0.13)] p-5">
                <h3 className="font-bold text-[#F5E8CC] mb-1.5" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem' }}>{q}</h3>
                <p className="text-sm font-semibold text-[#E8A33D] mb-2">{a}</p>
                <p className="text-sm text-[#C4A882] leading-relaxed">{detail}</p>
                <p className="text-[11px] text-[#8C7355] mt-2.5">{who}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Method */}
        <section>
          <h2 className="text-2xl font-bold text-[#F5E8CC] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            How facts get onto this site
          </h2>
          <ul className="space-y-3 text-sm text-[#C4A882] leading-relaxed list-disc ps-5">
            <li>Every date, measurement and name about the palace lives in one file and is rendered from it, so two pages cannot quietly disagree the way they used to.</li>
            <li>A dated inscription on the building outranks a figure repeated across travel sites, however many repeat it.</li>
            <li>A claim that cannot be traced to a named source is removed rather than rounded, softened, or attributed to a plausible-sounding authority.</li>
            <li>Where a number is an estimate, the page says so and names what is actually measured.</li>
            <li>First-hand observation is labelled as the author&rsquo;s own and never presented as documentary evidence. See the <Link href="/about/editorial" className="underline hover:text-[#F5E8CC]">editorial page</Link>.</li>
          </ul>
        </section>

        {/* Corrections */}
        <section className="bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-6">
          <h2 className="font-bold text-[#F5E8CC] mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem' }}>
            Found an error?
          </h2>
          <p className="text-sm text-[#C4A882] leading-relaxed">
            Corrections are welcome, particularly from historians, guides and archivists working on Marrakesh. Cite the source you are working from and the page it contradicts, and it will be checked and fixed.
          </p>
          <p className="text-sm text-[#E8A33D] mt-3 font-semibold">support@marrakechlocal.com</p>
        </section>
      </div>
    </div>
  );
}
