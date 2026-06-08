import { getTranslations, getLocale } from 'next-intl/server';
import Image from 'next/image';
import { Check, X, MapPin, Clock, ChevronDown } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Breadcrumb } from './Breadcrumb';
import { BookingWidget } from './BookingWidget';
import { JsonLd } from '@/components/seo/JsonLd';
import { BASE, DIGITAL_TICKET_OFFER_EXTRAS } from '@/lib/seo';

export type TicketKey = 'skipTheLine' | 'guidedTour' | 'privateTour' | 'combo';

interface Props {
  ticketKey: TicketKey;
  slug: string;
  price: number;
}

/* ── Bahia Palace photos ──────────────────────────────────────────
   A: courtyard arches  B: painted ceiling  C: tiled hallway
   D: marble fountain   E: zellige courtyard
   ────────────────────────────────────────────────────────────── */
const BP_A = '/images/gallery/bahia-palace-main-gate-lanterns-full-view.jpg';
const BP_B = '/images/gallery/bahia-palace-octagonal-cedar-ceiling-carved-wood.jpg';
const BP_C = '/images/gallery/bahia-palace-grand-courtyard-balcony-view-fountain.jpg';
const BP_D = '/images/gallery/bahia-palace-inner-courtyard-central-fountain-stucco.jpg';
const BP_E = '/images/gallery/bahia-palace-zellige-mosaic-arabic-calligraphy-stucco.jpg';

const HERO_IMAGES: Record<TicketKey, string> = {
  skipTheLine:  BP_A,
  guidedTour:   BP_B,
  privateTour:  BP_C,
  combo:        BP_D,
};

const GALLERY_IMAGES: Record<TicketKey, [string, string, string]> = {
  skipTheLine:  [BP_E, BP_B, BP_C],
  guidedTour:   [BP_A, BP_E, BP_D],
  privateTour:  [BP_B, BP_A, BP_E],
  combo:        [BP_D, BP_C, BP_A],
};

const ALL_TICKETS: { key: TicketKey; slug: string; price: number; live: boolean }[] = [
  { key: 'skipTheLine',  slug: 'skip-the-line',       price: 10, live: true  },
  { key: 'guidedTour',   slug: 'guided-tour',          price: 10, live: false },
  { key: 'privateTour',  slug: 'private-tour',         price: 10, live: false },
  { key: 'combo',        slug: 'combo-saadian-tombs',  price: 10, live: false },
];

function ComingSoonWidget({ ticketName }: { ticketName: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8D5B7] shadow-[0_4px_24px_rgba(61,40,23,0.1)] overflow-hidden">
      <div className="bg-[#3D2817] px-5 py-3.5 text-center">
        <p className="text-[#E8A33D] text-[11px] font-bold uppercase tracking-[0.2em] mb-0.5">
          Coming Soon
        </p>
        <p className="text-white text-sm font-semibold leading-snug">
          {ticketName}
        </p>
      </div>
      <div className="p-6 space-y-4 text-center">
        <p className="text-sm text-[#5C3D20] leading-relaxed">
          We&apos;re putting the final touches on this experience. Only our skip-the-line ticket is available right now.
        </p>
        <a
          href="/tickets/skip-the-line"
          className="flex items-center justify-center gap-2 w-full bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          Book Skip-the-Line Instead
        </a>
        <a
          href="/contact"
          className="block text-sm text-[#8B6344] hover:text-[#3D2817] underline transition-colors"
        >
          Contact us to be notified when this launches
        </a>
      </div>
    </div>
  );
}

