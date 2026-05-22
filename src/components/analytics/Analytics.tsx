'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getVisitorId, getSessionId } from '@/lib/analytics';

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const locale    = document.documentElement.lang ?? 'en';

    fetch('/api/track/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        sessionId,
        path:    pathname,
        locale,
        referrer: document.referrer || null,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
