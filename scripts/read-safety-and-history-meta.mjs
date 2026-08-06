import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

const slugs = [
  { slug: 'marrakech-tourist-fears-taxi-scam-fake-guide-2026', locale: 'en' },
  { slug: 'bahia-palace-history', locale: 'fr' },
  { slug: 'bahia-palace-history', locale: 'de' },
  { slug: 'bahia-palace-history', locale: 'it' },
  { slug: 'bahia-palace-history', locale: 'es' },
];

for (const { slug, locale } of slugs) {
  const r = await client.execute({
    sql: 'SELECT slug, locale, title, seoTitle, seoDesc FROM BlogPost WHERE slug = ? AND locale = ?',
    args: [slug, locale],
  });
  if (r.rows.length === 0) {
    console.log(`NOT FOUND: ${locale}/${slug}`);
  } else {
    const row = r.rows[0];
    console.log(`\n${row.locale}/${row.slug}`);
    console.log(`  title: ${row.title}`);
    console.log(`  seoTitle: ${row.seoTitle}`);
    console.log(`  seoDesc: ${row.seoDesc}`);
  }
}
await client.close();
