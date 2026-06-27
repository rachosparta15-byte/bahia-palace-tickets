'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';

/* ─────────────────── Custom brand icons ─────────────────── */

type IconProps = { color: string; active: boolean };

function TicketsIcon({ color, active }: IconProps) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      {/* ticket body */}
      <rect x="2" y="7.5" width="22" height="11" rx="2.5"
        fill={color} fillOpacity={active ? 0.22 : 0.12}
        stroke={color} strokeWidth="1.5"/>
      {/* perforation divider */}
      <line x1="9" y1="7.5" x2="9" y2="18.5"
        stroke={color} strokeWidth="1.3" strokeDasharray="2 1.6" strokeLinecap="round"/>
      {/* 5-point star in stub */}
      <path d="M5.5 11.5 L6.2 13.3 L8.1 13.3 L6.7 14.4 L7.2 16.2 L5.5 15.1 L3.8 16.2 L4.3 14.4 L2.9 13.3 L4.8 13.3 Z"
        fill={color}/>
      {/* arch in main area */}
      <path d="M13 18.5 L13 14 Q13 10.5 18 10.5 Q23 10.5 23 14 L23 18.5"
        fill={color} fillOpacity={active ? 0.3 : 0.15}
        stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function GalleryIcon({ color, active }: IconProps) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      {/* outer frame */}
      <rect x="2" y="3" width="22" height="20" rx="3"
        fill={color} fillOpacity={active ? 0.18 : 0.1}
        stroke={color} strokeWidth="1.5"/>
      {/* film strip holes top */}
      <circle cx="6" cy="6" r="1.1" fill={color}/>
      <circle cx="20" cy="6" r="1.1" fill={color}/>
      {/* film strip holes bottom */}
      <circle cx="6" cy="20" r="1.1" fill={color}/>
      <circle cx="20" cy="20" r="1.1" fill={color}/>
      {/* Moroccan arch inside */}
      <path d="M9 22 L9 15 Q9 10 13 10 Q17 10 17 15 L17 22"
        fill={color} fillOpacity={active ? 0.35 : 0.2}
        stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
      {/* sun above arch */}
      <circle cx="13" cy="7.5" r="1.8" fill={color}/>
    </svg>
  );
}

function BlogIcon({ color, active }: IconProps) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      {/* quill feather — body sweeping from top-right to bottom-left */}
      <path d="M22 3 C18 5.5 11 13 9 23 L12.5 19.5"
        stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      {/* feather vane outline (back edge) */}
      <path d="M22 3 C19.5 8 15 14 9 23"
        stroke={color} strokeWidth="1.3" strokeLinecap="round"
        strokeOpacity={active ? 0.55 : 0.4}/>
      {/* mid-vane lines */}
      <path d="M18.5 7 C16 10 13 15 11 19"
        stroke={color} strokeWidth="1" strokeLinecap="round"
        strokeDasharray="1.5 2" strokeOpacity="0.5"/>
      {/* ink nib tip */}
      <path d="M9 23 L7 25" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      {/* baseline / paper */}
      <path d="M4 23 L12 23" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function FAQIcon({ color, active }: IconProps) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      {/* lantern top loop */}
      <path d="M13 2 L13 5" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      {/* lantern top cap */}
      <path d="M9 5 Q9 4 13 4 Q17 4 17 5 L17 7 L9 7 Z"
        fill={color} fillOpacity={active ? 0.5 : 0.3}/>
      {/* lantern body */}
      <path d="M9 7 L7 10 L7 19 L9 22 L17 22 L19 19 L19 10 L17 7 Z"
        fill={color} fillOpacity={active ? 0.2 : 0.1}
        stroke={color} strokeWidth="1.4" strokeLinejoin="round"/>
      {/* lantern bottom cap */}
      <path d="M9 22 Q9 23 13 23 Q17 23 17 22"
        stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      {/* cross / light ray inside */}
      <line x1="13" y1="11" x2="13" y2="18" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.8"/>
      <line x1="9.5" y1="14.5" x2="16.5" y2="14.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.8"/>
      {/* bottom drip */}
      <path d="M13 23 L13 25" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

/* ─────────────────── Nav config ─────────────────── */

const NAV_ITEMS = [
  { href: '/tickets/skip-the-line', Icon: TicketsIcon, key: 'tickets' },
  { href: '/gallery',               Icon: GalleryIcon, key: 'gallery' },
  { href: '/blog',                  Icon: BlogIcon,    key: 'blog'    },
  { href: '/faq',                   Icon: FAQIcon,     key: 'faq'     },
] as const;

/* ─────────────────── Component ─────────────────── */

export function MobileBottomNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-[46] md:hidden"
      style={{
        background: 'linear-gradient(90deg, #6B2F0E, #B5471F 50%, #6B2F0E)',
        boxShadow: '0 -4px 20px rgba(100,30,8,0.50)',
        borderRadius: '16px 16px 0 0',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex h-[62px]">
        {NAV_ITEMS.map(({ href, Icon, key }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          const iconColor = active ? '#FFFFFF' : 'rgba(247,231,216,0.60)';

          return (
            <Link
              key={href}
              href={href}
              className="relative flex-1 flex flex-col items-center justify-center gap-[2px] select-none"
              style={{ minHeight: 44 }}
            >
              {/* Active glow pill */}
              {active && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: '5px 6px',
                    borderRadius: 13,
                    background: 'rgba(255,217,160,0.16)',
                    boxShadow: '0 0 14px 3px rgba(255,200,100,0.22)',
                  }}
                />
              )}

              {/* Icon */}
              <span
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  filter: active ? 'drop-shadow(0 0 5px rgba(255,220,140,0.80))' : 'none',
                  transform: active ? 'scale(1.10) translateY(-1px)' : 'scale(1)',
                  transition: 'transform 0.20s ease, filter 0.20s ease',
                }}
              >
                <Icon color={iconColor} active={active} />
              </span>

              {/* Label */}
              <span
                className="text-[9px] font-bold uppercase leading-none"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  letterSpacing: '0.05em',
                  color: active ? '#FFD9A0' : 'rgba(247,231,216,0.50)',
                  transition: 'color 0.18s ease',
                }}
              >
                {t(key)}
              </span>

              {/* Active glow dot */}
              <span
                style={{ height: 5, width: 16, position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
