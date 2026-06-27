import { useTranslations } from 'next-intl';
import Image from 'next/image';

const IMAGES = [
  {
    src: '/images/blog-real/bahia-palace-courtyard-marble-fountain-zellige-garden.webp',
    alt: 'Grand courtyard with marble fountain and zellige garden at Bahia Palace',
  },
  {
    src: '/images/blog-real/bahia-palace-muqarnas-cedar-ceiling-carved-plaster-arches.webp',
    alt: 'Muqarnas cedar ceiling with carved plaster arches at Bahia Palace',
  },
  {
    src: '/images/blog-real/bahia-palace-zellige-floor-geometric-star-pattern.webp',
    alt: 'Zellige floor with geometric star pattern at Bahia Palace',
  },
  {
    src: '/images/blog-real/bahia-palace-grand-reception-hall-painted-ceiling-fountain.webp',
    alt: 'Grand reception hall with painted ceiling and central fountain at Bahia Palace',
  },
];

export function HighlightsSection() {
  const t = useTranslations('highlights');

  const items = [
    { label: t('item1label'), caption: t('item1caption'), ...IMAGES[0] },
    { label: t('item2label'), caption: t('item2caption'), ...IMAGES[1] },
    { label: t('item3label'), caption: t('item3caption'), ...IMAGES[2] },
    { label: t('item4label'), caption: t('item4caption'), ...IMAGES[3] },
  ];

  return (
    <section className="bg-[#1C1108] py-16 sm:py-20">
      {/* Thin gold separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#E8A33D]/20 to-transparent mb-12 sm:mb-16" />

      <div className="max-w-6xl mx-auto px-6">
        <h2
          className="text-center text-[#F5E8CC] mb-10 sm:mb-14"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            letterSpacing: '0.01em',
          }}
        >
          {t('title')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, i) => (
            <div key={i} className="group flex flex-col">
              {/* Image */}
              <div className="relative overflow-hidden rounded-lg aspect-[4/3] bg-[#0F0804]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Subtle gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0F0804]/60 to-transparent" />
              </div>

              {/* Label + caption */}
              <div className="pt-4">
                <p
                  className="text-[#E8A33D] text-sm font-semibold uppercase tracking-wider mb-1.5"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {item.label}
                </p>
                <p
                  className="text-[#9A8060] leading-relaxed"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
                    fontStyle: 'italic',
                    lineHeight: 1.65,
                  }}
                >
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
