import { ArrowRight, Sun, Landmark } from 'lucide-react';
import { LeadButton } from '@/components/layout/LeadButton';

export function Hero() {
  return (
    <section className="relative flex flex-col overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-bg.webp"
          alt="Bahia Palace interior courtyard with zellige tiles and arched columns"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          decoding="sync"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3D2817]/90 via-[#3D2817]/65 to-[#3D2817]/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3D2817]/40 via-transparent to-[#3D2817]/60" />
      </div>

      {/* TOP — badge pill */}
      <div className="hero-badge relative z-10 pt-24 pb-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-center">
          {/* Spinning border wrapper */}
          <div className="relative inline-flex p-[2px] rounded-full overflow-hidden">
            {/* Rotating gradient border */}
            <div
              className="hero-spin"
              style={{
                background: 'conic-gradient(from 0deg, transparent 35%, #E8A33D 50%, #C4452D 60%, transparent 75%)',
              }}
            />
            {/* Pill content */}
            <div className="relative flex flex-wrap items-center gap-2 sm:gap-3 bg-[#1a0e06] backdrop-blur-sm rounded-full px-3 py-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Sun size={12} className="text-[#E8A33D] shrink-0" />
                <span className="text-white text-[11px] sm:text-xs font-semibold whitespace-nowrap">
                  <span className="text-[#E8A33D] font-bold">40°C</span> outside
                </span>
              </div>
              <ArrowRight size={11} className="text-white/30 shrink-0 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <Landmark size={12} className="text-[#6B7B3A] shrink-0" />
                <span className="text-white text-[11px] sm:text-xs font-semibold whitespace-nowrap">
                  Cool palace, no queue
                </span>
              </div>
              <LeadButton
                ticketType="skip-the-line"
                className="flex items-center gap-1 bg-[#C4452D] hover:bg-[#a83826] text-white text-[11px] font-extrabold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap min-h-[32px]"
              >
                Book Now <ArrowRight size={10} />
              </LeadButton>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER — main content */}
      <div className="relative z-10 px-6 pt-8 pb-10">
        <div className="max-w-6xl mx-auto w-full">
          <div className="max-w-2xl">
            <h1 className="hero-title mb-6 leading-none">
              <span className="block text-[#E8A33D] text-xs sm:text-sm font-bold tracking-[0.3em] uppercase mb-3">
                Bahia Palace Tickets
              </span>
              <span className="sr-only"> — </span>
              <span
                className="block text-white"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(3.2rem, 8vw, 5.5rem)',
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
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
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
      <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[40px] sm:h-[60px]">
          <path d="M0 60 L0 30 Q360 -20 720 30 Q1080 80 1440 30 L1440 60 Z" fill="#FAF3E7" />
        </svg>
      </div>
    </section>
  );
}
