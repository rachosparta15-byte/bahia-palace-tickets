import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../../generated/prisma/client';

/**
 * A remote database URL is anything that leaves this machine. Local SQLite
 * is `file:…` (or a bare relative path); everything else is a network hop to
 * a server that, in this project, holds real customer data.
 */
function isRemoteDatabaseUrl(url: string): boolean {
  return /^(libsql|https?|wss?):\/\//i.test(url.trim());
}

/**
 * HARD SAFETY SWITCH for the database, in the same spirit as
 * `src/lib/payments/guard.ts` — refuse rather than do the dangerous thing.
 *
 * WHY THIS EXISTS: `.env.local` used to contain the production Turso URL and
 * auth token. Next.js loads `.env.local` ahead of `.env`, so `npm run dev`
 * silently read and wrote the LIVE database — the one with 172 real leads —
 * while every visible signal said "local development". That is not a mistake
 * anyone can be careful enough to avoid; it has to be structurally impossible.
 *
 * So: outside a production build, a remote URL is a boot failure. Crashing on
 * startup is the point. A dev server that will not start is a five-second
 * fix; a dev server quietly mutating production is not recoverable.
 *
 * The three layers, together:
 *   1. `.env.prod` holds the production credentials and is a filename
 *      Next.js never auto-loads.
 *   2. `.env.local` points at a local SQLite file.
 *   3. This guard, which catches anyone who undoes 1 or 2.
 *
 * Production deploys are unaffected: Vercel sets NODE_ENV=production and
 * injects its own DATABASE_URL, so the remote URL is expected and allowed.
 */
function assertDatabaseUrlIsSafe(url: string): void {
  if (!isRemoteDatabaseUrl(url)) return;
  if (process.env.NODE_ENV === 'production') return;

  // Deliberate, explicit opt-in for the rare local task that really must
  // touch production. Long and awkward on purpose: nobody sets this by
  // reflex, and it reads as an alarm in shell history and CI logs.
  if (process.env.I_KNOW_THIS_WRITES_TO_PRODUCTION === 'yes') {
    console.warn(
      '\n⚠️  Connected to the PRODUCTION database from a non-production process.\n' +
        '   Every write lands on live customer data.\n'
    );
    return;
  }

  const host = (() => {
    try {
      return new URL(url).host;
    } catch {
      return url.slice(0, 40);
    }
  })();

  throw new Error(
    `\n\n` +
      `  ╭──────────────────────────────────────────────────────────────╮\n` +
      `  │  REFUSING TO START: remote database in a non-production run  │\n` +
      `  ╰──────────────────────────────────────────────────────────────╯\n\n` +
      `  DATABASE_URL points at   ${host}\n` +
      `  NODE_ENV is              ${process.env.NODE_ENV ?? '(unset)'}\n\n` +
      `  This looks like the production Turso database. Reading it from a\n` +
      `  dev server is how test data ends up in real customer records.\n\n` +
      `  Fix: set DATABASE_URL in .env.local back to a local file, e.g.\n` +
      `      DATABASE_URL=file:./prisma/dev-local.db\n\n` +
      `  Production credentials belong in .env.prod, which nothing loads\n` +
      `  automatically. If you genuinely need production from a script,\n` +
      `  opt in explicitly for that one command:\n` +
      `      I_KNOW_THIS_WRITES_TO_PRODUCTION=yes node scripts/your-script.mjs\n`
  );
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL || 'file:./prisma/dev-local.db';
  assertDatabaseUrlIsSafe(url);

  const authToken = process.env.TURSO_AUTH_TOKEN;
  const adapter = new PrismaLibSql({ url, ...(authToken ? { authToken } : {}) });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma_v2: PrismaClient };

export const prisma = globalForPrisma.prisma_v2 ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_v2 = prisma;

export default prisma;
