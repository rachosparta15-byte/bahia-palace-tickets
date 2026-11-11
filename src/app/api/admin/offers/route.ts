import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { ensureColumns } from '@/lib/db/ensure-columns';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/auth';

async function requireAdmin() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return token ? await verifyAdminToken(token) : null;
}

/**
 * POST /api/admin/offers
 *   { section: 'featured' | 'grid' }            → adds a new card at the end
 *   { order: [{ id, sortOrder }, …] }            → saves a new order
 */
export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await ensureColumns();
  const body = (await req.json().catch(() => ({}))) as {
    section?: string;
    order?: Array<{ id: string; sortOrder: number }>;
  };

  if (Array.isArray(body.order)) {
    for (const item of body.order) {
      if (typeof item?.id !== 'string' || !Number.isFinite(item.sortOrder)) continue;
      await prisma.offerCard.update({ where: { id: item.id }, data: { sortOrder: Math.round(item.sortOrder) } });
    }
    revalidatePath('/', 'layout');
    return NextResponse.json({ ok: true });
  }

  if (body.section !== 'featured' && body.section !== 'grid') {
    return NextResponse.json({ error: 'section must be featured or grid' }, { status: 400 });
  }
  const last = await prisma.offerCard.findFirst({
    where: { section: body.section },
    orderBy: { sortOrder: 'desc' },
  });
  const card = await prisma.offerCard.create({
    data: {
      section: body.section,
      productKey: null,
      sortOrder: (last?.sortOrder ?? 0) + 1,
      // A new card starts hidden, so the site never shows a half-filled one.
      hidden: true,
      title: 'New offer',
    },
  });
  revalidatePath('/', 'layout');
  return NextResponse.json({ id: card.id });
}
