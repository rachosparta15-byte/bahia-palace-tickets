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
      partySize?:   number | null;
      visitDate?:   string | null;
      whatsapp?:    string | null;
    };

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      null;

    const partySize = Number.isInteger(body.partySize) && (body.partySize as number) > 0 && (body.partySize as number) < 100
      ? body.partySize as number
      : null;
    const visitDate = typeof body.visitDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.visitDate)
      ? body.visitDate
      : null;

    const whatsapp = typeof body.whatsapp === 'string'
      ? body.whatsapp.trim().slice(0, 30) || null
      : null;

    // Ensure new columns exist before inserting (idempotent, same pattern as ipAddress)
    await prisma.$executeRawUnsafe(`ALTER TABLE "Lead" ADD COLUMN "partySize" INTEGER`).catch(() => {});
    await prisma.$executeRawUnsafe(`ALTER TABLE "Lead" ADD COLUMN "visitDate" TEXT`).catch(() => {});
    await prisma.$executeRawUnsafe(`ALTER TABLE "Lead" ADD COLUMN "whatsapp" TEXT`).catch(() => {});

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
        partySize,
        visitDate,
        whatsapp,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[leads] save error:', err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
