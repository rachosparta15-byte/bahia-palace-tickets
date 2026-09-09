import { LeadButton } from '@/components/layout/LeadButton';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { Link } from '@/i18n/navigation';
import { buildAlternates, buildOG, buildBreadcrumbSchema, BASE } from '@/lib/seo';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getPublicPaymentsFlags } from '@/lib/payments/guard';
import {
  ARCHITECT, AREA_BUILT, AREA_TOTAL, BA_AHMED_BIRTH, BA_AHMED_DEATH, BIBLIOGRAPHY,
  CRAFTSMEN, EXPANSION, FOUNDED, LINEAGE, MATERIALS, NAME_ORIGIN, PROTECTORATE,
  ROOMS, SITE_ASSEMBLY, SOURCES, TIMELINE, UNESCO_STATUS, VISITORS,
} from '@/lib/history/facts';

export const revalidate = 86400;

/*
 * This page stopped competing with /blog/bahia-palace-history.
 *
 * Both were titled "Bahia Palace History". The article wins that word and it
 * is not close: twenty internal links point at it, none point here, and it
 * runs to 2,600 words with Article and FAQ schema. The whole site was already
 * voting for the article while this page kept its hand up for the same query.
 *
 * So this one takes the question the article's title does not ask. "Who was Ba
 * Ahmed" is a person, not a building — a different search, with a different
 * intent, answered by the same page content, which was always mostly about
 * him. Nothing on the page changes; it stops claiming a word it was losing.
 */
