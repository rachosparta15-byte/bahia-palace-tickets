'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight, Clock, ShieldCheck, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import { LeadButton } from '@/components/layout/LeadButton';
import { AffiliateDisclosure } from '@/components/ui/AffiliateDisclosure';
import { TICKET_PRICES } from '@/lib/ticket-data';

/**
 * The other three products, browsable side by side — deliberately separate
 * from TicketCards above, which carries the pack/skip-the-line mutual
 * exclusivity and the price-teaser branching. Mixing that logic into a
 * plain browse grid would make both harder to reason about; this component
 * only reads prices and names, and leaves selling to LeadButton.
 */
// Cheapest to most expensive ($13 → $17.75 → $23.83 → $65.38) — see
// VIATOR_PRICES below for the actual figures this ordering has to track.
const OPTION_SLUGS = ['skip-the-line', 'private-guide-only', 'guided-tour', 'private-tour'] as const;

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
 * price or title alone. Most shared/group "Bahia Palace" tours on Viator
 * exclude the entry ticket ("Admission Ticket Not Included", paid in cash
 * on site) — checked again 2026-09-07 while looking for 'guided-tour' and
 * 'private-guide-only' matches and still true of most listings.
 * 'guided-tour' matches "Marrakech: Saadian Tombs & Bahia Palace, Souk and
 * Medina Tour" (d5408-467170P4): "What's Included" states "Entrance fees to
 * monuments Bahia Palace (adult 100 MAD)" in so many words.
 * 'private-guide-only' matches "Marrakech: Bahia palace, Saadian Tombs, Souk
 * & Medina Tour" (d5408-199649P3): its own "What's Included" lists "Private
 * or shared group walking tour (depending on option selected)" — the private
 * option this product name promises — and "Entrance fee - Bahia palace
 * €10.00 per person" as a separate, explicit line.
 */
const VIATOR_LINKS: Partial<Record<(typeof OPTION_SLUGS)[number], string>> = {
  'skip-the-line':
    'https://www.viator.com/tours/Marrakech/Marrakech-Bahia-Palace-Skip-the-Line-Ticket-With-Audio-Guide/d5408-5670595P2?pid=P00316815&mcid=42383&medium=link&campaign=visitbahiapalace-ticketoptions',
  'guided-tour':
    'https://www.viator.com/tours/Marrakech/Marrakech-Saadian-Tombs-Bahia-Palace-Medina-and-Souk-Tour/d5408-467170P4?pid=P00316815&mcid=42383&medium=link&campaign=visitbahiapalace-ticketoptions',
  'private-guide-only':
    'https://www.viator.com/tours/Marrakech/Marrakech-local-guide-historical-tour/d5408-199649P3?pid=P00316815&mcid=42383&medium=link&campaign=visitbahiapalace-ticketoptions',
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
  'skip-the-line':       '$13.00',
  'guided-tour':         '$23.83',
  'private-guide-only':  '$17.75',
  'private-tour':        '$65.38',
};

/**
 * One photograph per product, reused from the same shoot as TicketCards
 * and the gallery — no new imagery, so nothing here can go stale or 404.
 * private-guide-only gets the empty reception room specifically because an
 * empty room is the honest image for a *private* guide; the crowded
 * courtyard shot (also in the gallery) would undercut the word "private".
 */
const IMAGE: Record<(typeof OPTION_SLUGS)[number], string> = {
  'skip-the-line':      '/images/ticket-skip-the-line.webp',
  'guided-tour':        '/images/gallery/bahia-palace-octagonal-cedar-ceiling-carved-wood.jpg',
  'private-guide-only': '/images/gallery/bahia-palace-grand-reception-room.webp',
  'private-tour':       '/images/gallery/bahia-palace-grand-courtyard-balcony-view-fountain.jpg',
};

