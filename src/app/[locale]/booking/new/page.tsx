import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { BookingForm } from '@/components/booking/BookingForm';
import { isValidTicketSlug, TICKET_NAME_KEYS } from '@/lib/ticket-data';
import type { Metadata } from 'next';

interface Props {
  params:       Promise<{ locale: string }>;
  searchParams: Promise<{ ticket?: string; date?: string; adults?: string; children?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Complete Your Booking — Bahia Palace Tickets',
    robots: { index: false, follow: true },
  };
}

export default async function BookingNewPage({ params, searchParams }: Props) {
  const { locale }                             = await params;
  const { ticket, date, adults = '2', children = '0' } = await searchParams;

  if (!ticket || !isValidTicketSlug(ticket) || !date) notFound();

  const t         = await getTranslations('tickets');
  const tb        = await getTranslations('breadcrumb');
  const nameKey   = TICKET_NAME_KEYS[ticket];
  const ticketName = t(`${nameKey}.name` as any) as string;
  const adultsNum  = Math.max(1, parseInt(adults, 10) || 1);
  const childrenNum = Math.max(0, parseInt(children, 10) || 0);

  return (
    <div className="min-h-screen bg-[#1C1108]">
      <div className="bg-[#251A0F] border-b border-[rgba(232,163,61,0.15)] px-6 py-10 md:px-10">
        <div className="max-w-5xl mx-auto">
          <Breadcrumb variant="light" items={[
            { label: tb('home'),    href: '/' },
            { label: tb('tickets'), href: `/tickets/${ticket}` },
            { label: 'Checkout' },
          ]} />
          <h1
            className="mt-5 text-white font-bold"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
          >
            Complete Your Booking
          </h1>
          <p className="mt-1 text-white/70 text-sm">Step 1 of 2 — Your details</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <BookingForm
          ticket={ticket}
          ticketName={ticketName}
          date={date}
          adults={adultsNum}
          children={childrenNum}
          locale={locale}
        />
      </div>
    </div>
  );
}
