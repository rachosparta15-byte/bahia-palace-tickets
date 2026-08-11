/**
 * Builds responsive variants of the homepage hero.
 *
 * The original is 1600x900 at 261 KB and is sent to every device, phone
 * included, where it is the LCP element. It also sits behind two dark
 * gradients (92% and 68%) and a zellige overlay, so detail in it is never
 * actually seen — which makes it a good candidate for aggressive quality
 * reduction rather than a compromise.
 */
import sharp from 'sharp';
import { statSync } from 'node:fs';

const SRC = 'c:/Users/Sara-Malak/Desktop/visite bahia palace/public/images/hero-bg.webp';
const OUT = 'c:/Users/Sara-Malak/Desktop/visite bahia palace/public/images';

const kb = (p) => Math.round(statSync(p).size / 1024);

console.log(`original      1600x900   ${kb(SRC)} KB\n`);

// 640 covers a 320 CSS-pixel phone at 2x; 1024 covers most phones at 3x and
// small tablets; 1600 stays for desktop. Quality 62 because the gradients on
// top hide compression artefacts that would be obvious on a bare photo.
const VARIANTS = [
  { width: 640, quality: 62, name: 'hero-bg-640.webp' },
  { width: 1024, quality: 64, name: 'hero-bg-1024.webp' },
  { width: 1600, quality: 68, name: 'hero-bg-1600.webp' },
];

for (const v of VARIANTS) {
  const dest = `${OUT}/${v.name}`;
  await sharp(SRC).resize({ width: v.width }).webp({ quality: v.quality, effort: 6 }).toFile(dest);
  console.log(`${v.name.padEnd(20)} ${String(v.width).padStart(4)}w   ${kb(dest)} KB`);
}

console.log(`\nphone now downloads ${kb(`${OUT}/hero-bg-640.webp`)} KB instead of ${kb(SRC)} KB`);
