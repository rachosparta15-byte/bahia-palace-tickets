/**
 * Point every blog post at the July 2026 photo set.
 *
 * Each article was matched to a photo by SUBJECT, not at random: the dress-code
 * article gets visitors in colourful clothing, entrance-fee gets the ministry's
 * own price sign, guided-tour gets a guide in traditional dress, the photoshoot
 * article gets the red-dress shot, where-to-stay gets a riad garden, and so on.
 *
 * Applies to all 5 locales of each slug (same photo, since the subject is the
 * same article). Inline images inside the post body are swapped too, using
 * other photos from the set so a post never repeats its own cover.
 *
 * A full backup of every coverImage + content is written BEFORE any write, so
 * this is reversible:  node scripts/apply-blog-photos-2026-07.mjs --revert
 */
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
// Named import: the default export does not survive the .mjs → .ts interop.
import { prisma } from '../src/lib/db/index.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKUP = path.join(__dirname, '../.blog-image-backup-2026-07.json');
const DIR = '/images/blog-2026';

/** slug → cover photo. One photo per article; matched on subject. */
const COVER = {
  '10-hidden-details-bahia-palace':            'bahia-palace-carved-stucco-arabic-calligraphy-detail.webp',
  'bahia-palace-and-saadian-tombs-one-day':    'bahia-palace-marble-fountain-basin-close-up.webp',
  'bahia-palace-audio-guide':                  'bahia-palace-covered-arcade-painted-ceiling-zellige-floor.webp',
  'bahia-palace-dress-code':                   'bahia-palace-courtyard-green-doors-visitors-colourful.webp',
  'bahia-palace-entrance-fee-2026':            'bahia-palace-official-ministry-landmark-sign.webp',
  'bahia-palace-guided-tour':                  'bahia-palace-traditional-moroccan-guide-carved-doorway.webp',
  'bahia-palace-history':                      'bahia-palace-gilded-arch-grand-hall-gold-decoration.webp',
  'bahia-palace-opening-hours-2026':           'bahia-palace-main-entrance-gate-carved-stucco-arch.webp',
  'bahia-palace-photography-guide':            'bahia-palace-golden-window-grille-moucharabieh.webp',
  'bahia-palace-room-by-room-guide':           'bahia-palace-painted-ceiling-stucco-alcove-stained-glass.webp',
  'bahia-palace-tips-before-visiting':         'bahia-palace-grand-courtyard-fountain-visitors.webp',
  'bahia-palace-vs-badi-palace-marrakech':     'bahia-palace-carved-cedar-courtyard-corner-greenery.webp',
  'bahia-palace-vs-dar-si-said':               'bahia-palace-carved-stucco-band-painted-wood-zellige.webp',
  'bahia-palace-vs-majorelle-garden':          'bahia-palace-garden-courtyard-arch-palm-trees.webp',
  'bahia-palace-who-built-it':                 'bahia-palace-grand-salon-painted-ceiling-lanterns.webp',
  'bahia-palace-with-kids':                    'bahia-palace-marble-fountain-zellige-courtyard-floor.webp',
  'best-colors-to-wear-for-a-photoshoot-at-bahia-palace-marrakech':
                                               'bahia-palace-riad-garden-woman-red-dress-fountain.webp',
  'best-time-to-visit-bahia-palace':           'bahia-palace-courtyard-marble-floor-visitors-walking.webp',
  'how-to-get-to-bahia-palace':                'bahia-palace-narrow-corridor-zellige-floor-lantern.webp',
  'how-to-get-to-bahia-palace-marrakech':      'bahia-palace-carved-wooden-doors-arched-doorway.webp',
  'is-bahia-palace-worth-visiting':            'bahia-palace-octagonal-dome-ceiling-chandelier.webp',
  'marrakech-2-day-itinerary':                 'bahia-palace-painted-dome-ceiling-blue-gold.webp',
  'marrakech-safety-guide':                    'bahia-palace-carved-wooden-screen-zellige-interior.webp',
  'marrakech-the-red-city-where-history-comes-alive':
                                               'bahia-palace-old-studded-wooden-door-weathered.webp',
  'the-voices-of-bahia-what-the-world-s-greatest-creators-say-about-the-palace':
                                               'bahia-palace-painted-wooden-ceiling-star-motif.webp',
  'things-to-do-near-bahia-palace':            'bahia-palace-room-painted-wood-ceiling-stucco-window.webp',
  'where-to-stay-near-bahia-palace':           'bahia-palace-riad-garden-courtyard-trees-fountain.webp',

  // ── WEAK MATCHES ──────────────────────────────────────────────────
  // These three articles are about the souks, restaurants and haggling —
  // none of them are about the palace, and the photo set contains only
  // palace interiors. The images below are neutral fillers, NOT subject
  // matches. Replace them once souk / food / market photos exist.
  'how-to-avoid-scams-in-the-souks-of-marrakech-complete-guide-for-travelers':
                                               'bahia-palace-carved-stucco-lunette-above-door.webp',
  'restaurants-near-bahia-palace':             'bahia-palace-stained-glass-windows-colourful-lantern.webp',
  'the-human-and-solidary-guide-to-mousawama-haggling-with-soul-in-marrakech':
                                               'bahia-palace-hammam-painting-traditional-artwork.webp',
};

