export const revalidate = 60;

import { Hero } from '@/components/homepage/Hero';
import { TrustStrip } from '@/components/homepage/TrustStrip';
import { TicketSection } from '@/components/homepage/TicketSection';
import { WhyBookUs } from '@/components/homepage/WhyBookUs';
import { AboutSection } from '@/components/homepage/AboutSection';
import { ReviewsCarousel } from '@/components/homepage/ReviewsCarousel';
import { FaqSection } from '@/components/homepage/FaqSection';
import { ScamBanner } from '@/components/homepage/ScamBanner';
import { FinalCTA } from '@/components/homepage/FinalCTA';
import { BlogPreview } from '@/components/homepage/BlogPreview';
import { ArticleTicker } from '@/components/homepage/ArticleTicker';
import { JsonLd } from '@/components/seo/JsonLd';
import { BASE, buildAlternates, buildOG, DIGITAL_TICKET_OFFER_EXTRAS } from '@/lib/seo';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string }>;
}

const HOME_META: Record<string, { title: string; description: string }> = {
  en: {
    title: 'Bahia Palace Marrakech 2026 | Tickets, Hours & Visitor Guide',
    description: 'Visit Bahia Palace Marrakech in 2026. Book skip-the-line tickets, check opening hours, entrance fees, and discover the stunning 19th-century Moroccan palace.',
  },
  fr: {
    title: 'Palais Bahia Marrakech 2026 | Billets, Horaires & Guide',
    description: 'Visitez le Palais Bahia Marrakech en 2026. Réservez vos billets coupe-file, horaires, tarifs et découvrez ce palais marocain du 19ème siècle.',
  },
  es: {
    title: 'Palacio Bahia Marrakech 2026 | Entradas, Horarios & Guía',
    description: 'Visita el Palacio Bahia de Marrakech en 2026. Compra entradas sin cola, consulta horarios, precios y descubre este impresionante palacio marroquí del siglo XIX.',
  },
  de: {
    title: 'Bahia Palast Marrakesch 2026 | Tickets, Öffnungszeiten & Reiseführer',
    description: 'Besuchen Sie den Bahia Palast in Marrakesch 2026. Tickets ohne Warteschlange, Öffnungszeiten, Eintrittspreise und Infos zum prachtvollen Palast aus dem 19. Jahrhundert.',
  },
  it: {
    title: 'Palazzo Bahia Marrakech 2026 | Biglietti, Orari & Guida',
    description: 'Visita il Palazzo Bahia di Marrakech nel 2026. Acquista biglietti salta-fila, controlla orari, prezzi e scopri lo storico palazzo marocchino del XIX secolo.',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = HOME_META[locale] ?? HOME_META.en;

  return {
    title: meta.title,
    description: meta.description,
    keywords: ['bahia palace marrakech', 'bahia palace tickets 2026', 'palais bahia marrakech',
      'bahia palace morocco', 'visit bahia palace', 'skip the line marrakech',
      'moroccan architecture', 'marrakech medina attractions', 'bahia palace gardens'],
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
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '09:00', closes: '17:00' },
    ],
    offers: [
      { '@type': 'Offer', name: 'Skip-the-Line Entry', price: '10', priceCurrency: 'USD', url: `${BASE}/${locale}/tickets/skip-the-line`, availability: 'https://schema.org/InStock', ...DIGITAL_TICKET_OFFER_EXTRAS },
    ],
    touristType: ['History enthusiasts', 'Architecture lovers', 'Cultural tourists'],
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
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumb} />
      <Hero />
      <ArticleTicker locale={locale} />
      <TrustStrip />
      <TicketSection />
      <WhyBookUs />
      <BlogPreview />
      <AboutSection />
      <ReviewsCarousel />
      <FaqSection />
      <ScamBanner />
      <FinalCTA />
    </>
  );
}
