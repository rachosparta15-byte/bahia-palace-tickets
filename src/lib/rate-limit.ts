import { createClient } from '@libsql/client';

const MAX_ATTEMPTS = 5;
const WINDOW_MS    = 15 * 60 * 1000; // 15 minutes

function db() {
  return createClient({
    url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
    ...(process.env.TURSO_AUTH_TOKEN ? { authToken: process.env.TURSO_AUTH_TOKEN } : {}),
  });
}

async function ensureTable() {
  await db().execute(`
    CREATE TABLE IF NOT EXISTS _login_attempts (
      ip           TEXT    NOT NULL,
      attempted_at INTEGER NOT NULL
    )
  `);
}

export async function isRateLimited(ip: string): Promise<boolean> {
  const client = db();
  await ensureTable();
  const cutoff = Date.now() - WINDOW_MS;
  const result = await client.execute({
    sql:  'SELECT COUNT(*) AS cnt FROM _login_attempts WHERE ip = ? AND attempted_at > ?',
    args: [ip, cutoff],
  });
  return Number(result.rows[0].cnt) >= MAX_ATTEMPTS;
}

export async function recordFailedAttempt(ip: string): Promise<void> {
  const client = db();
  const cutoff = Date.now() - WINDOW_MS;
  await client.batch([
    {
      sql:  'INSERT INTO _login_attempts (ip, attempted_at) VALUES (?, ?)',
      args: [ip, Date.now()],
    },
    // keep table small — purge expired rows on each write
    {
      sql:  'DELETE FROM _login_attempts WHERE attempted_at < ?',
      args: [cutoff],
    },
  ]);
}

export async function clearAttempts(ip: string): Promise<void> {
  await db().execute({
    sql:  'DELETE FROM _login_attempts WHERE ip = ?',
    args: [ip],
  });
}

export function clientIp(req: Request): string {
  const xff = (req.headers as Headers).get('x-forwarded-for') ?? '';
  return xff.split(',')[0].trim() || '0.0.0.0';
}
