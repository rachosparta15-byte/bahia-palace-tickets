'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { LeadButton } from '@/components/layout/LeadButton';
import { AffiliateDisclosure } from '@/components/ui/AffiliateDisclosure';
import { TICKET_PRICES } from '@/lib/ticket-data';

/**
 * CHOOSE HOW YOU EXPERIENCE BAHIA — see DESIGN-DIRECTION.md.
 *
 * Three movements, not a grid:
 *
 *   1. An overture. Full-bleed architecture with the editorial line set into
 *      its lower third. Nothing purchasable — the visitor arrives before they
 *      are asked anything.
 *   2. One experience plated. Asymmetric spread: the photograph bleeds off the
 *      leading edge, the text is held in a narrow column with a deep margin.
 *   3. Three experiences indexed. Full-width rows on hairlines, no photographs
 *      at all — an outlined numeral, the name, its tagline, and a price
 *      right-aligned so the three figures form a vertical line.
 *
 * The absence of photography on the other three IS the hierarchy. A museum
 * catalogue plates the highlighted work and indexes the rest; four photographs
 * of equal size is a pricing table whatever shape the corners are.
 *
 * The price never leads. On the featured spread it sits low in the block, below
 * the tagline and the duration; in the index it is a catalogue figure. What
 * leads is the experience.
 *
 * Unchanged from every previous version: the Viator links and their rel
 * attributes, the LeadButton path for the two products with no Viator match,
 * the price source, both price notes, and the affiliate disclosure.
 */
const OPTION_SLUGS = ['skip-the-line', 'guided-tour', 'private-guide-only', 'private-tour'] as const;
type Slug = (typeof OPTION_SLUGS)[number];

const OPTION_NAME_KEYS: Record<Slug, string> = {
  'skip-the-line':      'skipTheLine',
  'guided-tour':        'guidedTour',
  'private-guide-only': 'privateGuideOnly',
  'private-tour':       'privateTour',
};

/**
 * The plated experience.
 *
 * Skip-the-line, and deliberately not the most expensive one. It is what most
 * visitors actually take, it is a Viator link that earns, and the editorial
 * line is honest: the palace is the experience, this only opens the door.
 * Featuring a EUR 25 group tour as "luxury" would be a lie the photographs
 * would immediately contradict.
 */
