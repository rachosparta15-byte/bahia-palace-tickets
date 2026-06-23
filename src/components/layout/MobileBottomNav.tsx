'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { Ticket, BookOpen, HelpCircle, Image as GalleryIcon } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/tickets', icon: Ticket,      key: 'tickets' },
  { href: '/gallery', icon: GalleryIcon, key: 'gallery' },
  { href: '/blog',    icon: BookOpen,    key: 'blog'    },
  { href: '/faq',     icon: HelpCircle,  key: 'faq'     },
] as const;

export function MobileBottomNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-[46] md:hidden bg-[#2A1A0E] border-t border-[#E8A33D]/20 shadow-[0_-4px_24px_rgba(0,0,0,0.5)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Zellige top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8A33D]/40 to-transparent" />

      <div className="flex h-14">
        {NAV_ITEMS.map(({ href, icon: Icon, key }) => {
          const active =
            pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`
                relative flex-1 flex flex-col items-center justify-center gap-0.5
                transition-colors duration-150 select-none
                ${active ? 'text-[#C9A24B]' : 'text-white/40 hover:text-white/70'}
              `}
            >
              {active && (
                <span className="absolute top-0 left-3 right-3 h-[2px] rounded-b-full bg-[#C9A24B]" />
              )}
              <Icon
                size={20}
                strokeWidth={active ? 2.2 : 1.5}
                aria-hidden="true"
              />
              <span className="text-[9px] font-semibold tracking-[0.08em] uppercase leading-none">
                {t(key)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
