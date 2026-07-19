'use client';

import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { PriceBreakdown } from './PriceBreakdown';
import { CreditCard, Calendar, Users, Lock, FlaskConical } from 'lucide-react';
import {
  VISITOR_PACK_PRICE_USD,
  VISITOR_PACK_MAX_VISITORS,
} from '@/config/pricing';
import { consumeLeadPrefill } from '@/lib/lead-handoff';

/** Today in YYYY-MM-DD, for the date input's min attribute. */
function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

// `visitors` is a plain number here, not z.coerce — the select registers with
// valueAsNumber, so react-hook-form hands us a number and the resolver's input
// and output types stay identical.
const schema = z.object({
  date: z.string().min(1),
  visitors: z.number().int().min(1).max(VISITOR_PACK_MAX_VISITORS),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
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
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { visitors: 1, date: '' },
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
      date: prefill.visitDate ?? '',
      visitors:
        prefill.visitors && prefill.visitors >= 1 && prefill.visitors <= VISITOR_PACK_MAX_VISITORS
          ? prefill.visitors
          : 1,
      customerName: prefill.name ?? '',
      customerEmail: prefill.email ?? '',
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
  const total = VISITOR_PACK_PRICE_USD * visitors;

  async function onSubmit(data: FormData) {
    setServerError(null);

    // Belt and braces: even if this component were rendered with the wrong
    // prop, don't fire a request that we know should not happen.
    if (!paymentsEnabled) {
      setServerError(t('errors.disabled'));
      return;
    }

    try {
      const res = await fetch('/api/visitor-pack/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setServerError(
          payload?.error === 'payments_disabled'
            ? t('errors.disabled')
            : payload?.error === 'date_in_past'
              ? t('errors.pastDate')
              : t('errors.generic')
        );
        return;
      }

      const { url } = (await res.json()) as { url: string };

      // Mock provider returns an internal path; Stripe returns an absolute URL
      // to its own hosted checkout, which needs a full navigation.
      if (url.startsWith('/')) {
        router.push(url as never);
      } else {
        // assign() rather than `location.href = …`: the React compiler lint
        // treats the assignment as mutating an out-of-scope value.
        window.location.assign(url);
      }
    } catch {
      setServerError(t('errors.generic'));
    }
  }

  const inputCls =
    'w-full border border-[rgba(232,163,61,0.20)] rounded-lg px-4 py-2.5 text-sm text-[#F5E8CC] placeholder:text-[#C4A882]/40 focus:outline-none focus:ring-2 focus:ring-[#C4452D]/30 focus:border-[#C4452D] transition-colors bg-[#2E1F12]';
  const errCls = 'text-xs text-[#C4452D] mt-1';
  const labelCls = 'block text-sm font-semibold text-[#F5E8CC] mb-1.5';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-6 sm:p-7"
      id="checkout"
    >
      <h2
        className="font-bold text-[#F5E8CC] mb-5"
        style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem' }}
      >
        {t('title')}
      </h2>

      <div className="space-y-5">
        <div>
          <label htmlFor="vp-date" className={labelCls}>
            <Calendar size={13} className="inline mr-1.5 -mt-0.5 text-[#E8A33D]" />
            {t('dateLabel')} <span className="text-[#C4452D]">*</span>
          </label>
          <input
            id="vp-date"
            {...register('date')}
            type="date"
            min={todayISO()}
            className={inputCls}
          />
          {errors.date && <p className={errCls}>{t('errors.pastDate')}</p>}
        </div>

        <div>
          <label htmlFor="vp-visitors" className={labelCls}>
            <Users size={13} className="inline mr-1.5 -mt-0.5 text-[#E8A33D]" />
            {t('visitorsLabel')} <span className="text-[#C4452D]">*</span>
          </label>
          <select
            id="vp-visitors"
            {...register('visitors', { valueAsNumber: true })}
            className={inputCls}
          >
            {Array.from({ length: VISITOR_PACK_MAX_VISITORS }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
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

      {/* Order summary — OTA-style: product, when, who, one total.
          The "what's included" line and the /tickets link inside
          PriceBreakdown are required here; see that component. */}
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
            {visitors} × ${VISITOR_PACK_PRICE_USD}
          </p>
        </div>

        <PriceBreakdown className="mt-4 pt-4 border-t border-[rgba(232,163,61,0.20)]" />

        <div className="flex items-baseline justify-between mt-4 pt-4 border-t border-[rgba(232,163,61,0.20)]">
          <span className="font-bold text-[#F5E8CC]">{t('totalLabel')}</span>
          <span
            className="font-bold text-2xl text-[#E8A33D] tabular-nums"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            ${total}
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

        {serverError && (
          <p role="alert" className="text-sm text-[#C4452D] text-center mt-3">
            {serverError}
          </p>
        )}

        <p className="text-xs text-[#C4A882] text-center mt-4 leading-relaxed">
          {t.rich('legalNotice', {
            terms: (chunks) => (
              <Link href="/terms" className="text-[#E8A33D] underline underline-offset-2 hover:text-[#F5C96A]">
                {chunks}
              </Link>
            ),
            refund: (chunks) => (
              <Link href="/refund-policy" className="text-[#E8A33D] underline underline-offset-2 hover:text-[#F5C96A]">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </form>
  );
}
