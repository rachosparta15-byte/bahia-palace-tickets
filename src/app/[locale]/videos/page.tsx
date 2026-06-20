import { getTranslations } from 'next-intl/server';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { LiteVideo } from '@/components/video/LiteVideo';
import { buildAlternates, buildOG } from '@/lib/seo';
import { VIDEO_TITLES } from '@/lib/videoTitles';
import type { Metadata } from 'next';

export const revalidate = 43200; // 12 h

interface Video {
  videoId: string;
  title: string;
  published: string;
  description: string;
  thumbUrl: string;
}

function decode(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

async function fetchVideos(): Promise<Video[]> {
  try {
    const res = await fetch(
      'https://www.youtube.com/feeds/videos.xml?channel_id=UCvj0E4Z8ELNk5VBNBcIFveQ',
      { next: { revalidate: 43200 } },
    );
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => {
      const e = m[1];
      const videoId = e.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? '';
      const title   = decode(e.match(/<title>(.*?)<\/title>/)?.[1] ?? '');
      const published = e.match(/<published>(.*?)<\/published>/)?.[1] ?? '';
      const description = decode(e.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1]?.trim() ?? '');
      const thumbUrl = e.match(/<media:thumbnail[^>]+url="([^"]+)"/)?.[1]
        ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      return { videoId, title, published, description, thumbUrl };
    }).filter((v) => Boolean(v.videoId));
  } catch {
    return [];
  }
}

const META: Record<string, { title: string; description: string; heading: string; intro: string; noVideos: string }> = {
  en: {
    title: 'Bahia Palace Videos 2026 | Watch Before Visiting Marrakech',
    description: "Watch videos filmed inside Bahia Palace Marrakech — zellige courtyards, carved cedar ceilings and the atmosphere of one of Morocco's most beautiful monuments.",
    heading: 'Bahia Palace in Video',
    intro: 'Experience Bahia Palace before you arrive. Our videos are filmed inside the palace and capture the zellige courtyards, hand-carved cedar ceilings, and the quiet details that photographs miss. See what you\'ll be walking through.',
    noVideos: 'Videos coming soon. Check back after your visit.',
  },
  fr: {
    title: 'La Bahia en Vidéo | Découvrez le Palais avant votre visite',
    description: "Vidéos tournées à l'intérieur du Palais Bahia Marrakech — cours en zellige, plafonds en cèdre sculpté et l'atmosphère d'un des plus beaux monuments du Maroc.",
    heading: 'La Bahia en Vidéo',
    intro: "Découvrez le Palais Bahia avant votre visite. Nos vidéos sont tournées à l'intérieur du palais et captent les cours en zellige, les plafonds en cèdre sculpté à la main et les détails discrets que les photos ne rendent pas.",
    noVideos: 'Vidéos bientôt disponibles.',
  },
  it: {
    title: 'Palazzo Bahia in Video | Guarda prima della tua visita',
    description: "Video girati dentro il Palazzo Bahia Marrakech — cortili in zellige, soffitti in cedro intagliato e l'atmosfera di uno dei monumenti più belli del Marocco.",
    heading: 'Bahia in Video',
    intro: "Scopri il Palazzo Bahia prima della tua visita. I nostri video sono girati all'interno del palazzo e catturano i cortili in zellige, i soffitti in cedro intagliato a mano e i dettagli che le fotografie non colgono.",
    noVideos: 'Video in arrivo.',
  },
  de: {
    title: 'Der Bahia Palast in Video | Schau vor deinem Besuch',
    description: 'Videos aus dem Inneren des Bahia Palasts Marrakesch — Zellige-Höfe, geschnitzte Zederndecken und die Atmosphäre eines der schönsten Monumente Marokkos.',
    heading: 'Der Palast in Bewegung',
    intro: 'Erlebe den Bahia Palast vor deinem Besuch. Unsere Videos wurden im Inneren des Palastes gedreht und zeigen die Zellige-Höfe, handgeschnitzten Zedernholzdecken und die stillen Details, die Fotos nicht einfangen.',
    noVideos: 'Videos demnächst verfügbar.',
  },
  es: {
    title: 'La Bahía en Vídeo | Descúbrelo antes de visitar Marrakech',
    description: 'Vídeos grabados dentro del Palacio Bahia Marrakech — patios de zellige, techos de cedro tallado y la atmósfera de uno de los monumentos más bellos de Marruecos.',
    heading: 'La Bahía en Vídeo',
    intro: 'Descubre el Palacio Bahia antes de tu visita. Nuestros vídeos están grabados en el interior del palacio y captan los patios de zellige, los techos de cedro tallado a mano y los detalles sutiles que las fotos no transmiten.',
    noVideos: 'Vídeos próximamente.',
  },
};

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = META[locale] ?? META.en;
  return {
    title: meta.title,
    description: meta.description,
    alternates: buildAlternates(locale, '/videos'),
    openGraph: buildOG(meta.title, meta.description, locale, '/videos'),
  };
}

export default async function VideosPage({ params }: Props) {
  const { locale } = await params;
  const meta = META[locale] ?? META.en;
  const tb = await getTranslations('breadcrumb');
  const videos = (await fetchVideos()).map((v) => ({
    ...v,
    title: VIDEO_TITLES[v.videoId] ?? v.title,
  }));

  const videoSchemas = videos.map((v) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: v.title,
    description: v.description || meta.description,
    thumbnailUrl: v.thumbUrl,
    uploadDate: v.published,
    contentUrl: `https://www.youtube.com/watch?v=${v.videoId}`,
    embedUrl: `https://www.youtube.com/embed/${v.videoId}`,
  }));

  return (
    <div className="min-h-screen">
      {videoSchemas.map((s, i) => <JsonLd key={i} data={s} />)}

      {/* Hero */}
      <div className="bg-[#3D2817] text-white px-6 py-12 md:px-10">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb
            variant="light"
            items={[
              { label: tb('home'), href: '/' },
              { label: meta.heading },
            ]}
          />
          <h1
            className="mt-5 font-bold text-white leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
          >
            {meta.heading}
          </h1>
          <p className="mt-3 text-white/75 text-base sm:text-lg max-w-2xl leading-relaxed">
            {meta.intro}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {videos.length === 0 ? (
          <p className="text-center text-[#8B6344] py-20 text-lg">{meta.noVideos}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {videos.map((v) => (
              <LiteVideo key={v.videoId} videoId={v.videoId} title={v.title} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
