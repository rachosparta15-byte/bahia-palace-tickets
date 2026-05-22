// One-shot migration script: runs the schema SQL against Turso
import { createClient } from '@libsql/client';

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error('Missing DATABASE_URL or TURSO_AUTH_TOKEN');
  process.exit(1);
}

const db = createClient({ url, authToken });

const statements = [
  `CREATE TABLE IF NOT EXISTS "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "ticketType" TEXT NOT NULL,
    "visitDate" DATETIME NOT NULL,
    "adults" INTEGER NOT NULL,
    "children" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "customerCountry" TEXT,
    "locale" TEXT NOT NULL,
    "specialRequests" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentProvider" TEXT NOT NULL DEFAULT 'mock',
    "paymentSessionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "PageView" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "referrer" TEXT,
    "referrerDomain" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "country" TEXT,
    "city" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "ipHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "Faq" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'general',
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "BlogPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "coverImage" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT,
    "seoTitle" TEXT,
    "seoDesc" TEXT,
    "ogImage" TEXT,
    "author" TEXT NOT NULL DEFAULT 'Bahia Palace Team',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "SafetyTip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'warning',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "SiteSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "locale" TEXT,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorName" TEXT NOT NULL,
    "authorImg" TEXT,
    "country" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "body" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "TicketType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameIt" TEXT NOT NULL,
    "nameDe" TEXT NOT NULL,
    "nameEs" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "descFr" TEXT NOT NULL,
    "descIt" TEXT NOT NULL,
    "descDe" TEXT NOT NULL,
    "descEs" TEXT NOT NULL,
    "priceAdult" REAL NOT NULL,
    "priceChild" REAL NOT NULL DEFAULT 0,
    "durationMins" INTEGER NOT NULL DEFAULT 60,
    "maxPerDay" INTEGER,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "images" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Booking_reference_key" ON "Booking"("reference")`,
  `CREATE INDEX IF NOT EXISTS "Booking_status_idx" ON "Booking"("status")`,
  `CREATE INDEX IF NOT EXISTS "Booking_createdAt_idx" ON "Booking"("createdAt")`,
  `CREATE INDEX IF NOT EXISTS "Booking_customerEmail_idx" ON "Booking"("customerEmail")`,
  `CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx" ON "PageView"("createdAt")`,
  `CREATE INDEX IF NOT EXISTS "PageView_path_idx" ON "PageView"("path")`,
  `CREATE INDEX IF NOT EXISTS "PageView_country_idx" ON "PageView"("country")`,
  `CREATE INDEX IF NOT EXISTS "PageView_referrerDomain_idx" ON "PageView"("referrerDomain")`,
  `CREATE INDEX IF NOT EXISTS "PageView_visitorId_idx" ON "PageView"("visitorId")`,
  `CREATE INDEX IF NOT EXISTS "Event_name_idx" ON "Event"("name")`,
  `CREATE INDEX IF NOT EXISTS "Event_createdAt_idx" ON "Event"("createdAt")`,
  `CREATE INDEX IF NOT EXISTS "Event_visitorId_idx" ON "Event"("visitorId")`,
  `CREATE INDEX IF NOT EXISTS "Faq_locale_scope_idx" ON "Faq"("locale", "scope")`,
  `CREATE INDEX IF NOT EXISTS "Faq_category_idx" ON "Faq"("category")`,
  `CREATE INDEX IF NOT EXISTS "BlogPost_locale_category_idx" ON "BlogPost"("locale", "category")`,
  `CREATE INDEX IF NOT EXISTS "BlogPost_published_idx" ON "BlogPost"("published")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "BlogPost_slug_locale_key" ON "BlogPost"("slug", "locale")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_email_key" ON "AdminUser"("email")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "SiteSetting_key_key" ON "SiteSetting"("key")`,
  `CREATE INDEX IF NOT EXISTS "Review_locale_published_idx" ON "Review"("locale", "published")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "TicketType_slug_key" ON "TicketType"("slug")`,
  `CREATE INDEX IF NOT EXISTS "SafetyTip_published_idx" ON "SafetyTip"("published")`,
];

console.log('Connecting to Turso...');
let ok = 0;
for (const sql of statements) {
  try {
    await db.execute(sql);
    ok++;
  } catch (e) {
    console.error('Failed:', sql.slice(0, 60), '\n', e.message);
  }
}
console.log(`Done: ${ok}/${statements.length} statements executed successfully.`);
