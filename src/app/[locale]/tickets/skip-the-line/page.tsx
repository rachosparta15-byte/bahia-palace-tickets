import { TicketDetailPage } from '@/components/tickets/TicketDetailPage';
import type { Metadata } from 'next';
import { buildAlternates, buildOG } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

const META: Record<string, { title: string; description: string }> = {
  en: {
    title: 'Bahia Palace Skip-the-Line Tickets 2026 | No Queue',
    description: 'Book skip-the-line tickets for Bahia Palace and walk straight in — no queuing. Instant QR ticket by email. From $10 per person. Free cancellation 24h before.',
  },
  fr: {
    title: 'Billet Coupe-File Palais Bahia 2026 | Sans Attente',
    description: 'Réservez votre billet coupe-file pour le Palais Bahia et entrez directement. Billet QR instantané. Dès 10$ par personne. Annulation gratuite 24h avant.',
  },
  de: {
    title: 'Bahia Palast Skip-the-Line Ticket 2026 | Keine Wartezeit',
    description: 'Kaufen Sie Ihr Skip-the-Line-Ticket für den Bahia Palast und gehen Sie direkt hinein. Sofortiges QR-Ticket per E-Mail. Ab 10$ pro Person.',
  },
  it: {
    title: 'Biglietto Salta-Fila Palazzo Bahia 2026 | Senza Coda',
    description: 'Prenota il biglietto salta-fila per il Palazzo Bahia ed entra subito. Biglietto QR istantaneo via email. Da $10 a persona. Cancellazione gratuita.',
  },
  es: {
    title: 'Entrada Sin Cola Palacio Bahia 2026 | Acceso Rápido',
    description: 'Reserva tu entrada sin cola para el Palacio Bahia y entra directamente. Ticket QR instantáneo por email. Desde $10 por persona. Cancelación gratuita.',
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
  return <TicketDetailPage ticketKey="skipTheLine" slug="skip-the-line" price={10} />;
}
