import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/db';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Camera,
  Car,
  DoorClosed,
  Eye,
  Footprints,
  Gift,
  Hand,
  Phone,
  ShieldCheck,
  ShoppingBag,
  TicketX,
  UserX,
  UtensilsCrossed,
} from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { ScamAccordion, type ScamItem } from '@/components/safety/ScamAccordion';
import { LeadButton } from '@/components/layout/LeadButton';
import { getPublicPaymentsFlags } from '@/lib/payments/guard';
import { BASE } from '@/lib/seo';
import type { Metadata } from 'next';

export const revalidate = 3600;

/*
 * This page is a hub, and it was competing with the guides it links to.
 *
 * "Safety Guide Marrakech 2026 — Scams & Tips" here, and "Marrakech Safety
 * Guide 2026: Avoid Scams Near Bahia Palace" on the article it sends people
 * to. Ten internal links point at the article and none point here, so this
 * page was bidding for a query it had no way of winning, against a page it
 * exists to promote.
 *
 * "Is Marrakech safe?" is what people actually type before they book — a
 * yes-or-no question, asked earlier in the trip, by somebody who has not yet
 * decided to come. The scam-by-scam detail stays where it already ranks.
 */
const META: Record<string, { title: string; description: string; subtitle: string; inDepth: string; readGuide: string; bottomNote: string }> = {
  en: { title: "Is Marrakech Safe in 2026? An Honest Visitor's Answer", description: "Yes, with the ordinary caution any big city asks for. What really happens to visitors near Bahia Palace, and how to end an unwanted approach politely.", subtitle: 'Essential tips to stay safe and avoid common tourist traps in Marrakech', inDepth: 'In-depth safety guides', readGuide: 'Read guide', bottomNote: 'Stay vigilant and enjoy your visit to Bahia Palace. When in doubt, ask official staff inside the palace.' },
  fr: { title: "Marrakech est-elle sûre en 2026 ? Réponse honnête", description: "Oui, avec la prudence qu'exige toute grande ville. Ce qui arrive réellement aux visiteurs près du Palais Bahia, et comment refuser poliment les sollicitations.", subtitle: 'Conseils essentiels pour rester en sécurité et éviter les pièges touristiques à Marrakech', inDepth: 'Guides de sécurité approfondis', readGuide: 'Lire le guide', bottomNote: "Restez vigilant et profitez de votre visite au Palais Bahia. En cas de doute, demandez au personnel officiel." },
  es: { title: "¿Es seguro Marrakech en 2026? Respuesta honesta", description: "Sí, con la precaución normal de cualquier gran ciudad. Qué les ocurre de verdad a los visitantes cerca del Palacio Bahía y cómo decir que no con cortesía.", subtitle: 'Consejos esenciales para estar seguro y evitar las trampas turísticas en Marrakech', inDepth: 'Guías de seguridad detalladas', readGuide: 'Leer guía', bottomNote: 'Permanece alerta y disfruta tu visita al Palacio Bahia. En caso de duda, consulta al personal oficial.' },
  de: { title: "Ist Marrakesch 2026 sicher? Eine ehrliche Antwort", description: "Ja, mit der üblichen Vorsicht jeder Großstadt. Was Besuchern in der Nähe des Bahia Palastes wirklich passiert und wie Sie Ansprachen höflich beenden.", subtitle: 'Wesentliche Tipps, um sicher zu bleiben und Touristenfallen in Marrakesch zu vermeiden', inDepth: 'Ausführliche Sicherheitsratgeber', readGuide: 'Ratgeber lesen', bottomNote: 'Bleiben Sie wachsam und genießen Sie Ihren Besuch im Bahia Palast. Im Zweifelsfall wenden Sie sich an das Personal.' },
  it: { title: "Marrakech è sicura nel 2026? Una risposta onesta", description: "Sì, con la prudenza che chiede ogni grande città. Cosa succede davvero ai visitatori vicino al Palazzo Bahia e come declinare con gentilezza gli approcci.", subtitle: 'Consigli essenziali per stare al sicuro ed evitare le trappole turistiche a Marrakech', inDepth: 'Guide sulla sicurezza approfondite', readGuide: 'Leggi la guida', bottomNote: "Rimani vigile e goditi la tua visita al Palazzo Bahia. In caso di dubbio, chiedi al personale ufficiale." },
};

/**
 * When this guide was last reviewed. Edit it when you actually revise the copy.
 *
 * NOT `new Date()`. A "last updated" that always reads as today is a freshness
 * claim the page has not earned — it would tell a reader the scam list was
 * checked this morning on a day nobody looked at it, and search engines treat
 * an always-current date on unchanged content as exactly the signal it is.
 * A constant goes stale visibly, which is the honest failure.
 */
