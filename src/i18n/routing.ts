import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'fr', 'it', 'de', 'es'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  // Auto-detect browser/system language from Accept-Language header.
  // If the language is not in our supported list → falls back to English.
  localeDetection: true,
  // Remember the detected/chosen language in a cookie (NEXT_LOCALE).
  // This means: if someone manually switches to French, the next visit
  // keeps them in French even if they open a root URL.
  localeCookie: true,
  // Disabled: this blindly mirrors the current pathname across all 5
  // locales in a `Link: rel="alternate"` response header, with no idea
  // whether a translated version actually exists at that path. For blog
  // posts (which often have a different or nonexistent slug per locale)
  // that produced alternate links to pages that were never published,
  // which Google dutifully crawled and reported as 404s in Search Console.
  // Every page already emits its own correct, content-aware hreflang tags
  // via generateMetadata()'s `alternates` (see src/lib/seo.ts buildAlternates
  // and the blog post's buildBlogAlternates), so this is redundant when
  // right and actively harmful when wrong.
  alternateLinks: false,
});
