/*
 * Canonical, sourced fact base for Bahia Palace.
 *
 * WHY THIS FILE EXISTS
 * Before it, the same building had two birthdays. /history said construction
 * began in 1859 in its body and 1866 in its own meta description, in all seven
 * languages. The history article said "more than 100 master craftsmen"; the
 * /history page said "over 2,000 artisans". Both were on the same domain,
 * neither carried a source, and a reader checking one against the other found
 * a site arguing with itself.
 *
 * A reference site is not one that sounds authoritative. It is one whose
 * numbers agree with each other and can be traced. So every date, number and
 * name a page states about the palace comes from here, each carrying its
 * source, and contested points are marked contested instead of being silently
 * resolved in favour of whichever version reads better.
 *
 * RULE: never state a fact about the palace in a page or article that is not
 * in this file. If a new claim is needed, source it and add it here first.
 */

export type SourceKey =
  | 'deverdun'
  | 'wilbaux'
  | 'ghachem'
  | 'minculture'
  | 'unesco'
  | 'mwn';

export interface Sourced {
  value: string;
  /** Short attribution rendered next to the claim. */
  source: string;
  /** Key into SOURCES below. */
  ref: SourceKey;
  /** Set when scholarship genuinely disagrees; the page shows the caveat. */
  contested?: string;
}

/*
 * THE INVARIANTS.
 *
 * Everything here is a number or a proper name, and none of it is translated.
 * The localised prose in messages/*.json interpolates these by key, so a
 * translator working in Arabic or German is handed a sentence with a slot in
 * it and never retypes "1866". That matters because a date retyped in seven
 * languages drifts in seven directions, which is the failure this whole file
 * exists to prevent — and translation is the single likeliest way to
 * reintroduce it.
 *
 * Rule: if a claim contains a digit, the digit lives here and the sentence
 * around it lives in the message catalogue.
 */
export const NUMBERS = {
  foundedFrom: 1866,
  foundedTo: 1867,
  expansionFrom: 1894,
  expansionTo: 1900,
  marbleFrom: 1896,
  marbleTo: 1897,
  birthFrom: 1841,
  birthTo: 1842,
  /** ISO so each locale can format it in its own convention. */
  death: '1900-05-17',
  hajibFrom: 1879,
  protectorate: 1912,
  unescoYear: 1985,
  unescoRef: 331,
  areaBuiltHa: 2,
  areaTotalHa: 8,
  rooms: 150,
  housesAbsorbed: 60,
  gardensAcquired: 16,
  architectBorn: 1857,
  architectDied: 1926,
  visitors: 410141,
  visitorsYear: 2019,
  sultanAge: 14,
} as const;

/** Proper names, spelled once. Transliteration varies; the site should not. */
export const NAMES = {
  architect: 'Muhammad ibn Makki al-Misfiwi',
  architectFrom: 'Safi',
  baAhmed: 'Ahmed ibn Moussa (Ba Ahmed)',
  siMoussa: 'Si Moussa',
  sultanYoung: 'Moulay Abdelaziz',
  sultanHassan: 'Hassan I',
  sultanMuhammad: 'Muhammad IV',
  sultanSlimane: 'Moulay Slimane',
  street: 'Rue Riad Zitoun el Jedid',
} as const;

export const SOURCES: Record<SourceKey, { citation: string; url?: string }> = {
  deverdun: {
    citation:
      'Deverdun, Gaston. Marrakech: des origines a 1912. Rabat: Editions Techniques Nord-Africaines, 1959.',
  },
  wilbaux: {
    citation:
      "Wilbaux, Quentin. La medina de Marrakech: formation des espaces urbains d'une ancienne capitale du Maroc. Paris: L'Harmattan, 2001.",
  },
  ghachem: {
    citation:
      'Ghachem-Benkirane, Narjess and Saharoff, Philippe. Marrakech, demeures et jardins secrets. Paris: ACR Edition, 1990.',
  },
  minculture: {
    citation:
      'Ministere de la Jeunesse, de la Culture et de la Communication (Maroc). "Palais Bahia", official ticketing.',
    url: 'https://e-services.minculture.gov.ma/en/tickets/palais-bahia',
  },
  unesco: {
    citation:
      'UNESCO World Heritage Centre. "Medina of Marrakesh", World Heritage List, inscription no. 331, 1985.',
    url: 'https://whc.unesco.org/en/list/331',
  },
  mwn: {
    citation: 'Morocco World News, visitor figures for Moroccan monuments, 2019.',
  },
};

// --- Construction ----------------------------------------------------------

/*
 * 1866-67 is not a rounding of "the 1860s". It is the date carved into the two
 * chambers flanking the garden, read by Deverdun. That is a dated inscription
 * on the building itself, the strongest evidence the site has for any date,
 * and the reason 1859 was dropped: 1859 is the year Muhammad IV took the
 * throne, not a year anything was built here.
 */
export const FOUNDED: Sourced = {
  value: '1866-67',
  source: 'Deverdun (1959), reading the dated inscription in the two garden chambers',
  ref: 'deverdun',
};

