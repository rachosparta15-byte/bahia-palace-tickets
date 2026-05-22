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
});
