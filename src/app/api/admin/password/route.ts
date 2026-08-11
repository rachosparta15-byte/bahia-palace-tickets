import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import prisma from '@/lib/db';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Changes the signed-in admin's own password.
 *
 * Built as a feature rather than run as a one-off script because a password
 * gets changed more than once — when someone leaves, when it has been typed
 * into the wrong window, or on a schedule — and each of those is a bad moment
 * to be pasting production database credentials into a terminal.
 *
 * IT CHANGES ONLY THE CALLER'S OWN PASSWORD. The account is taken from the
 * session cookie, never from the request body: a body that named an account
 * would let any signed-in admin reset any other admin's password, including
 * one more privileged than their own.
 *
 * The current password is required even though the session already proves who
 * they are. The session is a cookie on a laptop; the password is knowledge.
 * Without that check, anyone who sat down at an unlocked machine could lock
 * the real owner out of their own site in two clicks.
 */

const schema = z.object({
  currentPassword: z.string().min(1).max(200),
  // 12, not 8. This account can read every customer's name, email, phone and
  // travel dates, and issue refunds. An eight-character password on a public
  // login page is guessable at leisure.
  newPassword: z.string().min(12).max(200),
});

export async function POST(request: NextRequest) {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  const session = token ? await verifyAdminToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: 'unauthorised' }, { status: 401 });
  }

  let parsed;
  try {
    parsed = schema.safeParse(await request.json());
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  if (!parsed.success) {
    const tooShort = parsed.error.issues.some((i) => i.path[0] === 'newPassword');
    return NextResponse.json(
      { error: tooShort ? 'password_too_short' : 'invalid_field' },
      { status: 400 },
    );
  }

  const { currentPassword, newPassword } = parsed.data;

  const user = await prisma.adminUser.findUnique({ where: { id: session.id } });
  if (!user) {
    return NextResponse.json({ error: 'unauthorised' }, { status: 401 });
  }

  if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
    // Deliberately not distinguished from any other failure in the UI copy —
    // but logged here, because repeated failures on this route are somebody
    // guessing at a keyboard that is already signed in.
    console.error(`[admin] wrong current password for ${user.email}`);
    return NextResponse.json({ error: 'wrong_password' }, { status: 403 });
  }

  if (await bcrypt.compare(newPassword, user.passwordHash)) {
    return NextResponse.json({ error: 'same_password' }, { status: 400 });
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(newPassword, 12) },
  });

  console.log(`[admin] password changed for ${user.email}`);

  /*
   * The session is left alone on purpose.
   *
   * Tokens here are signed with NEXTAUTH_SECRET and carry no password hash, so
   * an old session is not invalidated by this change. Signing the caller out
   * would look like security but only inconveniences the person who just
   * proved they know the password — anyone else's stolen session survives
   * either way. Ending every session needs NEXTAUTH_SECRET rotated instead,
   * which is a deploy, not a form submit.
   */
  return NextResponse.json({ ok: true });
}
