import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { Heart, Globe, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';
import { buildAlternates, buildOG } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'aboutPage' });
  const title       = t('metaTitle');
  const description = t('metaDesc');
  return {
    title,
    description,
    alternates: buildAlternates(locale, '/about'),
    openGraph: buildOG(title, description, locale, '/about'),
  };
}

export default async function AboutPage() {
  const t  = await getTranslations('aboutPage');
  const tb = await getTranslations('breadcrumb');

  const provideItems = t('whyBody').split(' · ').filter(Boolean);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-72 md:h-96">
        <Image
          src="/images/gallery/bahia-palace-grand-courtyard-balcony-view-fountain.jpg"
          alt="Bahia Palace"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3D2817]/60 to-[#3D2817]/70" />
        <div className="absolute inset-0 flex flex-col justify-between px-6 py-8 md:px-10 max-w-5xl mx-auto w-full left-0 right-0">
          <Breadcrumb variant="light" items={[
            { label: tb('home'), href: '/' },
            { label: tb('about') },
          ]} />
          <div>
            <h1
              className="text-white font-bold leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3rem)' }}
            >
              {t('hero')}
            </h1>
            <p className="text-white/80 mt-2 text-lg max-w-2xl">{t('heroSub')}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

        {/* Mission */}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="w-10 h-10 bg-[#C4452D]/10 rounded-xl flex items-center justify-center mb-4">
              <Heart size={20} className="text-[#C4452D]" />
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-2xl font-bold text-[#3D2817] mb-4">
              {t('missionTitle')}
            </h2>
            <p className="text-[#5C3D20] leading-relaxed text-lg">{t('missionBody')}</p>
          </div>
          <div className="relative h-64 rounded-2xl overflow-hidden">
            <Image
              src="/images/gallery/bahia-palace-inner-courtyard-central-fountain-stucco.jpg"
              alt="Bahia Palace courtyard"
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 400px"
            />
          </div>
        </section>

        {/* What We Provide */}
        <section className="bg-white rounded-2xl border border-[#E8D5B7] p-8 md:p-10">
          <div className="w-10 h-10 bg-[#2E4A7B]/10 rounded-xl flex items-center justify-center mb-4">
            <Globe size={20} className="text-[#2E4A7B]" />
          </div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-2xl font-bold text-[#3D2817] mb-6">
            {t('whyTitle')}
          </h2>
          <ul className="space-y-4">
            {provideItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#6B7B3A] shrink-0 mt-0.5" />
                <span className="text-[#5C3D20] leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Important Notice */}
        <section className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 md:p-10">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
            <AlertTriangle size={20} className="text-amber-700" />
          </div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-2xl font-bold text-amber-900 mb-4">
            {t('teamTitle')}
          </h2>
          <p className="text-amber-800 leading-relaxed text-lg">{t('teamBody')}</p>
        </section>

        {/* CTA */}
        <section className="bg-[#3D2817] text-white rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-2xl font-bold mb-3">
              {t('ctaTitle')}
            </h2>
            <p className="text-white/80 leading-relaxed text-sm">{t('ctaBody')}</p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 bg-[#C4452D] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#A33824] transition-colors"
          >
            {t('contactCta')}
          </Link>
        </section>
      </div>
    </div>
  );
}
