/**
 * Import the Marrakech souk / medina / food photo set.
 *
 * Kept in a separate folder from the palace set, and NOT named
 * "bahia-palace-*", because none of these are the palace. Naming a souk
 * photo after the palace would put a false keyword in the filename, the alt
 * text and the URL — bad for SEO and simply untrue.
 *
 * EXCLUDED: caption_(4) shows a clearly identifiable visitor's face, in
 * focus and centre-frame. Publishing a recognisable private individual on a
 * commercial page needs their permission, which we do not have on file. If
 * the owner has it (or knows her), it can be added in seconds — see README
 * note at the bottom.
 *
 * Run: node scripts/import-marrakech-photos-2026-07.mjs
 */
import sharp from 'sharp';
import { mkdir, access, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SRC = 'C:/Users/Sara-Malak/Desktop/cloudimge bahia palace/New folder';
const DEST = path.join(__dirname, '../public/images/marrakech-2026');

/** [sourceFile, seoFilename] — names describe what is actually in frame. */
export const MAP = [
  ['caption_(1).jpg_202607191614.jpeg',  'marrakech-jemaa-el-fna-square-food-stalls-koutoubia.webp'],
  ['caption_(2).jpg_202607191617.jpeg',  'marrakech-jemaa-el-fna-green-umbrellas-juice-stalls.webp'],
  ['caption_(10).jpg_202607191612.jpeg', 'marrakech-souk-jewellery-shop-bangles-necklaces.webp'],
  ['caption_(12).jpg_202607191610.jpeg', 'marrakech-medina-alley-hanging-carpets.webp'],
  ['caption_(14).jpg_202607191610.jpeg', 'marrakech-souk-lantern-shop-brass-glass-lamps.webp'],
  ['caption_(15).jpg_202607191608.jpeg', 'marrakech-souk-metalwork-brass-lanterns-copper.webp'],
  ['caption_(16).jpg_202607191607.jpeg', 'marrakech-souk-olive-spice-stall-market.webp'],
  ['caption_(17).jpg_202607191606.jpeg', 'marrakech-souk-antique-bazaar-carpets-brassware.webp'],
  ['caption_(18).jpg_202607191606.jpeg', 'marrakech-souk-pottery-shop-tagines-ceramics.webp'],
  ['caption_(19).jpg_202607191605.jpeg', 'marrakech-souk-spice-shop-baskets-soap-minerals.webp'],
  ['caption_(35).jpg_202607191603.jpeg', 'marrakech-souk-artisan-making-brass-lantern.webp'],
  ['caption_(39).jpg_202607191548.jpeg', 'marrakech-souk-basket-hat-shop-straw-goods.webp'],
  ['caption_(7).jpg_202607191617.jpeg',  'marrakech-souk-tea-perfume-shop-lanterns.webp'],
  // caption_(4) → SKIPPED, identifiable person. See header.
];

async function main() {
  await mkdir(DEST, { recursive: true });
  let ok = 0, bytesIn = 0, bytesOut = 0;

  for (const [src, out] of MAP) {
    const from = path.join(SRC, src);
    try { await access(from); } catch { console.error('MISSING:', src); continue; }

    const info = await sharp(from)
      .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(DEST, out));

    const { size } = await stat(from);
    bytesIn += size; bytesOut += info.size; ok++;
    console.log(`${String(ok).padStart(2, '0')}  ${(size / 1024).toFixed(0).padStart(5)}KB → ${(info.size / 1024).toFixed(0).padStart(4)}KB  ${out}`);
  }

  console.log(`\nconverted : ${ok}/${MAP.length}`);
  console.log(`skipped   : 1 (identifiable person, no release)`);
  console.log(`total     : ${(bytesIn / 1048576).toFixed(1)}MB → ${(bytesOut / 1048576).toFixed(1)}MB`);
}

main();
