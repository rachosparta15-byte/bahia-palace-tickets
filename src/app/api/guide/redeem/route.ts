/**
 * POST /api/guide/redeem — the audio guide's one and only online moment.
 *
 * The guide at guide.visitbahiapalace.com is a static site with no backend. It
 * calls this once, from the customer's device, the first time it is opened with
 * an access code. On success the device stores the activation locally and never
 * needs the network again, which is what keeps "works fully offline" true.
 *
 * ONE CODE, ONE DEVICE.
 *
 * This replaced a signed token plus a device cap. The signature proved the
 * booking was paid for, which turned out to be the easy half — a signature is
 * infinitely copyable, so the token in a customer's email opened the guide for
 * everyone they forwarded it to, and nothing in the token could tell them
 * apart. The cap then tried to limit the damage by counting devices, which
 * meant every honest customer whose phone cleared its storage spent a slot.
 *
 * A code is a row, so it can simply remember which device claimed it. First
 * device in keeps it, and is admitted every time afterwards with no expiry and
 * no budget to run down at the palace gate. Any other device is refused. A
 * booking for four gets four codes, so a family is not fighting over one, and
 * forwarding a link outside the party costs the sender their own access —
 * whoever opens it first claims it.
 *
 * Two things fell out of the change that are worth knowing. There is no shared
 * secret any more, so this can no longer be broken by an unset environment
 * variable. And nothing expires, so a guide bought in March still opens in
 * September.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { ensureColumns } from '@/lib/db/ensure-columns';
import { redeemGuideCode } from '@/lib/guide-access';
import { normaliseGuideCode } from '@/lib/guide-code';
import { BOOKING_STATUS } from '@/lib/booking-lifecycle';

// Nothing here may be cached, and Prisma needs Node.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  /**
   * The code from the `?k=` parameter. The length is generous because the
   * customer never types it — dashes, spacing and case are normalised
   * downstream by `normaliseGuideCode`.
   */
  code: z.string().min(8).max(64),
  /**
   * Random id the guide generates and keeps in localStorage. Opaque to us: it
   * is a lock, not an identity, and deliberately carries nothing that could
   * fingerprint a person.
   */
  deviceId: z.string().regex(/^[A-Za-z0-9_-]{8,64}$/, 'Invalid device id'),
});

// ─── CORS ───────────────────────────────────────────────────────────────

/**
 * The guide is a different origin, so this route is the one place on the site
 * that must answer cross-origin requests. The allowlist is exact — no wildcard,
 * no suffix matching that `guide.visitbahiapalace.com.evil.tld` would slip
 * through.
 */
function allowedOrigins(): string[] {
  const configured = process.env.GUIDE_ORIGIN?.trim();
  const origins = [configured || 'https://guide.visitbahiapalace.com'];

  // Local development only: lets the guide be served from a static file server
  // on a different port while testing the gate end to end.
  if (process.env.NODE_ENV !== 'production') {
    origins.push(
      'http://localhost:3000',
      'http://localhost:5500',
      'http://localhost:8080',
      'http://127.0.0.1:5500',
      'http://127.0.0.1:8080'
    );
  }
  return origins;
}

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = allowedOrigins();
  // Echo the origin only when it matches; otherwise send no CORS header at all
  // and let the browser block the response.
  if (!origin || !allowed.includes(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Vary': 'Origin',
  };
}

