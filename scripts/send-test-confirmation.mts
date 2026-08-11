/**
 * Sends one real order-confirmation email, to check the network block renders
 * in an actual inbox rather than in a DOM parser.
 *
 *   node --env-file=.env.local --experimental-strip-types \
 *     --import ./scripts/ts-resolve.mjs scripts/send-test-confirmation.mts --to=you@example.com
 *
 * Uses whatever EMAIL_PROVIDER is configured. With the mock provider it prints
 * the HTML instead of sending, which is the right behaviour for a dry run.
 */
import { email } from '../src/lib/email/index.ts';

const to = process.argv.find((a) => a.startsWith('--to='))?.split('=')[1];
if (!to) {
  console.log('  --to=<address> is required');
  process.exit(1);
}

console.log(`provider: ${process.env.EMAIL_PROVIDER ?? 'mock'} → ${to}\n`);

await email.sendBookingConfirmation({
  to,
  customerName: 'Network Block Test',
  reference: 'BHA-TESTXX',
  ticketType: 'Complete Visitor Pack',
  visitDate: '2026-08-15',
  adults: 2,
  children: 0,
  totalAmount: '27.98',
  currency: 'EUR',
  audioGuideUrls: [
    'https://guide.visitbahiapalace.com/?k=TEST-0001',
    'https://guide.visitbahiapalace.com/?k=TEST-0002',
  ],
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? null,
} as never);

console.log('sent — open it and check the "While you are in Morocco" block at the bottom.');
