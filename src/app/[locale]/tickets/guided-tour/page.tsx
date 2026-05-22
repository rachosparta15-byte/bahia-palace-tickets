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
    title: `${t('guidedTour.name')} — Bahia Palace Tickets`,
    description: t('guidedTour.tagline' as any),
    alternates: {
      canonical: `/${locale}/tickets/guided-tour`,
      languages: {
        en: '/en/tickets/guided-tour',
        fr: '/fr/tickets/guided-tour',
        it: '/it/tickets/guided-tour',
        de: '/de/tickets/guided-tour',
        es: '/es/tickets/guided-tour',
      },
    },
  };
}

export default function GuidedTourPage() {
  return <TicketDetailPage ticketKey="guidedTour" slug="guided-tour" price={28} />;
}
