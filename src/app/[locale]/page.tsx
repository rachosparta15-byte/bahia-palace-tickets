export const revalidate = 60;

import { Hero } from '@/components/homepage/Hero';
import { StorySection } from '@/components/homepage/StorySection';
import { PalaceStatStrip } from '@/components/homepage/PalaceStatStrip';
import { HighlightsSection } from '@/components/homepage/HighlightsSection';
import { PracticalBar } from '@/components/homepage/PracticalBar';
import { VisitingToday } from '@/components/homepage/VisitingToday';
import { TrustStrip } from '@/components/homepage/TrustStrip';
import { TicketSection } from '@/components/homepage/TicketSection';
import { TicketOptions } from '@/components/homepage/TicketOptions';
import { WhyBookAhead } from '@/components/homepage/WhyBookAhead';
import { WhyBookUs } from '@/components/homepage/WhyBookUs';
import { ReviewsCarousel } from '@/components/homepage/ReviewsCarousel';
import { FaqSection } from '@/components/homepage/FaqSection';
import { ScamBanner } from '@/components/homepage/ScamBanner';
import { FinalCTA } from '@/components/homepage/FinalCTA';
import { NearbyMonuments } from '@/components/homepage/NearbyMonuments';
import { BlogPreview } from '@/components/homepage/BlogPreview';
import { JsonLd } from '@/components/seo/JsonLd';
import { BASE, buildAlternates, buildOG, DIGITAL_TICKET_OFFER_EXTRAS } from '@/lib/seo';
import { getTranslations } from 'next-intl/server';
import {
  VISITOR_PACK_PRICE_EUR_CENTS,
  formatEURAmount,
} from '@/config/pricing';
import { getPublicPaymentsFlags } from '@/lib/payments/guard';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string }>;
}

/*
 * These descriptions are what a searcher reads before deciding to click, so
 * they are held to three rules the old ones broke:
 *
 * 1. UNDER ~155 CHARACTERS. Google truncates around 160 and the cut lands
 *    mid-word. The English one ran to 179, the German to 209 — the German
 *    result ended on "Öffnungszeiten und Pr…", so the last thing a searcher
 *    saw was a broken word instead of a reason to click.
 *
 * 2. NO PRODUCTS THAT DO NOT EXIST. Every one of these promised a comparison
 *    of "skip-the-line, guided and private tour tickets". guided-tour,
 *    private-tour and combo-saadian-tombs are all 307s to skip-the-line (see
 *    COMING_SOON_SLUGS in next.config.mjs) — there is one product and nothing
 *    to compare. That is the expensive kind of wrong: the click is paid for,
 *    the visitor finds a different page from the one advertised, and Google
 *    learns the page does not answer the query.
 *
 * 3. THE PRICE IS IN IT. On a ticket result the price is the strongest reason
 *    to click, and leaving it out means competing on adjectives. It stays
 *    €11.99 — the amount actually charged — even while the page advertises the
 *    teaser: a search result is a promise made to someone who has not seen the
 *    page yet, and it also has to agree with the JSON-LD offer and the card
 *    statement.
 */
