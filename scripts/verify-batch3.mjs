import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

// Verify safety guide scam count
const safety = await client.execute({
  sql: "SELECT content FROM BlogPost WHERE slug = 'marrakech-safety-guide' AND locale = 'en'",
  args: [],
});
const c = safety.rows[0]?.content ?? '';
const scamH3s = [...c.matchAll(/<h3>\d+\./g)].map(m => m[0]);
console.log('Safety guide scam sections found:', scamH3s.length, scamH3s);
console.log('Has "Eight predictable scams":', c.includes('Eight predictable scams'));
console.log('Has taxi section:', c.includes('Taxi Overcharging'));
console.log('Has restaurant section:', c.includes('False Menu Prices'));
console.log('Has booking note:', c.includes('booking your ticket in advance'));
console.log('Has 150-300 photo price:', c.includes('150 to 300 MAD'));

// Verify native-slug posts
const nativeSlugs = [
  { slug: 'palais-de-la-bahia-marrakech-histoire', locale: 'fr' },
  { slug: 'palast-bahia-marrakesch-geschichte',    locale: 'de' },
  { slug: 'palazzo-bahia-marrakech-storia',        locale: 'it' },
  { slug: 'palacio-bahia-marrakech-historia',      locale: 'es' },
];
console.log('\nNative-slug history posts:');
for (const { slug, locale } of nativeSlugs) {
  const r = await client.execute({
    sql: 'SELECT slug, locale, title, seoTitle, published, LENGTH(content) as len FROM BlogPost WHERE slug = ? AND locale = ?',
    args: [slug, locale],
  });
  if (r.rows.length === 0) {
    console.log(`  ❌ NOT FOUND: ${locale}/${slug}`);
  } else {
    const row = r.rows[0];
    console.log(`  ✅ ${row.locale}/${row.slug}`);
    console.log(`     title:    ${row.title}`);
    console.log(`     seoTitle: ${row.seoTitle}`);
    console.log(`     published: ${row.published}`);
    console.log(`     content length: ${row.len} chars`);
  }
}

await client.close();
