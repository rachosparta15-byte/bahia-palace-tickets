/**
 * Give the three non-palace articles photos that actually match their subject,
 * and add the whole Marrakech set to the gallery.
 *
 * These three were previously carrying palace interiors because the palace
 * photo set contained nothing else — a stucco arch on a "how to avoid scams
 * in the souks" article. Now they get souks, the square and food.
 *
 * Applies to every locale of each article, including the translated slugs.
 * Backed up by .blog-image-backup-2026-07.json (taken before the first pass).
 *
 * Revert: node scripts/apply-marrakech-photos-2026-07.mjs --revert
 */
import { prisma } from '../src/lib/db/index.ts';

const DIR = '/images/marrakech-2026';

/** English slug → cover, plus the inline photos used inside that article. */
const ARTICLES = {
  /**
   * The live scams article. Note that the older slug
   * how-to-avoid-scams-in-the-souks-... 308-redirects here (see the redirect
   * table in next.config.mjs), so this is the one visitors actually read —
   * updating only the retired slug would change a page nobody can reach.
   */
  'marrakech-safety-guide': {
    cover: 'marrakech-jemaa-el-fna-green-umbrellas-juice-stalls.webp',
    inline: [
      'marrakech-medina-alley-hanging-carpets.webp',
      'marrakech-souk-spice-shop-baskets-soap-minerals.webp',
      'marrakech-jemaa-el-fna-square-food-stalls-koutoubia.webp',
    ],
  },
  'how-to-avoid-scams-in-the-souks-of-marrakech-complete-guide-for-travelers': {
    cover: 'marrakech-jemaa-el-fna-green-umbrellas-juice-stalls.webp',
    inline: [
      'marrakech-medina-alley-hanging-carpets.webp',
      'marrakech-souk-spice-shop-baskets-soap-minerals.webp',
      'marrakech-jemaa-el-fna-square-food-stalls-koutoubia.webp',
    ],
  },
  'restaurants-near-bahia-palace': {
    cover: 'marrakech-jemaa-el-fna-square-food-stalls-koutoubia.webp',
    inline: [
      'marrakech-souk-olive-spice-stall-market.webp',
      'marrakech-souk-tea-perfume-shop-lanterns.webp',
      'marrakech-jemaa-el-fna-green-umbrellas-juice-stalls.webp',
    ],
  },
  'the-human-and-solidary-guide-to-mousawama-haggling-with-soul-in-marrakech': {
    cover: 'marrakech-souk-jewellery-shop-bangles-necklaces.webp',
    inline: [
      'marrakech-souk-artisan-making-brass-lantern.webp',
      'marrakech-souk-pottery-shop-tagines-ceramics.webp',
      'marrakech-souk-basket-hat-shop-straw-goods.webp',
    ],
  },
};

/** Translated slugs of the same three articles. */
const ALIASES = {
  'comment-viter-les-arnaques-dans-les-souks-de-marrakech-guide-complet':
    'how-to-avoid-scams-in-the-souks-of-marrakech-complete-guide-for-travelers',
  'so-vermeiden-sie-betrug-in-der-medina-von-marrakesch-warum-online-ticketbuchung-wichtig-ist':
    'how-to-avoid-scams-in-the-souks-of-marrakech-complete-guide-for-travelers',
  'le-guide-humain-et-solidaire-comprendre-la-mousawama-et-l-me-de-marrakech':
    'the-human-and-solidary-guide-to-mousawama-haggling-with-soul-in-marrakech',
  'la-gu-a-humana-y-solidaria-comprender-la-mousawama-y-el-alma-de-marrakech':
    'the-human-and-solidary-guide-to-mousawama-haggling-with-soul-in-marrakech',
  'la-guida-umana-e-solidale-capire-la-mousawama-e-l-anima-di-marrakech':
    'the-human-and-solidary-guide-to-mousawama-haggling-with-soul-in-marrakech',
  'der-menschliche-und-solidarische-leitfaden-die-mousawama-und-die-seele-von-marrakesch-verstehen':
    'the-human-and-solidary-guide-to-mousawama-haggling-with-soul-in-marrakech',
};