export async function OPTIONS(req: NextRequest) {
  const headers = corsHeaders(req.headers.get('origin'));
  if (!headers['Access-Control-Allow-Origin']) {
    return new NextResponse(null, { status: 403 });
  }
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...headers,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// ─── POST ───────────────────────────────────────────────────────────────

type RedeemError =
  | 'bad_request'
  | 'unknown_code'
  | 'other_device'
  | 'not_found'
  | 'not_paid'
  | 'revoked'
  | 'too_many_attempts'
  | 'server_error';

function fail(error: RedeemError, status: number, cors: Record<string, string>) {
  return NextResponse.json({ ok: false, error }, { status, headers: cors });
}

/**
 * Failed-attempt accounting, kept in the same database as everything else.
 *
 * Written with raw SQL and CREATE TABLE IF NOT EXISTS rather than a Prisma
 * model, because this project deploys by pushing schema and a throttle that
 * only starts working after the next migration is not a throttle.
 */
const FAILURE_WINDOW_MINUTES = 10;
const MAX_FAILURES = 20;

async function attemptsTable() {
  await prisma.$executeRawUnsafe(
    `CREATE TABLE IF NOT EXISTS GuideAttempt (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       ip TEXT NOT NULL,
       at TEXT NOT NULL
     )`,
  );
}

async function tooManyFailures(ip: string): Promise<boolean> {
  try {
    await attemptsTable();
    const since = new Date(Date.now() - FAILURE_WINDOW_MINUTES * 60_000).toISOString();
    const rows = await prisma.$queryRawUnsafe<{ n: number | bigint }[]>(
      `SELECT COUNT(*) AS n FROM GuideAttempt WHERE ip = ? AND at > ?`,
      ip,
      since,
    );
    return Number(rows?.[0]?.n ?? 0) >= MAX_FAILURES;
  } catch (error) {
    // A limiter that cannot read its own table must not become the reason a
    // paying visitor is refused. Log it and let the code itself decide.
    console.error('[guide/redeem] rate-limit check failed; allowing', error);
    return false;
  }
}

/**
 * Does this device already hold a redeemed code?
 *
 * The exemption that keeps a throttled hotel or coach party from locking out
 * the customers sitting behind the same address. An attacker cannot invent a
 * deviceId that owns a row, so this cannot be used to bypass the limit.
 */
async function deviceHoldsAnyCode(deviceId: string): Promise<boolean> {
  try {
    const rows = await prisma.$queryRawUnsafe<{ n: number | bigint }[]>(
      `SELECT COUNT(*) AS n FROM GuideCode WHERE deviceId = ?`,
      deviceId,
    );
    return Number(rows?.[0]?.n ?? 0) > 0;
  } catch (error) {
    // Same rule as the limiter itself: a query that cannot run must not be the
    // reason a paying visitor is refused.
    console.error('[guide/redeem] device lookup failed; not exempting', error);
    return false;
  }
}

/**
 * Compares without leaking how much of the string matched.
 *
 * `===` returns at the first differing character, so its timing measures how
 * many leading characters were right — enough, over many attempts, to recover
 * a secret one character at a time.
 */
function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function recordFailure(ip: string): Promise<void> {
  await attemptsTable();
  const now = new Date();
  await prisma.$executeRawUnsafe(
    `INSERT INTO GuideAttempt (ip, at) VALUES (?, ?)`,
    ip,
    now.toISOString(),
  );
  // The table is only ever read over a ten-minute window; older rows are dead
  // weight in a database we pay for.
  await prisma.$executeRawUnsafe(
    `DELETE FROM GuideAttempt WHERE at < ?`,
    new Date(now.getTime() - 24 * 60 * 60_000).toISOString(),
  );
}

export async function POST(req: NextRequest) {
  const cors = corsHeaders(req.headers.get('origin'));

  try {
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return fail('bad_request', 400, cors);

    const { code, deviceId } = parsed.data;

    await ensureColumns();

    /*
     * 0. Has this address been guessing?
     *
     * tooManyFailures and recordFailure were written for this endpoint and
     * then never called from it — twenty lines of throttle, a table, a
     * cleanup query, and nothing reaching any of it. An eight-character code
     * is only safe because of a limit on guesses, and there was no limit.
     *
     * The exemption matches the hub's, for the reason production taught it
     * there: hotel wifi and coach parties put dozens of visitors behind one
     * address, so twenty wrong guesses by a stranger would otherwise lock out
     * everyone sharing it — the exact failure this exists to prevent. A device
     * that already holds a code is not guessing.
     */
    const ip =
      req.headers.get('cf-connecting-ip') ??
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      '';
    if (ip && (await tooManyFailures(ip)) && !(await deviceHoldsAnyCode(deviceId))) {
      return fail('too_many_attempts', 429, cors);
    }

    /*
     * 0b. The owner's own key.
     *
     * Customer codes bind to the first device that redeems them and stay there
     * forever, which leaves the person who has to check these guides on a
     * laptop, a phone and a borrowed tablet with one look per device. This one
     * claims no device, is never spent, and belongs to no booking.
     *
     * Same value as the hub's, so one key opens all three guides — Bahia's
     * runs on its own endpoint because its guide predates the shared backend,
     * and a key that worked on two of the three would be a key nobody trusts.
     *
     * Shaped like a real code and normalised the same way, because the guide's
     * input is built for XXXX-XXXX: a forty-character version of this was
     * rejected by the page before it ever reached a server. Checked after the
     * throttle above, which is what protects eight characters from being
     * ground down.
     */
    const master = normaliseGuideCode(process.env.MASTER_GUIDE_CODE);
    const offered = normaliseGuideCode(code);
    if (master && offered && constantTimeEquals(offered, master)) {
      console.info(
        `[guide/redeem] MASTER key used from ${ip || 'unknown ip'} ` +
          `(device ${deviceId.slice(0, 12)}…)`,
      );
      return NextResponse.json(
        { ok: true, state: 'returning', reference: 'OWNER-ACCESS', seat: 1 },
        { headers: cors },
      );
    }

    /*
     * 1. Does this code admit this device?
     *
     * Deliberately first. A wrong code and a stranger's device are both
     * refused before anything is read about a booking, so this endpoint cannot
     * be used to find out which booking references exist.
     */
    const verdict = await redeemGuideCode(code, deviceId);
    if (!verdict.ok) {
      // Only wrong guesses count against the limit above. A returning device
      // being refused for any other reason must not spend someone else's
      // allowance on a shared address.
      if (ip && verdict.reason === 'unknown_code') {
        await recordFailure(ip).catch(() => {});
      }
      return fail(verdict.reason, verdict.reason === 'unknown_code' ? 404 : 403, cors);
    }

    /*
     * 2. Does the booking still entitle them?
     *
     * Holding a code proves one was issued against a paid booking. It does not
     * prove the booking is still good — a refunded customer keeps their email,
     * and their link with it.
     */
    const booking = await prisma.booking.findFirst({
      where: { reference: verdict.reference },
      select: { status: true, reference: true },
    });

    if (!booking) return fail('not_found', 404, cors);
    if (booking.status === BOOKING_STATUS.cancelled) return fail('revoked', 403, cors);
    if (
      booking.status !== BOOKING_STATUS.paidAwaitingQr &&
      booking.status !== BOOKING_STATUS.qrSent
    ) {
      return fail('not_paid', 403, cors);
    }

    return NextResponse.json(
      { ok: true, state: verdict.state, reference: booking.reference, seat: verdict.seat },
      { headers: cors }
    );
  } catch (err) {
    console.error('[POST /api/guide/redeem]', err);
    return fail('server_error', 500, cors);
  }
}
