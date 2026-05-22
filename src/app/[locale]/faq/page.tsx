import { getTranslations } from 'next-intl/server';
import { BOOKING_URL } from '@/lib/booking';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { buildAlternates, buildOG } from '@/lib/seo';
import { MessageCircle, ChevronDown, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

const META: Record<string, { title: string; description: string }> = {
  en: { title: 'Bahia Palace FAQ 2026 | Top Questions About Tickets & Visiting', description: 'Answers to the most common questions about Bahia Palace: ticket prices, opening hours, skip-the-line access, guided tours, how to get there, and what to expect.' },
  fr: { title: 'FAQ Palais Bahia 2026 | Questions Fréquentes sur les Billets & Visites', description: 'Réponses aux questions les plus fréquentes sur le Palais Bahia : prix des billets, horaires, coupe-file, visites guidées et conseils pratiques.' },
  es: { title: 'FAQ Palacio Bahia 2026 | Preguntas Frecuentes sobre Entradas & Visitas', description: 'Respuestas a las preguntas más frecuentes sobre el Palacio Bahia: precios, horarios, acceso sin cola, visitas guiadas y consejos prácticos.' },
  de: { title: 'Bahia Palast FAQ 2026 | Häufige Fragen zu Tickets & Besuch', description: 'Antworten auf die häufigsten Fragen zum Bahia Palast: Ticketpreise, Öffnungszeiten, Warteschlangen-Umgehung, Führungen und praktische Tipps.' },
  it: { title: 'FAQ Palazzo Bahia 2026 | Domande Frequenti su Biglietti & Visita', description: 'Risposte alle domande più frequenti sul Palazzo Bahia: prezzi biglietti, orari, accesso prioritario, visite guidate e consigli pratici.' },
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
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '212600000000';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi! I have a question about Bahia Palace tickets.')}`;

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
    <div className="bg-[#FAF3E7] min-h-screen">
      <JsonLd data={faqSchema} />

      <div className="bg-[#3D2817] text-white px-6 py-12 md:px-10">
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
              className="group bg-white rounded-xl border border-[#E8D5B7] overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-3 px-6 py-5 cursor-pointer list-none font-semibold text-[#3D2817] hover:text-[#C4452D] transition-colors">
                <span className="text-sm leading-snug">{item.question}</span>
                <ChevronDown size={15} className="shrink-0 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 pt-4 text-sm text-[#5C3D20] leading-relaxed border-t border-[#F0E5D0]">
                {item.answer}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-10 bg-[#3D2817] rounded-2xl p-8 text-center">
          <p className="text-[#E8A33D] text-xs font-bold uppercase tracking-widest mb-2">{t('ctaSkip')}</p>
          <h2 className="text-white font-bold text-2xl mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('ctaTitle')}
          </h2>
          <p className="text-white/70 text-sm mb-5 max-w-md mx-auto">{t('ctaBody')}</p>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            {t('ctaBtn')} <ArrowRight size={16} />
          </a>
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-[#E8D5B7] p-8 text-center">
          <h2 className="text-xl font-bold text-[#3D2817] mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('stillNeedHelp')}
          </h2>
          <p className="text-sm text-[#5C3D20] mb-4">{t('teamAvail')}</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#25D366] font-semibold hover:underline"
          >
            <MessageCircle size={16} />
            {t('whatsappUs')}
          </a>
        </div>
      </div>
    </div>
  );
}
