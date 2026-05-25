import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isValidTicketSlug, TICKET_PRICES, TICKET_NAME_KEYS } from '@/lib/ticket-data';
import { BookingWidget } from '@/components/tickets/BookingWidget';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import prisma from '@/lib/db';

const IMAGES: Record<string, string> = {
  'skip-the-line':       '/images/gallery/bahia-palace-main-gate-lanterns-full-view.jpg',
  'guided-tour':         '/images/gallery/bahia-palace-octagonal-cedar-ceiling-carved-wood.jpg',
  'private-tour':        '/images/gallery/bahia-palace-grand-courtyard-balcony-view-fountain.jpg',
  'combo-saadian-tombs': '/images/gallery/bahia-palace-inner-courtyard-central-fountain-stucco.jpg',
};

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function QuickBookPage({ params }: Props) {
  const { slug, locale } = await params;

  if (!isValidTicketSlug(slug)) notFound();

  const t    = await getTranslations({ locale, namespace: 'tickets' });
  const nameKey = TICKET_NAME_KEYS[slug];
  const name    = t(`${nameKey}.name` as any) as string;
  const duration = t(`${nameKey}.duration` as any) as string;

  // Read price from DB, fall back to static
  let price = TICKET_PRICES[slug];
  try {
    const row = await prisma.ticketType.findUnique({ where: { slug } });
    if (row) price = row.priceAdult;
  } catch { /* use static fallback */ }

  const imgSrc = IMAGES[slug] ?? IMAGES['skip-the-line'];

  return (
    <div className="min-h-screen bg-[#FAF3E7] flex flex-col">

      {/* Thin header bar */}
      <div className="bg-[#3D2817] px-6 py-4 flex items-center justify-between">
        <Link
          href={`/tickets/${slug}` as any}
          className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Back to details</span>
        </Link>
        <div className="text-white font-bold text-sm" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Bahia Palace Tickets
        </div>
        <div className="w-20" /> {/* spacer */}
      </div>

      {/* Main content: ticket info + widget */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left — booking widget */}
          <div>
            <BookingWidget price={price} slug={slug} ticketName={name} />
          </div>

          {/* Right — ticket summary */}
          <div>
            <div className="relative h-56 rounded-2xl overflow-hidden mb-5 shadow-md">
              <Image src={imgSrc} alt={name} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3D2817]/70 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="bg-[#C4452D] text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Available Now
                </span>
              </div>
            </div>

            <h1
              className="text-[#3D2817] font-bold mb-2 leading-snug"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
            >
              {name}
            </h1>

            <div className="flex items-center gap-1.5 text-sm text-[#6B7B3A] mb-5">
              <Clock size={14} />
              <span>{duration}</span>
            </div>

            <div className="space-y-3">
              {[
                { icon: ShieldCheck, text: 'Instant confirmation by email' },
                { icon: ShieldCheck, text: 'Free cancellation up to 24h before' },
                { icon: ShieldCheck, text: 'Mobile ticket accepted at entrance' },
                { icon: ShieldCheck, text: 'Skip the queue — walk straight in' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-sm text-[#5C3D20]">
                  <Icon size={15} className="text-[#6B7B3A] shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
