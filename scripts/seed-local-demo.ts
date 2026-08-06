/**
 * Seeds the LOCAL dev database with enough data to click through the
 * booking + QR delivery flow.
 *
 * Run:  npx tsx scripts/seed-local-demo.ts
 *
 * Safe by construction: refuses to run unless DATABASE_URL is a local
 * `file:` database. The production Turso credentials live in .env.prod and
 * are never loaded here — see src/lib/db/index.ts for the same guard at the
 * application level.
 *
 * Re-runnable: deletes only its own demo rows (DEMO- references and
 * @localdemo.test addresses) before recreating them, so it never touches
 * anything you added by hand.
 */

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';
import { VISITOR_PACK_PRICE_EUR_CENTS } from '../src/config/pricing';

// .env.local holds the local file: URL; .env is the fallback.
config({ path: '.env.local', override: true });

const ADMIN_EMAIL = 'admin@localdemo.test';
const ADMIN_PASSWORD = 'demo1234';
const DEMO_DOMAIN = '@localdemo.test';

const url = process.env.DATABASE_URL ?? '';
if (!url.startsWith('file:')) {
  console.error(
    `\nRefusing to seed: DATABASE_URL is not a local file database.\n` +
      `  got: ${url.slice(0, 40)}…\n` +
      `Demo data must never be written to production.\n`
  );
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url }) });

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + n);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

const euros = (cents: number) => cents / 100;

async function main() {
  // ── Admin ──────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.adminUser.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash },
    create: { email: ADMIN_EMAIL, passwordHash, name: 'Local Demo Admin', role: 'admin' },
  });

  // ── Clear previous demo rows only ──────────────────────────────────
  await prisma.booking.deleteMany({ where: { customerEmail: { contains: DEMO_DOMAIN } } });
  await prisma.lead.deleteMany({ where: { email: { contains: DEMO_DOMAIN } } });

  // ── One booking per state of the lifecycle ─────────────────────────
  const lead = await prisma.lead.create({
    data: {
      email: `sofia${DEMO_DOMAIN}`,
      name: 'Sofia Marchetti',
      ticketType: 'visitor-pack',
      locale: 'en',
      sourcePage: '/en/tickets',
      referrer: 'https://www.google.com/',
      device: 'mobile',
      partySize: 2,
      visitDate: daysFromNow(9).toISOString().slice(0, 10),
      status: 'paid',
    },
  });

  const paid = await prisma.booking.create({
    data: {
      reference: 'BHA-DEMO10',
      ticketType: 'visitor-pack',
      visitDate: daysFromNow(9),
      adults: 2,
      children: 0,
      totalAmount: euros(VISITOR_PACK_PRICE_EUR_CENTS * 2),
      currency: 'EUR',
      customerName: 'Sofia Marchetti',
      customerEmail: `sofia${DEMO_DOMAIN}`,
      customerPhone: '+212612345678',
      locale: 'en',
      status: 'confirmed', // paid, QR not sent → free cancellation window
      paymentProvider: 'mock',
      paymentSessionId: 'mock_demo_paid',
      termsAcceptedAt: new Date(),
      leadId: lead.id,
    },
  });
  await prisma.lead.update({ where: { id: lead.id }, data: { bookingId: paid.id } });

  const delivered = await prisma.booking.create({
    data: {
      reference: 'BHA-DEMO11',
      ticketType: 'visitor-pack',
      visitDate: daysFromNow(3),
      adults: 1,
      children: 0,
      totalAmount: euros(VISITOR_PACK_PRICE_EUR_CENTS),
      currency: 'EUR',
      customerName: 'Lucas Dubois',
      customerEmail: `lucas${DEMO_DOMAIN}`,
      customerPhone: '+212698765432',
      locale: 'fr',
      status: 'qr_sent', // delivered → cancellation closed
      paymentProvider: 'mock',
      paymentSessionId: 'mock_demo_sent',
      termsAcceptedAt: new Date(),
      qrSentAt: new Date(),
      qrCode: 'MIN-BHP-4417-92',
      qrDeliveredBy: `admin:${ADMIN_EMAIL}`,
    },
  });

  const unpaid = await prisma.booking.create({
    data: {
      reference: 'BHA-DEMO12',
      ticketType: 'visitor-pack',
      visitDate: daysFromNow(14),
      adults: 3,
      children: 0,
      totalAmount: euros(VISITOR_PACK_PRICE_EUR_CENTS * 3),
      currency: 'EUR',
      customerName: 'Anna Schmidt',
      customerEmail: `anna${DEMO_DOMAIN}`,
      locale: 'de',
      status: 'pending', // never paid
      paymentProvider: 'mock',
      termsAcceptedAt: new Date(),
    },
  });

  // A lead that never converted, so /admin/leads shows both outcomes.
  await prisma.lead.create({
    data: {
      email: `unconverted${DEMO_DOMAIN}`,
      name: 'Marta Rossi',
      ticketType: 'visitor-pack',
      locale: 'es',
      sourcePage: '/es/entrance-fee',
      referrer: 'https://chatgpt.com/',
      device: 'desktop',
      partySize: 4,
      visitDate: daysFromNow(20).toISOString().slice(0, 10),
      status: 'lead',
    },
  });

  console.log('\n  Local demo data ready.\n');
  console.log(`  Admin login   ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}\n`);
  console.log('  Bookings:');
  console.log(`    paid, QR not sent   ${paid.reference}   /en/booking/${paid.id}`);
  console.log(`    QR delivered        ${delivered.reference}   /fr/booking/${delivered.id}`);
  console.log(`    awaiting payment    ${unpaid.reference}   /de/booking/${unpaid.id}`);
  console.log();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
