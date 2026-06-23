import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const LOCALES = ['en', 'fr', 'de', 'es', 'it'] as const;

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  const slug   = req.nextUrl.searchParams.get('slug');
  const locale = req.nextUrl.searchParams.get('locale');

  if (!process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'REVALIDATE_SECRET env var not set' }, { status: 500 });
  }
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const revalidated: string[] = [];

  if (slug) {
    const targets = locale ? [locale] : LOCALES;
    for (const loc of targets) {
      const path = `/${loc}/blog/${slug}`;
      revalidatePath(path);
      revalidated.push(path);
    }
  } else {
    // No slug = revalidate the entire blog listing for all locales
    for (const loc of LOCALES) {
      revalidatePath(`/${loc}/blog`);
      revalidated.push(`/${loc}/blog`);
    }
  }

  return NextResponse.json({ revalidated, now: Date.now() });
}
