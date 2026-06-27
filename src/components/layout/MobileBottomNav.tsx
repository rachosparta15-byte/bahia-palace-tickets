'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { TicketIcon, ImagesIcon, BookOpenIcon, QuestionIcon } from '@phosphor-icons/react';

const NAV_ITEMS = [
  { href: '/tickets/skip-the-line', Icon: TicketIcon,   key: 'tickets' },
  { href: '/gallery',               Icon: ImagesIcon,   key: 'gallery' },
  { href: '/blog',                  Icon: BookOpenIcon, key: 'blog'    },
  { href: '/faq',                   Icon: QuestionIcon, key: 'faq'     },
] as const;

export function MobileBottomNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-[46] md:hidden"
      style={{
        background: 'linear-gradient(90deg, #6B2F0E, #B5471F 50%, #6B2F0E)',
        boxShadow: '0 -4px 20px rgba(100,30,8,0.45)',
        borderRadius: '16px 16px 0 0',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex h-[60px]">
        {NAV_ITEMS.map(({ href, Icon, key }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className="relative flex-1 flex flex-col items-center justify-center gap-[3px] select-none"
              style={{ minHeight: 44 }}
            >
              {/* Active pill glow */}
              {active && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: '6px 8px',
                    borderRadius: 12,
                    background: 'rgba(255,217,160,0.18)',
                    boxShadow: '0 0 12px 2px rgba(255,200,100,0.20)',
                  }}
                />
              )}

              <Icon
                size={24}
                weight="fill"
                aria-hidden="true"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  color: active ? '#FFFFFF' : 'rgba(247,231,216,0.65)',
                  filter: active
                    ? 'drop-shadow(0 0 6px rgba(255,217,160,0.85))'
                    : 'none',
                  transform: active ? 'scale(1.14)' : 'scale(1)',
                  transition: 'transform 0.18s ease, filter 0.18s ease, color 0.18s ease',
                }}
              />

              <span
                className="text-[9px] font-bold uppercase leading-none"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  letterSpacing: '0.05em',
                  color: active ? '#FFD9A0' : 'rgba(247,231,216,0.55)',
                  transition: 'color 0.18s ease',
                }}
              >
                {t(key)}
              </span>

              {/* Active dot */}
              <span
                className="flex items-center justify-center"
                style={{ height: 5, width: 16, position: 'relative', zIndex: 1 }}
                aria-hidden="true"
              >
                {active && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: 3,
                      height: 3,
                      borderRadius: '50%',
                      backgroundColor: '#FFD9A0',
                      boxShadow: '0 0 6px 3px rgba(255,217,160,0.65)',
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
