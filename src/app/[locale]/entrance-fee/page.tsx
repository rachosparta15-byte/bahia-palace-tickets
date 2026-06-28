import { LeadButton } from '@/components/layout/LeadButton';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { buildAlternates, buildOG, BASE, DIGITAL_TICKET_OFFER_EXTRAS } from '@/lib/seo';
import { CheckCircle2, Info, ArrowRight, Tag } from 'lucide-react';
import Image from 'next/image';
import type { Metadata } from 'next';

export const revalidate = 86400;

const META: Record<string, { title: string; description: string }> = {
  en: { title: 'Bahia Palace Ticket Price 2026 | 100 MAD — Official Fee', description: 'Bahia Palace ticket price 2026: 100 MAD per adult, children under 7 free. Discover the latest Ramadan rate, group discounts and the skip-the-line option.' },
  fr: { title: 'Prix Entrée Palais Bahia 2026 | Tarifs en MAD & EUR', description: 'Prix d\'entrée Palais Bahia Marrakech 2026 : 100 MAD par adulte étranger. Enfants de moins de 7 ans gratuits. Tarif Ramadan et option coupe-file disponibles.' },
  es: { title: 'Precio Entrada Palacio Bahia 2026 | Tarifas en MAD y EUR', description: 'Precio de entrada al Palacio Bahia de Marrakech 2026: 100 MAD para adultos extranjeros. Niños menores de 7 años gratis. Tarifa Ramadán y opción sin cola.' },
  de: { title: 'Bahia Palast Eintrittspreis 2026 | Aktuelle Ticketpreise', description: 'Eintrittspreis Bahia Palast Marrakesch 2026: 100 MAD für ausländische Erwachsene. Kinder unter 7 Jahren frei. Ramadan-Tarif und Skip-the-Line-Option verfügbar.' },
  it: { title: 'Prezzo Biglietto Palazzo Bahia 2026 | Tariffe Aggiornate', description: 'Biglietto d\'ingresso Palazzo Bahia Marrakech 2026: 100 MAD per adulti stranieri. Bambini sotto i 7 anni gratuiti. Tariffa Ramadan e opzione salta-fila disponibili.' },
};

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = META[locale] ?? META.en;
  return {
    title: meta.title,
    description: meta.description,
    keywords: ['bahia palace entrance fee', 'bahia palace ticket price', 'bahia palace cost', 'how much is bahia palace', 'bahia palace admission fee', 'bahia palace price 2026', 'bahia palace MAD'],
    alternates: buildAlternates(locale, '/entrance-fee'),
    openGraph: buildOG(meta.title, meta.description, locale, '/entrance-fee'),
  };
}

function getPriceSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: 'Bahia Palace',
    url: `${BASE}/${locale}/entrance-fee`,
    offers: [
      { '@type': 'Offer', name: 'Standard Entry (gate)',     price: '10', priceCurrency: 'USD', availability: 'https://schema.org/InStock', ...DIGITAL_TICKET_OFFER_EXTRAS },
      { '@type': 'Offer', name: 'Skip-the-Line (online)',   price: '14', priceCurrency: 'USD', availability: 'https://schema.org/InStock', ...DIGITAL_TICKET_OFFER_EXTRAS },
      { '@type': 'Offer', name: 'Guided Tour (online)',      price: '28', priceCurrency: 'USD', availability: 'https://schema.org/InStock', ...DIGITAL_TICKET_OFFER_EXTRAS },
      { '@type': 'Offer', name: 'Private Tour (online)',     price: '49', priceCurrency: 'USD', availability: 'https://schema.org/InStock', ...DIGITAL_TICKET_OFFER_EXTRAS },
    ],
  };
}

