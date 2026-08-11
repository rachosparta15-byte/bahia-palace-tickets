/**
 * Sends one real admin booking alert, so the thing that tells you a ticket
 * has been sold is proven before a customer depends on it.
 *
 *   node --env-file=.env.local --experimental-strip-types \
 *     --import ./scripts/ts-resolve.mjs scripts/send-test-admin-alert.mts --to=you@example.com
 */
import { email } from '../src/lib/email/index.ts';

const to = process.argv.find((a) => a.startsWith('--to='))?.split('=')[1];
if (!to) {
  console.log('  --to=<address> is required');
  process.exit(1);
}

console.log(`provider: ${process.env.EMAIL_PROVIDER ?? 'mock'} → ${to}\n`);

await email.sendAdminBookingAlert({
  to,
  reference: 'BHA-TESTALERT',
  bookingId: 'test-booking-id',
  customerName: 'Sofia Marchetti',
  customerEmail: 'sofia.marchetti@example.com',
  visitDate: '2026-08-14',
  daysUntilVisit: 2,
  adults: 3,
  children: 1,
  totalAmount: 55.96,
  currency: 'EUR',
  adminUrl: 'https://www.visitbahiapalace.com/admin/bookings/test-booking-id',
} as never);

console.log('sent — this is what arrives every time someone pays.');
