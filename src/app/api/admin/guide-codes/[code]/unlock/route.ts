import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/auth';
import { unlockGuideCode } from '@/lib/guide-access';

/**
 * POST /api/admin/guide-codes/[code]/unlock — release a code from its device.
 *
 * The one escape hatch in a system that is otherwise deliberately absolute: a
 * code belongs to the first phone that opens it, forever, and every other
 * device is refused.
 *
 * That is right almost always and wrong in one case. iOS clears site storage
 * after roughly a week of not being opened, which takes the guide's device id
 * with it — so a customer who bought two weeks before their trip and opens the
 * guide at the palace gate can arrive looking like a stranger holding somebody
 * else's link. No automatic rule can separate that from a link that was
 * forwarded, because both are "a device I have not seen before".
 *
 * So a person decides, and the decision is counted. `unlockCount` on the row is
 * the signal: one unlock is an unlucky customer, five on the same code is a
 * link doing the rounds and worth a conversation before the sixth.
 *
 * Deliberately not exposed to customers. A self-service unlock button is just
 * the device cap again, with extra steps.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { code } = await params;
  const released = await unlockGuideCode(decodeURIComponent(code));

  if (!released) {
    // Either no such code, or it was already unclaimed. Both are "nothing to
    // do" from the operator's side, and neither is worth a different screen.
    return NextResponse.json({ error: 'not_found_or_already_free' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
