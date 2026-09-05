'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { LeadButton } from '@/components/layout/LeadButton';
import { AffiliateDisclosure } from '@/components/ui/AffiliateDisclosure';
import { OrnamentDivider } from '@/components/ui/ZelligePattern';
import { ZelligeField } from '@/components/ui/ZelligeField';
import { TICKET_PRICES } from '@/lib/ticket-data';

/**
 * The other three products, browsable side by side — deliberately separate
 * from TicketCards above, which carries the pack/skip-the-line mutual
 * exclusivity and the price-teaser branching. Mixing that logic into a
 * plain browse grid would make both harder to reason about; this component
 * only reads prices and names, and leaves selling to LeadButton.
 */
const OPTION_SLUGS = ['skip-the-line', 'guided-tour', 'private-guide-only', 'private-tour'] as const;

const OPTION_NAME_KEYS: Record<(typeof OPTION_SLUGS)[number], string> = {
  'skip-the-line':      'skipTheLine',
  'guided-tour':        'guidedTour',
  'private-guide-only': 'privateGuideOnly',
  'private-tour':       'privateTour',
};

/**
 * One photograph per product, from our own gallery.
 *
 * Chosen for what the product is rather than for prettiness alone: the
 * entrance arch for the ticket that gets you through it, visitors following a
 * guide under an archway for the guided tour, the painted hall ceiling for the
 * private guide who has the time to stop and explain it, and the grand
 * courtyard for the private tour. Every one is the Bahia Palace — this section
 * sells admission to one building, so there is nothing else it could honestly
 * show.
 */
const OPTION_IMAGES: Record<(typeof OPTION_SLUGS)[number], string> = {
  'skip-the-line':      '/images/tickets/skip-the-line.webp',
  'guided-tour':        '/images/tickets/guided-tour.webp',
  'private-guide-only': '/images/tickets/private-guide-only.webp',
  'private-tour':       '/images/tickets/private-tour.webp',
};

/**
 * Viator affiliate links — the booking path while PAYMENTS_HALTED is true
 * (see src/lib/payments/guard.ts). This earns commission with zero
 * payment-processing liability on our side, unlike the lead-capture modal
 * LeadButton opens, which converts nobody until payments come back.
 *
 * Only populated for products BOTH matching in scope AND confirmed (on the
 * product's own Viator page) to include Bahia Palace admission — never on
 * price or title alone. Checked and rejected for 'guided-tour': every
 * shared/group Bahia Palace tour found on Viator excludes the entry ticket
 * ("Admission Ticket Not Included", paid in cash on site), which contradicts
 * "Skip-the-line access" as promised for that product on TicketCards and its
 * own /tickets/guided-tour page. No match exists at all for
 * 'private-guide-only' (a private guide with no ticket bundled is not a
 * product type sold on Viator). Both keep the ordinary LeadButton flow.
 */
const VIATOR_LINKS: Partial<Record<(typeof OPTION_SLUGS)[number], string>> = {
  'skip-the-line':
    'https://www.viator.com/tours/Marrakech/Marrakech-Bahia-Palace-Skip-the-Line-Ticket-With-Audio-Guide/d5408-5670595P2?pid=P00316815&mcid=42383&medium=link&campaign=visitbahiapalace-ticketoptions',
  'private-tour':
    'https://www.viator.com/tours/Marrakech/Marrakech-Highlights-Private-4hr-City-Tour/d5408-326890P2?pid=P00316815&mcid=42383&medium=link&campaign=visitbahiapalace-ticketoptions',
};

/**
 * The price actually charged on the matched Viator page, in Viator's own
 * currency (USD) — never converted to EUR here, so this can never say a
 * currency the visitor isn't actually charged. Re-check against the live
 * Viator page occasionally; these are not wired to update automatically.
 */
const VIATOR_PRICES: Partial<Record<(typeof OPTION_SLUGS)[number], string>> = {
  'skip-the-line': '$13.00',
  'private-tour':  '$65.38',
};

