import prisma from '@/lib/db';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { buildAlternates, buildOG, BASE } from '@/lib/seo';
import { LeadButton } from '@/components/layout/LeadButton';
import { GalleryCarousel } from '@/components/gallery/GalleryCarousel';
import { GalleryClient } from '@/components/gallery/GalleryClient';
import { ArrowRight, Camera } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 3600;

const META: Record<string, { title: string; description: string; heading: string; sub: string; bookCta: string; bookBtn: string; collection: string }> = {
  en: {
    title: 'Bahia Palace Photos — 50+ HD Images of the Palace & Gardens',
    description: 'Explore 50+ high-quality photos of Bahia Palace Marrakech: the courtyards, painted ceilings, gardens and mosaics. See the palace in detail before your visit.',
    heading: 'Bahia Palace Photo Gallery',
    sub: 'Zellige mosaics, carved cedar ceilings, grand courtyards — see every corner before you arrive.',
    bookCta: 'Ready to see it in person?',
    bookBtn: 'Book Skip-the-Line Tickets',
    collection: 'Browse the Collection',
  },
  fr: {
    title: 'Photos du Palais de la Bahia — 50+ images HD du palais',
    description: 'Découvrez plus de 50 photos HD du Palais de la Bahia à Marrakech : cours, plafonds peints, jardins et mosaïques. Voyez le palais en détail avant votre visite.',
    heading: 'Galerie Photos du Palais Bahia',
    sub: 'Mosaïques de zellige, plafonds en cèdre sculpté, grandes cours — explorez chaque détail avant votre visite.',
    bookCta: 'Prêt à le voir en personne ?',
    bookBtn: 'Réserver des billets coupe-file',
    collection: 'Parcourir la collection',
  },
  es: {
    title: 'Fotos del Palacio de la Bahía — 50+ imágenes HD',
    description: 'Descubre más de 50 fotos en alta calidad del Palacio de la Bahía en Marrakech: patios, techos pintados, jardines y mosaicos. Ve el palacio antes de tu visita.',
    heading: 'Galería de Fotos del Palacio Bahia',
    sub: 'Mosaicos zellige, techos de cedro tallado, grandes patios — descubre cada rincón antes de llegar.',
    bookCta: '¿Listo para verlo en persona?',
    bookBtn: 'Reservar entrada sin colas',
    collection: 'Explorar la colección',
  },
  de: {
    title: 'Bahia Palast Fotos — 50+ HD-Bilder des Palasts',
    description: 'Entdecken Sie über 50 HD-Fotos des Bahia Palasts in Marrakesch: Innenhöfe, bemalte Decken, Gärten und Mosaike. Sehen Sie den Palast vor Ihrem Besuch im Detail.',
    heading: 'Bahia Palast Fotogalerie',
    sub: 'Zellige-Mosaike, geschnitzte Zederndecken, große Innenhöfe — entdecken Sie jeden Winkel vor Ihrer Ankunft.',
    bookCta: 'Bereit für einen persönlichen Besuch?',
    bookBtn: 'Warteschlangen-Tickets buchen',
    collection: 'Sammlung durchstöbern',
  },
  it: {
    title: 'Foto del Palazzo della Bahia — 50+ immagini HD',
    description: 'Scopri oltre 50 foto in alta qualità del Palazzo della Bahia a Marrakech: cortili, soffitti dipinti, giardini e mosaici. Vedi il palazzo prima della tua visita.',
    heading: 'Galleria Fotografica del Palazzo Bahia',
    sub: 'Mosaici zellige, soffitti in cedro intagliato, grandi cortili — scopri ogni angolo prima di arrivare.',
    bookCta: 'Pronto a vederlo di persona?',
    bookBtn: 'Prenota biglietti salta-fila',
    collection: 'Sfoglia la collezione',
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
    select: { id: true, url: true, altText: true, title: true, caption: true },
  });

  const imageObjectSchema = images.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: meta.heading,
    description: meta.description,
    url: `${BASE}/${locale}/gallery`,
    image: images.map((img) => ({
      '@type': 'ImageObject',
      url: img.url.startsWith('http') ? img.url : `${BASE}${img.url}`,
      name: img.title,
      description: img.altText,
    })),
  } : null;

  return (
    <div className="min-h-screen bg-[#1C1108]">
      {imageObjectSchema && <JsonLd data={imageObjectSchema} />}

      {/* ── Dark hero: header text + carousel ─────────────────── */}
      <div className="bg-[#1C1108]">
        {/* Compact heading */}
        <div className="max-w-5xl mx-auto px-6 pt-8 pb-5 md:px-10">
          <Breadcrumb variant="light" items={[
            { label: 'Home', href: '/' },
            { label: 'Gallery' },
          ]} />
          <div className="mt-4 flex items-center gap-3">
            <div className="hidden sm:flex w-10 h-10 bg-[rgba(232,163,61,0.10)] rounded-lg items-center justify-center shrink-0">
              <Camera size={20} className="text-[#E8A33D]" />
            </div>
            <h1
              className="font-bold text-[#F5E8CC]"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)' }}
            >
              {meta.heading}
            </h1>
          </div>
          <p className="mt-2 text-[#C4A882] text-sm sm:text-base max-w-2xl leading-relaxed">
            {meta.sub}
          </p>
        </div>

        {/* Hero carousel */}
        <div className="px-4 sm:px-6 md:px-10 pb-8">
          <div className="max-w-5xl mx-auto">
            <GalleryCarousel locale={locale} />
          </div>
        </div>
      </div>

      {/* ── Grid section ───────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {images.length === 0 ? (
          <div className="text-center py-20">
            <Camera size={48} className="mx-auto text-[#C4A882] mb-4" />
            <p className="text-[#C4A882] font-medium">Photos coming soon</p>
          </div>
        ) : (
          <>
            {/* Section label */}
            <div className="flex items-center justify-between mb-5">
              <h2
                className="font-bold text-[#F5E8CC]"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem' }}
              >
                {meta.collection}
              </h2>
              <span className="text-sm text-[#C4A882] tabular-nums">{images.length} photos</span>
            </div>

            {/* Even grid + lightbox (all <img> tags are SSR-rendered) */}
            <GalleryClient images={images} pageUrl={`${BASE}/${locale}/gallery`} locale={locale} />

            {/* CTA */}
            <div className="mt-14 bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-8 text-center">
              <p className="text-[#E8A33D] text-xs font-bold uppercase tracking-widest mb-2">
                {meta.bookCta}
              </p>
              <h2
                className="text-[#F5E8CC] font-bold text-2xl mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Bahia Palace, Marrakech
              </h2>
              <LeadButton
                ticketType="skip-the-line"
                className="inline-flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
              >
                {meta.bookBtn} <ArrowRight size={16} />
              </LeadButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
