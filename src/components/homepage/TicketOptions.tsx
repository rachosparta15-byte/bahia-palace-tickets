'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { LeadButton } from '@/components/layout/LeadButton';
import { AffiliateDisclosure } from '@/components/ui/AffiliateDisclosure';
import { TICKET_PRICES } from '@/lib/ticket-data';

/**
 * THE FOUR DOORS — see DESIGN-DIRECTION.md §7.
 *
 * Not a card grid. Four full-height portrait panels, edge to edge, no gaps and
 * no rounded corners: four openings in a courtyard wall. The whole panel is the
 * link; the price is set at its base like an inscription, in the shadow the
 * photograph falls into.
 *
 * The widths are deliberately unequal. Four identical openings is a grid again,
 * and the cheapest option is the one most visitors take, so it gets the width.
 *
 * All 37 photographs in this project are portrait — 9:16 and 3:4, not one
 * landscape frame. Every previous version of this section cropped them into
 * wide boxes and threw away two thirds of the picture. This shape is the
 * material's own.
 *
 * Unchanged from the card version: the Viator links and their rel attributes,
 * the LeadButton path for the two products with no Viator match, the price
 * source, the two price notes, and the affiliate disclosure.
 */
const OPTION_SLUGS = ['skip-the-line', 'guided-tour', 'private-guide-only', 'private-tour'] as const;

const OPTION_NAME_KEYS: Record<(typeof OPTION_SLUGS)[number], string> = {
  'skip-the-line':      'skipTheLine',
  'guided-tour':        'guidedTour',
  'private-guide-only': 'privateGuideOnly',
  'private-tour':       'privateTour',
};

const OPTION_IMAGES: Record<(typeof OPTION_SLUGS)[number], string> = {
  'skip-the-line':      '/images/tickets/skip-the-line.webp',
  'guided-tour':        '/images/tickets/guided-tour.webp',
  'private-guide-only': '/images/tickets/private-guide-only.webp',
  'private-tour':       '/images/tickets/private-tour.webp',
};

/** The wider door: the cheapest option, and the one most visitors take. */
const FEATURED: (typeof OPTION_SLUGS)[number] = 'skip-the-line';

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
    <section id="ticket-options" className="scroll-mt-24 bg-[#160D06]">
      {/* The heading sits in the dark above the doors — small, quiet, wide
          tracking — so the wall of photographs is the loudest thing here. */}
      <div className="mx-auto max-w-3xl px-6 pb-10 pt-20 text-center">
        <h2
          className="text-[#F5E8CC]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
            lineHeight: 1.02,
            fontWeight: 400,
          }}
        >
          {t('optionsTitle')}
        </h2>
        <p className="mx-auto mt-5 max-w-[52ch] text-[0.95rem] leading-relaxed text-[rgba(245,232,204,0.62)]">
          {t('optionsSubtitle')}
        </p>
      </div>

      {/* The wall. Full bleed, no gaps, no radius — four openings, not four
          cards. Two across on a phone, where four would be 90px wide. */}
      <div className="grid grid-cols-2 md:grid-cols-[1.35fr_1fr_1fr_1fr]">
        {OPTION_SLUGS.map((slug) => {
          const name        = t(`${OPTION_NAME_KEYS[slug]}.name` as any);
          const viatorHref  = VIATOR_LINKS[slug];
          const viatorPrice = VIATOR_PRICES[slug];
          const priceLabel  = viatorPrice ?? `€${TICKET_PRICES[slug].toFixed(2)}`;
          const featured    = slug === FEATURED;

          const inner = (
            <>
              <Image
                src={OPTION_IMAGES[slug]}
                alt={name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
              />

              {/* Light falls from the top of an opening; the base stays in
                  shadow, and the type lives in that shadow. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-[#160D06] from-[20%] via-[#160D06]/48 via-58% to-transparent"
              />
              {/* A hairline between doors, as between two openings in a wall. */}
              <div aria-hidden className="absolute inset-y-0 end-0 w-px bg-[rgba(200,136,42,0.28)]" />

              <div className="relative flex h-full flex-col justify-end p-5 sm:p-7">
                <p
                  className="tabular-nums text-[#F5E8CC]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: featured
                      ? 'clamp(2.2rem, 3.6vw, 3.2rem)'
                      : 'clamp(1.7rem, 2.6vw, 2.4rem)',
                    lineHeight: 1,
                    fontWeight: 400,
                  }}
                >
                  {priceLabel}
                </p>
                <p className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-[rgba(245,232,204,0.5)]">
                  {t('perPerson')}
                </p>

                {/* The brass rule — a short inscription line that draws itself
                    out when the door is hovered. The only motion in the wall. */}
                <span
                  aria-hidden
                  className="mt-4 block h-px w-9 bg-[#C8882A] transition-all duration-500 ease-out group-hover:w-20"
                />

                <h3
                  className="mt-4 text-[0.98rem] leading-snug text-[#F5E8CC] sm:text-[1.12rem]"
                  style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}
                >
                  {name}
                </h3>
                <p className="mt-2 min-h-[3.1em] text-[0.7rem] leading-relaxed text-[rgba(245,232,204,0.55)] sm:min-h-[2.9em] sm:text-[0.76rem]">
                  {viatorHref ? t('priceNotePartner') : t('priceNoteOwn')}
                </p>

                {/* The affordance. Hover alone is invisible on a phone, and
                    four unlabelled photographs are a puzzle, not a design. */}
                <span className="mt-4 inline-flex items-center gap-1.5 text-[0.66rem] font-medium uppercase tracking-[0.22em] text-[#C8882A]">
                  {t('optionsView')}
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                </span>
              </div>
            </>
          );

          const shell =
            'group relative block h-[420px] w-full overflow-hidden text-left sm:h-[520px] md:h-[600px]';

          return viatorHref ? (
            <a
              key={slug}
              href={viatorHref}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className={shell}
            >
              {inner}
            </a>
          ) : (
            <LeadButton key={slug} ticketType={slug} ctaLocation="ticket_options" className={shell}>
              {inner}
            </LeadButton>
          );
        })}
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-16 pt-8">
        <AffiliateDisclosure className="text-center !text-[rgba(245,232,204,0.58)]" />
      </div>
    </section>
  );
}
