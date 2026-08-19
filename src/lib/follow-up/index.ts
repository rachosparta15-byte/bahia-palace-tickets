import prisma from '@/lib/db';
import { BOOKING_STATUS } from '@/lib/booking-lifecycle';
import { ADULT_PRICE_EUR_CENTS, CHILD_PRICE_EUR_CENTS, packTotalCents } from '@/config/pricing';

/**
 * Who is eligible for a follow-up email, and the token that lets them stop.
 *
 * NOTHING HERE SENDS. Selection and sending are separate on purpose: the
 * operator sees the list first, and the route that sends only ever sends to
 * rows this file returned.
 */

/**
 * How long after an abandoned checkout the reminder becomes fair.
 *
 * Not twenty minutes. PayPal's own flow legitimately takes that long — a 3-D
 * Secure challenge, a phone leaving the browser for an SMS code — and "you
 * didn't finish" arriving while someone is still paying reads as a scam and
 * loses the sale that was about to close. Four hours is past every honest
 * explanation and still the same day.
 */
export const ABANDONED_AFTER_HOURS = 4;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.visitbahiapalace.com';

/**
 * The unsubscribe token: an HMAC of the email under the admin secret.
 *
 * Not the email in the URL, and not the booking id. A plain address in a query
 * string is an address anybody can put there — one guessed URL and a stranger
 * silences someone else's mail. The HMAC is checkable without a lookup table
 * and cannot be produced without the secret.
 */
async function key(): Promise<CryptoKey> {
  const secret = process.env.NEXTAUTH_SECRET ?? 'dev-secret-change-in-production';
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export async function unsubscribeToken(email: string): Promise<string> {
  const sig = await crypto.subtle.sign('HMAC', await key(), new TextEncoder().encode(email.toLowerCase()));
  return Buffer.from(new Uint8Array(sig)).toString('base64url').slice(0, 32);
}

export async function unsubscribeUrl(email: string, locale = 'en'): Promise<string> {
  const t = await unsubscribeToken(email);
  return `${SITE_URL}/${locale}/unsubscribe?e=${encodeURIComponent(email)}&t=${t}`;
}

export async function tokenMatches(email: string, token: string): Promise<boolean> {
  const expected = await unsubscribeToken(email);
  if (expected.length !== token.length) return false;
  // Constant time: a token found one character at a time is not a token.
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return diff === 0;
}

/** Midnight today, so a visit later today still counts as ahead of us. */
function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Abandoned checkouts worth a reminder.
 *
 * Four conditions, and every one of them is a way of not being a nuisance:
 * old enough that they are not still paying, a visit date that has not passed
 * (a reminder about a day gone by is worse than silence), never reminded
 * before, and not opted out.
 */
export async function abandonedCandidates() {
  const cutoff = new Date(Date.now() - ABANDONED_AFTER_HOURS * 60 * 60 * 1000);
  return prisma.booking.findMany({
    where: {
      status: BOOKING_STATUS.awaitingPayment,
      createdAt: { lt: cutoff },
      visitDate: { gte: startOfToday() },
      reminderSentAt: null,
      emailOptOut: false,
      customerEmail: { not: '' },
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
}

/**
 * Customers who could be told about the other monuments.
 *
 * Two conditions, and both are about timing rather than eligibility.
 *
 * The ticket has to have been SENT. Before that we still owe them the thing
 * they paid for, and an email about a different palace while that is
 * outstanding reads exactly as badly as it sounds.
 *
 * And the visit has to still be ahead of them. The message opens with "your
 * ticket is booked for the 16th, and these two are a ten-minute walk away" —
 * its whole premise is that the reader is about to be in Marrakech. Sent after
 * the fact it reaches somebody who has flown home, and invites them to walk
 * somewhere they cannot walk to.
 */
export async function crossSellCandidates() {
  return prisma.booking.findMany({
    where: {
      status: BOOKING_STATUS.qrSent,
      visitDate: { gte: startOfToday() },
      crossSellSentAt: null,
      emailOptOut: false,
      customerEmail: { not: '' },
    },
    orderBy: { visitDate: 'asc' },
    take: 200,
  });
}

/** The party prices, as the emails print them. */
export const FOLLOW_UP_PRICES = {
  adult: ADULT_PRICE_EUR_CENTS / 100,
  child: CHILD_PRICE_EUR_CENTS / 100,
};

/**
 * What this party costs TODAY, not what it cost when they walked away.
 *
 * `booking.totalAmount` is the figure quoted at the time, and for an unpaid
 * booking it is a quote that has expired. The adult price moved from 11.99 to
 * 12.99 on 19/08/2026, which put "1 adult × €12.99" above "Total €11.99" in
 * the same table — two different prices in one email, neither of them safe to
 * act on.
 *
 * The direction matters more than the mismatch. Whoever clicks through is
 * re-priced by the checkout and charged the current rate, so the stale total
 * advertised LESS than we would take. That is drip pricing, and these are EU
 * consumers who are owed the total payable up front.
 *
 * So the email quotes what the button will charge. It is the only number that
 * can still be true by the time they read it.
 */
export function currentTotalEur(booking: { adults: number; children: number }): number {
  return packTotalCents(booking.adults, booking.children) / 100;
}

export function resumeUrl(locale: string): string {
  return `${SITE_URL}/${locale || 'en'}/visitor-pack#checkout`;
}
