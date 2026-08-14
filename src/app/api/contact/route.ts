import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { email } from '@/lib/email';
import prisma from '@/lib/db';
import { isSubmissionLimited, recordSubmission } from '@/lib/rate-limit';

/**
 * Five messages an hour from one address.
 *
 * Generous for anyone with something to say, useless to a loop. This endpoint
 * writes a row AND sends an email, and had no ceiling of any kind — a script
 * pointed at it fills the database and burns the sending quota, and a domain
 * that emits a burst of identical mail gets filtered, which would take the
 * booking confirmations down with it.
 */
const MAX_PER_WINDOW = 5;
const WINDOW_MS = 60 * 60 * 1000;

const schema = z.object({
  name:    z.string().trim().min(1).max(120),
  email:   z.email(),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
  locale:  z.string().max(10).optional(),
});

// Idempotent — prod DB (Turso) gets schema changes at runtime, same pattern as Lead columns.
async function ensureContactMessageTable() {
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "locale" TEXT,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).catch(() => {});
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const { name, email: from, subject, message, locale } = parsed.data;

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      null;

    if (ip && (await isSubmissionLimited('contact', ip, MAX_PER_WINDOW, WINDOW_MS))) {
      // 429 and a plain sentence, not a silent success. Someone genuinely on
      // their fifth message deserves to know it did not send, rather than
      // believing it did.
      return NextResponse.json(
        { error: 'Too many messages from this connection. Please try again later.' },
        { status: 429 },
      );
    }

    // Save to DB first so the message shows up in the admin dashboard
    // even if the email notification fails.
    await ensureContactMessageTable();
    await prisma.contactMessage.create({
      data: { name, email: from, subject, message, locale: locale || null, ipAddress: ip },
    });

    // Counted once the message is genuinely stored, so a failed validation or
    // a database error never spends someone's allowance.
    if (ip) await recordSubmission('contact', ip);

    try {
      await email.sendContactNotification({ from, name, subject, message });
    } catch (err) {
      console.error('[contact route] email notification failed:', err);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact route]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
