/**
 * Storage for delivered QR tickets.
 *
 * SERVER ONLY. Never import from a client component.
 *
 * WHY NOT public/uploads (where gallery images go): a QR ticket is the
 * bearer instrument that gets someone through the gate. Anything under
 * public/ is served by filename to anyone who guesses it, with no auth and
 * no logging. These files live outside the web root and are streamed by a
 * route that checks the caller first — see /api/bookings/[id]/qr.
 *
 * SWAPPING TO VERCEL BLOB: `storage/qr/` is a local disk path, and Vercel's
 * filesystem is ephemeral — files written on one request are gone on the
 * next. Before this runs in production, replace the two marked bodies below
 * with `put()` / `head()` from @vercel/blob (already a dependency; see
 * src/app/api/admin/upload/route.ts for the existing pattern). Blob must be
 * created with `access: 'private'`, NOT the 'public' used for gallery
 * images — a public blob URL is world-readable and undoes the point of
 * keeping tickets out of public/.
 */

import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

/** Files we accept as a QR ticket, by magic bytes rather than by extension. */
const ACCEPTED = [
  { mime: 'image/png', ext: 'png', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: 'image/jpeg', ext: 'jpg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'application/pdf', ext: 'pdf', bytes: [0x25, 0x50, 0x44, 0x46] },
] as const;

export const MAX_QR_MB = 5;

export interface DetectedType {
  mime: string;
  ext: string;
}

/**
 * Identify the file from its leading bytes.
 *
 * The declared Content-Type and the filename both come from the browser and
 * are trivially forged; the first four bytes are the file. Returns null for
 * anything not on the list, which the caller must treat as a rejection.
 */
export function detectQrType(buf: Buffer): DetectedType | null {
  for (const t of ACCEPTED) {
    if (t.bytes.every((b, i) => buf[i] === b)) return { mime: t.mime, ext: t.ext };
  }
  return null;
}

function storageDir(): string {
  return join(process.cwd(), 'storage', 'qr');
}

/**
 * Persist a QR file and return an opaque reference to store on the booking.
 *
 * The reference is a filename, never a URL: callers must not be able to
 * turn it into a link that bypasses the serving route's checks.
 */
export async function saveQrFile(
  bookingId: string,
  buffer: Buffer,
  ext: string
): Promise<string> {
  // ── Replace this body for Vercel Blob ──────────────────────────────
  const dir = storageDir();
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });

  // Booking id + timestamp: the id ties the file to its booking for manual
  // inspection, the timestamp keeps a re-upload from silently overwriting
  // the file we may need as evidence of what was actually delivered.
  const name = `${bookingId}-${Date.now()}.${ext}`;
  await writeFile(join(dir, name), buffer);
  return name;
  // ───────────────────────────────────────────────────────────────────
}

/** Read a stored QR back. Returns null if the reference no longer resolves. */
export async function readQrFile(ref: string): Promise<Buffer | null> {
  // Path traversal guard: `ref` reaches us from the database, but a stored
  // value like "../../.env" would otherwise read an arbitrary file. Only a
  // bare filename is ever valid.
  if (ref.includes('/') || ref.includes('\\') || ref.includes('..')) return null;

  // ── Replace this body for Vercel Blob ──────────────────────────────
  const path = join(storageDir(), ref);
  if (!existsSync(path)) return null;
  return readFile(path);
  // ───────────────────────────────────────────────────────────────────
}

/** MIME type for a stored reference, derived from its extension. */
export function mimeForRef(ref: string): string {
  const ext = ref.split('.').pop()?.toLowerCase();
  const match = ACCEPTED.find((t) => t.ext === ext);
  return match?.mime ?? 'application/octet-stream';
}
