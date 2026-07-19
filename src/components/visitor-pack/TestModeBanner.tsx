import { getPublicPaymentsFlags } from '@/lib/payments/guard';
import { getTranslations } from 'next-intl/server';
import { FlaskConical } from 'lucide-react';

/**
 * Loud, unmissable banner shown whenever this build is NOT configured with
 * live Stripe keys. The point is that a developer, a stakeholder reviewing a
 * preview URL, or a future maintainer can never mistake this for a real
 * storefront that takes real money.
 *
 * Renders nothing only when live keys are configured — see isStripeTestMode,
 * which fails toward showing this banner rather than hiding it.
 *
 * Server component: reads env directly, ships no key material to the client.
 */
export async function TestModeBanner({ locale }: { locale: string }) {
  const { testMode } = getPublicPaymentsFlags();
  if (!testMode) return null;

  const t = await getTranslations({ locale, namespace: 'visitorPack.testMode' });

  return (
    /* NOT sticky: the site header is already sticky, and a second sticky bar
       at top-0 overlaps it and hides the nav. This sits in normal flow; the
       checkout form carries its own test-mode notice so the warning is still
       present at the moment that actually matters (see VisitorPackCheckoutForm). */
    <div
      role="status"
      className="bg-[#7A2E12] border-b-2 border-[#E8A33D] text-[#FFE9C7]"
    >
      <div className="max-w-6xl mx-auto px-6 py-2.5 flex items-center justify-center gap-3 text-center">
        <FlaskConical size={16} className="shrink-0 text-[#F5C96A]" aria-hidden="true" />
        <p className="text-sm font-semibold tracking-wide">
          <span className="uppercase">{t('badge')}</span>
          <span className="mx-2 opacity-50">—</span>
          <span className="font-normal">{t('message')}</span>
        </p>
      </div>
    </div>
  );
}
