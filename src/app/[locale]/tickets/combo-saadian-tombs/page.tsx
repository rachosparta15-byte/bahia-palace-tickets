import { TicketDetailPage } from '@/components/tickets/TicketDetailPage';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tickets' });
  return {
    title: `${t('combo.name')} — Bahia Palace Tickets`,
    description: t('combo.tagline' as any),
    robots: { index: false, follow: false },
  };
}

export default function ComboPage() {
  return <TicketDetailPage ticketKey="combo" slug="combo-saadian-tombs" price={18} />;
}
