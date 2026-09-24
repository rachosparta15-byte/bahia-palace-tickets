import { getTranslations } from 'next-intl/server';
import { TicketSection } from '@/components/homepage/TicketSection';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Metadata } from 'next';
import { buildAlternates, buildOG, buildBreadcrumbSchema, BASE, DIGITAL_TICKET_OFFER_EXTRAS } from '@/lib/seo';
import {
  VIATOR_PRICES_USD,
  OFFICIAL_DOOR_PRICE_MAD,
  OFFICIAL_CHILD_DOOR_PRICE_MAD,
  CHILD_AGE_MIN,
  CHILD_AGE_MAX,
} from '@/config/pricing';
import { TICKETS_CONTENT } from './content';

const SKIP_THE_LINE_PRICE = VIATOR_PRICES_USD['skip-the-line']!;

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
   * This page owns the bare phrase "Bahia Palace tickets".
   *
   * It did not, until now. Three pages — home, this one and /visitor-pack —
   * all opened on that phrase, and the overlap was resolved by splitting them
   * by intent and handing the buy-intent words to /visitor-pack, on the
   * reasoning that the page which can take the money should own them. The note
   * that did it was explicit that this was a guess: "Which page deserves the
   * bare phrase ... is a question the Search Console query list would settle,
   * and it has not been read yet."
   *
   * The query list has now been read, and it settles it the other way.
   *
   *   bahia palace tickets     pos 10.9   160 impressions   3 clicks
   *
   * Every other commercial query on this site sits between position 2 and 5 and
   * converts at 10-50%: palacio de la bahia entradas 50% at 2.5, prix palais
   * bahia 12.5% at 5.7. This one query is the outlier, and it is the outlier
   * because the page pointed at it was deliberately aimed elsewhere.
   *
   * The page it was handed to cannot rank at all. /visitor-pack has returned
   * `noindex, nofollow` and the title "Not Found" since 2026-08-22, when PayPal
   * permanently deactivated the account behind the checkout (PAYMENTS_HALTED in
   * lib/payments/guard.ts, hardcoded above the env var). It is also dropped
   * from the sitemap while payments are off. So the phrase was not moved to a
   * better page; it was moved to a page that no longer exists as far as a
   * crawler is concerned, and nothing has held it since.
   *
   * There is no cannibalisation risk in taking it back for exactly that reason.
   * If a processor ever replaces PayPal and /visitor-pack becomes indexable
   * again, this split is worth revisiting — with the query list, not a guess.
   *
   * ── Second pass, on 28 days of page data for the same query ──
   *
   * Taking the phrase back worked: it has moved from position 10.9 to 8.1.
   * What that pass missed is that /visitor-pack was never the only rival.
   * Three other pages are still answering the same query:
   *
   *   /en                        155 impressions   pos 11.8   0 clicks
   *   /en/entrance-fee           148 impressions   pos  9.9   3 clicks
   *   /en/tickets/skip-the-line  138 impressions   pos 11.3   1 click
   *   /en/tickets                113 impressions   pos  8.1   0 clicks
   *
   * 554 impressions, four clicks, and the page that ranks best is the one
   * Google shows least — the signature of a site that has not said which page
   * is the answer. The locales with only one page in the running are where it
   * ranks: /de/tickets at 3.5, /es/tickets at 5.5. Same domain, same age, same
   * authority; the difference is that English is arguing with itself.
   *
   * The cause was in the metadata. All three of /, /tickets and /entrance-fee
   * opened their description on the same sentence — "Bahia Palace entry is
   * 100 MAD" — and all three carried a price word in the title.
   *
   * So this page keeps the buy-intent phrase and gives up the price. It is now
   * about where to buy and which ticket to choose; how much it costs belongs
   * to /entrance-fee, which is written for exactly that and says so in its
   * title.
   *
   * The home page title is deliberately left alone: it is the riskiest string
   * on the site to change and no query list for it has been read. That is the
   * rule this file already states, applied to itself.
   */
  en: { title: `Bahia Palace Tickets 2026 — Where to Buy and What's Included`, description: `Where to buy Bahia Palace tickets: at the gate, online in advance, or with a guided tour. What each option includes, and how long the door queue really runs.` },
  fr: { title: `Billets Palais Bahia 2026 — Où les acheter et ce qu'ils incluent`, description: `Où acheter ses billets pour le Palais Bahia : sur place, en ligne à l'avance ou avec une visite guidée. Ce que chaque option comprend et la durée réelle de la file.` },
  es: { title: `Entradas Palacio Bahía 2026 — Dónde comprarlas y qué incluyen`, description: `Dónde comprar las entradas del Palacio Bahía: en taquilla, online por adelantado o con una visita guiada. Qué incluye cada opción y cuánto dura de verdad la cola.` },
  de: { title: `Bahia Palast Tickets 2026 — Wo kaufen und was enthalten ist`, description: `Wo Sie Tickets für den Bahia-Palast bekommen: vor Ort, online im Voraus oder mit einer Führung. Was jede Option enthält und wie lang die Schlange wirklich ist.` },
  it: { title: `Biglietti Palazzo Bahia 2026 — Dove comprarli e cosa includono`, description: `Dove acquistare i biglietti per il Palazzo Bahia: in loco, online in anticipo o con una visita guidata. Cosa include ogni opzione e quanto dura davvero la coda.` },
  /*
   * ar and pt were absent, so both served the English title and description
   * under URLs that hreflang declares as Arabic and Portuguese. Arabic is this
   * site's best-converting locale in Search Console — /ar is the top page by
   * clicks — and it was being handed an English result for the page type whose
   * French equivalent converts at 22%.
   *
   * The wording follows the affiliate reality, not the pack: we do not sell
   * this ticket, Viator does, and the audio guide is what the price above the
   * gate fee buys.
   */
  ar: { title: `تذاكر قصر الباهية 2026 — من أين تشتريها وما الذي تشمله`, description: `من أين تشتري تذاكر قصر الباهية: من الشبّاك، أو عبر الإنترنت مسبقاً، أو ضمن جولة مرشدة. ما الذي يشمله كل خيار، وكم يطول طابور الباب فعلياً.` },
  pt: { title: `Bilhetes do Palácio Bahia 2026 — Onde comprar e o que incluem`, description: `Onde comprar bilhetes para o Palácio Bahia: na bilheteira, online com antecedência ou com uma visita guiada. O que cada opção inclui e quanto dura mesmo a fila.` },
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

