'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const SLIDES = [
  {
    src: '/images/gallery/bahia-palace-grand-courtyard-balcony-view-fountain.jpg',
    alt: 'Grand courtyard of Bahia Palace from above, with central fountain and ornate balcony',
    title: 'Grand Courtyard',
  },
  {
    src: '/images/gallery/bahia-palace-octagonal-cedar-ceiling-carved-wood.jpg',
    alt: 'Ornate octagonal carved cedar wood ceiling, Bahia Palace Marrakech',
    title: 'Octagonal Cedar Ceiling',
  },
  {
    src: '/images/gallery/bahia-palace-zellige-mosaic-arabic-calligraphy-stucco.jpg',
    alt: 'Zellige mosaic tilework and Arabic calligraphy carved in stucco, Bahia Palace Marrakech',
    title: 'Zellige Mosaic & Calligraphy',
  },
  {
    src: '/images/gallery/bahia-palace-arch-view-green-dome-fountain-palm.jpg',
    alt: 'Horseshoe arch framing the garden with a green dome, fountain and palm trees, Bahia Palace',
    title: 'Arch View with Garden',
  },
  {
    src: '/images/gallery/bahia-palace-inner-courtyard-central-fountain-stucco.jpg',
    alt: 'Inner courtyard with central fountain surrounded by carved stucco walls, Bahia Palace Marrakech',
    title: 'Inner Courtyard',
  },
];

export function GalleryCarousel() {
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
            alt={slide.alt}
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 960px"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0900]/75 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-5 sm:left-7 right-20">
            <p
              className="text-white font-semibold drop-shadow-md leading-snug"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}
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
