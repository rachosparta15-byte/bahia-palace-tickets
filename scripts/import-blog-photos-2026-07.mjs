/**
 * Import the July 2026 Bahia Palace photo set into the blog.
 *
 * Converts each source photo to WebP with an SEO-descriptive filename based
 * on what is actually visible in the shot (every photo was viewed before it
 * was named — the names are not guesses from the source filename).
 *
 * EXCLUDED: caption_(18) carries another photographer's visible watermark
 * ("babal zaiwya dyal tasswir"). Publishing it would put a third party's mark
 * on a commercial page, so it is left out rather than cropped — cropping a
 * watermark off someone else's photo does not create a licence to use it.
 *
 * Run:  node scripts/import-blog-photos-2026-07.mjs
 */
import sharp from 'sharp';
import { mkdir, access } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SRC = 'C:/Users/Sara-Malak/Desktop/cloudimge bahia palace';
const DEST = path.join(__dirname, '../public/images/blog-2026');

/** [sourceFile, seoFilename] — names describe the photo's actual subject. */
export const MAP = [
  ['20180528-120020-largejpg.jpg_202607191409.jpeg', 'bahia-palace-painted-ceiling-stucco-alcove-stained-glass.webp'],
  ['WhatsApp Image 2026-07-19 at 4.25.33 AM.jpeg',   'bahia-palace-garden-courtyard-arch-palm-trees.webp'],
  ['WhatsApp Image 2026-07-19 at 4.25.34 AM (1).jpeg','bahia-palace-marble-fountain-zellige-courtyard-floor.webp'],
  ['WhatsApp Image 2026-07-19 at 4.25.34 AM.jpeg',   'bahia-palace-carved-stucco-arabic-calligraphy-detail.webp'],
  ['bahia-palace_(1).jpg_202607191411.jpeg',         'bahia-palace-painted-dome-ceiling-blue-gold.webp'],
  ['bahia-palast_(10).jpg_202607191425.jpeg',        'bahia-palace-courtyard-green-doors-visitors-colourful.webp'],
  ['bahia-palast_(2).jpg_202607191413.jpeg',         'bahia-palace-grand-courtyard-fountain-visitors.webp'],
  ['bahia-palast_(2).jpg_202607191414.jpeg',         'bahia-palace-covered-arcade-painted-ceiling-zellige-floor.webp'],
  ['bahia-palast_(5).jpg_202607191407.jpeg',         'bahia-palace-riad-garden-courtyard-trees-fountain.webp'],
  ['bahia-palast_(6).jpg_202607191416.jpeg',         'bahia-palace-courtyard-marble-floor-visitors-walking.webp'],
  ['bahia-palast_(7).jpg_202607191418.jpeg',         'bahia-palace-room-painted-wood-ceiling-stucco-window.webp'],
  ['bahia-palast_(8).jpg_202607191419.jpeg',         'bahia-palace-carved-cedar-courtyard-corner-greenery.webp'],
  ['bahia-palast_(9).jpg_202607191423.jpeg',         'bahia-palace-carved-wooden-doors-arched-doorway.webp'],
  ['blick-aus-dem-garten.jpg_202607191426.jpeg',     'bahia-palace-golden-window-grille-moucharabieh.webp'],
  ['caption_(10).jpg_202607191445.jpeg',             'bahia-palace-main-entrance-gate-carved-stucco-arch.webp'],
  ['caption_(13).jpg_202607191443.jpeg',             'bahia-palace-carved-stucco-lunette-above-door.webp'],
  ['caption_(14).jpg_202607191442.jpeg',             'bahia-palace-marble-fountain-basin-close-up.webp'],
  ['caption_(16).jpg_202607191440.jpeg',             'bahia-palace-gilded-arch-grand-hall-gold-decoration.webp'],
  // caption_(18) → SKIPPED, third-party watermark. See header.
  ['caption_(19).jpg_202607191442.jpeg',             'bahia-palace-official-ministry-landmark-sign.webp'],
  ['caption_(20).jpg_202607191438.jpeg',             'bahia-palace-octagonal-dome-ceiling-chandelier.webp'],
  ['caption_(21).jpg_202607191436.jpeg',             'bahia-palace-stained-glass-windows-colourful-lantern.webp'],
  ['caption_(22).jpg_202607191435.jpeg',             'bahia-palace-carved-wooden-screen-zellige-interior.webp'],
  ['caption_(23).jpg_202607191434.jpeg',             'bahia-palace-old-studded-wooden-door-weathered.webp'],
  ['caption_(24).jpg_202607191433.jpeg',             'bahia-palace-narrow-corridor-zellige-floor-lantern.webp'],
  ['caption_(3).jpg_202607191431.jpeg',              'bahia-palace-carved-stucco-band-painted-wood-zellige.webp'],
  ['caption_(4).jpg_202607191429.jpeg',              'bahia-palace-traditional-moroccan-guide-carved-doorway.webp'],
  ['caption_(5).jpg_202607191429.jpeg',              'bahia-palace-painted-wooden-ceiling-star-motif.webp'],
  ['caption_(6).jpg_202607191427.jpeg',              'bahia-palace-riad-garden-woman-red-dress-fountain.webp'],
  ['caption_(7).jpg_202607191446.jpeg',              'bahia-palace-grand-salon-painted-ceiling-lanterns.webp'],
  ['caption_(9).jpg_202607191445.jpeg',              'bahia-palace-hammam-painting-traditional-artwork.webp'],
];

const SKIPPED = ['caption_(18).jpg_202607191441.jpeg'];

async function main() {
  await mkdir(DEST, { recursive: true });
  let ok = 0;
  let bytesIn = 0;
  let bytesOut = 0;

  for (const [src, out] of MAP) {
    const from = path.join(SRC, src);
    try {
      await access(from);
    } catch {
      console.error('MISSING SOURCE:', src);
      continue;
    }
    const info = await sharp(from)
      // Cap the long edge: these are blog images, not print. Keeps LCP fast.
      .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(DEST, out));

    const { size: inSize } = await import('fs').then(fs => fs.promises.stat(from));
    bytesIn += inSize;
    bytesOut += info.size;
    ok++;
    console.log(`${String(ok).padStart(2, '0')}  ${(inSize / 1024).toFixed(0).padStart(5)}KB → ${(info.size / 1024).toFixed(0).padStart(4)}KB  ${out}`);
  }

  console.log(`\nconverted : ${ok}/${MAP.length}`);
  console.log(`skipped   : ${SKIPPED.length} (watermarked)`);
  console.log(`total size: ${(bytesIn / 1048576).toFixed(1)}MB → ${(bytesOut / 1048576).toFixed(1)}MB`);
  console.log(`dest      : public/images/blog-2026/`);
}

main();
