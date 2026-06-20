import { ArrowRight, Sun, Landmark } from 'lucide-react';

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
  const temp = await getTemp();
  return (
    <section className="relative flex flex-col overflow-hidden min-h-[260px] sm:min-h-0 bg-[#3D2817]">
      {/* Background image — overflow-hidden here clips the Ken Burns scale */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Ken Burns wrapper: animating a plain div is more reliable than animating the img directly */}
        <div className="absolute inset-0 hero-ken-burns">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-bg.webp"
            alt="Bahia Palace interior courtyard with zellige tiles and arched columns"
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="sync"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#3D2817]/90 via-[#3D2817]/65 to-[#3D2817]/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3D2817]/40 via-transparent to-[#3D2817]/60" />
      </div>

      {/* TOP — badge pill */}
      <div className="hero-badge relative z-10 pt-16 sm:pt-24 pb-3 sm:pb-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-center">
          {/* Spinning border wrapper */}
          <div className="relative inline-flex p-[3px] rounded-full overflow-hidden">
            {/* Rotating gradient border */}
            <div
              className="hero-spin"
              style={{
                background: 'conic-gradient(from 0deg, transparent 35%, #E8A33D 50%, #C4452D 60%, transparent 75%)',
              }}
            />
            {/* Pill content */}
            <div className="relative flex items-center gap-3 sm:gap-6 bg-[#1a0e06] backdrop-blur-sm rounded-full px-4 sm:px-6 py-2.5 sm:py-3.5">
              <div className="flex items-center gap-2">
                <Sun size={16} className="text-[#E8A33D] shrink-0 sm:w-5 sm:h-5" />
                <span className="text-white text-xs sm:text-base font-semibold whitespace-nowrap">
                  <span className="text-[#E8A33D] font-extrabold text-base sm:text-xl">{temp ?? 40}°C</span> outside
                </span>
              </div>
              <ArrowRight size={14} className="text-white/30 shrink-0" />
              <div className="flex items-center gap-2">
                <Landmark size={16} className="text-[#6B7B3A] shrink-0 sm:w-5 sm:h-5" />
                <span className="text-white text-xs sm:text-base font-semibold whitespace-nowrap">
                  Cool palace, no queue
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
              <span className="block text-[#E8A33D] text-xs sm:text-sm font-bold tracking-[0.3em] uppercase mb-2 sm:mb-3">
                Bahia Palace Tickets
              </span>
              <span className="sr-only"> — </span>
              <span
                className="block text-white"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.4rem, 8vw, 5.5rem)',
                  fontWeight: 700,
                  lineHeight: 0.95,
                  letterSpacing: '-0.03em',
                }}
              >
                Skip the Line
              </span>
              <span className="sr-only"> </span>
              <span
                className="block text-white/55 mt-2"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.1rem, 3.5vw, 2.2rem)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                }}
              >
                in Marrakech
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Arch wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-[40px] sm:h-[60px]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="block w-full h-full">
          <path d="M0 60 L0 30 Q360 -20 720 30 Q1080 80 1440 30 L1440 60 Z" fill="#3D2817" />
        </svg>
      </div>
    </section>
  );
}
