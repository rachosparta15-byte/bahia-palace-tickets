/**
 * A whole purchase, minus the money.
 *
 * Creates a real booking for four people, walks it through the exact
 * confirmation path a paid Stripe session would take, and prints what the
 * customer would end up holding: the reference, four access codes, and four
 * guide links. Then it redeems one of them the way a phone does, and tries the
 * same code on a second phone to prove the lock is not decorative.
 *
 *   npm run simulate
 *
 * Runs against whatever DATABASE_URL points at, which locally is a file. It
 * writes a booking row and codes, and cleans them up at the end unless you
 * pass --keep (which you want if you are going to click the link yourself).
 */
import { randomUUID } from 'node:crypto';

import prisma from '../src/lib/db/index.ts';
import { confirmBookingPaid } from '../src/lib/payments/confirm-booking.ts';
import { formatGuideCode, buildGuideCodeUrl } from '../src/lib/guide-code.ts';
import { redeemGuideCode } from '../src/lib/guide-access.ts';
import { email } from '../src/lib/email/index.ts';
import { getWhatsAppNumber } from '../src/lib/whatsapp.ts';

const KEEP = process.argv.includes('--keep');
/*
 * The self-test claims codes, and a claimed code is spent.
 *
 * Running this with --keep to click a link yourself produced four codes of
 * which two were already bound to 'phone-of-person-1' and 'phone-of-person-2'
 * before anyone touched them — so the first link in the email was refused, by
 * a lock doing exactly its job. Harmless in a simulation, fatal if this ever
 * seeds a real booking: half the party would find their guide already taken.
 */
const SELFTEST = !process.argv.includes('--no-selftest');
const EMAIL = process.argv.find((a) => a.startsWith('--email='))?.split('=')[1]
  ?? 'simulation@example.com';

const GUIDE_ORIGIN = process.env.GUIDE_ORIGIN ?? 'https://guide.visitbahiapalace.com';

const line = (s = '') => console.log(s);
const step = (n: number, s: string) => console.log(`\n── ${n}. ${s}`);

const reference = `SIM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
const visitDate = new Date(Date.now() + 3 * 86_400_000);

step(1, 'The customer books');
line(`   4 people · visitor pack · ${visitDate.toISOString().slice(0, 10)}`);
line(`   ${EMAIL}`);

const booking = await prisma.booking.create({
  data: {
    id: randomUUID(),
    reference,
    ticketType: 'visitor-pack',
    visitDate,
    adults: 4,
    children: 0,
    customerName: 'Simulation Customer',
    customerEmail: EMAIL,
    locale: 'en',
    // BOOKING_STATUS.awaitingPayment — the DB value is 'pending'.
    status: 'pending',
    totalAmount: 4 * 13.99,
    currency: 'EUR',
  } as never,
});
line(`   → booking ${booking.reference} created, awaiting payment`);

step(2, 'Payment lands (simulated — no card, no Stripe)');
const result = await confirmBookingPaid(booking.id, { via: 'mock' });
line(`   → ${JSON.stringify(result).slice(0, 140)}`);

const after = await prisma.booking.findUnique({ where: { id: booking.id } });
line(`   → status is now: ${after?.status}`);

step(3, 'What the customer receives');
const codes = await prisma.guideCode.findMany({
  where: { bookingId: booking.id },
  orderBy: { seat: 'asc' },
});
line(`   ${codes.length} access codes — one per person:`);
for (const c of codes) {
  line(`     seat ${c.seat}:  ${formatGuideCode(c.code)}`);
  line(`               ${buildGuideCodeUrl(GUIDE_ORIGIN, c.code)}`);
}

if (codes.length !== 4) {
  line(`\n   ✗ expected 4 codes for 4 people, got ${codes.length}`);
}

let delivered = false;
step(4, 'T-24h: the ticket goes out, and the guide with it');
/*
 * The confirmation deliberately carries no guide link — the published delivery
 * policy promises one message with everything in it, and sending the guide at
 * confirmation would also start the digital-content clock while the terms
 * still offered free cancellation. So this is the email that actually hands
 * over what was bought.
 */
try {
  await email.sendTicketDelivery({
    to: EMAIL,
    customerName: 'Simulation Customer',
    reference,
    qrCode: `SIM-QR-${reference}`,
    audioGuideUrls: codes.map((c) => buildGuideCodeUrl(GUIDE_ORIGIN, c.code)),
    whatsapp: getWhatsAppNumber(),
    visitDate: visitDate.toISOString().slice(0, 10),
  });
  line('   → ticket + 4 guide links sent');
  delivered = true;
} catch (err) {
  line(`   ✗ ticket delivery FAILED: ${err}`);
}

let first: any, again: any, stranger: any, second: any;
if (SELFTEST) {
step(5, 'Person 1 taps their link');
first = await redeemGuideCode(codes[0].code, 'phone-of-person-1');
line(`   → ${JSON.stringify(first)}`);

step(6, 'They come back later, offline-first, same phone');
again = await redeemGuideCode(codes[0].code, 'phone-of-person-1');
line(`   → ${JSON.stringify(again)}`);

step(7, 'Someone forwards that same link to a friend');
stranger = await redeemGuideCode(codes[0].code, 'a-completely-different-phone');
line(`   → ${JSON.stringify(stranger)}`);

step(8, 'Person 2 uses their own code');
second = await redeemGuideCode(codes[1].code, 'phone-of-person-2');
line(`   → ${JSON.stringify(second)}`);
} else {
  line('');
  line('── Self-test skipped: all four codes left unclaimed, for a real phone.');
}

line();
const ok = !SELFTEST ? (codes.length === 4 && delivered) : (
  first.ok && first.state === 'claimed' &&
  again.ok && again.state === 'returning' &&
  !stranger.ok && stranger.reason === 'other_device' &&
  second.ok && second.state === 'claimed' &&
  codes.length === 4 &&
  delivered);
line(ok ? '   RESULT: the pack behaves as sold.' : '   RESULT: something is wrong — read above.');

if (!KEEP) {
  await prisma.guideCode.deleteMany({ where: { bookingId: booking.id } });
  await prisma.booking.delete({ where: { id: booking.id } });
  line('\n   (simulation rows removed — pass --keep to leave them for clicking)');
} else {
  line(`\n   Kept. Booking ${reference} and its 4 codes are live in this database.`);
}

process.exit(ok ? 0 : 1);
