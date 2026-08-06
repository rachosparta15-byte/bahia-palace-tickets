import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

const r = await client.execute({
  sql: "SELECT slug, locale, title, seoTitle, seoDesc FROM BlogPost WHERE slug='bahia-palace-history' AND locale='en'",
  args: [],
});
const row = r.rows[0];
if (!row) { console.log('Not found'); await client.close(); process.exit(); }

for (const [field, val] of Object.entries({ title: row.title, seoTitle: row.seoTitle, seoDesc: row.seoDesc })) {
  const v = val ?? '';
  const buf = Buffer.from(v, 'utf8');
  console.log(`\n${field}: ${JSON.stringify(v)}`);
  // hex dump of any suspicious byte sequences
  for (let i = 0; i < buf.length - 2; i++) {
    if (buf[i] === 0xe2 && buf[i+1] === 0x80) {
      console.log(`  UTF-8 em/en dash at byte ${i}: ${buf.slice(i,i+3).toString('hex')}`);
    }
    if (buf[i] === 0xc3 && buf[i+1] === 0xa2) {
      console.log(`  SUSPICIOUS â at byte ${i}: ${buf.slice(i,i+6).toString('hex')}`);
    }
  }
}

// Also check all posts for the "Grand Vizier Ba Ahmed" broken pattern
const all = await client.execute({
  sql: "SELECT slug, locale, title, seoTitle, seoDesc, content FROM BlogPost",
  args: [],
});
console.log('\n\nSearching ALL fields in ALL posts for "Grand Vizier Ba Ahmed":');
for (const post of all.rows) {
  for (const [field, val] of Object.entries({ title: post.title, seoTitle: post.seoTitle, seoDesc: post.seoDesc })) {
    if ((val||'').includes('Grand Vizier Ba Ahmed')) {
      console.log(`  FOUND in ${post.locale}/${post.slug} [${field}]: ${JSON.stringify(val)}`);
      const buf = Buffer.from(val, 'utf8');
      console.log(`  Hex: ${buf.toString('hex').match(/../g).join(' ')}`);
    }
  }
}

await client.close();
