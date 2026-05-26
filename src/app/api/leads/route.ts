import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Writes to data/leads.json on the server filesystem.
// NOTE: Vercel serverless functions have a read-only filesystem — migrate to
// Supabase (Phase B) before deploying there. On cPanel/VPS this works fine.
const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');

async function readLeads(): Promise<unknown[]> {
  try {
    const raw = await fs.readFile(LEADS_FILE, 'utf-8');
    return JSON.parse(raw) as unknown[];
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      email?: string;
      name?: string;
      ticketType?: string;
      locale?: string;
      sourcePage?: string;
    };

    const lead = {
      id:         crypto.randomUUID(),
      timestamp:  new Date().toISOString(),
      email:      body.email?.trim()      || null,
      name:       body.name?.trim()       || null,
      ticketType: body.ticketType         || 'unknown',
      locale:     body.locale             || 'en',
      sourcePage: body.sourcePage         || '/',
    };

    await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true });
    const leads = await readLeads();
    leads.push(lead);
    await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[leads] save error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
