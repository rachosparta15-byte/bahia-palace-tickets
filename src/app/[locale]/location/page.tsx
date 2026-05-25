import { BOOKING_URL } from '@/lib/booking';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { buildAlternates, buildOG } from '@/lib/seo';
import { MapPin, Navigation, Clock, ArrowRight, Car, Footprints } from 'lucide-react';
import type { Metadata } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.visitbahiapalace.com';

const META: Record<string, { title: string; description: string }> = {
  en: { title: 'How to Get to Bahia Palace Marrakech | Address, Map & Directions 2026', description: 'Bahia Palace is in Marrakech Medina, 10 minutes walking from Jemaa el-Fnaa. Get directions, taxi prices, parking info, and an interactive map.' },
  fr: { title: 'Comment Aller au Palais Bahia Marrakech | Adresse & Plan 2026', description: 'Le Palais Bahia se trouve dans la Médina de Marrakech, à 10 minutes à pied de Jemaa el-Fna. Itinéraires, prix des taxis et carte interactive.' },
  es: { title: 'Cómo Llegar al Palacio Bahia Marrakech | Dirección & Mapa 2026', description: 'El Palacio Bahia está en la Medina de Marrakech, a 10 minutos caminando desde Jemaa el-Fna. Rutas, precios de taxi y mapa interactivo.' },
  de: { title: 'Anfahrt zum Bahia Palast Marrakesch | Adresse & Karte 2026', description: 'Der Bahia Palast liegt in der Medina von Marrakesch, 10 Minuten zu Fuß vom Jemaa el-Fna. Wegbeschreibung, Taxipreise und interaktive Karte.' },
  it: { title: 'Come Arrivare al Palazzo Bahia Marrakech | Indirizzo & Mappa 2026', description: 'Il Palazzo Bahia si trova nella Medina di Marrakech, a 10 minuti a piedi dalla Jemaa el-Fna. Indicazioni, prezzi taxi e mappa interattiva.' },
};

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = META[locale] ?? META.en;
  return {
    title: meta.title,
    description: meta.description,
    keywords: ['how to get to bahia palace', 'bahia palace address', 'bahia palace location marrakech', 'bahia palace map', 'bahia palace from jemaa el fnaa', 'bahia palace directions', 'taxi marrakech bahia palace'],
    alternates: buildAlternates(locale, '/location'),
    openGraph: buildOG(meta.title, meta.description, locale, '/location'),
  };
}

const locationSchema = {
  '@context': 'https://schema.org',
  '@type': 'TouristAttraction',
  name: 'Bahia Palace',
  url: `${BASE}/en/location`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rue Riad Zitoun el Jedid',
    addressLocality: 'Marrakech',
    addressRegion: 'Marrakech-Safi',
    postalCode: '40000',
    addressCountry: 'MA',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 31.6226, longitude: -7.9842 },
  hasMap: 'https://maps.google.com/?q=Bahia+Palace+Marrakech',
  telephone: '+212-524-38-91-05',
};

