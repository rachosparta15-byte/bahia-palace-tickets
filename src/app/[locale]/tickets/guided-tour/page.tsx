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
    title: `${t('guidedTour.name')} — Bahia Palace Tickets`,
    description: t('guidedTour.tagline' as any),
    alternates: {
      canonical: `${BASE}/${locale}/tickets/guided-tour`,
      languages: {
        en: `${BASE}/en/tickets/guided-tour`,
        fr: `${BASE}/fr/tickets/guided-tour`,
        it: `${BASE}/it/tickets/guided-tour`,
        de: `${BASE}/de/tickets/guided-tour`,
        es: `${BASE}/es/tickets/guided-tour`,
      },
    },
  };
}

export default function GuidedTourPage() {
  return <TicketDetailPage ticketKey="guidedTour" slug="guided-tour" price={28} />;
}
