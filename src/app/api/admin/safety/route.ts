import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/auth';

async function requireAdmin() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return token ? await verifyAdminToken(token) : null;
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const tips = await prisma.safetyTip.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(tips);
}

export async function POST(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { title, body, icon, published, order } = await req.json() as {
    title: string; body: string; icon?: string; published?: boolean; order?: number;
  };
  if (!title?.trim() || !body?.trim()) {
    return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
  }
  const tip = await prisma.safetyTip.create({
    data: { title: title.trim(), body: body.trim(), icon: icon ?? 'warning', published: published ?? false, order: order ?? 0 },
  });
  return NextResponse.json(tip, { status: 201 });
}
