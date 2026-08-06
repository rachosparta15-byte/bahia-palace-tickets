import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

const all = await client.execute({
  sql: 'SELECT slug, locale, title, seoTitle, seoDesc, content FROM BlogPost',
  args: [],
});

const targets = ['named it Bahia', 'Grand Vizier Ba Ahmed', 'â€', 'c3 a2 e2', 'Ã©', 'DÃ©co'];

for (const row of all.rows) {
  for (const [field, val] of Object.entries({ title: row.title, seoTitle: row.seoTitle, seoDesc: row.seoDesc, content: row.content })) {
    const v = val ?? '';
    for (const t of targets) {
      if (v.includes(t)) {
        const idx = v.indexOf(t);
        const snippet = v.slice(Math.max(0, idx-20), idx+50);
        console.log(`[${row.locale}/${row.slug}][${field}] "${t}" → ${JSON.stringify(snippet)}`);
      }
    }
  }
}

await client.close();
