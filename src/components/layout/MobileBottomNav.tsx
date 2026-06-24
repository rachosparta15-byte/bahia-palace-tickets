'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { Ticket, Images, BookOpen, Info } from '@phosphor-icons/react';

const NAV_ITEMS = [
  { href: '/tickets/skip-the-line', Icon: Ticket, key: 'tickets' },
  { href: '/gallery', Icon: Images,   key: 'gallery' },
  { href: '/blog',    Icon: BookOpen, key: 'blog'    },
  { href: '/faq',     Icon: Info,     key: 'faq'     },
] as const;

const CREAM  = '#F7E7D8';
const WHITE  = '#FFFFFF';
const DOT    = '#FFD9A0';

export function MobileBottomNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-[46] md:hidden"
      style={{
        background: 'linear-gradient(90deg, #7A3A12, #B5471F 50%, #7A3A12)',
        boxShadow: '0 -4px 16px rgba(122,58,18,0.30)',
        borderRadius: '16px 16px 0 0',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex h-14">
        {NAV_ITEMS.map(({ href, Icon, key }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-[3px] select-none"
              style={{
                minHeight: 44,
                transition: 'opacity 0.15s ease',
              }}
            >
              <Icon
                size={22}
                weight="fill"
                color={active ? WHITE : CREAM}
                aria-hidden="true"
                style={{ transition: 'color 0.15s ease' }}
              />

              <span
                className="text-[9px] font-semibold uppercase leading-none"
                style={{
                  letterSpacing: '0.04em',
                  color: active ? WHITE : CREAM,
                  transition: 'color 0.15s ease',
                }}
              >
                {t(key)}
              </span>

              {/* Reserved dot space — prevents layout shift on route change */}
              <span
                className="flex items-center justify-center"
                style={{ height: 6, width: 16 }}
                aria-hidden="true"
              >
                {active && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: DOT,
                      boxShadow: '0 0 6px 3px rgba(255,217,160,0.60)',
                    }}
                  />
                )}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
