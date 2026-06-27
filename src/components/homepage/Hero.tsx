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
    <section className="relative flex flex-col overflow-hidden min-h-[260px] sm:min-h-0 bg-[#160D06]">
      {/* Background image — Ken Burns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
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
                  <span className="text-[#E8A33D] font-extrabold text-base sm:text-xl">{temp ?? 40}°C</span> outside
                </span>
              </div>
              <ArrowRight size={14} className="text-white/25 shrink-0" />
              <div className="flex items-center gap-2">
                <Landmark size={16} className="text-[#27906E] shrink-0 sm:w-5 sm:h-5" />
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
              <span className="block text-[#E8A33D] text-xs sm:text-sm font-bold tracking-[0.3em] uppercase mb-2 sm:mb-3"
                style={{ fontFamily: 'var(--font-body)' }}>
                Bahia Palace Tickets
              </span>
              <span className="sr-only"> — </span>
              {/* Cormorant Garamond for the main display heading */}
              <span
                className="block text-white"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.6rem, 8.5vw, 6rem)',
                  fontWeight: 600,
                  lineHeight: 0.92,
                  letterSpacing: '-0.02em',
                }}
              >
                Skip the Line
              </span>
              <span className="sr-only"> </span>
              <span
                className="block mt-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.2rem, 3.5vw, 2.4rem)',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  letterSpacing: '0.02em',
                  color: 'rgba(245, 232, 204, 0.60)',
                }}
              >
                in Marrakech
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
