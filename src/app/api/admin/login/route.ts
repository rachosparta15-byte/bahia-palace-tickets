import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { signAdminToken, ADMIN_COOKIE } from '@/lib/auth';
import { isRateLimited, recordFailedAttempt, clearAttempts, clientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  try {
    if (await isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many attempts. Try again in 15 minutes.' },
        { status: 429 },
      );
    }

    const { email, password } = await req.json() as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) {
      await recordFailedAttempt(ip);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      await recordFailedAttempt(ip);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await clearAttempts(ip);

    const token = await signAdminToken({ id: user.id, email: user.email, role: user.role });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   7 * 24 * 60 * 60,
      path:     '/',
    });
    return res;
  } catch (err) {
    console.error('[admin login]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
