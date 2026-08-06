import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Accordion } from '@/components/ui/Accordion';
import { OrnamentDivider } from '@/components/ui/ZelligePattern';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildAlternates, buildOG, buildBreadcrumbSchema, BASE } from '@/lib/seo';
import { getPublicPaymentsFlags } from '@/lib/payments/guard';
import { TestModeBanner } from '@/components/visitor-pack/TestModeBanner';
import { ValuePoints } from '@/components/visitor-pack/ValuePoints';
import { VisitorPackCheckoutForm } from '@/components/visitor-pack/VisitorPackCheckoutForm';
import { CheckoutDisclosure } from '@/components/visitor-pack/CheckoutDisclosure';
import { AudioGuidePreview } from '@/components/visitor-pack/AudioGuidePreview';
import {
  VISITOR_PACK_PRICE_EUR_CENTS,
  OFFICIAL_DOOR_PRICE_MAD,
  OFFICIAL_DOOR_PRICE_EUR_CENTS,
  MAD_TO_EUR_RATE_CHECKED_ON,
  formatEURAmount,
} from '@/config/pricing';
import {
  Ticket,
  Headphones,
  Map as MapIcon,
  MessageCircle,
  Languages,
  WifiOff,
  ArrowRight,
} from 'lucide-react';

interface Props {
  params: Promise<{ locale: string }>;
}

/**
 * The Visitor Pack sales page.
 *
 * NOT statically revalidated like the other marketing pages: it renders the
 * PAYMENTS_ENABLED state, which must reflect the current env immediately
 * rather than being frozen into a cached page for up to a day.
 */
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = `Complete Visitor Pack — Bahia Palace Ticket + Audio Guide (€${formatEURAmount(VISITOR_PACK_PRICE_EUR_CENTS)})`;
  const description =
    `Official Bahia Palace entry ticket (${OFFICIAL_DOOR_PRICE_MAD} MAD, purchased for you) ` +
    `plus a premium audio guide, visitor map and support — €${formatEURAmount(VISITOR_PACK_PRICE_EUR_CENTS)} per person.`;

  const { enabled: paymentsEnabled } = getPublicPaymentsFlags();

  // generateMetadata runs even when the page body calls notFound(), so the
  // real title would still leak the product name and its $14 price into the
  // browser tab, the HTML source and any social preview — while the page
  // itself shows nothing. Give away nothing until the product is live.
  if (!paymentsEnabled) {
    return { title: 'Not Found', robots: { index: false, follow: false } };
  }

  return {
    title,
    description,
    alternates: buildAlternates(locale, '/visitor-pack'),
    openGraph: buildOG(title, description, locale, '/visitor-pack'),
  };
}

const INCLUDED_ITEMS = [
  { key: 'ticket', Icon: Ticket },
  { key: 'audio', Icon: Headphones },
  { key: 'map', Icon: MapIcon },
  { key: 'support', Icon: MessageCircle },
  { key: 'language', Icon: Languages },
  { key: 'offline', Icon: WifiOff },
] as const;

const STEPS = ['one', 'two', 'three', 'four'] as const;
const FAQ_KEYS = ['official', 'cheaper', 'refund', 'delivery', 'group'] as const;

