'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { LeadButton } from '@/components/layout/LeadButton';
import { usePaymentsFlags } from '@/components/layout/PaymentsFlagsProvider';
import { Check, ArrowRight, Clock, Star, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { TICKET_PRICES } from '@/lib/ticket-data';

const TICKET_IMAGES = {
  'visitor-pack':        '/images/ticket-skip-the-line.webp',
  'skip-the-line':       '/images/ticket-skip-the-line.webp',
  'guided-tour':         '/images/gallery/bahia-palace-octagonal-cedar-ceiling-carved-wood.jpg',
  'private-tour':        '/images/gallery/bahia-palace-grand-courtyard-balcony-view-fountain.jpg',
  'combo-saadian-tombs': '/images/gallery/bahia-palace-inner-courtyard-central-fountain-stucco.jpg',
};

/**
 * Which products appear on the homepage.
 *
 * The Complete Visitor Pack replaced Skip-the-Line here. They both bundle the
 * same 100 MAD official entry, so showing both meant advertising the same
 * visit at two prices ($10 and $14) — and every ticket CTA now leads to the
 * pack, so a $10 card would have advertised a price the buyer could not get.
 * One product, one price, one destination.
 *
 * skip-the-line is kept in the map (not deleted) because /tickets/skip-the-line
 * still exists as an information page describing the official 100 MAD route.
 */
const TICKET_LIVE = {
  'visitor-pack':        true,
  'skip-the-line':       true,
  'guided-tour':         false,
  'private-tour':        false,
  'combo-saadian-tombs': false,
};

type TicketKey = 'visitorPack' | 'skipTheLine' | 'guidedTour' | 'privateTour' | 'combo';

const TICKET_SLUGS: Record<TicketKey, string> = {
  visitorPack:  'visitor-pack',
  skipTheLine:  'skip-the-line',
  guidedTour:   'guided-tour',
  privateTour:  'private-tour',
  combo:        'combo-saadian-tombs',
};

/** Where the card body links. The pack has its own page, not a /tickets/ one. */
const TICKET_HREF: Record<string, string> = {
  'visitor-pack': '/visitor-pack',
};

/**
 * NOTE on the admin panel: skip-the-line and visitor-pack liveness is decided
 * in code by the payments switch (see liveKeys below), NOT by the DB's
 * TicketType.available. A stale available=true row previously resurrected the
 * $10 card alongside the $14 pack — one visit advertised at two prices.
 */

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
  const { enabled: paymentsEnabled } = usePaymentsFlags();

  const allKeys: TicketKey[] = ['visitorPack', 'skipTheLine', 'guidedTour', 'privateTour', 'combo'];

  /**
   * The pack and skip-the-line are mutually exclusive on the homepage, and
   * the payments switch decides which one is shown — the card must always
   * advertise what the button actually does:
   *
   *   payments ON  → Visitor Pack ($14). Every CTA goes to its checkout.
   *   payments OFF → Skip-the-Line ($10), exactly as today. CTAs go to the
   *                  official portal, where 100 MAD is what you really pay.
   *
   * Showing the $14 pack while the buttons lead to the ministry portal would
   * advertise a product we cannot deliver; showing $10 while they lead to a
   * $14 checkout would be a bait-and-switch. Neither is allowed to happen.
   */
  const liveKeys = allKeys.filter((key) => {
    const slug = TICKET_SLUGS[key];

    if (slug === 'visitor-pack') return paymentsEnabled;
    if (slug === 'skip-the-line') return !paymentsEnabled;

    // Remaining products are admin-toggleable as before.
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
            const includes  = (t.raw(`${key}.includes` as any) as string[]);

            return (
              <div
                key={slug}
                onClick={() => router.push((TICKET_HREF[slug] ?? `/tickets/${slug}`) as any)}
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
                  <div className="absolute top-4 left-0 bg-[#C4452D] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-e-full flex items-center gap-1.5 shadow-lg">
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
                        {/* No "From": there is one fixed price per person, so
                            the label would imply a cheaper option that does not
                            exist. */}
                        <p
                          className="font-bold text-[#C4452D] tabular-nums lining-nums"
                          style={{ fontSize: isSingle ? '1.75rem' : '1.5rem', lineHeight: 1, fontFamily: 'var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif', fontVariantNumeric: 'lining-nums tabular-nums' }}
                        >
                          €{price.toFixed(2)}
                          <span className="text-xs font-normal text-[#C4A882] ms-1">{t('perPerson')}</span>
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

                    {/* Payments OFF → the non-pack cards hand off to the free
                        official portal, so "Free to use" is true of them.
                        Payments ON → every CTA leads to the paid pack, so that
                        claim would be false; show the included-ticket line
                        instead. Gated on the same flag as the funnel. */}
                    <div className={`flex items-center gap-1.5 mt-3 text-[11px] text-[#C4A882] ${isSingle ? 'hidden sm:flex' : ''}`}>
                      <ShieldCheck size={12} className="text-[#8FA63C]" />
                      {slug === 'visitor-pack'
                        ? 'Official entry ticket included — no queue at the booth'
                        : paymentsEnabled
                          ? 'Official ticket included — free cancellation'
                          : 'Free to use — official tickets only'}
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
