import { getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { ContactForm } from '@/components/contact/ContactForm';
import { MapPin, Clock, Mail, MessageCircle } from 'lucide-react';
import type { Metadata } from 'next';
import { buildAlternates, buildOG } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contactPage' });
  const title = `${t('title')} — Bahia Palace Tickets`;
  const description = t('subtitle') as string;
  return {
    title,
    description,
    alternates: buildAlternates(locale, '/contact'),
    openGraph: buildOG(title, description, locale, '/contact'),
  };
}

export default async function ContactPage() {
  const t  = await getTranslations('contactPage');
  const tb = await getTranslations('breadcrumb');
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '212600000000';
  const whatsappMsg    = encodeURIComponent('Hi! I have a question about Bahia Palace tickets.');
  const whatsappUrl    = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

  return (
    <div className="bg-[#FAF3E7] min-h-screen">
      {/* Page header */}
      <div className="bg-[#3D2817] text-white px-6 py-12 md:px-10">
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
            <div className="bg-white rounded-2xl border border-[#E8D5B7] shadow-[0_4px_24px_rgba(61,40,23,0.08)] p-8">
              <ContactForm />
            </div>

            {/* WhatsApp */}
            <div className="mt-6 bg-[#25D366]/8 border border-[#25D366]/20 rounded-2xl p-6 text-center">
              <p className="text-sm font-semibold text-[#3D2817] mb-1">{t('orWhatsapp')}</p>
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
          </div>

          {/* Info sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E8D5B7] p-6">
              <div className="flex gap-3 mb-5">
                <MapPin size={18} className="text-[#C4452D] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#3D2817] mb-1">{t('addressTitle')}</p>
                  <p className="text-sm text-[#5C3D20] leading-relaxed">{t('addressVal')}</p>
                </div>
              </div>
              <div className="border-t border-[#F0E5D0] pt-5 flex gap-3 mb-5">
                <Clock size={18} className="text-[#C4452D] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#3D2817] mb-1">{t('hoursTitle')}</p>
                  <p className="text-sm text-[#5C3D20]">{t('hoursVal')}</p>
                </div>
              </div>
              <div className="border-t border-[#F0E5D0] pt-5 flex gap-3">
                <Mail size={18} className="text-[#C4452D] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#3D2817] mb-1">{t('emailTitle')}</p>
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
            <div className="bg-[#6B7B3A]/8 border border-[#6B7B3A]/20 rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-[#6B7B3A]">⚡ We reply within 24 hours</p>
              <p className="text-xs text-[#5C3D20] mt-1">WhatsApp responses are faster — usually within minutes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
