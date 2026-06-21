import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { Mail, Camera, MapPin, PenLine } from 'lucide-react';
import type { Metadata } from 'next';
import { buildAlternates, buildOG, BASE } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title       = 'Editorial — About the Author | visitbahiapalace.com';
  const description =
    'Articles on visitbahiapalace.com are written by Abdellah, a Marrakech-based travel writer with first-hand experience visiting and photographing Bahia Palace.';
  return {
    title,
    description,
    alternates: buildAlternates(locale, '/about/editorial'),
    openGraph:  buildOG(title, description, locale, '/about/editorial'),
  };
}

export default async function EditorialPage({ params }: Props) {
  const { locale } = await params;
  const tb = await getTranslations('breadcrumb');

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Abdellah',
    jobTitle: 'Travel Writer',
    description:
      'Marrakech-based travel writer who has personally visited and photographed Bahia Palace. Writes articles on visitbahiapalace.com based on first-hand local experience.',
    url: `${BASE}/${locale}/about/editorial`,
    worksFor: {
      '@type': 'Organization',
      name: 'visitbahiapalace.com',
      url: BASE,
    },
    knowsAbout: ['Bahia Palace', 'Marrakech', 'Moroccan architecture', 'Heritage tourism'],
    email: 'support@visitbahiapalace.com',
  };

  return (
    <div className="min-h-screen">
      <JsonLd data={personSchema} />

      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <Image
          src="/images/gallery/bahia-palace-grand-courtyard-balcony-view-fountain.jpg"
          alt="Bahia Palace grand courtyard — photographed by Abdellah"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3D2817]/70 via-[#3D2817]/30 to-[#3D2817]/80" />
        <div className="absolute inset-0 flex flex-col justify-between px-6 py-8 md:px-10 max-w-5xl mx-auto w-full left-0 right-0">
          <Breadcrumb variant="light" items={[
            { label: tb('home'), href: '/' },
            { label: tb('about'), href: '/about' },
            { label: 'Editorial' },
          ]} />
          <div>
            <h1
              className="text-white font-bold leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3rem)' }}
            >
              About the Author
            </h1>
            <p className="text-white/80 mt-2 text-lg max-w-2xl">
              Who writes the articles on visitbahiapalace.com — and how.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-14">

        {/* Author card */}
        <section className="bg-white rounded-2xl border border-[#E8D5B7] p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar placeholder — replace with Abdellah's photo once available */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-[#E8D5B7] flex items-center justify-center shrink-0 text-[#3D2817]"
                 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 700 }}>
              A
            </div>
            <div className="flex-1">
              <h2
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
                className="text-3xl font-bold text-[#3D2817] mb-1"
              >
                Abdellah
              </h2>
              <p className="text-[#C4452D] text-sm font-semibold uppercase tracking-wider mb-4">
                Travel Writer · visitbahiapalace.com
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-[#5C3D20] mb-6">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#E8A33D]" />
                  Marrakech, Morocco
                </span>
                <span className="flex items-center gap-1.5">
                  <Camera size={14} className="text-[#E8A33D]" />
                  Original photography
                </span>
                <span className="flex items-center gap-1.5">
                  <PenLine size={14} className="text-[#E8A33D]" />
                  First-hand local experience
                </span>
              </div>

              <p className="text-[#5C3D20] leading-relaxed text-lg">
                Abdellah is a Marrakech-based travel writer who has personally visited Bahia Palace
                and photographed it himself. He writes the articles on visitbahiapalace.com based on
                first-hand local experience living in Marrakech, and all photographs credited to
                visitbahiapalace.com are his own original work taken on-site.
              </p>
            </div>
          </div>
        </section>

        {/* Editorial approach */}
        <section>
          <h2
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
            className="text-2xl font-bold text-[#3D2817] mb-6"
          >
            Editorial approach
          </h2>
          <div className="space-y-4 text-[#5C3D20] leading-relaxed">
            <p>
              Every article on visitbahiapalace.com is written from direct knowledge of the palace and
              the surrounding medina. Prices, opening hours, and practical advice are verified against
              current conditions. When things change on the ground, the articles are updated to reflect
              that reality.
            </p>
            <p>
              The site covers Bahia Palace from the perspective of an independent visitor: how to get
              there, what to expect at the entrance, which rooms are most significant and why, and what
              kind of guidance actually helps before and during a visit. Coverage extends to the wider
              southern medina (Saadian Tombs, Mellah quarter) where those sites directly relate to a
              Bahia Palace visit.
            </p>
            <p>
              Historical and architectural claims cite verifiable sources. Wherever a statistic appears,
              the source is linked inline. No information is fabricated or estimated without disclosure.
            </p>
          </div>
        </section>

        {/* Independence notice */}
        <section className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8">
          <h2
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
            className="text-xl font-bold text-amber-900 mb-3"
          >
            Independence notice
          </h2>
          <p className="text-amber-800 leading-relaxed">
            visitbahiapalace.com is an independent visitor information and ticket platform. It is not
            affiliated with the Bahia Palace monument, the Moroccan Ministry of Culture, or any
            official government body. The articles, prices, and opinions on this site represent
            Abdellah's independent assessment, not an official position.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-[#3D2817] text-white rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
              className="text-2xl font-bold mb-2"
            >
              Corrections &amp; press enquiries
            </h2>
            <p className="text-white/80 leading-relaxed text-sm">
              If you spot an error, have a press question, or want to share first-hand experience about
              visiting Bahia Palace, reach out directly. Factual corrections are prioritised and
              published promptly.
            </p>
          </div>
          <a
            href="mailto:support@visitbahiapalace.com"
            className="shrink-0 bg-[#C4452D] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#A33824] transition-colors flex items-center gap-2"
          >
            <Mail size={16} />
            support@visitbahiapalace.com
          </a>
        </section>

        {/* Back to blog */}
        <div className="text-center pt-4">
          <Link
            href="/blog"
            className="text-sm text-[#C4452D] hover:text-[#A33824] font-medium transition-colors"
          >
            ← Browse all articles by Abdellah
          </Link>
        </div>
      </div>
    </div>
  );
}
