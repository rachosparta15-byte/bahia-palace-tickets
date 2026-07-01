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
  en: { title: 'Safety Guide Marrakech 2026 — Scams & Tips | Bahia Palace', description: 'Essential safety tips for visitors to Bahia Palace and Marrakech in 2026: avoid scams, fake guides, taxi overcharging, henna traps and common tourist tricks.', subtitle: 'Essential tips to stay safe and avoid common tourist traps in Marrakech', inDepth: 'In-depth safety guides', readGuide: 'Read guide', bottomNote: 'Stay vigilant and enjoy your visit to Bahia Palace. When in doubt, ask official staff inside the palace.' },
  fr: { title: 'Sécurité Marrakech 2026 — Arnaques | Palais Bahia', description: 'Conseils pratiques pour visiter le Palais de la Bahia à Marrakech en toute sérénité : meilleur moment, tenue vestimentaire, contrôles et sécurité sur place.', subtitle: 'Conseils essentiels pour rester en sécurité et éviter les pièges touristiques à Marrakech', inDepth: 'Guides de sécurité approfondis', readGuide: 'Lire le guide', bottomNote: "Restez vigilant et profitez de votre visite au Palais Bahia. En cas de doute, demandez au personnel officiel." },
  es: { title: 'Seguridad Marrakech 2026 — Estafas | Palacio Bahia', description: 'Consejos de seguridad esenciales para visitar el Palacio Bahia y Marrakech: estafas habituales, guías falsos, taxistas, trampas de henna y presión en el zoco.', subtitle: 'Consejos esenciales para estar seguro y evitar las trampas turísticas en Marrakech', inDepth: 'Guías de seguridad detalladas', readGuide: 'Leer guía', bottomNote: 'Permanece alerta y disfruta tu visita al Palacio Bahia. En caso de duda, consulta al personal oficial.' },
  de: { title: 'Sicherheit Marrakesch 2026 — Betrug | Bahia Palast', description: 'Praktische Sicherheitstipps für Ihren Besuch im Bahia Palast Marrakesch: beste Uhrzeit, Kleidung, Taschenkontrollen und Verhalten rund um das Palastgelände.', subtitle: 'Wesentliche Tipps, um sicher zu bleiben und Touristenfallen in Marrakesch zu vermeiden', inDepth: 'Ausführliche Sicherheitsratgeber', readGuide: 'Ratgeber lesen', bottomNote: 'Bleiben Sie wachsam und genießen Sie Ihren Besuch im Bahia Palast. Im Zweifelsfall wenden Sie sich an das Personal.' },
  it: { title: 'Sicurezza Marrakech 2026 — Truffe | Palazzo Bahia', description: 'Consigli di sicurezza essenziali per visitare il Palazzo Bahia e Marrakech: truffe comuni, guide false, sovrapprezzi taxi, trappole hennè e pressioni al souk.', subtitle: 'Consigli essenziali per stare al sicuro ed evitare le trappole turistiche a Marrakech', inDepth: 'Guide sulla sicurezza approfondite', readGuide: 'Leggi la guida', bottomNote: "Rimani vigile e goditi la tua visita al Palazzo Bahia. In caso di dubbio, chiedi al personale ufficiale." },
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
    <div className="min-h-screen bg-[#1C1108]">
      <JsonLd data={faqSchema} />
      <div className="bg-[#C4452D] text-white pt-6 pb-10 px-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
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
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="bg-[#251A0F] rounded-2xl border-l-4 border-amber-500 p-6 hover:border-[#E8A33D] transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0 mt-0.5">{ICON_MAP[tip.icon] ?? '⚠️'}</span>
                <div>
                  <h2
                    className="text-[#F5E8CC] font-bold mb-2 leading-snug"
                    style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem' }}
                  >
                    {tip.title}
                  </h2>
                  <p className="text-[#C4A882] text-sm leading-relaxed whitespace-pre-line">{tip.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#E8A33D]/08 border border-[#E8A33D]/20 rounded-2xl p-6 text-center">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map(article => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}` as any}
                  className="group bg-[#251A0F] rounded-2xl border border-[rgba(232,163,61,0.13)] overflow-hidden hover:border-[rgba(232,163,61,0.30)] transition-colors flex flex-col"
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={article.coverImage ?? '/images/gallery/bahia-palace-zellige-mosaic-arabic-calligraphy-stucco.jpg'}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
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
