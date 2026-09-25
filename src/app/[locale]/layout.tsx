import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { LanguageNotice } from '@/components/layout/LanguageNotice';
import { ViatorArrival } from '@/components/analytics/ViatorArrival';
import { VideoPromoBar } from '@/components/layout/VideoPromoBar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { Analytics } from '@/components/analytics/Analytics';
import { PaymentsFlagsProvider } from '@/components/layout/PaymentsFlagsProvider';
import { getPublicPaymentsFlags } from '@/lib/payments/guard';
import type { Metadata } from 'next';
import { BASE } from '@/lib/seo';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: 'hero' });
  return {
    title: t('headline'),
    description: t('subheadline'),
    metadataBase: new URL(BASE),
    /*
     * No `alternates` here on purpose.
     *
     * This used to carry the full hreflang set for the HOME page. Next merges
     * metadata one top-level key at a time, so any page that set its own
     * alternates replaced it cleanly — and any page that did not inherited a
     * block announcing that the alternate of, say, /en/legal/refunds is the
     * German HOME page. A crawl found /en/unsubscribe and all nine legal
     * documents doing exactly that, each with no canonical of its own.
     *
     * A layout cannot know the path it is wrapping, so it cannot produce a
     * correct hreflang set for an arbitrary child. Emitting nothing and letting
     * each page declare its own (via buildAlternates) is the only version that
     * is right everywhere: wrong hreflang is worse than absent hreflang,
     * because Google acts on it.
     */
    openGraph: {
      locale,
      siteName: 'Bahia Palace Tickets',
      type: 'website',
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  /*
   * The offers shown ON the Arabic page, each in its own language.
   *
   * Read from the other catalogues rather than the current one, which is the
   * whole point: a French speaker looking at /ar has to be addressed in
   * French or the line tells them nothing. Only built for /ar, so the other
   * six locales pay nothing for it.
   */
  const tNotice = await getTranslations({ locale, namespace: 'languageNotice' });
  let offers: Record<string, { available: string; view: string }> | undefined;
  if (locale === 'ar') {
    offers = {};
    for (const target of routing.locales) {
      if (target === 'ar') continue;
      const tt = await getTranslations({ locale: target, namespace: 'languageNotice' });
      offers[target] = { available: tt('available'), view: tt('view') };
    }
  }

  // Booleans only — no key material reaches the client. Ticket CTAs use this
  // to decide between the official portal and our own Visitor Pack checkout.
  const paymentsFlags = getPublicPaymentsFlags();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
     <PaymentsFlagsProvider value={paymentsFlags}>
      <div className="flex flex-col min-h-screen">
        <Header />
        {/* Just the gold/zellige strip now — the interactive "watch the
            video" link moved into the Hero, next to Get Tickets, so this
            is purely a decorative divider under the header. */}
        <VideoPromoBar variant="C" decorative />
        <main className="flex-1 pt-[96px]">
          {/* Client-rendered, so nothing here reaches the crawled HTML. */}
          <LanguageNotice
            locale={locale}
            offers={offers}
            arabicLabel={tNotice('backToArabic')}
          />
          {children}
        </main>
        <Footer />
        {/* Prevents fixed bottom nav from obscuring the footer on mobile */}
        <div
          className="md:hidden"
          style={{ height: 'calc(56px + env(safe-area-inset-bottom, 0px))' }}
          aria-hidden="true"
        />
        <MobileBottomNav />
        <CookieBanner />
        {/* Renders nothing; tags outbound Viator clicks with how the
            visitor reached the site. See the component for why. */}
        <ViatorArrival />
        <Analytics />
      </div>
     </PaymentsFlagsProvider>
    </NextIntlClientProvider>
  );
}
