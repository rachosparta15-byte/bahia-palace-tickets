/**
 * Import the 7 new articles from new-articles/ into the blog, scheduled to
 * publish one every two days.
 *
 * Scheduling is done purely with publishedAt. Each post goes in with
 * published=true and a future timestamp; the public queries filter on
 * publishedAt <= now (see src/lib/blog-schedule.ts), so posts appear on
 * their own. No cron job, nothing to keep running, nothing to break.
 *
 * The blog pages revalidate hourly, so a post appears within an hour of
 * its scheduled time rather than to the minute. That is the intended
 * trade-off: no moving parts.
 *
 * Idempotent: re-running updates the existing row for a slug rather than
 * creating a duplicate.
 *
 * Revert: node scripts/import-new-articles-2026-07.mjs --revert
 */
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../src/lib/db/index.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '../new-articles');

/** First article goes live here, then one every SPACING_DAYS. */
const FIRST_PUBLISH = new Date('2026-07-21T09:00:00.000Z');
const SPACING_DAYS = 2;

/** Publication order. Front-loaded with the highest-traffic topics. */
const ORDER = [
  'marrakech-1-day-itinerary',
  'bahia-palace-vs-ben-youssef-madrasa',
  'bahia-palace-during-ramadan',
  'mellah-marrakech-jewish-quarter',
  'zellige-moroccan-architecture-bahia-palace',
  'bahia-palace-accessibility',
  'bahia-palace-harem-women',
];

/** Frontmatter category -> the category keys the site already uses. */
const CATEGORY_MAP = {
  'Comparisons': 'comparisons',
  'Visit Tips': 'visit-tips',
  'History': 'history',
  'Practical Info': 'practical',
  'Guides': 'guides',
  'Itineraries': 'itineraries',
};

/** Cover image per article, chosen from the real photo sets already on site. */
const COVERS = {
  'marrakech-1-day-itinerary':                 '/images/marrakech-2026/marrakech-jemaa-el-fna-green-umbrellas-juice-stalls.webp',
  'bahia-palace-vs-ben-youssef-madrasa':       '/images/blog-2026/bahia-palace-carved-cedar-courtyard-corner-greenery.webp',
  'bahia-palace-during-ramadan':               '/images/blog-2026/bahia-palace-courtyard-marble-floor-visitors-walking.webp',
  'mellah-marrakech-jewish-quarter':           '/images/marrakech-2026/marrakech-medina-alley-hanging-carpets.webp',
  'zellige-moroccan-architecture-bahia-palace':'/images/blog-2026/bahia-palace-carved-stucco-band-painted-wood-zellige.webp',
  'bahia-palace-accessibility':                '/images/blog-2026/bahia-palace-covered-arcade-painted-ceiling-zellige-floor.webp',
  'bahia-palace-harem-women':                  '/images/blog-2026/bahia-palace-golden-window-grille-moucharabieh.webp',
};

/** Real images to substitute for the placeholder markers, in order of use. */
const INLINE = {
  'marrakech-1-day-itinerary':                 ['/images/marrakech-2026/marrakech-jemaa-el-fna-square-food-stalls-koutoubia.webp'],
  'bahia-palace-vs-ben-youssef-madrasa':       ['/images/blog-2026/bahia-palace-carved-stucco-arabic-calligraphy-detail.webp'],
  'bahia-palace-during-ramadan':               ['/images/blog-2026/bahia-palace-grand-courtyard-fountain-visitors.webp'],
  'mellah-marrakech-jewish-quarter':           ['/images/marrakech-2026/marrakech-souk-jewellery-shop-bangles-necklaces.webp',
                                                '/images/marrakech-2026/marrakech-souk-spice-shop-baskets-soap-minerals.webp'],
  'zellige-moroccan-architecture-bahia-palace':['/images/blog-2026/bahia-palace-marble-fountain-zellige-courtyard-floor.webp'],
  'bahia-palace-accessibility':                ['/images/blog-2026/bahia-palace-courtyard-marble-floor-visitors-walking.webp'],
  'bahia-palace-harem-women':                  ['/images/blog-2026/bahia-palace-carved-wooden-screen-zellige-interior.webp'],
};

// ── Markdown → HTML ──────────────────────────────────────────────────
// Deliberately small and specific to the markdown these articles use, rather
// than a general parser. Handles: headings, paragraphs, bold, links, images,
// tables, lists and horizontal rules.

