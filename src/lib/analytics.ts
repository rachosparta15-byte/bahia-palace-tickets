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

const OPT_OUT_KEY = 'bpt_notrack';

/**
 * Is this browser the owner's?
 *
 * Every figure on /admin/clicks turned out to be the owner's own testing. Two
 * visitor ids carried hundreds of modal_open and lead_submit events across
 * days and two locales — nobody shopping for a ticket opens the same form
 * forty times — and the two who "reached payment" filled a five-field form in
 * fourteen and thirty-one seconds, minutes after the tracking deployed. Read
 * innocently that says the checkout loses everyone at the card step. It says
 * nothing of the kind, and a dashboard that has to be mentally corrected
 * before it can be believed is worse than no dashboard.
 *
 * Excluded at source rather than filtered later: nothing is sent, so nothing
 * has to be identified and stripped afterwards, and the owner cannot reappear
 * in a query somebody forgets to filter.
 *
 * Set once per browser by loading any page with ?notrack=1, cleared with
 * ?notrack=0. A URL rather than a setting because it has to work on a phone, a
 * laptop and a borrowed tablet with no login on any of them.
 */
function optedOut(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const flag = new URL(window.location.href).searchParams.get('notrack');
    if (flag === '1') localStorage.setItem(OPT_OUT_KEY, '1');
    if (flag === '0') localStorage.removeItem(OPT_OUT_KEY);
    return localStorage.getItem(OPT_OUT_KEY) === '1';
  } catch {
    // Private mode, or storage blocked. Track rather than not: a visitor who
    // cannot be excluded is still a visitor, and dropping everyone whose
    // browser refuses storage would quietly empty the funnel.
    return false;
  }
}

export function trackEvent(name: string, metadata?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (optedOut()) return;
  const visitorId = getVisitorId();
  const sessionId = getSessionId();
  fetch('/api/track/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorId, sessionId, name, metadata: metadata ? JSON.stringify(metadata) : undefined }),
    keepalive: true,
  }).catch(() => {});
}
