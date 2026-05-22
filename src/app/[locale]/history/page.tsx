import { BOOKING_URL } from '@/lib/booking';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { buildAlternates, buildOG } from '@/lib/seo';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import type { Metadata } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://visitbahiapalace.com';

const META: Record<string, { title: string; description: string }> = {
  en: { title: 'Bahia Palace History | Ba Ahmed & The Story Behind The Palace', description: 'Discover the fascinating history of Bahia Palace, built between 1866–1900 by Grand Vizier Ba Ahmed. Learn about its architects, the harem, and royal Moroccan past.' },
  fr: { title: 'Histoire du Palais Bahia | Ba Ahmed & L\'Histoire du Palais', description: 'Découvrez l\'histoire fascinante du Palais Bahia, construit entre 1866 et 1900 par le Grand Vizir Ba Ahmed. Architecture, harem et passé royal marocain.' },
  es: { title: 'Historia del Palacio Bahia | Ba Ahmed y La Historia del Palacio', description: 'Descubre la fascinante historia del Palacio Bahia, construido entre 1866 y 1900 por el Gran Visir Ba Ahmed. Arquitectura, harén e historia real marroquí.' },
  de: { title: 'Geschichte des Bahia Palastes | Ba Ahmed & Die Geschichte des Palastes', description: 'Entdecken Sie die faszinierende Geschichte des Bahia Palastes, erbaut zwischen 1866 und 1900 vom Großwesir Ba Ahmed. Architektur, Harem und königliche Geschichte.' },
  it: { title: 'Storia del Palazzo Bahia | Ba Ahmed e La Storia del Palazzo', description: 'Scopri la storia affascinante del Palazzo Bahia, costruito tra il 1866 e il 1900 dal Gran Visir Ba Ahmed. Architettura, harem e storia reale marocchina.' },
};

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = META[locale] ?? META.en;
  return {
    title: meta.title,
    description: meta.description,
    keywords: ['bahia palace history', 'who built bahia palace', 'bahia palace ba ahmed', 'bahia palace si moussa', 'bahia palace 19th century', 'grand vizier morocco', 'ba ahmed ben moussa', 'palace construction 1894'],
    alternates: buildAlternates(locale, '/history'),
    openGraph: { ...buildOG(meta.title, meta.description, locale, '/history'), type: 'article' },
  };
}

const historySchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Bahia Palace History — Ba Ahmed and the Story Behind the Palace',
  description: 'The complete history of Bahia Palace Marrakech, built between 1866 and 1900.',
  url: `${BASE}/en/history`,
  author: { '@type': 'Organization', name: 'Visit Bahia Palace' },
  publisher: { '@type': 'Organization', name: 'Visit Bahia Palace', logo: { '@type': 'ImageObject', url: `${BASE}/og-image.jpg` } },
  about: {
    '@type': 'TouristAttraction',
    name: 'Bahia Palace',
    foundingDate: '1866',
    address: { '@type': 'PostalAddress', addressLocality: 'Marrakech', addressCountry: 'MA' },
  },
};

const timeline = [
  { year: '1859–1873', title: 'Si Moussa Begins the Palace', text: 'Grand Vizier Si Moussa, the first builder, begins construction of the core structure. He names it "Dar Si Moussa" — later it would become the eastern wing of Bahia Palace. The name "Bahia" (meaning "brilliant" in Arabic) reflects his ambition for a palace of extraordinary beauty.' },
  { year: '1894–1900', title: 'Ba Ahmed Expands & Completes', text: 'After Si Moussa\'s death, his son Ahmed ibn Moussa (known as Ba Ahmed) inherits the property and title of Grand Vizier under Sultan Moulay Abd al-Aziz. Ba Ahmed dramatically expands the palace to its current 8 hectares, adding 150 rooms, the grand courtyard, the harem, and elaborate zellige tile work with imported Andalusian craftsmen.' },
  { year: '1900', title: 'Ba Ahmed\'s Death & the Palace\'s Fate', text: 'When Ba Ahmed dies in 1900, the Sultan immediately orders the palace to be looted of its valuables. Wives, concubines, and servants are expelled overnight. The palace falls into disuse, its furnishings dispersed across Morocco.' },
  { year: '1912', title: 'French Protectorate Takes Over', text: 'During the French Protectorate, Maréchal Lyautey uses Bahia Palace as his official residence. Many original interiors are modified or stripped during this period.' },
  { year: '1956–present', title: 'Moroccan Heritage Site', text: 'After Moroccan independence, Bahia Palace becomes a protected heritage site managed by the Ministry of Culture. It opens to tourists and becomes one of Marrakech\'s most visited attractions, receiving over 500,000 visitors annually.' },
];

