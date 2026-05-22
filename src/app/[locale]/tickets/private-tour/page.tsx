import { TicketDetailPage } from '@/components/tickets/TicketDetailPage';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://visitbahiapalace.com';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tickets' });
  return {
    title: `${t('privateTour.name')} — Bahia Palace Tickets`,
    description: t('privateTour.tagline' as any),
    alternates: {
      canonical: `${BASE}/${locale}/tickets/private-tour`,
      languages: {
        en: `${BASE}/en/tickets/private-tour`,
        fr: `${BASE}/fr/tickets/private-tour`,
        it: `${BASE}/it/tickets/private-tour`,
        de: `${BASE}/de/tickets/private-tour`,
        es: `${BASE}/es/tickets/private-tour`,
      },
    },
  };
}

export default function PrivateTourPage() {
  return <TicketDetailPage ticketKey="privateTour" slug="private-tour" price={75} />;
}
