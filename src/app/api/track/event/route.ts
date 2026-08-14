import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
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

    /*
     * Hashed, never stored raw — the same treatment /api/track/pageview has
     * always given it. Sixteen hex characters is enough to tell two callers
     * apart and not enough to be a useful list of addresses if the table
     * leaked.
     *
     * The leftmost x-forwarded-for entry is the client as Vercel saw it.
     */
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
    const ipHash = ip ? createHash('sha256').update(ip).digest('hex').slice(0, 16) : null;

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
        ipHash,
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