/*
 * These descriptions used to call Ba Ahmed a slave's son and date his palace
 * "between 1866 and 1900". Both were wrong, and the second contradicted this
 * page's own body text, which said 1859. The enslaved ancestor is his
 * grandfather; 1866-67 is his father's dated inscription; Ba Ahmed's own phase
 * runs 1894-1900. Every claim now traces to src/lib/history/facts.ts.
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
    author: { '@type': 'Organization', name: 'Visit Bahia Palace' },
    publisher: { '@type': 'Organization', name: 'Visit Bahia Palace', logo: { '@type': 'ImageObject', url: `${BASE}/og-image.jpg` } },
    about: {
      '@type': 'TouristAttraction',
      name: 'Bahia Palace',
      // 1866-67 is the dated inscription in the garden chambers. The 1859 that
      // stood here was the accession year of Muhammad IV, not a building date.
      foundingDate: '1866',
      address: { '@type': 'PostalAddress', addressLocality: 'Marrakech', addressCountry: 'MA' },
    },
    citation: BIBLIOGRAPHY.map(k => SOURCES[k].citation),
  };
}

export default async function HistoryPage({ params }: Props) {
  const { locale } = await params;
  const { enabled: paymentsEnabled } = getPublicPaymentsFlags();
  return (
    <div className="min-h-screen bg-[#1C1108]">
      <JsonLd data={getHistorySchema(locale)} />
      <JsonLd data={buildBreadcrumbSchema(locale, [{ name: 'Home', path: '' }, { name: 'History' }])} />

      {/* Hero */}
      <div className="relative h-72 md:h-96">
        <Image src="/images/gallery/bahia-palace-octagonal-cedar-ceiling-carved-wood.jpg" alt="Bahia Palace Marrakech ornate painted cedar wood ceiling — 19th century Moroccan architecture" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-[#1C1108]/90" />
        <div className="absolute inset-0 flex flex-col justify-between px-6 py-8 md:px-10 max-w-4xl mx-auto w-full left-0 right-0">
          <Breadcrumb variant="light" items={[{ label: 'Home', href: '/' }, { label: 'History' }]} />
          <div>
            <span className="inline-block bg-[#C4452D] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">Est. 1866–1900</span>
            <h1 className="text-white font-bold leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
              Bahia Palace History: Ba Ahmed & The Story Behind the Palace
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* Introduction */}
        <div className="prose prose-lg max-w-none">
          <p className="text-[#C4A882] leading-relaxed text-lg">
            <strong className="text-[#F5E8CC]">Bahia Palace</strong> is not one building but two, forty years apart. The garden chambers carry an inscription dating them to <strong className="text-[#F5E8CC]">{FOUNDED.value}</strong>, when the chamberlain Si Moussa built himself a house here. His son Ba Ahmed turned that house into the palace visitors walk through today between <strong className="text-[#F5E8CC]">{EXPANSION.value}</strong>, in the six years he governed Morocco in the name of a teenage sultan.
          </p>
          <p className="text-[#C4A882] leading-relaxed mt-4">
            {NAME_ORIGIN.value} {NAME_ORIGIN.contested}
          </p>
          {/*
            * A dated inscription is stronger evidence than a repeated number,
            * so the page leads with it and says whose reading it is. Every
            * figure below carries the same treatment.
            */}
          <p className="text-xs text-[#8C7355] mt-4 italic">
            Dates and figures on this page are sourced individually and listed in full under Sources.
          </p>
        </div>

        {/* Who Built It */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#251A0F] rounded-2xl border border-[rgba(232,163,61,0.13)] p-6">
            <h2 className="font-bold text-[#F5E8CC] mb-3" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem' }}>
              Who Built Bahia Palace?
            </h2>
            {/*
              * Three corrections live in this block. Si Moussa was hajib to
              * Muhammad IV, not his grand vizier. Ba Ahmed did not inherit the
              * vizierate from his father; he took it in 1894. And the "over
              * 2,000 artisans" that stood here had no source and contradicted
              * the site's own history article. It is gone rather than replaced
              * with another number nobody can check.
              */}
            <p className="text-sm text-[#C4A882] leading-relaxed mb-3">
              The palace was built in two phases. <strong className="text-[#F5E8CC]">Si Moussa</strong>, chamberlain to Sultan Muhammad IV and later grand vizier under Hassan I, built the first house on the site. His son <strong className="text-[#F5E8CC]">Ba Ahmed (Ahmed ibn Moussa)</strong> expanded it between {EXPANSION.value}.
            </p>
            <p className="text-sm text-[#C4A882] leading-relaxed mb-3">
              Ba Ahmed did not inherit his father&rsquo;s office. He served as hajib to Hassan I from 1879, and when the sultan died on campaign in 1894 he installed the fourteen-year-old Abdelaziz over his elder brothers and governed in his place until his own death.
            </p>
            {/*
              * The internet's version is "Ba Ahmed, son of a slave". It is a
              * generation out, and the accurate version is the better story.
              */}
            <p className="text-sm text-[#C4A882] leading-relaxed mb-3">
              {LINEAGE.value}
            </p>
            <p className="text-sm text-[#C4A882] leading-relaxed">
              {CRAFTSMEN.value} {SITE_ASSEMBLY.value.charAt(0).toUpperCase() + SITE_ASSEMBLY.value.slice(1)}.
            </p>
          </div>
          <div className="bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-6 text-white">
            <h3 className="font-bold text-[#F5E8CC] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem' }}>Fast Facts</h3>
            {/*
              * "8 hectares, 150 rooms" on one line was the worst number on the
              * site: it reads as eight hectares of building, which is four
              * times the truth. The two figures count different things and are
              * now separated and labelled. Each row carries its attribution.
              */}
            <div className="space-y-2.5">
              {[
                ['First phase', FOUNDED.value, FOUNDED.source],
                ['Ba Ahmed phase', EXPANSION.value, EXPANSION.source],
                ['Built area', AREA_BUILT.value, AREA_BUILT.source],
                ['Grounds', AREA_TOTAL.value, AREA_TOTAL.source],
                ['Rooms', ROOMS.value, ROOMS.source],
                ['Architect', ARCHITECT.value, ARCHITECT.source],
                ['Ba Ahmed', `${BA_AHMED_BIRTH.value}, died ${BA_AHMED_DEATH.value}`, BA_AHMED_BIRTH.source],
                ['Location', 'Rue Riad Zitoun el Jedid, Marrakech', 'Moroccan Ministry of Culture'],
              ].map(([key, val, src]) => (
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
            Bahia Palace Timeline: From Construction to Heritage Site
          </h2>
          <div className="relative">
            <div className="absolute start-6 top-0 bottom-0 w-0.5 bg-[rgba(232,163,61,0.25)]" />
            <div className="space-y-6">
              {TIMELINE.map(({ year, title, text, ref }) => (
                <div key={year} className="ps-14 relative">
                  <div className="absolute start-3.5 top-1.5 w-5 h-5 rounded-full bg-[#C4452D] border-2 border-[#1C1108] shadow" />
                  <span className="text-xs font-bold text-[#C4452D] uppercase tracking-widest">{year}</span>
                  <h3 className="font-bold text-[#F5E8CC] mt-0.5 mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem' }}>{title}</h3>
                  <p className="text-sm text-[#C4A882] leading-relaxed">{text}</p>
                  <p className="text-[10px] text-[#8C7355] mt-1.5">{SOURCES[ref].citation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Architecture */}
        <div>
          <h2 className="text-2xl font-bold text-[#F5E8CC] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Bahia Palace Architecture: Moorish & Moroccan Craftsmanship
          </h2>
          {/*
            * This paragraph used to gloss the carved plasterwork as "tadelakt".
            * Tadelakt is a polished waterproof lime render for hammams and
            * basins; the carved arabesque panels are gebs, hand-cut gypsum.
            * Different trade, different material. The craft names below now
            * come from the fact base so no page invents its own vocabulary.
            */}
          <p className="text-[#C4A882] leading-relaxed mb-4">
            The decoration is Moroccan work in a style with deep Andalusi roots, executed by <strong className="text-[#F5E8CC]">Fez-trained maalmin</strong>. The craftsmen were Moroccan, not imported from al-Andalus, which had ended four centuries earlier. Four trades account for almost everything a visitor sees.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: MATERIALS[0].label, desc: MATERIALS[0].desc, img: '/images/gallery/bahia-palace-blue-door-courtyard.webp',      alt: 'Blue-painted door and zellige-tiled courtyard at Bahia Palace, Marrakech' },
              { label: MATERIALS[2].label, desc: MATERIALS[2].desc, img: '/images/gallery/bahia-palace-brass-chandelier-ceiling.webp', alt: 'Brass chandelier beneath a painted wooden ceiling, Bahia Palace Marrakech' },
              { label: MATERIALS[1].label, desc: MATERIALS[1].desc, img: '/images/gallery/bahia-palace-carved-stucco-archway.webp',    alt: 'Finely carved gebs plaster archway and zellige walls inside Bahia Palace, Marrakech' },
              { label: MATERIALS[3].label, desc: MATERIALS[3].desc, img: null,                                                          alt: null },
            ].map(({ label, desc, img, alt }) => (
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

        {/* Status today, and the numbers people ask for */}
        <div>
          <h2 className="text-2xl font-bold text-[#F5E8CC] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            The Palace Today
          </h2>
          <p className="text-[#C4A882] leading-relaxed mb-3">{UNESCO_STATUS.value} {PROTECTORATE.value}</p>
          {/*
            * "Over 500,000 visitors annually" sat here unsourced. The only
            * figure that can be pointed at is a four-month count, so that is
            * what the page states, with the gap named rather than filled.
            */}
          <p className="text-[#C4A882] leading-relaxed">
            Attendance: <strong className="text-[#F5E8CC]">{VISITORS.value}</strong>. {VISITORS.contested}
          </p>
        </div>

        {/* Sources */}
        <div className="bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-6">
          <h2 className="font-bold text-[#F5E8CC] mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem' }}>
            Sources
          </h2>
          <p className="text-xs text-[#8C7355] mb-4">
            The palace has a real scholarly literature. These are the works this page draws on, not a link to an encyclopedia summary of them.
          </p>
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
            Where these sources disagree, the disagreement is stated rather than resolved silently. The full bibliography, the open questions and the correction policy are on the{' '}
            <Link href="/sources" className="underline hover:text-[#F5E8CC]">sources page</Link>.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-8 text-center">
          <p className="text-[#E8A33D] text-xs font-bold uppercase tracking-widest mb-2">Experience it in person</p>
          <h2 className="text-[#F5E8CC] font-bold text-2xl mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Visit Bahia Palace — Book Skip-the-Line Tickets
          </h2>
          <p className="text-[#C4A882] text-sm mb-5 max-w-md mx-auto">
            {paymentsEnabled
              ? 'Compare your options and book with us — or buy the official ticket yourself on the Ministry portal.'
              : 'Compare your options, then complete your purchase directly on the official ticket portal.'}
          </p>
          <LeadButton ticketType="skip-the-line" className="inline-flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Book Bahia Palace Tickets Online <ArrowRight size={16} />
          </LeadButton>
        </div>
      </div>
    </div>
  );
}
