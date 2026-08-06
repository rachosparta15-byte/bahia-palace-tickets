/**
 * Guide access tokens — the signed proof that a device may open the offline
 * audio guide at guide.visitbahiapalace.com.
 *
 * WHY THIS EXISTS: the guide is a static site on a different origin. It has
 * no database and cannot ask "did this person pay?". Until now the only
 * protection was that `AUDIO_GUIDE_URL` was shown solely on a confirmed
 * booking — which is link-hiding, not access control. The URL is a constant,
 * it ships in the confirmation page's HTML, and one customer pasting it into
 * a review gives the paid product away permanently.
 *
 * A token signed here and verified by /api/guide/redeem closes that: the
 * guide will not open without a signature only this server can produce.
 *
 * WHAT IT IS AND IS NOT: this is Phase 1 — casual-sharing prevention. The
 * mp3s themselves remain individually fetchable by direct URL, and once the
 * guide has cached them they live unencrypted on the device forever. That is
 * inherent to the "works fully offline" promise, not an oversight. Stopping a
 * determined ripper needs signed audio URLs (Phase 2, see the note at the
 * bottom of this file); stopping a shared link needs only this.
 *
 * FORMAT: `<base64url(payload JSON)>.<base64url(HMAC-SHA256)>`
 * Compact enough to sit in a query string and be retyped from an email if it
 * comes to that. Deliberately NOT a JWT — no library, no algorithm-confusion
 * surface, no `alg: none` to get wrong.
 */

import { createHmac, timingSafeEqual } from 'crypto';

/** Bump when the payload shape changes; verify() refuses versions it predates. */
export const GUIDE_TOKEN_VERSION = 1;

/**
 * How long a token stays valid after the visit date.
 *
 * Generous on purpose, and the reason is the iOS failure mode this whole
 * design is shaped around: Safari evicts Cache Storage and localStorage after
 * roughly 7 days of non-use, taking the stored activation with it. A customer
 * whose phone forgets its activation has to redeem again — and the token in
 * their email is the only thing they still have. A token that expired the day
 * after the visit would turn a routine eviction into a support ticket.
 *
 * The leak window this opens is bounded by the activation cap in
 * /api/guide/redeem, which is the control that actually stops sharing.
 */
export const GUIDE_TOKEN_TTL_DAYS_AFTER_VISIT = 90;

const DAY_MS = 86_400_000;

export interface GuideTokenPayload {
  /** Format version. */
  v: number;
  /** Booking reference — the human-readable key the redeem route looks up. */
  ref: string;
  /** Party size. The activation cap is derived from this. */
  n: number;
  /** Visit date, YYYY-MM-DD. */
  d: string;
  /** Expiry, epoch SECONDS (not ms — keeps the token short). */
  e: number;
  /**
   * Token id, recorded on every GuideActivation row and used to group a
   * booking's activations into one budget.
   *
   * DERIVED, NOT RANDOM — and that is load-bearing. This module mints on
   * demand: once in `confirmBookingPaid()` for the email, and again on every
   * render of the confirmation page. A random nonce would make each of those
   * a *different* token id with its own fresh activation budget, so anyone
   * could reset the cap by reloading the page. Deriving it from the booking
   * reference makes every mint for a given booking produce the same id, and
   * therefore the same budget.
   *
   * To grant a customer a clean budget, delete their GuideActivation rows —
   * that is the deliberate, auditable reset, rather than a token reissue.
   */
  x: string;
}

export type GuideTokenFailure =
  | 'not_configured'
  | 'malformed'
  | 'bad_signature'
  | 'unsupported_version'
  | 'expired';

export type GuideTokenResult =
  | { ok: true; payload: GuideTokenPayload }
  | { ok: false; reason: GuideTokenFailure };

// ─── base64url ──────────────────────────────────────────────────────────

