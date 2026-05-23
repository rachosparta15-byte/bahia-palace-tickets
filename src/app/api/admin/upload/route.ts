import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/auth';

const MAX_MB = 5;

const MAGIC: Array<{ mime: string; ext: string; bytes: number[]; offset?: number }> = [
  { mime: 'image/jpeg', ext: 'jpg',  bytes: [0xFF, 0xD8, 0xFF] },
  { mime: 'image/png',  ext: 'png',  bytes: [0x89, 0x50, 0x4E, 0x47] },
  { mime: 'image/gif',  ext: 'gif',  bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: 'image/webp', ext: 'webp', bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 },
];

function detectType(buf: Buffer): { mime: string; ext: string } | null {
  for (const m of MAGIC) {
    const off = m.offset ?? 0;
    if (m.bytes.every((b, i) => buf[off + i] === b)) return m;
  }
  return null;
}

export async function POST(req: Request) {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  if (file.size > MAX_MB * 1024 * 1024) {
    return NextResponse.json({ error: `File too large (max ${MAX_MB} MB)` }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = detectType(buffer);
  if (!detected) {
    return NextResponse.json({ error: 'Only JPG, PNG, WebP or GIF allowed' }, { status: 400 });
  }

  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${detected.ext}`;

  // Production: use Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`gallery/${safeName}`, buffer, {
      access: 'public',
      contentType: detected.mime,
    });
    return NextResponse.json({ url: blob.url });
  }

  // Development fallback: write to public/uploads/
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, safeName), buffer);
  return NextResponse.json({ url: `/uploads/${safeName}` });
}
