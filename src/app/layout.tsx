import type { Metadata } from 'next';
import { BASE } from '@/lib/seo';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { Playfair_Display, Inter, Amiri } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: 'Bahia Palace Tickets — Skip the Line | Marrakech',
  description:
    'Book Bahia Palace tickets online. Skip the line, instant confirmation, free cancellation. Guided tours & private tours available.',
  keywords: ['Bahia Palace tickets', 'Marrakech palace', 'skip the line Marrakech', 'Bahia Palace guided tour', 'Morocco travel'],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: 'website',
    siteName: 'Bahia Palace Tickets',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
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
      <body className={`${playfair.variable} ${inter.variable} ${amiri.variable}`}>
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
