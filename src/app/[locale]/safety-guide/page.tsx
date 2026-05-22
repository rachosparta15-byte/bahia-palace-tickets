import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { BOOKING_URL } from '@/lib/booking';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { Link } from '@/i18n/navigation';
import { ShieldCheck, ChevronDown, Phone, AlertTriangle, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'safetyGuide' });
  return {
    title: `${t('title')} — Bahia Palace Tickets`,
    description: t('subtitle'),
  };
}

export default async function SafetyGuidePage() {
  const t  = await getTranslations('safetyGuide');
  const tb = await getTranslations('breadcrumb');

  const scams    = t.raw('scams')    as Array<{ title: string; desc: string; avoid: string }>;
  const tips     = t.raw('tips')     as string[];
  const emergency = t.raw('emergency') as Array<{ label: string; value: string; note: string }>;

  return (
    <div className="bg-[#FAF3E7] min-h-screen">
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <Image
          src="https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1400&q=80"
          alt="Marrakech safety guide"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3D2817]/70 to-[#3D2817]/75" />
        <div className="absolute inset-0 flex flex-col justify-between px-6 py-8 md:px-10 max-w-5xl mx-auto w-full left-0 right-0">
          <Breadcrumb variant="light" items={[
            { label: tb('home'), href: '/' },
            { label: tb('safetyGuide') },
          ]} />
          <div>
            <span className="inline-flex items-center gap-1.5 bg-[#E8A33D]/90 text-[#3D2817] text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <ShieldCheck size={12} />
              {t('badge')}
            </span>
            <h1
              className="text-white font-bold leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
            >
              {t('title')}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-14">
        {/* Intro */}
        <p className="text-[#5C3D20] text-lg leading-relaxed">{t('subtitle')}</p>

        {/* 10 Scams */}
        <section>
          <h2
            className="text-2xl font-bold text-[#3D2817] mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {t('topScams')}
          </h2>
          <div className="space-y-3">
            {scams.map((scam, i) => (
              <details
                key={i}
                className="group bg-white rounded-xl border border-[#E8D5B7] overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#C4452D]/10 text-[#C4452D] text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-[#3D2817] text-sm">{scam.title}</span>
                  </div>
                  <ChevronDown size={15} className="shrink-0 text-[#5C3D20] transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 border-t border-[#F0E5D0]">
                  <p className="text-sm text-[#5C3D20] leading-relaxed mt-4 mb-4">{scam.desc}</p>
                  <div className="bg-[#6B7B3A]/8 border border-[#6B7B3A]/20 rounded-lg px-4 py-3 flex gap-2.5">
                    <ShieldCheck size={15} className="text-[#6B7B3A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-[#6B7B3A] mb-1">{t('howToAvoid')}</p>
                      <p className="text-sm text-[#3D2817] leading-relaxed">{scam.avoid}</p>
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* 10 Practical Tips */}
        <section className="bg-[#3D2817] text-white rounded-2xl p-8 md:p-10">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {t('practicalTips')}
          </h2>
          <ul className="space-y-3">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#E8A33D]/20 text-[#E8A33D] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-white/85 text-sm leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Emergency Contacts */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Phone size={20} className="text-[#C4452D]" />
            <h2
              className="text-2xl font-bold text-[#3D2817]"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {t('emergencyTitle')}
            </h2>
          </div>
          <p className="text-sm text-[#5C3D20] mb-5">{t('emergencyNote')}</p>
          <div className="bg-white rounded-xl border border-[#E8D5B7] overflow-hidden">
            {emergency.map((contact, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-5 py-4 gap-4 ${i < emergency.length - 1 ? 'border-b border-[#F0E5D0]' : ''}`}
              >
                <div>
                  <p className="font-semibold text-sm text-[#3D2817]">{contact.label}</p>
                  {contact.note && <p className="text-xs text-[#5C3D20] mt-0.5">{contact.note}</p>}
                </div>
                <a
                  href={`tel:${contact.value.replace(/\s/g, '')}`}
                  className="font-bold text-[#C4452D] text-lg hover:underline shrink-0"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {contact.value}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#C4452D] text-white rounded-2xl p-8 md:p-10">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle size={20} className="text-white/80 mt-0.5 shrink-0" />
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {t('ctaTitle')}
            </h2>
          </div>
          <p className="text-white/85 text-sm leading-relaxed mb-6">{t('ctaBody')}</p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-[#C4452D] font-semibold px-8 py-3.5 rounded-xl hover:bg-[#FAF3E7] transition-colors"
          >
            {t('ctaBtn')}
          </a>
        </section>

        {/* Related article */}
        <section className="bg-white rounded-2xl border border-[#E8D5B7] overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="relative h-48 sm:h-auto sm:w-48 shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=75"
                alt="Marrakech safety fears"
                fill
                className="object-cover"
                sizes="(max-width:640px) 100vw, 192px"
              />
            </div>
            <div className="p-6 flex flex-col justify-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C4452D]">Deep Dive</span>
              <h3
                className="text-lg font-bold text-[#3D2817] leading-snug"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Marrakech Safety 2026: Honest Answers to What Tourists Fear Most
              </h3>
              <p className="text-sm text-[#5C3D20] leading-relaxed">
                Fake taxis, fake guides, henna traps, snake photos — the exact fears first-time visitors post before every trip, explained with the precise script each scam follows.
              </p>
              <Link
                href="/blog/marrakech-tourist-fears-taxi-scam-fake-guide-2026"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C4452D] hover:underline mt-1"
              >
                Read the full guide <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Contribute */}
        <section className="text-center border-t border-[#E8D5B7] pt-10">
          <h3
            className="text-xl font-bold text-[#3D2817] mb-3"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {t('contributeTitle')}
          </h3>
          <p className="text-[#5C3D20] text-sm leading-relaxed max-w-lg mx-auto">
            {t('contributeBody')}
          </p>
        </section>
      </div>
    </div>
  );
}