export default async function VisitorPackPage({ params }: Props) {
  const { locale } = await params;

  // Server-evaluated. The form receives only this boolean, never key material.
  const { enabled: paymentsEnabled, testMode } = getPublicPaymentsFlags();

  /**
   * The page does not exist publicly until the product does.
   *
   * noindex alone only asks Google to stay away — anyone with the URL could
   * still read a $14 price and a "Booking opens soon" notice on the live site
   * while the company is not registered and the legal pages are unfinished.
   * A 404 means there is nothing to find at all. The page returns the moment
   * PAYMENTS_ENABLED is switched on, with no code change.
   */
  if (!paymentsEnabled) notFound();

  const t = await getTranslations({ locale, namespace: 'visitorPack' });
  const tb = await getTranslations({ locale, namespace: 'breadcrumb' });

  const faqItems = FAQ_KEYS.map((k) => ({
    question: t(`faq.items.${k}.q`),
    answer: t(`faq.items.${k}.a`),
  }));

  /**
   * Product schema. `price` is the full pack price and the description states
   * the official-ticket portion explicitly — the structured data must not
   * imply $14 is the official entry price any more than the visible page does.
   */
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Bahia Palace — Complete Visitor Pack',
    description:
      `Official Bahia Palace entry ticket (${OFFICIAL_DOOR_PRICE_MAD} MAD ≈ €${formatEURAmount(OFFICIAL_DOOR_PRICE_EUR_CENTS)} ` +
      `at the rate of ${MAD_TO_EUR_RATE_CHECKED_ON}, purchased on the visitor's behalf) ` +
      `bundled with a premium audio guide, visitor map and support.`,
    url: `${BASE}/${locale}/visitor-pack`,
    image: `${BASE}/og-image.jpg`,
    offers: {
      '@type': 'Offer',
      price: formatEURAmount(VISITOR_PACK_PRICE_EUR_CENTS),
      priceCurrency: 'EUR',
      availability: paymentsEnabled
        ? 'https://schema.org/InStock'
        : 'https://schema.org/PreOrder',
      url: `${BASE}/${locale}/visitor-pack`,
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-[#1C1108]">
      <TestModeBanner locale={locale} />
      <JsonLd data={productSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd
        data={buildBreadcrumbSchema(locale, [
          { name: tb('home'), path: '' },
          { name: tb('tickets'), path: '/tickets' },
          { name: 'Complete Visitor Pack' },
        ])}
      />

      {/* ── Hero + price card ─────────────────────────────────────────── */}
      {/*
        Mobile: the price and the button have to be reachable without scrolling.

        The hero spent roughly 390px above the card -- eyebrow, a three-line H1
        at 2rem, a three-line subtitle, then a 40px gap -- on top of ~190px of
        header and banners. The card began around 575px down a ~700px viewport,
        so a phone showed the price, one value point, and no button at all.
        Someone tapping "Tickets" landed on something that reads as an article.

        The fix is ordering, not deletion: on a phone the card comes straight
        after the headline and the descriptive paragraph drops below it, which
        is what every large ticketing site does on mobile. The eyebrow is hidden
        there because the breadcrumb and the H1 already say "Visitor Pack".
        Explicit row/column placement restores the original arrangement from
        `lg` up, so desktop is untouched and the subtitle is never duplicated in
        the DOM.
      */}
      <section className="bg-[#251A0F] border-b border-[rgba(232,163,61,0.15)] px-6 pt-5 pb-12 sm:pt-8 sm:pb-16">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb
            variant="light"
            items={[
              { label: tb('home'), href: '/' },
              { label: tb('tickets'), href: '/tickets' },
              { label: 'Visitor Pack' },
            ]}
          />

          <div className="mt-5 grid grid-cols-1 gap-6 sm:mt-8 lg:grid-cols-5 lg:gap-x-10 lg:gap-y-5 items-start">
            <div className="lg:col-span-3 lg:col-start-1 lg:row-start-1">
              <p className="hidden text-xs uppercase tracking-[0.2em] text-[#E8A33D] font-semibold sm:block">
                {t('hero.eyebrow')}
              </p>
              <h1
                className="font-bold text-[#F5E8CC] leading-tight sm:mt-4"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.6rem, 4.5vw, 3rem)',
                }}
              >
                {t('hero.title')}
              </h1>

              {/* No CTA here on purpose: the price card carries the single
                  call to action, so the two don't sit side by side. */}
            </div>

            {/* Price card: the total, four value points, one CTA. The
                itemised cost split it used to carry was removed on
                22/07/2026 — see ValuePoints for where the §3.2 disclosure
                lives now. */}
            <div className="lg:col-span-2 lg:col-start-4 lg:row-start-1">
              <div className="rounded-2xl border border-[rgba(232,163,61,0.20)] bg-[#1C1108] p-5 sm:p-7">
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-bold text-[#E8A33D]"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(2.5rem, 9vw, 3rem)',
                      lineHeight: 1,
                    }}
                  >
                    {t('price.amount')}
                  </span>
                  <span className="text-[#C4A882] text-sm">{t('price.perPerson')}</span>
                </div>

                <ValuePoints locale={locale} />

                <a
                  href="#checkout"
                  className="mt-5 flex w-full items-center justify-center rounded-lg bg-[#C4452D] px-6 py-3.5 font-semibold text-white transition-colors hover:bg-[#A33824] sm:mt-6"
                >
                  {paymentsEnabled ? t('hero.ctaPrimary') : t('hero.ctaDisabled')}
                </a>
              </div>
            </div>

            {/* Below the card on a phone, back under the headline from lg up. */}
            <p className="text-lg text-[#C4A882] leading-relaxed max-w-xl lg:col-span-3 lg:col-start-1 lg:row-start-2 lg:-mt-1">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Everything Included ───────────────────────────────────────── */}
      <section className="py-20 bg-[#1C1108]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <OrnamentDivider />
            <h2
              className="text-[#F5E8CC] mt-6"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}
            >
              {t('included.title')}
            </h2>
            <p className="text-[#C4A882] mt-3">{t('included.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INCLUDED_ITEMS.map(({ key, Icon }) => (
              <div
                key={key}
                className="rounded-2xl border border-[rgba(232,163,61,0.15)] bg-[#251A0F] p-6"
              >
                <div className="w-11 h-11 rounded-lg bg-[#2E1F12] border border-[rgba(232,163,61,0.20)] flex items-center justify-center">
                  <Icon size={19} className="text-[#E8A33D]" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-semibold text-[#F5E8CC]">
                  {t(`included.items.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-[#C4A882] leading-relaxed">
                  {t(`included.items.${key}.desc`)}
                </p>

                {/* No "buy it yourself" link on this card.

                    It sat under the FIRST thing the pack offers, which turned
                    the strongest value proposition into a comparison prompt.
                    The route to the official ticket is still on this page,
                    twice: the "What does the EUR 13.99 cover?" answer in the FAQ
                    gives the gate price and says the Ministry sells entry
                    directly, and the link below the FAQ leads to our tickets
                    page. That keeps `evidence.officialPortalLinkShown` on every
                    order truthful and answers anyone who goes looking, without
                    putting the alternative in front of a buyer who was not. */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section className="py-20 bg-[#251A0F]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <OrnamentDivider />
            <h2
              className="text-[#F5E8CC] mt-6"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}
            >
              {t('howItWorks.title')}
            </h2>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <li key={step} className="relative">
                <span
                  className="font-bold text-[#E8A33D]/25 tabular-nums"
                  style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', lineHeight: 1 }}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 font-semibold text-[#F5E8CC]">
                  {t(`howItWorks.steps.${step}.title`)}
                </h3>
                <p className="mt-2 text-sm text-[#C4A882] leading-relaxed">
                  {t(`howItWorks.steps.${step}.desc`)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Audio guide preview ───────────────────────────────────────── */}
      <AudioGuidePreview locale={locale} />

      {/* ── Checkout ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#1C1108]">
        <div className="max-w-xl mx-auto px-6">
          <CheckoutDisclosure />
          <VisitorPackCheckoutForm
            locale={locale}
            paymentsEnabled={paymentsEnabled}
            testMode={testMode}
          />
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────
          Not mounted. <Testimonials> still holds only placeholder copy, and it
          rendered "No real customer has said this" immediately below the pay
          button — an anti-endorsement in the one slot where social proof does
          the most work. Absence beats that, and inventing reviews is banned
          outright (UCPD Annex I; FTC consumer-review rule).

          Re-mount the moment real reviews exist: this is the single largest
          conversion lever still unused on this page. */}

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#251A0F]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <OrnamentDivider />
            <h2
              className="text-[#F5E8CC] mt-6"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}
            >
              {t('faq.title')}
            </h2>
          </div>
          <Accordion items={faqItems} />

          <div className="mt-10 text-center">
            <Link
              href="/tickets"
              className="inline-flex items-center gap-2 font-semibold text-[#E8A33D] transition-all hover:gap-3 hover:text-[#F5C96A]"
            >
              {t('price.freeAlternative')}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