export async function TicketDetailPage({ ticketKey, slug, price }: Props) {
  const locale = await getLocale();
  const t  = await getTranslations('tickets');
  const td = await getTranslations('ticketDetail');
  const tf = await getTranslations('faq');
  const tb = await getTranslations('breadcrumb');

  const name         = t(`${ticketKey}.name`         as any) as string;
  const tagline      = t(`${ticketKey}.tagline`       as any) as string;
  const duration     = t(`${ticketKey}.duration`      as any) as string;
  const longDesc     = t(`${ticketKey}.longDesc`      as any) as string;
  const meetingPoint = t(`${ticketKey}.meetingPoint`  as any) as string;
  const includes     = t.raw(`${ticketKey}.includes`  as any) as string[];
  const excludes     = t.raw(`${ticketKey}.excludes`  as any) as string[];
  const faqItems     = tf.raw('items') as Array<{ question: string; answer: string }>;
  const isLive       = ALL_TICKETS.find((tk) => tk.key === ticketKey)?.live ?? true;
  const related      = ALL_TICKETS.filter((tk) => tk.key !== ticketKey && tk.live);
  const heroImg      = HERO_IMAGES[ticketKey];
  const gallery      = GALLERY_IMAGES[ticketKey];

  const pageUrl = `${BASE}/${locale}/tickets/${slug}`;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: tagline,
    image: `${BASE}${heroImg}`,
    url: pageUrl,
    brand: { '@type': 'Brand', name: 'Bahia Palace Tickets' },
    offers: {
      '@type': 'Offer',
      url: pageUrl,
      priceCurrency: 'USD',
      price: price.toFixed(2),
      priceValidUntil: '2026-12-31',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Bahia Palace Tickets' },
      ...DIGITAL_TICKET_OFFER_EXTRAS,
    },
  };

  return (
    <div className="bg-[#FAF3E7] min-h-screen">
      <JsonLd data={productSchema} />
      {/* ── Hero ── */}
      <div className="relative h-56 sm:h-72 md:h-[500px]">
        <Image
          src={heroImg}
          alt={`${name} - Bahia Palace`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3D2817]/55 via-[#3D2817]/25 to-[#3D2817]/65" />
        <div className="absolute inset-0 flex flex-col justify-between px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto w-full left-0 right-0">
          <Breadcrumb
            variant="light"
            items={[
              { label: tb('home'),    href: '/' },
              { label: tb('tickets'), href: '/tickets' },
              { label: name },
            ]}
          />
          <div>
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full mb-3">
              <Clock size={11} />
              {duration}
            </span>
            <h1
              className="text-white font-bold mb-2 leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
            >
              {name}
            </h1>
            <p className="text-white/85 text-lg">{tagline}</p>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left column */}
          <div className="lg:col-span-7 space-y-10">

            {/* Description */}
            <p
              className="text-[#3D2817] leading-relaxed"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}
            >
              {longDesc}
            </p>

            {/* Gallery */}
            <div>
              <h2
                className="text-xl font-bold text-[#3D2817] mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {td('gallery')}
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:gap-3" style={{ gridTemplateRows: 'auto auto' }}>
                <div className="relative rounded-xl overflow-hidden row-span-2" style={{ height: 'clamp(160px,45vw,240px)' }}>
                  <Image src={gallery[0]} alt={`${name} 1`} fill className="object-cover" sizes="(max-width:768px) 50vw, 280px" />
                </div>
                <div className="relative rounded-xl overflow-hidden" style={{ height: 'clamp(76px,21vw,114px)' }}>
                  <Image src={gallery[1]} alt={`${name} 2`} fill className="object-cover" sizes="(max-width:768px) 50vw, 200px" />
                </div>
                <div className="relative rounded-xl overflow-hidden" style={{ height: 'clamp(76px,21vw,114px)' }}>
                  <Image src={gallery[2]} alt={`${name} 3`} fill className="object-cover" sizes="(max-width:768px) 50vw, 200px" />
                </div>
              </div>
            </div>

            {/* Includes / Excludes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h2
                  className="text-lg font-bold text-[#3D2817] mb-4"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {td('includes')}
                </h2>
                <ul className="space-y-2.5">
                  {includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#3D2817]">
                      <Check size={15} className="text-[#6B7B3A] mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2
                  className="text-lg font-bold text-[#3D2817] mb-4"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {td('excludes')}
                </h2>
                <ul className="space-y-2.5">
                  {excludes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#5C3D20]">
                      <X size={15} className="text-[#C4452D]/50 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Meeting point + hours */}
            <div className="bg-white rounded-xl border border-[#E8D5B7] p-5 space-y-4">
              <div className="flex gap-3">
                <MapPin size={18} className="text-[#C4452D] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#3D2817] mb-1">{td('meetingPoint')}</p>
                  <p className="text-sm text-[#5C3D20] leading-relaxed">{meetingPoint}</p>
                </div>
              </div>
              <div className="border-t border-[#F0E5D0] pt-4 flex gap-3">
                <Clock size={18} className="text-[#C4452D] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#3D2817] mb-1">{td('openingHours')}</p>
                  <p className="text-sm text-[#5C3D20]">{td('openingHoursVal')}</p>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div>
              <h2
                className="text-2xl font-bold text-[#3D2817] mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {td('faqTitle')}
              </h2>
              <div className="space-y-3">
                {faqItems.slice(0, 4).map((item, i) => (
                  <details
                    key={i}
                    className="group bg-white rounded-xl border border-[#E8D5B7] overflow-hidden"
                  >
                    <summary className="flex items-center justify-between gap-3 p-5 cursor-pointer list-none font-semibold text-sm text-[#3D2817] hover:text-[#C4452D] transition-colors">
                      {item.question}
                      <ChevronDown size={15} className="shrink-0 transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <div className="px-5 pb-5 pt-3 text-sm text-[#5C3D20] leading-relaxed border-t border-[#F0E5D0]">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — booking widget */}
          <div className="lg:col-span-5">
            <div id="book" className="sticky top-24">
              {isLive
                ? <BookingWidget price={price} slug={slug} ticketName={name} />
                : <ComingSoonWidget ticketName={name} />
              }
            </div>
          </div>
        </div>

        {/* ── Related tickets ── */}
        {related.length > 0 && (
        <div className="mt-16 pt-10 border-t border-[#E8D5B7]">
          <h2
            className="text-2xl font-bold text-[#3D2817] mb-8 text-center"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {td('alsoConsider')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((rel) => {
              const relName    = t(`${rel.key}.name`    as any) as string;
              const relTagline = t(`${rel.key}.tagline` as any) as string;
              const relImg     = HERO_IMAGES[rel.key];
              return (
                <Link
                  key={rel.slug}
                  href={`/tickets/${rel.slug}` as any}
                  className="group moroccan-card overflow-hidden flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={relImg}
                      alt={relName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width:640px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3D2817]/50 to-transparent" />
                  </div>
                  <div className="p-5 flex-1">
                    <h3
                      className="font-bold text-[#3D2817] mb-1"
                      style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}
                    >
                      {relName}
                    </h3>
                    <p className="text-sm text-[#5C3D20] mb-3 leading-snug">{relTagline}</p>
                    <p className="text-[#C4452D] font-bold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      {t('from')} ${rel.price}
                      <span className="text-xs font-normal text-[#5C3D20] ml-1">{t('perPerson')}</span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
