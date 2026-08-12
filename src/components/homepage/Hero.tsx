import { preload } from 'react-dom';
import { getTranslations } from 'next-intl/server';
import { ArrowRight, Sun, Landmark } from 'lucide-react';

/** The hero's own srcset, declared once and used by both the preload and the img. */
const HERO_SRCSET =
  '/images/hero-bg-640.webp 640w, /images/hero-bg-1024.webp 1024w, /images/hero-bg-1600.webp 1600w';

async function getTemp(): Promise<number | null> {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=31.6225&longitude=-7.9898&current=temperature_2m&timezone=Africa%2FCasablanca',
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return Math.round(data.current.temperature_2m);
  } catch {
    return null;
  }
}

export async function Hero() {
  /*
   * This copy used to be English string literals in the markup, so the hero
   * read the same in every language — including the four that shipped long
   * before Arabic did. Nobody notices in French; in Arabic the page is
   * right-to-left with an English headline sitting in it, which is what made
   * it obvious.
   */
  const t = await getTranslations('heroBanner');
  /*
   * Tell the browser about the hero before it has read the page.
   *
   * Lighthouse split this image's 7.0s LCP into TTFB 0.8s, load delay 2.1s,
   * download 1.4s and render delay 2.8s. The load delay is the whole reason
   * the earlier size reduction did not help: the file was already small, but
   * its download did not start for two seconds while gtag.js and the fonts
   * held the connection. Making it smaller does not help something that has
   * not begun.
   *
   * React hoists this into <head>, so it is discovered in the first bytes of
   * the document rather than after the parser reaches the <img>. imageSrcSet
   * and imageSizes must match the tag exactly — a preload that disagrees
   * fetches a second, different file and makes things worse.
   */
  preload('/images/hero-bg-1024.webp', {
    as: 'image',
    fetchPriority: 'high',
    imageSrcSet: HERO_SRCSET,
    imageSizes: '100vw',
  });

  const temp = await getTemp();
  return (
    <section className="relative flex flex-col overflow-hidden min-h-[260px] sm:min-h-0 bg-[#160D06]">
      {/* Background image — Ken Burns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 hero-ken-burns">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/*
            One 1600x900 file used to go to every device, phone included, where
            it is the LCP element — 255 KB on a throttled mobile connection,
            which was most of the 5.5s LCP this page measured at.

            It sits under two dark gradients (92% and 68%) and a zellige
            overlay, so its detail is never actually seen. That makes low
            quality the right answer rather than a compromise: 640w at q62 is
            36 KB and is indistinguishable once the overlays are on top.

            sizes="100vw" because it is a full-bleed background — the browser
            then picks 640w on a phone and 1600w on a desktop by itself. The
            width/height pair is the source ratio, so the box is reserved
            before the file lands and the layout cannot shift.
          */}
          <img
            src="/images/hero-bg-1024.webp"
            srcSet={HERO_SRCSET}
            sizes="100vw"
            width={1600}
            height={900}
            alt="Bahia Palace interior courtyard with zellige tiles and arched columns"
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="sync"
          />
        </div>
        {/* Dual gradient overlays — deeper on dark theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#160D06]/92 via-[#160D06]/68 to-[#160D06]/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#160D06]/45 via-transparent to-[#160D06]/70" />
        {/* Zellige tessellation over the hero image — same interlocking khatem grid as body */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><path fill='none' stroke='%23E8A33D' stroke-width='1' stroke-linecap='round' stroke-linejoin='round' opacity='0.06' d='M30,0L11.5,4.8L21.2,21.2L4.8,11.5L0,30 M30,0L48.5,4.8L38.8,21.2L55.2,11.5L60,30 M0,30L4.8,48.5L21.2,38.8L11.5,55.2L30,60 M60,30L55.2,48.5L38.8,38.8L48.5,55.2L30,60 M21.2,21.2L38.8,21.2L38.8,38.8L21.2,38.8Z'/></svg>\")",
            backgroundSize: '60px 60px',
          }}
          aria-hidden="true"
        />
      </div>

      {/* TOP — badge pill */}
      <div className="hero-badge relative z-10 pt-16 sm:pt-24 pb-3 sm:pb-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-center">
          <div className="relative inline-flex p-[3px] rounded-full overflow-hidden">
            <div
              className="hero-spin"
              style={{
                background: 'conic-gradient(from 0deg, transparent 35%, #E8A33D 50%, #C4452D 60%, transparent 75%)',
              }}
            />
            <div className="relative flex items-center gap-3 sm:gap-6 bg-[#0F0804]/90 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2.5 sm:py-3.5 border border-[rgba(232,163,61,0.12)]">
              <div className="flex items-center gap-2">
                <Sun size={16} className="text-[#E8A33D] shrink-0 sm:w-5 sm:h-5" />
                <span className="text-white text-xs sm:text-base font-semibold whitespace-nowrap">
                  {t.rich('outside', {
                    deg: () => (
                      <span className="text-[#E8A33D] font-extrabold text-base sm:text-xl">
                        {temp ?? 40}°C
                      </span>
                    ),
                  })}
                </span>
              </div>
              <ArrowRight size={14} className="text-white/25 shrink-0" />
              <div className="flex items-center gap-2">
                <Landmark size={16} className="text-[#27906E] shrink-0 sm:w-5 sm:h-5" />
                <span className="text-white text-xs sm:text-base font-semibold whitespace-nowrap">
                  {t('coolNoQueue')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER — main content */}
      <div className="relative z-10 px-6 pt-4 sm:pt-8 pb-8 sm:pb-10">
        <div className="max-w-6xl mx-auto w-full">
          <div className="max-w-2xl">
            <h1 className="hero-title mb-4 sm:mb-6 leading-none">
              <span className="block text-[#E8A33D] text-xs sm:text-sm font-bold tracking-[0.3em] uppercase mb-2 sm:mb-3"
                style={{ fontFamily: 'var(--font-body)' }}>
                {t('eyebrow')}
              </span>
              <span className="sr-only"> — </span>
              <span
                className="block text-white"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.2rem, 7vw, 5.2rem)',
                  fontWeight: 600,
                  lineHeight: 0.95,
                  letterSpacing: '-0.02em',
                }}
              >
                {t('title')}
              </span>
              <span className="sr-only"> </span>
              <span
                className="block mt-3"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.1rem, 3vw, 2rem)',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  letterSpacing: '0.02em',
                  color: 'rgba(245, 232, 204, 0.65)',
                }}
              >
                {t.rich('subtitle', { em: (c) => <em>{c}</em> })}
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Arch wave — deeper dark to match new body bg */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-[40px] sm:h-[60px]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="block w-full h-full">
          <path d="M0 60 L0 30 Q360 -20 720 30 Q1080 80 1440 30 L1440 60 Z" fill="#1C1108" />
        </svg>
      </div>
    </section>
  );
}
