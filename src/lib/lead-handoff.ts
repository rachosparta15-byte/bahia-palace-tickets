/**
 * What happens after someone completes the lead modal.
 *
 * There are two destinations and the choice is NOT cosmetic:
 *
 *   - Payments OFF → the official Ministry of Culture portal, in a new tab.
 *     This is the site's long-standing behaviour and the one its legal pages
 *     currently describe ("we do not sell tickets, we point you to the
 *     official portal"). It must keep working untouched while the pack is
 *     not live, otherwise every ticket CTA on the site becomes a dead end.
 *
 *   - Payments ON → our own /visitor-pack checkout, in the visitor's locale.
 *
 * The lead is saved either way — the handoff never costs a lead.
 */

/** Data the modal already collected, carried into the pack checkout form. */
export interface LeadPrefill {
  name?: string;
  email?: string;
  /** ISO YYYY-MM-DD. */
  visitDate?: string;
  /** Number of tickets, as typed in the modal. */
  visitors?: number;
}

/**
 * sessionStorage key for the prefill handoff.
 *
 * Deliberately NOT a URL query string: the modal collects an email address
 * and a WhatsApp number, and query parameters leak into server access logs,
 * `Referer` headers sent to third parties, and analytics pageview URLs.
 * sessionStorage stays in the tab, is same-origin, and clears when the tab
 * closes. It is also cleared as soon as it is read (see consumeLeadPrefill).
 */
const PREFILL_KEY = 'bp_pack_prefill';

export function storeLeadPrefill(prefill: LeadPrefill): void {
  try {
    sessionStorage.setItem(PREFILL_KEY, JSON.stringify(prefill));
  } catch {
    // Private mode / storage disabled — the visitor just retypes. Never throw.
  }
}

/**
 * Read the prefill exactly once, then delete it. Single-use so a stale email
 * cannot reappear in the form on a later, unrelated visit in the same tab.
 */
export function consumeLeadPrefill(): LeadPrefill | null {
  try {
    const raw = sessionStorage.getItem(PREFILL_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(PREFILL_KEY);
    const parsed = JSON.parse(raw) as LeadPrefill;
    return typeof parsed === 'object' && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}
