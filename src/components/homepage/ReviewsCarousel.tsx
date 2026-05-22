'use client';

import { useTranslations } from 'next-intl';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { OrnamentDivider } from '@/components/ui/ZelligePattern';

// Placeholder reviews — replace with DB-driven data from admin panel
const REVIEWS = [
  {
    name: 'Sophie Laurent',
    country: 'France',
    flag: '🇫🇷',
    rating: 5,
    text: 'Absolutely magical experience. The skip-the-line ticket was worth every cent — no queue, just walked straight in. The palace is breathtaking.',
  },
  {
    name: 'Marco Bianchi',
    country: 'Italy',
    flag: '🇮🇹',
    rating: 5,
    text: 'Il palazzo è magnifico! Il biglietto saltalafila ci ha permesso di entrare subito e goderci il posto senza stress.',
  },
  {
    name: 'Thomas Weber',
    country: 'Germany',
    flag: '🇩🇪',
    rating: 5,
    text: 'Wir haben die Privatführung gebucht und waren begeistert. Unser Guide kannte jede Geschichte hinter den Kacheln.',
  },
  {
    name: 'Emma Johnson',
    country: 'UK',
    flag: '🇬🇧',
    rating: 5,
    text: 'The guided tour was phenomenal. Our guide brought the history of the palace to life in a way a solo visit simply cannot.',
  },
  {
    name: 'Carlos García',
    country: 'Spain',
    flag: '🇪🇸',
    rating: 5,
    text: 'Entrada directa sin esperar. El palacio es increíble — los azulejos y los techos son una maravilla del arte árabe.',
  },
];

export function ReviewsCarousel() {
  const t = useTranslations('reviews');

  return (
    <section className="py-20 bg-[#3D2817] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <OrnamentDivider label="" />
          <h2
            className="text-white mt-6 mb-3"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[#C4A882]">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.slice(0, 3).map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#5C3D20]/30 rounded-2xl p-4 sm:p-6 border border-[#5C3D20] relative"
            >
              <Quote size={28} className="text-[#E8A33D]/30 absolute top-4 right-4" />
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-[#E8A33D] fill-[#E8A33D]" />
                ))}
              </div>
              <p className="text-[#E8D5B7] text-sm leading-relaxed mb-5 italic">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C4452D]/20 flex items-center justify-center text-lg">
                  {review.flag}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{review.name}</p>
                  <p className="text-[#C4A882] text-xs">{review.country}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
