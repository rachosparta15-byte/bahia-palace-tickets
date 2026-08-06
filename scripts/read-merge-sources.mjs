import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const slugs = [
  // Safety
  { slug: 'marrakech-safety-guide', locale: 'en' },
  { slug: 'how-to-avoid-tourist-scams-marrakech-safety-guide-2026', locale: 'en' },
  // History — native-slug canonicals
  { slug: 'palais-de-la-bahia-marrakech-histoire', locale: 'fr' },
  { slug: 'palast-bahia-marrakesch-geschichte', locale: 'de' },
  { slug: 'palazzo-bahia-marrakech-storia', locale: 'it' },
  { slug: 'palacio-bahia-marrakech-historia', locale: 'es' },
  // History — EN-slug translations (richer content to merge FROM)
  { slug: 'bahia-palace-history', locale: 'fr' },
  { slug: 'bahia-palace-history', locale: 'de' },
  { slug: 'bahia-palace-history', locale: 'it' },
  { slug: 'bahia-palace-history', locale: 'es' },
];

for (const { slug, locale } of slugs) {
  const r = await client.execute({
    sql: 'SELECT slug, locale, title, content FROM BlogPost WHERE slug = ? AND locale = ?',
    args: [slug, locale],
  });
  if (r.rows.length === 0) {
    console.log(`\n=== NOT FOUND: ${locale}/${slug} ===`);
  } else {
    const row = r.rows[0];
    console.log(`\n=== ${row.locale}/${row.slug} ===`);
    console.log(`TITLE: ${row.title}`);
    console.log(`CONTENT (${(row.content || '').length} chars):\n${row.content}`);
    console.log(`\n--- END ${row.locale}/${row.slug} ---`);
  }
}

await client.close();
