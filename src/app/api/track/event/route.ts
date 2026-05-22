import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      visitorId: string;
      sessionId: string;
      name:      string;
      metadata?: string;
    };

    await prisma.event.create({
      data: {
        visitorId: body.visitorId ?? 'anon',
        sessionId: body.sessionId ?? 'anon',
        name:      body.name,
        metadata:  body.metadata ?? null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