export function TicketOptions() {
  const t = useTranslations('tickets');

  return (
    <section id="ticket-options" className="scroll-mt-24 relative overflow-hidden bg-cream py-16">
      {/* The palace's own wall: an interlacing eight-point star field, drawn
          large and at a strength you can actually see. The site's stock
          .zellige tile bakes opacity 0.07 into its SVG at 60px, which vanishes
          into the cream — twice the scale and real colour is what makes it
          read as tilework instead of as a screen tone.

          It is dimmed slightly behind the cards so the photographs stay the
          brightest thing in the section, and nowhere else. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FDF8EF] via-[#F5EBD8] to-[#FDF8EF]" />
      <ZelligeField
        className="pointer-events-none absolute inset-0"
        size={132}
        opacity={0.9}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 62% 46% at 50% 62%, rgba(253,248,239,0.82) 0%, rgba(253,248,239,0.35) 55%, transparent 78%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="text-center">
          <h2
            className="text-deep-brown mb-2"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
          >
            {t('optionsTitle')}
          </h2>
          <p className="text-brown-mid max-w-2xl mx-auto leading-relaxed text-sm">{t('optionsSubtitle')}</p>
        </div>

        <OrnamentDivider />

        {/* Two across on a phone, four from md up. A photograph needs width to
            be worth including, and at four-across on a laptop each card still
            holds a readable 16:10 image. */}
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {OPTION_SLUGS.map((slug) => {
            const nameKey = OPTION_NAME_KEYS[slug];
            const name    = t(`${nameKey}.name` as any);

            const viatorHref  = VIATOR_LINKS[slug];
            const viatorPrice = VIATOR_PRICES[slug];

            // Two different providers cannot show two different prices on
            // the same card — where a Viator match exists, the whole card
            // (price included) reflects what Viator actually charges, in
            // Viator's own currency.
            const priceLabel = viatorPrice ?? `€${TICKET_PRICES[slug].toFixed(2)}`;

            const media = (
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={OPTION_IMAGES[slug]}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
                {/* The price sits on the photograph over a scrim that darkens
                    only the bottom strip — a separate price panel beside the
                    image would take the width the image needs. */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#160D06] via-[#160D06]/55 to-transparent"
                />
                <span
                  className="absolute bottom-2 left-2.5 text-base font-bold tabular-nums text-[#F5E8CC] sm:bottom-3 sm:left-3.5 sm:text-xl"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {priceLabel}
                  <span className="ms-1.5 align-middle text-[9px] font-normal text-[#E8C48A] sm:text-[10px]">
                    {t('perPerson')}
                  </span>
                </span>
              </div>
            );

            const body = (
              <div className="flex flex-1 flex-col justify-between gap-2 bg-[#251A0F] px-3 py-3 transition-colors group-hover:bg-[#2E1F12] sm:px-4 sm:py-4">
                <span
                  className="text-left text-[12.5px] font-semibold leading-snug text-[#F5E8CC] sm:text-[15px]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {name}
                </span>
                <span className="flex items-center gap-1 whitespace-nowrap text-[10px] font-semibold text-[#E8A33D] sm:text-xs">
                  {t('bookNow')}
                  <ArrowRight size={12} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            );

            const shell =
              'group flex h-full w-full flex-col overflow-hidden rounded-xl border border-[rgba(196,168,130,0.45)] bg-[#251A0F] shadow-[0_2px_10px_rgba(61,40,23,0.10)] transition-shadow hover:shadow-[0_10px_28px_rgba(61,40,23,0.20)]';

            return (
              <div key={slug} className="flex h-full flex-col">
                {viatorHref ? (
                  <a
                    href={viatorHref}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className={shell}
                  >
                    {media}
                    {body}
                  </a>
                ) : (
                  <LeadButton ticketType={slug} ctaLocation="ticket_options" className={shell}>
                    {media}
                    {body}
                  </LeadButton>
                )}

                {/* What the number above actually buys. A price alone next to
                    "Official tickets" reads as the gate price, which is what the
                    old homepage copy encouraged and what AdSense refused the site
                    over. Two variants because two different things are true: our
                    own cards bundle the 100 MAD ticket with the service, and a
                    Viator card is a booking we neither price nor charge. */}
                <p className="mt-1.5 min-h-[2.6em] px-0.5 text-[10px] leading-snug text-brown-mid/80 sm:min-h-[2.4em] sm:text-[11px]">
                  {viatorHref ? t('priceNotePartner') : t('priceNoteOwn')}
                </p>
              </div>
            );
          })}
        </div>

        <AffiliateDisclosure className="mt-6 text-center" />
      </div>
    </section>
  );
}
