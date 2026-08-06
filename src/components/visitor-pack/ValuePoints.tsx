import { getTranslations } from 'next-intl/server';
import { CalendarCheck, Headphones, MessageCircle, Ticket } from 'lucide-react';

/**
 * The four things the pack actually buys, shown directly under the price.
 *
 * WHY THESE FOUR: each one answers an objection a traveller has at the
 * moment they see a price above the 100 MAD door fee — "what if my plans
 * change", "what am I paying extra for", "who do I ask if it goes wrong",
 * "will I still queue". Anything that does not answer one of those belongs
 * further down the page, not here.
 *
 * PRICE BREAKDOWN REMOVED (owner's decision, 22/07/2026). The itemised
 * "100 MAD ≈ €9.36 + our fee €4.63" disclosure that used to sit behind a
 * "Price details" toggle here is gone, as is the same block in the checkout
 * summary.
 *
 * §3.2 of the Terms of Sale has two halves, and they now live elsewhere on
 * this page — do not remove either without replacing it:
 *   • the PRICE:  the "Everything Included" section states "The real
 *     100 MAD Ministry of Culture ticket, bought on your behalf."
 *   • the LINK:   the same section links to /tickets, where a visitor can
 *     buy the official ticket themselves. This link was moved there when
 *     the breakdown was deleted; it was previously the only one on the
 *     page, and §3.2 promises "a link is provided".
 */
export async function ValuePoints({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'visitorPack.valuePoints' });

  const points = [
    { icon: CalendarCheck, key: 'cancellation' },
    { icon: Headphones, key: 'audioGuide' },
    { icon: MessageCircle, key: 'whatsapp' },
    { icon: Ticket, key: 'skipLine' },
  ] as const;

  return (
    <div className="mt-5">
      <ul className="space-y-2.5">
        {points.map(({ icon: Icon, key }) => (
          <li key={key} className="flex items-start gap-2.5">
            <Icon
              size={15}
              className="mt-0.5 shrink-0 text-[#8FA63C]"
              aria-hidden="true"
            />
            <span className="text-sm leading-snug text-[#F5E8CC]">{t(key)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
