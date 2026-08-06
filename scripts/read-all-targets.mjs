/**
 * Read all posts needed for Batch A+B+D work
 */
import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

const TARGETS = [
  // A — DIFFERENTIATE
  { slug: 'bahia-palace-opening-hours-2026',              locale: 'en' },
  { slug: 'best-time-to-visit-bahia-palace',              locale: 'en' },
  { slug: 'bahia-palace-tips-before-visiting',            locale: 'en' },
  { slug: 'bahia-palace-marrakech-complete-visitor-guide-2026', locale: 'en' },
  // B — internal links
  { slug: 'bahia-palace-history',                         locale: 'en' },
  { slug: 'marrakech-safety-guide',                       locale: 'en' }, // already updated but need to verify skip-the-line link
  { slug: 'is-bahia-palace-worth-visiting',               locale: 'en' },
  { slug: 'bahia-palace-vs-saadian-tombs-which-to-visit', locale: 'en' },
  { slug: 'bahia-palace-photography-guide',               locale: 'en' },
  { slug: 'bahia-palace-with-kids',                       locale: 'en' },
  { slug: 'marrakech-1-day-itinerary',                    locale: 'en' },
  { slug: 'marrakech-2-day-itinerary',                    locale: 'en' },
  { slug: 'marrakech-3-day-itinerary',                    locale: 'en' },
];

for (const { slug, locale } of TARGETS) {
  const r = await client.execute({
    sql: 'SELECT slug, locale, title, seoTitle, seoDesc, content FROM BlogPost WHERE slug = ? AND locale = ?',
    args: [slug, locale],
  });
  if (r.rows.length === 0) {
    console.log(`\nNOT_FOUND: ${locale}/${slug}`);
  } else {
    const row = r.rows[0];
    console.log(`\n=== ${row.locale}/${row.slug} ===`);
    console.log(`TITLE: ${row.title}`);
    console.log(`SEOTITLE: ${row.seoTitle}`);
    console.log(`SEODESC: ${row.seoDesc}`);
    console.log(`CONTENT_LEN: ${(row.content||'').length}`);
    console.log(`CONTENT:\n${row.content}`);
    console.log(`--- END ${row.locale}/${row.slug} ---`);
  }
}

// Also check which locales exist for each B-target
const B_SLUGS = [
  'bahia-palace-history', 'marrakech-safety-guide', 'is-bahia-palace-worth-visiting',
  'bahia-palace-vs-saadian-tombs-which-to-visit', 'bahia-palace-photography-guide',
  'bahia-palace-with-kids', 'marrakech-1-day-itinerary', 'marrakech-2-day-itinerary',
  'marrakech-3-day-itinerary', 'bahia-palace-opening-hours-2026',
];
console.log('\n\n=== LOCALE AVAILABILITY ===');
for (const slug of B_SLUGS) {
  const r = await client.execute({
    sql: 'SELECT locale FROM BlogPost WHERE slug = ? AND published = 1 ORDER BY locale',
    args: [slug],
  });
  console.log(`${slug}: [${r.rows.map(r => r.locale).join(', ')}]`);
}

await client.close();
