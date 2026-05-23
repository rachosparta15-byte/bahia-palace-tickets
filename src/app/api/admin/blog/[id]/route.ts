import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/auth';
import { validateSlug, validateTitle, validateContentForPublish } from '@/lib/blog-validation';

async function requireAdmin() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return token ? await verifyAdminToken(token) : null;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json() as {
    title?: string; slug?: string; locale?: string; category?: string;
    excerpt?: string; content?: string; coverImage?: string; published?: boolean;
  };

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const wasUnpublished = !existing.published;
    const nowPublished   = body.published === true;

    if (body.slug  !== undefined) { const e = validateSlug(body.slug);   if (e) return NextResponse.json({ error: e }, { status: 422 }); }
    if (body.title !== undefined) { const e = validateTitle(body.title); if (e) return NextResponse.json({ error: e }, { status: 422 }); }
    if (wasUnpublished && nowPublished) {
      const contentToCheck = body.content ?? existing.content;
      const e = validateContentForPublish(contentToCheck);
      if (e) return NextResponse.json({ error: e }, { status: 422 });
    }

    await prisma.blogPost.update({
      where: { id },
      data: {
        ...(body.title      !== undefined && { title:      body.title }),
        ...(body.slug       !== undefined && { slug:       body.slug }),
        ...(body.locale     !== undefined && { locale:     body.locale }),
        ...(body.category   !== undefined && { category:   body.category }),
        ...(body.excerpt    !== undefined && { excerpt:    body.excerpt }),
        ...(body.content    !== undefined && { content:    body.content }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage || null }),
        ...(body.published  !== undefined && { published:  body.published }),
        ...(wasUnpublished && nowPublished && { publishedAt: new Date() }),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Unique constraint')) {
      return NextResponse.json({ error: 'A post with this slug and language already exists' }, { status: 409 });
    }
    console.error('[admin blog PATCH]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