function b64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function unb64url(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

// ─── secret ─────────────────────────────────────────────────────────────

/**
 * The signing secret, or null when unset.
 *
 * Returns null rather than throwing because the caller that mints is inside
 * `confirmBookingPaid()`, where nothing may throw: a customer who has paid is
 * confirmed whether or not we can hand them a guide link. The UI degrades to
 * "access link pending" and the operator gets a loud log line.
 */
function secret(): string | null {
  const s = process.env.GUIDE_TOKEN_SECRET;
  if (!s || s.trim().length === 0) return null;
  // A short secret is worse than no secret, because it looks configured.
  if (s.trim().length < 24) {
    console.error(
      '[guide-token] GUIDE_TOKEN_SECRET is set but shorter than 24 characters. ' +
        'Refusing to use it. Generate one with: openssl rand -base64 32'
    );
    return null;
  }
  return s.trim();
}

/** True when tokens can actually be signed. Checked by callers before promising a link. */
export function guideTokenConfigured(): boolean {
  return secret() !== null;
}

function sign(payloadB64: string, key: string): string {
  return b64url(createHmac('sha256', key).update(payloadB64).digest());
}

// ─── mint ───────────────────────────────────────────────────────────────

export interface MintGuideTokenInput {
  /** Booking reference, e.g. "BP-7Q2K4M". */
  reference: string;
  /** Party size — becomes the activation budget. */
  partySize: number;
  /** Visit date as YYYY-MM-DD. */
  visitDate: string;
}

/**
 * The stable token id for a booking. Unguessable (it is an HMAC under the
 * signing secret) but reproducible, so repeated mints collapse onto one
 * activation budget. See the note on `GuideTokenPayload.x`.
 */
function tokenIdFor(reference: string, key: string): string {
  return b64url(createHmac('sha256', key).update(`guide-token-id:${reference}`).digest()).slice(0, 12);
}

/**
 * Sign a guide access token. Returns null when no secret is configured —
 * callers must treat that as "no link to offer", never as "let them in".
 *
 * DETERMINISTIC: the same booking always yields byte-identical output, so the
 * link in the confirmation email and the link on the confirmation page are
 * the same string. That is not cosmetic — it is what makes the activation cap
 * countable, and it means a customer comparing the two never wonders which
 * one is the real one.
 */
export function mintGuideToken(input: MintGuideTokenInput): string | null {
  const key = secret();
  if (!key) return null;

  const visitMs = Date.parse(`${input.visitDate}T00:00:00.000Z`);
  // A visit date we cannot parse must not produce a token that expired in
  // 1970. This is the one non-deterministic path, and only corrupt data
  // reaches it — checkout rejects past and malformed dates.
  const anchor = Number.isNaN(visitMs) ? Date.now() : visitMs;
  const expiryMs = anchor + GUIDE_TOKEN_TTL_DAYS_AFTER_VISIT * DAY_MS;

  const payload: GuideTokenPayload = {
    v: GUIDE_TOKEN_VERSION,
    ref: input.reference,
    n: input.partySize,
    d: input.visitDate,
    e: Math.floor(expiryMs / 1000),
    x: tokenIdFor(input.reference, key),
  };

  const body = b64url(Buffer.from(JSON.stringify(payload), 'utf8'));
  return `${body}.${sign(body, key)}`;
}

// ─── verify ─────────────────────────────────────────────────────────────

/**
 * Verify a token's signature, version and expiry.
 *
 * Signature is checked BEFORE the payload is parsed as anything meaningful,
 * and compared with `timingSafeEqual`. Everything downstream of an `ok: true`
 * may be trusted; nothing upstream of it may.
 */
export function verifyGuideToken(token: string | null | undefined): GuideTokenResult {
  const key = secret();
  if (!key) return { ok: false, reason: 'not_configured' };

  if (typeof token !== 'string' || token.length === 0 || token.length > 512) {
    return { ok: false, reason: 'malformed' };
  }

  const dot = token.indexOf('.');
  if (dot <= 0 || dot === token.length - 1) return { ok: false, reason: 'malformed' };

  const body = token.slice(0, dot);
  const provided = token.slice(dot + 1);
  if (!/^[A-Za-z0-9_-]+$/.test(body) || !/^[A-Za-z0-9_-]+$/.test(provided)) {
    return { ok: false, reason: 'malformed' };
  }

  const expected = sign(body, key);
  const a = Buffer.from(provided, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  // timingSafeEqual throws on length mismatch, which is itself an answer.
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: 'bad_signature' };
  }

  let payload: GuideTokenPayload;
  try {
    payload = JSON.parse(unb64url(body).toString('utf8')) as GuideTokenPayload;
  } catch {
    return { ok: false, reason: 'malformed' };
  }

  if (
    typeof payload !== 'object' ||
    payload === null ||
    typeof payload.ref !== 'string' ||
    typeof payload.n !== 'number' ||
    typeof payload.d !== 'string' ||
    typeof payload.e !== 'number' ||
    typeof payload.x !== 'string'
  ) {
    return { ok: false, reason: 'malformed' };
  }

  if (payload.v !== GUIDE_TOKEN_VERSION) return { ok: false, reason: 'unsupported_version' };
  if (Date.now() > payload.e * 1000) return { ok: false, reason: 'expired' };

  return { ok: true, payload };
}

// ─── link building ──────────────────────────────────────────────────────

/**
 * The guide URL with an access token attached, or null when none can be
 * minted. Callers render the "pending" state on null rather than falling back
 * to the bare URL — a bare URL is exactly the ungated link this replaces.
 */
export function buildGuideAccessUrl(base: string, input: MintGuideTokenInput): string | null {
  const token = mintGuideToken(input);
  if (!token) return null;
  const url = new URL(base);
  url.searchParams.set('k', token);
  return url.toString();
}

/*
 * ─── PHASE 2 HOOK (not implemented) ───────────────────────────────────
 *
 * Phase 1 gates the EXPERIENCE; the mp3s stay publicly fetchable. To gate
 * the ASSETS, the guide would stop loading `audio_x/<lang>/<id>.mp3` directly
 * and instead request each file through a signed URL. The seam is here:
 * `/api/guide/redeem` would return a short-lived asset-signing grant
 * alongside the activation, and a Vercel edge function in front of the audio
 * (the guide is on Vercel, so this is available) would verify it.
 *
 * The offline promise constrains the design: the grant has to be long-lived
 * enough that the service worker can cache every file under it in one pass,
 * because after that first pass there is no network to re-sign against.
 */
