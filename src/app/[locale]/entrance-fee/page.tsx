import { BOOKING_URL } from '@/lib/booking';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { buildAlternates, buildOG } from '@/lib/seo';
import { CheckCircle2, Info, ArrowRight, Tag } from 'lucide-react';
import type { Metadata } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://visitbahiapalace.com';

const META: Record<string, { title: string; description: string }> = {
  en: { title: 'Bahia Palace Entrance Fee 2026 | Current Ticket Prices in MAD & USD', description: 'Bahia Palace entrance fee is 70 MAD (≈$7 USD) in 2026. Compare ticket prices, discounts for students, children, and group rates. Updated pricing guide.' },
  fr: { title: 'Prix Entrée Palais Bahia 2026 | Tarifs en MAD & EUR', description: 'Le prix d\'entrée du Palais Bahia est 70 MAD (≈7€) en 2026. Tarifs étudiants, enfants, groupes. Guide complet des tarifs mis à jour.' },
  es: { title: 'Precio Entrada Palacio Bahia 2026 | Tarifas en MAD y EUR', description: 'La entrada al Palacio Bahia cuesta 70 MAD (≈7€) en 2026. Descuentos para estudiantes, niños y grupos. Guía de precios actualizada.' },
  de: { title: 'Bahia Palast Eintrittspreis 2026 | Aktuelle Ticketpreise', description: 'Der Eintrittspreis für den Bahia Palast beträgt 70 MAD (≈7€) im Jahr 2026. Rabatte für Studenten, Kinder und Gruppen.' },
  it: { title: 'Prezzo Biglietto Palazzo Bahia 2026 | Tariffe Aggiornate', description: 'Il biglietto d\'ingresso al Palazzo Bahia costa 70 MAD (≈7€) nel 2026. Sconti per studenti, bambini e gruppi. Guida prezzi aggiornata.' },
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

const priceSchema = {
  '@context': 'https://schema.org',
  '@type': 'TouristAttraction',
  name: 'Bahia Palace',
  url: `${BASE}/en/entrance-fee`,
  offers: [
    { '@type': 'Offer', name: 'Standard Entry', price: '7', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    { '@type': 'Offer', name: 'Skip-the-Line Entry', price: '10', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    { '@type': 'Offer', name: 'Guided Tour', price: '10', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
  ],
};

export default async function EntranceFeePage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="bg-[#FAF3E7] min-h-screen">
      <JsonLd data={priceSchema} />

      {/* Header */}
      <div className="bg-[#3D2817] text-white px-6 py-12 md:px-10">
        <div className="max-w-4xl mx-auto">
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
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

        {/* Price cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: 'Standard Entry', mad: '70 MAD', usd: '≈ $7 USD', note: 'At the gate — queue included', highlight: false },
            { label: 'Skip-the-Line', mad: 'From $10', usd: 'Online booking', note: 'Walk straight in, no waiting', highlight: true },
            { label: 'Guided Tour', mad: 'From $10', usd: 'Expert guide included', note: 'Includes entry + 90-min tour', highlight: false },
          ].map(({ label, mad, usd, note, highlight }) => (
            <div key={label} className={`rounded-2xl border p-6 text-center ${highlight ? 'bg-[#C4452D] border-[#C4452D] text-white shadow-[0_8px_32px_rgba(196,69,45,0.3)]' : 'bg-white border-[#E8D5B7]'}`}>
              <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${highlight ? 'text-white/70' : 'text-[#8B6344]'}`}>{label}</p>
              <p className={`text-3xl font-bold mb-1 ${highlight ? 'text-white' : 'text-[#C4452D]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>{mad}</p>
              <p className={`text-sm mb-3 ${highlight ? 'text-white/80' : 'text-[#5C3D20]'}`}>{usd}</p>
              <p className={`text-xs ${highlight ? 'text-white/60' : 'text-[#8B6344]'}`}>{note}</p>
            </div>
          ))}
        </div>

        {/* Detailed breakdown */}
        <div className="bg-white rounded-2xl border border-[#E8D5B7] overflow-hidden">
          <div className="bg-[#3D2817] px-6 py-4">
            <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Bahia Palace Ticket Price Breakdown 2026
            </h2>
          </div>
          <div className="divide-y divide-[#E8D5B7]">
            {[
              { category: 'Adults (standard)', price: '70 MAD', usd: '$7', note: 'Gate price — long queues possible' },
              { category: 'Children under 12', price: 'Free', usd: 'Free', note: 'No ticket required' },
              { category: 'Students (with ID)', price: '35 MAD', usd: '~$3.50', note: 'Valid student card required' },
              { category: 'Skip-the-Line (online)', price: 'From $10', usd: '$10', note: 'Instant entry, no queue' },
              { category: 'Guided Tour (online)', price: 'From $10', usd: '$10', note: 'Entry + expert English guide' },
              { category: 'Private Tour', price: 'From $10', usd: '$10', note: 'Exclusive private guide' },
            ].map(({ category, price, usd, note }) => (
              <div key={category} className="grid grid-cols-3 px-6 py-4 text-sm">
                <span className="font-semibold text-[#3D2817]">{category}</span>
                <span className="text-[#C4452D] font-bold tabular-nums">{price}</span>
                <span className="text-[#5C3D20]">{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#6B7B3A]/10 rounded-xl p-5 border border-[#6B7B3A]/20">
            <div className="flex items-center gap-2 mb-3">
              <Info size={16} className="text-[#6B7B3A]" />
              <h3 className="font-bold text-[#3D2817] text-sm">Why is the online price higher?</h3>
            </div>
            <p className="text-sm text-[#5C3D20] leading-relaxed">
              The <strong>70 MAD gate price</strong> covers standard entry with potentially 1–2 hour queues. Our online tickets include <strong>skip-the-line access</strong>, instant mobile confirmation, free cancellation, and English-language support — all included in the service fee.
            </p>
          </div>
          <div className="bg-[#E8A33D]/10 rounded-xl p-5 border border-[#E8A33D]/20">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={16} className="text-[#E8A33D]" />
              <h3 className="font-bold text-[#3D2817] text-sm">How much is Bahia Palace in MAD?</h3>
            </div>
            <p className="text-sm text-[#5C3D20] leading-relaxed">
              The official <strong>Bahia Palace entrance fee</strong> is <strong>70 MAD</strong> (approximately $7 USD or €6.50 EUR at 2026 exchange rates). This is the price set by the Moroccan Ministry of Culture and applies to all adult foreign visitors.
            </p>
          </div>
        </div>

        {/* What's included */}
        <div>
          <h2 className="text-2xl font-bold text-[#3D2817] mb-5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            What's Included in the Bahia Palace Admission Fee?
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
              <div key={item} className="flex items-center gap-2.5 text-sm text-[#5C3D20]">
                <CheckCircle2 size={14} className="text-[#6B7B3A] shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#3D2817] rounded-2xl p-8 text-center">
          <p className="text-[#E8A33D] text-xs font-bold uppercase tracking-widest mb-2">Skip the 2-hour queue</p>
          <h2 className="text-white font-bold text-2xl mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Book Bahia Palace Tickets Online
          </h2>
          <p className="text-white/70 text-sm mb-5 max-w-md mx-auto">
            Secure your entry in advance. Instant confirmation, free cancellation up to 24h before.
          </p>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            See All Ticket Options <ArrowRight size={16} />
          </a>
        </div>

        {/* External authority link */}
        <p className="text-xs text-[#8B6344] text-center">
          Official palace information:{' '}
          <a href="https://en.wikipedia.org/wiki/Bahia_Palace" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#3D2817]">
            Bahia Palace on Wikipedia
          </a>
        </p>
      </div>
    </div>
  );
}
