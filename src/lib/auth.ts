interface AdminPayload {
  id: string;
  email: string;
  role: string;
}

function secret(): string {
  const s = process.env.NEXTAUTH_SECRET;
  if (!s && process.env.NODE_ENV === 'production') {
    throw new Error('NEXTAUTH_SECRET environment variable is not set');
  }
  return s ?? 'dev-secret-change-in-production';
}

const enc = new TextEncoder();
const dec = new TextDecoder();

function b64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function b64urlDecode(s: string): Uint8Array<ArrayBuffer> {
  const binary = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  const buf = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i);
  return view;
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export async function signAdminToken(payload: AdminPayload): Promise<string> {
  const header = b64url(enc.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).buffer as ArrayBuffer);
  const body   = b64url(enc.encode(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
  })).buffer as ArrayBuffer);
  const key = await hmacKey();
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`${header}.${body}`));
  return `${header}.${body}.${b64url(sig)}`;
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const key   = await hmacKey();
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      b64urlDecode(sig),
      enc.encode(`${header}.${body}`),
    );
    if (!valid) return null;
    const payload = JSON.parse(dec.decode(b64urlDecode(body))) as AdminPayload & { exp: number };
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { id: payload.id, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

export const ADMIN_COOKIE = 'bpt_admin';
