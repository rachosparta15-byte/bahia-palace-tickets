import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const r = await client.execute({ sql: "SELECT content FROM BlogPost WHERE slug='bahia-palace-history' AND locale='en'", args: [] });
const c = r.rows[0].content;

// Find the broken context — search for "named it Bahia"
let idx = c.indexOf('named it Bahia');
if (idx < 0) {
  // Try finding it via the broken sequence neighbourhood
  idx = c.indexOf('Ba Ahmed');
  console.log('named-it not found, showing all Ba Ahmed contexts:');
  let i = 0;
  while ((i = c.indexOf('Ba Ahmed', i)) >= 0) {
    const chunk = c.slice(i, i + 60);
    const buf = Buffer.from(chunk, 'utf8');
    console.log('  text:', JSON.stringify(chunk));
    console.log('  hex :', buf.toString('hex').match(/../g).join(' '));
    i++;
  }
} else {
  const chunk = c.slice(Math.max(0, idx - 40), idx + 40);
  const buf = Buffer.from(chunk, 'utf8');
  console.log('Text:', JSON.stringify(chunk));
  console.log('Hex :', buf.toString('hex').match(/../g).join(' '));
}
await client.close();
