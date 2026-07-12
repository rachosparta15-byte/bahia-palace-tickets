import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { email } from '@/lib/email';
import prisma from '@/lib/db';

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

    // Save to DB first so the message shows up in the admin dashboard
    // even if the email notification fails.
    await ensureContactMessageTable();
    await prisma.contactMessage.create({
      data: { name, email: from, subject, message, locale: locale || null, ipAddress: ip },
    });

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
