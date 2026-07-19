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
import { SKIP_THE_LINE_PRICE_USD, VISITOR_PACK_PRICE_USD } from '@/config/pricing';
import { getPublicPaymentsFlags } from '@/lib/payments/guard';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string }>;
}

const P = SKIP_THE_LINE_PRICE_USD;

const HOME_META: Record<string, { title: string; description: string }> = {
  en: {
    title: `Bahia Palace Marrakech 2026 | Tickets from $${P}`,
    description: `Visit Bahia Palace Marrakech in 2026. Compare skip-the-line, guided and private tour tickets from $${P}, check opening hours and entrance fees, and discover the 19th-century Moroccan palace.`,
  },
  fr: {
    title: `Palais Bahia Marrakech 2026 | Billets dès ${P}$`,
    description: `Visitez le Palais Bahia de Marrakech en 2026. Comparez les billets coupe-file, visites guidées et privées dès ${P}$, consultez les horaires et tarifs, et découvrez ce joyau de l'architecture marocaine.`,
  },
  es: {
    title: `Palacio Bahia Marrakech 2026 | Entradas desde $${P}`,
    description: `Visita el Palacio Bahia de Marrakech en 2026. Compara entradas sin cola, visitas guiadas y privadas desde $${P}, consulta horarios y precios, y descubre este palacio marroquí del siglo XIX.`,
  },
  de: {
    title: `Bahia Palast Marrakesch 2026 | Tickets ab $${P}`,
    description: `Besuchen Sie den Bahia Palast in Marrakesch 2026. Vergleichen Sie Skip-the-Line-, Führungs- und Privattouren-Tickets ab $${P}, prüfen Sie Öffnungszeiten und Preise, und entdecken Sie den Palast aus dem 19. Jahrhundert.`,
  },
  it: {
    title: `Palazzo Bahia Marrakech 2026 | Biglietti da $${P}`,
    description: `Visita il Palazzo Bahia di Marrakech nel 2026. Confronta biglietti salta-fila, visite guidate e private da $${P}, controlla orari e prezzi, e scopri lo storico palazzo marocchino del XIX secolo.`,
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
            price: String(VISITOR_PACK_PRICE_USD),
            priceCurrency: 'USD',
            url: `${BASE}/${locale}/visitor-pack`,
            availability: 'https://schema.org/InStock',
            ...DIGITAL_TICKET_OFFER_EXTRAS,
          }
        : {
            '@type': 'Offer',
            name: 'Skip-the-Line Entry',
            price: String(SKIP_THE_LINE_PRICE_USD),
            priceCurrency: 'USD',
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
