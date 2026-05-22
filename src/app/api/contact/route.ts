import { NextRequest, NextResponse } from 'next/server';
import { email } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email: from, subject, message } = body as Record<string, string>;

    if (!name || !from || !subject || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await email.sendContactNotification({
      from,
      name,
      subject,
      message,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact route]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