/*
 * The opening paragraph, which this page did not have.
 *
 * It went breadcrumb -> h1 -> pricing grid, so the only prose above the fold
 * was the heading itself. That is thin against the home page's sixteen
 * sections, and it left the page ranking for "bahia palace tickets" without
 * containing the phrase anywhere a reader could see it.
 *
 * One paragraph, first sentence carrying the phrase naturally, and every fact
 * in it already on the page below: the 100 MAD gate price and the daily hours.
 * Nothing here is a new claim, so nothing here can drift from facts.ts.
 */
const INTRO: Record<string, string> = {
  en: `Bahia Palace tickets cost 100 MAD (about €9) at the gate, and the palace is open every day from 9:00 to 17:00. Below is what each ticket includes, what you pay, and how to avoid the queue at the ticket window.`,
  fr: `Les billets du Palais Bahia coûtent 100 MAD (environ 9 €) sur place, et le palais est ouvert tous les jours de 9h à 17h. Voici ce que comprend chaque billet, ce que vous payez, et comment éviter la file au guichet.`,
  es: `Las entradas del Palacio Bahía cuestan 100 MAD (unos 9 €) en taquilla, y el palacio abre todos los días de 9:00 a 17:00. Aquí tienes qué incluye cada entrada, cuánto pagas y cómo evitar la cola.`,
  de: `Bahia Palast Tickets kosten vor Ort 100 MAD (rund 9 €), und der Palast ist täglich von 9 bis 17 Uhr geöffnet. Hier steht, was jedes Ticket enthält, was Sie zahlen und wie Sie die Warteschlange am Schalter vermeiden.`,
  it: `I biglietti per il Palazzo Bahia costano 100 MAD (circa 9 €) in loco, e il palazzo è aperto tutti i giorni dalle 9:00 alle 17:00. Qui trovi cosa include ogni biglietto, quanto paghi e come evitare la fila.`,
  ar: `تذاكر قصر الباهية ثمنها 100 درهم (حوالي 9 يورو) عند الشبّاك، والقصر مفتوح يومياً من 9:00 إلى 17:00. هنا تجد ما تشمله كل تذكرة، وكم تدفع، وكيف تتفادى طابور شبّاك التذاكر.`,
  pt: `Os bilhetes do Palácio Bahia custam 100 MAD (cerca de 9 €) na bilheteira, e o palácio está aberto todos os dias das 9:00 às 17:00. Abaixo encontra o que cada bilhete inclui, quanto paga e como evitar a fila.`,
};

/** Same gap as TICKETS_META above: ar and pt fell through to the English H1. */
const H1_LABELS: Record<string, string> = {
  en: 'Bahia Palace Tickets 2026',
  fr: 'Billets Palais Bahia 2026',
  es: 'Entradas Palacio Bahia 2026',
  de: 'Bahia Palast Tickets 2026',
  it: 'Biglietti Palazzo Bahia 2026',
  ar: 'تذاكر قصر الباهية 2026',
  pt: 'Bilhetes Palácio Bahia 2026',
};

/**
 * Fills the {adult} / {child} / {ageMin} / {ageMax} placeholders from
 * config/pricing.ts. Prose never carries a figure of its own: the entrance-fee
 * metadata already drifted away from that page's own table once, and it told
 * Spanish and Portuguese families a seven-year-old was free when they pay.
 */
