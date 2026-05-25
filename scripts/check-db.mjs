import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
console.log('Tables:', tables.rows.map(r => r.name));

const rv = await client.execute("SELECT id, authorName, country, published FROM \"Review\" LIMIT 10");
console.log('Reviews:', rv.rows);

await client.close();
