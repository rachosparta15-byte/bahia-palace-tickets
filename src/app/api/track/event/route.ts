import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { ensureColumns } from '@/lib/db/ensure-columns';
import { summariseUserAgent } from '@/lib/user-agent';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      visitorId: string;
      sessionId: string;
      name:      string;
      metadata?: string;
    };

    /*
     * Device and OS are read from the request, never from the body.
     *
     * The browser could send them, and the lead modal used to — but only the
     * lead modal did, so ticket_cta_click and every checkout step carried
     * nothing and the funnel could not be split by phone and desktop at all.
     * Deriving it here means every event gets it, including ones added later
     * by someone who has never opened this file.
     */
    const { device, os } = summariseUserAgent(req.headers.get('user-agent'));

    // Patched in rather than migrated, like the rest of this schema. Cheap:
    // it runs once per process, not once per event.
    await ensureColumns();

    await prisma.event.create({
      data: {
        visitorId: body.visitorId ?? 'anon',
        sessionId: body.sessionId ?? 'anon',
        name:      body.name,
        metadata:  body.metadata ?? null,
        device,
        os,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    /*
     * Analytics must never break the page that fired it. Someone pressing
     * "Get tickets" is on their way to paying us; a tracking table being
     * locked or mid-migration is our problem, not a reason to interrupt them.
     * The client ignores this response either way.
     */
    return NextResponse.json({ ok: false });
  }
}
