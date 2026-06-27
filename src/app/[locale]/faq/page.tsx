import { getTranslations } from 'next-intl/server';
import { LeadButton } from '@/components/layout/LeadButton';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { buildAlternates, buildOG } from '@/lib/seo';
import { MessageCircle, ChevronDown, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getWhatsAppNumber, buildWhatsAppUrl } from '@/lib/whatsapp';

export const revalidate = 86400;

const META: Record<string, { title: string; description: string }> = {
  en: { title: 'Bahia Palace FAQ 2026 | Tickets, Hours & Visit Answers', description: 'Find answers about Bahia Palace: ticket prices, opening hours, skip-the-line access, guided tours, how to get there, and what to expect on your visit.' },
  fr: { title: 'FAQ Palais Bahia 2026 | Billets, Horaires & Conseils', description: 'Réponses aux questions fréquentes sur le Palais Bahia de Marrakech : tarifs, horaires, coupe-file, visites guidées et conseils pratiques pour préparer votre visite.' },
  es: { title: 'FAQ Palacio Bahia 2026 | Entradas, Horarios & Consejos', description: 'Las preguntas más frecuentes sobre el Palacio Bahia de Marrakech: precios, horarios, acceso sin cola, visitas guiadas y todos los consejos para tu visita en 2026.' },
  de: { title: 'Bahia Palast FAQ 2026 | Häufige Fragen zu Tickets & Besuch', description: 'Antworten auf die häufigsten Fragen zum Bahia Palast in Marrakesch: Ticketpreise, Öffnungszeiten, Schlangen umgehen, Führungen und praktische Reisetipps.' },
  it: { title: 'FAQ Palazzo Bahia 2026 | Biglietti, Orari e Consigli', description: 'Risposte alle domande frequenti sul Palazzo Bahia di Marrakech: prezzi biglietti, orari di apertura, come evitare file, visite guidate e consigli pratici.' },
};

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = META[locale] ?? META.en;
  return {
    title: meta.title,
    description: meta.description,
    keywords: ['bahia palace faq', 'bahia palace tickets questions', 'bahia palace entrance fee', 'is bahia palace worth visiting', 'bahia palace opening hours', 'bahia palace guided tour', 'skip the line bahia palace', 'how to get to bahia palace'],
    alternates: buildAlternates(locale, '/faq'),
    openGraph: buildOG(meta.title, meta.description, locale, '/faq'),
  };
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  const meta = META[locale] ?? META.en;
  const t  = await getTranslations('faqPage');
  const tb = await getTranslations('breadcrumb');

  const faqs = t.raw('items') as Array<{ question: string; answer: string }>;
  const whatsappNumber = getWhatsAppNumber();
  const whatsappUrl = whatsappNumber
    ? buildWhatsAppUrl(whatsappNumber, 'Hi! I have a question about Bahia Palace tickets.')
    : null;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };

  return (
    <div className="min-h-screen bg-[#1C1108]">
      <JsonLd data={faqSchema} />

      <div className="bg-[#251A0F] border-b border-[rgba(232,163,61,0.15)] text-white px-6 py-12 md:px-10">
        <div className="max-w-3xl mx-auto">
          <Breadcrumb variant="light" items={[{ label: tb('home'), href: '/' }, { label: tb('faq') }]} />
          <h1 className="mt-6 font-bold text-white" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
            {t('title')}
          </h1>
          <p className="mt-3 text-white/75 text-lg max-w-2xl">
            {meta.description}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <details
              key={i}
              className="group bg-[#251A0F] rounded-xl border border-[rgba(232,163,61,0.13)] overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-3 px-6 py-5 cursor-pointer list-none font-semibold text-[#F5E8CC] hover:text-[#E8A33D] transition-colors">
                <span className="text-sm leading-snug">{item.question}</span>
                <ChevronDown size={15} className="shrink-0 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 pt-4 text-sm text-[#C4A882] leading-relaxed border-t border-[rgba(232,163,61,0.12)]">
                {item.answer}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-10 bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-8 text-center">
          <p className="text-[#E8A33D] text-xs font-bold uppercase tracking-widest mb-2">{t('ctaSkip')}</p>
          <h2 className="text-white font-bold text-2xl mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('ctaTitle')}
          </h2>
          <p className="text-white/70 text-sm mb-5 max-w-md mx-auto">{t('ctaBody')}</p>
          <LeadButton ticketType="skip-the-line" className="inline-flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            {t('ctaBtn')} <ArrowRight size={16} />
          </LeadButton>
        </div>

        <div className="mt-6 bg-[#251A0F] rounded-2xl border border-[rgba(232,163,61,0.13)] p-8 text-center">
          <h2 className="text-xl font-bold text-[#F5E8CC] mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('stillNeedHelp')}
          </h2>
          <p className="text-sm text-[#C4A882] mb-4">{t('teamAvail')}</p>
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#25D366] font-semibold hover:underline"
            >
              <MessageCircle size={16} />
              {t('whatsappUs')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
