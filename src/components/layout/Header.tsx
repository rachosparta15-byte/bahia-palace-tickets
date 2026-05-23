'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { Menu, X, Globe, ChevronDown, AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { locales, type Locale } from '@/i18n/routing';
import { LogoMark } from '@/components/ui/LogoMark';
import { BOOKING_URL } from '@/lib/booking';

const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  it: 'Italiano',
  de: 'Deutsch',
  es: 'Español',
};

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const switchLocale = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setLangOpen(false);
    setMenuOpen(false);
  };

  const navLinks = [
    { href: '/tickets', label: t('tickets'), style: 'normal' },
    { href: '/gallery', label: t('gallery'), style: 'normal' },
    { href: '/blog',    label: t('blog'),    style: 'normal' },
    { href: '/faq',     label: t('faq'),     style: 'normal' },
    { href: '/about',   label: t('about'),   style: 'normal' },
    { href: '/contact', label: t('contact'), style: 'normal' },
  ] as const;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#2A1A0E] shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-[#3D2817]/95 backdrop-blur-sm'
      )}
    >
      {/* Zellige bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8A33D]/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 relative">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          {/* Medallion emblem */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 transition-transform duration-500 group-hover:scale-105">
            <LogoMark className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          {/* Text stack */}
          <div className="leading-none hidden min-[360px]:block">
            <div
              className="text-white font-semibold tracking-wide group-hover:text-[#F5E8CC] transition-colors"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1rem, 3.5vw, 1.25rem)', letterSpacing: '0.04em' }}
            >
              Bahia Palace
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="h-px w-4 bg-[#E8A33D]/50" />
              <span
                className="text-[#E8A33D] uppercase font-medium"
                style={{ fontSize: '0.52rem', letterSpacing: '0.22em' }}
              >
                Marrakech
              </span>
              <div className="h-px w-4 bg-[#E8A33D]/50" />
            </div>
          </div>
        </Link>

        {/* ── Safety Guide pill — always visible, jnb l-logo ── */}
        <Link
          href="/safety"
          className="flex items-center gap-1.5 bg-[#E8A33D] rounded-full px-3 py-1.5 shrink-0 hover:bg-amber-400 transition-colors group shadow-[0_0_14px_rgba(232,163,61,0.45)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C4452D] animate-pulse shrink-0" />
          <AlertTriangle size={11} className="text-[#3D2817] shrink-0" />
          <span className="text-[#3D2817] text-[11px] font-extrabold tracking-wide whitespace-nowrap">
            Safety Guide
          </span>
          <ArrowRight size={10} className="text-[#3D2817]/70 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href}
              className="text-sm font-medium text-white/75 hover:text-[#E8A33D] transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-px after:bg-[#E8A33D] after:scale-x-0 hover:after:scale-x-100 after:transition-transform">
              {label}
            </Link>
          ))}
        </nav>

        {/* ── Right side ── */}
        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors py-1.5 px-2.5 rounded-md hover:bg-white/10"
            >
              <Globe size={14} className="text-[#E8A33D]/80" />
              <span>{LOCALE_LABELS[locale].split(' ')[0]}</span>
              <ChevronDown size={13} className={cn('transition-transform opacity-60', langOpen && 'rotate-180')} />
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0" onClick={() => setLangOpen(false)} />
                <div className="absolute right-0 top-full mt-2 bg-[#2A1A0E] border border-[#E8A33D]/20 rounded-xl shadow-2xl py-1.5 min-w-[150px] z-50">
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => switchLocale(loc)}
                      className={cn(
                        'w-full text-left px-4 py-2 text-sm transition-colors',
                        locale === loc
                          ? 'text-[#E8A33D] font-semibold'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      )}
                    >
                      {LOCALE_LABELS[loc]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* CTA button */}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-[#C4452D] hover:bg-[#A33824] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors border border-[#C4452D]/0 hover:border-[#E8A33D]/20"
          >
            {t('bookNow')}
          </a>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-white/80 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="lg:hidden bg-[#2A1A0E] border-t border-[#E8A33D]/15 px-4 py-4 space-y-0.5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center py-3 font-medium border-b border-white/5 last:border-0 transition-colors text-white/80 hover:text-[#E8A33D]"
            >
              {label}
            </Link>
          ))}
          <div className="pt-4 space-y-3">
            <p className="text-xs font-semibold text-[#E8A33D]/60 uppercase tracking-widest">Language</p>
            <div className="flex flex-wrap gap-2">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm border transition-colors',
                    locale === loc
                      ? 'bg-[#E8A33D] text-[#3D2817] border-[#E8A33D] font-semibold'
                      : 'border-white/20 text-white/70 hover:border-[#E8A33D]/50 hover:text-white'
                  )}
                >
                  {LOCALE_LABELS[loc]}
                </button>
              ))}
            </div>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center w-full bg-[#C4452D] text-white font-semibold py-3 rounded-xl mt-2 hover:bg-[#A33824] transition-colors"
            >
              {t('bookNow')}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
