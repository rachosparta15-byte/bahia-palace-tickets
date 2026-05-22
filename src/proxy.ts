import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { type NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE } from './lib/auth';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    // Protect all admin routes except the login page itself
    if (pathname !== '/admin/login') {
      const token = req.cookies.get(ADMIN_COOKIE)?.value;
      const valid = token ? !!(await verifyAdminToken(token)) : false;
      if (!valid) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
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