/** Gallery metadata — written from what is visible in each photo. */
const GALLERY = [
  ['marrakech-jemaa-el-fna-square-food-stalls-koutoubia.webp',
   'Jemaa el-Fna Food Stalls', 'Aerial view of the food stalls on Jemaa el-Fna square with the Koutoubia minaret behind, Marrakech',
   'The food stalls of Jemaa el-Fna at golden hour, with the Koutoubia minaret on the skyline.', 'jemaa el fna marrakech'],
  ['marrakech-jemaa-el-fna-green-umbrellas-juice-stalls.webp',
   'Jemaa el-Fna Orange Juice Stalls', 'Green umbrellas over the orange juice stalls on Jemaa el-Fna square in Marrakech',
   'The green umbrellas of the orange juice stalls, a fixture of Jemaa el-Fna for decades.', 'jemaa el fna square'],
  ['marrakech-medina-alley-hanging-carpets.webp',
   'Marrakech Medina Carpet Alley', 'Narrow medina alley in Marrakech lined with hanging Berber carpets and a man in a yellow djellaba',
   'A medina alley hung with Berber carpets on both sides — the classic Marrakech souk passage.', 'marrakech medina souk'],
  ['marrakech-souk-jewellery-shop-bangles-necklaces.webp',
   'Marrakech Souk Jewellery Shop', 'Souk shop in Marrakech packed floor to ceiling with silver bangles, beads and necklaces',
   'A jewellery stall stacked to the ceiling — the kind of shop where haggling is expected.', 'marrakech souk jewellery'],
  ['marrakech-souk-lantern-shop-brass-glass-lamps.webp',
   'Marrakech Lantern Shop', 'Brass and coloured glass lanterns hanging from the ceiling of a lamp shop in the Marrakech souk',
   'Hundreds of brass and glass lanterns hung overhead in a souk lamp shop.', 'marrakech lanterns souk'],
  ['marrakech-souk-metalwork-brass-lanterns-copper.webp',
   'Marrakech Metalwork Souk', 'Brass lanterns, copper vessels and metalwork filling a workshop stall in the Marrakech souk',
   'The metalworkers’ souk, where brass and copper pieces are still made by hand.', 'marrakech metal souk'],
  ['marrakech-souk-olive-spice-stall-market.webp',
   'Marrakech Olive and Spice Stall', 'Market stall in Marrakech selling olives, preserved lemons and spices from open barrels',
   'An olive and spice stall — olives, preserved lemons and harissa sold loose by weight.', 'marrakech food market'],
  ['marrakech-souk-antique-bazaar-carpets-brassware.webp',
   'Marrakech Antique Bazaar', 'Antique bazaar in Marrakech filled with carpets, brassware, lanterns and inlaid tables',
   'An antique bazaar stacked with carpets, brassware and inlaid furniture.', 'marrakech bazaar'],
  ['marrakech-souk-pottery-shop-tagines-ceramics.webp',
   'Marrakech Pottery Shop', 'Colourful Moroccan tagines, bowls and glazed ceramics filling a pottery shop in Marrakech',
   'Glazed tagines and bowls stacked in every colour in a souk pottery shop.', 'moroccan pottery marrakech'],
  ['marrakech-souk-spice-shop-baskets-soap-minerals.webp',
   'Marrakech Spice and Soap Shop', 'Baskets of mineral stones, coloured soaps and jars in a Marrakech herbalist shop',
   'An herbalist stall selling mineral alum, black soap and argan products from woven baskets.', 'marrakech spice shop'],
  ['marrakech-souk-artisan-making-brass-lantern.webp',
   'Marrakech Lantern Artisan', 'An artisan shaping a pierced brass lantern by hand in his workshop in the Marrakech souk',
   'A lantern maker working a pierced brass shade by hand in the metalworkers’ souk.', 'marrakech artisan'],
  ['marrakech-souk-basket-hat-shop-straw-goods.webp',
   'Marrakech Basket and Hat Shop', 'Woven straw baskets, bags and sun hats stacked in a shop in the Marrakech souk',
   'Woven palm baskets, bags and straw hats stacked from floor to ceiling.', 'marrakech souk baskets'],
  ['marrakech-souk-tea-perfume-shop-lanterns.webp',
   'Marrakech Tea and Perfume Shop', 'Shelves of perfume bottles and tea glasses under brass lanterns in a Marrakech shop',
   'A tea and perfume shop, its shelves lined with bottles under hanging brass lamps.', 'marrakech tea shop'],
];

const IMG_RE = /(src=["']|!\[[^\]]*\]\()(\/[^"')\s]+?\.(?:webp|jpg|jpeg|png)|https?:\/\/[^"')\s]+?\.(?:webp|jpg|jpeg|png))/gi;

function articleFor(slug) {
  return ARTICLES[slug] ?? ARTICLES[ALIASES[slug]];
}

async function revert() {
  const urls = GALLERY.map(([f]) => `${DIR}/${f}`);
  const g = await prisma.galleryImage.deleteMany({ where: { url: { in: urls } } });
  console.log('gallery rows removed:', g.count);
  console.log('NOTE: blog posts keep the Marrakech photos — rerun the palace');
  console.log('      apply script with --revert to restore original images.');
}

async function main() {
  // ── blog posts ────────────────────────────────────────────────────
  const posts = await prisma.blogPost.findMany({
    select: { id: true, slug: true, locale: true, content: true },
  });

  let covers = 0, inlines = 0;
  for (const p of posts) {
    const art = articleFor(p.slug);
    if (!art) continue;

    let i = 0;
    const content = (p.content ?? '').replace(IMG_RE, (_m, prefix) => {
      const pick = art.inline[i % art.inline.length];
      i++; inlines++;
      return `${prefix}${DIR}/${pick}`;
    });

    await prisma.blogPost.update({
      where: { id: p.id },
      data: { coverImage: `${DIR}/${art.cover}`, content },
    });
    covers++;
  }
  console.log(`blog covers updated : ${covers}`);
  console.log(`blog inline updated : ${inlines}`);

  // ── gallery ───────────────────────────────────────────────────────
  const agg = await prisma.galleryImage.aggregate({ _max: { order: true } });
  let order = (agg._max.order ?? 0) + 1;
  let added = 0, skipped = 0;

  for (const [file, title, altText, caption, seoKeyword] of GALLERY) {
    const url = `${DIR}/${file}`;
    if (await prisma.galleryImage.findFirst({ where: { url } })) { skipped++; continue; }
    await prisma.galleryImage.create({
      data: { url, title, altText, caption, seoKeyword, order: order++, published: true },
    });
    added++;
  }
  console.log(`gallery added   : ${added}`);
  console.log(`gallery skipped : ${skipped}`);
  console.log(`gallery total   : ${await prisma.galleryImage.count()}`);
}

(process.argv[2] === '--revert' ? revert() : main()).then(() => process.exit(0));
