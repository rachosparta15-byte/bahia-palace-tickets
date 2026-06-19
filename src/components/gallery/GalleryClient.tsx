'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { PinterestSaveButton } from './PinterestSaveButton';

const SITE = 'https://www.visitbahiapalace.com';
function absoluteUrl(url: string) {
  return url.startsWith('http') ? url : `${SITE}${url}`;
}
function pinterestDesc(img: GalleryImage) {
  const base = (img.altText?.trim() || img.title?.trim() || 'Bahia Palace interior');
  return `${base} — Bahia Palace Marrakech. Book skip-the-line tickets.`;
}

interface GalleryImage {
  id: string;
  url: string;
  altText: string;
  title: string;
  caption: string | null;
}

export function GalleryClient({ images, pageUrl }: { images: GalleryImage[]; pageUrl: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number>(0);

  const open  = useCallback((i: number) => setLightboxIndex(i), []);
  const close = useCallback(() => setLightboxIndex(null), []);
  const prev  = useCallback(() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const next  = useCallback(
    () => setLightboxIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : i)),
    [images.length],
  );

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      close();
      if (e.key === 'ArrowRight')  next();
      if (e.key === 'ArrowLeft')   prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, close, next, prev]);

  // Scroll lock while lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  // Touch/swipe handlers (attached to lightbox container)
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta >  50) prev();
    if (delta < -50) next();
  };

  const current = lightboxIndex !== null ? images[lightboxIndex] : null;

  return (
    <>
      {/* ── Even grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {images.map((img, i) => (
          <div
            key={img.id}
            className="relative aspect-square overflow-hidden rounded-xl group bg-[#E8D5B7]"
          >
            {/* Lightbox trigger */}
            <button
              onClick={() => open(i)}
              className="absolute inset-0 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A33D] focus-visible:ring-offset-1"
              aria-label={`View photo: ${img.title}`}
            >
              <Image
                src={img.url}
                alt={img.altText}
                fill
                className="object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.07]"
                sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                loading={i < 8 ? 'eager' : 'lazy'}
              />

              {/* Dark gradient + title fade-in on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#3D2817]/80 via-[#3D2817]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <p className="text-white text-xs sm:text-sm font-semibold leading-snug drop-shadow-sm line-clamp-2">
                  {img.title}
                </p>
              </div>

              {/* Gold top-right corner accent */}
              <div className="absolute top-0 right-0 border-t-[26px] border-r-[26px] border-t-transparent border-r-[#E8A33D]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </button>

            {/* Pinterest save button — sibling of lightbox button so it's valid HTML */}
            <PinterestSaveButton
              pageUrl={pageUrl}
              imageUrl={absoluteUrl(img.url)}
              description={pinterestDesc(img)}
              className="absolute top-2 left-2 z-10"
            />
          </div>
        ))}
      </div>

      {/* ── Lightbox ───────────────────────────────────────────── */}
      {current !== null && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/88 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo: ${current.title}`}
        >
          {/* Inner — stops backdrop click from propagating */}
          <div
            className="relative flex flex-col items-center px-4"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Photo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={current.altText}
              className="max-h-[74vh] max-w-[88vw] w-auto object-contain rounded-xl shadow-2xl"
            />

            {/* Caption bar */}
            <div className="w-full max-w-[88vw] mt-3 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p
                  className="text-white font-semibold text-sm sm:text-base leading-snug truncate"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {current.title}
                </p>
                {current.caption && (
                  <p className="text-white/55 text-xs sm:text-sm mt-0.5 line-clamp-2">{current.caption}</p>
                )}
              </div>
              <span className="text-white/40 text-xs shrink-0 tabular-nums pt-0.5">
                {lightboxIndex + 1}&thinsp;/&thinsp;{images.length}
              </span>
            </div>
          </div>

          {/* X close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>

          {/* Left arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            disabled={lightboxIndex === 0}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-default text-white transition-colors"
            aria-label="Previous photo"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            disabled={lightboxIndex === images.length - 1}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-default text-white transition-colors"
            aria-label="Next photo"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
