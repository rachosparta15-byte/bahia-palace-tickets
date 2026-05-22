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
    title: `${t('skipTheLine.name')} — Bahia Palace Tickets`,
    description: t('skipTheLine.tagline' as any),
    alternates: {
      canonical: `/${locale}/tickets/skip-the-line`,
      languages: {
        en: '/en/tickets/skip-the-line',
        fr: '/fr/tickets/skip-the-line',
        it: '/it/tickets/skip-the-line',
        de: '/de/tickets/skip-the-line',
        es: '/es/tickets/skip-the-line',
      },
    },
  };
}

export default function SkipTheLinePage() {
  return <TicketDetailPage ticketKey="skipTheLine" slug="skip-the-line" price={10} />;
}
