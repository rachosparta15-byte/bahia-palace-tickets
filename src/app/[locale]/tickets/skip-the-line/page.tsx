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
    title: `${t('skipTheLine.name')} — Bahia Palace Tickets`,
    description: t('skipTheLine.tagline' as any),
    alternates: {
      canonical: `${BASE}/${locale}/tickets/skip-the-line`,
      languages: {
        en: `${BASE}/en/tickets/skip-the-line`,
        fr: `${BASE}/fr/tickets/skip-the-line`,
        it: `${BASE}/it/tickets/skip-the-line`,
        de: `${BASE}/de/tickets/skip-the-line`,
        es: `${BASE}/es/tickets/skip-the-line`,
      },
    },
  };
}

export default function SkipTheLinePage() {
  return <TicketDetailPage ticketKey="skipTheLine" slug="skip-the-line" price={10} />;
}