export default async function EntranceFeePage({ params }: Props) {
  const { locale } = await params;
  return (
    <div className="min-h-screen bg-[#1C1108]">
      <JsonLd data={getPriceSchema(locale)} />

      {/* Header */}
      <div className="bg-[#251A0F] border-b border-[rgba(232,163,61,0.15)] text-white px-6 py-12 md:px-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1">
            <Breadcrumb variant="light" items={[
              { label: 'Home', href: '/' },
              { label: 'Tickets', href: '/tickets' },
              { label: 'Entrance Fee' },
            ]} />
            <h1 className="mt-6 font-bold text-white" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
              Bahia Palace Entrance Fee 2026
            </h1>
            <p className="mt-3 text-white/75 text-lg max-w-2xl">
              Current ticket prices for Bahia Palace Marrakech — updated for 2026. Compare standard entry, skip-the-line, and guided tour costs in MAD and USD.
            </p>
          </div>
          <div className="md:w-72 rounded-2xl overflow-hidden shrink-0">
            <Image
              src="/images/gallery/bahia-palace-grand-doorway-zellige.webp"
              alt="Grand decorated doorway with blue zellige tilework, Bahia Palace Marrakech"
              width={600} height={400}
              className="w-full h-48 md:h-64 object-cover"
              loading="lazy"
              sizes="(max-width:768px) 100vw, 18rem"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

        {/* Price cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: 'Standard Entry', mad: '100 MAD', usd: '≈ $10 USD', note: 'At the gate — queue included', highlight: false },
            { label: 'Skip-the-Line', mad: 'From $14', usd: 'Incl. entry + service fee', note: 'Walk straight in, no waiting', highlight: true },
            { label: 'Guided Tour', mad: 'From $28', usd: 'Incl. entry + expert guide', note: 'Entry + 90-min English tour', highlight: false },
          ].map(({ label, mad, usd, note, highlight }) => (
            <div key={label} className={`rounded-2xl border p-6 text-center ${highlight ? 'bg-[#C4452D] border-[#C4452D] text-white shadow-[0_8px_32px_rgba(196,69,45,0.3)]' : 'bg-[#251A0F] border-[rgba(232,163,61,0.13)]'}`}>
              <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${highlight ? 'text-white/70' : 'text-[#C4A882]'}`}>{label}</p>
              <p className={`text-3xl font-bold mb-1 ${highlight ? 'text-white' : 'text-[#C4452D]'}`} style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>{mad}</p>
              <p className={`text-sm mb-3 ${highlight ? 'text-white/80' : 'text-[#C4A882]'}`}>{usd}</p>
              <p className={`text-xs ${highlight ? 'text-white/60' : 'text-[#C4A882]'}`}>{note}</p>
            </div>
          ))}
        </div>

        {/* Detailed breakdown */}
        <div className="bg-[#251A0F] rounded-2xl border border-[rgba(232,163,61,0.15)] overflow-hidden">
          <div className="bg-[#2E1F12] px-6 py-4">
            <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Bahia Palace Ticket Price Breakdown 2026
            </h2>
          </div>
          <div className="divide-y divide-[rgba(232,163,61,0.10)]">
            {[
              { category: 'Foreign adults', price: '100 MAD', usd: '~$10', note: 'Gate price — long queues possible' },
              { category: 'Foreign children (7–13)', price: '50 MAD', usd: '~$5', note: 'Official Ministry of Culture rate' },
              { category: 'Children under 7', price: 'Free', usd: 'Free', note: 'No ticket required' },
              { category: 'Moroccan adults', price: '30 MAD', usd: '~$3', note: 'Valid Moroccan ID required' },
              { category: 'Skip-the-Line (online)', price: 'From $14', usd: '$14', note: 'Incl. 100 MAD entry + service fee' },
              { category: 'Guided Tour (online)', price: 'From $28', usd: '$28', note: 'Entry + 90-min expert English guide' },
              { category: 'Private Tour (online)', price: 'From $49', usd: '$49', note: 'Entry + exclusive private guide' },
            ].map(({ category, price, note }) => (
              <div key={category} className="grid grid-cols-3 px-6 py-4 text-sm">
                <span className="font-semibold text-[#F5E8CC]">{category}</span>
                <span className="text-[#C4452D] font-bold tabular-nums">{price}</span>
                <span className="text-[#C4A882]">{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#8FA63C]/08 rounded-xl p-5 border border-[#8FA63C]/20">
            <div className="flex items-center gap-2 mb-3">
              <Info size={16} className="text-[#8FA63C]" />
              <h3 className="font-bold text-[#F5E8CC] text-sm">Why is the online price higher?</h3>
            </div>
            <p className="text-sm text-[#C4A882] leading-relaxed">
              The <strong className="text-[#F5E8CC]">100 MAD gate price</strong> covers standard entry with potentially 1–2 hour queues. Our online prices include the <strong className="text-[#F5E8CC]">100 MAD official entrance fee</strong> plus an independent booking service fee for skip-the-line access, instant mobile confirmation, free cancellation, and English-language support. We are an independent ticketing service, not affiliated with the Moroccan government.
            </p>
          </div>
          <div className="bg-[#E8A33D]/08 rounded-xl p-5 border border-[#E8A33D]/20">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={16} className="text-[#E8A33D]" />
              <h3 className="font-bold text-[#F5E8CC] text-sm">How much is Bahia Palace in MAD?</h3>
            </div>
            <p className="text-sm text-[#C4A882] leading-relaxed">
              The <strong className="text-[#F5E8CC]">Bahia Palace entrance fee</strong> is <strong className="text-[#F5E8CC]">100 MAD</strong> (approximately $10 USD or €9 EUR at 2026 exchange rates) for foreign adult visitors. Moroccan nationals pay 30 MAD. This is the price set by the Moroccan Ministry of Culture.
            </p>
          </div>
        </div>

        {/* What's included */}
        <div>
          <h2 className="text-2xl font-bold text-[#F5E8CC] mb-5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            What&apos;s Included in the Bahia Palace Admission Fee?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Access to all 150 rooms and courtyards',
              'The Grand Courtyard (Cour d\'Honneur)',
              'The Small Riad and ornamental gardens',
              'Ba Ahmed\'s private apartments',
              'The historic harem quarters',
              'Painted cedar wood ceilings and zellige tiles',
            ].map(item => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-[#C4A882]">
                <CheckCircle2 size={14} className="text-[#8FA63C] shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Entrance sign photo */}
        <div className="rounded-2xl overflow-hidden">
          <Image
            src="/images/gallery/bahia-palace-entrance-sign-marrakech.webp"
            alt="Official Bahia Palace entrance sign (Palais Bahia), Marrakech"
            width={1200} height={600}
            className="w-full h-56 object-cover"
            loading="lazy"
            sizes="(max-width:768px) 100vw, 896px"
          />
        </div>

        {/* CTA */}
        <div className="bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-8 text-center">
          <p className="text-[#E8A33D] text-xs font-bold uppercase tracking-widest mb-2">Skip the 2-hour queue</p>
          <h2 className="text-[#F5E8CC] font-bold text-2xl mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Book Bahia Palace Tickets Online
          </h2>
          <p className="text-[#C4A882] text-sm mb-5 max-w-md mx-auto">
            Secure your entry in advance. Instant confirmation, free cancellation up to 24h before.
          </p>
          <LeadButton ticketType="skip-the-line" className="inline-flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            See All Ticket Options <ArrowRight size={16} />
          </LeadButton>
        </div>

        {/* External authority link */}
        <p className="text-xs text-[#C4A882] text-center">
          Official palace information:{' '}
          <a href="https://en.wikipedia.org/wiki/Bahia_Palace" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#F5E8CC]">
            Bahia Palace on Wikipedia
          </a>
        </p>
      </div>
    </div>
  );
}
