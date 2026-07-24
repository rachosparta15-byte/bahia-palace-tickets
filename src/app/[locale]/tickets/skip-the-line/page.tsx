import { TicketDetailPage } from '@/components/tickets/TicketDetailPage';
import type { Metadata } from 'next';
import { buildAlternates, buildOG } from '@/lib/seo';
import { TICKET_PRICES } from '@/lib/ticket-data';

export const revalidate = 86400;

interface Props {
  params: Promise<{ locale: string }>;
}

const META: Record<string, { title: string; description: string }> = {
  en: {
    title: `Bahia Palace Skip-the-Line Tickets 2026 | Skip the Queue`,
    description: `Compare Bahia Palace skip-the-line ticket options and book directly on the official portal — no queuing, no booking fees.`,
  },
  fr: {
    title: `Billet Coupe-File Palais Bahia 2026 | Évitez la file`,
    description: `Comparez les options de billet coupe-file pour le Palais Bahia et réservez directement sur le portail officiel — sans file d'attente, sans frais.`,
  },
  de: {
    title: `Bahia Palast Skip-the-Line Ticket 2026 | Ohne Anstehen`,
    description: `Vergleichen Sie Skip-the-Line-Optionen für den Bahia Palast und buchen Sie direkt über das offizielle Portal — keine Warteschlange, keine Gebühren.`,
  },
  it: {
    title: `Biglietto Salta-Fila Palazzo Bahia 2026 | Niente coda`,
    description: `Confronta le opzioni salta-fila per il Palazzo Bahia e prenota direttamente sul portale ufficiale — niente coda, nessuna commissione.`,
  },
  es: {
    title: `Entrada Sin Cola Palacio Bahía 2026 | Evita la cola`,
    description: `Compara las opciones sin cola para el Palacio Bahía y reserva directamente en el portal oficial — sin colas, sin comisiones.`,
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = META[locale] ?? META.en;
  return {
    title: meta.title,
    description: meta.description,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: buildAlternates(locale, '/tickets/skip-the-line'),
    openGraph: buildOG(meta.title, meta.description, locale, '/tickets/skip-the-line'),
  };
}

export default function SkipTheLinePage() {
  return <TicketDetailPage ticketKey="skipTheLine" slug="skip-the-line" price={TICKET_PRICES['skip-the-line']} />;
}
