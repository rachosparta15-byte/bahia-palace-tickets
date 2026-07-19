import { LegalPage } from '@/components/legal/LegalPage';
import { getTranslations } from 'next-intl/server';
import { getPublicPaymentsFlags } from '@/lib/payments/guard';
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

  // The Visitor Pack clause is unfinished and unreviewed. While the pack
  // cannot be bought, showing a visitor a policy full of {PLACEHOLDERS} and
  // the words "pending legal review" reads as an unfinished business, so it
  // stays hidden until the product it describes is actually on sale.
  const { enabled: paymentsEnabled } = getPublicPaymentsFlags();

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
        ...(!paymentsEnabled ? [] : [{
          // ─────────────────────────────────────────────────────────────
          // DRAFT — NOT LEGALLY REVIEWED. Covers the Complete Visitor Pack.
          //
          // ⚠️ CONFLICT: "We Don't Process Payments" above is accurate for
          // the rest of the site but false for the Visitor Pack, where we
          // take payment directly and are therefore the refunding party.
          // A lawyer must reconcile the two BEFORE payments are enabled.
          //
          // Inert while PAYMENTS_ENABLED=false.
          //
          // TODO(owner): the cancellation window below is a placeholder
          // number, not a decision. Set it against how far in advance the
          // official ticket actually gets purchased — you cannot offer a
          // fuller refund than you can recover from the ministry.
          // ─────────────────────────────────────────────────────────────
          heading: 'Complete Visitor Pack (DRAFT — pending legal review)',
          body: [
            'DRAFT: The following applies only to the Complete Visitor Pack, and only once it is available for purchase. It has not yet been reviewed by a lawyer.',
            'Unlike the rest of this site, the Complete Visitor Pack is sold directly by {LEGAL_COMPANY_NAME}, ICE {ICE_NUMBER}, registered at {REGISTERED_ADDRESS}. We take the payment, so we handle the refund.',
            'DRAFT — cancellation window to be confirmed: cancel at least {REFUND_WINDOW_HOURS} hours before your visit date for a full refund of the pack price.',
            'If we cannot obtain your official entry ticket for your chosen date, you receive a full refund of the pack price, including our service fee.',
            'If Bahia Palace closes unexpectedly on your visit date, you may choose a full refund or a change of date at no charge.',
            'To request a refund, email support@visitbahiapalace.com with your order reference.',
          ],
        }]),
      ]}
    />
  );
}
