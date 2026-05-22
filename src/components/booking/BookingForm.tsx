'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Check, Calendar, Users, CreditCard } from 'lucide-react';
import type { TicketSlug } from '@/lib/ticket-data';
import { TICKET_PRICES } from '@/lib/ticket-data';

const schema = z.object({
  customerName:    z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail:   z.string().email('Please enter a valid email'),
  customerPhone:   z.string().optional(),
  specialRequests: z.string().max(300).optional(),
});
type FormData = z.infer<typeof schema>;

interface BookingFormProps {
  ticket:     TicketSlug;
  ticketName: string;
  date:       string;
  adults:     number;
  children:   number;
  locale:     string;
}

export function BookingForm({ ticket, ticketName, date, adults, children, locale }: BookingFormProps) {
  const t = useTranslations('ticketDetail');
  const router = useRouter();
  const price = TICKET_PRICES[ticket];
  const total = adults * price;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket, date, adults, children, locale, ...data }),
    });

    if (!res.ok) {
      alert('Something went wrong. Please try again or contact us via WhatsApp.');
      return;
    }

    const { url } = await res.json() as { url: string };
    if (url.startsWith('/')) {
      router.push(url as any);
    } else {
      window.location.href = url;
    }
  }

  const inputCls = 'w-full border border-[#D4BC96] rounded-lg px-4 py-2.5 text-sm text-[#3D2817] placeholder:text-[#5C3D20]/40 focus:outline-none focus:ring-2 focus:ring-[#C4452D]/30 focus:border-[#C4452D] transition-colors bg-white';
  const errCls   = 'text-xs text-[#C4452D] mt-1';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      {/* Customer details form */}
      <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#3D2817] mb-1.5">
            Full name <span className="text-[#C4452D]">*</span>
          </label>
          <input
            {...register('customerName')}
            type="text"
            autoComplete="name"
            placeholder="Jean Dupont"
            className={inputCls}
          />
          {errors.customerName && <p className={errCls}>{errors.customerName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#3D2817] mb-1.5">
            Email address <span className="text-[#C4452D]">*</span>
          </label>
          <input
            {...register('customerEmail')}
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            className={inputCls}
          />
          {errors.customerEmail && <p className={errCls}>{errors.customerEmail.message}</p>}
          <p className="text-xs text-[#5C3D20] mt-1">Your ticket will be sent here.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#3D2817] mb-1.5">
            Phone number <span className="text-[#5C3D20] font-normal">(optional)</span>
          </label>
          <input
            {...register('customerPhone')}
            type="tel"
            autoComplete="tel"
            placeholder="+33 6 12 34 56 78"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#3D2817] mb-1.5">
            Special requests <span className="text-[#5C3D20] font-normal">(optional)</span>
          </label>
          <textarea
            {...register('specialRequests')}
            rows={3}
            placeholder="Accessibility needs, language preferences, group size notes…"
            className={`${inputCls} resize-none`}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
            <CreditCard size={16} />
            {isSubmitting ? 'Processing…' : `Pay $${total} — Confirm Booking`}
          </Button>
          <div className="mt-4 space-y-1.5">
            {(['Instant confirmation by email', 'Free cancellation up to 24h', 'Secure mock payment (Phase A)'] as const).map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-[#5C3D20]">
                <Check size={12} className="text-[#6B7B3A] shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </form>

      {/* Order summary */}
      <div className="lg:col-span-2">
        <div className="bg-[#3D2817] text-white rounded-2xl p-6 lg:sticky top-24">
          <h2 className="font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem' }}>
            Order Summary
          </h2>
          <div className="space-y-3 mb-5 pb-5 border-b border-white/15">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Ticket</p>
              <p className="font-semibold text-sm">{ticketName}</p>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <p className="text-white/60 text-xs uppercase tracking-wide mb-1 flex items-center gap-1">
                  <Calendar size={10} /> Date
                </p>
                <p className="font-semibold text-sm">{date}</p>
              </div>
              <div className="flex-1">
                <p className="text-white/60 text-xs uppercase tracking-wide mb-1 flex items-center gap-1">
                  <Users size={10} /> Visitors
                </p>
                <p className="font-semibold text-sm">
                  {adults} adult{adults !== 1 ? 's' : ''}
                  {children > 0 && `, ${children} child${children !== 1 ? 'ren' : ''}`}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-white/70 text-sm">
              {adults} × ${price}
            </span>
            <span className="text-white/70 text-sm">${adults * price}</span>
          </div>
          {children > 0 && (
            <div className="flex items-center justify-between mb-1">
              <span className="text-white/70 text-sm">{children} child{children !== 1 ? 'ren' : ''}</span>
              <span className="text-[#6B7B3A] text-sm font-semibold">{t('childFree')}</span>
            </div>
          )}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/15">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-2xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              ${total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
