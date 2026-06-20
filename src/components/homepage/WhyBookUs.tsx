import { useTranslations } from 'next-intl';
import { Zap, Shield, MapPin, Lock } from 'lucide-react';
import { OrnamentDivider } from '@/components/ui/ZelligePattern';

const ICONS = [Zap, Shield, MapPin, Lock];

export function WhyBookUs() {
  const t = useTranslations('whyUs');
  const items = t.raw('items') as { title: string; desc: string }[];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <OrnamentDivider />
          <h2
            className="text-[#3D2817] mt-6"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
          >
            {t('title')}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <div key={i} className="text-center group">
                <div className="w-14 h-14 rounded-full bg-[#FAF3E7] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#C4452D] transition-colors duration-300">
                  <Icon size={24} className="text-[#C4452D] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3
                  className="text-[#3D2817] mb-2"
                  style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700 }}
                >
                  {item.title}
                </h3>
                <p className="text-[#5C3D20] text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
