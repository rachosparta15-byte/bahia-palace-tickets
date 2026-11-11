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

const TEXT_FIELDS = [
  'title', 'tagline', 'duration', 'includes', 'note', 'price', 'priceNote',
  'buttonUrl', 'imageUrl', 'ribbon', 'badge',
] as const;

/** Only http(s) links, or a path on this site. Anything else is refused. */
function safeUrl(value: string): boolean {
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try {
    const u = new URL(value);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

/** PATCH /api/admin/offers/:id — saves the card. Empty text means "keep the site's default". */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await ensureColumns();
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  const data: Record<string, unknown> = {};
  for (const key of TEXT_FIELDS) {
    if (!(key in body)) continue;
    const raw = body[key];
    const value = typeof raw === 'string' ? raw.trim() : '';
    if ((key === 'buttonUrl' || key === 'imageUrl') && value && !safeUrl(value)) {
      return NextResponse.json({ error: `${key === 'buttonUrl' ? 'Button link' : 'Photo'} must start with https:// or /` }, { status: 400 });
    }
    data[key] = value.length > 0 ? value : null;
  }
  if (typeof body.hidden === 'boolean') data.hidden = body.hidden;
  if (typeof body.sortOrder === 'number' && Number.isFinite(body.sortOrder)) data.sortOrder = Math.round(body.sortOrder);

  const card = await prisma.offerCard.update({ where: { id }, data });
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true, card });
}

/**
 * DELETE /api/admin/offers/:id
 * A card the owner added is removed. A built-in card cannot be removed (the
 * site would fall back to it anyway); it is reset to the site's defaults.
 */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await ensureColumns();
  const { id } = await params;
  const card = await prisma.offerCard.findUnique({ where: { id } });
  if (!card) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (card.productKey) {
    const cleared = Object.fromEntries(TEXT_FIELDS.map((k) => [k, null]));
    await prisma.offerCard.update({ where: { id }, data: { ...cleared, hidden: false } });
  } else {
    await prisma.offerCard.delete({ where: { id } });
  }
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
