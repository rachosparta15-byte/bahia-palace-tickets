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

  // ── 3. Test/junk blog slugs → 410 Gone ─────────────────────────
  // These were crawled by Google during development. 410 signals permanent
  // removal so Googlebot stops revisiting them.
  const BAD_BLOG_SLUGS = /^\/([a-z]{2}\/)?blog\/(z|test|xdxxxxxxxx)(\/.*)?$/;
  if (BAD_BLOG_SLUGS.test(pathname)) {
    return new NextResponse(null, { status: 410 });
  }

  // ── 4. /safety-guide → /safety (301, locale-aware) ────────────────
  // The page-level permanentRedirect() returned 308 and caused a double-hop
  // (/en/safety-guide → /safety → /en/safety). A single middleware 301 that
  // keeps the locale prefix in place collapses it to one hop.
  if (pathname.endsWith('/safety-guide')) {
    const target = req.nextUrl.clone();
    target.pathname = pathname.slice(0, -'/safety-guide'.length) + '/safety';
    return NextResponse.redirect(target, 301);
  }

  // ── 5. Non-localized /tickets/* → 301 to /en/tickets/* ─────────
  // These URLs have no locale prefix; next-intl would issue a 307 (temporary),
  // which causes Google to keep re-crawling them. A 301 tells crawlers
  // the canonical location is the /en/ variant, fixing Search Console issues.
  if (pathname.startsWith('/tickets/') || pathname === '/tickets') {
    const target = req.nextUrl.clone();
    target.pathname = `/en${pathname}`;
    return NextResponse.redirect(target, 301);
  }

  // ── 6. Admin protection ─────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (pathname !== '/admin/login') {
      const token = req.cookies.get(ADMIN_COOKIE)?.value;
      const valid = token ? !!(await verifyAdminToken(token)) : false;
      if (!valid) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = '/admin/login';
        return NextResponse.redirect(loginUrl, 302);
      }
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
