import { TicketDetailPage } from '@/components/tickets/TicketDetailPage';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.visitbahiapalace.com';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tickets' });
  return {
    title: `${t('combo.name')} — Bahia Palace Tickets`,
    description: t('combo.tagline' as any),
    alternates: {
      canonical: `${BASE}/${locale}/tickets/combo-saadian-tombs`,
      languages: {
        en: `${BASE}/en/tickets/combo-saadian-tombs`,
        fr: `${BASE}/fr/tickets/combo-saadian-tombs`,
        it: `${BASE}/it/tickets/combo-saadian-tombs`,
        de: `${BASE}/de/tickets/combo-saadian-tombs`,
        es: `${BASE}/es/tickets/combo-saadian-tombs`,
      },
    },
  };
}

export default function ComboPage() {
  return <TicketDetailPage ticketKey="combo" slug="combo-saadian-tombs" price={18} />;
}
