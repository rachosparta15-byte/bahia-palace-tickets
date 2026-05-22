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
  const reviews = await prisma.review.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { authorName, authorImg, country, rating, body, locale, published, order } = await req.json() as {
    authorName: string; authorImg?: string; country?: string; rating?: number;
    body: string; locale: string; published?: boolean; order?: number;
  };
  if (!authorName?.trim() || !body?.trim() || !locale?.trim()) {
    return NextResponse.json({ error: 'authorName, body and locale are required' }, { status: 400 });
  }
  const review = await prisma.review.create({
    data: {
      authorName: authorName.trim(),
      authorImg:  authorImg?.trim() ?? null,
      country:    country?.trim()   ?? null,
      rating:     rating  ?? 5,
      body:       body.trim(),
      locale:     locale.trim(),
      published:  published ?? true,
      order:      order ?? 0,
    },
  });
  return NextResponse.json(review, { status: 201 });
}
