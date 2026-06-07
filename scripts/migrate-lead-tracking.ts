// Adds traffic-tracking columns to the Lead table in Turso production.
// Safe to re-run — each ALTER TABLE is wrapped in a try/catch that skips
// "duplicate column" errors.
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const url     = process.env.DATABASE_URL ?? 'file:./dev.db';
const adapter = new PrismaLibSql({
  url,
  ...(process.env.TURSO_AUTH_TOKEN ? { authToken: process.env.TURSO_AUTH_TOKEN } : {}),
});
const prisma = new PrismaClient({ adapter });

const COLUMNS = [
  'ALTER TABLE "Lead" ADD COLUMN "referrer"    TEXT',
  'ALTER TABLE "Lead" ADD COLUMN "utmSource"   TEXT',
  'ALTER TABLE "Lead" ADD COLUMN "utmMedium"   TEXT',
  'ALTER TABLE "Lead" ADD COLUMN "utmCampaign" TEXT',
  'ALTER TABLE "Lead" ADD COLUMN "device"      TEXT',
];

async function main() {
  for (const sql of COLUMNS) {
    try {
      await prisma.$executeRawUnsafe(sql);
      const col = sql.match(/"(\w+)"\s+TEXT$/)?.[1] ?? sql;
      console.log(`✓ added ${col}`);
    } catch (e: any) {
      const msg: string = e?.message ?? String(e);
      if (msg.includes('duplicate column') || msg.includes('already exists')) {
        const col = sql.match(/"(\w+)"\s+TEXT$/)?.[1] ?? '?';
        console.log(`  skip ${col} (already exists)`);
      } else {
        throw e;
      }
    }
  }
  console.log('\n✅  Migration done.');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
