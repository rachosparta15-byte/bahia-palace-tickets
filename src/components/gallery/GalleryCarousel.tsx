'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const SLIDES = [
  {
    src: '/images/blog-real/bahia-palace-courtyard-marble-fountain-zellige-garden.webp',
    title: 'Grand Courtyard',
    alts: {
      en: 'Grand courtyard of Bahia Palace Marrakech with marble fountain and zellige tilework surrounded by garden',
      fr: 'Grande cour du Palais de la Bahia à Marrakech avec fontaine en marbre, zellige et jardin',
      es: 'Gran patio del Palacio de la Bahía Marrakech con fuente de mármol, zellige y jardín',
      de: 'Großer Innenhof des Bahia Palasts Marrakesch mit Marmorbrunnen, Zellige und Garten',
      it: 'Grande cortile del Palazzo della Bahia Marrakech con fontana in marmo, zellige e giardino',
    },
  },
  {
    src: '/images/blog-real/bahia-palace-octagonal-cedar-ceiling-chandelier.webp',
    title: 'Octagonal Cedar Ceiling',
    alts: {
      en: 'Ornate octagonal carved cedar ceiling with central chandelier in Bahia Palace Marrakech',
      fr: 'Plafond en cèdre sculpté octogonal avec lustre central au Palais de la Bahia Marrakech',
      es: 'Techo octagonal de cedro tallado con araña central en el Palacio de la Bahía Marrakech',
      de: 'Achteckige geschnitzte Zederndecke mit Kronleuchter im Bahia Palast Marrakesch',
      it: 'Soffitto ottagonale in cedro intagliato con lampadario centrale nel Palazzo della Bahia Marrakech',
    },
  },
  {
    src: '/images/blog-real/bahia-palace-courtyard-wall-fountain-alcove-zellige.webp',
    title: 'Zellige & Arabic Calligraphy',
    alts: {
      en: 'Courtyard wall fountain alcove with elaborate zellige tilework in Bahia Palace Marrakech',
      fr: 'Alcôve de fontaine murale avec zellige élaboré au Palais de la Bahia Marrakech',
      es: 'Nicho de fuente mural con elaborado zellige en el Palacio de la Bahía Marrakech',
      de: 'Wandbrunnenalkove mit aufwändigem Zellige im Bahia Palast Marrakesch',
      it: 'Alcova con fontana a muro e zellige elaborato nel Palazzo della Bahia Marrakech',
    },
  },
  {
    src: '/images/blog-real/bahia-palace-carved-plaster-arch-visitors-interior.webp',
    title: 'Carved Plaster Arches',
    alts: {
      en: 'Elaborately carved plaster arch with visitors in the interior of Bahia Palace Marrakech',
      fr: 'Arc en plâtre sculpté avec visiteurs dans l\'intérieur du Palais de la Bahia Marrakech',
      es: 'Arco de yeso tallado con visitantes en el interior del Palacio de la Bahía Marrakech',
      de: 'Aufwändig geschnitzter Stuckbogen mit Besuchern im Inneren des Bahia Palasts Marrakesch',
      it: 'Arco in gesso intagliato con visitatori nell\'interno del Palazzo della Bahia Marrakech',
    },
  },
  {
    src: '/images/blog-real/bahia-palace-small-riad-courtyard-fountain-arches.webp',
    title: 'Inner Courtyard',
    alts: {
      en: 'Small riad courtyard with central fountain and arched gallery in Bahia Palace Marrakech',
      fr: 'Petite cour de riad avec fontaine centrale et galerie arquée au Palais de la Bahia Marrakech',
      es: 'Pequeño patio riad con fuente central y galería de arcos en el Palacio de la Bahía Marrakech',
      de: 'Kleiner Riad-Innenhof mit Brunnen und Bogengalerie im Bahia Palast Marrakesch',
      it: 'Piccolo cortile riad con fontana centrale e galleria ad archi nel Palazzo della Bahia Marrakech',
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
            alt={slide.alts[locale as keyof typeof slide.alts] ?? slide.alts.en}
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
