'use client';

import { useState, useEffect } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { PackInclusions } from './PackInclusions';
import { SharedPaymentElement } from './SharedPaymentElement';
import { DatePicker, toISODate } from '@/components/ui/DatePicker';
import { CreditCard, Calendar, Users, Lock, FlaskConical } from 'lucide-react';
import {
  VISITOR_PACK_PRICE_EUR_CENTS,
  VISITOR_PACK_MAX_VISITORS,
  formatEURAmount,
  formatEUR,
} from '@/config/pricing';
import { consumeLeadPrefill } from '@/lib/lead-handoff';

/** Today in YYYY-MM-DD, local time. Used as the default and the minimum. */
function todayISO(): string {
  return toISODate(new Date());
}

// `visitors` is a plain number here, not z.coerce — the select registers with
// valueAsNumber, so react-hook-form hands us a number and the resolver's input
// and output types stay identical.
const schema = z.object({
  date: z.string().min(1),
  visitors: z.number().int().min(1).max(VISITOR_PACK_MAX_VISITORS),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  // `.refine` rather than `z.literal(true)`: literal narrows the inferred
  // type to `true`, which the unchecked default value then contradicts.
  acceptedConsent: z.boolean().refine((v) => v === true),
  /**
   * Lead row created back in the modal, carried here by the prefill handoff
   * and sent on so checkout updates that row instead of writing a second one.
   *
   * Lives in the form rather than in component state because `reset()`
   * already populates it in the prefill effect — a separate setState there
   * would be a cascading render the React compiler rejects. Empty string when
   * the visitor came straight to this page; the API creates a Lead itself.
   */
  leadId: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  locale: string;
  /** Server-evaluated: true when no live Stripe keys are configured. */
  testMode: boolean;
  /**
   * Server-evaluated PAYMENTS_ENABLED status. When false the submit button is
   * replaced by a disabled "Booking opens soon" control.
   *
   * This is a UX affordance ONLY — never a security boundary. The API route
   * re-checks the switch server-side, so tampering with this prop in devtools
   * gets you a 503, not a checkout.
   */
  paymentsEnabled: boolean;
}

export function VisitorPackCheckoutForm({ locale, paymentsEnabled, testMode }: Props) {
  const t = useTranslations('visitorPack.form');
  const tHero = useTranslations('visitorPack.hero');
  const tTest = useTranslations('visitorPack.testMode');
  const tDate = useTranslations('datePicker');
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  /** Set once the parent has created the Payment Intent; swaps the form for the card field. */
  const [payment, setPayment] = useState<{ clientSecret: string; orderId: string } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      visitors: 1,
      // Default to today so the field is never an empty "mm/dd/yyyy". The
      // order summary echoes the full date back in the visitor's language,
      // and the picker highlights it — a pre-filled date must stay obvious,
      // because a wrong visit date is non-refundable once the QR ships
      // (Terms §5 and §7).
      date: todayISO(),
      // Unticked by default, always. Pre-ticking a consent box is not consent.
      acceptedConsent: false,
      leadId: '',
    },
  });

  /**
   * Prefill from the lead modal, when the visitor arrived by completing it.
   *
   * Runs once on mount. sessionStorage is not available during SSR, so this
   * cannot be a defaultValue — reading it in an effect also keeps the server
   * and client markup identical and avoids a hydration mismatch.
   */
  useEffect(() => {
    const prefill = consumeLeadPrefill();
    if (!prefill) return;

    reset({
      leadId: prefill.leadId ?? '',
      // Fall back to today, not to empty, if the modal captured no date.
      date: prefill.visitDate ?? todayISO(),
      visitors:
        prefill.visitors && prefill.visitors >= 1 && prefill.visitors <= VISITOR_PACK_MAX_VISITORS
          ? prefill.visitors
          : 1,
      customerName: prefill.name ?? '',
      customerEmail: prefill.email ?? '',
      // Never carried over from step 1 — consent is given on this page, next
      // to the price and the policy links it actually refers to.
      acceptedConsent: false,
    });
  }, [reset]);

  // useWatch rather than watch(): the latter is not memoization-safe and the
  // React compiler lint rejects it.
  const watchedVisitors = useWatch({ control, name: 'visitors' });
  const visitors = Number(watchedVisitors) || 1;

  // Echo the chosen date back in the summary, in the visitor's own language.
  const watchedDate = useWatch({ control, name: 'date' });
  const formattedDate = watchedDate
    ? new Date(`${watchedDate}T00:00:00`).toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';
  // Integer cents throughout, formatted only at the point of display — the
  // same arithmetic the server does, so the two totals cannot disagree.
  const totalCents = VISITOR_PACK_PRICE_EUR_CENTS * visitors;

  async function onSubmit(data: FormData) {
    setServerError(null);

    if (!paymentsEnabled) {
      setServerError(t('errors.disabled'));
      return;
    }

    /*
     * One name field on screen, two on the wire. Splitting on the last space
     * keeps multi-part first names intact ("Anne Marie Dupont" -> "Anne Marie"
     * + "Dupont"), which matters because this name goes on the order record.
     */
    const parts = data.customerName.trim().split(/\s+/);
    const lastName = parts.length > 1 ? parts.pop()! : '—';
    const firstName = parts.join(' ');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitDate: data.date,
          quantity: data.visitors,
          locale,
          customer: { firstName, lastName, email: data.customerEmail },
          // Three ticks, three fields. Never derived from one another.
          consent: {
            waiverAndTerms: data.acceptedConsent,
          },
        }),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        setServerError(
          payload?.error === 'consent_required'
            ? t('errors.consent')
            : payload?.error === 'visit_date_in_past'
              ? t('errors.pastDate')
              : payload?.error === 'booking_not_open' ||
                  payload?.error === 'checkout_unavailable' ||
                  payload?.error === 'payment_setup_failed'
                ? t('errors.disabled')
                : t('errors.generic')
        );
        return;
      }

      // The card form replaces this one; nothing is charged until the customer
      // submits it, and the order stays cancellable until the code is sent.
      setPayment({ clientSecret: payload.clientSecret, orderId: payload.orderId });
    } catch {
      setServerError(t('errors.generic'));
    }
  }

  const inputCls =
    'w-full border border-[rgba(232,163,61,0.20)] rounded-lg px-4 py-2.5 text-sm text-[#F5E8CC] placeholder:text-[#C4A882]/40 focus:outline-none focus:ring-2 focus:ring-[#C4452D]/30 focus:border-[#C4452D] transition-colors bg-[#2E1F12]';
  const errCls = 'text-xs text-[#C4452D] mt-1';
  const labelCls = 'block text-sm font-semibold text-[#F5E8CC] mb-1.5';

  /*
   * Step two. The details form is replaced rather than hidden, so there is one
   * thing on screen to do and no way to edit the visit date underneath a
   * Payment Intent that was priced for the old one.
   */
  if (payment) {
    return (
      <div className="bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-6 sm:p-7" id="checkout">
        <h2
          className="font-bold text-[#F5E8CC] mb-2"
          style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem' }}
        >
          {t('title')}
        </h2>
        <p className="mb-5 text-sm text-[#C4A882]">
          {formatEUR(totalCents)} — {visitors} {visitors === 1 ? 'visitor' : 'visitors'} · {payment.orderId}
        </p>
        <SharedPaymentElement
          clientSecret={payment.clientSecret}
          amountLabel={formatEUR(totalCents)}
          returnUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/${locale}/visitor-pack/confirmation?order=${payment.orderId}`}
          publishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-6 sm:p-7"
      id="checkout"
    >
      {/* Carries the step-1 Lead id through to the API. Not sensitive: an
          opaque cuid that only ever lets checkout overwrite the visitor's
          own name/date/party size on their own lead row. */}
      <input {...register('leadId')} type="hidden" />
      <h2
        className="font-bold text-[#F5E8CC] mb-5"
        style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem' }}
      >
        {t('title')}
      </h2>

      <div className="space-y-5">
        <div>
          <label htmlFor="vp-date" className={labelCls}>
            <Calendar size={13} className="inline me-1.5 -mt-0.5 text-[#E8A33D]" />
            {t('dateLabel')} <span className="text-[#C4452D]">*</span>
          </label>
          {/* Controller rather than register(): the picker is a button and a
              grid, not an <input>, so there is no native event for RHF to
              subscribe to. */}
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <DatePicker
                id="vp-date"
                value={field.value}
                onChange={field.onChange}
                min={todayISO()}
                locale={locale}
                invalid={Boolean(errors.date)}
                labels={{
                  field: t('dateLabel'),
                  today: tDate('today'),
                  tomorrow: tDate('tomorrow'),
                  previousMonth: tDate('previousMonth'),
                  nextMonth: tDate('nextMonth'),
                }}
              />
            )}
          />
          {errors.date && <p className={errCls}>{t('errors.pastDate')}</p>}
        </div>

        <div>
          <label htmlFor="vp-visitors" className={labelCls}>
            <Users size={13} className="inline me-1.5 -mt-0.5 text-[#E8A33D]" />
            {t('visitorsLabel')} <span className="text-[#C4452D]">*</span>
          </label>
          {/* Typed, not a dropdown: a 20-option select is a long scroll on a
              phone for a number most people already know. `type="number"`
              still offers steppers on desktop, and inputMode="numeric" brings
              up the digit keypad on mobile rather than the full keyboard. */}
          <input
            id="vp-visitors"
            {...register('visitors', { valueAsNumber: true })}
            type="number"
            inputMode="numeric"
            min={1}
            max={VISITOR_PACK_MAX_VISITORS}
            step={1}
            // react-hook-form applies its defaultValue on hydration, which
            // left this box visibly empty on first paint (the old <select>
            // showed "1" straight away because a select falls back to its
            // first option). Rendering the same 1 server-side removes the
            // flash; RHF still owns the value from mount onward.
            defaultValue={1}
            aria-describedby={errors.visitors ? 'vp-visitors-error' : undefined}
            className={`${inputCls} ${errors.visitors ? 'border-[#C4452D]' : ''}`}
          />
          {/* `min`/`max` on the element are a hint, not a guarantee — the
              value can still be typed or pasted out of range, so the same
              bounds are enforced by the zod schema here and again by the
              API route. */}
          {errors.visitors && (
            <p id="vp-visitors-error" role="alert" className={errCls}>
              {t('errors.visitors', { max: VISITOR_PACK_MAX_VISITORS })}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="vp-name" className={labelCls}>
            {t('nameLabel')} <span className="text-[#C4452D]">*</span>
          </label>
          <input
            id="vp-name"
            {...register('customerName')}
            type="text"
            autoComplete="name"
            placeholder={t('namePlaceholder')}
            className={inputCls}
          />
          {errors.customerName && <p className={errCls}>{t('errors.name')}</p>}
        </div>

        <div>
          <label htmlFor="vp-email" className={labelCls}>
            {t('emailLabel')} <span className="text-[#C4452D]">*</span>
          </label>
          <input
            id="vp-email"
            {...register('customerEmail')}
            type="email"
            autoComplete="email"
            placeholder={t('emailPlaceholder')}
            className={inputCls}
          />
          {errors.customerEmail && <p className={errCls}>{t('errors.email')}</p>}
        </div>
      </div>

      {/* Order summary — OTA-style: product, when, who, what's included,
          one total. The itemised cost split that used to sit here was
          removed on the owner's instruction; see PackInclusions for where
          the §3.2 official-price disclosure lives now. */}
      <div className="mt-7 rounded-xl border border-[rgba(232,163,61,0.20)] bg-[#2E1F12]/50 p-5">
        <p className="text-xs uppercase tracking-wider text-[#C4A882] font-semibold">
          {t('summaryTitle')}
        </p>

        <p className="mt-3 font-semibold text-[#F5E8CC] leading-snug">{t('productName')}</p>

        <div className="mt-3 space-y-1.5 text-sm text-[#C4A882]">
          <p className="flex items-center gap-2">
            <Calendar size={13} className="shrink-0 text-[#E8A33D]" aria-hidden="true" />
            {formattedDate || '—'}
          </p>
          <p className="flex items-center gap-2">
            <Users size={13} className="shrink-0 text-[#E8A33D]" aria-hidden="true" />
            {visitors} × €{formatEURAmount(VISITOR_PACK_PRICE_EUR_CENTS)}
          </p>
        </div>

        {/* What's included, with the cost split collapsed inside it. */}
        <PackInclusions className="mt-4 pt-4 border-t border-[rgba(232,163,61,0.20)]" />

        <div className="flex items-baseline justify-between mt-4 pt-4 border-t border-[rgba(232,163,61,0.20)]">
          <span className="font-bold text-[#F5E8CC]">{t('totalLabel')}</span>
          <span
            className="font-bold text-2xl text-[#E8A33D] tabular-nums"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            €{formatEURAmount(totalCents)}
          </span>
        </div>
      </div>

      {/* Test-mode warning at the point of payment, where confusing test for
          live would actually matter. Mirrors the page-level banner. */}
      {testMode && (
        <p className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-[#E8A33D]/40 bg-[#7A2E12]/40 px-3 py-2.5 text-xs font-semibold text-[#F5C96A]">
          <FlaskConical size={13} className="shrink-0" aria-hidden="true" />
          {tTest('badge')} — {tTest('message')}
        </p>
      )}

      {/* Terms of Sale & cancellation policy — mandatory, unticked by default.
          Placed immediately above the pay button so the thing being consented
          to is on screen at the moment of consent. The server rejects the
          request without it; this is the visible half of that check. */}
      {/* One tick, two statements.

          The waiver sentence is plain text in the label; only the Terms and
          cancellation-policy titles are links. That is what lets a single box
          still carry weight: Articles 16(a) and 16(m) want the buyer to have
          acknowledged losing the 14-day right, and an acknowledgment sitting
          behind a link they never opened is not one. Merging down to "I accept
          the Terms" alone would have discarded exactly that.

          Placed immediately above the pay button so the thing being consented
          to is on screen at the moment of consent. The server rejects the
          request without it; this is the visible half of that check. */}
      <div className="mt-6">
        <label
          htmlFor="vp-consent"
          className="flex cursor-pointer items-start gap-3 rounded-xl border border-[rgba(232,163,61,0.20)] bg-[#2E1F12]/50 p-4 transition-colors hover:border-[rgba(232,163,61,0.35)]"
        >
          <input
            id="vp-consent"
            {...register('acceptedConsent')}
            type="checkbox"
            aria-describedby={errors.acceptedConsent ? 'vp-consent-error' : undefined}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#C4452D]"
          />
          <span className="text-sm leading-relaxed text-[#C4A882]">
            {t.rich('acceptCombined', {
              terms: (chunks) => (
                <Link
                  href="/legal/terms"
                  target="_blank"
                  className="text-[#E8A33D] underline underline-offset-2 hover:text-[#F5C96A]"
                >
                  {chunks}
                </Link>
              ),
              refund: (chunks) => (
                <Link
                  href="/legal/refunds"
                  target="_blank"
                  className="text-[#E8A33D] underline underline-offset-2 hover:text-[#F5C96A]"
                >
                  {chunks}
                </Link>
              ),
            })}{' '}
            <span className="text-[#C4452D]">*</span>
          </span>
        </label>
        {errors.acceptedConsent && (
          <p id="vp-consent-error" role="alert" className={errCls}>
            {t('errors.consent')}
          </p>
        )}
      </div>

      <div className="mt-6">
        {paymentsEnabled ? (
          <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
            <CreditCard size={16} />
            {isSubmitting ? t('submitting') : t('submit')}
          </Button>
        ) : (
          /* PAYMENTS_ENABLED=false — the button renders but cannot start checkout. */
          <div>
            <Button type="button" variant="outline" size="lg" disabled className="w-full">
              <Lock size={16} />
              {tHero('ctaDisabled')}
            </Button>
            <p className="text-xs text-[#C4A882] text-center mt-2">{tHero('ctaDisabledHint')}</p>
          </div>
        )}

        {paymentsEnabled && (
          <p className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-[#8FA63C]/25 bg-[#8FA63C]/10 px-3.5 py-2.5 text-center text-xs leading-relaxed text-[#C4A882]">
            <Lock size={13} className="shrink-0 text-[#8FA63C]" aria-hidden="true" />
            <span>
              {t.rich('securePayment', {
                b: (chunks) => <strong className="font-semibold text-[#F5E8CC]">{chunks}</strong>,
              })}
            </span>
          </p>
        )}

        {serverError && (
          <p role="alert" className="text-sm text-[#C4452D] text-center mt-3">
            {serverError}
          </p>
        )}

        <p className="text-xs text-[#C4A882] text-center mt-4 leading-relaxed">
          {t.rich('legalNotice', {
            terms: (chunks) => (
              <Link href="/legal/terms" className="text-[#E8A33D] underline underline-offset-2 hover:text-[#F5C96A]">
                {chunks}
              </Link>
            ),
            refund: (chunks) => (
              <Link href="/legal/refunds" className="text-[#E8A33D] underline underline-offset-2 hover:text-[#F5C96A]">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </form>
  );
}
