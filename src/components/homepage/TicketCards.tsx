'use client';

import { useTranslations } from 'next-intl';
import { BOOKING_URL } from '@/lib/booking';
import { Check, ArrowRight, Clock, Star, Zap, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

const TICKET_IMAGES = {
  'skip-the-line':       '/images/ticket-skip-the-line.webp',
  'guided-tour':         '/images/gallery/bahia-palace-octagonal-cedar-ceiling-carved-wood.jpg',
  'private-tour':        '/images/gallery/bahia-palace-grand-courtyard-balcony-view-fountain.jpg',
  'combo-saadian-tombs': '/images/gallery/bahia-palace-inner-courtyard-central-fountain-stucco.jpg',
};

const TICKET_PRICES = {
  'skip-the-line':       10,
  'guided-tour':         10,
  'private-tour':        10,
  'combo-saadian-tombs': 10,
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

  const allKeys: TicketKey[] = ['skipTheLine', 'guidedTour', 'privateTour', 'combo'];

  // Only show live tickets
  const liveKeys = allKeys.filter((key) => {
    const slug = TICKET_SLUGS[key];
    return overrides[slug]?.live ?? TICKET_LIVE[slug as keyof typeof TICKET_LIVE];
  });

  const isSingle = liveKeys.length === 1;

  return (
    <section className="pt-10 pb-16 bg-[#FAF3E7]">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Heading ── */}
        <div className="text-center mb-10">
          <h2
            className="text-[#3D2817] mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[#5C3D20] max-w-2xl mx-auto leading-relaxed text-sm">{t('subtitle')}</p>
        </div>

        {/* ── Cards ── */}
        <div className={
          isSingle
            ? 'flex justify-center'
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'
        }>
          {liveKeys.map((key) => {
            const slug    = TICKET_SLUGS[key];
            const ov      = overrides[slug] ?? {};
            const price   = ov.price   ?? TICKET_PRICES[slug as keyof typeof TICKET_PRICES];
            const imgSrc  = (ov.imageUrl && ov.imageUrl.length > 0)
                              ? ov.imageUrl
                              : TICKET_IMAGES[slug as keyof typeof TICKET_IMAGES];
            const name      = t(`${key}.name`      as any);
            const tagline   = t(`${key}.tagline`   as any);
            const duration  = t(`${key}.duration`  as any);
            const whyOnline = t(`${key}.whyOnline` as any);
            const includes  = (t.raw(`${key}.includes` as any) as string[]);

            return (
              <div
                key={slug}
                className={`relative flex overflow-hidden rounded-2xl border border-[#C4452D] bg-white shadow-[0_16px_56px_rgba(196,69,45,0.22)] transition-all
                  ${isSingle
                    ? 'w-full max-w-2xl flex-col sm:flex-row'
                    : 'flex-col'
                  }`}
              >
                {/* ── Image side (left on single, top on grid) ── */}
                <div className={`relative overflow-hidden shrink-0
                  ${isSingle ? 'h-56 w-full sm:w-72 sm:h-auto sm:min-h-full' : 'h-44 w-full'}`}
                >
                  <Image
                    src={imgSrc}
                    alt={`${name} — Bahia Palace`}
                    fill
                    className="object-cover"
                    sizes="(max-width:640px) 100vw, 288px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a0e06]/30" />

                  {/* Available Now ribbon */}
                  <div className="absolute top-4 left-0 bg-[#C4452D] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-r-full flex items-center gap-1.5 shadow-lg">
                    <Star size={9} className="fill-current" /> Available Now
                  </div>
                </div>

                {/* ── Content side ── */}
                <div className="p-6 flex flex-col flex-1">

                  {/* Title + tagline */}
                  <h3
                    className="text-[#3D2817] leading-snug mb-1"
                    style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: isSingle ? '1.55rem' : '1.15rem', fontWeight: 700 }}
                  >
                    {name}
                  </h3>
                  <p className="text-[#5C3D20] text-sm mb-3 leading-snug">{tagline}</p>

                  {/* Duration */}
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7B3A] mb-4">
                    <Clock size={12} />
                    <span>{duration}</span>
                  </div>

                  {/* Why online */}
                  <div className="flex items-start gap-2 bg-[#6B7B3A]/10 rounded-lg px-3 py-2.5 mb-4">
                    <Zap size={12} className="text-[#6B7B3A] mt-0.5 shrink-0" />
                    <p className="text-xs text-[#3D5016] leading-snug font-semibold">{whyOnline}</p>
                  </div>

                  {/* Includes */}
                  <ul className={`space-y-2 mb-5 flex-1 ${isSingle ? 'grid grid-cols-2 gap-x-4 gap-y-2 space-y-0' : ''}`}>
                    {includes.map((item: string, j: number) => (
                      <li key={j} className="flex items-start gap-1.5 text-xs text-[#5C3D20]">
                        <Check size={12} className="text-[#6B7B3A] mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Price + CTA */}
                  <div className="mt-auto pt-4 border-t border-[#F0C8BF]">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] text-[#8B6344] uppercase tracking-wide mb-0.5">{t('from')}</p>
                        <p
                          className="font-bold text-[#C4452D] tabular-nums lining-nums"
                          style={{ fontSize: isSingle ? '2rem' : '1.5rem', lineHeight: 1, fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif', fontVariantNumeric: 'lining-nums tabular-nums' }}
                        >
                          ${price}
                          <span className="text-xs font-normal text-[#8B6344] ml-1">{t('perPerson')}</span>
                        </p>
                      </div>
                      <a
                        id="ticket-book-btn"
                        href={BOOKING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-5 py-3 rounded-xl transition-all text-sm whitespace-nowrap shadow-md hover:shadow-lg"
                      >
                        {t('bookNow')}
                        <ArrowRight size={14} />
                      </a>
                    </div>

                    {/* Trust line */}
                    <div className="flex items-center gap-1.5 mt-3 text-[11px] text-[#8B6344]">
                      <ShieldCheck size={12} className="text-[#6B7B3A]" />
                      Secure booking via government ticket portal
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