const HOME_META: Record<string, { title: string; description: string }> = {
  en: {
    title: `Bahia Palace Marrakech 2026 — Hours, Prices & Visitor Guide`,
    description: `Bahia Palace entry is 100 MAD (~€9). Open daily 9:00–17:00. Prices for adults and children, how to skip the 45-minute queue, and what to see inside.`,
  },
  fr: {
    title: `Palais Bahia Marrakech 2026 — Horaires, Tarifs & Guide`,
    description: `Entrée Palais Bahia : 100 MAD (~9 €). Ouvert 9h–17h tous les jours. Tarifs adultes et enfants, et comment éviter 45 minutes de file.`,
  },
  es: {
    title: `Palacio Bahía Marrakech 2026 — Horarios, Precios y Guía`,
    description: `Entrada al Palacio Bahía: 100 MAD (~9 €). Abierto a diario de 9:00 a 17:00. Precios para adultos y niños, y cómo evitar 45 min de cola.`,
  },
  de: {
    title: `Bahia Palast Marrakesch 2026 — Öffnungszeiten & Preise`,
    description: `Eintritt Bahia-Palast: 100 MAD (~9 €). Täglich 9–17 Uhr. Preise für Erwachsene und Kinder, und wie Sie 45 Minuten Warteschlange vermeiden.`,
  },
  ar: {
    title: `قصر الباهية مراكش 2026 — المواعيد والأسعار ودليل الزيارة`,
    description: `كل ما تحتاجه لزيارة قصر الباهية في مراكش: الدخول 100 درهم (30 درهماً للمغاربة والمقيمين)، المواعيد يومياً من 9:00 إلى 5:00، وكيف تتفادى طابور شبّاك التذاكر.`,
  },
  pt: {
    title: `Palácio da Bahia Marraquexe 2026 — Horários e Preços`,
    description: `Tudo para visitar o Palácio da Bahia em Marraquexe: entrada oficial de 100 MAD, aberto todos os dias das 9:00 às 17:00, e como evitar a fila da bilheteira.`,
  },
  it: {
    title: `Palazzo Bahia Marrakech 2026 — Orari, Prezzi e Guida`,
    description: `Ingresso Palazzo Bahia: 100 MAD (~9 €). Aperto 9:00–17:00 ogni giorno. Prezzi per adulti e bambini, e come evitare 45 min di fila.`,
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = HOME_META[locale] ?? HOME_META.en;

  return {
    title: meta.title,
    description: meta.description,
    alternates: buildAlternates(locale, ''),
    openGraph: buildOG(meta.title, meta.description, locale, ''),
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [`${BASE}/og-image.jpg`],
    },
  };
}

/*
 * The skip-the-line product, without a campaign: VisitingToday sets one per
 * visitor so the knowledge-panel traffic can be told apart from the rest.
 */
