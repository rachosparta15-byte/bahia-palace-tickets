// @ts-check
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://source.unsplash.com https://*.public.blob.vercel-storage.com",
      "connect-src 'self' https://www.google-analytics.com",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

// Warn in build logs if required env vars are missing or still set to defaults.
const _wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';
if (!_wa || _wa.replace(/^\+/, '') === '212600000000') {
  console.warn(
    '\x1b[33m⚠️  NEXT_PUBLIC_WHATSAPP_NUMBER is not set or is still the placeholder value.\x1b[0m',
    '\n   WhatsApp buttons will be hidden site-wide until a real number is configured.',
    '\n   Set it in Vercel → Settings → Environment Variables (format: 212XXXXXXXXX, no +)',
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source:      '/en/blog/bahia-palace-vs-saadian-tombs-comparison',
        destination: '/en/blog/bahia-palace-vs-saadian-tombs-which-to-visit',
        statusCode:  301,
      },
    ];
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};

export default withNextIntl(nextConfig);
