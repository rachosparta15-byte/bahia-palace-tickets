import { useTranslations } from 'next-intl';

export function PalaceStatStrip() {
  const t = useTranslations('palaceStats');

  const stats = [
    { value: t('stat1val'), label: t('stat1label') },
    { value: t('stat2val'), label: t('stat2label') },
    { value: t('stat3val'), label: t('stat3label') },
    { value: t('stat4val'), label: t('stat4label') },
  ];

  return (
    <section className="bg-[#160D06] border-y border-[#E8A33D]/12">
      <div className="max-w-5xl mx-auto px-6 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div
                className="text-[#E8A33D] mb-1"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                  fontWeight: 600,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                {stat.value}
              </div>
              <div
                className="text-[#C4A882] text-xs sm:text-sm uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