export function TicketOptions() {
  const t = useTranslations('tickets');

  return (
    <section id="ticket-options" className="relative overflow-hidden scroll-mt-24 bg-[#160D06] py-16">
      {/* Zellige accent overlay — same treatment as WhyBookUs and TicketCards,
          so the pattern reads as continuous down the page. */}
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
      <div className="relative max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2
            className="text-[#F5E8CC] mb-2"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)' }}
          >
            {t('optionsTitle')}
          </h2>
          <p className="text-[rgba(245,232,204,0.6)] max-w-2xl mx-auto leading-relaxed text-xs">{t('optionsSubtitle')}</p>

          <div className="mt-6 grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap sm:justify-center sm:gap-2.5">
            {[
              { Icon: ShieldCheck,   key: 'trustSecurePayment' },
              { Icon: CheckCircle2,  key: 'trustInstantConfirm' },
              { Icon: RotateCcw,     key: 'trustFreeCancel' },
              { Icon: Award,         key: 'trustViatorPartner' },
            ].map(({ Icon, key }, i) => (
              <span
                key={key}
                className="trust-badge-glow flex items-center justify-center gap-1 rounded-full bg-[#E8A33D] px-2 py-1.5 text-center text-[0.56rem] font-bold leading-tight text-[#1C1108] sm:justify-start sm:gap-1.5 sm:px-3 sm:text-[0.64rem]"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                <Icon size={12} className="shrink-0 sm:size-[14px]" />
                {t(key as any)}
              </span>
            ))}
          </div>
        </div>

        {/* Vertical cards — photo, then name/duration/note, then price + CTA
            pinned to the bottom edge. Modelled on the Viator widget card
            (image, title, duration, cancellation note, price, one button)
            but in the site's own dark ground rather than Viator's white one.
            No star rating: we have no review data of our own for these four
            products, and inventing one is exactly the kind of unverifiable
            trust signal that got the site flagged under AdSense's
            Misrepresentation policy before — see AffiliateDisclosure. */}
        <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:gap-6">
          {OPTION_SLUGS.map((slug) => {
            const nameKey = OPTION_NAME_KEYS[slug];
            // A regular "-" is a valid line-break point to a browser, so
            // "Coupe-File" was splitting into "Coupe-" / "File" once the
            // column narrowed. U+2011 reads identically but never breaks.
            const name     = t(`${nameKey}.name` as any).replace(/-/g, '‑');
            const duration = t(`${nameKey}.duration` as any);

            const viatorHref  = VIATOR_LINKS[slug];
            const viatorPrice = VIATOR_PRICES[slug];

            // Two different providers cannot show two different prices on
            // the same card — where a Viator match exists, the whole card
            // (price included) reflects what Viator actually charges, in
            // Viator's own currency.
            const priceLabel = viatorPrice ?? `€${TICKET_PRICES[slug].toFixed(2)}`;

            // skip-the-line's Viator listing is specifically "...Ticket With
            // Audio Guide" and lists it under What's Included — a real
            // inclusion worth naming. Not true of the private-tour Viator
            // match (a general city tour), which keeps the plain partner
            // note; own-sold products keep their own note.
            const note = slug === 'skip-the-line' && viatorHref
              ? t('priceNotePartnerAudio')
              : viatorHref
                ? t('priceNotePartner')
                : t('priceNoteOwn');

            const cardInner = (
              <>
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
                  <Image
                    src={IMAGE[slug]}
                    alt={name}
                    fill
                    sizes="(max-width: 1023px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-2.5 lg:p-4">
                  <h3
                    className="text-[12px] font-semibold leading-snug text-[#F5E8CC] lg:text-base"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {name}
                  </h3>

                  <span className="mt-1.5 flex items-center gap-1 text-[9px] text-[rgba(245,232,204,0.55)] lg:text-[11px]">
                    <Clock size={11} className="shrink-0 text-[#E8A33D]" />
                    {duration}
                  </span>

                  <p className="mt-1.5 text-[9px] leading-snug text-[rgba(245,232,204,0.45)] lg:text-[11px]">
                    {note}
                  </p>

                  {/* Stacked on narrow cards: the price needs its full width
                      to render ("$13.00" was getting squeezed under 40px next
                      to a shrink-0 button and clipping to "$13." at the card's
                      own overflow-hidden edge). Side by side only once sm:
                      gives each card enough width for both at once. */}
                  <div className="mt-auto flex flex-col gap-1.5 pt-2.5 border-t border-[rgba(232,163,61,0.18)] sm:flex-row sm:items-end sm:justify-between sm:gap-2 lg:pt-3">
                    <div>
                      <div className="text-[8px] uppercase tracking-wide text-[rgba(245,232,204,0.5)] lg:text-[9px]">
                        {t('perPerson')}
                      </div>
                      <div
                        className="text-[15px] font-bold tabular-nums text-[#E8A33D] lg:text-xl"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {priceLabel}
                      </div>
                    </div>
                    <span className="flex items-center justify-center gap-1 rounded-full bg-[#E8A33D] px-2 py-1.5 text-[9px] font-bold text-[#1C1108] sm:justify-start sm:py-1 lg:px-3 lg:py-1.5 lg:text-xs">
                      {t('bookNow')}
                      <ArrowRight size={11} className="shrink-0 lg:size-[13px]" />
                    </span>
                  </div>
                </div>
              </>
            );

            // w-full matters here specifically for the <button> branch below
            // (LeadButton, when there's no Viator link): unlike <a> or <div>,
            // a <button> is a form control and does NOT stretch to fill a
            // block/flex parent's width by default, even at display:flex —
            // it sizes to content. Without w-full the button sat ~35%
            // narrower than its ring wrapper, leaving a gap that exposed the
            // raw spinning gradient instead of the card's own background.
            const cardClass =
              'group relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-[#251A0F] transition-shadow hover:shadow-[0_8px_28px_rgba(232,163,61,0.25)]';

            return (
              // .spin-ring (globals.css) — a gradient border animated via a
              // registered custom property, not a rotating clipped element.
              // The earlier .hero-spin-based version (oversized rotating
              // square + overflow-hidden) intermittently painted the raw
              // gradient past the card on these specific grid items —
              // reproducible, survived contain:paint and will-change, so
              // this card uses the technique that structurally can't have
              // that failure mode instead of chasing the cause further.
              <div key={slug} className="spin-ring h-full rounded-2xl">
                {viatorHref ? (
                  <a
                    href={viatorHref}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className={cardClass}
                  >
                    {cardInner}
                  </a>
                ) : (
                  <LeadButton ticketType={slug} ctaLocation="ticket_options" className={cardClass}>
                    {cardInner}
                  </LeadButton>
                )}
              </div>
            );
          })}
        </div>

        <AffiliateDisclosure className="mt-6 text-center !text-[rgba(245,232,204,0.42)]" />
      </div>
    </section>
  );
}
