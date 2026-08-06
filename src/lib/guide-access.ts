import prisma from '@/lib/db';
import { generateGuideCode, normaliseGuideCode, seatCount } from '@/lib/guide-code';

/**
 * Issuing and redeeming audio guide access codes.
 *
 * Split from guide-code.ts on purpose: that file is pure string and randomness
 * work with no database in it, so it can be reasoned about and tested on its
 * own. Everything here touches rows.
 */

export type RedeemOutcome =
  | { ok: true; state: 'claimed' | 'returning'; reference: string; seat: number }
  | { ok: false; reason: 'unknown_code' | 'other_device' };

/**
 * Gives a booking one code per seat. Safe to call again.
 *
 * Idempotent because it will be called again — from the confirmation page, from
 * a webhook retry, from support re-sending an email. It counts what exists and
 * tops up, so a booking never ends up with eight codes because Stripe delivered
 * the same event twice. It never deletes: a code already claimed by a customer's
 * phone must survive anything that re-runs this.
 */
export async function issueGuideCodes(booking: {
  id: string;
  reference: string;
  adults: number;
  children: number;
}): Promise<string[]> {
  const wanted = seatCount(booking.adults, booking.children);

  const existing = await prisma.guideCode.findMany({
    where: { bookingId: booking.id },
    orderBy: { seat: 'asc' },
  });
  if (existing.length >= wanted) return existing.map((row) => row.code);

  const created: string[] = [];
  for (let seat = existing.length + 1; seat <= wanted; seat++) {
    /*
     * Retry on collision rather than trusting 80 bits blindly. The odds are
     * negligible; the cost of being wrong is one customer holding a code that
     * silently belongs to a different booking, which is not a bug anyone would
     * find quickly.
     */
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateGuideCode();
      try {
        await prisma.guideCode.create({
          data: { code, bookingId: booking.id, reference: booking.reference, seat },
        });
        created.push(code);
        break;
      } catch (error) {
        const isCollision =
          typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
        if (!isCollision || attempt === 4) throw error;
      }
    }
  }

  return [...existing.map((row) => row.code), ...created];
}

/**
 * Decides whether this device may open this code.
 *
 * Three outcomes and no fourth. An unclaimed code binds to the device asking.
 * The bound device is let back in every time — that is the whole promise, and
 * it has no expiry, no counter and nothing that can run out while somebody is
 * standing outside the palace with a phone. Any other device is refused.
 *
 * The claim is written with a `deviceId: null` guard rather than a read
 * followed by a write, so two devices opening the same fresh link in the same
 * second cannot both be told yes. Whichever update matches a row wins; the
 * other finds the code already bound and falls through to the refusal.
 */
export async function redeemGuideCode(
  rawCode: string | null | undefined,
  deviceId: string,
): Promise<RedeemOutcome> {
  const code = normaliseGuideCode(rawCode);
  if (!code) return { ok: false, reason: 'unknown_code' };

  const row = await prisma.guideCode.findUnique({ where: { code } });
  if (!row) return { ok: false, reason: 'unknown_code' };

  if (row.deviceId === deviceId) {
    await prisma.guideCode.update({
      where: { id: row.id },
      data: { lastSeenAt: new Date() },
    });
    return { ok: true, state: 'returning', reference: row.reference, seat: row.seat };
  }

  if (row.deviceId === null) {
    const now = new Date();
    const claimed = await prisma.guideCode.updateMany({
      where: { id: row.id, deviceId: null },
      data: { deviceId, claimedAt: now, lastSeenAt: now },
    });
    if (claimed.count === 1) {
      return { ok: true, state: 'claimed', reference: row.reference, seat: row.seat };
    }
  }

  return { ok: false, reason: 'other_device' };
}

/**
 * Support's escape hatch: unbind a code so the customer's phone can claim it
 * again after losing its storage.
 *
 * Deliberately manual. iOS clears site storage after about a week of not being
 * opened, which makes a real customer's phone look like a stranger's, and no
 * automatic rule can tell that case from a shared link — both are "a device I
 * have not seen before". So a person decides, and `unlockCount` keeps the score:
 * one unlock is an unlucky customer, five on the same code is a link doing the
 * rounds.
 */
export async function unlockGuideCode(code: string): Promise<boolean> {
  const normalised = normaliseGuideCode(code);
  if (!normalised) return false;

  const cleared = await prisma.guideCode.updateMany({
    where: { code: normalised },
    data: { deviceId: null, claimedAt: null, unlockedAt: new Date() },
  });
  if (cleared.count !== 1) return false;

  await prisma.guideCode.update({
    where: { code: normalised },
    data: { unlockCount: { increment: 1 } },
  });
  return true;
}
