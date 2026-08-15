'use client';

import { useState } from 'react';
import { LeadModal } from './LeadModal';
import { LeadToast } from './LeadToast';
import { usePaymentsFlags } from './PaymentsFlagsProvider';
import { Link } from '@/i18n/navigation';
import { trackEvent } from '@/lib/analytics';

interface Props {
  /** Identifies which ticket/product triggered the CTA (for analytics). */
  ticketType?: string;
  /** Where on the page this CTA lives — sent as cta_location in GA4. */
  ctaLocation?: string;
  /**
   * DOM id on the rendered button. Not analytics: StickyMobileCTA observes
   * #ticket-book-btn to decide whether the mobile bar is needed, and had been
   * finding nothing on the page, so the bar showed permanently.
   */
  id?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * THE single ticket call-to-action for the whole site (~14 usages).
 *
 * It has two behaviours, chosen by the payments kill switch, so that every
 * ticket button everywhere changes destination together — there is exactly
 * one place that decides where a buyer goes:
 *
 *   payments ON  → straight to /visitor-pack, in the visitor's own locale.
 *                  One product, one price, one checkout.
 *
 *   payments OFF → the existing lead modal → official Ministry of Culture
 *                  portal. This is today's live behaviour and it must keep
 *                  working: with the pack not purchasable, sending buyers to
 *                  it would turn every ticket button on the site into a
 *                  "Booking opens soon" dead end and stop lead capture.
 *
 * The name is historical — it is no longer only about lead capture. Kept to
 * avoid churning 14 call sites; the behaviour above is the contract.
 */
export function LeadButton({
  ticketType = 'general',
  ctaLocation = 'unknown',
  id,
  className,
  children,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { enabled: paymentsEnabled } = usePaymentsFlags();

  const track = () => {
    try {
      trackEvent('ticket_cta_click', { cta_location: ctaLocation, ticket_type: ticketType });
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'ticket_cta_click', { cta_location: ctaLocation, ticket_type: ticketType });
      }
    } catch {
      // analytics must never block the buyer
    }
  };

  const handleDone = () => {
    setModalOpen(false);
    setShowToast(true);
  };

  /*
   * Only reached when payments are off, because the selling path returns an <a>
   * before this is ever attached. The navigation that used to live here is now
   * the Link's href — see the comment at the return.
   */
  const handleClick = () => {
    track();
    setModalOpen(true);
  };

  /*
   * A REAL LINK WHEN IT NAVIGATES, A BUTTON WHEN IT DOES NOT.
   *
   * This was a <button> with router.push in its onClick, everywhere on the
   * site. A crawler cannot follow an onClick, so Google saw no link from any
   * ticket CTA to the page that takes the money. Crawling eight pages found
   * ONE internal link to /visitor-pack — against fourteen to /tickets, twelve
   * to /blog and twelve to /contact. The site was telling Google that the
   * contact page matters twelve times more than the checkout.
   *
   * That shows up exactly where you would expect it in Search Console: over 28
   * days this site sits at position 4.8 for "bahia palace photos" and 10.0 for
   * "bahia palace tickets". It is being read as an information site, because in
   * link terms it is one.
   *
   * As an <a href> the same CTAs become a dozen internal links carrying
   * commercial anchor text ("Get Tickets", "Book Now") straight to the
   * checkout. Nothing else changes: next-intl's Link prepends the locale the
   * same way router.push did, onClick still fires so tracking is untouched, and
   * navigation is still client-side. It also fixes things a <button> silently
   * broke — middle-click, open in new tab, and "copy link address".
   *
   * The modal branch stays a <button>, because opening a dialog is genuinely
   * not a navigation and should not be announced as one.
   */
  if (paymentsEnabled) {
    return (
      <Link href="/visitor-pack#checkout" id={id} onClick={track} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <>
      <button type="button" id={id} onClick={handleClick} className={className}>
        {children}
      </button>

      {modalOpen && (
        <LeadModal
          ticketType={ticketType}
          onClose={() => setModalOpen(false)}
          onDone={handleDone}
        />
      )}

      {showToast && <LeadToast />}
    </>
  );
}
