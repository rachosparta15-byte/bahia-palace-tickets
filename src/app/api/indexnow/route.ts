import { NextResponse } from 'next/server';
import { submitToIndexNow, getAllPageUrls } from '@/lib/indexnow';

// Protect with a deploy secret so this can't be called anonymously.
const DEPLOY_SECRET = process.env.DEPLOY_SECRET;

export async function POST(request: Request) {
  if (DEPLOY_SECRET) {
    const auth = request.headers.get('x-deploy-secret');
    if (auth !== DEPLOY_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const body = await request.json().catch(() => ({}));
  const urls: string[] = Array.isArray(body.urls) ? body.urls : getAllPageUrls();

  const result = await submitToIndexNow(urls);
  return NextResponse.json({ submitted: urls.length, ...result });
}
