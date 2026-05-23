'use client';

import { useTranslations } from 'next-intl';
import { BOOKING_URL } from '@/lib/booking';
import { Check, ArrowRight, Clock, Star, Zap, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const TICKET_IMAGES = {
  'skip-the-line':       'https://images.unsplash.com/photo-1663297824621-27c5ff4cc826?w=600&q=75',
  'guided-tour':         'https://images.unsplash.com/photo-1678030560595-85b1efd78392?w=600&q=75',
  'private-tour':        'https://images.unsplash.com/photo-1705600974255-f36a837ebd97?w=600&q=75',
  'combo-saadian-tombs': 'https://images.unsplash.com/photo-1572018350822-3c2bbfcba459?w=600&q=75',
};

const TICKET_PRICES = {
  'skip-the-line':       10,
  'guided-tour':         10,
  'private-tour':        10,
  'combo-saadian-tombs': 10,
};

const TICKET_POPULAR = {
  'skip-the-line':       true,
  'guided-tour':         false,
  'private-tour':        false,
  'combo-saadian-tombs': false,
};

const TICKET_LIVE = {
  'skip-the-line':       true,
  'guided-tour':         false,
  'private-tour':        false,
  'combo-saadian-tombs': false,
};

type TicketKey = 'skipTheLine' | 'guidedTour' | 'privateTour' | 'combo';

const TICKET_SLUGS: Record<TicketKey, string> = {
  skipTheLine:  'skip-the-line',
  guidedTour:   'guided-tour',
  privateTour:  'private-tour',
  combo:        'combo-saadian-tombs',
};

const TIER_NUMS = ['01', '02', '03', '04'];


interface TicketOverride {
  price?: number;
  imageUrl?: string;
  live?: boolean;
}

interface Props {
  overrides?: Record<string, TicketOverride>;
}

export function TicketCards({ overrides = {} }: Props) {
  const t = useTranslations('tickets');

  const ticketKeys: TicketKey[] = ['skipTheLine', 'guidedTour', 'privateTour', 'combo'];

  return (
    <section className="pt-10 pb-16 bg-[#FAF3E7]">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Heading ── */}
        <div className="text-center mb-8">
          <h2
            className="text-[#3D2817] mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[#5C3D20] max-w-2xl mx-auto leading-relaxed text-sm">{t('subtitle')}</p>
        </div>

        {/* ── Tier progress bar (desktop) ── */}
        <div className="hidden lg:flex items-center justify-center mb-8 gap-0">
          {ticketKeys.map((key, i) => {
            const slug    = TICKET_SLUGS[key];
            const popular = TICKET_POPULAR[slug as keyof typeof TICKET_POPULAR];
            const name    = t(`${key}.name` as any);
            return (
              <div key={slug} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors
                      ${popular
                        ? 'bg-[#C4452D] border-[#C4452D] text-white'
                        : 'bg-white border-[#C8A882] text-[#8B6344]'
                      }`}
                  >
                    {TIER_NUMS[i]}
                  </div>
                  <span
                    className={`text-xs font-semibold whitespace-nowrap ${popular ? 'text-[#C4452D]' : 'text-[#8B6344]'}`}
                  >
                    {name}
                  </span>
                </div>
                {i < ticketKeys.length - 1 && (
                  <div className="flex items-center mb-5 mx-2">
                    <div className="w-16 h-px bg-[#C8A882]" />
                    <ChevronRight size={12} className="text-[#C8A882] -ml-1" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ticketKeys.map((key, i) => {
            const slug    = TICKET_SLUGS[key];
            const ov      = overrides[slug] ?? {};
            const price   = ov.price    ?? TICKET_PRICES[slug as keyof typeof TICKET_PRICES];
            const live    = ov.live     ?? TICKET_LIVE[slug   as keyof typeof TICKET_LIVE];
            const imgSrc  = (ov.imageUrl && ov.imageUrl.length > 0)
                              ? ov.imageUrl
                              : TICKET_IMAGES[slug as keyof typeof TICKET_IMAGES];
            const popular = TICKET_POPULAR[slug as keyof typeof TICKET_POPULAR];
            const name      = t(`${key}.name`      as any);
            const tagline   = t(`${key}.tagline`   as any);
            const duration  = t(`${key}.duration`  as any);
            const whyOnline = t(`${key}.whyOnline` as any);
            const includes  = (t.raw(`${key}.includes` as any) as string[]).slice(0, 3);

            return (
              <div
                key={slug}
                className={`relative flex flex-col rounded-2xl overflow-hidden border transition-all
                  ${live
                    ? 'bg-white border-[#C4452D] shadow-[0_12px_48px_rgba(196,69,45,0.28)] lg:scale-[1.07] lg:-translate-y-2 lg:z-10'
                    : 'bg-[#F0E8D8] border-[#D5C5A8] opacity-50 grayscale-[40%] pointer-events-none'
                  }`}
              >
                {/* Coming Soon overlay */}
                {!live && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#EDE0CC]/75 backdrop-blur-[3px] rounded-2xl">
                    <div className="bg-[#3D2817] text-[#E8A33D] text-[11px] font-bold tracking-[0.22em] uppercase px-5 py-2.5 rounded-full shadow-xl border border-[#C8A882]/40 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D] animate-pulse" />
                      Coming Soon
                    </div>
                  </div>
                )}

                {/* Popular ribbon */}
                {popular && (
                  <div className="absolute top-0 inset-x-0 z-10 flex justify-center">
                    <div className="bg-[#C4452D] text-white text-[10px] font-bold tracking-widest uppercase px-5 py-1 rounded-b-lg flex items-center gap-1">
                      <Star size={9} className="fill-current" /> Available Now
                    </div>
                  </div>
                )}

                {/* Image */}
                <div className="relative h-36 overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={`${name} — Bahia Palace`}
                    fill
                    className="object-cover"
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0e06]/60 to-transparent" />
                  {/* Tier badge */}
                  <div
                    className={`absolute bottom-3 left-3 text-[10px] font-bold tracking-[0.18em] uppercase px-2 py-0.5 rounded-full
                      ${popular ? 'bg-[#C4452D] text-white' : 'bg-white/25 backdrop-blur-sm text-white border border-white/30'}`}
                  >
                    {TIER_NUMS[i]} / 04
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1">
                  <h3
                    className="text-[#3D2817] mb-0.5 leading-snug"
                    style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', fontWeight: 700 }}
                  >
                    {name}
                  </h3>
                  <p className="text-[#5C3D20] text-xs mb-2 leading-snug">{tagline}</p>

                  <div className="flex items-center gap-1 text-[11px] text-[#6B7B3A] mb-3">
                    <Clock size={11} />
                    <span>{duration}</span>
                  </div>

                  {/* Why online */}
                  <div className="flex items-start gap-1.5 bg-[#6B7B3A]/10 rounded-lg px-2.5 py-2 mb-3">
                    <Zap size={11} className="text-[#6B7B3A] mt-0.5 shrink-0" />
                    <p className="text-[11px] text-[#3D5016] leading-snug font-semibold">{whyOnline}</p>
                  </div>

                  {/* Key includes */}
                  <ul className="space-y-1.5 mb-4 flex-1">
                    {includes.map((item, j) => (
                      <li key={j} className="flex items-start gap-1.5 text-xs text-[#5C3D20]">
                        <Check size={12} className="text-[#6B7B3A] mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Price + CTA */}
                  <div className={`mt-auto pt-3 border-t ${popular ? 'border-[#F0C8BF]' : 'border-[#EDE0CC]'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-[#8B6344] uppercase tracking-wide">{t('from')}</p>
                        <p
                          className="text-2xl font-bold text-[#C4452D] tabular-nums lining-nums"
                          style={{ lineHeight: 1, fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif', fontVariantNumeric: 'lining-nums tabular-nums' }}
                        >
                          ${price}
                          <span className="text-[11px] font-normal text-[#8B6344] ml-1">{t('perPerson')}</span>
                        </p>
                      </div>
                      <a
                        href={BOOKING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all
                          ${popular
                            ? 'bg-[#C4452D] text-white hover:bg-[#a83826]'
                            : 'bg-[#3D2817] text-white hover:bg-[#5C3D20]'
                          }`}
                      >
                        {t('bookNow')}
                        <ArrowRight size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
