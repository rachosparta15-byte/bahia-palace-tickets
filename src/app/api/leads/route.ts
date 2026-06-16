import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      email?:       string | null;
      name?:        string | null;
      ticketType?:  string;
      locale?:      string;
      sourcePage?:  string;
      referrer?:    string | null;
      utmSource?:   string | null;
      utmMedium?:   string | null;
      utmCampaign?: string | null;
      device?:      string | null;
    };

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      null;

    await prisma.lead.create({
      data: {
        email:       body.email       || null,
        name:        body.name        || null,
        ticketType:  body.ticketType  || 'general',
        locale:      body.locale      || 'en',
        sourcePage:  body.sourcePage  || '/',
        referrer:    body.referrer    || null,
        utmSource:   body.utmSource   || null,
        utmMedium:   body.utmMedium   || null,
        utmCampaign: body.utmCampaign || null,
        device:      body.device      || null,
        ipAddress:   ip,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[leads] save error:', err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
