import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { email } from '@/lib/email';

const schema = z.object({
  name:    z.string().min(2).max(120),
  email:   z.email(),
  subject: z.string().min(2).max(200),
  message: z.string().min(5).max(5000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const { name, email: from, subject, message } = parsed.data;

    await email.sendContactNotification({ from, name, subject, message });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact route]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
