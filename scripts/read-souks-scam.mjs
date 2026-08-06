import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const r = await client.execute({
  sql: "SELECT slug, locale, title, seoTitle, seoDesc, content FROM BlogPost WHERE slug = ?",
  args: ['how-to-avoid-scams-in-the-souks-of-marrakech-complete-guide-for-travelers']
});
for (const row of r.rows) {
  console.log(`=== ${row.locale}/${row.slug} ===`);
  console.log(`TITLE: ${row.title}`);
  console.log(`SEO: ${row.seoTitle}`);
  console.log(`DESC: ${row.seoDesc}`);
  console.log(`CONTENT (${(row.content||'').length} chars):\n${row.content}`);
}
await client.close();
