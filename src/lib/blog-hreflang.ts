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

/*
 * The other posts whose slug was translated too.
 *
 * buildBlogAlternates() groups a post with its translations by matching the
 * slug across locales, which works for the 150 posts that reuse the English
 * slug everywhere. Sixteen do not: their slug was written in the language of
 * the post, so nothing matches and each one shipped with hreflang pointing
 * only at itself — the German, Spanish and Italian versions of one article
 * invisible to each other, and to Google.
 *
 * There is nothing to derive this from. BlogPost has `slug` and `locale` and
 * no field saying "these are the same article", so the families are listed by
 * hand, like the history one above.
 *
 * EVERY URL HERE WAS CHECKED LIVE: 200, and its own canonical. A wrong pair
 * tells Google two unrelated pages are translations of each other, which is
 * worse than no hreflang at all — so a family goes in only once its members
 * are confirmed to be the same article by their H1, never by their slug.
 *
 * Deliberately NOT a family, though the slugs look like a pair:
 *   fr/comment-viter-les-arnaques-dans-les-souks-de-marrakech-guide-complet
 *   de/so-vermeiden-sie-betrug-in-der-medina-von-marrakesch-…
 * The German one adds "why online booking matters" and takes a different
 * angle. The owner confirmed they are different articles. Left unlinked.
 */
export const TRANSLATION_FAMILIES: Record<string, string>[] = [
  // "The Human & Solidary Guide to Mousawama". The English <title> reads
  // "How to Haggle in Marrakech", which is why this looked wrong at first;
  // the H1 is the same article in all six.
  {
    en: 'the-human-and-solidary-guide-to-mousawama-haggling-with-soul-in-marrakech',
    fr: 'le-guide-humain-et-solidaire-comprendre-la-mousawama-et-l-me-de-marrakech',
    es: 'la-gu-a-humana-y-solidaria-comprender-la-mousawama-y-el-alma-de-marrakech',
    it: 'la-guida-umana-e-solidale-capire-la-mousawama-e-l-anima-di-marrakech',
    de: 'der-menschliche-und-solidarische-leitfaden-die-mousawama-und-die-seele-von-marrakesch-verstehen',
    ar: 'the-and-solidary-guide-understanding-mousawama-and-the-soul-of-marrakesh',
  },
  // "The Voices of Bahia". Arabic keeps the English slug.
  {
    en: 'the-voices-of-bahia-what-the-world-s-greatest-creators-say-about-the-palace',
    fr: 'les-voix-de-la-bahia-ce-que-les-grands-cr-ateurs-du-monde-disent-du-palais',
    es: 'las-voces-de-la-bah-a-lo-que-los-grandes-creadores-del-mundo-dicen-del-palacio',
    it: 'le-voci-della-bahia-cosa-dicono-del-palazzo-i-pi-grandi-creatori-del-mondo',
    de: 'die-stimmen-des-bahia-palastes',
    ar: 'the-voices-of-bahia-what-the-world-s-greatest-creators-say-about-the-palace',
  },
  // "Marrakech, the red city". Three languages; there is no English, Spanish
  // or Arabic version, so none is claimed.
  {
    fr: 'marrakech-la-ville-rouge-o-l-histoire-prend-vie',
    it: 'marrakech-la-citta-rossa-dove-la-storia-prende-vita',
    de: 'marrakesch-die-rote-stadt-wo-die-geschichte-lebt',
  },
  // "How long do you need at Bahia Palace". English and French only.
  {
    en: 'how-long-do-you-need-at-bahia-palace-complete-visitor-guide-2026',
    fr: 'combien-de-temps-faut-il-pour-visiter-le-palais-de-la-bahia-guide-2026',
  },
];

/** slug → the family it belongs to, history included. */
const BY_SLUG = new Map<string, Record<string, string>>();
for (const family of [HISTORY_HREFLANG, ...TRANSLATION_FAMILIES]) {
  for (const slug of Object.values(family)) BY_SLUG.set(slug, family);
}

/**
 * The translations of a post whose slug differs per locale.
 *
 * undefined for the 150 posts that share one slug across locales: those are
 * grouped by the slug itself and need no table.
 */
export function familyFor(slug: string): Record<string, string> | undefined {
  return BY_SLUG.get(slug);
}
