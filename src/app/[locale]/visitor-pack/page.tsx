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
import { PriceBreakdown } from '@/components/visitor-pack/PriceBreakdown';
import { VisitorPackCheckoutForm } from '@/components/visitor-pack/VisitorPackCheckoutForm';
import { AudioGuidePreview } from '@/components/visitor-pack/AudioGuidePreview';
import { Testimonials } from '@/components/visitor-pack/Testimonials';
import {
  VISITOR_PACK_PRICE_USD,
  OFFICIAL_DOOR_PRICE_MAD,
  OFFICIAL_DOOR_PRICE_USD_APPROX,
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
  const title = `Complete Visitor Pack — Bahia Palace Ticket + Audio Guide ($${VISITOR_PACK_PRICE_USD})`;
  const description =
    `Official Bahia Palace entry ticket (${OFFICIAL_DOOR_PRICE_MAD} MAD, purchased for you) ` +
    `plus a premium audio guide, visitor map and support — $${VISITOR_PACK_PRICE_USD} per person.`;

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
      `Official Bahia Palace entry ticket (${OFFICIAL_DOOR_PRICE_MAD} MAD / ~$${OFFICIAL_DOOR_PRICE_USD_APPROX}, ` +
      `purchased on the visitor's behalf) bundled with a premium audio guide, visitor map and support.`,
    url: `${BASE}/${locale}/visitor-pack`,
    image: `${BASE}/og-image.jpg`,
    offers: {
      '@type': 'Offer',
      price: VISITOR_PACK_PRICE_USD.toFixed(2),
      priceCurrency: 'USD',
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
      <section className="bg-[#251A0F] border-b border-[rgba(232,163,61,0.15)] px-6 pt-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb
            variant="light"
            items={[
              { label: tb('home'), href: '/' },
              { label: tb('tickets'), href: '/tickets' },
              { label: 'Visitor Pack' },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mt-8 items-start">
            <div className="lg:col-span-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[#E8A33D] font-semibold">
                {t('hero.eyebrow')}
              </p>
              <h1
                className="mt-4 font-bold text-[#F5E8CC] leading-tight"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}
              >
                {t('hero.title')}
              </h1>
              <p className="mt-5 text-lg text-[#C4A882] leading-relaxed max-w-xl">
                {t('hero.subtitle')}
              </p>

              {/* No CTA here on purpose: the price card carries the single
                  call to action, so the two don't sit side by side. */}
            </div>

            {/* Price card. Kept intentionally simple — see PriceBreakdown for
                what must stay and why. */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-[rgba(232,163,61,0.20)] bg-[#1C1108] p-6 sm:p-7">
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-bold text-[#E8A33D]"
                    style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', lineHeight: 1 }}
                  >
                    {t('price.amount')}
                  </span>
                  <span className="text-[#C4A882] text-sm">{t('price.perPerson')}</span>
                </div>

                <PriceBreakdown className="mt-4" />

                <a
                  href="#checkout"
                  className="mt-6 flex w-full items-center justify-center rounded-lg bg-[#C4452D] px-6 py-3.5 font-semibold text-white transition-colors hover:bg-[#A33824]"
                >
                  {paymentsEnabled ? t('hero.ctaPrimary') : t('hero.ctaDisabled')}
                </a>
              </div>
            </div>
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
          <VisitorPackCheckoutForm
            locale={locale}
            paymentsEnabled={paymentsEnabled}
            testMode={testMode}
          />
        </div>
      </section>

      {/* ── Testimonials (PLACEHOLDER data — see component) ───────────── */}
      <Testimonials locale={locale} />

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
