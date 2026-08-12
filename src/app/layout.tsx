import type { Metadata, Viewport } from 'next';
import { getLocale } from 'next-intl/server';
import { dirFor } from '@/i18n/routing';
import { BASE } from '@/lib/seo';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { Playfair_Display, Cormorant_Garamond, DM_Sans, Amiri } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

// Weight 300 dropped: `font-light` appears nowhere in the codebase, and each
// weight here is two files once italic is counted.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

/*
 * Arabic only, so it must not be preloaded on the other six locales.
 *
 * next/font preloads by default, which put an Arabic face in the critical
 * path of every English, French, Spanish, Italian, German and Portuguese
 * page — competing for bandwidth with the hero image that is the LCP element,
 * for a font those pages never render a glyph from.
 *
 * With preload off it is still declared and still applies instantly on the
 * Arabic pages; the browser simply fetches it when the CSS actually calls for
 * it, which on /ar is immediately and everywhere else is never.
 */
const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
  preload: false,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: 'Bahia Palace Tickets — Skip the Line | Marrakech',
  description:
    'Independent visitor guide to Bahia Palace Marrakech. Compare skip-the-line, guided, and private tour options, then book directly on the official ticket portal.',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: 'website',
    siteName: 'Bahia Palace Tickets',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Bahia Palace Tickets — Marrakech' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/bahia-palace-icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-icon.png',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFY ?? '',
  },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Bahia Palace Tickets',
  url: BASE,
  logo: `${BASE}/og-image.jpg`,
  sameAs: ['https://www.tripadvisor.com/Attraction_Review-g293734-d317099-Reviews-Bahia_Palace-Marrakech_Marrakech_Safi.html'],
  contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', availableLanguage: ['English', 'French'] },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  /*
   * `lang` and `dir` have to be on <html>: it is what assistive tech reads,
   * what Google reads, and what CSS logical properties resolve against. They
   * were previously set on a <div> inside the locale layout, which does none
   * of those things -- and the document has never carried a direction at all,
   * so Arabic would have rendered left-to-right.
   */
  const locale = await getLocale();
  const dir = dirFor(locale);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${playfair.variable} ${cormorant.variable} ${dmSans.variable} ${amiri.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026') }}
        />
        {children}
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
