import { getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { ContactForm } from '@/components/contact/ContactForm';
import { Info, Clock, Mail, MessageCircle } from 'lucide-react';
import type { Metadata } from 'next';
import { buildAlternates, buildOG } from '@/lib/seo';
import { getWhatsAppNumber, buildWhatsAppUrl } from '@/lib/whatsapp';

export const revalidate = 86400;

interface Props {
  params: Promise<{ locale: string }>;
}

const CONTACT_META: Record<string, { title: string; description: string }> = {
  en: { title: 'Contact Visitbahiapalace.com | Ticket Help & Support', description: 'Questions about your Bahia Palace Marrakech tickets or booking? Reach the visitbahiapalace.com team by email or WhatsApp and we will always reply within 24 hours.' },
  fr: { title: 'Contacter Visitbahiapalace.com | Aide & Support Billets', description: 'Des questions sur vos billets pour le Palais Bahia de Marrakech ou votre réservation ? Contactez-nous par e-mail ou WhatsApp : réponse garantie sous 24 heures.' },
  es: { title: 'Contactar Visitbahiapalace.com | Ayuda & Soporte Entradas', description: '¿Preguntas sobre tus entradas al Palacio Bahia de Marrakech o tu reserva? Contáctanos por correo o WhatsApp y respondemos siempre en menos de 24 horas.' },
  de: { title: 'Visitbahiapalace.com Kontakt | Ticket-Hilfe & Support', description: 'Haben Sie Fragen zu Ihren Bahia Palast Tickets für Marrakesch oder Ihrer Buchung? Kontaktieren Sie uns per E-Mail oder WhatsApp: Antwort innerhalb von 24 Stunden.' },
  it: { title: 'Contatta Visitbahiapalace.com | Supporto Biglietti Bahia', description: 'Hai domande sui biglietti per il Palazzo Bahia di Marrakech o sulla prenotazione? Scrivici via email o WhatsApp e il nostro team risponde entro 24 ore.' },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = CONTACT_META[locale] ?? CONTACT_META.en;
  return {
    title: meta.title,
    description: meta.description,
    alternates: buildAlternates(locale, '/contact'),
    openGraph: buildOG(meta.title, meta.description, locale, '/contact'),
  };
}

export default async function ContactPage() {
  const t  = await getTranslations('contactPage');
  const tb = await getTranslations('breadcrumb');
  const whatsappNumber = getWhatsAppNumber();
  const whatsappUrl    = whatsappNumber
    ? buildWhatsAppUrl(whatsappNumber, 'Hi! I have a question about Bahia Palace tickets.')
    : null;

  return (
    <div className="min-h-screen bg-[#1C1108]">
      {/* Page header */}
      <div className="bg-[#251A0F] border-b border-[rgba(232,163,61,0.15)] text-white px-6 py-12 md:px-10">
        <div className="max-w-5xl mx-auto">
          <Breadcrumb variant="light" items={[
            { label: tb('home'), href: '/' },
            { label: tb('contact') },
          ]} />
          <h1
            className="mt-6 font-bold text-white"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}
          >
            {t('title')}
          </h1>
          <p className="mt-2 text-white/75 text-lg">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-[#251A0F] rounded-2xl border border-[rgba(232,163,61,0.13)] shadow-[0_4px_24px_rgba(0,0,0,0.3)] p-8">
              <ContactForm />
            </div>

            {/* WhatsApp — hidden until a real number is configured */}
            {whatsappUrl && (
              <div className="mt-6 bg-[#25D366]/08 border border-[#25D366]/20 rounded-2xl p-6 text-center">
                <p className="text-sm font-semibold text-[#F5E8CC] mb-1">{t('orWhatsapp')}</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#20B858] transition-colors mt-3"
                >
                  <MessageCircle size={16} />
                  {t('whatsappBtn')}
                </a>
              </div>
            )}
          </div>

          {/* Info sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#251A0F] rounded-2xl border border-[rgba(232,163,61,0.13)] p-6">
              <div className="flex gap-3 mb-5">
                <Info size={18} className="text-[#C4452D] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#F5E8CC] mb-1">{t('addressTitle')}</p>
                  <p className="text-sm text-[#C4A882] leading-relaxed">{t('addressVal')}</p>
                </div>
              </div>
              <div className="border-t border-[rgba(232,163,61,0.12)] pt-5 flex gap-3 mb-5">
                <Clock size={18} className="text-[#C4452D] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#F5E8CC] mb-1">{t('hoursTitle')}</p>
                  <p className="text-sm text-[#C4A882]">{t('hoursVal')}</p>
                </div>
              </div>
              <div className="border-t border-[rgba(232,163,61,0.12)] pt-5 flex gap-3">
                <Mail size={18} className="text-[#C4452D] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#F5E8CC] mb-1">{t('emailTitle')}</p>
                  <a
                    href={`mailto:${t('emailVal')}`}
                    className="text-sm text-[#C4452D] hover:underline"
                  >
                    {t('emailVal')}
                  </a>
                </div>
              </div>
            </div>

            {/* Response time badge */}
            <div className="bg-[#8FA63C]/08 border border-[#8FA63C]/20 rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-[#8FA63C]">⚡ We reply within 24 hours</p>
              <p className="text-xs text-[#C4A882] mt-1">WhatsApp responses are faster — usually within minutes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
