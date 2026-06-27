import { LegalPage } from '@/components/legal/LegalPage';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'en') return { robots: 'noindex' };
  return {
    title: 'Refund Policy — Free Cancellation on Bahia Palace Tickets',
    description: 'Visitbahiapalace.com offers free cancellation on Bahia Palace tickets up to 24 hours before your visit. Read our full refund and cancellation conditions.',
  };
}

export default async function RefundPolicyPage() {
  const t = await getTranslations('breadcrumb');
  return (
    <LegalPage
      homeLabel={t('home')}
      title="Refund Policy"
      subtitle="We want you to visit with confidence. Here is our refund promise."
      lastUpdated="15 November 2025"
      sections={[
        {
          heading: 'Free Cancellation',
          body: 'All tickets include free cancellation up to 24 hours before your scheduled visit date. Cancel anytime before the deadline using the link in your confirmation email or by contacting us directly.',
        },
        {
          heading: 'How to Cancel',
          body: [
            'Use the cancellation link in your booking confirmation email.',
            'Email us at support@visitbahiapalace.com with your reference number.',
            'Send us a WhatsApp message with your booking reference.',
          ],
        },
        {
          heading: 'Refund Processing',
          body: 'Approved refunds are processed within 5–10 business days. The refund is returned to the original payment method. We will send you a confirmation email once the refund has been initiated.',
        },
        {
          heading: 'Late Cancellation (within 24 hours)',
          body: 'Cancellations made within 24 hours of the scheduled visit are not eligible for a refund under standard conditions. However, we review exceptional circumstances on a case-by-case basis (illness, transport disruptions, etc.).',
        },
        {
          heading: 'No-Shows',
          body: 'Tickets that are not used (no-shows) are not eligible for a refund, except in cases where the palace was closed due to circumstances beyond our control (official public holiday, emergency closure, etc.).',
        },
        {
          heading: 'Palace Closures',
          body: 'In the rare event that Bahia Palace closes unexpectedly on the day of your visit, we will offer a full refund or rescheduling at no extra cost.',
        },
        {
          heading: 'Date Changes',
          body: 'Need to visit on a different date? Contact us at least 24 hours before your original visit date and we will reschedule your ticket free of charge, subject to availability.',
        },
        {
          heading: 'Contact',
          body: 'Questions about a refund? Email support@visitbahiapalace.com or WhatsApp us. We respond within 24 hours.',
        },
      ]}
    />
  );
}
