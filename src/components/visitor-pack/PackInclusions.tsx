'use client';

import { useTranslations } from 'next-intl';
import { Ticket, Headphones, MessageCircle, CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * What the pack includes, for the checkout order summary.
 *
 * Replaces the itemised price table that used to sit here. Four plain lines
 * answer "what am I getting" faster than a two-row cost split does, and the
 * split was doing the wrong job in the wrong place — by the time someone is
 * at checkout they have already decided, and the arithmetic just crowds the
 * total.
 *
 * WHERE THE COST SPLIT WENT (owner's decision, 22/07/2026): the
 * "100 MAD ≈ €9.36 / our fee €4.63" disclosure was removed from this block
 * entirely, not merely collapsed.
 *
 * §3.2 of the Terms of Sale still commits us to showing the Ministry's
 * official price on the booking page AND linking to where the customer can
 * buy it directly. Both halves now rest entirely on the "Everything
 * Included" section of visitor-pack/page.tsx:
 *
 *   • price — "The real 100 MAD Ministry of Culture ticket, bought on your
 *     behalf. Not a resale, not a markup hidden in the total."
 *   • link  — the /tickets link on that same card, which is the ONLY one
 *     left on the booking page.
 *
 * NOT the FAQ: its questions are server-rendered but the answers are
 * mounted by the accordion on click, so the "Can I get in cheaper?" text
 * cannot be relied on to be present.
 *
 * There is no longer any redundancy here. If that one section changes,
 * §3.2 is breached — put a disclosure back in this block rather than leave
 * the booking page without one.
 */
export function PackInclusions({ className }: { className?: string }) {
  const t = useTranslations('visitorPack.inclusions');

  const items = [
    { icon: Ticket, key: 'ticket' },
    { icon: Headphones, key: 'audio' },
    { icon: MessageCircle, key: 'whatsapp' },
    { icon: CalendarCheck, key: 'cancellation' },
  ] as const;

  return (
    <div className={cn('', className)}>
      <ul className="space-y-2">
        {items.map(({ icon: Icon, key }) => (
          <li key={key} className="flex items-start gap-2.5">
            <Icon size={14} className="mt-0.5 shrink-0 text-[#8FA63C]" aria-hidden="true" />
            <span className="text-sm leading-snug text-[#F5E8CC]">{t(key)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
