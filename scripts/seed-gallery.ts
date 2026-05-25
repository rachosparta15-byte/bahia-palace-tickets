import 'dotenv/config';
import { createClient } from '@libsql/client';

const url       = process.env.DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) { console.error('DATABASE_URL not set'); process.exit(1); }

const client = createClient({ url, ...(authToken ? { authToken } : {}) });

async function main() {
  console.log('Connecting to:', url.replace(/\/\/.*@/, '//***@'));

  // Create table if missing
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "GalleryImage" (
      "id"         TEXT     NOT NULL PRIMARY KEY,
      "url"        TEXT     NOT NULL,
      "altText"    TEXT     NOT NULL,
      "title"      TEXT     NOT NULL,
      "caption"    TEXT,
      "seoKeyword" TEXT,
      "order"      INTEGER  NOT NULL DEFAULT 0,
      "published"  INTEGER  NOT NULL DEFAULT 1,
      "createdAt"  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt"  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Table ready');

  // Insert the 16 gallery photos
  const photos = [
    { id: 'gal01', url: '/images/gallery/bahia-palace-main-entrance-sign-lantern-marrakech.jpg',       altText: 'Bahia Palace main entrance sign Palais de la Bahia with ornate stucco arch and brass lantern Marrakech', title: 'Main Entrance — Palais de la Bahia',   caption: 'The iconic main gate with brass lantern and carved stucco arch',         seoKeyword: 'bahia palace main entrance',     order: 1  },
    { id: 'gal02', url: '/images/gallery/bahia-palace-main-gate-lanterns-full-view.jpg',               altText: 'Bahia Palace main gate full view with two brass lanterns carved wooden door and zellige wall Marrakech', title: 'Main Gate Full View',                 caption: 'Grand entrance with twin lanterns and zellige mosaic walls',              seoKeyword: 'bahia palace gate marrakech',    order: 2  },
    { id: 'gal03', url: '/images/gallery/bahia-palace-carved-wooden-door-zellige-tiles.jpg',           altText: 'Bahia Palace carved cedar wooden door with intricate geometric zellige tile column Marrakech',          title: 'Carved Cedar Door & Zellige',         caption: 'Hand-carved cedar door with blue-green zellige tile columns',            seoKeyword: 'bahia palace zellige tiles',     order: 3  },
    { id: 'gal04', url: '/images/gallery/bahia-palace-zellige-column-entrance-arch.jpg',               altText: 'Bahia Palace zellige mosaic column with carved wooden door and entrance arch in background',            title: 'Zellige Column & Entrance Arch',      caption: 'Geometric zellige mosaic pillar framing the palace entrance',            seoKeyword: 'bahia palace architecture',      order: 4  },
    { id: 'gal05', url: '/images/gallery/bahia-palace-inner-courtyard-central-fountain-stucco.jpg',    altText: 'Bahia Palace inner courtyard with central marble fountain ornate stucco arches and zellige floor',       title: 'Grand Inner Courtyard',               caption: 'The stunning main courtyard with marble fountain and carved stucco',     seoKeyword: 'bahia palace courtyard',         order: 5  },
    { id: 'gal06', url: '/images/gallery/bahia-palace-grand-courtyard-balcony-view-fountain.jpg',      altText: 'Bahia Palace grand courtyard aerial view from wooden balcony with central fountain and palm tree',       title: 'Courtyard from the Balcony',          caption: "Bird's-eye view of the grand courtyard from the upper gallery",          seoKeyword: 'bahia palace balcony view',      order: 6  },
    { id: 'gal07', url: '/images/gallery/bahia-palace-arch-view-green-dome-fountain-palm.jpg',         altText: 'Bahia Palace view through ornate horseshoe arch to green tiled dome marble fountain and palm tree',      title: 'Arch View — Green Dome',              caption: 'Iconic arch framing the green-tiled dome and marble fountain',           seoKeyword: 'bahia palace dome',              order: 7  },
    { id: 'gal08', url: '/images/gallery/bahia-palace-octagonal-cedar-ceiling-carved-wood.jpg',        altText: 'Bahia Palace octagonal carved cedar wood ceiling dome looking up with stucco arches Marrakech',          title: 'Octagonal Cedar Ceiling',             caption: 'Hand-carved cedar wood ceiling — a masterpiece of Moroccan craftsmanship', seoKeyword: 'bahia palace cedar ceiling',  order: 8  },
    { id: 'gal09', url: '/images/gallery/bahia-palace-stucco-column-zellige-floor-fountain.jpg',       altText: 'Bahia Palace ornate stucco column with zellige mosaic floor marble water bowl and prayer beads',         title: 'Stucco Column & Zellige Floor',       caption: 'Intricate plasterwork column beside a traditional marble water fountain', seoKeyword: 'bahia palace stucco',            order: 9  },
    { id: 'gal10', url: '/images/gallery/bahia-palace-zellige-mosaic-arabic-calligraphy-stucco.jpg',   altText: 'Bahia Palace zellige mosaic tiles blue green pattern with Arabic calligraphy stucco panel',              title: 'Zellige Mosaic & Calligraphy',        caption: 'Blue and green geometric zellige mosaics with Arabic inscriptions above', seoKeyword: 'bahia palace zellige mosaic',    order: 10 },
    { id: 'gal11', url: '/images/gallery/bahia-palace-arabic-calligraphy-stucco-zellige-courtyard.jpg',altText: 'Bahia Palace Arabic calligraphy stucco relief with colorful zellige tiles and courtyard arch blurred',    title: 'Arabic Calligraphy & Zellige',        caption: 'Quranic inscriptions carved in plaster above the zellige band',          seoKeyword: 'bahia palace calligraphy',       order: 11 },
    { id: 'gal12', url: '/images/gallery/bahia-palace-rooftop-tower-dome-zellige-tiles.jpg',           altText: 'Bahia Palace rooftop view with ornate tower dome and traditional terracotta tile roofs Marrakech',        title: 'Rooftop & Tower View',                caption: 'The palace rooftop with its ornate tower rising above the medina',       seoKeyword: 'bahia palace rooftop',           order: 12 },
    { id: 'gal13', url: '/images/gallery/bahia-palace-tourists-visiting-grand-courtyard.jpg',          altText: 'Tourists visiting Bahia Palace grand courtyard with zellige floor arched galleries and palm trees',       title: 'Visitors in the Courtyard',           caption: 'Travelers exploring the grand courtyard — the heart of Bahia Palace',    seoKeyword: 'visit bahia palace',             order: 13 },
    { id: 'gal14', url: '/images/gallery/bahia-palace-bahia-inscription-arch-zellige-garden.jpg',      altText: 'Bahia Palace arch with Bahia Arabic inscription and colorful zellige rosette mosaic with green garden',   title: 'Bahia Inscription Arch',              caption: 'The arch bearing the palace name with its stunning zellige rosette',     seoKeyword: 'bahia palace garden',            order: 14 },
    { id: 'gal15', url: '/images/gallery/bahia-palace-zellige-floor-stucco-calligraphy-low-angle.jpg', altText: 'Bahia Palace low angle view of zellige mosaic floor with carved stucco calligraphy column and fountain',  title: 'Zellige Floor Low Angle',             caption: 'The geometric perfection of hand-laid zellige tiles stretching to the fountain', seoKeyword: 'bahia palace floor', order: 15 },
    { id: 'gal16', url: '/images/gallery/bahia-palace-aerial-view-marrakech-medina-drone.jpg',          altText: 'Aerial drone view of Marrakech medina showing Bahia Palace complex surrounded by rooftops Atlas mountains', title: 'Aerial View — Marrakech Medina',     caption: 'The palace from above — nestled in the heart of the ancient medina',    seoKeyword: 'bahia palace aerial view',       order: 16 },
  ];

  let inserted = 0;
  for (const p of photos) {
    await client.execute({
      sql: `INSERT OR REPLACE INTO "GalleryImage"
            ("id","url","altText","title","caption","seoKeyword","order","published","createdAt","updatedAt")
            VALUES (?,?,?,?,?,?,?,1,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      args: [p.id, p.url, p.altText, p.title, p.caption, p.seoKeyword, p.order],
    });
    inserted++;
    console.log(`✓ ${p.id}: ${p.title}`);
  }

  const result = await client.execute('SELECT COUNT(*) as count FROM "GalleryImage"');
  console.log(`\nDone! ${inserted} photos inserted. DB total: ${result.rows[0].count}`);
}

main().catch(e => { console.error(e); process.exit(1); });
