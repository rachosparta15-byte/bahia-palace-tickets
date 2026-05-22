import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/auth';

async function requireAdmin() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return token ? await verifyAdminToken(token) : null;
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { slug } = await params;
  const ticket = await prisma.ticketType.findUnique({ where: { slug } });
  if (!ticket) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(ticket);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { slug } = await params;
  const body = await req.json() as {
    priceAdult?: number;
    priceChild?: number;
    images?: string;
    available?: boolean;
    nameEn?: string; nameFr?: string; nameIt?: string; nameDe?: string; nameEs?: string;
    descEn?: string; descFr?: string; descIt?: string; descDe?: string; descEs?: string;
    durationMins?: number;
    maxPerDay?: number | null;
  };

  const ticket = await prisma.ticketType.update({
    where: { slug },
    data: {
      ...(body.priceAdult   !== undefined && { priceAdult:   body.priceAdult }),
      ...(body.priceChild   !== undefined && { priceChild:   body.priceChild }),
      ...(body.images       !== undefined && { images:       body.images }),
      ...(body.available    !== undefined && { available:    body.available }),
      ...(body.nameEn       !== undefined && { nameEn:       body.nameEn }),
      ...(body.nameFr       !== undefined && { nameFr:       body.nameFr }),
      ...(body.nameIt       !== undefined && { nameIt:       body.nameIt }),
      ...(body.nameDe       !== undefined && { nameDe:       body.nameDe }),
      ...(body.nameEs       !== undefined && { nameEs:       body.nameEs }),
      ...(body.descEn       !== undefined && { descEn:       body.descEn }),
      ...(body.descFr       !== undefined && { descFr:       body.descFr }),
      ...(body.descIt       !== undefined && { descIt:       body.descIt }),
      ...(body.descDe       !== undefined && { descDe:       body.descDe }),
      ...(body.descEs       !== undefined && { descEs:       body.descEs }),
      ...(body.durationMins !== undefined && { durationMins: body.durationMins }),
      ...(body.maxPerDay    !== undefined && { maxPerDay:    body.maxPerDay }),
    },
  });
  return NextResponse.json(ticket);
}
