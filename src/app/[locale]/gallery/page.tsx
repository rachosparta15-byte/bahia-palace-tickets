import prisma from '@/lib/db';
import Image from 'next/image';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { buildAlternates, buildOG } from '@/lib/seo';
import { BOOKING_URL } from '@/lib/booking';
import { ArrowRight, Camera } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 3600;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.visitbahiapalace.com';

const META: Record<string, { title: string; description: string; heading: string; sub: string; bookCta: string; bookBtn: string }> = {
  en: {
    title: 'Bahia Palace Photo Gallery 2026 | Inside Marrakech\'s Most Beautiful Palace',
    description: 'Explore stunning photos of Bahia Palace: zellige tiles, carved cedar ceilings, grand courtyards, ornate stucco, and Arabic calligraphy. See inside before you visit.',
    heading: 'Bahia Palace Photo Gallery',
    sub: 'Explore the beauty of Bahia Palace — zellige mosaics, carved cedar ceilings, grand courtyards, and ornate stucco walls.',
    bookCta: 'Ready to see it in person?',
    bookBtn: 'Book Skip-the-Line Tickets',
  },
  fr: {
    title: 'Galerie Photos Palais Bahia 2026 | À l\'intérieur du plus beau palais de Marrakech',
    description: 'Découvrez les plus belles photos du Palais Bahia : zellige, plafonds en cèdre sculpté, grandes cours, stuc ornemental et calligraphie arabe. Visitez avant de partir.',
    heading: 'Galerie Photos du Palais Bahia',
    sub: 'Explorez la beauté du Palais Bahia — mosaïques de zellige, plafonds en cèdre sculpté, grandes cours et murs en stuc.',
    bookCta: 'Prêt à le voir en personne ?',
    bookBtn: 'Réserver des billets coupe-file',
  },
  es: {
    title: 'Galería de Fotos Palacio Bahia 2026 | Por dentro del palacio más hermoso de Marrakech',
    description: 'Explora impresionantes fotos del Palacio Bahia: azulejos zellige, techos de cedro tallado, patios principales, yeserías ornamentales y caligrafía árabe.',
    heading: 'Galería de Fotos del Palacio Bahia',
    sub: 'Explora la belleza del Palacio Bahia — mosaicos zellige, techos de cedro tallado, grandes patios y paredes de yesería.',
    bookCta: '¿Listo para verlo en persona?',
    bookBtn: 'Reservar entrada sin colas',
  },
  de: {
    title: 'Bahia Palast Fotogalerie 2026 | Innen im schönsten Palast Marrakesch',
    description: 'Entdecken Sie atemberaubende Fotos des Bahia Palastes: Zellige-Fliesen, geschnitzte Zederndecken, Innenhöfe, ornamentaler Stuck und arabische Kalligraphie.',
    heading: 'Bahia Palast Fotogalerie',
    sub: 'Entdecken Sie die Schönheit des Bahia Palastes — Zellige-Mosaike, geschnitzte Zederndecken, große Innenhöfe und verzierte Stuckwände.',
    bookCta: 'Bereit für einen persönlichen Besuch?',
    bookBtn: 'Warteschlangen-Tickets buchen',
  },
  it: {
    title: 'Galleria Fotografica Palazzo Bahia 2026 | Dentro il più bel palazzo di Marrakech',
    description: 'Esplora le splendide foto del Palazzo Bahia: piastrelle zellige, soffitti in cedro intagliato, cortili principali, stucchi ornamentali e calligrafia araba.',
    heading: 'Galleria Fotografica del Palazzo Bahia',
    sub: 'Esplora la bellezza del Palazzo Bahia — mosaici zellige, soffitti in cedro intagliato, grandi cortili e pareti in stucco.',
    bookCta: 'Pronto a vederlo di persona?',
    bookBtn: 'Prenota biglietti salta-fila',
  },
};

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = META[locale] ?? META.en;
  return {
    title: meta.title,
    description: meta.description,
    keywords: [
      'bahia palace photos', 'bahia palace interior', 'bahia palace zellige', 'bahia palace courtyard',
      'bahia palace marrakech pictures', 'inside bahia palace', 'bahia palace ceiling', 'palais bahia photos',
    ],
    alternates: buildAlternates(locale, '/gallery'),
    openGraph: buildOG(meta.title, meta.description, locale, '/gallery'),
  };
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  const meta = META[locale] ?? META.en;

  const images = await prisma.galleryImage.findMany({
    where: { published: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });

  const imageObjectSchema = images.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: meta.heading,
    description: meta.description,
    url: `${BASE}/${locale}/gallery`,
    image: images.map(img => ({
      '@type': 'ImageObject',
      url: img.url.startsWith('http') ? img.url : `${BASE}${img.url}`,
      name: img.title,
      description: img.altText,
      keywords: img.seoKeyword ?? undefined,
    })),
  } : null;

  return (
    <div className="bg-[#FAF3E7] min-h-screen">
      {imageObjectSchema && <JsonLd data={imageObjectSchema} />}

      {/* Header */}
      <div className="bg-[#3D2817] text-white px-6 py-12 md:px-10">
        <div className="max-w-5xl mx-auto">
          <Breadcrumb variant="light" items={[
            { label: 'Home', href: '/' },
            { label: 'Gallery' },
          ]} />
          <div className="mt-6 flex items-start gap-4">
            <div className="hidden sm:flex w-12 h-12 bg-white/10 rounded-xl items-center justify-center shrink-0">
              <Camera size={24} className="text-[#E8A33D]" />
            </div>
            <div>
              <h1
                className="font-bold text-white"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 4vw, 2.75rem)' }}
              >
                {meta.heading}
              </h1>
              <p className="mt-2 text-white/70 text-base max-w-2xl leading-relaxed">
                {meta.sub}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {images.length === 0 ? (
          <div className="text-center py-20">
            <Camera size={48} className="mx-auto text-[#C8A882] mb-4" />
            <p className="text-[#5C3D20] font-medium">Photos coming soon</p>
          </div>
        ) : (
          <>
            {/* Masonry-style grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-0">
              {images.map((img, i) => (
                <div key={img.id} className="break-inside-avoid mb-4 group relative rounded-2xl overflow-hidden bg-[#E8D5B7] shadow-sm hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={img.url}
                      alt={img.altText}
                      width={600}
                      height={i % 3 === 0 ? 450 : i % 3 === 1 ? 380 : 420}
                      className="w-full h-auto object-cover"
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      priority={i < 3}
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3D2817]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-white font-semibold text-sm leading-snug" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                        {img.title}
                      </p>
                      {img.caption && (
                        <p className="text-white/75 text-xs mt-0.5">{img.caption}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-14 bg-[#3D2817] rounded-2xl p-8 text-center">
              <p className="text-[#E8A33D] text-xs font-bold uppercase tracking-widest mb-2">
                {meta.bookCta}
              </p>
              <h2
                className="text-white font-bold text-2xl mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Bahia Palace, Marrakech
              </h2>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
              >
                {meta.bookBtn} <ArrowRight size={16} />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
