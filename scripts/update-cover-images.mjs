/**
 * update-cover-images.mjs
 *
 * ALTERs BlogPost to add coverImageAlt / coverImagePosition columns (idempotent),
 * then UPDATEs coverImage + coverImageAlt for every (slug, locale) that needs a
 * real photo from public/images/blog-real/.
 *
 * Usage:
 *   node scripts/update-cover-images.mjs              ← dry-run (default)
 *   DRY_RUN=false node scripts/update-cover-images.mjs ← live run
 */
import { createClient } from '@libsql/client';

const DRY_RUN = process.env.DRY_RUN !== 'false';
if (DRY_RUN) console.log('\n⚠️  DRY-RUN mode — no DB changes will be made.\n');

const client = createClient({
  url:       process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const LOCALES = ['en', 'fr', 'de', 'it', 'es'];

// ── Palace name per locale (appended to alt text) ─────────────────────────────
const PALACE = {
  en: 'Bahia Palace, Marrakech',
  fr: 'Palais de la Bahia, Marrakech',
  de: 'Bahia Palast, Marrakesch',
  it: 'Palazzo della Bahia, Marrakech',
  es: 'Palacio de la Bahía, Marrakech',
};

// ── Alt text descriptions per image key (filename stem) ───────────────────────
const ALTS = {
  'long-gallery-corridor-painted-ceiling-chandeliers': {
    en: 'Long gallery corridor with painted cedar ceiling and hanging chandeliers',
    fr: 'Long corridor de galerie avec plafond en cèdre peint et lustres suspendus',
    de: 'Langer Galeriekorridor mit bemalter Zedernholzdecke und Kronleuchtern',
    it: 'Lungo corridoio con soffitto in cedro dipinto e lampadari',
    es: 'Largo corredor de galería con techo de cedro pintado y lámparas colgantes',
  },
  'carved-plaster-arch-visitors-interior': {
    en: 'Elaborately carved plaster arch with visitors in the palace interior',
    fr: 'Arc en plâtre sculpté avec visiteurs à l\'intérieur du palais',
    de: 'Aufwändig geschnitzter Stuckbogen mit Besuchern im Inneren des Palastes',
    it: 'Arco in gesso intagliato con visitatori nell\'interno del palazzo',
    es: 'Arco de yeso tallado con visitantes en el interior del palacio',
  },
  'grand-reception-hall-painted-ceiling-fountain': {
    en: 'Grand reception hall with painted ceiling and central fountain',
    fr: 'Grande salle de réception avec plafond peint et fontaine centrale',
    de: 'Großer Empfangssaal mit bemalter Decke und zentralem Brunnen',
    it: 'Grande sala di ricevimento con soffitto dipinto e fontana centrale',
    es: 'Gran sala de recepción con techo pintado y fuente central',
  },
  'garden-entrance-path-palm-trees': {
    en: 'Garden entrance path lined with palm trees',
    fr: 'Allée d\'entrée du jardin bordée de palmiers',
    de: 'Garteneingang mit Palmen gesäumtem Weg',
    it: 'Vialetto d\'ingresso del giardino fiancheggiato da palme',
    es: 'Camino de entrada al jardín bordeado de palmeras',
  },
  'official-sign-palais-bahia-exterior-wall': {
    en: 'Official Palais de la Bahia sign on exterior wall',
    fr: 'Panneau officiel Palais de la Bahia sur le mur extérieur',
    de: 'Offizielle Palais de la Bahia Beschilderung an der Außenwand',
    it: 'Insegna ufficiale Palais de la Bahia sul muro esterno',
    es: 'Cartel oficial del Palais de la Bahia en la pared exterior',
  },
  'exterior-facade-visitor-minaret': {
    en: 'Palace exterior facade with a visitor and minaret in the background',
    fr: 'Façade extérieure du palais avec un visiteur et un minaret en arrière-plan',
    de: 'Palast-Außenfassade mit Besucher und Minarett im Hintergrund',
    it: 'Facciata esterna del palazzo con un visitatore e minareto sullo sfondo',
    es: 'Fachada exterior del palacio con un visitante y minarete al fondo',
  },
  'grand-reception-hall-visitors': {
    en: 'Visitors exploring the grand reception hall',
    fr: 'Visiteurs explorant la grande salle de réception',
    de: 'Besucher erkunden den großen Empfangssaal',
    it: 'Visitatori nella grande sala di ricevimento',
    es: 'Visitantes explorando la gran sala de recepción',
  },
  'muqarnas-cedar-ceiling-carved-plaster-arches': {
    en: 'Intricate muqarnas cedar ceiling with carved plaster arches',
    fr: 'Plafond en cèdre à mouqarnas avec arcs en plâtre sculpté',
    de: 'Aufwändige Muqarnas-Zederndecke mit geschnitzten Stuckbögen',
    it: 'Intricato soffitto in cedro a muqarnas con archi in gesso intagliato',
    es: 'Intrincado techo de cedro con muqarnas y arcos de yeso tallado',
  },
  'octagonal-painted-ceiling-light-rays': {
    en: 'Octagonal painted ceiling with light rays streaming through',
    fr: 'Plafond octogonal peint avec des rayons de lumière',
    de: 'Achteckige bemalte Decke mit Lichtstrahlen',
    it: 'Soffitto ottagonale dipinto con raggi di luce',
    es: 'Techo octagonal pintado con rayos de luz',
  },
  'interior-courtyard-blue-doors-zellige': {
    en: 'Interior courtyard with blue painted doors and zellige tilework',
    fr: 'Cour intérieure avec portes bleues peintes et zellige',
    de: 'Innenhof mit blauen Holztüren und Zellige-Fliesen',
    it: 'Cortile interno con porte blu dipinte e zellige',
    es: 'Patio interior con puertas azules pintadas y zellige',
  },
  'ornate-ceiling-chandelier-stained-glass-skylight': {
    en: 'Ornate ceiling with chandelier and stained glass skylight',
    fr: 'Plafond orné avec lustre et verrière en verre coloré',
    de: 'Ornate Decke mit Kronleuchter und Buntglas-Dachfenster',
    it: 'Soffitto ornato con lampadario e lucernario in vetro colorato',
    es: 'Techo ornamentado con araña de cristal y tragaluz de vitral',
  },
  'exterior-entrance-gate-visitors-moroccan-flag': {
    en: 'Visitors at the exterior entrance gate with Moroccan flag',
    fr: 'Visiteurs à la porte d\'entrée extérieure avec drapeau marocain',
    de: 'Besucher am Außeneingang mit marokkanischer Flagge',
    it: 'Visitatori all\'ingresso esterno con bandiera marocchina',
    es: 'Visitantes en la entrada exterior con bandera marroquí',
  },
  'marble-fountain-basin-zellige-floor': {
    en: 'Marble fountain basin surrounded by intricate zellige floor',
    fr: 'Bassin de fontaine en marbre entouré d\'un zellige élaboré',
    de: 'Marmorbrunnen-Becken auf aufwändigem Zellige-Boden',
    it: 'Vasca della fontana in marmo circondata da intricato zellige',
    es: 'Pila de fuente de mármol rodeada de zellige intrincado',
  },
  'courtyard-fountain-framed-arch': {
    en: 'Courtyard fountain framed by an ornate arch',
    fr: 'Fontaine de cour encadrée par un arc orné',
    de: 'Brunnenhof durch einen verzierten Bogen gerahmt',
    it: 'Fontana del cortile incorniciata da un arco ornato',
    es: 'Fuente del patio enmarcada por un arco ornamentado',
  },
  'courtyard-wall-fountain-alcove-zellige': {
    en: 'Courtyard wall fountain alcove with elaborate zellige tilework',
    fr: 'Alcôve de fontaine murale avec zellige élaboré',
    de: 'Wandbrunnen-Alkove mit aufwändigem Zellige',
    it: 'Alcova con fontana a muro e zellige elaborato',
    es: 'Nicho de fuente mural con elaborado zellige',
  },
  'small-riad-courtyard-fountain-arches': {
    en: 'Small riad courtyard with central fountain and arched gallery',
    fr: 'Petite cour de riad avec fontaine centrale et galerie arquée',
    de: 'Kleiner Riad-Innenhof mit Brunnen und Bogengalerie',
    it: 'Piccolo cortile riad con fontana centrale e galleria ad archi',
    es: 'Pequeño patio riad con fuente central y galería de arcos',
  },
  'wooden-ceiling-skylight-stained-glass': {
    en: 'Painted wooden ceiling with stained glass skylight detail',
    fr: 'Plafond en bois peint avec verrière en verre coloré',
    de: 'Bemalte Holzdecke mit Buntglas-Oberlicht',
    it: 'Soffitto in legno dipinto con lucernario in vetro colorato',
    es: 'Techo de madera pintado con tragaluz de vitral',
  },
  'entrance-gate-arabic-inscription-carving': {
    en: 'Entrance gate with Arabic inscription and carved stone detail',
    fr: 'Porte d\'entrée avec inscription arabe et sculpture en pierre',
    de: 'Eingangstor mit arabischer Inschrift und Steinschnitzerei',
    it: 'Porta d\'ingresso con iscrizione araba e intaglio in pietra',
    es: 'Puerta de entrada con inscripción árabe y talla en piedra',
  },
  'entrance-gate-carved-wood-plaster': {
    en: 'Palace entrance gate with carved wood and decorative plaster',
    fr: 'Porte d\'entrée du palais avec bois sculpté et plâtre décoratif',
    de: 'Palasteingangstor mit Schnitzholz und dekorativem Stuck',
    it: 'Porta d\'ingresso del palazzo con legno intagliato e gesso decorativo',
    es: 'Puerta de entrada del palacio con madera tallada y yeso decorativo',
  },
  'interior-artifacts-exhibition': {
    en: 'Interior exhibition of historical artifacts and decorative objects',
    fr: 'Exposition intérieure d\'artefacts historiques et d\'objets décoratifs',
    de: 'Innenausstellung historischer Artefakte und Dekorationsobjekte',
    it: 'Esposizione interna di manufatti storici e oggetti decorativi',
    es: 'Exposición interior de artefactos históricos y objetos decorativos',
  },
  'zellige-floor-geometric-star-pattern': {
    en: 'Close-up of hand-cut zellige floor tiles in geometric star pattern',
    fr: 'Gros plan sur des carreaux de zellige en étoile géométrique taillés à la main',
    de: 'Nahaufnahme von handgeschnittenen Zellige-Bodenfliesen im geometrischen Sternmuster',
    it: 'Primo piano di piastrelle zellige tagliate a mano in motivo a stella geometrica',
    es: 'Primer plano de baldosas zellige cortadas a mano en patrón de estrella geométrica',
  },
  'ornate-iron-window-grille-backlit': {
    en: 'Ornate iron window grille backlit by natural light',
    fr: 'Grille de fenêtre en fer ornemental éclairée en contre-jour',
    de: 'Verziertes Eisenfenstergitter im Gegenlicht',
    it: 'Grata ornamentale in ferro per finestre in controluce',
    es: 'Reja de ventana de hierro ornamental con luz de fondo',
  },
  'painted-cedar-ceiling-moroccan-lantern': {
    en: 'Painted cedar ceiling with a traditional Moroccan lantern',
    fr: 'Plafond en cèdre peint avec une lanterne marocaine traditionnelle',
    de: 'Bemalte Zederndecke mit traditioneller marokkanischer Laterne',
    it: 'Soffitto in cedro dipinto con una tradizionale lanterna marocchina',
    es: 'Techo de cedro pintado con una linterna marroquí tradicional',
  },
  'divan-alcove-reed-mat-zellige': {
    en: 'Traditional divan alcove with reed mat and zellige base',
    fr: 'Alcôve de divan traditionnelle avec natte de roseau et base en zellige',
    de: 'Traditionelle Divan-Alkove mit Schilfrohrmatte und Zellige-Sockel',
    it: 'Alcova del divano tradizionale con stuoia di canna e base in zellige',
    es: 'Alacena de diván tradicional con estera de junco y base de zellige',
  },
  'exterior-blue-yellow-facade-minaret': {
    en: 'Palace exterior with blue and yellow painted facade and minaret',
    fr: 'Extérieur du palais avec façade bleue et jaune et minaret',
    de: 'Palast-Außenseite mit blau-gelber Fassade und Minarett',
    it: 'Esterno del palazzo con facciata dipinta in blu e giallo e minareto',
    es: 'Exterior del palacio con fachada pintada en azul y amarillo y minarete',
  },
  'arched-wooden-door-tadelakt-wall': {
    en: 'Arched wooden door set into a smooth tadelakt wall',
    fr: 'Porte en bois voûtée dans un mur en tadelakt lisse',
    de: 'Gewölbte Holztür in einer glatten Tadelakt-Wand',
    it: 'Porta in legno ad arco inserita in un muro in tadelakt liscio',
    es: 'Puerta de madera arqueada en una pared de tadelakt liso',
  },
  'visitor-entering-carved-gate-zellige': {
    en: 'Visitor entering through an elaborately carved gate with zellige surround',
    fr: 'Visiteur entrant par une porte sculptée avec encadrement en zellige',
    de: 'Besucher tritt durch ein aufwändig geschnitztes Tor mit Zellige-Umrahmung',
    it: 'Visitatore che entra attraverso un portale intagliato con cornice in zellige',
    es: 'Visitante entrando por una puerta tallada con marco de zellige',
  },
};

function imgKey(filename) {
  return filename.replace('bahia-palace-', '').replace('.webp', '');
}

function getAlt(img, locale) {
  const key = imgKey(img.split('/').pop());
  const base = ALTS[key]?.[locale] ?? ALTS[key]?.en ?? img.split('/').pop();
  return `${base} — ${PALACE[locale]}`;
}

// ── Per-article mapping ────────────────────────────────────────────────────────
// Each entry: { slug, img, position? }
// Applied to ALL 5 locales unless overridden.
const ARTICLE_UPDATES = [
  { slug: 'bahia-palace-history',
    img:  '/images/blog-real/bahia-palace-long-gallery-corridor-painted-ceiling-chandeliers.webp' },
  { slug: 'bahia-palace-tips-before-visiting',
    img:  '/images/blog-real/bahia-palace-carved-plaster-arch-visitors-interior.webp' },
  { slug: 'bahia-palace-who-built-it',
    img:  '/images/blog-real/bahia-palace-grand-reception-hall-painted-ceiling-fountain.webp' },
  { slug: 'the-voices-of-bahia-what-the-world-s-greatest-creators-say-about-the-palace',
    img:  '/images/blog-real/bahia-palace-painted-cedar-ceiling-moroccan-lantern.webp' },
  { slug: 'bahia-palace-entrance-fee-2026',
    img:  '/images/blog-real/bahia-palace-official-sign-palais-bahia-exterior-wall.webp' },
  { slug: 'bahia-palace-opening-hours-2026',
    img:  '/images/blog-real/bahia-palace-exterior-facade-visitor-minaret.webp' },
  { slug: 'bahia-palace-guided-tour',
    img:  '/images/blog-real/bahia-palace-grand-reception-hall-visitors.webp' },
  { slug: 'bahia-palace-audio-guide',
    img:  '/images/blog-real/bahia-palace-muqarnas-cedar-ceiling-carved-plaster-arches.webp' },
  { slug: 'bahia-palace-photography-guide',
    img:  '/images/blog-real/bahia-palace-octagonal-painted-ceiling-light-rays.webp' },
  { slug: 'bahia-palace-room-by-room-guide',
    img:  '/images/blog-real/bahia-palace-interior-courtyard-blue-doors-zellige.webp' },
  { slug: '10-hidden-details-bahia-palace',
    img:  '/images/blog-real/bahia-palace-ornate-ceiling-chandelier-stained-glass-skylight.webp' },
  { slug: 'bahia-palace-and-saadian-tombs-one-day',
    img:  '/images/blog-real/bahia-palace-exterior-entrance-gate-visitors-moroccan-flag.webp' },
  { slug: 'bahia-palace-vs-badi-palace-marrakech',
    img:  '/images/blog-real/bahia-palace-marble-fountain-basin-zellige-floor.webp' },
  { slug: 'bahia-palace-vs-dar-si-said',
    img:  '/images/blog-real/bahia-palace-courtyard-fountain-framed-arch.webp' },
  { slug: 'bahia-palace-vs-majorelle-garden',
    img:  '/images/blog-real/bahia-palace-courtyard-wall-fountain-alcove-zellige.webp' },
  { slug: 'bahia-palace-with-kids',
    img:  '/images/blog-real/bahia-palace-small-riad-courtyard-fountain-arches.webp' },
  { slug: 'best-time-to-visit-bahia-palace',
    img:  '/images/blog-real/bahia-palace-wooden-ceiling-skylight-stained-glass.webp' },
  { slug: 'how-to-get-to-bahia-palace',
    img:  '/images/blog-real/bahia-palace-entrance-gate-arabic-inscription-carving.webp' },
  { slug: 'how-to-get-to-bahia-palace-marrakech',
    img:  '/images/blog-real/bahia-palace-entrance-gate-carved-wood-plaster.webp' },
  { slug: 'is-bahia-palace-worth-visiting',
    img:  '/images/blog-real/bahia-palace-interior-artifacts-exhibition.webp' },
  { slug: 'marrakech-2-day-itinerary',
    img:  '/images/blog-real/bahia-palace-zellige-floor-geometric-star-pattern.webp' },
  { slug: 'marrakech-safety-guide',
    img:  '/images/blog-real/bahia-palace-ornate-iron-window-grille-backlit.webp' },
  { slug: 'restaurants-near-bahia-palace',
    img:  '/images/blog-real/bahia-palace-garden-entrance-path-palm-trees.webp' },
  { slug: 'the-and-solidary-guide-understanding-mousawama-and-the-soul-of-marrakesh',
    img:  '/images/blog-real/bahia-palace-divan-alcove-reed-mat-zellige.webp' },
  { slug: 'things-to-do-near-bahia-palace',
    img:  '/images/blog-real/bahia-palace-exterior-blue-yellow-facade-minaret.webp' },
  { slug: 'where-to-stay-near-bahia-palace',
    img:  '/images/blog-real/bahia-palace-arched-wooden-door-tadelakt-wall.webp' },
  { slug: 'bahia-palace-dress-code',
    img:  '/images/blog-real/bahia-palace-visitor-entering-carved-gate-zellige.webp' },
];

// ── Native history slugs (non-EN locales have canonical slugs different from EN) ──
const HISTORY_NATIVE = {
  fr: 'palais-de-la-bahia-marrakech-histoire',
  de: 'palast-bahia-marrakesch-geschichte',
  it: 'palazzo-bahia-marrakech-storia',
  es: 'palacio-bahia-marrakech-historia',
};
const HISTORY_IMG = '/images/blog-real/bahia-palace-long-gallery-corridor-painted-ceiling-chandeliers.webp';

// ── Helpers ───────────────────────────────────────────────────────────────────
let totalUpdated = 0;
let totalSkipped = 0;

async function applyUpdate(slug, locale, img, position) {
  const check = await client.execute({
    sql: 'SELECT id FROM BlogPost WHERE slug = ? AND locale = ?',
    args: [slug, locale],
  });
  if (check.rows.length === 0) {
    console.log(`  ⏭️  ${locale}/${slug} — not in DB, skip`);
    totalSkipped++;
    return;
  }

  const alt = getAlt(img, locale);
  const now = new Date().toISOString();

  if (DRY_RUN) {
    console.log(`  [DRY] ${locale}/${slug}`);
    console.log(`        img: ${img.replace('/images/blog-real/', '')}`);
    if (position) console.log(`        pos: ${position}`);
    console.log(`        alt: ${alt.slice(0, 90)}`);
  } else {
    const cols = ['coverImage = ?', 'coverImageAlt = ?', 'updatedAt = ?'];
    const vals = [img, alt, now];
    if (position) { cols.push('coverImagePosition = ?'); vals.push(position); }
    vals.push(slug, locale);
    await client.execute({
      sql: `UPDATE BlogPost SET ${cols.join(', ')} WHERE slug = ? AND locale = ?`,
      args: vals,
    });
    console.log(`  ✅  ${locale}/${slug}`);
  }
  totalUpdated++;
}

// ── Step 1: ALTER TABLE (idempotent) ──────────────────────────────────────────
console.log('\n=== STEP 1: ALTER TABLE ===');
for (const col of ['coverImageAlt TEXT', 'coverImagePosition TEXT']) {
  try {
    if (!DRY_RUN) {
      await client.execute({ sql: `ALTER TABLE BlogPost ADD COLUMN ${col}`, args: [] });
      console.log(`  ✅  Added column: ${col}`);
    } else {
      console.log(`  [DRY] ALTER TABLE BlogPost ADD COLUMN ${col}`);
    }
  } catch (e) {
    if (e.message?.includes('duplicate column') || e.message?.includes('already exists')) {
      console.log(`  ✅  Column already exists: ${col.split(' ')[0]}`);
    } else {
      throw e;
    }
  }
}

// ── Step 2: Update all articles for all 5 locales ─────────────────────────────
console.log('\n=== STEP 2: UPDATE ARTICLE COVER IMAGES ===');
for (const { slug, img, position } of ARTICLE_UPDATES) {
  console.log(`\n  Article: ${slug}`);
  for (const locale of LOCALES) {
    await applyUpdate(slug, locale, img, position ?? null);
  }
}

// ── Step 3: Native history slugs (FR/DE/IT/ES) ────────────────────────────────
console.log('\n=== STEP 3: NATIVE HISTORY SLUGS ===');
for (const [locale, slug] of Object.entries(HISTORY_NATIVE)) {
  await applyUpdate(slug, locale, HISTORY_IMG, null);
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════════════');
if (DRY_RUN) {
  console.log(`DRY-RUN COMPLETE`);
  console.log(`  Would update: ${totalUpdated} rows`);
  console.log(`  Not in DB:    ${totalSkipped} rows`);
  console.log('\nTo run live:  DRY_RUN=false node scripts/update-cover-images.mjs');
} else {
  console.log(`DONE — ${totalUpdated} rows updated, ${totalSkipped} skipped (not in DB)`);
}
console.log('══════════════════════════════════════════════════\n');

await client.close();
