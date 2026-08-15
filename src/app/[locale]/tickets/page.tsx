import { getTranslations } from 'next-intl/server';
import { TicketSection } from '@/components/homepage/TicketSection';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Metadata } from 'next';
import { buildAlternates, buildOG, buildBreadcrumbSchema, BASE } from '@/lib/seo';
import { SKIP_THE_LINE_PRICE_EUR } from '@/config/pricing';

export const revalidate = 86400;

interface Props {
  params: Promise<{ locale: string }>;
}

/*
 * These descriptions said "book directly on the official portal — no booking
 * fees", which was two problems in one line.
 *
 * It sent the reader away. This is the page that ranks, and its meta
 * description pointed at somebody else's checkout.
 *
 * And "no booking fees" stopped being true the moment the pack went on sale.
 * The €11.99 is a service price covering the ticket, the audio guide and
 * support — not a ticket with a fee bolted on. Describing that as "no fees"
 * while charging more than the gate price is the kind of phrasing that is
 * technically arguable and indefensible in front of a regulator, which is why
 * the go-live checklist lists it for removal.
 *
 * What replaces it says what the page is for and what the price includes.
 */
const TICKETS_META: Record<string, { title: string; description: string }> = {
  /*
   * The titles used to end "— Skip-the-Line, Guided & Private" and the
   * descriptions offered to compare all three. Two of the three do not exist:
   * guided-tour and private-tour are 307s to skip-the-line, along with
   * combo-saadian-tombs (COMING_SOON_SLUGS in next.config.mjs).
   *
   * That is worse in the title than in the description, because the title IS
   * the link. Someone searching for a private tour of the Bahia Palace was
   * being invited to click a result naming one, and landing on a page selling a
   * single product. The click is spent, the visitor leaves, and Google reads
   * the bounce as this page failing the query it was ranked for.
   *
   * Now: one product, its price, what it includes — under 155 characters so
   * none of it is cut off.
   */
  /*
   * THIS PAGE HAS NO CHECKOUT. /visitor-pack does, and it is the only page on
   * the site that does. So the two must not chase the same words: three pages
   * here — home, this one and /visitor-pack — all opened on "Bahia Palace
   * Tickets", which leaves Google to pick one and rank the other two below it.
   *
   * The split, by what the searcher is trying to do:
   *   /visitor-pack  buying    "book Bahia Palace tickets"  — has the checkout
   *   /tickets       comparing "Bahia Palace ticket prices" — this page
   *   /[locale]      visiting  "Bahia Palace hours, guide"  — the home page
   *
   * Giving the buy-intent words to the page that can actually take the money is
   * the defensible default. Which page deserves the bare phrase "Bahia Palace
   * tickets" is a question the Search Console query list would settle, and it
   * has not been read yet — this removes the overlap rather than guessing at
   * the ranking.
   */
  en: { title: `Bahia Palace Ticket Prices 2026 — Fees & What's Included`, description: `Bahia Palace entry ticket, audio guide and WhatsApp support for €11.99 per person. Free cancellation until we send it. Open daily 9:00–17:00.` },
  fr: { title: `Tarifs billets Palais Bahia 2026 — Prix et contenu`, description: `Billet d'entrée Palais Bahia, audioguide et assistance WhatsApp pour 11,99 € par personne. Annulation gratuite. Ouvert tous les jours 9h–17h.` },
  es: { title: `Precios entradas Palacio Bahía 2026 — Tarifas incluidas`, description: `Entrada al Palacio Bahía, audioguía y ayuda por WhatsApp por 11,99 € por persona. Cancelación gratuita. Abierto todos los días 9:00–17:00.` },
  de: { title: `Bahia Palast Ticketpreise 2026 — Preise & Leistungen`, description: `Bahia-Palast Eintrittsticket, Audioguide und WhatsApp-Support für 11,99 € pro Person. Kostenlose Stornierung. Täglich 9–17 Uhr geöffnet.` },
  it: { title: `Prezzi biglietti Palazzo Bahia 2026 — Tariffe e servizi`, description: `Biglietto d'ingresso Palazzo Bahia, audioguida e assistenza WhatsApp a 11,99 € a persona. Cancellazione gratuita. Aperto ogni giorno 9:00–17:00.` },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = TICKETS_META[locale] ?? TICKETS_META.en;
  return {
    title: meta.title,
    description: meta.description,
    alternates: buildAlternates(locale, '/tickets'),
    openGraph: buildOG(meta.title, meta.description, locale, '/tickets'),
  };
}

const H1_LABELS: Record<string, string> = {
  en: 'Bahia Palace Tickets 2026',
  fr: 'Billets Palais Bahia 2026',
  es: 'Entradas Palacio Bahia 2026',
  de: 'Bahia Palast Tickets 2026',
  it: 'Biglietti Palazzo Bahia 2026',
};

export default async function TicketsPage({ params }: Props) {
  const { locale } = await params;
  const tb = await getTranslations({ locale, namespace: 'breadcrumb' });
  const h1 = H1_LABELS[locale] ?? H1_LABELS.en;

  const ticketsSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: TICKETS_META[locale]?.title ?? TICKETS_META.en.title,
    url: `${BASE}/${locale}/tickets`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Product',
          name: 'Bahia Palace Skip-the-Line Ticket',
          url: `${BASE}/${locale}/tickets/skip-the-line`,
          image: `${BASE}/og-image.jpg`,
          offers: {
            '@type': 'Offer',
            price: SKIP_THE_LINE_PRICE_EUR.toFixed(2),
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            url: `${BASE}/${locale}/tickets/skip-the-line`,
          },
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#1C1108]">
      <JsonLd data={ticketsSchema} />
      <JsonLd data={buildBreadcrumbSchema(locale, [{ name: tb('home'), path: '' }, { name: tb('tickets') }])} />
      <div className="bg-[#251A0F] border-b border-[rgba(232,163,61,0.15)] px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb
            variant="light"
            items={[
              { label: tb('home'), href: '/' },
              { label: tb('tickets') },
            ]}
          />
          <h1
            className="mt-4 font-bold text-white leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
          >
            {h1}
          </h1>
        </div>
      </div>
      <TicketSection />
    </div>
  );
}
