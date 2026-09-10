'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { LeadButton } from '@/components/layout/LeadButton';
import { usePaymentsFlags } from '@/components/layout/PaymentsFlagsProvider';
import { Check, ArrowRight, Clock, Star, ShieldCheck, Headphones } from 'lucide-react';
import Image from 'next/image';
import { TICKET_PRICES } from '@/lib/ticket-data';
import { buyingPathPriceLabel, TEASER_PRICE_ENABLED } from '@/config/pricing';

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
 * skip-the-line's booking path while PAYMENTS_HALTED is true, on the owner's
 * instruction — this card now leads to the same Viator product, at the same
 * price, as its match in TicketOptions (VIATOR_LINKS['skip-the-line'] there).
 * Keep both URLs in sync if this one ever changes.
 */
const SKIP_THE_LINE_VIATOR_URL =
  'https://www.viator.com/tours/Marrakech/Marrakech-Bahia-Palace-Skip-the-Line-Ticket-With-Audio-Guide/d5408-5670595P2?pid=P00316815&mcid=42383&medium=link&campaign=visitbahiapalace-ticketcards';
const SKIP_THE_LINE_VIATOR_PRICE = '$13.00';

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
    /*
     * Kept on the same dark ground as every other section, so the courtyard
     * and the ticket grid below it read as one homepage instead of a cream
     * island between two dark walls. Was a light band on purpose once; that
     * only worked while it sat between two OTHER cream sections, and it
     * stopped being true when TicketOptions went dark.
     */
    <section className="relative overflow-hidden bg-[#251A0F] pt-16 pb-20">
      {/* Zellige accent overlay — same treatment as WhyBookUs, so the pattern
          reads as continuous rather than appearing only on some sections. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'var(--zellige-tile-accent)',
          backgroundSize: 'var(--zellige-size)',
          backgroundRepeat: 'repeat',
          opacity: 0.18,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-6">

        <div className="text-center mb-10">
          <h2
            className="text-[#F5E8CC] mb-2"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[rgba(245,232,204,0.6)] max-w-2xl mx-auto leading-relaxed text-sm">{t('subtitle')}</p>
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
            // Only badge it when the product's own includes list actually
            // says so — never a claim independent of the real data.
            const hasAudioGuide = includes.some((item) => /audio ?guide|audioguide/i.test(item));

            const isSkipTheLineViator = slug === 'skip-the-line';
            // null in paid mode (messages/paid/<locale>.json explicitly
            // overrides this to null — see mergeMessages.ts), since that
            // mode already promises WhatsApp support inside includes[2].
            // Every other card has no key here at all, so this is read
            // only under isSkipTheLineViator below.
            const whatsappNote = isSkipTheLineViator
              ? (t.raw(`${key}.whatsappNote` as any) as string | null)
              : null;

            return (
              // .spin-ring (globals.css) — see the long comment on this
              // class for why: the .hero-spin (rotating clipped element)
              // version intermittently leaked its raw gradient past the
              // card on grid items like this one.
              <div
                key={slug}
                className={`spin-ring rounded-2xl ${isSingle ? 'w-full max-w-2xl' : ''}`}
              >
                <div
                  onClick={() => {
                    if (isSkipTheLineViator) {
                      window.open(SKIP_THE_LINE_VIATOR_URL, '_blank', 'noopener,noreferrer');
                      return;
                    }
                    router.push((TICKET_HREF[slug] ?? `/tickets/${slug}`) as any);
                  }}
                  className={`relative flex overflow-hidden rounded-2xl bg-[#251A0F] shadow-[0_0_28px_rgba(232,163,61,0.10),0_0_64px_rgba(232,163,61,0.07),0_16px_56px_rgba(0,0,0,0.50)] transition-all cursor-pointer hover:shadow-[0_0_36px_rgba(232,163,61,0.20),0_0_80px_rgba(232,163,61,0.12),0_20px_64px_rgba(0,0,0,0.55)] motion-reduce:transition-none active:scale-[0.99]
                  ${isSingle
                    ? 'w-full flex-col sm:flex-row'
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

                  {/* Audio guide badge — only rendered when the product's own
                      includes list names one (see hasAudioGuide above), so
                      this can never claim it for a product that doesn't. */}
                  {hasAudioGuide && (
                    <div className="absolute bottom-3 left-3 bg-[#E8A33D] text-[#1C1108] text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                      <Headphones size={11} className="shrink-0" /> {t('audioGuideBadge')}
                    </div>
                  )}
                </div>

                {/* Content side */}
                <div className={`flex flex-col flex-1 ${isSingle ? 'p-5 sm:p-6' : 'p-6'}`}>

                  <h3
                    className="text-[#F5E8CC] leading-snug mb-1"
                    style={{ fontFamily: 'var(--font-heading)', fontSize: isSingle ? '1.3rem' : '1.15rem', fontWeight: 700 }}
                  >
                    {name}
                  </h3>
                  {/* The tagline is "Official entry ticket + digital audio
                      guide" and it sits four lines above the price, so during
                      the teaser test it itemises the pack directly over
                      "100 DH per person" — the same thing the ticked list below
                      was doing.

                      Hidden rather than reworded: every alternative would need
                      seven new translations, and the card still carries the
                      product's NAME, which is what identifies it. What the pack
                      contains is stated once, at the payment step, beside the
                      real total. */}
                  {!TEASER_PRICE_ENABLED && (
                    <p className="text-[#C4A882] text-sm mb-3 leading-snug">{tagline}</p>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-[#8FA63C] mb-4">
                    <Clock size={12} />
                    <span>{duration}</span>
                  </div>

                  {/* The ticked list is held back to the payment step during
                      the teaser test — the price sits directly beneath it in
                      this card, so "Premium audio guide" reads as what 100 DH
                      buys, and 100 DH is the Ministry's entry ticket.

                      flex-1 moves onto the spacer so the cards keep equal
                      heights and the CTA stays pinned to the bottom; without it
                      a card with no list collapses and the buttons stop lining
                      up across the row. */}
                  {!TEASER_PRICE_ENABLED ? (
                    isSingle ? (
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
                    )
                  ) : (
                    <div className="flex-1" aria-hidden="true" />
                  )}

                  {/* Same muted-note style as audioGuideValueNote below —
                      plain text for now; the WhatsApp link inside it is
                      added in Phase 2. */}
                  {whatsappNote && (
                    <p className="-mt-3 mb-5 text-[10px] leading-snug text-[rgba(245,232,204,0.55)]">
                      {whatsappNote}
                    </p>
                  )}

                  {/* Price + CTA */}
                  <div className="mt-auto pt-4 border-t border-[rgba(232,163,61,0.15)]">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        {/* Label above, price below — matches the card
                            layout in TicketOptions just below this section,
                            so the two ticket blocks read as one system. */}
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-[rgba(245,232,204,0.5)]">
                          {t('perPerson')}
                        </div>
                        {/* No "From": there is one fixed price per person, so
                            the label would imply a cheaper option that does not
                            exist. */}
                        <p
                          className="font-bold text-[#E8A33D] tabular-nums lining-nums"
                          style={{ fontSize: isSingle ? '1.75rem' : '1.5rem', lineHeight: 1.2, fontFamily: 'var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif', fontVariantNumeric: 'lining-nums tabular-nums' }}
                        >
                          {/* The live pack reads the buying-path label so the
                              teaser test reaches this card too; anything else
                              still prints its own euro price. Missing this one
                              would have left a €11.99 card sitting on the same
                              screen as a 100 DH hero. skip-the-line reads the
                              Viator price it now actually charges — see
                              SKIP_THE_LINE_VIATOR_URL above. */}
                          {isSkipTheLineViator
                            ? SKIP_THE_LINE_VIATOR_PRICE
                            : slug === 'visitor-pack'
                              ? buyingPathPriceLabel()
                              : `€${price.toFixed(2)}`}
                        </p>
                        {/* $13 reads as a markup over the 100 MAD gate price
                            unless the reason is right under it — the audio
                            guide is *why* no human guide is needed, which is
                            the comparison a visitor is actually making. */}
                        {isSkipTheLineViator && (
                          <div className="mt-0.5 text-[10px] leading-snug text-[rgba(245,232,204,0.55)]">
                            {t('audioGuideValueNote')}
                          </div>
                        )}
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        {isSkipTheLineViator ? (
                          <a
                            href={SKIP_THE_LINE_VIATOR_URL}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="trust-badge-glow flex items-center gap-2 bg-[#E8A33D] hover:bg-[#F0B84E] text-[#1C1108] font-semibold px-5 py-3 rounded-xl transition-all text-sm whitespace-nowrap"
                          >
                            {t('bookNow')}
                            <ArrowRight size={14} />
                          </a>
                        ) : (
                          <LeadButton
                            ticketType={slug}
                            ctaLocation="ticket_cards"
                            className="trust-badge-glow flex items-center gap-2 bg-[#E8A33D] hover:bg-[#F0B84E] text-[#1C1108] font-semibold px-5 py-3 rounded-xl transition-all text-sm whitespace-nowrap"
                          >
                            {t('bookNow')}
                            <ArrowRight size={14} />
                          </LeadButton>
                        )}
                      </div>
                    </div>

                    {/* This said "Free to use — official tickets only" while
                        payments were off, reasoning that these cards hand off
                        to the free Ministry portal. That stopped being the
                        whole truth once TicketOptions began sending the same
                        named products to paid Viator links from the same
                        homepage: one page cannot carry "Skip-the-Line Entry —
                        free to use" above and "Skip-the-Line Entry — $13.00"
                        below it. AdSense refused the site over that pair.
                        Both branches now describe the ticket instead of
                        asserting a price of zero for the site as a whole.

                        skip-the-line no longer hands off to the Ministry
                        portal at all — it books and charges through Viator,
                        same as its match below in TicketOptions, so it reads
                        the identical partner note instead. */}
                    <div className={`flex items-center gap-1.5 mt-3 text-[11px] text-[#C4A882] ${isSingle ? 'hidden sm:flex' : ''}`}>
                      <ShieldCheck size={12} className="text-[#8FA63C]" />
                      {slug === 'visitor-pack'
                        ? 'Official entry ticket included — no queue at the booth'
                        : isSkipTheLineViator
                          ? t('priceNotePartnerAudio')
                          : 'Official ticket included — free cancellation'}
                    </div>
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
