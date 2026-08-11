/**
 * Drives a real PayPal sandbox checkout end to end.
 *
 *   node --env-file=.env.local --experimental-strip-types \
 *     --import ./scripts/ts-resolve.mjs scripts/paypal-checkout.mts
 *
 * Step 1 creates a booking and a real PayPal order, and prints the approval
 * link. You open it, log in with the sandbox BUYER account, and approve.
 * Step 2 (`--capture <bookingId>`) captures and confirms, which is the path
 * the booking page takes when the customer returns.
 *
 * Split in two on purpose: approval happens in a browser, and a script that
 * pretended to do it would be testing itself rather than PayPal.
 */
import { randomUUID } from 'node:crypto';

import prisma from '../src/lib/db/index.ts';
import { payments } from '../src/lib/payments/index.ts';
import { activeProvider } from '../src/lib/payments/guard.ts';
import { confirmBookingPaid } from '../src/lib/payments/confirm-booking.ts';
import { formatGuideCode, buildGuideCodeUrl } from '../src/lib/guide-code.ts';

const arg = (k: string) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split('=')[1];
const captureId = process.argv.includes('--capture') ? process.argv[process.argv.indexOf('--capture') + 1] : null;
const EMAIL = arg('email') ?? 'rachosparta15@gmail.com';
const PEOPLE = Number(arg('people') ?? 3);
const GUIDE_ORIGIN = process.env.AUDIO_GUIDE_URL ?? 'https://guide.visitbahiapalace.com';

const line = (s = '') => console.log(s);

if (activeProvider() !== 'paypal') {
  line(`  Active provider is "${activeProvider()}", not paypal. Set PAYMENT_PROVIDER=paypal.`);
  process.exit(1);
}
if (process.env.PAYPAL_ENVIRONMENT === 'live') {
  // A test script must never be the thing that takes real money.
  line('  PAYPAL_ENVIRONMENT=live — refusing to run. This script is for sandbox.');
  process.exit(1);
}

// ─────────────────────────────────────────────── step 2: capture
if (captureId) {
  const booking = await prisma.booking.findUnique({ where: { id: captureId } });
  if (!booking) { line(`  No booking ${captureId}`); process.exit(1); }
  if (!booking.paymentSessionId) { line('  That booking has no PayPal order id'); process.exit(1); }

  line(`\n── Capturing PayPal order ${booking.paymentSessionId}`);
  const { paid } = await payments.verifyCheckoutSession(booking.paymentSessionId);
  line(`   paid: ${paid}`);
  if (!paid) { line('   Not captured — approve the link in a browser first.'); process.exit(1); }

  await confirmBookingPaid(booking.id, { via: 'return-page', paymentSessionId: booking.paymentSessionId });
  const after = await prisma.booking.findUnique({ where: { id: booking.id } });
  line(`   status: ${after?.status}`);

  const codes = await prisma.guideCode.findMany({ where: { bookingId: booking.id }, orderBy: { seat: 'asc' } });
  line(`\n── ${codes.length} guide code(s) for ${after?.adults} people`);
  for (const c of codes) line(`   seat ${c.seat}:  ${buildGuideCodeUrl(GUIDE_ORIGIN, c.code)}`);

  const ok = after?.status === 'confirmed' && codes.length === after?.adults;
  line(`\n   ${ok ? 'Money taken, booking confirmed, one code per person.' : 'Something is off — read above.'}`);
  process.exit(ok ? 0 : 1);
}

// ─────────────────────────────────────────────── step 1: create
const reference = `PP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
const booking = await prisma.booking.create({
  data: {
    id: randomUUID(),
    reference,
    ticketType: 'visitor-pack',
    visitDate: new Date(Date.now() + 5 * 86_400_000),
    adults: PEOPLE,
    children: 0,
    customerName: 'Sandbox Buyer',
    customerEmail: EMAIL,
    locale: 'en',
    status: 'pending',
    totalAmount: 13.99 * PEOPLE,
    currency: 'EUR',
  } as never,
});
line(`\n── Booking ${booking.reference} — ${PEOPLE} people, €${(13.99 * PEOPLE).toFixed(2)}`);

const session = await payments.createCheckoutSession({
  bookingId: booking.id,
  reference,
  ticketName: 'Complete Visitor Pack',
  amount: 13.99,
  currency: 'EUR',
  customerEmail: EMAIL,
  locale: 'en',
  quantity: PEOPLE,
});

// Record it before showing the link: the booking page will only confirm an
// order id it already holds against this booking.
await prisma.booking.update({ where: { id: booking.id }, data: { paymentSessionId: session.id } });

line(`   PayPal order: ${session.id}`);
line(`\n── Approve it in a browser, signed in as the sandbox BUYER:`);
line(`\n   ${session.url}\n`);
line(`── Then capture:`);
line(`   node --env-file=.env.local --experimental-strip-types --import ./scripts/ts-resolve.mjs \\`);
line(`     scripts/paypal-checkout.mts --capture ${booking.id}\n`);
