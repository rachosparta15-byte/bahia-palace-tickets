import { createHmac } from 'crypto';

interface AdminPayload {
  id: string;
  email: string;
  role: string;
}

function b64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function secret(): string {
  const s = process.env.NEXTAUTH_SECRET;
  if (!s && process.env.NODE_ENV === 'production') {
    throw new Error('NEXTAUTH_SECRET environment variable is not set');
  }
  return s ?? 'dev-secret-change-in-production';
}

export async function signAdminToken(payload: AdminPayload): Promise<string> {
  const header = b64url(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const body   = b64url(Buffer.from(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  })));
  const sig = b64url(createHmac('sha256', secret()).update(`${header}.${body}`).digest());
  return `${header}.${body}.${sig}`;
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const expected = b64url(createHmac('sha256', secret()).update(`${header}.${body}`).digest());
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64').toString()) as AdminPayload & { exp: number };
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { id: payload.id, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

export const ADMIN_COOKIE = 'bpt_admin';