export const EXPANSION: Sourced = {
  value: '1894-1900',
  source: 'Deverdun (1959); Moroccan Ministry of Culture',
  ref: 'deverdun',
};

/** The marble courtyard carries its own inscription. */
export const MARBLE_COURTYARD: Sourced = {
  value: '1896-97',
  source: 'Deverdun (1959)',
  ref: 'deverdun',
};

export const ARCHITECT: Sourced = {
  value: 'Muhammad ibn Makki al-Misfiwi (1857-1926), from Safi',
  source: 'Deverdun (1959)',
  ref: 'deverdun',
};

// --- Size ------------------------------------------------------------------

/*
 * The 8-hectare figure everyone quotes and the 2-hectare figure in the
 * scholarship are not in conflict; they measure different things. Deverdun
 * measures the built palace. The Ministry measures the whole property, palace
 * plus its agdal, the walled orchard-garden. Stating "8 hectares" beside
 * "150 rooms" implies 8 hectares of building, which is wrong by a factor of
 * four. Both numbers stay, each labelled with what it counts.
 */
export const AREA_BUILT: Sourced = {
  value: 'nearly 2 hectares of built palace',
  source: 'Deverdun (1959)',
  ref: 'deverdun',
};

export const AREA_TOTAL: Sourced = {
  value: '8 hectares including the agdal garden',
  source: 'Moroccan Ministry of Culture',
  ref: 'minculture',
};

export const ROOMS: Sourced = {
  value: 'approximately 150',
  source: 'Ghachem-Benkirane and Saharoff (1990)',
  ref: 'ghachem',
};

/* Ba Ahmed did not build on empty ground. He bought out a quarter. */
export const SITE_ASSEMBLY: Sourced = {
  value: 'built over the plots of some 60 houses, with 16 gardens acquired for the grounds',
  source: 'Deverdun (1959)',
  ref: 'deverdun',
};

// --- People ----------------------------------------------------------------

/*
 * "Ba Ahmed was born a slave" is the version the tourist internet tells, and
 * it is a generation off. The enslaved ancestor is his grandfather, owned by
 * Sultan Moulay Slimane and freed into the post of hajib. By the time Ba Ahmed
 * was born his father was already a court officer. The real story, three
 * generations from chattel to the effective ruler of Morocco, is more
 * remarkable than the flattened one, and has the advantage of being true.
 */
export const BA_AHMED_BIRTH: Sourced = {
  value: 'born 1841-42 in Marrakesh',
  source: 'Contemporary Moroccan chronicles, summarised in Deverdun (1959)',
  ref: 'deverdun',
  contested: 'Popular guides give "around 1850"; the earlier date is the documented one.',
};

export const LINEAGE: Sourced = {
  value:
    "Ba Ahmed's grandfather was enslaved, owned by Sultan Moulay Slimane, and rose to become his hajib (chamberlain). Ba Ahmed himself was born into an established makhzen family.",
  source: 'Contemporary Moroccan chronicles, summarised in Deverdun (1959)',
  ref: 'deverdun',
};

export const BA_AHMED_DEATH: Sourced = {
  value: '17 May 1900, in Marrakesh',
  source: 'Contemporary Moroccan chronicles, summarised in Deverdun (1959)',
  ref: 'deverdun',
};

/*
 * Ba Ahmed did not inherit the vizierate from his father the way the old page
 * said. He served as hajib to Hassan I from 1879, and became grand vizier in
 * 1894 only because Hassan I died on campaign and he installed the 14-year-old
 * Abdelaziz over his elder brothers. The office was taken, not handed down.
 */
export const SI_MOUSSA_ROLE: Sourced = {
  value:
    'Si Moussa was hajib (chamberlain) to Sultan Muhammad IV, later grand vizier under Hassan I. He began the palace as his own residence, Dar Si Moussa.',
  source: 'Deverdun (1959)',
  ref: 'deverdun',
  contested:
    'His death year is given variously as the late 1870s and as 1890; the sources do not agree.',
};

export const BA_AHMED_OFFICES: Sourced = {
  value:
    'Hajib to Sultan Hassan I from 1879; grand vizier and de facto regent for the young Sultan Abdelaziz from 1894 until his death in 1900.',
  source: 'Contemporary Moroccan chronicles, summarised in Deverdun (1959)',
  ref: 'deverdun',
};

// --- The name --------------------------------------------------------------

/*
 * The site used to claim Ba Ahmed picked the name himself as a piece of
 * calculated arrogance. That is a good line with nothing behind it. Wilbaux
 * records the plainer account: al-Bahia was reportedly the name of his
 * favourite wife. The word does mean "the brilliant"; the story about why it
 * was chosen is the part that was invented.
 */
export const NAME_ORIGIN: Sourced = {
  value:
    'al-Bahia means "the brilliant". It was reportedly the name of Ba Ahmed’s favourite wife.',
  source: 'Wilbaux (2001)',
  ref: 'wilbaux',
  contested: 'Some accounts read the name as describing the palace itself rather than a person.',
};

// --- After 1900 ------------------------------------------------------------

