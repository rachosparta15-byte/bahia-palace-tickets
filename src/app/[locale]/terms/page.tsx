import { LegalPage } from '@/components/legal/LegalPage';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'en') return { robots: 'noindex' };
  return {
    title: 'Terms of Service — Visitbahiapalace.com Ticket Platform',
    description: 'Read the terms of service for Visitbahiapalace.com, the independent Bahia Palace ticket guide. Booking conditions, cancellation rules, and legal info.',
  };
}

export default async function TermsPage() {
  const t = await getTranslations('breadcrumb');
  return (
    <LegalPage
      homeLabel={t('home')}
      title="Terms of Service"
      subtitle="Please read these terms carefully before using our service."
      lastUpdated="15 November 2025"
      sections={[
        {
          heading: '1. Acceptance of Terms',
          body: 'By purchasing tickets or using our website, you agree to these Terms of Service. If you do not agree, please do not use our service.',
        },
        {
          heading: '2. Ticket Purchase',
          body: [
            'Tickets are valid for the date selected at the time of purchase.',
            'Each QR code is unique and can only be scanned once at the entrance.',
            'Children under 7 years old enter free and do not require a separate ticket.',
            'Tickets are non-transferable and non-refundable except as set out in our Refund Policy.',
          ],
        },
        {
          heading: '3. Cancellation & Refund',
          body: 'Free cancellation is available up to 24 hours before your scheduled visit date. Cancellations within 24 hours are not eligible for a refund unless due to exceptional circumstances. See our Refund Policy for full details.',
        },
        {
          heading: '4. Entry Requirements',
          body: [
            'Present your QR code (digital or printed) at the entrance.',
            'Bahia Palace reserves the right to refuse entry to visitors who are disruptive or violate palace rules.',
            'The palace has the right to modify opening hours without prior notice during public holidays or for maintenance.',
          ],
        },
        {
          heading: '5. Intellectual Property',
          body: 'All content on this website — including text, images, logos, and design — is the property of Bahia Palace Tickets and may not be reproduced without written permission.',
        },
        {
          heading: '6. Limitation of Liability',
          body: 'We are not liable for any losses caused by events outside our reasonable control, including changes to palace opening hours, public holidays, or force majeure events.',
        },
        {
          heading: '7. Governing Law',
          body: 'These terms are governed by the laws of the Kingdom of Morocco. Any disputes shall be subject to the exclusive jurisdiction of the courts of Marrakech.',
        },
        {
          heading: '8. Contact',
          body: 'For questions about these terms, please contact us at support@visitbahiapalace.com or via WhatsApp.',
        },
      ]}
    />
  );
}
