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
 * Twenty minutes, and it was four hours. The owner's objection is the one that
 * matters: somebody who could not finish here has an afternoon in which to buy
 * the same ticket from somebody else, and a reminder that arrives after they
 * already have one is not a reminder, it is an apology.
 *
 * The cost of the short window is real and is not pretended away. PayPal's own
 * flow can legitimately take this long — a 3-D Secure challenge, a phone
 * leaving the browser for an SMS code — so a row can appear here while its
 * owner is still, genuinely, paying. Two things hold that in check:
 *
 *   NOTHING SENDS ON A SCHEDULE. An operator reads this list and presses a
 *   button. The judgement that a machine could not make at twenty minutes is
 *   made by a person who can see how long ago each row started.
 *
 *   Rows younger than STILL_PAYING_MINUTES are flagged, so "this one may still
 *   be at PayPal" is on screen rather than in someone's memory.
 *
 * Anyone who does complete payment leaves this list on their own: the status
 * stops being `pending` and the query no longer matches them.
 */
export const ABANDONED_AFTER_MINUTES = 20;

/**
 * Below this age, a row is more likely mid-payment than abandoned.
 *
 * It does not exclude anybody — excluding would put the four-hour wait back by
 * another name. It marks them, and the operator decides.
 */
export const STILL_PAYING_MINUTES = 45;

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
/**
 * One row per person, not one per abandoned attempt.
 *
 * Somebody who tried twice has two pending bookings, and the list treated them
 * as two people: a real customer with two identical rows — same name, same
 * address, same date, three adults — was about to receive the same email
 * twice. From the reader's side that is not a reminder, it is a mailing list
 * that has lost track of them.
 *
 * The newest attempt wins. It is the one they walked away from most recently,
 * so it carries the date and party they last chose; an older row may quote a
 * visit they have already changed their mind about.
 *
 * `emailsOf` returns every address in the group so the send can stamp all of
 * them. Stamping only the row that was emailed would leave its siblings
 * eligible, and they would surface as a fresh "new" candidate tomorrow.
 */
function newestPerEmail<T extends { customerEmail: string; createdAt: Date }>(rows: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  // Sorted here rather than relied upon: the caller's ORDER BY is for display
  // and could reasonably change without anybody thinking about this.
  for (const row of [...rows].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())) {
    const key = row.customerEmail.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

export async function abandonedCandidates() {
  const cutoff = new Date(Date.now() - ABANDONED_AFTER_MINUTES * 60 * 1000);
  const rows = await prisma.booking.findMany({
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
  return newestPerEmail(rows);
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
  const rows = await prisma.booking.findMany({
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
  // Same rule as the reminder: a family who bought twice is one household with
  // one inbox, and "the other two monuments are a short walk away" does not
  // become more true for being said again.
  return newestPerEmail(rows);
}

/**
 * Every eligible row sharing an address, so a send can stamp all of them.
 *
 * The list shows one row per person; the database still holds the others. If
 * only the emailed row is marked, its siblings stay eligible and reappear as
 * fresh candidates — the same person, offered up again tomorrow.
 */
export function siblingIds<T extends { id: string; customerEmail: string }>(rows: T[], chosen: T): string[] {
  const key = chosen.customerEmail.trim().toLowerCase();
  return rows.filter((r) => r.customerEmail.trim().toLowerCase() === key).map((r) => r.id);
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
