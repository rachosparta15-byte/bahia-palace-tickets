import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import prisma from '@/lib/db';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/auth';
import { email } from '@/lib/email';
import {
  abandonedCandidates,
  crossSellCandidates,
  currentTotalEur,
  FOLLOW_UP_PRICES,
  resumeUrl,
  unsubscribeUrl,
} from '@/lib/follow-up';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The follow-up emails, listed and sent by hand.
 *
 * GET returns who is eligible. POST sends to them. There is no schedule and no
 * cron on purpose: these messages go to people who did not ask for them, the
 * list is short enough to read, and an operator who has looked at it before
 * pressing is the difference between a follow-up and a mailshot.
 *
 * POST re-derives the list server-side and then INTERSECTS it with whatever
 * ids the browser asked for. The operator picks who to write to; the rules —
 * old enough, visit not passed, never sent before, not opted out — decide who
 * is eligible at all, and no body can add somebody the query did not return.
 * A selection can only ever narrow the list.
 */
async function authed(): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return Boolean(token && (await verifyAdminToken(token)));
}

function summarise(b: {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  visitDate: Date;
  adults: number;
  children: number;
  totalAmount: number;
  createdAt: Date;
}) {
  return {
    id: b.id,
    reference: b.reference,
    name: b.customerName,
    email: b.customerEmail,
    visitDate: b.visitDate.toISOString().slice(0, 10),
    party: `${b.adults} adult${b.adults === 1 ? '' : 's'}${b.children > 0 ? ` + ${b.children} child${b.children === 1 ? '' : 'ren'}` : ''}`,
    total: b.totalAmount,
    createdAt: b.createdAt.toISOString(),
  };
}

export async function GET() {
  if (!(await authed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [abandoned, crossSell] = await Promise.all([abandonedCandidates(), crossSellCandidates()]);
  return NextResponse.json({
    abandoned: abandoned.map(summarise),
    crossSell: crossSell.map(summarise),
  });
}

export async function POST(req: NextRequest) {
  if (!(await authed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as {
    kind?: unknown;
    testTo?: unknown;
    ids?: unknown;
  };
  const kind = body.kind === 'crossSell' ? 'crossSell' : body.kind === 'abandoned' ? 'abandoned' : null;
  if (!kind) return NextResponse.json({ error: 'kind must be "abandoned" or "crossSell"' }, { status: 400 });

  /*
   * Test mode: one copy, to the operator, and nothing is recorded.
   *
   * The real button sends to a whole list and cannot be taken back, which
   * makes "what does it actually look like in a real inbox" a question nobody
   * could answer without answering it to customers first. So: the same
   * builder, the same provider, the same headers — the only two differences
   * are the recipient and that no booking is stamped, so everyone on the list
   * still receives the real thing afterwards.
   */
  const testTo = typeof body.testTo === 'string' ? body.testTo.trim() : '';
  if (testTo) {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(testTo)) {
      return NextResponse.json({ error: 'That is not an email address.' }, { status: 400 });
    }
    const candidates = kind === 'abandoned' ? await abandonedCandidates() : await crossSellCandidates();
    const sample = candidates[0];
    if (!sample) {
      return NextResponse.json(
        { error: 'Nobody is on this list, so there is no real booking to render a test from.' },
        { status: 422 },
      );
    }
    try {
      const unsub = await unsubscribeUrl(testTo, sample.locale);
      if (kind === 'abandoned') {
        await email.sendAbandonedCheckoutReminder({
          to: testTo,
          customerName: sample.customerName,
          reference: sample.reference,
          visitDate: sample.visitDate.toISOString().slice(0, 10),
          adults: sample.adults,
          children: sample.children,
          totalAmount: currentTotalEur(sample),
          currency: sample.currency,
          adultPrice: FOLLOW_UP_PRICES.adult,
          childPrice: FOLLOW_UP_PRICES.child,
          resumeUrl: resumeUrl(sample.locale),
          unsubscribeUrl: unsub,
          whatsapp: sample.customerPhone,
        });
      } else {
        await email.sendMonumentCrossSell({
          to: testTo,
          customerName: sample.customerName,
          visitDate: sample.visitDate.toISOString().slice(0, 10),
          unsubscribeUrl: unsub,
          whatsapp: sample.customerPhone,
        });
      }
    } catch (err) {
      console.error('[follow-up] test send failed', err);
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'The email provider refused it.' },
        { status: 502 },
      );
    }
    return NextResponse.json({
      ok: true,
      test: true,
      to: testTo,
      renderedFrom: sample.reference,
      // Said out loud: a test that quietly retired someone from the list would
      // be worse than no test at all.
      stamped: false,
    });
  }

  const eligible = kind === 'abandoned' ? await abandonedCandidates() : await crossSellCandidates();

  /*
   * The operator's choice, intersected with eligibility.
   *
   * An absent list still means "everyone eligible" — that is the older shape
   * and it is a reasonable default. A present but empty one means the operator
   * ticked nothing, which must not silently become everyone.
   */
  const picked = Array.isArray(body.ids) ? body.ids.filter((v): v is string => typeof v === 'string') : null;
  if (picked !== null && picked.length === 0) {
    return NextResponse.json({ error: 'Nobody is selected.' }, { status: 400 });
  }
  const rows = picked === null ? eligible : eligible.filter((b) => picked.includes(b.id));

  if (rows.length === 0) {
    return NextResponse.json(
      { error: 'None of those are still eligible — the list may have moved on. Reload and try again.' },
      { status: 409 },
    );
  }

  let sent = 0;
  const failed: { reference: string; reason: string }[] = [];

  for (const b of rows) {
    try {
      const unsub = await unsubscribeUrl(b.customerEmail, b.locale);
      if (kind === 'abandoned') {
        await email.sendAbandonedCheckoutReminder({
          to: b.customerEmail,
          customerName: b.customerName,
          reference: b.reference,
          visitDate: b.visitDate.toISOString().slice(0, 10),
          adults: b.adults,
          children: b.children,
          totalAmount: currentTotalEur(b),
          currency: b.currency,
          adultPrice: FOLLOW_UP_PRICES.adult,
          childPrice: FOLLOW_UP_PRICES.child,
          resumeUrl: resumeUrl(b.locale),
          unsubscribeUrl: unsub,
          whatsapp: b.customerPhone,
        });
      } else {
        await email.sendMonumentCrossSell({
          to: b.customerEmail,
          customerName: b.customerName,
          visitDate: b.visitDate.toISOString().slice(0, 10),
          unsubscribeUrl: unsub,
          whatsapp: b.customerPhone,
        });
      }

      /*
       * Stamped only after the provider accepted it. Stamping first would
       * make a failed send look like a delivered one and quietly retire
       * somebody from the list without ever writing to them.
       */
      await prisma.booking.update({
        where: { id: b.id },
        data: kind === 'abandoned' ? { reminderSentAt: new Date() } : { crossSellSentAt: new Date() },
      });
      sent += 1;
    } catch (err) {
      // One bad address must not stop the rest of the list.
      console.error(`[follow-up] ${kind} failed for ${b.reference}`, err);
      failed.push({ reference: b.reference, reason: err instanceof Error ? err.message : 'unknown' });
    }
  }

  return NextResponse.json({ ok: true, kind, attempted: rows.length, sent, failed });
}
