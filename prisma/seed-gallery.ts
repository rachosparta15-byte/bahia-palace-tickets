import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const url = process.env.DATABASE_URL ?? 'file:./prisma/dev.db';
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, ...(authToken ? { authToken } : {}) });
const prisma = new PrismaClient({ adapter });

const GALLERY_IMAGES = [
  {
    url: '/images/gallery/bahia-palace-entrance-arch-marrakech.webp',
    altText: 'Decorative horseshoe entrance arch at Bahia Palace, Marrakech, with orange tree behind',
    title: 'Entrance Arch with Orange Tree',
    seoKeyword: 'bahia palace entrance arch marrakech',
    order: 100,
  },
  {
    url: '/images/gallery/bahia-palace-blue-door-courtyard.webp',
    altText: 'Blue-painted door and zellige-tiled courtyard at Bahia Palace, Marrakech',
    title: 'Blue Door & Zellige Courtyard',
    seoKeyword: 'bahia palace courtyard zellige',
    order: 101,
  },
  {
    url: '/images/gallery/bahia-palace-tiled-passage-lantern.webp',
    altText: 'Arched passage with herringbone zellige floor and Moroccan lantern, Bahia Palace',
    title: 'Arched Passage with Lantern',
    seoKeyword: 'bahia palace zellige floor passage lantern',
    order: 102,
  },
  {
    url: '/images/gallery/bahia-palace-tiled-room-fireplace.webp',
    altText: 'Room with carved cedar niche and mosaic-tiled fireplace, Bahia Palace Marrakech',
    title: 'Tiled Room & Cedar Fireplace',
    seoKeyword: 'bahia palace cedar niche fireplace',
    order: 103,
  },
  {
    url: '/images/gallery/bahia-palace-carved-stucco-archway.webp',
    altText: 'Finely carved stucco archway and zellige walls inside Bahia Palace, Marrakech',
    title: 'Carved Stucco Archway',
    seoKeyword: 'bahia palace carved stucco archway',
    order: 104,
  },
  {
    url: '/images/gallery/bahia-palace-grand-doorway-zellige.webp',
    altText: 'Grand decorated doorway with blue zellige tilework, Bahia Palace Marrakech',
    title: 'Grand Zellige Doorway',
    seoKeyword: 'bahia palace grand doorway zellige',
    order: 105,
  },
  {
    url: '/images/gallery/bahia-palace-painted-ceiling-fireplace.webp',
    altText: 'Painted cedar ceiling above a tiled fireplace in a reception room, Bahia Palace',
    title: 'Painted Ceiling & Tiled Fireplace',
    seoKeyword: 'bahia palace painted cedar ceiling fireplace',
    order: 106,
  },
  {
    url: '/images/gallery/bahia-palace-grand-reception-room.webp',
    altText: 'Grand reception room with gilded ceiling and mosaic fireplace, Bahia Palace Marrakech',
    title: 'Grand Reception Room',
    seoKeyword: 'bahia palace grand reception room',
    order: 107,
  },
  {
    url: '/images/gallery/bahia-palace-brass-chandelier-ceiling.webp',
    altText: 'Brass chandelier beneath a painted wooden ceiling, Bahia Palace Marrakech',
    title: 'Brass Chandelier & Painted Ceiling',
    seoKeyword: 'bahia palace brass chandelier ceiling',
    order: 108,
  },
  {
    url: '/images/gallery/bahia-palace-painted-dome-ceiling.webp',
    altText: 'Ornate painted octagonal ceiling with floral motifs, Bahia Palace Marrakech',
    title: 'Painted Octagonal Dome Ceiling',
    seoKeyword: 'bahia palace painted octagonal ceiling',
    order: 109,
  },
  {
    url: '/images/gallery/bahia-palace-painted-ceiling-detail.webp',
    altText: 'Detail of a hand-painted ceiling with central light, Bahia Palace Marrakech',
    title: 'Hand-Painted Ceiling Detail',
    seoKeyword: 'bahia palace hand painted ceiling detail',
    order: 110,
  },
  {
    url: '/images/gallery/bahia-palace-painted-window-shutters.webp',
    altText: 'Painted wooden shutters and wrought-iron window grille, Bahia Palace Marrakech',
    title: 'Painted Shutters & Window Grille',
    seoKeyword: 'bahia palace painted wooden shutters',
    order: 111,
  },
  {
    url: '/images/gallery/bahia-palace-painted-wooden-door.webp',
    altText: 'Antique floral hand-painted wooden door, Bahia Palace Marrakech',
    title: 'Hand-Painted Wooden Door',
    seoKeyword: 'bahia palace painted wooden door',
    order: 112,
  },
  {
    url: '/images/gallery/bahia-palace-carved-plaster-window.webp',
    altText: 'Carved plaster dome above a painted window alcove, Bahia Palace Marrakech',
    title: 'Carved Plaster Window Alcove',
    seoKeyword: 'bahia palace carved plaster window alcove',
    order: 113,
  },
  {
    url: '/images/gallery/bahia-palace-entrance-sign-marrakech.webp',
    altText: 'Official Bahia Palace entrance sign (Palais Bahia), Marrakech',
    title: 'Bahia Palace Entrance Sign',
    seoKeyword: 'bahia palace entrance sign palais bahia marrakech',
    order: 114,
  },
];

async function main() {
  console.log('Seeding gallery images...');
  let added = 0;
  let skipped = 0;

  for (const img of GALLERY_IMAGES) {
    const existing = await prisma.galleryImage.findFirst({ where: { url: img.url } });
    if (existing) {
      console.log(`  SKIP (exists): ${img.url}`);
      skipped++;
    } else {
      await prisma.galleryImage.create({ data: { ...img, published: true } });
      console.log(`  ADD: ${img.url}`);
      added++;
    }
  }

  console.log(`\nDone — ${added} added, ${skipped} skipped.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
