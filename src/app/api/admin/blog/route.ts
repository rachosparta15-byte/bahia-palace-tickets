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

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json() as {
      title: string; slug: string; locale: string; category: string;
      excerpt?: string; content?: string; coverImage?: string; published?: boolean;
    };

    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const slugErr  = validateSlug(body.slug);
    const titleErr = validateTitle(body.title);
    const contentErr = body.published ? validateContentForPublish(body.content) : undefined;
    const firstErr = slugErr ?? titleErr ?? contentErr;
    if (firstErr) return NextResponse.json({ error: firstErr }, { status: 422 });

    const post = await prisma.blogPost.create({
      data: {
        title:      body.title,
        slug:       body.slug,
        locale:     body.locale     ?? 'en',
        category:   body.category   ?? 'visit-tips',
        excerpt:    body.excerpt    ?? null,
        content:    body.content    ?? null,
        coverImage: body.coverImage ?? null,
        published:  body.published  ?? false,
        publishedAt: body.published ? new Date() : null,
      },
    });
    return NextResponse.json({ ok: true, id: post.id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Unique constraint')) {
      return NextResponse.json({ error: 'A post with this slug and language already exists' }, { status: 409 });
    }
    console.error('[admin blog POST]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
