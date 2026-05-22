import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/auth';

async function requireAdmin() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return token ? await verifyAdminToken(token) : null;
}

const DEFAULT_SETTINGS = [
  { key: 'whatsapp_number',    value: '+212600000000',                label: 'WhatsApp Number',      group: 'contact' },
  { key: 'contact_phone',      value: '+212600000000',                label: 'Phone Number',         group: 'contact' },
  { key: 'contact_email',      value: 'contact@bahia-palace.com',    label: 'Contact Email',        group: 'contact' },
  { key: 'contact_address',    value: 'Rue Riad Zitoun el Jedid, Marrakech Medina', label: 'Address', group: 'contact' },
  { key: 'opening_hours',      value: '09:00 – 17:00 (daily)',       label: 'Opening Hours',        group: 'info' },
  { key: 'last_entry',         value: '16:30',                        label: 'Last Entry',           group: 'info' },
  { key: 'adult_price_display', value: '10',                          label: 'Adult Price ($)',       group: 'pricing' },
  { key: 'child_price_display', value: '0',                           label: 'Child Price ($)',       group: 'pricing' },
  { key: 'free_cancel_hours',  value: '24',                           label: 'Free Cancellation (hours)', group: 'pricing' },
  { key: 'facebook_url',       value: '',                             label: 'Facebook URL',         group: 'social' },
  { key: 'instagram_url',      value: '',                             label: 'Instagram URL',        group: 'social' },
  { key: 'tripadvisor_url',    value: '',                             label: 'TripAdvisor URL',      group: 'social' },
];

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const count = await prisma.siteSetting.count();
  if (count === 0) {
    for (const s of DEFAULT_SETTINGS) {
      await prisma.siteSetting.upsert({
        where:  { key: s.key },
        update: {},
        create: { key: s.key, value: s.value },
      });
    }
  }
  const settings = await prisma.siteSetting.findMany({ orderBy: { key: 'asc' } });
  return NextResponse.json(settings);
}

export async function PATCH(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const updates = await req.json() as Record<string, string>;
  const results: unknown[] = [];
  for (const [key, value] of Object.entries(updates)) {
    const r = await prisma.siteSetting.upsert({
      where:  { key },
      update: { value },
      create: { key, value },
    });
    results.push(r);
  }
  return NextResponse.json({ ok: true, updated: results.length });
}
