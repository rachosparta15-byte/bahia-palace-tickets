export const revalidate = 60;

import { Hero } from '@/components/homepage/Hero';
import { StorySection } from '@/components/homepage/StorySection';
import { PalaceStatStrip } from '@/components/homepage/PalaceStatStrip';
import { HighlightsSection } from '@/components/homepage/HighlightsSection';
import { PracticalBar } from '@/components/homepage/PracticalBar';
import { TrustStrip } from '@/components/homepage/TrustStrip';
import { TicketSection } from '@/components/homepage/TicketSection';
import { WhyBookUs } from '@/components/homepage/WhyBookUs';
import { ReviewsCarousel } from '@/components/homepage/ReviewsCarousel';
import { FaqSection } from '@/components/homepage/FaqSection';
import { ScamBanner } from '@/components/homepage/ScamBanner';
import { FinalCTA } from '@/components/homepage/FinalCTA';
import { NearbyMonuments } from '@/components/homepage/NearbyMonuments';
import { BlogPreview } from '@/components/homepage/BlogPreview';
import { ArticleTicker } from '@/components/homepage/ArticleTicker';
import { JsonLd } from '@/components/seo/JsonLd';
import { BASE, buildAlternates, buildOG, DIGITAL_TICKET_OFFER_EXTRAS } from '@/lib/seo';
import { getTranslations } from 'next-intl/server';
import {
  SKIP_THE_LINE_PRICE_EUR,
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
    description: `Bahia Palace tickets: official entry bought in your name, digital audio guide and WhatsApp support. Free cancellation. Open daily 9:00–17:00.`,
  },
  fr: {
    title: `Palais Bahia Marrakech 2026 — Horaires, tarifs et visite`,
    description: `Billets Palais Bahia : entrée officielle achetée à votre nom, audioguide et assistance WhatsApp. Annulation gratuite. Ouvert 9h–17h.`,
  },
  es: {
    title: `Palacio Bahía Marrakech 2026 — Horarios, precios y visita`,
    description: `Entradas al Palacio Bahía: entrada oficial a tu nombre, audioguía y ayuda por WhatsApp. Cancelación gratuita. Abierto 9:00–17:00.`,
  },
  de: {
    title: `Bahia Palast Marrakesch 2026 — Öffnungszeiten & Besuch`,
    description: `Bahia-Palast Tickets: offizielles Ticket auf Ihren Namen, Audioguide und WhatsApp-Support. Kostenlose Stornierung. Täglich 9–17 Uhr.`,
  },
  ar: {
    title: `قصر الباهية مراكش 2026 | التذاكر والمواعيد ودليل الزيارة`,
    description: `كل ما تحتاجه لزيارة قصر الباهية في مراكش: الدخول 100 درهم (30 درهماً للمغاربة والمقيمين)، المواعيد يومياً من 9:00 إلى 5:00، وكيف تتفادى طابور شبّاك التذاكر.`,
  },
  pt: {
    title: `Palácio da Bahia, Marraquexe 2026 | Bilhetes e horários`,
    description: `Tudo para visitar o Palácio da Bahia em Marraquexe: entrada oficial de 100 MAD, aberto todos os dias das 9:00 às 17:00, e como evitar a fila da bilheteira.`,
  },
  it: {
    title: `Palazzo Bahia Marrakech 2026 — Orari, prezzi e visita`,
    description: `Biglietti Palazzo Bahia: ingresso ufficiale a tuo nome, audioguida e assistenza WhatsApp. Cancellazione gratuita. Aperto 9:00–17:00.`,
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

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  // Drives which offer the structured data advertises — see `offers` below.
  const { enabled: paymentsEnabled } = getPublicPaymentsFlags();

  const tf   = await getTranslations({ locale, namespace: 'faq' });
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
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Saturday','Sunday'], opens: '09:00', closes: '17:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday'], opens: '09:00', closes: '12:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday'], opens: '14:00', closes: '17:00' },
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
            '@type': 'Offer',
            name: 'Skip-the-Line Entry',
            price: SKIP_THE_LINE_PRICE_EUR.toFixed(2),
            priceCurrency: 'EUR',
            url: `${BASE}/${locale}/tickets/skip-the-line`,
            availability: 'https://schema.org/InStock',
            ...DIGITAL_TICKET_OFFER_EXTRAS,
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
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Saturday','Sunday'], opens: '09:00', closes: '17:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday'], opens: '09:00', closes: '12:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday'], opens: '14:00', closes: '17:00' },
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
      <StorySection />
      <PalaceStatStrip />
      <HighlightsSection />
      <PracticalBar />
      <TrustStrip />
      <TicketSection />
      <WhyBookUs />
      <ReviewsCarousel />
      <ArticleTicker locale={locale} />
      <BlogPreview />
      <FaqSection />
      <ScamBanner />
      <NearbyMonuments />
      <FinalCTA />
    </>
  );
}