export default async function LocationPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="bg-[#FAF3E7] min-h-screen">
      <JsonLd data={locationSchema} />

      <div className="bg-[#3D2817] text-white px-6 py-12 md:px-10">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb variant="light" items={[{ label: 'Home', href: '/' }, { label: 'Location & Directions' }]} />
          <h1 className="mt-6 font-bold text-white" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
            How to Get to Bahia Palace Marrakech
          </h1>
          <p className="mt-3 text-white/75 text-lg max-w-2xl">
            Bahia Palace is located in the heart of Marrakech Medina. Here's everything you need to know to get there — by foot, taxi, or calèche.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

        {/* Address box */}
        <div className="bg-white rounded-2xl border border-[#E8D5B7] p-6 flex gap-4">
          <MapPin size={24} className="text-[#C4452D] shrink-0 mt-1" />
          <div>
            <h2 className="font-bold text-[#3D2817] mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem' }}>Bahia Palace Address</h2>
            <p className="text-[#5C3D20] text-sm leading-relaxed">
              <strong>Rue Riad Zitoun el Jedid</strong><br />
              Marrakech Medina, 40000<br />
              Morocco
            </p>
            <a
              href="https://maps.google.com/?q=Bahia+Palace+Marrakech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[#2E4A7B] font-semibold mt-3 hover:underline"
            >
              <Navigation size={13} /> Open in Google Maps
            </a>
          </div>
        </div>

        {/* Getting there options */}
        <div>
          <h2 className="text-2xl font-bold text-[#3D2817] mb-5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Getting to Bahia Palace from Jemaa el-Fnaa
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: Footprints,
                title: 'On Foot',
                time: '10–15 min',
                cost: 'Free',
                desc: 'Walk south from Jemaa el-Fnaa through the souks. Follow signs for "Palais Bahia." Scenic route through the medina.',
                tip: 'Best option — enjoy the medina atmosphere',
                color: '#6B7B3A',
              },
              {
                icon: Car,
                title: 'Petit Taxi',
                time: '5 min',
                cost: '15–25 MAD',
                desc: 'Abundant red petits taxis in Marrakech. Ask for "Palais Bahia" or "Riad Zitoun el Jedid." Insist on the meter.',
                tip: 'Negotiate price before departure — no meter = agree first',
                color: '#C4452D',
              },
              {
                icon: Navigation,
                title: 'Calèche (horse carriage)',
                time: '10 min',
                cost: '50–80 MAD',
                desc: 'Authentic Marrakech experience. Calèches wait near Jemaa el-Fnaa. Negotiate a round-trip price.',
                tip: 'Tourist experience — negotiate firmly',
                color: '#E8A33D',
              },
            ].map(({ icon: Icon, title, time, cost, desc, tip, color }) => (
              <div key={title} className="bg-white rounded-xl border border-[#E8D5B7] p-5">
                <Icon size={20} style={{ color }} className="mb-3" />
                <h3 className="font-bold text-[#3D2817] mb-1">{title}</h3>
                <div className="flex gap-3 mb-3">
                  <span className="text-xs bg-[#FAF3E7] text-[#5C3D20] px-2 py-1 rounded-full flex items-center gap-1"><Clock size={10} /> {time}</span>
                  <span className="text-xs bg-[#FAF3E7] text-[#5C3D20] px-2 py-1 rounded-full">{cost}</span>
                </div>
                <p className="text-xs text-[#5C3D20] leading-relaxed mb-2">{desc}</p>
                <p className="text-xs font-semibold" style={{ color }}>💡 {tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Map embed */}
        <div className="rounded-2xl overflow-hidden border border-[#E8D5B7] shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.5!2d-7.9842!3d31.6226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee4285000000%3A0x0!2sBahia%20Palace!5e0!3m2!1sen!2sma!4v1"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bahia Palace Marrakech location map"
          />
        </div>

        {/* Landmarks nearby */}
        <div>
          <h2 className="text-2xl font-bold text-[#3D2817] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Nearby Landmarks & Walking Distances
          </h2>
          <div className="bg-white rounded-xl border border-[#E8D5B7] divide-y divide-[#E8D5B7]">
            {[
              { from: 'Jemaa el-Fnaa', distance: '750 m', time: '10 min walk' },
              { from: 'Saadian Tombs', distance: '500 m', time: '7 min walk' },
              { from: 'El Badi Palace', distance: '800 m', time: '10 min walk' },
              { from: 'Mellah (Jewish Quarter)', distance: '300 m', time: '4 min walk' },
              { from: 'Marrakech train station', distance: '3.5 km', time: '15 min taxi' },
              { from: 'Marrakech Menara Airport', distance: '6 km', time: '20 min taxi' },
            ].map(({ from, distance, time }) => (
              <div key={from} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-[#3D2817] font-medium">{from}</span>
                <div className="flex gap-4 text-right">
                  <span className="text-[#8B6344]">{distance}</span>
                  <span className="text-[#6B7B3A] font-semibold">{time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#3D2817] rounded-2xl p-8 text-center">
          <h2 className="text-white font-bold text-2xl mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Book Your Bahia Palace Tickets Online
          </h2>
          <p className="text-white/70 text-sm mb-5 max-w-md mx-auto">
            Skip the queue at the entrance. Show your mobile ticket and walk straight in.
          </p>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Book Bahia Palace Tickets Online <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
