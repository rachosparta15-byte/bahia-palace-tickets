/**
 * Add the July 2026 photo set to the gallery with SEO metadata.
 *
 * Every title / altText / caption below describes what is ACTUALLY visible in
 * that photo — each one was viewed before it was written. They are not
 * generated from the filename, because an alt text that misdescribes the
 * image is worse than none: it misleads screen-reader users and Google reads
 * it as a relevance signal.
 *
 * People appearing in shots are described generically ("a visitor", "a guide")
 * — we do not know who they are and must not imply we do.
 *
 * Idempotent: re-running skips URLs already in the gallery.
 * Revert:  node scripts/add-gallery-photos-2026-07.mjs --revert
 */
import { prisma } from '../src/lib/db/index.ts';

const DIR = '/images/blog-2026';

const PHOTOS = [
  {
    file: 'bahia-palace-main-entrance-gate-carved-stucco-arch.webp',
    title: 'Bahia Palace Main Entrance Gate',
    altText: 'Carved stucco arch and wooden doors at the main entrance gate of Bahia Palace Marrakech',
    caption: 'The main entrance gate of Bahia Palace, framed by hand-carved stucco and a blue zellige threshold.',
    seoKeyword: 'bahia palace entrance',
  },
  {
    file: 'bahia-palace-official-ministry-landmark-sign.webp',
    title: 'Bahia Palace Official Landmark Sign',
    altText: 'Official Moroccan Ministry of Culture landmark sign for Bahia Palace in Arabic, French and Tifinagh',
    caption: 'The official Ministry of Culture plaque marking Bahia Palace as a listed national landmark.',
    seoKeyword: 'bahia palace official sign',
  },
  {
    file: 'bahia-palace-grand-courtyard-fountain-visitors.webp',
    title: 'Bahia Palace Grand Courtyard',
    altText: 'Visitors around the central fountain in the grand marble courtyard of Bahia Palace Marrakech',
    caption: 'The grand courtyard, the largest open space in the palace, with its central marble fountain.',
    seoKeyword: 'bahia palace courtyard',
  },
  {
    file: 'bahia-palace-courtyard-marble-floor-visitors-walking.webp',
    title: 'Bahia Palace Marble Courtyard Floor',
    altText: 'Visitors walking across the white marble and zellige courtyard floor of Bahia Palace',
    caption: 'The marble courtyard floor, inlaid with a zellige mosaic star at its centre.',
    seoKeyword: 'bahia palace marble courtyard',
  },
  {
    file: 'bahia-palace-courtyard-green-doors-visitors-colourful.webp',
    title: 'Bahia Palace Green Doors Courtyard',
    altText: 'Bright green painted doors, zellige tiles and visitors in colourful clothing at Bahia Palace',
    caption: 'Green cedar doors and hanging carpets frame one of the palace’s most photographed corners.',
    seoKeyword: 'bahia palace green doors',
  },
  {
    file: 'bahia-palace-riad-garden-courtyard-trees-fountain.webp',
    title: 'Bahia Palace Riad Garden',
    altText: 'Shaded riad garden courtyard with orange trees and a marble fountain at Bahia Palace Marrakech',
    caption: 'The riad garden, planted with citrus and shaded by trees around a central fountain.',
    seoKeyword: 'bahia palace garden',
  },
  {
    file: 'bahia-palace-garden-courtyard-arch-palm-trees.webp',
    title: 'Bahia Palace Garden Through the Arch',
    altText: 'View of the palace garden and palm trees framed by a carved archway at Bahia Palace',
    caption: 'A carved archway frames the garden path and palms beyond — a classic Bahia Palace view.',
    seoKeyword: 'bahia palace garden arch',
  },
  {
    file: 'bahia-palace-riad-garden-woman-red-dress-fountain.webp',
    title: 'Bahia Palace Riad Garden Portrait Spot',
    altText: 'A visitor in a red dress standing by the fountain in the green riad garden of Bahia Palace',
    caption: 'The riad garden is the palace’s most popular spot for portraits, especially in strong colours.',
    seoKeyword: 'bahia palace photoshoot',
  },
  {
    file: 'bahia-palace-covered-arcade-painted-ceiling-zellige-floor.webp',
    title: 'Bahia Palace Covered Arcade',
    altText: 'Covered arcade with painted wooden ceiling and zellige tiled floor running along the Bahia Palace courtyard',
    caption: 'The shaded arcade running around the courtyard, with its painted ceiling and tiled floor.',
    seoKeyword: 'bahia palace arcade',
  },
  {
    file: 'bahia-palace-grand-salon-painted-ceiling-lanterns.webp',
    title: 'Bahia Palace Grand Salon',
    altText: 'Grand salon at Bahia Palace with painted cedar ceiling, hanging lanterns and zellige walls',
    caption: 'A reception salon with a painted cedar ceiling, brass lanterns and a carved fireplace.',
    seoKeyword: 'bahia palace grand salon',
  },
  {
    file: 'bahia-palace-gilded-arch-grand-hall-gold-decoration.webp',
    title: 'Bahia Palace Gilded Arch',
    altText: 'Richly gilded and painted arch with floral motifs above a doorway inside Bahia Palace',
    caption: 'Gilded floral painting above an interior arch — among the richest decoration in the palace.',
    seoKeyword: 'bahia palace decoration',
  },
  {
    file: 'bahia-palace-octagonal-dome-ceiling-chandelier.webp',
    title: 'Bahia Palace Octagonal Dome Ceiling',
    altText: 'Octagonal painted wooden dome ceiling with a brass chandelier at Bahia Palace Marrakech',
    caption: 'An octagonal painted dome, hand-decorated in floral and geometric motifs, above a brass chandelier.',
    seoKeyword: 'bahia palace ceiling',
  },
  {
    file: 'bahia-palace-painted-dome-ceiling-blue-gold.webp',
    title: 'Bahia Palace Blue and Gold Ceiling',
    altText: 'Blue and gold painted wooden ceiling with a radiating sunburst pattern at Bahia Palace',
    caption: 'A radiating sunburst ceiling painted in blue and gold over a reception room.',
    seoKeyword: 'bahia palace painted ceiling',
  },
  {
    file: 'bahia-palace-painted-wooden-ceiling-star-motif.webp',
    title: 'Bahia Palace Star Motif Ceiling',
    altText: 'Painted cedar ceiling with an eight-pointed star motif inside Bahia Palace Marrakech',
    caption: 'An eight-pointed star, the recurring geometric signature of Moroccan craftsmanship.',
    seoKeyword: 'moroccan painted ceiling',
  },
  {
    file: 'bahia-palace-room-painted-wood-ceiling-stucco-window.webp',
    title: 'Bahia Palace Private Room',
    altText: 'Private room at Bahia Palace with a painted wooden ceiling, carved stucco and a shuttered window',
    caption: 'One of the smaller private rooms, lit by a single shuttered window.',
    seoKeyword: 'bahia palace rooms',
  },
  {
    file: 'bahia-palace-painted-ceiling-stucco-alcove-stained-glass.webp',
    title: 'Bahia Palace Stucco Alcoves',
    altText: 'Carved stucco alcoves with stained glass windows and zellige dado inside Bahia Palace',
    caption: 'Carved alcoves set with stained glass, above a band of zellige tilework.',
    seoKeyword: 'bahia palace interior',
  },
  {
    file: 'bahia-palace-stained-glass-windows-colourful-lantern.webp',
    title: 'Bahia Palace Stained Glass and Lantern',
    altText: 'Colourful stained glass windows and a hanging glass lantern inside Bahia Palace Marrakech',
    caption: 'Stained glass and a coloured lantern throw light across the carved plaster walls.',
    seoKeyword: 'bahia palace stained glass',
  },
  {
    file: 'bahia-palace-golden-window-grille-moucharabieh.webp',
    title: 'Bahia Palace Golden Window Grille',
    altText: 'Ornate golden wrought iron window grille looking onto the courtyard at Bahia Palace',
    caption: 'A gilded iron grille — the screens that let women of the household watch unseen.',
    seoKeyword: 'bahia palace window grille',
  },
  {
    file: 'bahia-palace-carved-wooden-doors-arched-doorway.webp',
    title: 'Bahia Palace Carved Cedar Doors',
    altText: 'Tall carved and painted cedar doors framing an arched doorway at Bahia Palace Marrakech',
    caption: 'Painted cedar doors framing an arched passage between two wings of the palace.',
    seoKeyword: 'bahia palace doors',
  },
  {
    file: 'bahia-palace-carved-wooden-screen-zellige-interior.webp',
    title: 'Bahia Palace Carved Wooden Screen',
    altText: 'Carved wooden lattice screen beside zellige tiled walls in an interior room of Bahia Palace',
    caption: 'A carved lattice screen opening onto one of the palace’s exhibition rooms.',
    seoKeyword: 'bahia palace interior detail',
  },
  {
    file: 'bahia-palace-old-studded-wooden-door-weathered.webp',
    title: 'Bahia Palace Old Studded Door',
    altText: 'Weathered antique wooden door with iron studs at Bahia Palace Marrakech',
    caption: 'An original studded door, worn by more than a century of Marrakech sun.',
    seoKeyword: 'moroccan wooden door',
  },
  {
    file: 'bahia-palace-carved-stucco-arabic-calligraphy-detail.webp',
    title: 'Bahia Palace Carved Stucco Calligraphy',
    altText: 'Close-up of carved stucco with Arabic calligraphy above green and blue zellige at Bahia Palace',
    caption: 'Hand-carved plaster calligraphy running above a band of green zellige.',
    seoKeyword: 'bahia palace calligraphy',
  },
  {
    file: 'bahia-palace-carved-stucco-lunette-above-door.webp',
    title: 'Bahia Palace Stucco Lunette',
    altText: 'Fan-shaped carved stucco lunette above a studded wooden door at Bahia Palace',
    caption: 'A fan-shaped carved plaster lunette set above a studded cedar door.',
    seoKeyword: 'bahia palace stucco',
  },
  {
    file: 'bahia-palace-carved-stucco-band-painted-wood-zellige.webp',
    title: 'Bahia Palace Craftsmanship Detail',
    altText: 'Carved stucco band between painted cedar and zellige mosaic tilework at Bahia Palace',
    caption: 'The three crafts side by side: carved plaster, painted cedar and cut zellige.',
    seoKeyword: 'moroccan craftsmanship',
  },
  {
    file: 'bahia-palace-carved-cedar-courtyard-corner-greenery.webp',
    title: 'Bahia Palace Carved Cedar Courtyard',
    altText: 'Carved cedar and stucco courtyard corner with green plants at Bahia Palace Marrakech',
    caption: 'A courtyard corner where carved cedar meets plasterwork, softened by greenery.',
    seoKeyword: 'bahia palace architecture',
  },
  {
    file: 'bahia-palace-marble-fountain-zellige-courtyard-floor.webp',
    title: 'Bahia Palace Marble Fountain',
    altText: 'Carved marble fountain basin set into a zellige mosaic courtyard floor at Bahia Palace',
    caption: 'A marble fountain basin set into a zellige floor laid in an eight-pointed star.',
    seoKeyword: 'bahia palace fountain',
  },
  {
    file: 'bahia-palace-marble-fountain-basin-close-up.webp',
    title: 'Bahia Palace Fountain Basin',
    altText: 'Close-up of a carved marble fountain basin surrounded by green ironwork at Bahia Palace',
    caption: 'The fountain basin up close, ringed by low green ironwork.',
    seoKeyword: 'moroccan fountain',
  },
  {
    file: 'bahia-palace-narrow-corridor-zellige-floor-lantern.webp',
    title: 'Bahia Palace Narrow Corridor',
    altText: 'Narrow tadelakt corridor with a chequered zellige floor and wall lantern at Bahia Palace',
    caption: 'A narrow service corridor with a chequered zellige floor, lit by a single lantern.',
    seoKeyword: 'bahia palace corridor',
  },
  {
    file: 'bahia-palace-traditional-moroccan-guide-carved-doorway.webp',
    title: 'Bahia Palace Guide in Traditional Dress',
    altText: 'A guide in traditional Moroccan djellaba and fez standing in a carved doorway at Bahia Palace',
    caption: 'A guide in traditional dress at one of the palace’s carved cedar doorways.',
    seoKeyword: 'bahia palace guided tour',
  },
  {
    file: 'bahia-palace-hammam-painting-traditional-artwork.webp',
    title: 'Traditional Hammam Painting at Bahia Palace',
    altText: 'Painting of women at a traditional Moroccan hammam displayed inside Bahia Palace',
    caption: 'A painted scene of a traditional hammam, part of the artwork displayed in the palace.',
    seoKeyword: 'moroccan traditional art',
  },
];

async function revert() {
  const urls = PHOTOS.map((p) => `${DIR}/${p.file}`);
  const res = await prisma.galleryImage.deleteMany({ where: { url: { in: urls } } });
  console.log('removed from gallery:', res.count);
}

async function main() {
  const agg = await prisma.galleryImage.aggregate({ _max: { order: true } });
  let order = (agg._max.order ?? 0) + 1;

  let added = 0;
  let skipped = 0;

  for (const p of PHOTOS) {
    const url = `${DIR}/${p.file}`;
    const exists = await prisma.galleryImage.findFirst({ where: { url } });
    if (exists) { skipped++; continue; }

    await prisma.galleryImage.create({
      data: {
        url,
        title: p.title,
        altText: p.altText,
        caption: p.caption,
        seoKeyword: p.seoKeyword,
        order: order++,
        published: true,
      },
    });
    added++;
  }

  const total = await prisma.galleryImage.count();
  console.log(`added   : ${added}`);
  console.log(`skipped : ${skipped} (already present)`);
  console.log(`gallery total: ${total}`);
}

(process.argv[2] === '--revert' ? revert() : main()).then(() => process.exit(0));
