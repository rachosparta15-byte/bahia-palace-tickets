import { getTranslations } from 'next-intl/server';
import { TicketSection } from '@/components/homepage/TicketSection';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import type { Metadata } from 'next';
import { buildAlternates, buildOG } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

const TICKETS_META: Record<string, { title: string; description: string }> = {
  en: { title: 'Bahia Palace Tickets 2026 | Skip-the-Line & Guided Tours', description: 'Buy Bahia Palace tickets online and skip the queue. Best prices for skip-the-line entry, guided tours & private tours. Instant confirmation.' },
  fr: { title: 'Billets Palais Bahia 2026 | Coupe-File & Visites Guidées', description: 'Achetez vos billets Palais Bahia en ligne et évitez la file. Meilleurs prix coupe-file, visites guidées et privées. Confirmation instantanée.' },
  es: { title: 'Entradas Palacio Bahia 2026 | Sin Cola & Visitas Guiadas', description: 'Compra entradas para el Palacio Bahia online sin colas. Mejores precios, visitas guiadas y privadas. Confirmación instantánea.' },
  de: { title: 'Bahia Palast Tickets 2026 | Warteschlange umgehen & Führungen', description: 'Kaufen Sie Bahia Palast Tickets online. Beste Preise, Führungen und private Touren. Sofortige Buchungsbestätigung.' },
  it: { title: 'Biglietti Palazzo Bahia 2026 | Salta-Fila & Visite Guidate', description: 'Acquista biglietti per il Palazzo Bahia online senza code. Prezzi migliori, visite guidate e private. Conferma immediata.' },
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

export default async function TicketsPage({ params }: Props) {
  const { locale } = await params;
  const tb = await getTranslations({ locale, namespace: 'breadcrumb' });

  return (
    <div className="min-h-screen">
      <div className="bg-[#3D2817] px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb
            variant="light"
            items={[
              { label: tb('home'), href: '/' },
              { label: tb('tickets') },
            ]}
          />
        </div>
      </div>
      <TicketSection />
    </div>
  );
}
