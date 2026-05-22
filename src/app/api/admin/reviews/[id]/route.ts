import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/auth';

async function requireAdmin() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return token ? await verifyAdminToken(token) : null;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json() as {
    authorName?: string; authorImg?: string; country?: string;
    rating?: number; body?: string; locale?: string; published?: boolean; order?: number;
  };
  const review = await prisma.review.update({
    where: { id },
    data: {
      ...(body.authorName !== undefined && { authorName: body.authorName }),
      ...(body.authorImg  !== undefined && { authorImg:  body.authorImg }),
      ...(body.country    !== undefined && { country:    body.country }),
      ...(body.rating     !== undefined && { rating:     body.rating }),
      ...(body.body       !== undefined && { body:       body.body }),
      ...(body.locale     !== undefined && { locale:     body.locale }),
      ...(body.published  !== undefined && { published:  body.published }),
      ...(body.order      !== undefined && { order:      body.order }),
    },
  });
  return NextResponse.json(review);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
