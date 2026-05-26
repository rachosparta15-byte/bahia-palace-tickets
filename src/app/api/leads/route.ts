import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      email?: string;
      name?: string;
      ticketType?: string;
      locale?: string;
      sourcePage?: string;
    };

    await prisma.lead.create({
      data: {
        email:      body.email?.trim()      || null,
        name:       body.name?.trim()       || null,
        ticketType: body.ticketType         || 'general',
        locale:     body.locale             || 'en',
        sourcePage: body.sourcePage         || '/',
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[leads] save error:', err);
    // best-effort — never block the user
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
