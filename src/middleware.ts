import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Redirect root to detected locale
    '/',
    // Apply locale cookie to all locale-prefixed routes
    '/(en|fr|it|de|es)/:path*',
    // Handle all other routes (exclude _next, _vercel, and static files)
    '/((?!_next|_vercel|api|admin|.*\\..*).*)',
  ],
};