const FEATURED: Slug = 'skip-the-line';
const INDEXED = OPTION_SLUGS.filter((s) => s !== FEATURED);

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
const VIATOR_LINKS: Partial<Record<Slug, string>> = {
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
const VIATOR_PRICES: Partial<Record<Slug, string>> = {
  'skip-the-line': '$13.00',
  'private-tour':  '$65.38',
};

export function TicketOptions() {
  const t = useTranslations('tickets');

  const priceOf = (slug: Slug) => VIATOR_PRICES[slug] ?? `€${TICKET_PRICES[slug].toFixed(2)}`;
  const nameOf  = (slug: Slug) => t(`${OPTION_NAME_KEYS[slug]}.name` as any);
  const lineOf  = (slug: Slug) => t(`${OPTION_NAME_KEYS[slug]}.tagline` as any);
  const timeOf  = (slug: Slug) => t(`${OPTION_NAME_KEYS[slug]}.duration` as any);

  return (
    <section id="ticket-options" className="scroll-mt-24 bg-[#160D06]">
      {/* ── 1 · OVERTURE ────────────────────────────────────────────────
          A full screen of architecture with one line set into its lower
          third. Nothing to buy. The visitor arrives first. */}
      <div className="relative h-[46vh] max-h-[440px] min-h-[320px] w-full overflow-hidden md:h-[62vh] md:max-h-none md:min-h-[460px]">
        <Image
          src="/images/tickets/overture-aerial.webp"
          alt=""
          aria-hidden
          fill
          priority={false}
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#160D06] from-[16%] via-[#160D06]/78 via-46% to-[#160D06]/20"
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-6 pb-12 md:pb-16">
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.42em] text-[#C8882A]">
              {t('optionsLabel')}
            </p>
            <h2
              className="mt-5 whitespace-pre-line text-[#F5E8CC]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6.4vw, 5.4rem)',
                lineHeight: 0.98,
                fontWeight: 400,
              }}
            >
              {t('optionsTitle')}
            </h2>
          </div>
        </div>
      </div>

      {/* ── 2 · THE PLATED EXPERIENCE ───────────────────────────────────
          Photograph bleeds off the leading edge; the text sits in a narrow
          column with a deep margin. Nothing is centred. */}
      {(() => {
        const href  = VIATOR_LINKS[FEATURED];
        const inner = (
          <>
            <h3
              className="text-[#F5E8CC]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.6vw, 3.4rem)',
                lineHeight: 1.04,
                fontWeight: 400,
              }}
            >
              {nameOf(FEATURED)}
            </h3>
            <p className="mt-5 max-w-[34ch] text-[0.98rem] leading-[1.75] text-[rgba(245,232,204,0.7)]">
              {lineOf(FEATURED)}
            </p>
            <p className="mt-7 text-[0.62rem] uppercase tracking-[0.24em] text-[rgba(245,232,204,0.42)]">
              {timeOf(FEATURED)}
            </p>

            <p className="mt-10 flex items-baseline gap-2.5">
              <span
                className="tabular-nums text-[#F5E8CC]"
                style={{ fontFamily: 'var(--font-display)', fontSize: '1.65rem', fontWeight: 400 }}
              >
                {priceOf(FEATURED)}
              </span>
              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-[rgba(245,232,204,0.45)]">
                {t('perPerson')}
              </span>
            </p>

            <span className="mt-6 inline-block border-b border-[#C8882A] pb-1.5 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#C8882A] transition-colors group-hover:border-[#F5E8CC] group-hover:text-[#F5E8CC]">
              {t('optionsBookThis')}
            </span>

            <p className="mt-8 max-w-[36ch] text-[0.68rem] leading-relaxed text-[rgba(245,232,204,0.4)]">
              {href ? t('priceNotePartner') : t('priceNoteOwn')}
            </p>
          </>
        );

        return (
          <div className="relative grid items-stretch md:grid-cols-[56fr_44fr]">
            <div className="relative h-[46vh] max-h-[420px] min-h-[300px] md:h-auto md:max-h-none md:min-h-[640px]">
              <Image
                src="/images/tickets/featured.webp"
                alt={nameOf(FEATURED)}
                fill
                sizes="(max-width: 768px) 100vw, 56vw"
                className="object-cover"
              />
              {/* Only where the photograph meets the text, so the join is a
                  shadow rather than a cut. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-[#160D06]/70 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#160D06] rtl:md:bg-gradient-to-l"
              />
              {/* The foot of the photograph dissolves into the index below it,
                  so the band ends in shadow rather than in a straight edge. */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#160D06] to-transparent"
              />
            </div>

            <div className="flex items-end px-6 py-14 md:items-center md:py-24 md:ps-[9%] md:pe-[12%]">
              {/* The column shaft: the one architectural line in the section. */}
              <div className="relative ps-7 md:ps-9">
                <span
                  aria-hidden
                  className="absolute inset-y-0 start-0 w-px bg-gradient-to-b from-transparent via-[#C8882A] to-transparent opacity-60"
                />
                <p className="mb-5 text-[0.6rem] uppercase tracking-[0.3em] text-[#C8882A]">
                  {t('optionsFeatured')}
                </p>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="group block"
                  >
                    {inner}
                  </a>
                ) : (
                  <LeadButton
                    ticketType={FEATURED}
                    ctaLocation="ticket_options"
                    className="group block w-full text-start"
                  >
                    {inner}
                  </LeadButton>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 3 · THE INDEX ───────────────────────────────────────────────
          Three rows, hairlines, no photographs. The prices line up in a
          column on the trailing edge, as in a catalogue. */}
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:pt-20">
        {INDEXED.map((slug, i) => {
          const href = VIATOR_LINKS[slug];
          const row = (
            <>
              <span
                aria-hidden
                className="shrink-0 tabular-nums text-transparent"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.6rem, 3vw, 2.6rem)',
                  WebkitTextStroke: '1px rgba(200,136,42,0.55)',
                }}
              >
                {String(i + 2).padStart(2, '0')}
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className="block text-[#F5E8CC] transition-colors group-hover:text-white"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.3rem, 2.1vw, 1.85rem)',
                    lineHeight: 1.15,
                    fontWeight: 400,
                  }}
                >
                  {nameOf(slug)}
                </span>
                <span className="mt-1.5 block text-[0.78rem] leading-relaxed text-[rgba(245,232,204,0.5)]">
                  {lineOf(slug)}
                </span>
              </span>

              <span className="hidden shrink-0 text-[0.62rem] uppercase tracking-[0.2em] text-[rgba(245,232,204,0.38)] lg:block lg:w-44">
                {timeOf(slug)}
              </span>

              <span
                className="shrink-0 tabular-nums text-end text-[#F5E8CC] w-24 sm:w-28"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.15rem, 1.8vw, 1.55rem)', fontWeight: 400 }}
              >
                {priceOf(slug)}
              </span>
            </>
          );

          const cls =
            'group flex w-full items-center gap-5 border-t border-[rgba(245,232,204,0.14)] py-8 text-start sm:gap-8 md:py-10';

          return href ? (
            <a key={slug} href={href} target="_blank" rel="noopener noreferrer sponsored" className={cls}>
              {row}
            </a>
          ) : (
            <LeadButton key={slug} ticketType={slug} ctaLocation="ticket_options" className={cls}>
              {row}
            </LeadButton>
          );
        })}

        <div className="border-t border-[rgba(245,232,204,0.14)] pt-8">
          <AffiliateDisclosure className="!text-[rgba(245,232,204,0.42)]" />
        </div>
      </div>
    </section>
  );
}
