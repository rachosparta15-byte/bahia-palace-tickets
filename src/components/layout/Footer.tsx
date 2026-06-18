import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Mail } from 'lucide-react';

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
            <div className="mb-4">
              <Image
                src="/bahia-palace-logo-full.svg"
                alt="Bahia Palace Marrakech"
                width={360}
                height={220}
                className="w-[280px] h-auto"
              />
            </div>
            <p className="text-[#C4A882] text-sm leading-relaxed mb-5">{t('tagline')}</p>
            <div className="space-y-2 text-sm text-[#C4A882]">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#E8A33D] shrink-0" />
                <span>support@visitbahiapalace.com</span>
              </div>
            </div>

            {/* Social media */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://www.instagram.com/visite_bahia_palace"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bahia Palace on Instagram"
                className="w-9 h-9 rounded-lg bg-[#5C3D20] hover:bg-[#E8A33D] flex items-center justify-center transition-colors group"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E8A33D] group-hover:text-[#3D2817]">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4.5"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@bahia_palace"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bahia Palace on TikTok"
                className="w-9 h-9 rounded-lg bg-[#5C3D20] hover:bg-[#E8A33D] flex items-center justify-center transition-colors group"
              >
                <svg width="14" height="16" viewBox="0 0 24 28" fill="currentColor" className="text-[#E8A33D] group-hover:text-[#3D2817]">
                  <path d="M19.6 6.1A6.2 6.2 0 0 1 16 3.7V3h-4.5v15.5a2.7 2.7 0 0 1-2.7 2.5 2.7 2.7 0 0 1-2.7-2.7 2.7 2.7 0 0 1 2.7-2.7c.27 0 .52.04.77.1V11l-.77-.04A7.2 7.2 0 0 0 1.5 18.3a7.2 7.2 0 0 0 7.2 7.2 7.2 7.2 0 0 0 7.2-7.2V11.6a10.6 10.6 0 0 0 6.2 2V9.1a6.2 6.2 0 0 1-2.5-.97v-.03z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Tickets */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('tickets')}</h4>
            <ul className="space-y-2">
              {[
                { href: '/tickets/skip-the-line', label: t('skipTheLine') },
                { href: '/tickets', label: t('viewAllTickets') },
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
                { href: '/opening-hours', label: t('openingHours') },
                { href: '/entrance-fee',  label: t('entranceFee') },
                { href: '/history',       label: t('history') },
                { href: '/location',      label: t('location') },
                { href: '/blog',          label: t('blog') },
                { href: '/safety',        label: t('safetyGuide') },
                { href: '/faq',           label: t('faq') },
                { href: '/about',         label: t('about') },
                { href: '/contact',       label: t('contact') },
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

        {/* Disclaimer */}
        <div className="border-t border-[#5C3D20] pt-6 mb-6">
          <p className="text-[#C4A882] text-xs leading-relaxed text-center">{t('disclaimer')}</p>
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
