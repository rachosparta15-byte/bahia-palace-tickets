import { LegalPage } from '@/components/legal/LegalPage';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export const revalidate = 86400;

const REFUND_DESCRIPTIONS: Record<string, string> = {
  fr: 'Découvrez la politique de remboursement de visitbahiapalace.com pour vos billets du Palais de la Bahia : délais, conditions et comment être remboursé.',
  es: 'Consulta la política de reembolsos de visitbahiapalace.com para tus entradas al Palacio de la Bahía: plazos, condiciones y cómo pedir tu devolución.',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'en') return { robots: 'noindex', description: REFUND_DESCRIPTIONS[locale] };
  return {
    title: 'Refund & Cancellation Policy — Bahia Palace Tickets',
    description: 'Visitbahiapalace.com is an independent guide, not a ticket seller. Cancellation and refund terms are set by the official portal where you complete your purchase.',
  };
}

export default async function RefundPolicyPage() {
  const t = await getTranslations('breadcrumb');
  return (
    <LegalPage
      homeLabel={t('home')}
      title="Refund & Cancellation Policy"
      subtitle="Where cancellations and refunds actually come from."
      lastUpdated="15 November 2025"
      sections={[
        {
          heading: 'We Don’t Process Payments',
          body: 'Visitbahiapalace.com is an independent, unaffiliated information and ticket-comparison guide. We don’t sell tickets or take payment ourselves — when you continue past our site, you complete your purchase directly on the official ticketing portal.',
        },
        {
          heading: 'Cancellation & Refund Terms',
          body: 'Because payment happens on the official portal, its cancellation and refund policy applies to your purchase, not ours. Review the terms shown there at checkout before you pay — they cover deadlines, eligibility, and how refunds are issued.',
        },
        {
          heading: 'Palace Closures',
          body: 'If Bahia Palace closes unexpectedly on your visit date, contact the portal where you purchased your ticket — they handle rescheduling and refunds for closures, not us.',
        },
        {
          heading: 'Date Changes',
          body: 'Need to visit on a different date? Date changes are handled by the official portal under the terms shown at your purchase. We can’t reschedule or refund a ticket ourselves.',
        },
        {
          heading: 'Questions About Your Order',
          body: 'For questions about a specific purchase, contact the portal directly using the reference from your confirmation email. For general questions about this site, email support@visitbahiapalace.com or WhatsApp us — we respond within 24 hours.',
        },
      ]}
    />
  );
}
