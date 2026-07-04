// History posts use a different, natively-translated slug per locale
// (rather than the same English slug reused everywhere), so their
// cross-locale hreflang group has to be hardcoded instead of derived
// by matching slugs across locales.
export const HISTORY_HREFLANG: Record<string, string> = {
  en: 'bahia-palace-history',
  fr: 'palais-de-la-bahia-marrakech-histoire',
  de: 'palast-bahia-marrakesch-geschichte',
  it: 'palazzo-bahia-marrakech-storia',
  es: 'palacio-bahia-marrakech-historia',
};

export const HISTORY_SLUGS = new Set(Object.values(HISTORY_HREFLANG));
