import type { Metadata, Viewport } from 'next';
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

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
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
    'Book Bahia Palace Marrakech tickets online. Skip-the-line entry, guided tours and private tours with instant QR confirmation and free cancellation up to 24 hours.',
  keywords: ['Bahia Palace tickets', 'Marrakech palace', 'skip the line Marrakech', 'Bahia Palace guided tour', 'Morocco travel'],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: 'website',
    siteName: 'Bahia Palace Tickets',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Bahia Palace Tickets — Marrakech' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bahiapalace',
  },
  manifest: '/site.webmanifest',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
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
