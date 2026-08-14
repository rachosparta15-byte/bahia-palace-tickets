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

/* ─── Submission throttling ──────────────────────────────────────────────
 *
 * The block above counts FAILED logins: five wrong passwords and the door
 * closes. A public form needs the opposite question — how many times has this
 * address sent anything at all — because every successful submission costs
 * something. /api/contact writes a row AND sends an email, and had no ceiling
 * of any kind, so a loop against it fills the database and burns the sending
 * quota. A domain that sends a burst of identical mail is a domain that gets
 * filtered, and that would take the booking confirmations down with it.
 *
 * Scoped so several forms can share one table without one form's traffic
 * closing another's door.
 */

async function ensureSubmissionTable() {
  await db().execute(`
    CREATE TABLE IF NOT EXISTS _submissions (
      scope      TEXT    NOT NULL,
      ip         TEXT    NOT NULL,
      sent_at    INTEGER NOT NULL
    )
  `);
}

/**
 * True when this address has already sent `max` in the window.
 *
 * Never throws. A limiter that cannot read its own table must not become the
 * reason a real visitor cannot contact us — the same rule the guide throttle
 * follows, for the same reason.
 */
export async function isSubmissionLimited(
  scope: string,
  ip: string,
  max: number,
  windowMs: number,
): Promise<boolean> {
  if (!ip || ip === '0.0.0.0') return false;
  try {
    await ensureSubmissionTable();
    const result = await db().execute({
      sql: 'SELECT COUNT(*) AS cnt FROM _submissions WHERE scope = ? AND ip = ? AND sent_at > ?',
      args: [scope, ip, Date.now() - windowMs],
    });
    return Number(result.rows[0].cnt) >= max;
  } catch (error) {
    console.error('[rate-limit] submission check failed; allowing', error);
    return false;
  }
}

/** Records one submission and purges anything older than a day. */
export async function recordSubmission(scope: string, ip: string): Promise<void> {
  if (!ip || ip === '0.0.0.0') return;
  try {
    await ensureSubmissionTable();
    await db().batch([
      {
        sql: 'INSERT INTO _submissions (scope, ip, sent_at) VALUES (?, ?, ?)',
        args: [scope, ip, Date.now()],
      },
      {
        sql: 'DELETE FROM _submissions WHERE sent_at < ?',
        args: [Date.now() - 24 * 60 * 60 * 1000],
      },
    ]);
  } catch (error) {
    // Losing the record must not fail the submission the visitor just made.
    console.error('[rate-limit] could not record submission', error);
  }
}
