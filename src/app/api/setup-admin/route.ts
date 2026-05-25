import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';

const SETUP_KEY = process.env.SETUP_KEY ?? '';

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!key || key !== SETUP_KEY || !SETUP_KEY) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const hash = await bcrypt.hash('Visa2001@@', 12);
  const existing = await prisma.adminUser.findUnique({ where: { email: 'rachosparta13@gmail.com' } });

  if (existing) {
    await prisma.adminUser.update({ where: { email: 'rachosparta13@gmail.com' }, data: { passwordHash: hash } });
    return NextResponse.json({ ok: true, action: 'updated' });
  }

  await prisma.adminUser.create({
    data: { email: 'rachosparta13@gmail.com', passwordHash: hash, name: 'Admin', role: 'admin' },
  });
  return NextResponse.json({ ok: true, action: 'created' });
}
