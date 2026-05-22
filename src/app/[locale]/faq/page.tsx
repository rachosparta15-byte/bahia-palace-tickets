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

const faqs = [
  {
    question: 'Is Bahia Palace worth visiting in 2026?',
    answer: 'Absolutely. Bahia Palace is one of the best-preserved examples of 19th-century Moroccan architecture. With 150 rooms, intricate zellige tilework, hand-painted cedar ceilings, and lush inner gardens, it offers an unmatched glimpse into Moroccan royal life. Most visitors rate it as the highlight of their Marrakech trip. At 70 MAD (≈$7), it\'s exceptional value — and with a skip-the-line ticket, the experience becomes completely seamless.',
  },
  {
    question: 'How much does Bahia Palace cost to enter?',
    answer: 'The official gate entrance fee is 70 MAD (approximately $7 USD or €6.50 EUR). Children under 12 enter free, and students with a valid ID pay 35 MAD. If you book online, skip-the-line tickets start from $10 — this includes priority entry and avoids queues that can reach 1–2 hours during peak season. The online price reflects added convenience, not a price increase.',
  },
  {
    question: 'How long do you need at Bahia Palace?',
    answer: 'Most visitors spend 1 to 1.5 hours exploring Bahia Palace independently. With a guided tour, expect 1.5 to 2 hours as your guide brings the palace\'s history to life with stories about Ba Ahmed, the harem, and architectural details you\'d otherwise miss. Private tours are flexible and can last up to 2.5 hours. We recommend arriving early (9–10 AM) to enjoy the space without crowds.',
  },
  {
    question: 'When is the best time to visit Bahia Palace?',
    answer: 'The best time is 9:00–10:30 AM when the palace first opens — fewest visitors and soft morning light ideal for photography. Avoid 10:30 AM–2:00 PM when tour groups arrive in force. For seasons: spring (March–May) and autumn (September–November) offer the most pleasant temperatures at 20–28°C. Summers are very hot (35–42°C) so visit early morning. Ramadan hours typically end at 4 PM.',
  },
  {
    question: 'Is Bahia Palace free to enter?',
    answer: 'Bahia Palace is not free for adult visitors. The entrance fee is 70 MAD (≈$7 USD). Children under 12 enter for free, and students with a valid ID pay 35 MAD (≈$3.50). Photography is included in the ticket price with no extra charges. The palace is managed by Morocco\'s Ministry of Culture, and the admission fee contributes to its ongoing preservation and restoration.',
  },
  {
    question: 'How do I get to Bahia Palace from Jemaa el-Fnaa?',
    answer: 'Bahia Palace is a 10–15 minute walk south from Jemaa el-Fnaa through the medina. Follow the signs for "Palais Bahia" or use Google Maps. A petit taxi (red taxis) takes about 5 minutes and costs 15–25 MAD — always insist on the meter. A calèche (horse carriage) takes 10 minutes and costs 50–80 MAD. The palace address is Rue Riad Zitoun el Jedid, Marrakech Medina.',
  },
  {
    question: 'Are guided tours worth it at Bahia Palace?',
    answer: 'Yes, especially for a first visit. Bahia Palace has 150 rooms and historical layers that are invisible without explanation. A guide will tell you about Ba Ahmed\'s political rise, why the palace was looted overnight after his death in 1900, and identify architectural details most visitors walk past. Our certified guides speak English, French, Spanish, and German. Group tours (max 12 people) start from $10.',
  },
  {
    question: 'What is Bahia Palace famous for?',
    answer: 'Bahia Palace is famous for its extraordinary Moroccan craftsmanship — particularly the hand-cut zellige tile mosaics, elaborately carved stucco plasterwork, and painted cedar wood ceilings. It is one of the largest palaces in Marrakech at 8 hectares with 150 rooms. Built by Grand Vizier Ba Ahmed between 1894 and 1900, it tells a fascinating story of power, intrigue, and beauty. The palace has appeared in numerous films about Morocco.',
  },
  {
    question: 'Can you visit Bahia Palace without a guide?',
    answer: 'Yes, Bahia Palace can be visited independently with a standard or skip-the-line ticket. The palace is entirely self-guided with information panels at key points. Most visitors explore comfortably in 1–1.5 hours at their own pace. However, without a guide, many historical and architectural details are easy to miss. No official audio guide is available on-site, so booking a guided tour is recommended if you want the full story.',
  },
  {
    question: 'Is Bahia Palace suitable for children?',
    answer: 'Yes, Bahia Palace is very family-friendly. Children under 12 enter free. The open courtyards, colourful tiles, and garden spaces fascinate younger visitors. The grounds are mostly flat and accessible with a pushchair or wheelchair. The visit duration (1–1.5 hours) is manageable even for young children. Early morning visits are best for families to avoid the busiest periods and the heat during summer months.',
  },
  {
    question: 'What should I wear at Bahia Palace?',
    answer: 'Bahia Palace does not enforce a strict dress code, but modest attire is respectful and recommended. Covering shoulders and knees is appropriate given the palace\'s cultural significance. Comfortable walking shoes are essential — the floors mix polished marble, zellige tiles, and stone, which can be slippery. Sunscreen is advisable as the grand courtyard is open-air. A light layer is useful in cooler months (December–February) when temperatures drop to 10–15°C.',
  },
  {
    question: 'Is photography allowed inside Bahia Palace?',
    answer: 'Yes, photography is freely allowed throughout Bahia Palace for personal use at no extra charge. The palace is one of the most photogenic in Morocco — the painted cedar ceilings, tiled courtyards, and ornate doorways make for spectacular images. The best light for photography is early morning (9–10:30 AM). Tripods and professional camera equipment (with lighting rigs) require prior authorisation from the palace administration.',
  },
  {
    question: 'How do I book skip-the-line tickets for Bahia Palace online?',
    answer: 'Select your visit date and number of guests on this website, choose the Skip-the-Line option, and complete your secure payment via Stripe. You\'ll receive your ticket by email within seconds — a QR code to show on your phone or print at the palace entrance. No need to queue at the ticket booth. Online booking also guarantees your entry on high-demand days when the gate can have 1–2 hour queues. Free cancellation up to 24 hours before your visit.',
  },
  {
    question: 'Can I cancel or change my Bahia Palace ticket?',
    answer: 'Yes, all tickets booked through our platform include free cancellation up to 24 hours before your scheduled visit date. To cancel, click the link in your booking confirmation email or contact us via WhatsApp. Refunds are processed to your original payment method within 5–7 business days. Cancellations made less than 24 hours before the visit are non-refundable. Date changes (reschedules) are free and can be made up to 24 hours in advance.',
  },
  {
    question: 'What else is near Bahia Palace?',
    answer: 'Bahia Palace is surrounded by unmissable Marrakech attractions. The Saadian Tombs are just a 7-minute walk — stunning 16th-century royal mausoleums. El Badi Palace ruins are 10 minutes on foot. Jemaa el-Fnaa square is a 15-minute walk north. The Mellah (Jewish Quarter) is 4 minutes away. Most visitors combine Bahia Palace with the Saadian Tombs in a half-day, then explore the souks and Jemaa el-Fnaa in the afternoon.',
  },
];

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  const meta = META[locale] ?? META.en;
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
          <Breadcrumb variant="light" items={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]} />
          <h1 className="mt-6 font-bold text-white" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
            Bahia Palace — Frequently Asked Questions
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

        {/* CTA */}
        <div className="mt-10 bg-[#3D2817] rounded-2xl p-8 text-center">
          <p className="text-[#E8A33D] text-xs font-bold uppercase tracking-widest mb-2">Skip the 2-hour queue</p>
          <h2 className="text-white font-bold text-2xl mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Book Bahia Palace Tickets Online
          </h2>
          <p className="text-white/70 text-sm mb-5 max-w-md mx-auto">
            Instant confirmation · Free cancellation · Mobile tickets accepted
          </p>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            See All Ticket Options <ArrowRight size={16} />
          </a>
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-6 bg-white rounded-2xl border border-[#E8D5B7] p-8 text-center">
          <h2 className="text-xl font-bold text-[#3D2817] mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Still have a question?
          </h2>
          <p className="text-sm text-[#5C3D20] mb-4">Our team is available daily 8 AM – 8 PM Marrakech time.</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#25D366] font-semibold hover:underline"
          >
            <MessageCircle size={16} />
            WhatsApp us for instant help →
          </a>
        </div>
      </div>
    </div>
  );
}
