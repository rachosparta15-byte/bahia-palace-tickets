import type { Metadata, Viewport } from 'next';
import { getLocale } from 'next-intl/server';
import { dirFor } from '@/i18n/routing';
import { BASE } from '@/lib/seo';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import Script from 'next/script';
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
//
// Italic dropped 2026-09-01, which halves this face from four files to two.
// next/font preloads every declared file, and Lighthouse showed four woff2
// requests totalling ~151 KB opening at 482 ms at High priority — the same
// priority and the same instant as the hero image, which is the LCP element.
// On a throttled connection the image waits behind them; that queue was most
// of a 1901 ms LCP load delay.
//
// Nothing on the public site renders italic Cormorant. Every `italic` in the
// codebase is either an /admin page (system-font UI) or `.tiptap blockquote`
// in blog content, where a synthesised oblique is indistinguishable at that
// size. Cormorant is used in the hero itself, so `preload: false` is not an
// option here the way it was for Amiri — the fix has to be fewer files, not
// later ones.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal'],
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
      <head>
        {/* AdSense site-verification — two methods, both harmless to keep
            together. The script-tag method's own crawler check failed on
            first attempt, most likely because the root domain 302s to /en
            and that checker may not follow redirects; the meta-tag method
            is checked on whichever URL actually renders, redirect or not. */}
        <meta name="google-adsense-account" content="ca-pub-1898580718776547" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1898580718776547"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
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
