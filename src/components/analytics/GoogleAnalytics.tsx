'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

function NavigationTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID || typeof window?.gtag !== 'function') return;
    const qs  = searchParams.toString();
    const url = pathname + (qs ? `?${qs}` : '');
    window.gtag('event', 'page_view', { page_path: url });
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <>
      {/*
        lazyOnload, not afterInteractive.

        gtag.js is 166 KB — the largest single request on the homepage — and
        afterInteractive starts it during hydration, exactly while the browser
        is trying to fetch and paint the hero image. Lighthouse measured that
        image waiting 2.1s before its download even began, then 2.8s of render
        delay behind a busy main thread.

        Analytics has no deadline. Behind the load event it leaves the
        bandwidth and the main thread to the page the visitor came for. The
        pageview still fires, a second or two later, and nothing downstream
        can tell the difference.
      */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="lazyOnload"
      />
      <Script id="gtag-init" strategy="lazyOnload">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
      `}</Script>
      <Suspense>
        <NavigationTracker />
      </Suspense>
    </>
  );
}
