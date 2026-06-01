import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const result = await client.execute('SELECT id, email, name, role, createdAt FROM "AdminUser"');
console.log('Admin users:', result.rows);

await client.close();
