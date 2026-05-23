import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/auth';

async function auth() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return token && (await verifyAdminToken(token));
}

export async function GET() {
  if (!(await auth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const images = await prisma.galleryImage.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
  return NextResponse.json(images);
}

export async function POST(req: Request) {
  if (!(await auth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json() as { url: string; altText: string; title: string; caption?: string; seoKeyword?: string; order?: number };
  if (!body.url || !body.altText || !body.title) {
    return NextResponse.json({ error: 'url, altText and title are required' }, { status: 400 });
  }
  const image = await prisma.galleryImage.create({
    data: {
      url: body.url,
      altText: body.altText,
      title: body.title,
      caption: body.caption ?? null,
      seoKeyword: body.seoKeyword ?? null,
      order: body.order ?? 0,
    },
  });
  return NextResponse.json(image, { status: 201 });
}
