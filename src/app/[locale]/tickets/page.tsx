import { getTranslations } from 'next-intl/server';
import { TicketSection } from '@/components/homepage/TicketSection';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Metadata } from 'next';
import { buildAlternates, buildOG, buildBreadcrumbSchema, BASE } from '@/lib/seo';
import { SKIP_THE_LINE_PRICE_EUR } from '@/config/pricing';

export const revalidate = 86400;

interface Props {
  params: Promise<{ locale: string }>;
}

/*
 * These descriptions said "book directly on the official portal — no booking
 * fees", which was two problems in one line.
 *
 * It sent the reader away. This is the page that ranks, and its meta
 * description pointed at somebody else's checkout.
 *
 * And "no booking fees" stopped being true the moment the pack went on sale.
 * The €13.99 is a service price covering the ticket, the audio guide and
 * support — not a ticket with a fee bolted on. Describing that as "no fees"
 * while charging more than the gate price is the kind of phrasing that is
 * technically arguable and indefensible in front of a regulator, which is why
 * the go-live checklist lists it for removal.
 *
 * What replaces it says what the page is for and what the price includes.
 */
const TICKETS_META: Record<string, { title: string; description: string }> = {
  en: { title: `Bahia Palace Tickets 2026 — Skip-the-Line, Guided & Private`, description: `Compare Bahia Palace ticket options: skip-the-line, guided and private tours. Prices, what each includes, and how to book.` },
  fr: { title: `Billets Palais Bahia 2026 — Coupe-File, Guidées & Privées`, description: `Comparez les billets pour le Palais Bahia : coupe-file, visites guidées et privées. Tarifs, contenu de chaque offre et modalités de réservation.` },
  es: { title: `Entradas Palacio Bahía 2026 — Sin Cola, Guiadas y Privadas`, description: `Compara las entradas del Palacio Bahía: sin cola, visitas guiadas y privadas. Precios, qué incluye cada una y cómo reservar.` },
  de: { title: `Bahia Palast Tickets 2026 — Skip-the-Line, Touren & Privat`, description: `Vergleichen Sie Bahia Palast Tickets: Skip-the-Line, Führungen und Privattouren. Preise, Leistungen und wie Sie buchen.` },
  it: { title: `Biglietti Palazzo Bahia 2026 — Salta-Fila, Guidate e Private`, description: `Confronta i biglietti per il Palazzo Bahia: salta-fila, visite guidate e private. Prezzi, che cosa include ciascuno e come prenotare.` },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = TICKETS_META[locale] ?? TICKETS_META.en;
  return {
    title: meta.title,
    description: meta.description,
    alternates: buildAlternates(locale, '/tickets'),
    openGraph: buildOG(meta.title, meta.description, locale, '/tickets'),
  };
}

const H1_LABELS: Record<string, string> = {
  en: 'Bahia Palace Tickets 2026',
  fr: 'Billets Palais Bahia 2026',
  es: 'Entradas Palacio Bahia 2026',
  de: 'Bahia Palast Tickets 2026',
  it: 'Biglietti Palazzo Bahia 2026',
};

export default async function TicketsPage({ params }: Props) {
  const { locale } = await params;
  const tb = await getTranslations({ locale, namespace: 'breadcrumb' });
  const h1 = H1_LABELS[locale] ?? H1_LABELS.en;

  const ticketsSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: TICKETS_META[locale]?.title ?? TICKETS_META.en.title,
    url: `${BASE}/${locale}/tickets`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Product',
          name: 'Bahia Palace Skip-the-Line Ticket',
          url: `${BASE}/${locale}/tickets/skip-the-line`,
          image: `${BASE}/og-image.jpg`,
          offers: {
            '@type': 'Offer',
            price: SKIP_THE_LINE_PRICE_EUR.toFixed(2),
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            url: `${BASE}/${locale}/tickets/skip-the-line`,
          },
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#1C1108]">
      <JsonLd data={ticketsSchema} />
      <JsonLd data={buildBreadcrumbSchema(locale, [{ name: tb('home'), path: '' }, { name: tb('tickets') }])} />
      <div className="bg-[#251A0F] border-b border-[rgba(232,163,61,0.15)] px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb
            variant="light"
            items={[
              { label: tb('home'), href: '/' },
              { label: tb('tickets') },
            ]}
          />
          <h1
            className="mt-4 font-bold text-white leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
          >
            {h1}
          </h1>
        </div>
      </div>
      <TicketSection />
    </div>
  );
}
