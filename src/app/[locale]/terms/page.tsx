import { LegalPage } from '@/components/legal/LegalPage';
import { getTranslations } from 'next-intl/server';
import { getPublicPaymentsFlags } from '@/lib/payments/guard';
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

  // See the DRAFT section below: hidden until the Visitor Pack is on sale.
  // It also contradicts section 2 ("we do not sell tickets"), so publishing
  // both at once would make the document argue with itself in public.
  const { enabled: paymentsEnabled } = getPublicPaymentsFlags();

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
        ...(!paymentsEnabled ? [] : [{
          // ─────────────────────────────────────────────────────────────
          // DRAFT — NOT LEGALLY REVIEWED. Covers the Complete Visitor Pack.
          //
          // ⚠️ CONFLICT WITH SECTION 2 ABOVE: section 2 states that we do
          // not sell tickets or process payments. That is true of the rest
          // of this site, but NOT of the Visitor Pack, where we take payment
          // directly and purchase the official ticket on the customer's
          // behalf. Sections 2 and 3 must be reconciled with this one by a
          // lawyer BEFORE payments are enabled — as written the document
          // contradicts itself.
          //
          // The Visitor Pack is unreachable while PAYMENTS_ENABLED=false,
          // so this section is inert until that flag is flipped.
          // ─────────────────────────────────────────────────────────────
          heading: '10. Complete Visitor Pack (DRAFT — pending legal review)',
          body: [
            'DRAFT: The following applies only to the Complete Visitor Pack, and only once it is available for purchase. It has not yet been reviewed by a lawyer.',
            'The Complete Visitor Pack is a bundle sold by {LEGAL_COMPANY_NAME}. It comprises (a) the official Bahia Palace entry ticket, priced at 100 MAD by Morocco’s Ministry of Culture, which we purchase on your behalf, and (b) our own audio guide, visitor map and support service.',
            'The pack price is not the official entry price. The official ticket portion is passed through at the official rate; the remainder is our service fee. You are free to purchase the official entry ticket yourself at the palace for 100 MAD instead, and we tell you how on our tickets page.',
            'We act as your agent in purchasing the official entry ticket. Entry itself remains subject to the rules of Bahia Palace and the Ministry of Culture, over which we have no control.',
            'If we are unable to obtain your official entry ticket for your chosen date, your remedy is a full refund of the pack price.',
          ],
        }]),
      ]}
    />
  );
}
