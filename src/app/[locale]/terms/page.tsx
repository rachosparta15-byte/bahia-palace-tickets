import { LegalPage } from '@/components/legal/LegalPage';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export const revalidate = 86400;

const TERMS_DESCRIPTIONS: Record<string, string> = {
  fr: "Consultez les conditions générales d'utilisation de visitbahiapalace.com, site indépendant de vente de billets coupe-file pour le Palais de la Bahia.",
  es: 'Consulta los términos y condiciones de visitbahiapalace.com, un sitio independiente para comprar entradas sin colas al Palacio de la Bahía en Marrakech.',
  de: 'Lesen Sie die Nutzungsbedingungen von visitbahiapalace.com, einer unabhängigen Website für den Kauf von Skip-the-Line-Tickets für den Bahia Palast Marrakesch.',
  it: "Leggi i termini e condizioni di visitbahiapalace.com, sito indipendente per l'acquisto di biglietti salta-fila per il Palazzo della Bahia a Marrakech.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'en') return { robots: 'noindex', description: TERMS_DESCRIPTIONS[locale] };
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
          heading: '2. Our Service',
          body: [
            'This website is an independent, unaffiliated information and ticket-comparison guide for Bahia Palace, Marrakech.',
            'We do not sell tickets, process payments, or issue QR codes ourselves.',
            "When you choose to book, you will be redirected to the official Ministry of Culture ticketing portal (e-services.minculture.gov.ma) to complete your purchase directly with them.",
            'Prices, availability, and ticket conditions shown on this site are for comparison purposes and may differ from the official portal at the time of purchase.',
          ],
        },
        {
          heading: '3. Cancellation & Refund',
          body: 'Cancellation and refund terms are set by the official portal where you complete your purchase, not by us. Review their policy before paying — we cannot process cancellations or refunds on your behalf.',
        },
        {
          heading: '4. Entry Requirements',
          body: [
            'Entry requirements (ticket format, ID checks, etc.) are set by Bahia Palace and the official ticketing portal — follow the instructions in your confirmation from them.',
            'Children under 7 years old enter free per the official Ministry of Culture pricing.',
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
        {
          // TODO(owner): replace these placeholders with your actual registered
          // business details before launch. Required in most jurisdictions
          // (in Morocco: legal name, ICE number, and registered address are
          // standard disclosures for a commercial website).
          heading: '9. Company Information',
          body: 'This site is operated by {LEGAL_COMPANY_NAME}, ICE {ICE_NUMBER}, registered at {REGISTERED_ADDRESS}.',
        },
      ]}
    />
  );
}
