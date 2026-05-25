import { BOOKING_URL } from '@/lib/booking';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { buildAlternates, buildOG, BASE } from '@/lib/seo';
import { Clock, Sun, Moon, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

const META: Record<string, { title: string; description: string }> = {
  en: { title: 'Bahia Palace Opening Hours 2026 | Daily Times & Best Visit Time', description: 'Bahia Palace is open daily 9:00 AM – 5:00 PM. Check 2026 schedule, Ramadan hours, holiday closures, and the best time to visit to avoid crowds.' },
  fr: { title: 'Horaires Palais Bahia 2026 | Heures d\'Ouverture & Meilleur Moment', description: 'Le Palais Bahia est ouvert tous les jours de 9h à 17h. Horaires 2026, Ramadan, fermetures et meilleur moment pour éviter la foule.' },
  es: { title: 'Horario Palacio Bahia 2026 | Horas de Apertura & Mejor Momento', description: 'El Palacio Bahia abre todos los días de 9:00 a 17:00. Horario 2026, Ramadán, cierres y mejor momento para evitar aglomeraciones.' },
  de: { title: 'Bahia Palast Öffnungszeiten 2026 | Tageszeiten & Beste Besuchszeit', description: 'Der Bahia Palast ist täglich von 9:00 bis 17:00 Uhr geöffnet. Öffnungszeiten 2026, Ramadan-Zeiten und beste Besuchszeit.' },
  it: { title: 'Orari Palazzo Bahia 2026 | Apertura Giornaliera & Miglior Momento', description: 'Il Palazzo Bahia è aperto tutti i giorni dalle 9:00 alle 17:00. Orari 2026, Ramadan, chiusure e miglior momento per evitare le folle.' },
};

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = META[locale] ?? META.en;
  return {
    title: meta.title,
    description: meta.description,
    keywords: ['bahia palace opening hours', 'bahia palace times', 'bahia palace hours 2026', 'when is bahia palace open', 'bahia palace ramadan hours', 'best time to visit bahia palace', 'bahia palace schedule'],
    alternates: buildAlternates(locale, '/opening-hours'),
    openGraph: buildOG(meta.title, meta.description, locale, '/opening-hours'),
  };
}

const hoursSchema = {
  '@context': 'https://schema.org',
  '@type': 'TouristAttraction',
  name: 'Bahia Palace',
  url: `${BASE}/en/opening-hours`,
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Saturday','Sunday'], opens: '09:00', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday'], opens: '09:00', closes: '12:00' },
  ],
  address: { '@type': 'PostalAddress', streetAddress: 'Rue Riad Zitoun el Jedid', addressLocality: 'Marrakech', addressCountry: 'MA' },
};