const LAST_REVIEWED = new Date('2026-08-13T00:00:00Z');

/**
 * One icon per scam, in the order the catalogue lists them.
 *
 * Indexed rather than keyed off the title, because the titles are translated
 * and a German key would match nothing. If a scam is inserted rather than
 * appended, this array has to move with it — the fallback below keeps a
 * mismatch from crashing, but it will show the wrong picture.
 */
const SCAM_ICONS = [
  DoorClosed,       // the "closed monument" trick
  UserX,            // fake guides at the entrance
  Hand,             // the henna ambush
  Car,              // taxi without a meter
  Footprints,       // "I'll show you the way" pickpocket
  ShoppingBag,      // overpriced spice shops
  Eye,              // fake tannery viewpoint
  Camera,           // snake charmer photo trap
  Banknote,         // currency exchange confusion
  UtensilsCrossed,  // restaurant menu switcheroo
  TicketX,          // fake or counterfeit tickets
  Gift,             // the "free" gift
] as const;

/**
 * Which scams carry a call to action, by index.
 *
 * Two, deliberately, and both on scams where what we sell is the actual
 * answer to the problem: a counterfeit ticket and an unlicensed guide. A CTA
 * under "Taxi Without a Meter" would be advertising against a scam we cannot
 * do anything about, on a page whose whole value is that it is not selling.
 */
