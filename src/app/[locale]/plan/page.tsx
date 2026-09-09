import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { Link } from '@/i18n/navigation';
import { PalacePlan } from '@/components/plan/PalacePlan';
import { buildAlternates, buildOG, buildBreadcrumbSchema, BASE } from '@/lib/seo';
import { SPACES, totalMinutes } from '@/lib/history/plan';
import { AREA_BUILT, AREA_TOTAL, ROOMS, BIBLIOGRAPHY, SOURCES } from '@/lib/history/facts';
import { MapPin, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 86400;

/*
 * Why this page exists.
 *
 * The room-by-room guide runs to about 1,800 words describing seven spaces and
 * contains no drawing of any kind. A reader finishes it knowing what the harem
 * looked like and still unable to say whether it comes before or after the
 * great court. That is the gap between an article about a building and a
 * reference on one.
 *
 * Deliberately NOT on this page: Google Maps. A map answers "where is the
 * palace in Marrakech", which /location already answers well. This page
 * answers "where am I inside it". Putting both on one screen makes each
 * harder to read, so getting-there is a link out, not an embed.
 */

const TITLE = 'Bahia Palace Plan: The Seven Spaces, in Order';
const DESCRIPTION =
  'An interactive schematic of the Bahia Palace visitor circuit. What each space is, what rewards a slower look, what happened there, and how long to spend.';

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: buildAlternates(locale, '/plan'),
    openGraph: buildOG(TITLE, DESCRIPTION, locale, '/plan'),
  };
}

export default async function PlanPage({ params }: Props) {
  const { locale } = await params;
  const [lo, hi] = totalMinutes();

  /* An ItemList of the circuit: the one part of this page a search engine or
   * an assistant can usefully lift, since the diagram itself is not text. */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: TITLE,
    description: DESCRIPTION,
    url: `${BASE}/${locale}/plan`,
    numberOfItems: SPACES.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: SPACES.map(s => ({
      '@type': 'ListItem',
      position: s.n,
      name: s.name,
      description: s.summary,
    })),
  };

  return (
    <div className="min-h-screen bg-[#1C1108]">
      <JsonLd data={schema} />
      <JsonLd data={buildBreadcrumbSchema(locale, [{ name: 'Home', path: '' }, { name: 'Plan' }])} />

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">

        <div className="max-w-3xl">
          <Breadcrumb variant="light" items={[{ label: 'Home', href: '/' }, { label: 'Plan' }]} />
          <h1
            className="text-[#F5E8CC] font-bold leading-tight mt-6"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.9rem, 4vw, 2.9rem)' }}
          >
            The Palace, in Order
          </h1>
          <p className="text-[#C4A882] leading-relaxed text-lg mt-4">
            Bahia Palace was built in phases across four decades with no master plan, so it has no
            symmetry and no single correct route. Most visitors walk a vague loop and leave unsure
            whether they saw everything. Seven spaces, in the order the circuit takes you.
          </p>
          <p className="text-[#C4A882] leading-relaxed mt-3">
            Tap any block to read what it is, what most people walk past, and what happened there.
          </p>
        </div>

        <PalacePlan />

        {/* The three numbers people arrive wanting, each labelled with what it counts. */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            ['Time for the circuit', `${lo}–${hi} min`, 'Sum of the per-space ranges above'],
            ['Built palace', AREA_BUILT.value, AREA_BUILT.source],
            ['Rooms', ROOMS.value, ROOMS.source],
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
            What this drawing is
          </h2>
          <p className="text-sm text-[#C4A882] leading-relaxed mb-3">
            It is a schematic of sequence and adjacency. It is accurate about the order you meet the
            spaces and which ones adjoin. It is <strong className="text-[#F5E8CC]">not</strong> a measured
            plan: the blocks are not scaled, and their proportions are not the real footprints.
          </p>
          <p className="text-sm text-[#C4A882] leading-relaxed">
            Measured plans of the palace were published by Gaston Deverdun in 1959. Drawing something
            that merely looked surveyed would be inventing evidence, so this page does not. {AREA_TOTAL.value.charAt(0).toUpperCase() + AREA_TOTAL.value.slice(1)}, of
            which the built palace is {AREA_BUILT.value}.
          </p>
        </div>

        {/* Getting there belongs to the other page, and says so. */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/location"
            className="inline-flex items-center gap-2 bg-[#251A0F] border border-[rgba(232,163,61,0.2)] text-[#F5E8CC] font-semibold px-6 py-3 rounded-xl hover:border-[rgba(232,163,61,0.45)] transition-colors"
          >
            <MapPin size={16} /> Getting there, and the map
          </Link>
          <Link
            href="/blog/bahia-palace-room-by-room-guide"
            className="inline-flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            The full room-by-room guide <ArrowRight size={16} />
          </Link>
        </div>

        {/* Sources */}
        <div className="max-w-3xl">
          <h2 className="text-xl font-bold text-[#F5E8CC] mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Sources
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
            Full bibliography and the open questions: <Link href="/sources" className="underline hover:text-[#F5E8CC]">sources page</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
