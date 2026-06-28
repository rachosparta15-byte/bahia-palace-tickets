/**
 * Batch 3 content merge:
 *  1. Add scams 7+8 + booking note to marrakech-safety-guide EN
 *  2. Create 4 native-slug canonical history posts (FR/DE/IT/ES)
 *     by copying from bahia-palace-history/<locale> with localized SEO titles
 */
import { createClient } from '@libsql/client';
const client = createClient({
  url:       process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

/* ── helpers ── */
function cuid() {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function getPost(slug, locale) {
  const r = await client.execute({
    sql: 'SELECT * FROM BlogPost WHERE slug = ? AND locale = ?',
    args: [slug, locale],
  });
  return r.rows[0] ?? null;
}

async function updateContent(slug, locale, newContent) {
  await client.execute({
    sql: `UPDATE BlogPost SET content = ?, updatedAt = ? WHERE slug = ? AND locale = ?`,
    args: [newContent, new Date().toISOString(), slug, locale],
  });
  console.log(`✅ Updated content: ${locale}/${slug}`);
}

async function createPost({ slug, locale, title, seoTitle, seoDesc, content, category, tags,
                            coverImage, ogImage, excerpt, published, publishedAt }) {
  // Check if already exists
  const existing = await getPost(slug, locale);
  if (existing) {
    console.log(`⚠️  Already exists, skipping create: ${locale}/${slug}`);
    return;
  }
  const now = new Date().toISOString();
  await client.execute({
    sql: `INSERT INTO BlogPost (id, slug, locale, title, seoTitle, seoDesc, content, category, tags,
                                coverImage, ogImage, excerpt, author, published, publishedAt, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      cuid(), slug, locale, title, seoTitle, seoDesc, content, category, tags ?? null,
      coverImage ?? null, ogImage ?? null, excerpt ?? null,
      'Bahia Palace Team',
      published ? 1 : 0,
      publishedAt ?? null,
      now, now,
    ],
  });
  console.log(`✅ Created: ${locale}/${slug}`);
}

/* ────────────────────────────────────────────────────────────
   TASK 1 — safety guide: add scams 7 & 8 + booking note
   ──────────────────────────────────────────────────────────── */

const safetyPost = await getPost('marrakech-safety-guide', 'en');
if (!safetyPost) {
  console.error('ERROR: marrakech-safety-guide EN not found');
  process.exit(1);
}

const NEW_SCAMS_HTML = `
<h3>7. Taxi Overcharging</h3>
<p>Official petit taxis (red, metered) are the standard way to get around Marrakech. The typical fare from the Bahia Palace area or Djemaa el-Fna to the airport is 70 to 100 MAD; short hops within the medina to other attractions run 15 to 30 MAD. Unofficial and unmetered vehicles quoted to tourists near the palace gate can be four to five times higher.</p>
<p>Always confirm the meter is running before the car moves. For fixed fares — night journeys and airport transfers — agree on a written price before entering. If a driver claims the meter is broken, get out and flag another taxi.</p>

<h3>8. False Menu Prices</h3>
<p>Some tourist-facing restaurants near Bahia Palace and Djemaa el-Fna display attractive prices outside but deliver a higher bill — adding unstated cover charges, bread, or a "service" fee.</p>
<p>Ask to see the current printed menu before sitting down and confirm whether any additional charges apply. If the bill does not match what you ordered, note that tourist police patrol the area and disputes are resolved quickly when reported.</p>

<p><strong>A note on booking your ticket in advance:</strong> Purchasing your Bahia Palace entrance online and arriving with a QR code eliminates scams 1, 2, and 4 in one step. There is no queue for fake sellers to insert themselves into, no gate confusion to exploit, and nothing left to "offer" you. It is the single most effective precaution available.</p>
`;

// Insert before the second <figure> element (after scam 6 prevention tip, before sign photo)
const SIGN_FIGURE_MARKER = `<figure style="margin:1.5rem 0;text-align:center;">
  <img
    src="/images/blog-real/bahia-palace-official-sign-palais-bahia-exterior-wall.webp"`;

let safetyContent = safetyPost.content;

// Update "Six predictable scams" → "Eight predictable scams"
safetyContent = safetyContent.replace(
  'Six predictable scams cluster around Bahia Palace and the Medina. They follow a common pattern: a stranger initiates contact and tries to redirect you before you can think. Knowing this pattern neutralises all six.',
  'Eight predictable scams cluster around Bahia Palace and the Medina. They follow a common pattern: a stranger initiates contact and tries to redirect you before you can think. Knowing this pattern neutralises all eight.'
);

// Update "Six distinct approaches"
safetyContent = safetyContent.replace(
  'Six distinct approaches repeat consistently.',
  'Eight distinct approaches repeat consistently.'
);

// Add price benchmark to scam 6 photograph demand
safetyContent = safetyContent.replace(
  'The moment any image is taken, payment is demanded, sometimes aggressively.',
  'The moment any image is taken, payment is demanded — typically 150 to 300 MAD per session — sometimes aggressively.'
);

// Insert scams 7+8 + booking note before the sign figure
if (!safetyContent.includes(SIGN_FIGURE_MARKER)) {
  console.error('ERROR: Could not find sign figure marker in safety guide content');
  process.exit(1);
}
safetyContent = safetyContent.replace(SIGN_FIGURE_MARKER, NEW_SCAMS_HTML + '\n' + SIGN_FIGURE_MARKER);

await updateContent('marrakech-safety-guide', 'en', safetyContent);

/* ────────────────────────────────────────────────────────────
   TASK 2 — create native-slug history canonical posts
   ──────────────────────────────────────────────────────────── */

const historyLocales = [
  {
    locale: 'fr',
    nativeSlug:  'palais-de-la-bahia-marrakech-histoire',
    nativeTitle: 'Histoire du Palais de la Bahia de Marrakech : Si Moussa, Ba Ahmed et le pillage',
    nativeSeoTitle: 'Palais de la Bahia Marrakech — histoire complète : Ba Ahmed, la chute et le pillage',
    nativeSeoDesc: 'Histoire complète du Palais de la Bahia de Marrakech : comment Si Moussa et son fils Ba Ahmed — né esclave, devenu Grand Vizir — construisirent le plus beau palais privé du Maroc, et comment tout fut pillé en une nuit à sa mort en 1900.',
  },
  {
    locale: 'de',
    nativeSlug:  'palast-bahia-marrakesch-geschichte',
    nativeTitle: 'Geschichte des Palast Bahia Marrakesch: Si Moussa, Ba Ahmed und die Plünderung',
    nativeSeoTitle: 'Palast Bahia Marrakesch — vollständige Geschichte: Ba Ahmed, Aufstieg und Plünderung',
    nativeSeoDesc: 'Vollständige Geschichte des Palast Bahia Marrakesch: Wie Si Moussa und sein Sohn Ba Ahmed — geboren in Sklaverei, aufgestiegen zum Großwesir — den prächtigsten Privatpalast Marokkos bauten und nach Ba Ahmeds Tod 1900 alles über Nacht verloren.',
  },
  {
    locale: 'it',
    nativeSlug:  'palazzo-bahia-marrakech-storia',
    nativeTitle: 'Storia del Palazzo Bahia di Marrakech: Si Moussa, Ba Ahmed e il saccheggio',
    nativeSeoTitle: 'Palazzo Bahia Marrakech — storia completa: Ba Ahmed, ascesa e saccheggio notturno',
    nativeSeoDesc: 'Storia completa del Palazzo Bahia di Marrakech: come Si Moussa e suo figlio Ba Ahmed — nato schiavo, diventato Gran Visir — costruirono il palazzo privato più magnifico del Marocco e persero tutto in una notte alla morte di Ba Ahmed nel 1900.',
  },
  {
    locale: 'es',
    nativeSlug:  'palacio-bahia-marrakech-historia',
    nativeTitle: 'Historia del Palacio Bahia de Marrakech: Si Moussa, Ba Ahmed y el saqueo',
    nativeSeoTitle: 'Palacio Bahia Marrakech — historia completa: Ba Ahmed, ascenso y saqueo nocturno',
    nativeSeoDesc: 'Historia completa del Palacio Bahia de Marrakech: cómo Si Moussa y su hijo Ba Ahmed — nacido esclavo, ascendido a Gran Visir — construyeron el palacio privado más magnífico de Marruecos y lo perdieron todo en una noche a la muerte de Ba Ahmed en 1900.',
  },
];

for (const { locale, nativeSlug, nativeTitle, nativeSeoTitle, nativeSeoDesc } of historyLocales) {
  const source = await getPost('bahia-palace-history', locale);
  if (!source) {
    console.error(`ERROR: Source post not found: ${locale}/bahia-palace-history`);
    continue;
  }
  await createPost({
    slug:        nativeSlug,
    locale,
    title:       nativeTitle,
    seoTitle:    nativeSeoTitle,
    seoDesc:     nativeSeoDesc,
    content:     source.content,
    category:    source.category,
    tags:        source.tags,
    coverImage:  source.coverImage,
    ogImage:     source.ogImage,
    excerpt:     source.excerpt,
    published:   !!source.published,
    publishedAt: source.publishedAt,
  });
}

console.log('\n✅ Batch 3 merge complete.');
await client.close();
