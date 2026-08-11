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
      "img-src 'self' data: blob: https://images.unsplash.com https://source.unsplash.com https://*.public.blob.vercel-storage.com https://i.ytimg.com",
      "connect-src 'self' https://www.google-analytics.com",
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

// Warn in build logs if required env vars are missing or still set to defaults.
const _wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';
if (!_wa) {
  console.warn(
    '\x1b[33m⚠️  NEXT_PUBLIC_WHATSAPP_NUMBER is not set.\x1b[0m',
    '\n   WhatsApp buttons will be hidden site-wide until a real number is configured.',
    '\n   Set it in Vercel → Settings → Environment Variables (format: 2126XXXXXXXX, no +)',
  );
}

// GUIDE_TOKEN_SECRET was checked here and no longer is.
//
// The audio guide used to open from a URL signed by that secret. It now opens
// from a per-seat access code issued by `issueGuideCodes()` at confirmation and
// mailed as guide.visitbahiapalace.com/?k=CODE — no signing key involved, on
// this side or the guide's. src/lib/guide-token.ts is the remains of the old
// scheme and has no importers left.
//
// The check stayed behind and fired on every build and every dev start, saying
// paying customers would see "access link being prepared" and that
// /api/guide/redeem would answer 503 for every device. That route does exist
// here, but it redeems access CODES via lib/guide-access.ts and never reads
// this secret, so the warning described a failure that could not happen. It was
// the loudest thing in the launch-day log, and a warning that cries wolf is
// worse than no warning: it trains you to scroll past the one that matters.
//
// If a signed-token guide ever comes back, bring the check back with it.

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/*': ['./prisma/dev.db'],
  },
  async redirects() {
    const TEST_SLUGS = ['z', 'xdxxxxxxxx', 'test'];
    const LOCALES    = ['en', 'fr', 'it', 'de', 'es'];

    const testRedirects = TEST_SLUGS.flatMap(slug =>
      LOCALES.map(locale => ({
        source:      `/${locale}/blog/${slug}`,
        destination: `/${locale}/blog`,
        permanent:   true,
      }))
    );
    const COMING_SOON_SLUGS = ['guided-tour', 'private-tour', 'combo-saadian-tombs'];
    const comingSoonRedirects = COMING_SOON_SLUGS.flatMap(slug =>
      LOCALES.map(locale => ({
        source:      `/${locale}/tickets/${slug}`,
        destination: `/${locale}/tickets/skip-the-line`,
        permanent:   false,
      }))
    );
    // All-locale catch redirects (old URLs + EN-slug variants that exist across all locales)
    const BLOG_MERGE_ALL_LOCALES = [
      { from: 'how-to-get-to-bahia-palace',   to: 'how-to-get-to-bahia-palace-marrakech' },
      { from: 'history-of-bahia-palace',       to: 'bahia-palace-history' },
      { from: 'marrakech-tourist-scams-guide', to: 'marrakech-safety-guide' },
      { from: 'bahia-palace-who-built-it',     to: 'bahia-palace-history' },
    ];
    const blogMergeAllLocales = BLOG_MERGE_ALL_LOCALES.flatMap(({ from, to }) =>
      LOCALES.map(locale => ({
        source:      `/${locale}/blog/${from}`,
        destination: `/${locale}/blog/${to}`,
        permanent:   true,
      }))
    );
    // Deleted posts — thin content (301 to nearest relevant page)
    const BLOG_DELETED = [
      // All-locale skip-the-line static guide → tickets page
      ...LOCALES.map(locale => ({
        source:      `/${locale}/blog/bahia-palace-skip-the-line-guide`,
        destination: `/${locale}/tickets/skip-the-line`,
        permanent:   true,
      })),
      // EN thin "red city" article → homepage
      { source: '/en/blog/marrakech-the-red-city-where-history-comes-alive', destination: '/en', permanent: true },
      // ES thin "ciudad roja" article → homepage
      { source: '/es/blog/marrakech-la-ciudad-roja-donde-la-historia-cobra-vida', destination: '/es', permanent: true },
      // EN thin photoshoot colors → photography guide (merge)
      { source: '/en/blog/best-colors-to-wear-for-a-photoshoot-at-bahia-palace-marrakech', destination: '/en/blog/bahia-palace-photography-guide', permanent: true },
      // Removed "Complete Visitor Guide" kitchen-sink post — content now split
      // across the opening-hours/entrance-fee/dress-code pages. Never had a
      // redirect, so Google kept re-crawling and reporting it as a 404.
      ...LOCALES.map(locale => ({
        source:      `/${locale}/blog/bahia-palace-marrakech-complete-visitor-guide-2026`,
        destination: `/${locale}/opening-hours`,
        permanent:   true,
      })),
    ];

    // EN-only duplicate slug redirects (slugs that only exist in EN)
    const BLOG_MERGE_EN_ONLY = [
      { from: 'bahia-palace-history-marrakech',                    to: 'bahia-palace-history' },
      { from: 'who-built-bahia-palace-history-ba-ahmed',           to: 'bahia-palace-history' },
      { from: 'bahia-palace-entrance-fee-2026-tickets-prices',     to: 'bahia-palace-entrance-fee-2026' },
      { from: 'how-to-get-to-bahia-palace-from-jemaa-el-fna',     to: 'how-to-get-to-bahia-palace-marrakech' },
      { from: 'is-bahia-palace-worth-visiting-honest-review-2026', to: 'is-bahia-palace-worth-visiting' },
      { from: 'what-to-wear-bahia-palace-marrakech-dress-code',    to: 'bahia-palace-dress-code' },
      { from: 'bahia-palace-photography-guide-best-spots-tips',    to: 'bahia-palace-photography-guide' },
      { from: 'what-to-see-inside-bahia-palace-room-by-room',      to: 'bahia-palace-room-by-room-guide' },
      { from: 'bahia-palace-opening-hours-best-time-to-visit',     to: 'bahia-palace-opening-hours-2026' },
      { from: 'best-time-to-visit-bahia-palace-marrakech-2026',    to: 'best-time-to-visit-bahia-palace' },
      { from: 'bahia-palace-vs-badi-palace-which-to-visit',        to: 'bahia-palace-vs-badi-palace-marrakech' },
      { from: 'bahia-palace-vs-saadian-tombs-comparison',          to: 'bahia-palace-vs-saadian-tombs-which-to-visit' },
      { from: 'jardin-majorelle-vs-bahia-palace-marrakech',        to: 'bahia-palace-vs-majorelle-garden' },
      { from: 'how-to-avoid-tourist-scams-marrakech-safety-guide-2026',                      to: 'marrakech-safety-guide' },
      { from: 'how-to-avoid-scams-in-the-souks-of-marrakech-complete-guide-for-travelers', to: 'marrakech-safety-guide' },
      { from: '2-days-in-marrakech-perfect-weekend-itinerary-2026',                        to: 'marrakech-2-day-itinerary' },
      // Slug generator used to drop words around "&" instead of expanding it to "and"
      { from: 'the-and-solidary-guide-understanding-mousawama-and-the-soul-of-marrakesh',  to: 'the-human-and-solidary-guide-to-mousawama-haggling-with-soul-in-marrakech' },
    ];
    const blogMergeEnOnly = BLOG_MERGE_EN_ONLY.map(({ from, to }) => ({
      source:      `/en/blog/${from}`,
      destination: `/en/blog/${to}`,
      permanent:   true,
    }));
    // Cross-locale history: EN-slug → locale-native-slug canonical
    const crossLocaleHistory = [
      { locale: 'fr', to: 'palais-de-la-bahia-marrakech-histoire' },
      { locale: 'de', to: 'palast-bahia-marrakesch-geschichte' },
      { locale: 'it', to: 'palazzo-bahia-marrakech-storia' },
      { locale: 'es', to: 'palacio-bahia-marrakech-historia' },
    ].map(({ locale, to }) => ({
      source:      `/${locale}/blog/bahia-palace-history`,
      destination: `/${locale}/blog/${to}`,
      permanent:   true,
    }));
    // ─────────────────────────────────────────────────────────────────
    // Terms of Sale — one canonical URL per language.
    //
    // French is published at /fr/cgv (the conventional French name), every
    // other locale at /<locale>/terms. The two "wrong" spellings redirect
    // so the document never answers on two URLs at once.
    //
    // These live HERE rather than as redirect() calls inside the pages
    // because both routes set `revalidate`, which makes them statically
    // rendered — a redirect() then cannot emit an HTTP status and Next
    // serves a 200 shell that redirects on the client. A crawler sees an
    // empty 200, i.e. a duplicate of nothing. Config redirects are real
    // 308s, issued before any rendering. (Verified: /fr/terms returned
    // 200 with homepage markup until this was moved here.)
    //
    // The hand-written legal pages are gone, replaced by the documents synced
    // from marrakechlocal (src/content/legal, `npm run sync:legal`). The old
    // text named a different selling entity from the rest of the network — one
    // order has one counterparty, and a customer who reads "your contract is
    // with X" and is then charged by Y has been misled about who they are
    // dealing with. The seller across every site is MarrakechLocal.
    //
    // /terms, /cgv, /refund-policy, /privacy and /cookies are indexed and
    // linked from already-sent confirmation emails, so they 308 to the synced
    // document rather than 404. /cgv was the French name for the Terms of Sale
    // and lands on the same page as /terms in every locale.
    const LEGAL_MOVES = [
      { from: 'terms',         to: 'legal/terms' },
      { from: 'cgv',           to: 'legal/terms' },
      { from: 'refund-policy', to: 'legal/refunds' },
      { from: 'privacy',       to: 'legal/privacy' },
      { from: 'cookies',       to: 'legal/cookies' },
    ];
    const legalRedirects = LEGAL_MOVES.flatMap(({ from, to }) =>
      LOCALES.map(locale => ({
        source:      `/${locale}/${from}`,
        destination: `/${locale}/${to}`,
        permanent:   true,
      })),
    );

    return [
      ...testRedirects,
      ...comingSoonRedirects,
      ...blogMergeAllLocales,
      ...blogMergeEnOnly,
      ...crossLocaleHistory,
      ...BLOG_DELETED,
      ...legalRedirects,
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
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};

export default withNextIntl(nextConfig);