const CTA_FAKE_GUIDES = 1;
const CTA_FAKE_TICKETS = 10;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta = META[locale] ?? META.en;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${BASE}/${locale}/safety`,
      languages: { en: `${BASE}/en/safety`, fr: `${BASE}/fr/safety`, it: `${BASE}/it/safety`, de: `${BASE}/de/safety`, es: `${BASE}/es/safety`, 'x-default': `${BASE}/en/safety` },
    },
    openGraph: { title: meta.title, description: meta.description, url: `${BASE}/${locale}/safety`, type: 'article' },
  };
}

export default async function SafetyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tGuide = await getTranslations({ locale, namespace: 'safetyGuide' });
  const tTickets = await getTranslations({ locale, namespace: 'tickets' });
  const meta = META[locale] ?? META.en;
  const { enabled: paymentsEnabled } = getPublicPaymentsFlags();

  const scams = tGuide.raw('scams') as Array<{ title: string; desc: string; avoid: string }>;
  const emergency = tGuide.raw('emergency') as Array<{ label: string; value: string; note: string }>;

  const labels = { theScam: tGuide('theScam'), whatToDo: tGuide('howToAvoid') };

  /*
   * The CTA is only built when payments are on.
   *
   * Same rule as every other ticket surface: with payments off the button
   * hands the visitor to the ministry portal, and "skip the risk, buy from us"
   * printed above it would be selling something we are not selling. The scam
   * entry then renders with its advice and nothing else, which is the honest
   * version of this page anyway.
   */
  const ticketCta = paymentsEnabled ? (
    <div className="mt-4 rounded-xl border border-[rgba(232,163,61,0.22)] bg-[#2E1F12] p-4">
      <p className="mb-3 text-sm leading-relaxed text-[#F5E8CC]">{tGuide('ctaScamTicket')}</p>
      <LeadButton
        ticketType="visitor-pack"
        ctaLocation="safety"
        className="btn-primary min-h-[44px] text-sm"
      >
        {tTickets('bookNow')}
      </LeadButton>
    </div>
  ) : undefined;

  /*
   * The second CTA is a link, not a button, and gold rather than terracotta.
   *
   * Quieter on purpose — the advice above it already tells the reader what to
   * do, so this only needs to be the way to do it. And .btn-secondary could
   * not be used here whatever the intent: its terracotta text measures 3.43:1
   * against this panel, which fails AA at button size. The brass reads 10.9:1.
   */
  const guideCta = paymentsEnabled ? (
    <div className="mt-4">
      <LeadButton
        ticketType="visitor-pack"
        ctaLocation="safety"
        className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[#F5C96A] underline-offset-4 hover:underline"
      >
        {tGuide('ctaBtn')}
      </LeadButton>
    </div>
  ) : undefined;

  const items: ScamItem[] = scams.map((scam, i) => {
    const Icon = SCAM_ICONS[i] ?? AlertTriangle;
    return {
      id: String(i),
      title: scam.title,
      scam: scam.desc,
      fix: scam.avoid,
      icon: <Icon size={19} aria-hidden="true" />,
      cta:
        i === CTA_FAKE_TICKETS ? ticketCta : i === CTA_FAKE_GUIDES ? guideCta : undefined,
    };
  });

  const articles = await prisma.blogPost.findMany({
    where: { published: true, category: 'safety', locale },
    orderBy: { publishedAt: 'desc' },
    select: { slug: true, title: true, excerpt: true, coverImage: true },
  });

  /*
   * FAQPage schema.
   *
   * The answer is the advice alone, not the description followed by the
   * advice. This block is what a search result or an assistant quotes, and the
   * old version led every answer with the trick itself — so the snippet a
   * worried visitor saw was a description of how they get robbed, with the
   * part that helps them cut off at the character limit.
   */
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: scams.map((scam) => ({
      '@type': 'Question',
      name: tGuide('faqQuestion', { title: scam.title }),
      acceptedAnswer: { '@type': 'Answer', text: scam.avoid },
    })),
  };

  const monthName = new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' })
    .format(LAST_REVIEWED);

  return (
    <div className="min-h-screen bg-[#1C1108]">
      <JsonLd data={faqSchema} />

      <div className="bg-[#C4452D] text-white pt-6 pb-10 px-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-white/30 animate-ping motion-reduce:animate-none" />
            <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white/40">
              <AlertTriangle size={38} className="text-[#C4452D]" strokeWidth={2.5} />
            </div>
          </div>
        </div>
        <h1
          className="text-white mb-2"
          style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
        >
          {tNav('safetyGuide')}
        </h1>
        <p className="text-amber-100 max-w-xl mx-auto text-sm leading-relaxed">
          {meta.subtitle}
        </p>

        {/* Provenance, freshness and scope, in one line. The count is read from
            the catalogue rather than written down — this page previously
            carried a "Top 10" heading that any addition would have made false,
            and a number nobody has to remember to update cannot drift. */}
        <p className="mt-4 text-xs text-white/75">
          {tGuide('trustStrip', {
            month: monthName,
            year: LAST_REVIEWED.getUTCFullYear(),
            count: scams.length,
          })}
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 sm:py-14">

        {/* Perspective before the list.
            Twelve scams read back to back describe a city where everyone is
            trying to rob you, which is not the city this is about and not what
            we want a visitor arriving tomorrow to believe. The reassurance and
            the numbers to call sit together, above the list, so the frame is
            set before the catalogue starts. */}
        <div className="rounded-2xl border border-[#8FA63C]/25 bg-[#8FA63C]/08 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#8FA63C]" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-[#F5E8CC]">{tGuide('reassurance')}</p>
          </div>

          <div className="mt-5 border-t border-[#8FA63C]/20 pt-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-[#F5E8CC]">
              <Phone size={15} className="text-[#E8A33D]" aria-hidden="true" />
              {tGuide('emergencyTitle')}
            </h2>
            <p className="mt-1 text-xs text-[#C4A882]">{tGuide('emergencyNote')}</p>

            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {emergency.map((e) => (
                <li
                  key={e.label}
                  className="rounded-xl border border-[rgba(232,163,61,0.18)] bg-[#251A0F] px-4 py-3"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-xs text-[#C4A882]">{e.label}</span>
                    {/* A real tel: link. On the page a visitor reads when
                        something has gone wrong, a number they have to retype
                        into the dialler is a number they get wrong. */}
                    <a
                      href={`tel:${e.value.replace(/\s+/g, '')}`}
                      className="shrink-0 font-bold tabular-nums text-[#F5C96A] underline-offset-4 hover:underline"
                      style={{ fontVariantNumeric: 'lining-nums tabular-nums' }}
                    >
                      {e.value}
                    </a>
                  </div>
                  {e.note && <p className="mt-1 text-[11px] leading-snug text-[#C4A882]/80">{e.note}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <ScamAccordion items={items} labels={labels} defaultOpen={0} />
        </div>

        <div className="mt-10 bg-[#E8A33D]/08 border border-[#E8A33D]/20 rounded-2xl p-6 text-center">
          <p className="text-[#C4A882] text-sm font-medium">{meta.bottomNote}</p>
        </div>

        {articles.length > 0 && (
          <section className="mt-16">
            <h2
              className="text-2xl font-bold text-[#F5E8CC] mb-6"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {meta.inDepth}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {articles.map(article => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}` as any}
                  className="group bg-[#251A0F] rounded-2xl border border-[rgba(232,163,61,0.13)] overflow-hidden hover:border-[rgba(232,163,61,0.30)] transition-colors flex flex-col"
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={article.coverImage ?? '/images/blog-real/bahia-palace-zellige-floor-geometric-star-pattern.webp'}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width:640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3
                      className="font-bold text-[#F5E8CC] mb-2 leading-snug flex-1"
                      style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem' }}
                    >
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-xs text-[#C4A882] leading-relaxed mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#C4452D] group-hover:underline mt-auto">
                      {meta.readGuide} <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
