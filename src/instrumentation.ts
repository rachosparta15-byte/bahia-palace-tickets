export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { prisma } = await import('@/lib/db');

      // ── Lead ──────────────────────────────────────────────────────────────
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Lead" (
          "id"          TEXT     NOT NULL PRIMARY KEY,
          "email"       TEXT,
          "name"        TEXT,
          "ticketType"  TEXT     NOT NULL DEFAULT 'general',
          "locale"      TEXT     NOT NULL DEFAULT 'en',
          "sourcePage"  TEXT     NOT NULL DEFAULT '/',
          "referrer"    TEXT,
          "utmSource"   TEXT,
          "utmMedium"   TEXT,
          "utmCampaign" TEXT,
          "device"      TEXT,
          "ipAddress"   TEXT,
          "createdAt"   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Lead_createdAt_idx" ON "Lead"("createdAt")`);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Lead_email_idx"     ON "Lead"("email")`);
      // Backfill columns for older schema versions
      for (const sql of [
        `ALTER TABLE "Lead" ADD COLUMN "referrer"    TEXT`,
        `ALTER TABLE "Lead" ADD COLUMN "utmSource"   TEXT`,
        `ALTER TABLE "Lead" ADD COLUMN "utmMedium"   TEXT`,
        `ALTER TABLE "Lead" ADD COLUMN "utmCampaign" TEXT`,
        `ALTER TABLE "Lead" ADD COLUMN "device"      TEXT`,
        `ALTER TABLE "Lead" ADD COLUMN "ipAddress"   TEXT`,
      ]) { await prisma.$executeRawUnsafe(sql).catch(() => {}); }

      // ── PageView ──────────────────────────────────────────────────────────
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "PageView" (
          "id"             TEXT     NOT NULL PRIMARY KEY,
          "sessionId"      TEXT     NOT NULL,
          "visitorId"      TEXT     NOT NULL,
          "path"           TEXT     NOT NULL,
          "locale"         TEXT     NOT NULL DEFAULT 'en',
          "referrer"       TEXT,
          "referrerDomain" TEXT,
          "utmSource"      TEXT,
          "utmMedium"      TEXT,
          "utmCampaign"    TEXT,
          "utmTerm"        TEXT,
          "utmContent"     TEXT,
          "country"        TEXT,
          "city"           TEXT,
          "device"         TEXT,
          "browser"        TEXT,
          "os"             TEXT,
          "ipHash"         TEXT     NOT NULL DEFAULT '',
          "createdAt"      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx"      ON "PageView"("createdAt")`);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "PageView_path_idx"           ON "PageView"("path")`);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "PageView_visitorId_idx"      ON "PageView"("visitorId")`);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "PageView_referrerDomain_idx" ON "PageView"("referrerDomain")`);

      // ── Event ─────────────────────────────────────────────────────────────
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Event" (
          "id"        TEXT     NOT NULL PRIMARY KEY,
          "sessionId" TEXT     NOT NULL,
          "visitorId" TEXT     NOT NULL,
          "name"      TEXT     NOT NULL,
          "metadata"  TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Event_name_idx"      ON "Event"("name")`);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Event_createdAt_idx" ON "Event"("createdAt")`);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Event_visitorId_idx" ON "Event"("visitorId")`);

      // ── Booking ───────────────────────────────────────────────────────────
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Booking" (
          "id"               TEXT     NOT NULL PRIMARY KEY,
          "reference"        TEXT     NOT NULL UNIQUE,
          "ticketType"       TEXT     NOT NULL,
          "visitDate"        DATETIME NOT NULL,
          "adults"           INTEGER  NOT NULL,
          "children"         INTEGER  NOT NULL DEFAULT 0,
          "totalAmount"      REAL     NOT NULL,
          "currency"         TEXT     NOT NULL DEFAULT 'EUR',
          "customerName"     TEXT     NOT NULL,
          "customerEmail"    TEXT     NOT NULL,
          "customerPhone"    TEXT,
          "customerCountry"  TEXT,
          "locale"           TEXT     NOT NULL DEFAULT 'en',
          "specialRequests"  TEXT,
          "status"           TEXT     NOT NULL DEFAULT 'pending',
          "paymentProvider"  TEXT     NOT NULL DEFAULT 'mock',
          "paymentSessionId" TEXT,
          "createdAt"        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt"        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Booking_status_idx"        ON "Booking"("status")`);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Booking_createdAt_idx"     ON "Booking"("createdAt")`);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Booking_customerEmail_idx" ON "Booking"("customerEmail")`);

    } catch (e) {
      console.error('[instrumentation] DB setup failed:', e);
    }
  }
}
