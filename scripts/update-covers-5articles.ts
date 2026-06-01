import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

const covers = [
  {
    slug: 'bahia-palace-opening-hours-2026',
    coverImage: '/images/gallery/bahia-palace-main-entrance-sign-lantern-marrakech.jpg',
  },
  {
    slug: 'bahia-palace-entrance-fee-2026',
    coverImage: '/images/gallery/bahia-palace-main-gate-lanterns-full-view.jpg',
  },
  {
    slug: 'bahia-palace-dress-code',
    coverImage: '/images/gallery/bahia-palace-tourists-visiting-grand-courtyard.jpg',
  },
  {
    slug: 'bahia-palace-tips-before-visiting',
    coverImage: '/images/gallery/bahia-palace-grand-courtyard-balcony-view-fountain.jpg',
  },
  {
    slug: 'how-to-get-to-bahia-palace-marrakech',
    coverImage: '/images/gallery/bahia-palace-aerial-view-marrakech-medina-drone.jpg',
  },
];

async function main() {
  for (const { slug, coverImage } of covers) {
    await prisma.blogPost.updateMany({
      where: { slug, locale: 'en' },
      data: { coverImage },
    });
    console.log(`✓  ${slug}`);
  }
  console.log('\nDone — cover images updated.');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
