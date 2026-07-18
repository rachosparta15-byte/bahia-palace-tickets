import { useTranslations, useLocale } from 'next-intl';
import { Footprints, ArrowUpRight } from 'lucide-react';

/**
 * Cross-links to the two other Marrakech monuments we run visitor guides for.
 * Openly disclosed network → normal followed links, descriptive anchor text.
 *
 * Both sibling sites publish the same five locales this site does, so every
 * locale maps 1:1 and the /en fallback never actually fires today. It stays in
 * `href()` so that adding a locale here (e.g. ar) can't silently produce 404s.
 */
const SIBLING_LOCALES = ['en', 'fr', 'de', 'it', 'es'] as const;

/** Saadian Tombs serves English at the bare root, other locales under /{loc}/. */
function saadianHref(locale: string) {
  const loc = (SIBLING_LOCALES as readonly string[]).includes(locale) ? locale : 'en';
  return loc === 'en'
    ? 'https://www.saadian-tombs.com/'
    : `https://www.saadian-tombs.com/${loc}/`;
}

/** El Badi prefixes every locale, English included. */
function badiHref(locale: string) {
  const loc = (SIBLING_LOCALES as readonly string[]).includes(locale) ? locale : 'en';
  return `https://badi-palace.com/${loc}/`;
}

export function NearbyMonuments() {
  const t = useTranslations('nearby');
  const locale = useLocale();

  const monuments = [
    {
      name: t('badiName'),
      body: t('badiBody'),
      walk: t('badiWalk'),
      href: badiHref(locale),
    },
    {
      name: t('saadianName'),
      body: t('saadianBody'),
      walk: t('saadianWalk'),
      href: saadianHref(locale),
    },
  ];

  return (
    <section className="bg-[#1C1108] py-16 sm:py-20">
      {/* Thin gold separator — matches HighlightsSection */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#E8A33D]/20 to-transparent mb-12 sm:mb-16" />

      <div className="max-w-5xl mx-auto px-6">
        <h2
          className="text-center text-[#F5E8CC] mb-3"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            letterSpacing: '0.01em',
          }}
        >
          {t('title')}
        </h2>
        <p className="text-center text-[#9A8060] leading-relaxed max-w-2xl mx-auto mb-10 sm:mb-12">
          {t('intro')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {monuments.map((m) => (
            <a
              key={m.href}
              href={m.href}
              className="group flex flex-col bg-[#251A0F] rounded-2xl border border-[rgba(232,163,61,0.13)] p-6 sm:p-7 transition-all hover:border-[rgba(232,163,61,0.35)] hover:-translate-y-0.5"
            >
              <span className="inline-flex items-center gap-1.5 self-start text-[#E8A33D] text-xs font-semibold uppercase tracking-wider mb-3">
                <Footprints size={14} className="shrink-0" />
                {m.walk}
              </span>

              <h3
                className="text-[#F5E8CC] mb-2.5 flex items-start gap-1.5"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.35rem, 2.5vw, 1.7rem)',
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                {m.name}
                <ArrowUpRight
                  size={18}
                  aria-hidden="true"
                  className="shrink-0 mt-1 text-[#E8A33D] opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
                />
              </h3>

              <p className="text-[#C4A882] leading-relaxed text-[0.95rem]">{m.body}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
