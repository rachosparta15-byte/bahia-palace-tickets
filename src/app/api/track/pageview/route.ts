import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      visitorId: string;
      sessionId: string;
      path:      string;
      locale?:   string;
      referrer?: string | null;
    };

    // Hash the IP for privacy — store only first 16 hex chars
    const ip   = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '0.0.0.0';
    const ipHash = createHash('sha256').update(ip).digest('hex').slice(0, 16);

    // Extract UTM params from path query string
    const url        = new URL(body.path, 'https://example.com');
    const utmSource  = url.searchParams.get('utm_source')  ?? null;
    const utmMedium  = url.searchParams.get('utm_medium')  ?? null;
    const utmCampaign= url.searchParams.get('utm_campaign')?? null;

    // Derive referrer domain
    let referrerDomain: string | null = null;
    if (body.referrer) {
      try { referrerDomain = new URL(body.referrer).hostname; } catch { /* ignore */ }
    }

    await prisma.pageView.create({
      data: {
        visitorId:   body.visitorId ?? 'anon',
        sessionId:   body.sessionId ?? 'anon',
        path:        body.path,
        locale:      body.locale ?? 'en',
        referrer:    body.referrer ?? null,
        referrerDomain,
        utmSource,
        utmMedium,
        utmCampaign,
        ipHash,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Silently swallow — never break user flow for analytics
    return NextResponse.json({ ok: false });
  }
}
