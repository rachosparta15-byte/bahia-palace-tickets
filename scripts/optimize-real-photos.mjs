import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SRC  = 'C:/Users/Sara-Malak/Desktop/New folder (6)/Picflow Images Jun 21';
const DEST = path.join(__dirname, '../public/images/blog-real');

const MAP = [
  ['IMG_4634.webp', 'bahia-palace-garden-entrance-path-palm-trees.webp'],
  ['IMG_4643.webp', 'bahia-palace-interior-courtyard-blue-doors-zellige.webp'],
  ['IMG_4671.webp', 'bahia-palace-octagonal-cedar-ceiling-chandelier.webp'],
  ['IMG_4675.webp', 'bahia-palace-carved-plaster-arch-visitors-interior.webp'],
  ['IMG_4690.webp', 'bahia-palace-private-apartment-carved-fireplace.webp'],
  ['IMG_4694.webp', 'bahia-palace-courtyard-fountain-framed-arch.webp'],
  ['IMG_4706.webp', 'bahia-palace-carved-cedar-doorway-geometric.webp'],
  ['IMG_4707.webp', 'bahia-palace-small-riad-courtyard-fountain-arches.webp'],
  ['IMG_4725.webp', 'bahia-palace-interior-artifacts-exhibition.webp'],
  ['IMG_4734.webp', 'bahia-palace-zellige-floor-geometric-star-pattern.webp'],
  ['IMG_4779.webp', 'bahia-palace-painted-red-window-plaster-arch.webp'],
  ['IMG_4782.webp', 'bahia-palace-ornate-iron-window-grille-backlit.webp'],
  ['IMG_4791.webp', 'bahia-palace-exterior-blue-yellow-facade-minaret.webp'],
  ['IMG_4793.webp', 'bahia-palace-exterior-facade-visitor-minaret.webp'],
  ['IMG_4803.webp', 'bahia-palace-entrance-gate-arabic-inscription-carving.webp'],
  ['IMG_4804.webp', 'bahia-palace-entrance-gate-carved-wood-plaster.webp'],
  ['IMG_4807.webp', 'bahia-palace-visitor-entering-carved-gate-zellige.webp'],
  ['IMG_4813.webp', 'bahia-palace-green-shuttered-window-iron-grille.webp'],
  ['IMG_4815.webp', 'bahia-palace-room-wooden-shelf-niche-painted-ceiling.webp'],
  ['IMG_4818.webp', 'bahia-palace-grand-reception-hall-painted-ceiling-fountain.webp'],
  ['IMG_4819.webp', 'bahia-palace-grand-reception-hall-visitors.webp'],
  ['IMG_4824.webp', 'bahia-palace-marble-fountain-basin-zellige-floor.webp'],
  ['IMG_4829.webp', 'bahia-palace-painted-cedar-ceiling-moroccan-lantern.webp'],
  ['IMG_4830.webp', 'bahia-palace-painted-door-panel-gold-floral-detail.webp'],
  ['IMG_4833.webp', 'bahia-palace-historic-photo-exhibition-moroccan-women.webp'],
  ['IMG_4835.webp', 'bahia-palace-courtyard-wall-fountain-alcove-zellige.webp'],
  ['IMG_4837.webp', 'bahia-palace-arched-wooden-door-tadelakt-wall.webp'],
  ['IMG_4842.webp', 'bahia-palace-divan-alcove-reed-mat-zellige.webp'],
  ['IMG_4843.webp', 'bahia-palace-original-terracotta-zellige-floor-corridor.webp'],
  ['IMG_4845.webp', 'bahia-palace-painted-door-gold-medallion-zellige.webp'],
  ['IMG_4847.webp', 'bahia-palace-wooden-ceiling-skylight-stained-glass.webp'],
  ['IMG_4853.webp', 'bahia-palace-ornate-ceiling-chandelier-stained-glass-skylight.webp'],
  ['IMG_4866.webp', 'bahia-palace-octagonal-painted-ceiling-light-rays.webp'],
  ['IMG_4870.webp', 'bahia-palace-long-gallery-corridor-painted-ceiling-chandeliers.webp'],
  ['IMG_4882.webp', 'bahia-palace-painted-window-flower-panels-gold-grille.webp'],
  ['IMG_4891.webp', 'bahia-palace-ornate-four-panel-painted-door-gold-floral.webp'],
  ['IMG_4894.webp', 'bahia-palace-window-painted-shutters-plaster-arch-zellige.webp'],
  ['IMG_4898.webp', 'bahia-palace-window-fan-arch-plaster-painted-panels.webp'],
  ['IMG_4903.webp', 'bahia-palace-courtyard-marble-fountain-zellige-garden.webp'],
  ['IMG_4911.webp', 'bahia-palace-muqarnas-cedar-ceiling-carved-plaster-arches.webp'],
  ['IMG_4923.webp', 'bahia-palace-exterior-entrance-gate-visitors-moroccan-flag.webp'],
  ['IMG_4948.webp', 'bahia-palace-official-sign-palais-bahia-exterior-wall.webp'],
];

await mkdir(DEST, { recursive: true });

console.log(`Processing ${MAP.length} images → ${DEST}\n`);

let totalIn = 0, totalOut = 0;

for (const [src, dest] of MAP) {
  const srcPath  = path.join(SRC, src);
  const destPath = path.join(DEST, dest);

  const img = sharp(srcPath);
  const meta = await img.metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;

  // Resize if wider than 1600px, otherwise keep original dimensions
  const needsResize = w > 1600;
  const pipeline = needsResize
    ? img.resize({ width: 1600, withoutEnlargement: true })
    : img;

  const buf = await pipeline.webp({ quality: 82, effort: 4 }).toBuffer();

  await import('fs').then(fs => fs.promises.writeFile(destPath, buf));

  const inKB  = Math.round(w > 0 ? (meta.size ?? 0) / 1024 : 0);
  const outKB = Math.round(buf.length / 1024);
  totalIn  += inKB;
  totalOut += outKB;

  const arrow = needsResize ? `${w}px→1600px` : `${w}px (kept)`;
  console.log(`✓ ${dest.padEnd(62)} ${arrow.padStart(16)}  ${String(inKB).padStart(5)}KB → ${String(outKB).padStart(4)}KB`);
}

console.log(`\nDone. Total: ${totalIn} KB in → ${totalOut} KB out (${Math.round((1 - totalOut/totalIn)*100)}% reduction)`);
