import { TicketDetailPage } from '@/components/tickets/TicketDetailPage';
import type { Metadata } from 'next';
import { buildAlternates, buildOG } from '@/lib/seo';
import { TICKET_PRICES } from '@/lib/ticket-data';
import { SKIP_THE_LINE_PRICE_USD } from '@/config/pricing';

export const revalidate = 86400;

interface Props {
  params: Promise<{ locale: string }>;
}

const P = SKIP_THE_LINE_PRICE_USD;

const META: Record<string, { title: string; description: string }> = {
  en: {
    title: `Bahia Palace Tickets 2026 — Skip the Line from $${P} | No Queue`,
    description: `Compare Bahia Palace skip-the-line ticket options from $${P} per person and book directly on the official portal — no queuing, no booking fees.`,
  },
  fr: {
    title: `Billet Coupe-File Palais Bahia 2026 — Dès ${P}$ | Sans Attente`,
    description: `Comparez les options de billet coupe-file pour le Palais Bahia dès ${P}$ par personne et réservez directement sur le portail officiel — sans file d'attente, sans frais.`,
  },
  de: {
    title: `Bahia Palast Ticket 2026 — Skip-the-Line ab $${P} | Keine Wartezeit`,
    description: `Vergleichen Sie Skip-the-Line-Optionen für den Bahia Palast ab $${P} pro Person und buchen Sie direkt über das offizielle Portal — keine Warteschlange, keine Gebühren.`,
  },
  it: {
    title: `Biglietto Palazzo Bahia 2026 — Salta-Fila da $${P} | Senza Coda`,
    description: `Confronta le opzioni salta-fila per il Palazzo Bahia da $${P} a persona e prenota direttamente sul portale ufficiale — niente coda, nessuna commissione.`,
  },
  es: {
    title: `Entrada Palacio Bahia 2026 — Sin Cola desde $${P} | Acceso Rápido`,
    description: `Compara las opciones sin cola para el Palacio Bahia desde $${P} por persona y reserva directamente en el portal oficial — sin colas, sin comisiones.`,
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
