import { TicketDetailPage } from '@/components/tickets/TicketDetailPage';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export const revalidate = 86400;

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tickets' });
  return {
    title: `${t('guidedTour.name')} — Bahia Palace Tickets`,
    description: t('guidedTour.tagline' as any),
    robots: { index: false, follow: false },
  };
}

export default function GuidedTourPage() {
  return <TicketDetailPage ticketKey="guidedTour" slug="guided-tour" price={28} />;
}
