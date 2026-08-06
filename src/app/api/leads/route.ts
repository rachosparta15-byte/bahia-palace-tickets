import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { ensureColumns } from '@/lib/db/ensure-columns';

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

    await ensureColumns();

    const lead = await prisma.lead.create({
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
        // status defaults to "lead"; only the payment confirmation path
        // promotes it to "paid". Never accepted from the request body.
      },
    });

    // The id goes back to the browser so the checkout step can UPDATE this
    // row instead of writing a second, near-identical one. It is an opaque
    // cuid and grants nothing on its own: the checkout route only ever uses
    // it to overwrite the visitor's own name/qty/date, and the fields that
    // matter for trust (status, bookingId, ipAddress) are server-set.
    return NextResponse.json({ ok: true, id: lead.id });
  } catch (err) {
    console.error('[leads] save error:', err);
    // Still a 200: lead capture is best-effort and must never block the
    // visitor's journey. The caller treats a missing id as "no lead to
    // update" and creates one at checkout instead.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
