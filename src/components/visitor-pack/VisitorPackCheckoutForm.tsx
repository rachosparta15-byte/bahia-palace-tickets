'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { PackInclusions } from './PackInclusions';
import { SharedPaymentElement } from './SharedPaymentElement';
import { PayPalCheckout } from './PayPalCheckout';
import { DatePicker, toISODate } from '@/components/ui/DatePicker';
import { trackEvent } from '@/lib/analytics';
import { CreditCard, Calendar, Users, Lock, FlaskConical } from 'lucide-react';
import {
  VISITOR_PACK_PRICE_EUR_CENTS,
  VISITOR_PACK_MAX_VISITORS,
  TEASER_PRICE_ENABLED,
  formatEURAmount,
  formatEUR,
} from '@/config/pricing';
import { consumeLeadPrefill } from '@/lib/lead-handoff';
import { earliestVisitDate, BOOKING_LEAD_DAYS } from '@/config/booking-window';

/**
 * The first date on sale, YYYY-MM-DD — today plus the lead time.
 *
 * Used as both the default and the minimum, so the field opens on a date the
 * customer can actually buy. Defaulting to today while today is disabled would
 * show a pre-filled value the pay button then rejects.
 */
function firstBookableISO(): string {
  return earliestVisitDate();
}

// `visitors` is a plain number here, not z.coerce — the select registers with
// valueAsNumber, so react-hook-form hands us a number and the resolver's input
// and output types stay identical.
const schema = z.object({
  date: z.string().min(1),
  visitors: z.number().int().min(1).max(VISITOR_PACK_MAX_VISITORS),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  /*
   * Optional, deliberately.
   *
   * The Terms already promise delivery "by email and, where you have given us
   * a number, by WhatsApp" — a promise the site could never keep, because it
   * never asked. It asks now.
   *
   * Not required: a mandatory phone field costs sales from people who will not
   * give a number to a website, and email delivery works without it. Its other
   * job is to prefill PayPal's own phone box so nobody types it twice.
   */
  customerPhone: z.string().max(32).optional(),
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
  /** Server-evaluated: true when the ACTIVE provider cannot take money. */
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
  /** Set once a PayPal order exists; swaps the form for PayPal's own fields. */
  const [paypal, setPaypal] = useState<{
    orderId: string;
    bookingId: string;
    reference: string;
    clientId: string;
    environment: 'live' | 'sandbox';
    fallbackUrl: string;
  } | null>(null);

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
      // Default to the first bookable day so the field is never an empty
      // "mm/dd/yyyy" and never holds a date the server will refuse. The order
      // summary echoes the full date back in the visitor's language, and the
      // picker highlights it — a pre-filled date must stay obvious, because a
      // wrong visit date is non-refundable once the QR ships (Terms §5, §7).
      date: firstBookableISO(),
      // Unticked by default, always. Pre-ticking a consent box is not consent.
      acceptedConsent: false,
      leadId: '',
    },
  });

  /*
   * The checkout was reached.
   *
   * Nothing on this page was instrumented, so the funnel ended at
   * ticket_cta_click and everything after it was invisible: a click that never
   * arrived here, a form nobody started, and a payment that failed all looked
   * identical from the admin — like a click that produced nothing.
   *
   * This is the event that separates "the site is losing them on the way" from
   * "they get here and the page loses them", which are not the same problem
   * and do not have the same fix.
   */
  useEffect(() => {
    trackEvent('pack_view', { paymentsEnabled, testMode, locale });
    // Once per mount. paymentsEnabled and locale do not change under a mounted
    // form, and re-firing on any future prop change would inflate the top of
    // the funnel against a click count that cannot move.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * And the first time they actually touch it.
   *
   * A page view says they arrived; this says they engaged. Someone who lands
   * and leaves without typing is being lost by the page — the price, the
   * layout, the load — and someone who starts and stops is being lost by the
   * form itself. Fired once, on the first field touched, never on every
   * keystroke.
   */
  const startedRef = useRef(false);
  function noteFormStart() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent('pack_form_start', { locale });
  }

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
      /*
       * Clamped to the booking window, not carried over blindly.
       *
       * The lead modal captures a date for the sales follow-up and accepts
       * anything, including today. Someone who filled it in on Monday and
       * came back to buy on Wednesday would otherwise arrive with a date the
       * calendar now greys out — pre-filled, invisible above the fold, and
       * refused only at the pay button.
       */
      date:
        prefill.visitDate && prefill.visitDate >= firstBookableISO()
          ? prefill.visitDate
          : firstBookableISO(),
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
  // DD/MM/YYYY, matching the picker exactly. The summary and the field must
  // never show the same day in two formats — that is the moment someone
  // decides they picked the wrong one and starts over.
  const formattedDate = watchedDate
    ? `${watchedDate.slice(8, 10)}/${watchedDate.slice(5, 7)}/${watchedDate.slice(0, 4)}`
    : '';
  // Integer cents throughout, formatted only at the point of display — the
  // same arithmetic the server does, so the two totals cannot disagree.
  const totalCents = VISITOR_PACK_PRICE_EUR_CENTS * visitors;

  async function onSubmit(data: FormData) {
    setServerError(null);

    /*
     * Passed the client-side schema — the person filled the form correctly and
     * pressed the button. Everything before this point is measured by
     * pack_view and pack_form_start; everything after is the server's answer.
     */
    trackEvent('pack_submit', { partySize: data.visitors, locale });

    if (!paymentsEnabled) {
      setServerError(t('errors.disabled'));
      trackEvent('pack_blocked', { reason: 'payments_disabled', locale });
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
          customer: {
            firstName,
            lastName,
            email: data.customerEmail,
            // Omitted rather than sent empty: the API treats an absent phone
            // and a blank string differently downstream.
            ...(data.customerPhone?.trim() ? { phone: data.customerPhone.trim() } : {}),
          },
          // Three ticks, three fields. Never derived from one another.
          consent: {
            waiverAndTerms: data.acceptedConsent,
          },
        }),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        /*
         * Every error code the route can return, mapped to the sentence the
         * customer sees. A lookup rather than a ternary chain because the
         * chain had grown to five branches and its indentation no longer
         * matched its nesting — which is how the wrong message gets shown for
         * the wrong failure. Unknown codes fall through to the generic line.
         */
        const messages: Record<string, string> = {
          consent_required: t('errors.consent'),
          visit_date_too_soon: t('errors.tooSoon', { days: BOOKING_LEAD_DAYS }),
          visit_date_in_past: t('errors.pastDate'),
          booking_not_open: t('errors.disabled'),
          checkout_unavailable: t('errors.disabled'),
          payment_setup_failed: t('errors.disabled'),
        };
        setServerError(messages[payload?.error] ?? t('errors.generic'));
        /*
         * The code, not the sentence. "We could not start the payment" is one
         * message covering five different faults, and knowing which one is the
         * difference between fixing a date rule and fixing a credential.
         */
        trackEvent('pack_blocked', {
          reason: payload?.error ?? `http_${res.status}`,
          locale,
        });
        return;
      }

      /*
       * PayPal: approve in place, on this page.
       *
       * The order was opened server-side at a price this browser never
       * supplied; the next step mounts PayPal's card fields and button against
       * it. `redirectUrl` is carried along only so PayPalCheckout can fall
       * back to PayPal's hosted page if the SDK cannot load at all.
       */
      if (payload.paypalOrderId) {
        // An order exists and the card fields are about to mount. Anyone who
        // reaches here and never reaches pack_paid dropped out AT the payment,
        // which is a different problem from dropping out at the form.
        trackEvent('pack_payment_ready', { provider: 'paypal', locale });
        setPaypal({
          orderId: payload.paypalOrderId,
          bookingId: payload.bookingId,
          reference: payload.orderId,
          clientId: payload.paypalClientId,
          environment: payload.paypalEnvironment === 'live' ? 'live' : 'sandbox',
          fallbackUrl: payload.redirectUrl,
        });
        return;
      }

      // Stripe: the card form replaces this one; nothing is charged until the
      // customer submits it, and the order stays cancellable until the code is
      // sent.
      trackEvent('pack_payment_ready', { provider: 'stripe', locale });
      setPayment({ clientSecret: payload.clientSecret, orderId: payload.orderId });
    } catch {
      setServerError(t('errors.generic'));
      // The request never completed — offline, blocked, DNS. Distinct from a
      // server that answered with a refusal, and it needs a different fix.
      trackEvent('pack_blocked', { reason: 'network', locale });
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
  if (paypal) {
    return (
      /*
       * `relative isolate` — the payment step sits above the page, not in it.
       *
       * PayPal's card form is a tall iframe that paints with its own
       * z-indexes. Without a stacking context on the card that contains it,
       * sections further down the page bled through the middle of the form.
       * `overflow-hidden` keeps the iframe's corners inside the rounded card.
       */
      <div
        // scroll-mt-24 clears the fixed header, which is z-50 and would
        // otherwise cover the top of this card when it is scrolled into view.
        className="relative isolate z-10 scroll-mt-24 overflow-hidden bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-6 sm:p-7"
        id="checkout"
      >
        {/* The visit is already chosen by the time this renders. "Choose your
            visit" was on all three steps, so the heading stopped describing
            the screen at the exact moment the screen started asking for
            money. */}
        <h2
          className="font-bold text-[#F5E8CC] mb-2"
          style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem' }}
        >
          {t('payTitle')}
        </h2>
        {/* THE REVEAL.

            While the teaser test runs this is the first and only place the
            visitor sees what they are actually being asked to pay. They came in
            from a button labelled 100 DH and filled a form with no total on it,
            so a one-line "€11.99 — 1 visitor" would land as a correction rather
            than an explanation. The whole order summary moves here instead:
            what the product is, which day, how many people, everything included
            — and then the total, in that order, so the number arrives after the
            reasons for it rather than before.

            This is also the disclosure the sale depends on. Whatever the page
            advertised earlier, nobody reaches PayPal without the real total on
            screen above the button. */}
        {TEASER_PRICE_ENABLED ? (
          <div className="mb-5 rounded-xl border border-[rgba(232,163,61,0.20)] bg-[#2E1F12]/50 p-5">
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

            <p className="mt-3 text-xs text-[#C4A882]/70">{paypal.reference}</p>
          </div>
        ) : (
          <p className="mb-5 text-sm text-[#C4A882]">
            {formatEUR(totalCents)} — {visitors} {visitors === 1 ? 'visitor' : 'visitors'} ·{' '}
            {paypal.reference}
          </p>
        )}
        <PayPalCheckout
          bookingId={paypal.bookingId}
          paypalOrderId={paypal.orderId}
          clientId={paypal.clientId}
          environment={paypal.environment}
          fallbackUrl={paypal.fallbackUrl}
          confirmationUrl={`/${locale}/booking/${paypal.bookingId}`}
          amountLabel={formatEUR(totalCents)}
          locale={locale}
          labels={{
            payWithCard: t('payWithCard'),
            cardNumber: t('cardNumber'),
            expiry: t('expiry'),
            cvv: t('cvv'),
            nameOnCard: t('nameOnCard'),
            pay: t('pay'),
            processing: t('submitting'),
            error: t('errors.generic'),
            orPayPal: t('orPayPal'),
            chooseTitle: t('chooseTitle'),
            chooseHint: t('chooseHint'),
          }}
        />
      </div>
    );
  }

  if (payment) {
    return (
      <div
        className="scroll-mt-24 bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-6 sm:p-7"
        id="checkout"
      >
        <h2
          className="font-bold text-[#F5E8CC] mb-2"
          style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem' }}
        >
          {t('payTitle')}
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
      /*
       * One listener on the form rather than an onFocus on every field.
       * Capturing focus at this level catches the date picker and the party
       * size select as well as the text inputs, and it cannot be forgotten the
       * next time a field is added — which is how instrumentation quietly
       * stops measuring what it claims to.
       */
      onFocusCapture={noteFormStart}
      // scroll-mt-24 clears the fixed header. The ticket CTAs now navigate
      // straight to #checkout, and without this the heading of the form they
      // were sent to sits underneath it.
      className="scroll-mt-24 bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-6 sm:p-7"
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
                min={firstBookableISO()}
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
          {/* Why the first two days are greyed out, said before the customer
              hunts for them. A disabled cell with no explanation reads as a
              broken calendar; this turns it into a stated policy, and it is
              the same reason the Terms give for the lead time. */}
          <p className="mt-1.5 text-xs leading-relaxed text-[#C4A882]/80">
            {t('dateHint', { days: BOOKING_LEAD_DAYS })}
          </p>
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

        <div>
          <label htmlFor="vp-phone" className={labelCls}>
            {t('phoneLabel')}{' '}
            <span className="font-normal text-[#C4A882]/70">{t('phoneOptional')}</span>
          </label>
          <input
            id="vp-phone"
            {...register('customerPhone')}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={t('phonePlaceholder')}
            className={inputCls}
          />
          <p className="mt-1.5 text-xs leading-relaxed text-[#C4A882]/80">{t('phoneHint')}</p>
        </div>
      </div>

      {/* Order summary — OTA-style: product, when, who, what's included,
          one total. The itemised cost split that used to sit here was
          removed on the owner's instruction; see PackInclusions for where
          the §3.2 official-price disclosure lives now.

          Hidden for the duration of the price teaser test, and moved whole to
          the payment step (see the paypal branch above). The form must carry no
          total while the test runs: the visitor arrived from a button labelled
          100 DH, and this panel is the one thing on the page that would do the
          multiplication for them. Set TEASER_PRICE_ENABLED to false and it
          comes straight back here, where it belongs. */}
      {!TEASER_PRICE_ENABLED && (
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
      )}

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
