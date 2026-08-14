import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { CalendarClock, MessageCircle, ShieldCheck } from 'lucide-react';
import { TEASER_PRICE_ENABLED } from '@/config/pricing';

/**
 * The reassurance panel directly above the payment form.
 *
 * It carries every disclosure the law requires before an order is placed --
 * total price inclusive of taxes (CRD Art 6(1)(e)), the main characteristics of
 * the service (a), the time by which we undertake to deliver (g), the
 * cancellation position (h), and that we are not the Ministry (UCPD Annex I
 * point 4) -- but in the order a buyer actually needs them, not in the order a
 * lawyer would list them.
 *
 * It used to open on "You are booking with an independent booking service, not
 * the Ministry of Culture", itemise our price against the gate price, and close
 * by offering to send the reader to the ministry portal. Every one of those is
 * a real thing we have to be honest about, and none of them had to be the first
 * thing a buyer reads with their card out. Leading on a denial primes doubt;
 * itemising invites subtraction; an alternative offered at the decision point
 * converts a decision into a comparison, which is how people end up deciding
 * nothing at all.
 *
 * So the order is now: what you keep (free cancellation), when you get it, what
 * the money covers, and then who we are. The independence line is unmissable
 * and one click from the full Terms -- it is simply no longer the headline.
 *
 * The portal link is deliberately not here. It has NOT been removed from the
 * page: the "Can I get in cheaper?" answer in the FAQ below still gives the
 * gate price and points at the Ministry. That keeps
 * `evidence.officialPortalLinkShown` on every order truthful, answers the
 * doubter who goes looking, and stops planting the idea in front of the buyer
 * who was not looking for it.
 *
 * Prices are DERIVED from src/config/pricing.ts, never re-typed.
 */
export function CheckoutDisclosure() {
  const t = useTranslations('visitorPack.reassurance');

  /*
   * The `price` row is the total-price disclosure — "€11.99 per person, all
   * taxes included". While the teaser test runs it is not shown HERE, because
   * this panel sits above the empty form and the test requires the form to
   * carry no total.
   *
   * It has not been dropped. CRD Art 6(1)(e) requires the total before the
   * consumer is BOUND, and nobody is bound by filling this form in — the order
   * is placed at the payment step, where VisitorPackCheckoutForm now renders
   * the full summary, the included services and the total directly above the
   * PayPal button. The disclosure moved with the decision it belongs to.
   *
   * Turning TEASER_PRICE_ENABLED off puts it back in both places.
   */
  const rows = [
    { Icon: ShieldCheck, key: 'cancellation' as const, tone: '#8FA63C' },
    { Icon: CalendarClock, key: 'delivery' as const, tone: '#E8A33D' },
    ...(TEASER_PRICE_ENABLED
      ? []
      : [{ Icon: MessageCircle, key: 'price' as const, tone: '#E8A33D' }]),
  ];

  return (
    <div className="mb-8 rounded-2xl border border-[rgba(232,163,61,0.20)] bg-[#251A0F] p-5 text-sm leading-relaxed text-[#C4A882] sm:p-6">
      <ul className="space-y-4">
        {rows.map(({ Icon, key, tone }) => (
          <li key={key} className="flex items-start gap-3">
            <Icon size={17} className="mt-0.5 shrink-0" style={{ color: tone }} aria-hidden="true" />
            <p>
              <strong className="font-semibold text-[#F5E8CC]">{t(`${key}.title`)}</strong>{' '}
              {t(`${key}.body`)}
            </p>
          </li>
        ))}
      </ul>

      {/*
        Required, and kept in plain sight -- but as positioning rather than an
        apology, and after the reader knows what they are getting.
      */}
      <p className="mt-5 border-t border-[rgba(232,163,61,0.15)] pt-4 text-xs leading-relaxed text-[#C4A882]/80">
        {t.rich('independence', {
          terms: (chunks) => (
            <Link
              href="/legal/terms"
              className="text-[#E8A33D] underline underline-offset-4 transition-colors hover:text-[#F5E8CC]"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
    </div>
  );
}
