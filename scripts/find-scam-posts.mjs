import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const r = await client.execute("SELECT slug, locale FROM BlogPost WHERE slug LIKE '%scam%' OR slug LIKE '%tourist%' OR slug LIKE '%safety%' ORDER BY locale, slug");
console.log(JSON.stringify(r.rows, null, 2));
await client.close();
