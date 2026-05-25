import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { type NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE } from './lib/auth';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? '';
  if (host === 'visitbahiapalace.com') {
    const url = req.nextUrl.clone();
    url.host = 'www.visitbahiapalace.com';
    return NextResponse.redirect(url, 301);
  }

  const { pathname } = req.nextUrl;

  // Root path: 301 to /en for SEO (fixes duplicate content issue).
  // Honour the NEXT_LOCALE cookie so returning users land in their language.
  if (pathname === '/') {
    const cookie = req.cookies.get('NEXT_LOCALE')?.value;
    const supported = ['en', 'fr', 'it', 'de', 'es'];
    const locale = cookie && supported.includes(cookie) ? cookie : 'en';
    const isPermanent = locale === 'en';
    const target = req.nextUrl.clone();
    target.pathname = `/${locale}`;
    return NextResponse.redirect(target, isPermanent ? 301 : 302);
  }

  if (pathname.startsWith('/admin')) {
    // Protect all admin routes except the login page itself.
    // Return 404 (not redirect) so scanners cannot confirm the admin panel exists.
    if (pathname !== '/admin/login') {
      const token = req.cookies.get(ADMIN_COOKIE)?.value;
      const valid = token ? !!(await verifyAdminToken(token)) : false;
      if (!valid) {
        return new NextResponse(null, { status: 404 });
      }
    }
    // Forward pathname so the admin layout can conditionally show the sidebar
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