/**
 * Some articles have a TRANSLATED slug per locale rather than the English one,
 * so they cannot be found by the English key above. Map each to its English
 * article so every locale of the same piece gets the same photo.
 */
const SLUG_ALIASES = {
  // history
  'palais-de-la-bahia-marrakech-histoire':        'bahia-palace-history',
  'palast-bahia-marrakesch-geschichte':           'bahia-palace-history',
  'palazzo-bahia-marrakech-storia':               'bahia-palace-history',
  'palacio-bahia-marrakech-historia':             'bahia-palace-history',
  // entrance fee
  'palais-bahia-billets-tarifs-coupe-file':       'bahia-palace-entrance-fee-2026',
  // red city
  'marrakech-la-ville-rouge-o-l-histoire-prend-vie':      'marrakech-the-red-city-where-history-comes-alive',
  'marrakech-la-ciudad-roja-donde-la-historia-cobra-vida':'marrakech-the-red-city-where-history-comes-alive',
  'marrakech-la-citta-rossa-dove-la-storia-prende-vita':  'marrakech-the-red-city-where-history-comes-alive',
  'marrakesch-die-rote-stadt-wo-die-geschichte-lebt':     'marrakech-the-red-city-where-history-comes-alive',
  // voices of Bahia
  'les-voix-de-la-bahia-ce-que-les-grands-cr-ateurs-du-monde-disent-du-palais':
    'the-voices-of-bahia-what-the-world-s-greatest-creators-say-about-the-palace',
  'las-voces-de-la-bah-a-lo-que-los-grandes-creadores-del-mundo-dicen-del-palacio':
    'the-voices-of-bahia-what-the-world-s-greatest-creators-say-about-the-palace',
  'le-voci-della-bahia-cosa-dicono-del-palazzo-i-pi-grandi-creatori-del-mondo':
    'the-voices-of-bahia-what-the-world-s-greatest-creators-say-about-the-palace',
  'die-stimmen-des-bahia-palastes':
    'the-voices-of-bahia-what-the-world-s-greatest-creators-say-about-the-palace',
  // photoshoot colours
  'les-meilleures-couleurs-porter-pour-un-shooting-photo-au-palais-bahia-de-marrakech':
    'best-colors-to-wear-for-a-photoshoot-at-bahia-palace-marrakech',
  // souk scams
  'comment-viter-les-arnaques-dans-les-souks-de-marrakech-guide-complet':
    'how-to-avoid-scams-in-the-souks-of-marrakech-complete-guide-for-travelers',
  'so-vermeiden-sie-betrug-in-der-medina-von-marrakesch-warum-online-ticketbuchung-wichtig-ist':
    'how-to-avoid-scams-in-the-souks-of-marrakech-complete-guide-for-travelers',
  // mousawama / haggling
  'le-guide-humain-et-solidaire-comprendre-la-mousawama-et-l-me-de-marrakech':
    'the-human-and-solidary-guide-to-mousawama-haggling-with-soul-in-marrakech',
  'la-gu-a-humana-y-solidaria-comprender-la-mousawama-y-el-alma-de-marrakech':
    'the-human-and-solidary-guide-to-mousawama-haggling-with-soul-in-marrakech',
  'la-guida-umana-e-solidale-capire-la-mousawama-e-l-anima-di-marrakech':
    'the-human-and-solidary-guide-to-mousawama-haggling-with-soul-in-marrakech',
  'der-menschliche-und-solidarische-leitfaden-die-mousawama-und-die-seele-von-marrakesch-verstehen':
    'the-human-and-solidary-guide-to-mousawama-haggling-with-soul-in-marrakech',
};

