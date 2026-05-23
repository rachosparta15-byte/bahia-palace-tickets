import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/auth';

async function auth() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return token && (await verifyAdminToken(token));
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await auth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json() as Partial<{ altText: string; title: string; caption: string; seoKeyword: string; order: number; published: boolean }>;
  const image = await prisma.galleryImage.update({ where: { id }, data: body });
  return NextResponse.json(image);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await auth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await prisma.galleryImage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
