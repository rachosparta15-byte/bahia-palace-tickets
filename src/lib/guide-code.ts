import { randomBytes } from 'crypto';

/**
 * Access codes for the audio guide — one code per seat, one seat per device.
 *
 * WHY A CODE AND NOT THE SIGNED TOKEN IT REPLACES
 *
 * The signed token proved a booking had been paid for, and let any device
 * holding it in. Proving payment turned out to be the easy half. A signature is
 * infinitely copyable: the token in one customer's email opens the guide for
 * everyone they forward it to, and nothing in the signature can tell the two
 * apart. A code is different only in that it is a *row*, so it can remember
 * which device claimed it and refuse the rest.
 *
 * ONE CODE, ONE DEVICE, FOR GOOD. The first device to open a code owns it. That
 * device is admitted every time afterwards with no further checks, which is what
 * keeps the guide usable offline and on the day of the visit. Any other device
 * presenting the same code is refused — not rate-limited, refused.
 *
 * A booking for four people gets four codes and four links, so a family is not
 * fighting over one. Sharing a link outside the party costs the sharer their own
 * access, because the stranger's device claims the code first.
 *
 * NOBODY TYPES THIS. Each code travels inside its own link and fills itself in.
 * The formatting below exists for the times a human has to read one aloud to
 * support, not for the customer's thumbs — which is why it can afford to be 80
 * bits rather than the six characters a typed code would have to be.
 */

/**
 * Crockford base32: no I, L, O or U.
 *
 * The first three are dropped because they are unreadable next to 1 and 0 in
 * most fonts; U is dropped because removing it means no random code can spell
 * an obscenity. `normaliseCode` maps the confusable characters back, so a
 * support agent who hears "oh" and types O still lands on 0.
 */
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/** 16 characters of base32 is 80 bits. Guessing one is not a strategy. */
const CODE_LENGTH = 8;

/**
 * Lengths this will still read back.
 *
 * New codes are eight characters. Sixteen is here because that is what this
 * guide generated before, and refusing a code we ourselves issued — to someone
 * standing in the palace holding the email — is the one failure that is never
 * worth the tidiness. Generation only ever produces the short form; this list
 * is purely about being able to honour our own past.
 */
const ACCEPTED_LENGTHS = [CODE_LENGTH, 16];

/** Groups of four, dashed — the shape people can read back without losing place. */
const GROUP = 4;

/**
 * Generates one code.
 *
 * Rejection sampling rather than `% 32`: a byte is 256 values and 256 is a clean
 * multiple of 32, so modulo would in fact be uniform here — but it stops being
 * uniform the moment somebody changes the alphabet length, and that is a silent
 * bias in a security token. Drawing again costs nothing.
 */
export function generateGuideCode(): string {
  const chars: string[] = [];
  while (chars.length < CODE_LENGTH) {
    for (const byte of randomBytes(CODE_LENGTH)) {
      if (byte >= 256 - (256 % ALPHABET.length)) continue;
      chars.push(ALPHABET[byte % ALPHABET.length]);
      if (chars.length === CODE_LENGTH) break;
    }
  }
  return chars.join('');
}

/** `K7M29QX43TWBH5NP` → `K7M2-9QX4-3TWB-H5NP`. Display only; never stored. */
export function formatGuideCode(code: string): string {
  return (code.match(new RegExp(`.{1,${GROUP}}`, 'g')) ?? []).join('-');
}

/**
 * Canonical form for lookup: uppercase, no separators, confusables folded.
 *
 * Returns null rather than a wrong-length string so a caller cannot accidentally
 * query with a fragment. Everything stored and compared goes through here.
 */
export function normaliseGuideCode(input: string | null | undefined): string | null {
  if (!input) return null;
  const cleaned = input
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, '')
    .replace(/[IL]/g, '1')
    .replace(/O/g, '0')
    .replace(/U/g, 'V');
  return ACCEPTED_LENGTHS.includes(cleaned.length) ? cleaned : null;
}

/**
 * The link a customer taps. The code is the whole credential, so this URL is
 * as sensitive as a password and belongs only in the customer's own email.
 */
export function buildGuideCodeUrl(base: string, code: string): string {
  const url = new URL(base);
  url.searchParams.set('k', formatGuideCode(code));
  return url.toString();
}

/**
 * How many codes a booking gets: one per person who was charged.
 *
 * That is adults plus children, because children aged 7 to 13 pay the same
 * €13.99 — the ministry charges 50 MAD for them at the gate and the pack is a
 * flat per-person price. Children under 7 enter free and are never entered on
 * the form, so they never reach this function.
 *
 * This briefly returned `adults` only, from when children were free. The price
 * changed and this did not, so a family of two adults and a ten-year-old paid
 * for three seats and received two links. Nothing failed and nothing logged —
 * the third person simply had no guide, which is the kind of shortfall a
 * customer discovers standing in the palace.
 */
export function seatCount(adults: number, children: number): number {
  return Math.max(1, (adults || 0) + (children || 0));
}

