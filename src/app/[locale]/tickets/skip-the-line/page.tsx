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
    description: `Skip the ticket-office queue at Bahia Palace: official entry and an audio guide in your language, free cancellation up to 24 hours before. Book online.`,
  },
  fr: {
    title: `Billet Coupe-File Palais Bahia 2026 | Évitez la file`,
    description: `Évitez la file au Palais Bahia : billet officiel et audioguide dans votre langue, annulation gratuite jusqu'à 24 h avant. Réservez en ligne.`,
  },
  de: {
    title: `Bahia Palast Skip-the-Line Ticket 2026 | Ohne Anstehen`,
    description: `Ohne Anstehen in den Bahia-Palast: offizielles Ticket und Audioguide in Ihrer Sprache, bis 24 Stunden vorher kostenlos stornierbar. Online buchen.`,
  },
  it: {
    title: `Biglietto Salta-Fila Palazzo Bahia 2026 | Niente coda`,
    description: `Salta la coda alla biglietteria del Palazzo Bahia: biglietto ufficiale e audioguida nella tua lingua, cancellazione gratuita fino a 24 ore prima.`,
  },
  es: {
    title: `Entrada Sin Cola Palacio Bahía 2026 | Evita la cola`,
    description: `Evita la cola de taquillas del Palacio Bahía: entrada oficial y audioguía en tu idioma, cancelación gratuita hasta 24 horas antes. Reserva online.`,
  },
  // ar and pt were missing, so both served the English title on the page whose
  // entire subject is buying a ticket. Arabic is this site's strongest locale.
  ar: {
    title: `تذكرة تخطّي الطابور لقصر الباهية 2026 | بلا انتظار`,
    description: `تجنّب طابور شبّاك التذاكر في قصر الباهية: تذكرة رسمية ودليل صوتي بلغتك، وإلغاء مجاني حتى 24 ساعة قبل الزيارة. احجز الآن عبر الإنترنت.`,
  },
  pt: {
    title: `Bilhete Sem Fila Palácio Bahia 2026 | Evite a fila`,
    description: `Evite a fila das bilheteiras no Palácio Bahia: bilhete oficial e audioguia na sua língua, cancelamento gratuito até 24 horas antes. Reserve online.`,
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
