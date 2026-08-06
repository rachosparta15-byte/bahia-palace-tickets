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
  | 'server_error';

function fail(error: RedeemError, status: number, cors: Record<string, string>) {
  return NextResponse.json({ ok: false, error }, { status, headers: cors });
}

export async function POST(req: NextRequest) {
  const cors = corsHeaders(req.headers.get('origin'));

  try {
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return fail('bad_request', 400, cors);

    const { code, deviceId } = parsed.data;

    await ensureColumns();

    /*
     * 1. Does this code admit this device?
     *
     * Deliberately first. A wrong code and a stranger's device are both
     * refused before anything is read about a booking, so this endpoint cannot
     * be used to find out which booking references exist.
     */
    const verdict = await redeemGuideCode(code, deviceId);
    if (!verdict.ok) {
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
