import { TicketDetailPage } from '@/components/tickets/TicketDetailPage';
import type { Metadata } from 'next';
import { buildAlternates, buildOG } from '@/lib/seo';
import { TICKET_PRICES } from '@/lib/ticket-data';

export const revalidate = 86400;

interface Props {
  params: Promise<{ locale: string }>;
}

/*
 * These said "book directly on the official portal — no booking fees".
 *
 * The same line was corrected on /tickets and missed here, which is why
 * this page still told searchers to buy from somebody else — on the one
 * page whose whole subject is buying a ticket, and the page Search Console
 * shows ranking for "bahia palace tickets".
 *
 * "No booking fees" also stopped being true the day the pack went on sale.
 * The EUR 11.99 is a service price covering the ticket, the audio guide and
 * support, not a ticket with a fee bolted on; calling that "no fees" while
 * charging above the gate price is indefensible in front of a regulator.
 */
const META: Record<string, { title: string; description: string }> = {
  en: {
    title: `Bahia Palace Skip-the-Line Tickets 2026 | Skip the Queue`,
    description: `Skip the ticket queue at Bahia Palace. Entry ticket, digital audio guide and WhatsApp support, with free cancellation until we send it.`,
  },
  fr: {
    title: `Billet Coupe-File Palais Bahia 2026 | Évitez la file`,
    description: `Évitez la file au Palais Bahia. Billet d'entrée, audioguide numérique et assistance WhatsApp, annulation gratuite jusqu'à l'envoi.`,
  },
  de: {
    title: `Bahia Palast Skip-the-Line Ticket 2026 | Ohne Anstehen`,
    description: `Umgehen Sie die Warteschlange am Bahia-Palast. Eintrittsticket, digitaler Audioguide und WhatsApp-Support, kostenlos stornierbar bis zum Versand.`,
  },
  it: {
    title: `Biglietto Salta-Fila Palazzo Bahia 2026 | Niente coda`,
    description: `Salta la fila al Palazzo Bahia. Biglietto, audioguida digitale e assistenza WhatsApp, cancellazione gratuita fino all’invio.`,
  },
  es: {
    title: `Entrada Sin Cola Palacio Bahía 2026 | Evita la cola`,
    description: `Evita la cola en el Palacio Bahía. Entrada, audioguía digital y ayuda por WhatsApp, con cancelación gratuita hasta que la enviemos.`,
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
