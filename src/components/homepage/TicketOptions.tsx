'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { LeadButton } from '@/components/layout/LeadButton';
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
    <section id="ticket-options" className="scroll-mt-24 bg-cream py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2
            className="text-deep-brown mb-2"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
          >
            {t('optionsTitle')}
          </h2>
          <p className="text-brown-mid max-w-2xl mx-auto leading-relaxed text-sm">{t('optionsSubtitle')}</p>
        </div>

        {/* Always two columns, even on a narrow phone — matching the
            reference layout rather than stacking to one column. Every size
            below has a compact mobile value and a roomier sm: one so the
            price + CTA split still fits inside half a small screen. */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          {OPTION_SLUGS.map((slug) => {
            const nameKey = OPTION_NAME_KEYS[slug];
            const name    = t(`${nameKey}.name` as any);

            const viatorHref  = VIATOR_LINKS[slug];
            const viatorPrice = VIATOR_PRICES[slug];

            // Two different providers cannot show two different prices on
            // the same card — where a Viator match exists, the whole card
            // (price included) reflects what Viator actually charges, in
            // Viator's own currency, and both halves lead there.
            const priceLabel = viatorPrice ?? `€${TICKET_PRICES[slug].toFixed(2)}`;
            const priceHref  = viatorHref ?? (`/tickets/${slug}` as any);
            const ctaHref    = viatorHref;

            return (
              <div
                key={slug}
                className="flex overflow-hidden rounded-xl border border-dashed border-[rgba(196,168,130,0.45)] bg-[#FFFDF8]"
              >
                {/* Price side — the product's own info page, unless this
                    card now points at Viator, in which case both halves do. */}
                <Link
                  href={priceHref}
                  {...(viatorHref ? { target: '_blank', rel: 'noopener noreferrer sponsored' } : {})}
                  className="flex w-[76px] shrink-0 flex-col items-center justify-center px-2 py-3 text-center transition-colors hover:bg-[#F5EBD8] sm:w-32 sm:px-3 sm:py-4"
                >
                  <span
                    className="text-sm font-bold tabular-nums text-[#7A5A32] sm:text-xl"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {priceLabel}
                  </span>
                  <span className="mt-0.5 text-[8px] text-brown-mid sm:text-[10px]">{t('perPerson')}</span>
                </Link>

                {/* CTA side. With a Viator match: a direct external link,
                    Viator's own commission-earning booking flow (see
                    VIATOR_LINKS). Otherwise: the ordinary lead-capture /
                    checkout behaviour every other ticket button uses. */}
                {ctaHref ? (
                  <a
                    href={ctaHref}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex flex-1 flex-col items-start justify-center gap-1.5 bg-[#251A0F] px-2.5 py-3 text-left transition-colors hover:bg-[#2E1F12] sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5 sm:py-4"
                  >
                    <span
                      className="text-[12px] font-semibold leading-snug text-[#F5E8CC] sm:text-base"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {name}
                    </span>
                    <span className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[10px] font-semibold text-[#E8A33D] sm:text-xs">
                      {t('bookNow')}
                      <ArrowRight size={11} className="shrink-0 sm:hidden" />
                      <ArrowRight size={13} className="hidden shrink-0 sm:block" />
                    </span>
                  </a>
                ) : (
                  <LeadButton
                    ticketType={slug}
                    ctaLocation="ticket_options"
                    className="flex flex-1 flex-col items-start justify-center gap-1.5 bg-[#251A0F] px-2.5 py-3 text-left transition-colors hover:bg-[#2E1F12] sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5 sm:py-4"
                  >
                    <span
                      className="text-[12px] font-semibold leading-snug text-[#F5E8CC] sm:text-base"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {name}
                    </span>
                    <span className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[10px] font-semibold text-[#E8A33D] sm:text-xs">
                      {t('bookNow')}
                      <ArrowRight size={11} className="shrink-0 sm:hidden" />
                      <ArrowRight size={13} className="hidden shrink-0 sm:block" />
                    </span>
                  </LeadButton>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