function fillPrices(text: string): string {
  return text
    .replace(/\{adult\}/g, String(OFFICIAL_DOOR_PRICE_MAD))
    .replace(/\{child\}/g, String(OFFICIAL_CHILD_DOOR_PRICE_MAD))
    .replace(/\{ageMin\}/g, String(CHILD_AGE_MIN))
    .replace(/\{ageMax\}/g, String(CHILD_AGE_MAX));
}

/** `**bold**` only. The copy needs to lead three paragraphs with a bold label
 *  and nothing more, so this stays a split rather than a markdown dependency. */
function renderEmphasis(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="text-[#F5E8CC] font-semibold">{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  );
}

export default async function TicketsPage({ params }: Props) {
  const { locale } = await params;
  const tb = await getTranslations({ locale, namespace: 'breadcrumb' });
  const tFooter = await getTranslations({ locale, namespace: 'footer' });
  const h1 = H1_LABELS[locale] ?? H1_LABELS.en;
  const intro = INTRO[locale] ?? INTRO.en;
  const body  = TICKETS_CONTENT[locale] ?? TICKETS_CONTENT.en;

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
          /*
           * Search Console flagged this on 20/08/2026: "Champ description
           * manquant" on the merchant listing. Non-critical, meaning the
           * listing still shows — but description is what a merchant result
           * has to say about the product, and without it Google is left to
           * infer one from the page.
           *
           * The page's own meta description is the right text and not a
           * paraphrase of it: it already says what is being sold — the
           * official ticket in your name, an audio guide, WhatsApp support,
           * free cancellation — and it is already translated. Writing a second
           * description here would be one more string to keep in step with the
           * first.
           *
           * The other two Product nodes on this site, /visitor-pack and the
           * ticket detail page, both carried one. This was the only gap, and
           * it was five pages wide: one per locale.
           */
          description: TICKETS_META[locale]?.description ?? TICKETS_META.en.description,
          url: `${BASE}/${locale}/tickets/skip-the-line`,
          image: `${BASE}/og-image.jpg`,
          // A merchant listing with no identifier at all is the weakest form of
          // the markup. There is no GTIN for a ticket we issue ourselves, so
          // the brand is the identifier — the same one the detail page carries.
          brand: { '@type': 'Brand', name: 'Bahia Palace Tickets' },
          offers: {
            '@type': 'Offer',
            price: SKIP_THE_LINE_PRICE.amount.toFixed(2),
            priceCurrency: SKIP_THE_LINE_PRICE.currency,
            availability: 'https://schema.org/InStock',
            url: `${BASE}/${locale}/tickets/skip-the-line`,
            ...DIGITAL_TICKET_OFFER_EXTRAS,
          },
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#1C1108]">
      <JsonLd data={ticketsSchema} />
      <JsonLd data={buildBreadcrumbSchema(locale, [{ name: tb('home'), path: '' }, { name: tb('tickets') }])} />
      {/*
        * FAQPage built from the questions this page actually renders, with the
        * same fillPrices() applied — markup that quotes a different figure from
        * the visible answer is the kind of mismatch a rich result gets pulled
        * for, and it would quote a stale price besides.
        */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: body.faq.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: fillPrices(item.a) },
          })),
        }}
      />
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
          <p className="mt-4 max-w-3xl text-[#C4A882] leading-relaxed">
            {intro}
          </p>
          {/*
           * Under the h1 and under the intro, never above. This is the page
           * that ranks for "bahia palace tickets", so somebody landing here
           * should see in one line that this is not the palace's own site and
           * where the official one is — without changing what the page opens
           * with.
           */}
          <p className="mt-3 max-w-3xl text-[11px] leading-relaxed text-[#C4A882]/70 sm:text-xs">
            {tFooter('independentNotice')}
          </p>
        </div>
      </div>
      <TicketSection />

      {/*
        * The prose half of the page.
        *
        * It sits BELOW the ticket grid on purpose: someone who arrived ready to
        * buy should not have to scroll past an essay to reach the cards, and
        * someone still deciding reads on. Headings are h2/h3 under the page's
        * single h1, so the outline is a real hierarchy rather than styled text.
        */}
      <div className="max-w-3xl mx-auto px-6 py-14">
        {body.sections.map((section) => (
          <section key={section.heading} className="mb-10">
            <h2
              className="text-[#F5E8CC] font-bold mb-4"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.35rem, 2.6vw, 1.8rem)' }}
            >
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-[#C4A882] leading-relaxed mb-4">
                {renderEmphasis(fillPrices(paragraph))}
              </p>
            ))}
          </section>
        ))}

        <section>
          <h2
            className="text-[#F5E8CC] font-bold mb-5"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.35rem, 2.6vw, 1.8rem)' }}
          >
            {body.faqHeading}
          </h2>
          {body.faq.map((item) => (
            <div key={item.q} className="mb-6">
              <h3 className="text-[#F5E8CC] font-semibold mb-2">{item.q}</h3>
              <p className="text-[#C4A882] leading-relaxed">{fillPrices(item.a)}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
