import { createClient } from '@libsql/client';

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error('Missing DATABASE_URL or TURSO_AUTH_TOKEN');
  process.exit(1);
}

const client = createClient({ url, authToken });

const result = await client.execute('DELETE FROM "Review"');
console.log(`Deleted ${result.rowsAffected} review(s) from production DB.`);

await client.close();