export const LOOTING: Sourced = {
  value:
    'On Ba Ahmed’s death Sultan Abdelaziz reportedly ordered the palace stripped of its valuables, and his household was turned out.',
  source: 'Deverdun (1959)',
  ref: 'deverdun',
};

export const PROTECTORATE: Sourced = {
  value: 'From 1912 the palace served as the residence of the French resident-general.',
  source: 'Moroccan Ministry of Culture',
  ref: 'minculture',
};

export const UNESCO_STATUS: Sourced = {
  value:
    'The palace stands inside the Medina of Marrakesh, inscribed on the UNESCO World Heritage List in 1985 (no. 331).',
  source: 'UNESCO World Heritage Centre',
  ref: 'unesco',
};

/*
 * "Around 500,000 a year" was on the site with no source. The only figure that
 * can actually be pointed at is a four-month count. A reference site quotes the
 * measurement it has rather than the round number it would prefer.
 */
export const VISITORS: Sourced = {
  value: '410,141 visitors between January and April 2019',
  source: 'Morocco World News (2019)',
  ref: 'mwn',
  contested:
    'No official annual total is published; figures circulating as "500,000 a year" are estimates.',
};

// --- Craft vocabulary ------------------------------------------------------

/*
 * The old page called the carved plasterwork "tadelakt". They are different
 * trades. Tadelakt is a polished, waterproof lime render used in hammams and
 * on basins; the carved arabesque panels are gebs, hand-cut gypsum plaster.
 * Naming the wrong material on an architecture page is the kind of error a
 * specialist reader stops reading after.
 */
export const MATERIALS = [
  { label: 'Zellige', desc: 'Hand-cut glazed terracotta mosaic, laid across floors and lower walls.' },
  { label: 'Gebs', desc: 'Carved gypsum plaster worked wet into arabesque and muqarnas panels.' },
  { label: 'Painted cedar', desc: 'Middle Atlas cedar ceilings, carved and painted with mineral pigment.' },
  { label: 'Marble', desc: 'Imported marble paving the great courtyard, dated 1896-97 by inscription.' },
] as const;

/*
 * Craftsmen came from Fez and from Moroccan workshops. They were not
 * "imported Andalusian craftsmen": al-Andalus had ended four centuries
 * earlier. The Andalusian element here is a style transmitted through
 * Moroccan hands, not a workforce.
 */
export const CRAFTSMEN: Sourced = {
  value:
    'Decoration was executed by Moroccan maalmin, principally Fez-trained specialists in zellige, gebs and cedar joinery.',
  source: 'Ghachem-Benkirane and Saharoff (1990)',
  ref: 'ghachem',
};

/** Every source used on the site, for the bibliography page. */
export const BIBLIOGRAPHY: SourceKey[] = [
  'deverdun',
  'wilbaux',
  'ghachem',
  'minculture',
  'unesco',
  'mwn',
];

/** Timeline shown on /history. Every entry traces to the fact base above. */
export const TIMELINE: { year: string; title: string; text: string; ref: SourceKey }[] = [
  {
    year: '1866-67',
    title: 'Si Moussa builds Dar Si Moussa',
    text: 'The two chambers flanking the garden carry an inscription dating them to 1866-67, the earliest firm date on the building. Si Moussa, chamberlain to Sultan Muhammad IV and later grand vizier under Hassan I, builds it as a private residence, not yet as Bahia.',
    ref: 'deverdun',
  },
  {
    year: '1879',
    title: 'Ba Ahmed enters the household of Hassan I',
    text: 'Si Moussa’s son Ahmed ibn Moussa becomes hajib, chamberlain, to Sultan Hassan I. He does not inherit his father’s vizierate; he builds his own position over the next fifteen years.',
    ref: 'deverdun',
  },
  {
    year: '1894',
    title: 'Regent in all but name',
    text: 'Hassan I dies on campaign. Ba Ahmed conceals the death long enough to install the fourteen-year-old Abdelaziz over his elder brothers, and becomes grand vizier and de facto regent. He begins expanding his father’s house into a palace.',
    ref: 'deverdun',
  },
  {
    year: '1894-1900',
    title: 'The palace takes its present shape',
    text: 'Ba Ahmed absorbs the plots of some sixty neighbouring houses and sixteen gardens. The great marble courtyard is dated 1896-97 by inscription. The architect is Muhammad ibn Makki al-Misfiwi of Safi.',
    ref: 'deverdun',
  },
  {
    year: '17 May 1900',
    title: 'Death, and the stripping of the palace',
    text: 'Ba Ahmed dies in Marrakesh. Sultan Abdelaziz reportedly orders the palace looted of its valuables and the household expelled. The fixed decoration survives because it cannot be carried out.',
    ref: 'deverdun',
  },
  {
    year: '1912',
    title: 'Residence of the resident-general',
    text: 'Under the French Protectorate the palace becomes the official residence of the resident-general, France’s representative in Morocco.',
    ref: 'minculture',
  },
  {
    year: '1985',
    title: 'World Heritage inscription',
    text: 'The Medina of Marrakesh, the palace inside it, is inscribed on the UNESCO World Heritage List as entry 331. The palace is administered today by the Moroccan Ministry of Culture.',
    ref: 'unesco',
  },
];