/** Resolve any locale's slug to the photo chosen for that article. */
function coverFor(slug) {
  return COVER[slug] ?? COVER[SLUG_ALIASES[slug]];
}

const ALL_PHOTOS = [...new Set(Object.values(COVER))];

/** Matches an <img src> or markdown image pointing at any image file. */
const IMG_RE = /(src=["']|!\[[^\]]*\]\()(\/[^"')\s]+?\.(?:webp|jpg|jpeg|png)|https?:\/\/[^"')\s]+?\.(?:webp|jpg|jpeg|png))/gi;

async function backup() {
  const posts = await prisma.blogPost.findMany({
    select: { id: true, slug: true, locale: true, coverImage: true, content: true },
  });

  // NEVER overwrite an existing backup. A second run would otherwise capture
  // the already-modified state and destroy the only copy of the originals.
  try {
    await readFile(BACKUP, 'utf8');
    console.log(`backup exists, keeping the original → ${path.basename(BACKUP)}`);
  } catch {
    await writeFile(BACKUP, JSON.stringify(posts, null, 1), 'utf8');
    console.log(`backup written: ${posts.length} posts → ${path.basename(BACKUP)}`);
  }

  return posts;
}

async function revert() {
  const raw = await readFile(BACKUP, 'utf8');
  const posts = JSON.parse(raw);
  let n = 0;
  for (const p of posts) {
    await prisma.blogPost.update({
      where: { id: p.id },
      data: { coverImage: p.coverImage, content: p.content },
    });
    n++;
  }
  console.log(`reverted ${n} posts from backup`);
}

async function apply() {
  const posts = await backup();

  let coversSet = 0;
  let inlineSwapped = 0;
  const unmatched = new Set();

  for (const p of posts) {
    const cover = coverFor(p.slug);
    if (!cover) { unmatched.add(p.slug); continue; }

    // Inline images cycle through the other photos so a post never repeats
    // its own cover image in the body.
    const pool = ALL_PHOTOS.filter((f) => f !== cover);
    let i = 0;
    const content = (p.content ?? '').replace(IMG_RE, (_m, prefix) => {
      const pick = pool[i % pool.length];
      i++;
      inlineSwapped++;
      return `${prefix}${DIR}/${pick}`;
    });

    await prisma.blogPost.update({
      where: { id: p.id },
      data: { coverImage: `${DIR}/${cover}`, content },
    });
    coversSet++;
  }

  console.log(`covers set      : ${coversSet}`);
  console.log(`inline swapped  : ${inlineSwapped}`);
  if (unmatched.size) console.log(`UNMATCHED slugs : ${[...unmatched].join(', ')}`);
}

const mode = process.argv[2];
(mode === '--revert' ? revert() : apply()).then(() => process.exit(0));
