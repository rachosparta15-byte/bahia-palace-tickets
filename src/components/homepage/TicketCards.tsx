'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { LeadButton } from '@/components/layout/LeadButton';
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
  const router = useRouter();

  const allKeys: TicketKey[] = ['skipTheLine', 'guidedTour', 'privateTour', 'combo'];

  const liveKeys = allKeys.filter((key) => {
    const slug = TICKET_SLUGS[key];
    return overrides[slug]?.live ?? TICKET_LIVE[slug as keyof typeof TICKET_LIVE];
  });

  const isSingle = liveKeys.length === 1;

  return (
    <section className="pt-10 pb-16">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-10 section-head">
          <h2
            className="text-[#F5E8CC] mb-2"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[#C4A882] max-w-2xl mx-auto leading-relaxed text-sm">{t('subtitle')}</p>
        </div>

        {/* Cards */}
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
                onClick={() => router.push(`/tickets/${slug}` as any)}
                className={`relative flex overflow-hidden rounded-2xl border border-[rgba(232,163,61,0.22)] bg-[#251A0F] shadow-[0_0_28px_rgba(232,163,61,0.10),0_0_64px_rgba(232,163,61,0.07),0_16px_56px_rgba(0,0,0,0.50)] transition-all cursor-pointer hover:shadow-[0_0_36px_rgba(232,163,61,0.20),0_0_80px_rgba(232,163,61,0.12),0_20px_64px_rgba(0,0,0,0.55)] hover:border-[rgba(232,163,61,0.42)] motion-reduce:transition-none active:scale-[0.99]
                  ${isSingle
                    ? 'w-full max-w-2xl flex-col sm:flex-row'
                    : 'flex-col'
                  }`}
              >
                {/* Image side */}
                <div className={`relative overflow-hidden shrink-0
                  ${isSingle ? 'aspect-video w-full sm:aspect-auto sm:w-72 sm:min-h-full' : 'h-44 w-full'}`}
                >
                  <Image
                    src={imgSrc}
                    alt={`${name} — Bahia Palace`}
                    fill
                    className="object-cover"
                    sizes="(max-width:640px) 100vw, 288px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#160D06]/40" />

                  {/* Available Now ribbon */}
                  <div className="absolute top-4 left-0 bg-[#C4452D] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-r-full flex items-center gap-1.5 shadow-lg">
                    <Star size={9} className="fill-current" /> Available Now
                  </div>
                </div>

                {/* Content side */}
                <div className={`flex flex-col flex-1 ${isSingle ? 'p-5 sm:p-6' : 'p-6'}`}>

                  <h3
                    className="text-[#F5E8CC] leading-snug mb-1"
                    style={{ fontFamily: 'var(--font-heading)', fontSize: isSingle ? '1.3rem' : '1.15rem', fontWeight: 700 }}
                  >
                    {name}
                  </h3>
                  <p className="text-[#C4A882] text-sm mb-3 leading-snug">{tagline}</p>

                  <div className="flex items-center gap-1.5 text-xs text-[#8FA63C] mb-4">
                    <Clock size={12} />
                    <span>{duration}</span>
                  </div>

                  <div className={`flex items-start gap-2 bg-[#E8A33D]/08 border border-[#E8A33D]/18 rounded-lg px-3 py-2.5 mb-4 ${isSingle ? 'hidden sm:flex' : ''}`}>
                    <Zap size={12} className="text-[#E8A33D] mt-0.5 shrink-0" />
                    <p className="text-xs text-[#E8A33D] leading-snug font-semibold">{whyOnline}</p>
                  </div>

                  {isSingle ? (
                    <ul className="hidden sm:grid grid-cols-2 gap-x-4 gap-y-2 mb-5 flex-1">
                      {includes.map((item: string, j: number) => (
                        <li key={j} className="flex items-start gap-1.5 text-xs text-[#C4A882]">
                          <Check size={12} className="text-[#8FA63C] mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-2 mb-5 flex-1">
                      {includes.map((item: string, j: number) => (
                        <li key={j} className="flex items-start gap-1.5 text-xs text-[#C4A882]">
                          <Check size={12} className="text-[#8FA63C] mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Price + CTA */}
                  <div className="mt-auto pt-4 border-t border-[rgba(232,163,61,0.15)]">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] text-[#C4A882] uppercase tracking-wide mb-0.5">{t('from')}</p>
                        <p
                          className="font-bold text-[#C4452D] tabular-nums lining-nums"
                          style={{ fontSize: isSingle ? '1.75rem' : '1.5rem', lineHeight: 1, fontFamily: 'var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif', fontVariantNumeric: 'lining-nums tabular-nums' }}
                        >
                          ${price}
                          <span className="text-xs font-normal text-[#C4A882] ml-1">{t('perPerson')}</span>
                        </p>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <LeadButton
                          ticketType={slug}
                          ctaLocation="ticket_cards"
                          className="flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-5 py-3 rounded-xl transition-all text-sm whitespace-nowrap shadow-md hover:shadow-lg"
                        >
                          {t('bookNow')}
                          <ArrowRight size={14} />
                        </LeadButton>
                      </div>
                    </div>

                    <div className={`flex items-center gap-1.5 mt-3 text-[11px] text-[#C4A882] ${isSingle ? 'hidden sm:flex' : ''}`}>
                      <ShieldCheck size={12} className="text-[#8FA63C]" />
                      Secure booking — instant confirmation
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