export default async function OpeningHoursPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="bg-[#FAF3E7] min-h-screen">
      <JsonLd data={hoursSchema} />

      <div className="bg-[#3D2817] text-white px-6 py-12 md:px-10">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb variant="light" items={[{ label: 'Home', href: '/' }, { label: 'Opening Hours' }]} />
          <h1 className="mt-6 font-bold text-white" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
            Bahia Palace Opening Hours 2026
          </h1>
          <p className="mt-3 text-white/75 text-lg max-w-2xl">
            Plan your visit to Bahia Palace Marrakech with accurate opening times, seasonal schedules, and advice on the best time to avoid crowds.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

        {/* Weekly schedule */}
        <div className="bg-white rounded-2xl border border-[#E8D5B7] overflow-hidden">
          <div className="bg-[#3D2817] px-6 py-4">
            <h2 className="text-white font-bold text-lg flex items-center gap-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              <Clock size={18} /> Bahia Palace Hours — Regular Schedule
            </h2>
          </div>
          <div className="divide-y divide-[#E8D5B7]">
            {[
              { day: 'Monday – Thursday', hours: '9:00 AM – 5:00 PM', status: 'open' },
              { day: 'Friday', hours: '9:00 AM – 12:00 PM', status: 'partial', note: 'Closes for Friday prayer' },
              { day: 'Saturday – Sunday', hours: '9:00 AM – 5:00 PM', status: 'open' },
            ].map(({ day, hours, status, note }) => (
              <div key={day} className="flex items-center justify-between px-6 py-4">
                <span className="font-semibold text-[#3D2817] text-sm">{day}</span>
                <div className="text-right">
                  <span className={`font-bold text-sm ${status === 'open' ? 'text-[#6B7B3A]' : 'text-[#E8A33D]'}`}>{hours}</span>
                  {note && <p className="text-xs text-[#8B6344] mt-0.5">{note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ramadan hours */}
        <div className="bg-[#E8A33D]/10 rounded-2xl border border-[#E8A33D]/30 p-6">
          <div className="flex items-start gap-3">
            <Moon size={20} className="text-[#E8A33D] shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-[#3D2817] mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem' }}>
                Bahia Palace Ramadan Hours
              </h2>
              <p className="text-sm text-[#5C3D20] leading-relaxed mb-3">
                During Ramadan, Bahia Palace adjusts its schedule. Opening hours are typically <strong>9:00 AM – 4:00 PM</strong>, with some variation depending on the year. The palace may be closed on certain religious holidays. Always verify locally before your visit during Ramadan.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#8B6344]">
                <AlertTriangle size={12} className="text-[#E8A33D]" />
                Ramadan 2026 approximate dates: February 18 – March 19, 2026
              </div>
            </div>
          </div>
        </div>

        {/* Best time to visit */}
        <div>
          <h2 className="text-2xl font-bold text-[#3D2817] mb-5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Best Time to Visit Bahia Palace (Avoid the Crowds)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Sun, time: '9:00 – 10:30 AM', label: 'Best Time', desc: 'Fewest visitors, soft morning light — perfect for photography', color: '#6B7B3A' },
              { icon: Clock, time: '10:30 AM – 2:00 PM', label: 'Peak Hours', desc: 'Tour groups arrive, most crowded period — expect queues at gate', color: '#C4452D' },
              { icon: Sun, time: '3:00 – 5:00 PM', label: 'Good Alternative', desc: 'Crowds thin out, golden afternoon light on the zellige tiles', color: '#E8A33D' },
            ].map(({ icon: Icon, time, label, desc, color }) => (
              <div key={label} className="bg-white rounded-xl border border-[#E8D5B7] p-5">
                <Icon size={20} style={{ color }} className="mb-3" />
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color }}>{label}</p>
                <p className="font-bold text-[#3D2817] text-sm mb-2">{time}</p>
                <p className="text-xs text-[#5C3D20] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal tips */}
        <div>
          <h2 className="text-2xl font-bold text-[#3D2817] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Bahia Palace by Season
          </h2>
          <div className="space-y-3">
            {[
              { season: 'Spring (Mar–May)', tip: 'Ideal weather 20–25°C. Gardens in bloom. Moderate crowds. Book skip-the-line tickets for weekends.', best: true },
              { season: 'Summer (Jun–Aug)', tip: 'Very hot 35–42°C. Fewer tourists. Visit early morning (9–10 AM) to avoid heat and crowds.', best: false },
              { season: 'Autumn (Sep–Nov)', tip: 'Pleasant 22–28°C. Peak tourist season. Definitely book online to skip the queue.', best: true },
              { season: 'Winter (Dec–Feb)', tip: 'Cool 10–18°C. Quietest period. Sometimes rainy. Great for photography with dramatic skies.', best: false },
            ].map(({ season, tip, best }) => (
              <div key={season} className="flex gap-3 bg-white rounded-xl border border-[#E8D5B7] p-4">
                <CheckCircle2 size={15} className={`shrink-0 mt-0.5 ${best ? 'text-[#6B7B3A]' : 'text-[#C8A882]'}`} />
                <div>
                  <p className="font-semibold text-[#3D2817] text-sm">{season}{best && <span className="ml-2 text-[10px] bg-[#6B7B3A] text-white px-2 py-0.5 rounded-full uppercase tracking-wide">Recommended</span>}</p>
                  <p className="text-xs text-[#5C3D20] mt-1 leading-relaxed">{tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#3D2817] rounded-2xl p-8 text-center">
          <h2 className="text-white font-bold text-2xl mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Skip the Queue — Book Bahia Palace Tickets Online
          </h2>
          <p className="text-white/70 text-sm mb-5 max-w-md mx-auto">
            Secure your preferred time slot. Walk straight in without waiting at the gate.
          </p>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Book Skip-the-Line <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
