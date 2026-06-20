import { LegalPage } from '@/components/legal/LegalPage';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'en') return { robots: 'noindex' };
  return {
    title: 'Privacy Policy — How Visitbahiapalace.com Handles Your Data',
    description: 'Read how Visitbahiapalace.com collects and uses your personal data when you book Bahia Palace tickets or browse our independent visitor guide.',
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations('breadcrumb');
  return (
    <LegalPage
      homeLabel={t('home')}
      title="Privacy Policy"
      subtitle="We respect your privacy. Here is how we handle your personal data."
      lastUpdated="15 November 2025"
      sections={[
        {
          heading: '1. Data We Collect',
          body: [
            'Name and email address (required for booking confirmation).',
            'Visit date, ticket type, and number of visitors (required to process your booking).',
            'Payment information — processed securely by Stripe; we never store card details.',
            'Optional: IP address and browser data for analytics and security.',
          ],
        },
        {
          heading: '2. How We Use Your Data',
          body: [
            'To send your ticket and booking confirmation by email.',
            'To process payments securely via our payment provider.',
            'To respond to customer service enquiries.',
            'To improve our service through anonymised analytics.',
          ],
        },
        {
          heading: '3. Data Storage',
          body: 'Your data is stored on secure servers. Booking data is retained for 3 years for legal and accounting purposes. You may request deletion at any time by contacting us (subject to legal retention requirements).',
        },
        {
          heading: '4. Data Sharing',
          body: [
            'We do not sell your personal data.',
            'We share data only with essential service providers: payment processor (Stripe), email provider (Resend), and analytics (anonymous).',
            'We may disclose data if required by Moroccan law or a court order.',
          ],
        },
        {
          heading: '5. Cookies',
          body: 'We use essential cookies to operate the website and anonymous analytics cookies. You can manage your cookie preferences at any time. See our Cookie Policy for details.',
        },
        {
          heading: '6. Your Rights',
          body: [
            'Right to access: request a copy of the data we hold about you.',
            'Right to rectification: correct inaccurate personal data.',
            'Right to erasure: request deletion of your data (subject to legal requirements).',
            'Right to portability: receive your data in a machine-readable format.',
          ],
        },
        {
          heading: '7. Contact',
          body: 'For privacy enquiries, please email us at support@visitbahiapalace.com. We aim to respond within 72 hours.',
        },
      ]}
    />
  );
}