export default async function HistoryPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="bg-[#FAF3E7] min-h-screen">
      <JsonLd data={historySchema} />

      {/* Hero */}
      <div className="relative h-72 md:h-96">
        <Image src="https://images.unsplash.com/photo-1678030560595-85b1efd78392?w=1400&q=80" alt="Bahia Palace Marrakech ornate painted cedar wood ceiling — 19th century Moroccan architecture" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3D2817]/50 to-[#3D2817]/85" />
        <div className="absolute inset-0 flex flex-col justify-between px-6 py-8 md:px-10 max-w-4xl mx-auto w-full left-0 right-0">
          <Breadcrumb variant="light" items={[{ label: 'Home', href: '/' }, { label: 'History' }]} />
          <div>
            <span className="inline-block bg-[#C4452D] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">Est. 1859–1900</span>
            <h1 className="text-white font-bold leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
              Bahia Palace History: Ba Ahmed & The Story Behind the Palace
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* Introduction */}
        <div className="prose prose-lg max-w-none">
          <p className="text-[#3D2817] leading-relaxed text-lg">
            <strong>Bahia Palace</strong> — whose name means <em>"the brilliant one"</em> in Arabic — stands as one of the finest examples of <strong>19th-century Moroccan architecture</strong> in Marrakech. Built between 1859 and 1900, this stunning palace in the heart of the medina tells the story of power, ambition, and the extraordinary craftsmanship of Islamic Moroccan design.
          </p>
        </div>

        {/* Who Built It */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-[#E8D5B7] p-6">
            <h2 className="font-bold text-[#3D2817] mb-3" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem' }}>
              Who Built Bahia Palace?
            </h2>
            <p className="text-sm text-[#5C3D20] leading-relaxed mb-3">
              Bahia Palace was built in two phases. The first phase was initiated by <strong>Si Moussa</strong>, Grand Vizier under Sultan Mohammed IV, who began construction around 1859. The second and most expansive phase was completed by his son, <strong>Ba Ahmed (Ahmed ibn Moussa)</strong>, between 1894 and 1900.
            </p>
            <p className="text-sm text-[#5C3D20] leading-relaxed">
              Ba Ahmed was the most powerful man in Morocco during the reign of Sultan Moulay Abd al-Aziz. He employed the finest craftsmen from Fez, employing over 2,000 artisans to create the elaborate <strong>zellige tile work</strong>, carved <strong>cedar wood ceilings</strong>, and stucco plasterwork that define the palace today.
            </p>
          </div>
          <div className="bg-[#3D2817] rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem' }}>Fast Facts</h3>
            <div className="space-y-2.5">
              {[
                ['Construction', '1859–1900'],
                ['Builders', 'Si Moussa + Ba Ahmed'],
                ['Size', '8 hectares, 150 rooms'],
                ['Style', 'Moorish / Islamic Moroccan'],
                ['Architect', 'Mustapha El Mehdi (rumored)'],
                ['Name meaning', '"The Brilliant One" (Arabic)'],
                ['Location', 'Rue Riad Zitoun el Jedid, Marrakech'],
              ].map(([key, val]) => (
                <div key={key} className="flex justify-between text-sm border-b border-white/10 pb-2">
                  <span className="text-white/60">{key}</span>
                  <span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="text-2xl font-bold text-[#3D2817] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Bahia Palace Timeline: From Construction to Heritage Site
          </h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#C8A882]" />
            <div className="space-y-6">
              {timeline.map(({ year, title, text }) => (
                <div key={year} className="pl-14 relative">
                  <div className="absolute left-3.5 top-1.5 w-5 h-5 rounded-full bg-[#C4452D] border-2 border-white shadow" />
                  <span className="text-xs font-bold text-[#C4452D] uppercase tracking-widest">{year}</span>
                  <h3 className="font-bold text-[#3D2817] mt-0.5 mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem' }}>{title}</h3>
                  <p className="text-sm text-[#5C3D20] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Architecture */}
        <div>
          <h2 className="text-2xl font-bold text-[#3D2817] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Bahia Palace Architecture: Moorish & Moroccan Craftsmanship
          </h2>
          <p className="text-[#5C3D20] leading-relaxed mb-4">
            The palace is a masterpiece of <strong>Moroccan architecture</strong>, combining Moorish, Islamic, and Andalusian influences. Every surface is decorated with extraordinary detail — from the hand-cut <strong>zellige tile mosaics</strong> to the intricately carved stucco (tadelakt) and painted cedar wood ceilings.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Zellige Tiles', desc: 'Geometric mosaic tilework covering floors and lower walls' },
              { label: 'Cedar Ceilings', desc: 'Hand-painted carved wood ceilings in every major room' },
              { label: 'Stucco Plaster', desc: 'Intricate arabesque patterns on all interior walls' },
              { label: 'Marble Floors', desc: 'Imported Italian marble in the grand courtyard' },
            ].map(({ label, desc }) => (
              <div key={label} className="bg-white rounded-xl border border-[#E8D5B7] p-4 text-center">
                <p className="font-bold text-[#3D2817] text-sm mb-1">{label}</p>
                <p className="text-xs text-[#8B6344] leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* External link */}
        <p className="text-xs text-[#8B6344]">
          Source:{' '}
          <a href="https://en.wikipedia.org/wiki/Bahia_Palace" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#3D2817]">
            Bahia Palace — Wikipedia
          </a>
        </p>

        {/* CTA */}
        <div className="bg-[#3D2817] rounded-2xl p-8 text-center">
          <p className="text-[#E8A33D] text-xs font-bold uppercase tracking-widest mb-2">Experience it in person</p>
          <h2 className="text-white font-bold text-2xl mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Visit Bahia Palace — Book Skip-the-Line Tickets
          </h2>
          <p className="text-white/70 text-sm mb-5 max-w-md mx-auto">
            Walk through history without waiting in line. Instant confirmation, free cancellation.
          </p>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Book Bahia Palace Tickets Online <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
