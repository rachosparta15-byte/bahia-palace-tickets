import { LeadButton } from '@/components/layout/LeadButton';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { buildAlternates, buildOG, buildBreadcrumbSchema, BASE } from '@/lib/seo';
import { Clock, Sun, Moon, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const revalidate = 86400;

/*
 * The site page and the blog post were competing for one query.
 *
 * "Bahia Palace Opening Hours 2026 | Times, Ramadan & Tips" here, and
 * "Bahia Palace Opening Hours 2026: Full Schedule, Holidays & Ramadan" on
 * /blog/bahia-palace-opening-hours-2026. Both say 2026, both say Ramadan, and
 * the blog gets exactly as many internal links as this page does — so nothing
 * on the site tells Google which of the two to rank, and it alternates.
 *
 * The split is by intent, not by keyword. This page answers "what time does it
 * open" and adds the fact the snippet cannot: last entry is 4:30 PM, half an
 * hour before closing, which is the detail that ruins a late afternoon. Ramadan
 * and the holiday calendar move to the article, whose title already claims
 * them.
 *
 * Ramadan is dropped from every title here for the same reason. Two pages
 * cannot both be the Ramadan page.
 */
const META: Record<string, { title: string; description: string }> = {
  en: { title: "Bahia Palace Opening Hours 2026 — Times & Last Entry", description: "Open daily 9:00 AM to 5:00 PM, but last entry is 4:30 PM. When to arrive to beat the midday crowds, and how long you need once you are inside." },
  fr: { title: "Horaires Palais Bahia 2026 — Ouverture & Dernière Entrée", description: "Ouvert tous les jours de 9h à 17h, mais la dernière entrée est à 16h30. À quelle heure arriver pour éviter la foule de midi, et le temps à prévoir sur place." },
  es: { title: "Horario Palacio Bahía 2026 — Apertura y Última Entrada", description: "Abre todos los días de 9:00 a 17:00, pero la última entrada es a las 16:30. A qué hora llegar para evitar la multitud del mediodía y cuánto tiempo necesitas." },
  de: { title: "Bahia Palast Öffnungszeiten 2026 — Letzter Einlass", description: "Täglich 9:00 bis 17:00 Uhr geöffnet, letzter Einlass jedoch um 16:30 Uhr. Wann Sie kommen sollten, um dem Mittagsandrang zu entgehen, und wie lange Sie bleiben." },
  it: { title: "Orari Palazzo Bahia 2026 — Apertura e Ultimo Ingresso", description: "Aperto tutti i giorni dalle 9:00 alle 17:00, ma l'ultimo ingresso è alle 16:30. A che ora arrivare per evitare la folla di mezzogiorno e quanto tempo serve." },
};

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = META[locale] ?? META.en;
  return {
    title: meta.title,
    description: meta.description,
    alternates: buildAlternates(locale, '/opening-hours'),
    openGraph: buildOG(meta.title, meta.description, locale, '/opening-hours'),
  };
}

function getHoursSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: 'Bahia Palace',
    url: `${BASE}/${locale}/opening-hours`,
    openingHoursSpecification: [
      /*
       * Nine to five, every day, Friday included.
       *
       * This listed Friday as 09:00-12:00 and 14:00-17:00, which told Google
       * the palace shuts over Friday lunchtime. The Ministry of Culture, which
       * runs it, publishes "Horaires de visite: 9h-17h" with no Friday
       * exception at all:
       *   https://e-services.minculture.gov.ma/en/tickets/palais-bahia
       *   read 2026-09-25
       *
       * Google shows these hours beside the result and in the knowledge panel,
       * so the old entry turned away visitors searching on the busiest day of
       * the week.
       */
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '09:00', closes: '17:00' },
    ],
    address: { '@type': 'PostalAddress', streetAddress: 'Rue Riad Zitoun el Jedid', addressLocality: 'Marrakech', addressCountry: 'MA' },
  };
}

