import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
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
    alternates: {
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, `${BASE}/${l}`])),
        'x-default': `${BASE}/en`,
      },
    },
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

  // Booleans only — no key material reaches the client. Ticket CTAs use this
  // to decide between the official portal and our own Visitor Pack checkout.
  const paymentsFlags = getPublicPaymentsFlags();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
     <PaymentsFlagsProvider value={paymentsFlags}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <VideoPromoBar variant="C" />
        <main className="flex-1 pt-[134px]">{children}</main>
        <Footer />
        {/* Prevents fixed bottom nav from obscuring the footer on mobile */}
        <div
          className="md:hidden"
          style={{ height: 'calc(56px + env(safe-area-inset-bottom, 0px))' }}
          aria-hidden="true"
        />
        <MobileBottomNav />
        <CookieBanner />
        <Analytics />
      </div>
     </PaymentsFlagsProvider>
    </NextIntlClientProvider>
  );
}
