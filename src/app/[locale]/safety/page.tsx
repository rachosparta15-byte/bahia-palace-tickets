import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/db';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { BASE } from '@/lib/seo';
import type { Metadata } from 'next';

export const revalidate = 3600;

const META: Record<string, { title: string; description: string; subtitle: string; inDepth: string; readGuide: string; bottomNote: string }> = {
  en: { title: 'Safety Guide Marrakech 2026 — Scams & Tips | Bahia Palace', description: 'Essential safety tips for tourists visiting Marrakech: avoid scams, fake guides, taxi overcharging, henna traps and more.', subtitle: 'Essential tips to stay safe and avoid common tourist traps in Marrakech', inDepth: 'In-depth safety guides', readGuide: 'Read guide', bottomNote: 'Stay vigilant and enjoy your visit to Bahia Palace. When in doubt, ask official staff inside the palace.' },
  fr: { title: 'Guide Sécurité Marrakech 2026 — Arnaques & Conseils | Palais Bahia', description: 'Conseils essentiels pour les touristes à Marrakech : arnaques, faux guides, taxi, henné et plus.', subtitle: 'Conseils essentiels pour rester en sécurité et éviter les pièges touristiques à Marrakech', inDepth: 'Guides de sécurité approfondis', readGuide: 'Lire le guide', bottomNote: "Restez vigilant et profitez de votre visite au Palais Bahia. En cas de doute, demandez au personnel officiel." },
  es: { title: 'Guía de Seguridad Marrakech 2026 — Estafas y Consejos | Palacio Bahia', description: 'Consejos esenciales para turistas en Marrakech: estafas, guías falsos, taxi, henna y más.', subtitle: 'Consejos esenciales para estar seguro y evitar las trampas turísticas en Marrakech', inDepth: 'Guías de seguridad detalladas', readGuide: 'Leer guía', bottomNote: 'Permanece alerta y disfruta tu visita al Palacio Bahia. En caso de duda, consulta al personal oficial.' },
  de: { title: 'Sicherheitsratgeber Marrakesch 2026 — Betrug & Tipps | Bahia Palast', description: 'Wichtige Sicherheitstipps für Touristen in Marrakesch: Betrug, Falschführer, Taxi, Henna und mehr.', subtitle: 'Wesentliche Tipps, um sicher zu bleiben und Touristenfallen in Marrakesch zu vermeiden', inDepth: 'Ausführliche Sicherheitsratgeber', readGuide: 'Ratgeber lesen', bottomNote: 'Bleiben Sie wachsam und genießen Sie Ihren Besuch im Bahia Palast. Im Zweifelsfall wenden Sie sich an das Personal.' },
  it: { title: 'Guida alla Sicurezza Marrakech 2026 — Truffe e Consigli | Palazzo Bahia', description: 'Consigli essenziali per i turisti a Marrakech: truffe, guide false, taxi, henné e altro ancora.', subtitle: 'Consigli essenziali per stare al sicuro ed evitare le trappole turistiche a Marrakech', inDepth: 'Guide sulla sicurezza approfondite', readGuide: 'Leggi la guida', bottomNote: "Rimani vigile e goditi la tua visita al Palazzo Bahia. In caso di dubbio, chiedi al personale ufficiale." },
};

const ICONS = ['warning', 'guide', 'scam', 'taxi', 'warning', 'shop', 'shop', 'photo', 'money', 'shop'];

const ICON_MAP: Record<string, string> = {
  warning: '⚠️', scam: '🚨', money: '💰', photo: '📸',
  guide: '🧭', taxi: '🚕', shop: '🛍️', dress: '👗',
  health: '🏥', info: 'ℹ️',
};

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
  const meta = META[locale] ?? META.en;

  const scams = tGuide.raw('scams') as Array<{ title: string; desc: string; avoid: string }>;
  const tips = scams.map((scam, i) => ({
    icon: ICONS[i] ?? 'warning',
    title: scam.title,
    body: scam.desc + '\n\n' + scam.avoid,
  }));

  const articles = await prisma.blogPost.findMany({
    where: { published: true, category: 'safety', locale },
    orderBy: { publishedAt: 'desc' },
    select: { slug: true, title: true, excerpt: true, coverImage: true },
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tips.map(tip => ({
      '@type': 'Question',
      name: tip.title,
      acceptedAnswer: { '@type': 'Answer', text: tip.body },
    })),
  };

  return (
    <div className="min-h-screen bg-[#FAF3E7]">
      <JsonLd data={faqSchema} />
      <div className="bg-amber-600 text-white pt-6 pb-10 px-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
            <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white/40">
              <AlertTriangle size={38} className="text-amber-600" strokeWidth={2.5} />
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
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border-l-4 border-amber-400 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0 mt-0.5">{ICON_MAP[tip.icon] ?? '⚠️'}</span>
                <div>
                  <h2
                    className="text-[#3D2817] font-bold mb-2 leading-snug"
                    style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem' }}
                  >
                    {tip.title}
                  </h2>
                  <p className="text-[#5C3D20] text-sm leading-relaxed whitespace-pre-line">{tip.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <p className="text-amber-800 text-sm font-medium">{meta.bottomNote}</p>
        </div>

        {articles.length > 0 && (
          <section className="mt-16">
            <h2
              className="text-2xl font-bold text-[#3D2817] mb-6"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {meta.inDepth}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map(article => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}` as any}
                  className="group bg-white rounded-2xl border border-[#E8D5B7] overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={article.coverImage ?? '/images/gallery/bahia-palace-zellige-mosaic-arabic-calligraphy-stucco.jpg'}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3D2817]/50 to-transparent" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3
                      className="font-bold text-[#3D2817] mb-2 leading-snug flex-1"
                      style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem' }}
                    >
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-xs text-[#5C3D20] leading-relaxed mb-3 line-clamp-2">
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
