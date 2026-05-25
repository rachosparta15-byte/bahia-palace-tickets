import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { type NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE } from './lib/auth';

const intlMiddleware = createMiddleware(routing);

const SUPPORTED = ['en', 'fr', 'it', 'de', 'es'] as const;
type Locale = (typeof SUPPORTED)[number];

const BOT_RE =
  /Googlebot|bingbot|DuckDuckBot|YandexBot|Baiduspider|Slurp|facebot|ia_archiver|AhrefsBot|SemrushBot|MJ12bot|DotBot/i;

function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return 'en';
  const langs = acceptLanguage
    .split(',')
    .map(part => {
      const [tag, q] = part.trim().split(';q=');
      return { lang: (tag ?? '').trim().split('-')[0].toLowerCase(), q: parseFloat(q ?? '1') };
    })
    .sort((a, b) => b.q - a.q);
  for (const { lang } of langs) {
    if (SUPPORTED.includes(lang as Locale)) return lang as Locale;
  }
  return 'en';
}

export default async function middleware(req: NextRequest) {
  // ── 1. Force www ────────────────────────────────────────────────
  const host = req.headers.get('host') ?? '';
  if (host === 'visitbahiapalace.com') {
    const url = req.nextUrl.clone();
    url.host = 'www.visitbahiapalace.com';
    return NextResponse.redirect(url, 301);
  }

  const { pathname } = req.nextUrl;

  // ── 2. Root redirect with locale detection ───────────────────────
  if (pathname === '/') {
    const ua = req.headers.get('user-agent') ?? '';

    // Bots → 301 to /en (canonical for search engines)
    if (BOT_RE.test(ua)) {
      const target = req.nextUrl.clone();
      target.pathname = '/en';
      return NextResponse.redirect(target, 301);
    }

    // Returning user with cookie → 302 to their locale
    const cookie = req.cookies.get('NEXT_LOCALE')?.value;
    if (cookie && SUPPORTED.includes(cookie as Locale)) {
      const target = req.nextUrl.clone();
      target.pathname = `/${cookie}`;
      return NextResponse.redirect(target, 302);
    }

    // New user → parse Accept-Language, set cookie, 302
    const detected = detectLocale(req.headers.get('accept-language'));
    const target = req.nextUrl.clone();
    target.pathname = `/${detected}`;
    const res = NextResponse.redirect(target, 302);
    res.cookies.set('NEXT_LOCALE', detected, {
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
      sameSite: 'lax',
    });
    return res;
  }

  // ── 3. Non-localized /tickets/* → 301 to /en/tickets/* ──────────
  // These URLs have no locale prefix; next-intl would issue a 307 (temporary),
  // which causes Google to keep re-crawling them. A 301 tells crawlers
  // the canonical location is the /en/ variant, fixing Search Console issues.
  if (pathname.startsWith('/tickets/') || pathname === '/tickets') {
    const target = req.nextUrl.clone();
    target.pathname = `/en${pathname}`;
    return NextResponse.redirect(target, 301);
  }

  // ── 4. Admin protection ─────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (pathname !== '/admin/login') {
      const token = req.cookies.get(ADMIN_COOKIE)?.value;
      const valid = token ? !!(await verifyAdminToken(token)) : false;
      if (!valid) return new NextResponse(null, { status: 404 });
    }
    const reqHeaders = new Headers(req.headers);
    reqHeaders.set('x-pathname', pathname);
    return NextResponse.next({ request: { headers: reqHeaders } });
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/((?!api|_next|_vercel|admin|style-guide|.*\\..*).*)' ,
  ],
};
