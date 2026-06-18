import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { VideoPromoBar } from '@/components/layout/VideoPromoBar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { StickyMobileCTA } from '@/components/layout/StickyMobileCTA';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { Analytics } from '@/components/analytics/Analytics';
import { HreflangLinks } from '@/components/seo/HreflangLinks';
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
        'en': `${BASE}/en`,
        'fr': `${BASE}/fr`,
        'it': `${BASE}/it`,
        'de': `${BASE}/de`,
        'es': `${BASE}/es`,
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

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HreflangLinks />
      <div className="flex flex-col min-h-screen" lang={locale}>
        <Header />
        <VideoPromoBar variant="C" />
        <main className="flex-1 pt-[134px]">{children}</main>
        <Footer />
        <WhatsAppButton />
        <StickyMobileCTA />
        <CookieBanner />
        <Analytics />
      </div>
    </NextIntlClientProvider>
  );
}
