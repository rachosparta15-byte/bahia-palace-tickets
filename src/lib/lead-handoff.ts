/**
 * What happens after someone completes the lead modal.
 *
 * There are two destinations and the choice is NOT cosmetic:
 *
 *   - Payments OFF → the official Ministry of Culture portal, in a new tab.
 *     This is the site's long-standing behaviour and it must keep working
 *     untouched while the pack is not live, otherwise every ticket CTA on
 *     the site becomes a dead end.
 *
 *     (The legal pages used to describe this as the ONLY thing the site does
 *     — "we do not sell tickets, we point you to the official portal". They
 *     were replaced on 21/07/2026 with Terms of Sale covering the concierge
 *     model, so both destinations are now accurately documented.)
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
  /**
   * Row id of the Lead the modal just saved.
   *
   * Sent back at checkout so that step updates the existing row rather than
   * creating a second one — otherwise every visitor who completes both steps
   * appears twice in /admin/leads, and the one that converts is unknowable.
   *
   * Absent when lead capture failed, or when the visitor came straight to
   * /visitor-pack without the modal. Both are normal; checkout creates a
   * fresh Lead in that case.
   */
  leadId?: string;
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
