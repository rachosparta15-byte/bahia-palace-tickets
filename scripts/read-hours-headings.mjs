import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

const locales = ['fr','de','it','es'];
for (const locale of locales) {
  const r = await client.execute({
    sql: "SELECT locale, content FROM BlogPost WHERE slug = 'bahia-palace-opening-hours-2026' AND locale = ?",
    args: [locale],
  });
  if (!r.rows[0]) { console.log(`NOT FOUND: ${locale}`); continue; }
  const c = r.rows[0].content;
  // Extract H2 headings
  const h2s = [...c.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g,'').trim());
  console.log(`\n${locale} opening-hours H2s:`);
  h2s.forEach((h,i) => console.log(`  ${i+1}. ${h}`));
  // Find "best time" section - get first 200 chars after relevant H2
  const btIdx = c.indexOf('<h2>When Is the Best Time') > -1 ? c.indexOf('<h2>When Is the Best Time') :
                c.indexOf('<h2>Quando') > -1 ? c.indexOf('<h2>Quando') :
                c.indexOf('<h2>Quel est le meilleur') > -1 ? c.indexOf('<h2>Quel est le meilleur') :
                c.indexOf('<h2>Welche Monate') > -1 ? c.indexOf('<h2>Welche Monate') : -1;
}

// Also get best-time post H2s to find where to insert opening-hours link
for (const locale of locales) {
  const r = await client.execute({
    sql: "SELECT locale, content FROM BlogPost WHERE slug = 'best-time-to-visit-bahia-palace' AND locale = ?",
    args: [locale],
  });
  if (!r.rows[0]) { console.log(`NOT FOUND: ${locale}/best-time`); continue; }
  const c = r.rows[0].content;
  const h2s = [...c.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g,'').trim());
  console.log(`\n${locale} best-time H2s:`);
  h2s.forEach((h,i) => console.log(`  ${i+1}. ${h}`));
}

await client.close();