const SKIP_THE_LINE_TODAY_URL =
  'https://www.viator.com/tours/Marrakech/Marrakech-Bahia-Palace-Skip-the-Line-Ticket-With-Audio-Guide/d5408-5670595P2?pid=P00316815&mcid=42383&medium=link';

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  // Drives which offer the structured data advertises — see `offers` below.
  const { enabled: paymentsEnabled } = getPublicPaymentsFlags();

  const tf   = await getTranslations({ locale, namespace: 'faq' });
  const tVisit = await getTranslations({ locale, namespace: 'visitingToday' });
  const faqs = tf.raw('items') as Array<{ question: string; answer: string }>;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };

  const touristAttraction = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: 'Bahia Palace',
    description: 'A stunning 19th-century Moroccan palace in Marrakech, showcasing exquisite Islamic architecture, zellige tilework, and tranquil gardens.',
    url: `${BASE}/${locale}`,
    image: `${BASE}/og-image.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rue Riad Zitoun el Jedid',
      addressLocality: 'Marrakech',
      addressRegion: 'Marrakech-Safi',
      postalCode: '40000',
      addressCountry: 'MA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.6226,
      longitude: -7.9842,
    },
    openingHoursSpecification: [
      /*
       * Nine to five, every day, Friday included.
       *
       * This listed Friday as 09:00-12:00 and 14:00-17:00, which told Google
       * the palace shuts over Friday lunchtime. The Ministry of Culture, which
       * runs it, publishes "Horaires de visite: 9h-17h" with no Friday
       * exception at all:
       *   https://e-services.minculture.gov.ma/en/tickets/palais-bahia
       *   read 2026-09-25
       *
       * Google shows these hours beside the result and in the knowledge panel,
       * so the old entry turned away visitors searching on the busiest day of
       * the week.
       */
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '09:00', closes: '17:00' },
    ],
    // Structured data must advertise the price a visitor can actually pay —
    // this is what Google shows in search results. When the pack is live it
    // IS the offer; quoting the retired $10 product would put a price in
    // search results that no button on the site leads to.
    offers: [
      paymentsEnabled
        ? {
            '@type': 'Offer',
            name: 'Complete Visitor Pack — official entry ticket + audio guide',
            // Must match the currency actually charged at checkout — a
            // structured-data price in the wrong currency is a rich-result
            // penalty and, worse, a price the visitor never agreed to.
            price: formatEURAmount(VISITOR_PACK_PRICE_EUR_CENTS),
            priceCurrency: 'EUR',
            url: `${BASE}/${locale}/visitor-pack`,
            availability: 'https://schema.org/InStock',
            ...DIGITAL_TICKET_OFFER_EXTRAS,
          }
        : {
            // Booked and charged by Viator, on the owner's instruction — see
            // SKIP_THE_LINE_VIATOR_URL in TicketCards.tsx and its match in
            // TicketOptions.tsx, both of which now send every skip-the-line
            // click here instead of to /tickets/skip-the-line. Structured
            // data has to name the actual seller and the actual price: this
            // is a resold offer, not ours, so DIGITAL_TICKET_OFFER_EXTRAS
            // (our own shipping/return terms) does not apply — Viator's
            // do, and we don't control or state them here.
            '@type': 'Offer',
            name: 'Skip-the-Line Entry — with audio guide',
            price: '13.00',
            priceCurrency: 'USD',
            url: 'https://www.viator.com/tours/Marrakech/Marrakech-Bahia-Palace-Skip-the-Line-Ticket-With-Audio-Guide/d5408-5670595P2?pid=P00316815&mcid=42383&medium=link&campaign=visitbahiapalace-seo',
            availability: 'https://schema.org/InStock',
            seller: { '@type': 'Organization', name: 'Viator' },
          },
    ],
    touristType: ['History enthusiasts', 'Architecture lovers', 'Cultural tourists'],
  };

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Visit Bahia Palace — Tickets & Visitor Guide',
    description: HOME_META[locale]?.description ?? HOME_META.en.description,
    url: `${BASE}/${locale}`,
    image: `${BASE}/og-image.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rue Riad Zitoun el Jedid',
      addressLocality: 'Marrakech',
      addressRegion: 'Marrakech-Safi',
      postalCode: '40000',
      addressCountry: 'MA',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 31.6226, longitude: -7.9842 },
    priceRange: '$$',
    openingHoursSpecification: [
      /*
       * Nine to five, every day, Friday included.
       *
       * This listed Friday as 09:00-12:00 and 14:00-17:00, which told Google
       * the palace shuts over Friday lunchtime. The Ministry of Culture, which
       * runs it, publishes "Horaires de visite: 9h-17h" with no Friday
       * exception at all:
       *   https://e-services.minculture.gov.ma/en/tickets/palais-bahia
       *   read 2026-09-25
       *
       * Google shows these hours beside the result and in the knowledge panel,
       * so the old entry turned away visitors searching on the busiest day of
       * the week.
       */
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '09:00', closes: '17:00' },
    ],
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Bahia Palace Tickets', item: `${BASE}/${locale}` },
    ],
  };

  return (
    <>
      <JsonLd data={touristAttraction} />
      <JsonLd data={localBusiness} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumb} />
      <Hero />
      {/*
        Directly under the hero, so it is the first thing after the headline
        on a phone — which is the device the knowledge panel's "Website"
        button opens on, for a visitor who is usually already in Marrakech.

        Under, not above: the <h1> lives in Hero and stays the first heading
        in document order. If this ever needs to appear higher on mobile,
        that is CSS order in the parent, never a move in the markup.
      */}
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <VisitingToday
          locale={locale}
          strings={{
            openNow: tVisit('openNow'),
            closingSoon: tVisit('closingSoon'),
            afterLastEntry: tVisit('afterLastEntry'),
            closedNow: tVisit('closedNow'),
            opensAt: tVisit('opensAt'),
            lastEntry: tVisit('lastEntry'),
            timeLeft: tVisit('timeLeft'),
            queueNote: tVisit('queueNote'),
            cta: tVisit('cta'),
            directions: tVisit('directions'),
          }}
          ticketUrl={SKIP_THE_LINE_TODAY_URL}
        />
      </div>
      <StorySection />
      <PalaceStatStrip />
      <HighlightsSection />
      <PracticalBar />
      <TrustStrip />
      <TicketSection />
      <TicketOptions />
      <WhyBookAhead />
      <WhyBookUs />
      <ReviewsCarousel />
      {/*
        * <ArticleTicker /> used to sit here, directly above this.
        *
        * Both read the same getBlogPosts() static array — two posts in English
        * — so the scrolling strip and the card grid below it advertised the
        * same two articles to the same visitor, one after the other. The strip
        * additionally rendered its list twice for the marquee wrap, which made
        * it the same two articles three times on one page.
        *
        * BlogPreview is the one that survives: it carries the excerpt, the
        * category and the read time, i.e. a reason to click. The ticker carried
        * the title and nothing else.
        *
        * If the home page is ever meant to surface more than three articles,
        * the fix is a wider source for BlogPreview, not a second component
        * showing the same rows in a different shape.
        */}
      <BlogPreview />
      <FaqSection />
      <ScamBanner />
      <NearbyMonuments />
      <FinalCTA />
    </>
  );
}
