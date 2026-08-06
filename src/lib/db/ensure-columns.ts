import prisma from './index';

/**
 * Adds columns and tables that newer code depends on but older databases may
 * not have.
 *
 * WHY THIS EXISTS: this project has no migration history — the schema is
 * pushed, and columns added since the last push have been patched in with
 * ad-hoc `ALTER TABLE … ADD COLUMN` calls (see the git history of
 * /api/leads and /admin/leads, where `ipAddress`, `partySize`, `visitDate`
 * and `whatsapp` were each bolted on this way). Replacing that with real
 * migrations is the right long-term fix, but it is not this change's job.
 *
 * What this DOES fix is the two problems with the scattered version:
 *
 *   1. It ran on every single request. Four `ALTER TABLE` round-trips on
 *      each lead POST and each admin page load, every one of them expected
 *      to fail. Now it runs once per process.
 *   2. Each call site kept its own list, so a route that forgot one got a
 *      "no such column" error at runtime. One list, one place.
 *
 * SQLite has no `ADD COLUMN IF NOT EXISTS`, so the "already there" case is
 * a thrown error we swallow — that is the intended path, not a failure.
 */

/**
 * Whole tables added by newer code.
 *
 * There IS a migration for GuideActivation (prisma/migrations/
 * 20260727000000_add_guide_activation), but per the note above this project
 * deploys by pushing the schema rather than running migrations, so the
 * migration alone is not a guarantee the table exists in production. A
 * missing column degrades one query; a missing table 500s every guide
 * redemption, which is a paying customer standing in the palace unable to
 * open what they bought. `IF NOT EXISTS` makes this a no-op once real.
 */
const TABLES: readonly string[] = [
  `CREATE TABLE IF NOT EXISTS "GuideActivation" (
     "id" TEXT NOT NULL PRIMARY KEY,
     "tokenId" TEXT NOT NULL,
     "bookingId" TEXT NOT NULL,
     "reference" TEXT NOT NULL,
     "deviceId" TEXT NOT NULL,
     "activatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
   )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "GuideActivation_tokenId_deviceId_key"
     ON "GuideActivation"("tokenId", "deviceId")`,
  `CREATE INDEX IF NOT EXISTS "GuideActivation_bookingId_idx"
     ON "GuideActivation"("bookingId")`,
  `CREATE INDEX IF NOT EXISTS "GuideActivation_reference_idx"
     ON "GuideActivation"("reference")`,
];

const COLUMNS: readonly string[] = [
  // Pre-existing, previously patched in at the call sites.
  `ALTER TABLE "Lead" ADD COLUMN "ipAddress" TEXT`,
  `ALTER TABLE "Lead" ADD COLUMN "partySize" INTEGER`,
  `ALTER TABLE "Lead" ADD COLUMN "visitDate" TEXT`,
  `ALTER TABLE "Lead" ADD COLUMN "whatsapp" TEXT`,
  // Added by the 2-step purchase flow: the Lead↔Booking link.
  //
  // The DEFAULT on `status` matters. Rows that already exist were captured
  // before payments were possible, so they are leads and nothing else —
  // without the default they would read as NULL and a "paid" filter written
  // naively could class them as neither, hiding them from both views.
  `ALTER TABLE "Lead" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'lead'`,
  `ALTER TABLE "Lead" ADD COLUMN "bookingId" TEXT`,
  `ALTER TABLE "Booking" ADD COLUMN "leadId" TEXT`,
  `ALTER TABLE "Booking" ADD COLUMN "termsAcceptedAt" DATETIME`,
  // QR delivery (manual fulfilment). `qrSentAt` decides whether a booking
  // can still be cancelled — see src/lib/booking-lifecycle.ts. If it is
  // missing, every cancellation is refused, so this must never be dropped.
  `ALTER TABLE "Booking" ADD COLUMN "qrSentAt" DATETIME`,
  `ALTER TABLE "Booking" ADD COLUMN "qrCode" TEXT`,
  `ALTER TABLE "Booking" ADD COLUMN "qrFileRef" TEXT`,
  `ALTER TABLE "Booking" ADD COLUMN "qrDeliveredBy" TEXT`,
  // Automated refund on cancellation. `refundId` is the idempotency guard —
  // its presence means a refund was already issued, so the cancel route must
  // not call the provider again. See src/app/api/admin/bookings/[id]/cancel.
  `ALTER TABLE "Booking" ADD COLUMN "refundId" TEXT`,
  `ALTER TABLE "Booking" ADD COLUMN "refundedAt" DATETIME`,
];

/** Resolves once per process; concurrent callers await the same promise. */
let applied: Promise<void> | null = null;

async function apply(): Promise<void> {
  // Tables before columns: a column patch targeting a table that does not
  // exist yet would be swallowed and never retried this process.
  for (const sql of TABLES) {
    await prisma.$executeRawUnsafe(sql).catch(() => {});
  }
  for (const sql of COLUMNS) {
    // Swallowed on purpose: "duplicate column name" is the success case on
    // every run after the first.
    await prisma.$executeRawUnsafe(sql).catch(() => {});
  }
}

/**
 * Call before the first query that touches any of the columns above.
 *
 * Safe to call from anywhere and as often as you like — the work happens
 * once. Never throws: a database that already has every column and one that
 * cannot be altered both end up here silently, and the query that follows
 * will surface any real problem with a far clearer error than this would.
 */
export function ensureColumns(): Promise<void> {
  applied ??= apply();
  return applied;
}
