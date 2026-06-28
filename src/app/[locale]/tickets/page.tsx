import { getTranslations } from 'next-intl/server';
import { TicketSection } from '@/components/homepage/TicketSection';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Metadata } from 'next';
import { buildAlternates, buildOG, BASE } from '@/lib/seo';

export const revalidate = 86400;

interface Props {
  params: Promise<{ locale: string }>;
}

const TICKETS_META: Record<string, { title: string; description: string }> = {
  en: { title: 'Bahia Palace Tickets 2026 | Skip-the-Line & Guided Tours', description: 'Buy Bahia Palace Marrakech tickets online and skip the queue. Best prices for skip-the-line entry, guided tours and private tours with instant QR confirmation.' },
  fr: { title: 'Billets Palais Bahia 2026 | Coupe-File & Visites Guidées', description: 'Achetez vos billets pour le Palais Bahia de Marrakech en ligne. Coupe-file, visites guidées et privées au meilleur prix avec confirmation instantanée par e-mail.' },
  es: { title: 'Entradas Palacio Bahia 2026 | Sin Cola & Visitas Guiadas', description: 'Compra entradas para el Palacio Bahia de Marrakech online sin colas. Entrada sin cola, visitas guiadas y privadas al mejor precio. Confirmación instantánea.' },
  de: { title: 'Bahia Palast Tickets 2026 | Führungen & Kombi', description: 'Bahia Palast Marrakesch Tickets online kaufen: Skip-the-Line, Führungen und Privattouren zum besten Preis. Sofortige Buchungsbestätigung per E-Mail erhalten.' },
  it: { title: 'Biglietti Palazzo Bahia 2026 | Salta-Fila & Visite Guidate', description: 'Acquista i biglietti per il Palazzo Bahia di Marrakech online. Salta-fila, visite guidate e private al miglior prezzo con conferma immediata via email.' },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = TICKETS_META[locale] ?? TICKETS_META.en;
  return {
    title: meta.title,
    description: meta.description,
    keywords: ['bahia palace tickets', 'buy bahia palace tickets online', 'bahia palace skip the line tickets', 'bahia palace tickets price 2026', 'book bahia palace tickets'],
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
            price: '10.00',
            priceCurrency: 'USD',
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
