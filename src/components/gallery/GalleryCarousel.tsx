'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const SLIDES = [
  {
    src: '/images/gallery/bahia-palace-grand-courtyard-balcony-view-fountain.jpg',
    title: 'Grand Courtyard',
    alts: {
      en: 'Grand courtyard of Bahia Palace Marrakech viewed from above, with central fountain and ornate balcony',
      fr: 'Grande cour du Palais de la Bahia à Marrakech vue de haut, avec fontaine centrale et balcon sculpté',
      es: 'Gran patio del Palacio de la Bahía Marrakech visto desde arriba, con fuente central y balcón ornamentado',
      de: 'Großer Innenhof des Bahia Palasts Marrakesch von oben mit zentralem Brunnen und ornamentalem Balkon',
      it: "Grande cortile del Palazzo della Bahia Marrakech dall'alto, con fontana centrale e balcone ornato",
    },
  },
  {
    src: '/images/gallery/bahia-palace-octagonal-cedar-ceiling-carved-wood.jpg',
    title: 'Octagonal Cedar Ceiling',
    alts: {
      en: 'Ornate octagonal carved cedar wood ceiling in Bahia Palace Marrakech',
      fr: 'Plafond en cèdre sculpté octogonal orné du Palais de la Bahia à Marrakech',
      es: 'Techo octagonal de madera de cedro tallada en el Palacio de la Bahía Marrakech',
      de: 'Achteckige geschnitzte Zedernholzdecke im Bahia Palast Marrakesch',
      it: 'Soffitto ottagonale in cedro intagliato nel Palazzo della Bahia a Marrakech',
    },
  },
  {
    src: '/images/gallery/bahia-palace-zellige-mosaic-arabic-calligraphy-stucco.jpg',
    title: 'Zellige Mosaic & Calligraphy',
    alts: {
      en: 'Zellige mosaic tilework and Arabic calligraphy stucco in Bahia Palace Marrakech',
      fr: 'Mosaïque de zellige et calligraphie arabe en stuc du Palais de la Bahia Marrakech',
      es: 'Mosaico de zellige y caligrafía árabe en estuco en el Palacio de la Bahía Marrakech',
      de: 'Zellige-Mosaikfliesen und arabische Kalligraphie-Stuck im Bahia Palast Marrakesch',
      it: 'Mosaico zellige e calligrafia araba in stucco nel Palazzo della Bahia Marrakech',
    },
  },
  {
    src: '/images/gallery/bahia-palace-arch-view-green-dome-fountain-palm.jpg',
    title: 'Arch View with Garden',
    alts: {
      en: 'Horseshoe arch framing the garden with green dome, fountain and palms at Bahia Palace Marrakech',
      fr: 'Arc en fer à cheval ouvrant sur le jardin avec dôme vert, fontaine et palmiers, Palais de la Bahia',
      es: 'Arco de herradura enmarcando el jardín con cúpula verde y palmeras, Palacio de la Bahía Marrakech',
      de: 'Hufeisenbogen mit Garten, grüner Kuppel, Brunnen und Palmen im Bahia Palast Marrakesch',
      it: 'Arco a ferro di cavallo con giardino, cupola verde e palme nel Palazzo della Bahia Marrakech',
    },
  },
  {
    src: '/images/gallery/bahia-palace-inner-courtyard-central-fountain-stucco.jpg',
    title: 'Inner Courtyard',
    alts: {
      en: 'Inner courtyard with central fountain and carved stucco walls in Bahia Palace Marrakech',
      fr: 'Cour intérieure avec fontaine centrale et murs en stuc sculpté du Palais de la Bahia Marrakech',
      es: 'Patio interior con fuente central y muros de estuco tallado en el Palacio de la Bahía Marrakech',
      de: 'Innenhof mit zentralem Brunnen und geschnitzten Stuckwänden im Bahia Palast Marrakesch',
      it: 'Cortile interno con fontana centrale e pareti in stucco intagliato del Palazzo della Bahia Marrakech',
    },
  },
];

export function GalleryCarousel({ locale }: { locale: string }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reducedMotion || paused) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 4500);
    return () => clearInterval(id);
  }, [reducedMotion, paused]);

  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setCurrent((c) => (c + 1) % SLIDES.length);

  return (
    <div
      className="relative h-[300px] sm:h-[400px] md:h-[480px] overflow-hidden rounded-2xl bg-[#2A1A0E] select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-hidden={i !== current}
        >
          <Image
            src={slide.src}
            alt={slide.alts[locale] ?? slide.alts.en}
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 960px"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0900]/75 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-5 sm:left-7 right-20">
            <p
              className="text-white font-semibold drop-shadow-md leading-snug"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}
            >
              {slide.title}
            </p>
          </div>
        </div>
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-6 h-2 bg-[#E8A33D]' : 'w-2 h-2 bg-white/40 hover:bg-white/65'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Arrows — hidden on mobile, shown sm+ */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 hidden sm:flex w-9 h-9 items-center justify-center rounded-full bg-black/35 hover:bg-black/55 text-white transition-colors z-10"
        aria-label="Previous slide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex w-9 h-9 items-center justify-center rounded-full bg-black/35 hover:bg-black/55 text-white transition-colors z-10"
        aria-label="Next slide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
