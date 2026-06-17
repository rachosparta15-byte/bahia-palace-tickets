export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { prisma } = await import('@/lib/db');
      // Create Lead table if it doesn't exist yet (Turso has no migrate deploy)
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Lead" (
          "id"         TEXT     NOT NULL PRIMARY KEY,
          "email"      TEXT,
          "name"       TEXT,
          "ticketType" TEXT     NOT NULL DEFAULT 'general',
          "locale"     TEXT     NOT NULL DEFAULT 'en',
          "sourcePage" TEXT     NOT NULL DEFAULT '/',
          "createdAt"  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await prisma.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "Lead_createdAt_idx" ON "Lead"("createdAt")`
      );
      await prisma.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "Lead_email_idx" ON "Lead"("email")`
      );
      // Add columns that may not exist in older deployments
      const alterCols = [
        `ALTER TABLE "Lead" ADD COLUMN "referrer"    TEXT`,
        `ALTER TABLE "Lead" ADD COLUMN "utmSource"   TEXT`,
        `ALTER TABLE "Lead" ADD COLUMN "utmMedium"   TEXT`,
        `ALTER TABLE "Lead" ADD COLUMN "utmCampaign" TEXT`,
        `ALTER TABLE "Lead" ADD COLUMN "device"      TEXT`,
        `ALTER TABLE "Lead" ADD COLUMN "ipAddress"   TEXT`,
      ];
      for (const sql of alterCols) {
        await prisma.$executeRawUnsafe(sql).catch(() => {});
      }
    } catch (e) {
      console.error('[instrumentation] Lead table setup failed:', e);
    }
  }
}