function inline(text) {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) =>
      /^https?:/.test(href)
        ? `<a href="${href}" rel="noopener noreferrer" target="_blank">${label}</a>`
        : `<a href="${href}">${label}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');
}

function mdToHtml(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    // Horizontal rule (used before the CTA)
    if (/^---+$/.test(line.trim())) { out.push('<hr />'); i++; continue; }

    // Headings. H1 is dropped: the title lives in its own DB column.
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      if (level === 1) { i++; continue; }
      out.push(`<h${level}>${inline(h[2].trim())}</h${level}>`);
      i++;
      continue;
    }

    // Table
    if (/^\|/.test(line) && /^\|[\s:|-]+\|$/.test(lines[i + 1] ?? '')) {
      const head = line.split('|').slice(1, -1).map((c) => c.trim());
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        rows.push(lines[i].split('|').slice(1, -1).map((c) => c.trim()));
        i++;
      }
      out.push(
        '<table>\n<thead>\n<tr>' + head.map((c) => `<th>${inline(c)}</th>`).join('') + '</tr>\n</thead>\n<tbody>\n' +
        rows.map((r) => '<tr>' + r.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>').join('\n') +
        '\n</tbody>\n</table>'
      );
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^[-*]\s+/, ''))}</li>`);
        i++;
      }
      out.push(`<ul>\n${items.join('\n')}\n</ul>`);
      continue;
    }

    // Paragraph (may wrap across lines until a blank line)
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|[-*]\s|\|)/.test(lines[i]) && !/^---+$/.test(lines[i].trim())) {
      buf.push(lines[i].trim());
      i++;
    }
    const text = buf.join(' ');

    // An image on its own becomes a figure rather than a wrapped paragraph.
    if (/^!\[[^\]]*\]\([^)]+\)$/.test(text)) { out.push(inline(text)); continue; }

    // A bolded question standing alone is an FAQ heading. The site builds
    // FAQPage schema from <h3> followed by <p> (see extractFaqSchema in the
    // blog post page), so emitting <h3> here wires the schema up for free.
    const faq = text.match(/^\*\*(.+\?)\*\*$/);
    if (faq) { out.push(`<h3>${inline(faq[1])}</h3>`); continue; }

    out.push(`<p>${inline(text)}</p>`);
  }

  return out.join('\n\n');
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) throw new Error('missing frontmatter');
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*"?(.*?)"?\s*$/);
    if (kv) meta[kv[1]] = kv[2];
  }
  return { meta, body: m[2] };
}

async function revert() {
  const res = await prisma.blogPost.deleteMany({ where: { slug: { in: ORDER }, locale: 'en' } });
  console.log('removed:', res.count);
}

async function main() {
  const files = (await readdir(SRC)).filter((f) => f.endsWith('.md'));
  console.log(`found ${files.length} markdown files\n`);

  let n = 0;
  for (const slug of ORDER) {
    const file = `${slug}.md`;
    if (!files.includes(file)) { console.error('MISSING FILE:', file); continue; }

    const raw = await readFile(path.join(SRC, file), 'utf8');
    const { meta, body } = parseFrontmatter(raw);

    // Swap the placeholder image markers for real photos, in order.
    const pics = INLINE[slug] ?? [];
    let p = 0;
    const withImages = body.replace(/\(placeholder-image\.jpg\)/g, () => `(${pics[p++] ?? pics[pics.length - 1] ?? ''})`);

    const html = mdToHtml(withImages);
    const publishedAt = new Date(FIRST_PUBLISH.getTime() + n * SPACING_DAYS * 86400000);
    const category = CATEGORY_MAP[meta.category] ?? 'guides';

    const data = {
      title: meta.title,
      slug,
      locale: 'en',
      excerpt: meta.metaDescription,
      content: html,
      coverImage: COVERS[slug] ?? null,
      coverImageAlt: meta.title,
      category,
      seoTitle: meta.metaTitle,
      seoDesc: meta.metaDescription,
      author: 'Bahia Palace Team',
      published: true,
      publishedAt,
    };

    await prisma.blogPost.upsert({
      where: { slug_locale: { slug, locale: 'en' } },
      update: data,
      create: data,
    });

    const words = body.split(/\s+/).length;
    console.log(
      `${String(n + 1).padStart(2, '0')}  ${publishedAt.toISOString().slice(0, 16).replace('T', ' ')}  ` +
      `${String(words).padStart(4)}w  ${category.padEnd(12)} ${slug}`
    );
    n++;
  }

  console.log(`\nimported: ${n}`);
  console.log(`schedule: one every ${SPACING_DAYS} days from ${FIRST_PUBLISH.toISOString().slice(0, 10)}`);
  console.log('all are published=true with future dates; they appear on their own.');
}

(process.argv[2] === '--revert' ? revert() : main()).then(() => process.exit(0));