export default async function OpeningHoursPage({ params }: Props) {
  const { locale } = await params;
  const t  = await getTranslations('openingHoursPage');
  const tb = await getTranslations('breadcrumb');
  return (
    <div className="min-h-screen bg-[#1C1108]">
      <JsonLd data={getHoursSchema(locale)} />
      <JsonLd data={buildBreadcrumbSchema(locale, [{ name: tb('home'), path: '' }, { name: t('breadcrumb') }])} />

      <div className="bg-[#251A0F] border-b border-[rgba(232,163,61,0.15)] text-white px-6 py-12 md:px-10">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb variant="light" items={[{ label: tb('home'), href: '/' }, { label: t('breadcrumb') }]} />
          <h1 className="mt-6 font-bold text-white" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
            {t('h1')}
          </h1>
          <p className="mt-3 text-white/75 text-lg max-w-2xl">
            {t('intro')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

        {/* Weekly schedule */}
        <div className="bg-[#251A0F] rounded-2xl border border-[rgba(232,163,61,0.15)] overflow-hidden">
          <div className="bg-[#2E1F12] px-6 py-4">
            <h2 className="text-white font-bold text-lg flex items-center gap-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              <Clock size={18} /> {t('scheduleTitle')}
            </h2>
          </div>
          <div className="divide-y divide-[rgba(232,163,61,0.12)]">
            {[
              { day: t('monThu'), hours: '9:00 AM – 5:00 PM', status: 'open' },
              { day: t('friday'), hours: '9:00 AM – 5:00 PM', status: 'open', note: t('fridayNote') },
              { day: t('satSun'), hours: '9:00 AM – 5:00 PM', status: 'open' },
            ].map(({ day, hours, status, note }) => (
              <div key={day} className="flex items-center justify-between px-6 py-4">
                <span className="font-semibold text-[#F5E8CC] text-sm">{day}</span>
                <div className="text-end">
                  <span className={`font-bold text-sm ${status === 'open' ? 'text-[#8FA63C]' : 'text-[#E8A33D]'}`}>{hours}</span>
                  {note && <p className="text-xs text-[#C4A882] mt-0.5">{note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ramadan hours */}
        <div className="bg-[#E8A33D]/08 rounded-2xl border border-[#E8A33D]/30 p-6">
          <div className="flex items-start gap-3">
            <Moon size={20} className="text-[#E8A33D] shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-[#F5E8CC] mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem' }}>
                {t('ramadanTitle')}
              </h2>
              <p className="text-sm text-[#C4A882] leading-relaxed mb-3">
                {t.rich('ramadanBody', { b: (c) => <strong className="text-[#F5E8CC]">{c}</strong> })}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#C4A882]">
                <AlertTriangle size={12} className="text-[#E8A33D]" />
                {t('ramadanDates')}
              </div>
            </div>
          </div>
        </div>

        {/* Best time to visit */}
        <div>
          <h2 className="text-2xl font-bold text-[#F5E8CC] mb-5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('bestTimeTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Sun, time: '9:00 – 10:30 AM', label: t('slotBest'), desc: t('slotBestDesc'), color: '#8FA63C' },
              { icon: Clock, time: '10:30 AM – 2:00 PM', label: t('slotPeak'), desc: t('slotPeakDesc'), color: '#C4452D' },
              { icon: Sun, time: '3:00 – 5:00 PM', label: t('slotAlt'), desc: t('slotAltDesc'), color: '#E8A33D' },
            ].map(({ icon: Icon, time, label, desc, color }) => (
              <div key={label} className="bg-[#251A0F] rounded-xl border border-[rgba(232,163,61,0.13)] p-5">
                <Icon size={20} style={{ color }} className="mb-3" />
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color }}>{label}</p>
                <p className="font-bold text-[#F5E8CC] text-sm mb-2">{time}</p>
                <p className="text-xs text-[#C4A882] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal tips */}
        <div>
          <h2 className="text-2xl font-bold text-[#F5E8CC] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('seasonTitle')}
          </h2>
          <div className="space-y-3">
            {[
              { season: t('spring'), tip: t('springTip'), best: true },
              { season: t('summer'), tip: t('summerTip'), best: false },
              { season: t('autumn'), tip: t('autumnTip'), best: true },
              { season: t('winter'), tip: t('winterTip'), best: false },
            ].map(({ season, tip, best }) => (
              <div key={season} className="flex gap-3 bg-[#251A0F] rounded-xl border border-[rgba(232,163,61,0.13)] p-4">
                <CheckCircle2 size={15} className={`shrink-0 mt-0.5 ${best ? 'text-[#8FA63C]' : 'text-[#C4A882]'}`} />
                <div>
                  <p className="font-semibold text-[#F5E8CC] text-sm">{season}{best && <span className="ms-2 text-[10px] bg-[#8FA63C] text-white px-2 py-0.5 rounded-full uppercase tracking-wide">{t('recommended')}</span>}</p>
                  <p className="text-xs text-[#C4A882] mt-1 leading-relaxed">{tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-8 text-center">
          <h2 className="text-[#F5E8CC] font-bold text-2xl mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('ctaTitle')}
          </h2>
          <p className="text-[#C4A882] text-sm mb-5 max-w-md mx-auto">
            {t('ctaBody')}
          </p>
          <LeadButton ticketType="skip-the-line" className="inline-flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            {t('ctaBtn')} <ArrowRight size={16} />
          </LeadButton>
        </div>
      </div>
    </div>
  );
}
