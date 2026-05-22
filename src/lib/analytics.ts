import { nanoid } from 'nanoid';

const VID_KEY  = 'bpt_vid';
const SID_KEY  = 'bpt_sid';
const SID_EXP  = 'bpt_sid_exp';
const SESSION_MS = 30 * 60 * 1000; // 30 minutes

export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(VID_KEY);
  if (!id) { id = nanoid(); localStorage.setItem(VID_KEY, id); }
  return id;
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  const now = Date.now();
  const exp = parseInt(localStorage.getItem(SID_EXP) ?? '0', 10);
  let id = localStorage.getItem(SID_KEY);
  if (!id || now > exp) { id = nanoid(); localStorage.setItem(SID_KEY, id); }
  localStorage.setItem(SID_EXP, String(now + SESSION_MS));
  return id;
}

export function trackEvent(name: string, metadata?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const visitorId = getVisitorId();
  const sessionId = getSessionId();
  fetch('/api/track/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorId, sessionId, name, metadata: metadata ? JSON.stringify(metadata) : undefined }),
    keepalive: true,
  }).catch(() => {});
}
