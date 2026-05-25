import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Mail, MapPin } from 'lucide-react';
import { LogoMark } from '@/components/ui/LogoMark';

export function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#3D2817] text-[#E8D5B7]">
      {/* Zellige border top */}
      <div className="h-1 bg-gradient-to-r from-[#C4452D] via-[#E8A33D] to-[#2E4A7B]" />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <LogoMark className="w-10 h-10 shrink-0" />
              <span
                className="text-white font-bold text-xl"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Bahia<span className="text-[#E8A33D]"> Palace</span>
              </span>
            </div>
            <p className="text-[#C4A882] text-sm leading-relaxed mb-5">{t('tagline')}</p>
            <div className="space-y-2 text-sm text-[#C4A882]">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#E8A33D] shrink-0" />
                <span>Rue Riad Zitoun el Jedid, Marrakech</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#E8A33D] shrink-0" />
                <span>support@visitbahiapalace.com</span>
              </div>
            </div>
          </div>

          {/* Tickets */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('tickets')}</h4>
            <ul className="space-y-2">
              {[
                { href: '/tickets/skip-the-line', label: t('skipTheLine') },
                { href: '/tickets/guided-tour', label: t('guidedTour') },
                { href: '/tickets/private-tour', label: t('privateTour') },
                { href: '/tickets/combo-saadian-tombs', label: t('combo') },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[#C4A882] hover:text-[#E8A33D] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('explore')}</h4>
            <ul className="space-y-2">
              {[
                { href: '/blog', label: t('blog') },
                { href: '/safety', label: t('safetyGuide') },
                { href: '/faq', label: t('faq') },
                { href: '/about', label: t('about') },
                { href: '/contact', label: t('contact') },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[#C4A882] hover:text-[#E8A33D] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('legal')}</h4>
            <ul className="space-y-2">
              {[
                { href: '/terms', label: t('terms') },
                { href: '/privacy', label: t('privacy') },
                { href: '/refund-policy', label: t('refund') },
                { href: '/cookies', label: t('cookies') },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[#C4A882] hover:text-[#E8A33D] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#5C3D20] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#C4A882] text-xs">{t('copyright', { year })}</p>
          <p className="text-[#C4A882] text-xs flex items-center gap-1.5">
            <span>🔒</span>
            {t('paymentNote')}
          </p>
        </div>
      </div>
    </footer>
  );
}
