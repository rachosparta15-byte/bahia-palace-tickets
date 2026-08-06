import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import { getPublicPaymentsFlags } from '@/lib/payments/guard';
import { deepMergeMessages, type JsonValue } from './mergeMessages';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  /*
   * English sits underneath every locale.
   *
   * Arabic and Portuguese are being translated in stages: the commercial path
   * first, the long tail after. Without a fallback, next-intl throws on the
   * first key a catalogue has not reached yet, which would take the whole page
   * down. Merging over English means an untranslated string appears in English
   * -- visibly wrong, easy to find, and never a broken page or a raw key.
   *
   * Delete the merge once both catalogues are complete.
   */
  const english = (await import('../../messages/en.json')).default;
  const localeMessages = (await import(`../../messages/${locale}.json`)).default;
  const base =
    locale === 'en'
      ? english
      : (deepMergeMessages(english as JsonValue, localeMessages as JsonValue) as typeof english);

  // Copy honesty is tied to the SAME switch the ticket funnel reads
  // (getPublicPaymentsFlags → LeadButton). Payments OFF → the site keeps its
  // free-model wording, matching the portal hand-off that is still live.
  // Payments ON → the paid-service wording in messages/paid/<locale>.json is
  // merged over it, matching the /visitor-pack checkout. One flag drives both,
  // so the copy can never promise a paid purchase while the button still hands
  // off to the free portal (or vice-versa).
  if (getPublicPaymentsFlags().enabled) {
    try {
      const paid = (await import(`../../messages/paid/${locale}.json`)).default;
      return {
        locale,
        messages: deepMergeMessages(base as JsonValue, paid as JsonValue) as typeof base,
      };
    } catch {
      // No paid override for this locale yet → fall back to the base copy
      // rather than crash. All 5 locales must exist before go-live; the
      // GO-LIVE.md checklist tracks that.
    }
  }

  return { locale, messages: base };
});
