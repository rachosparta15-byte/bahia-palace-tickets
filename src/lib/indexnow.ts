const INDEXNOW_KEY = '7c3a9f2e8d1b4a5f6c0e7d2b9a3f5e8c';
const HOST = 'www.visitbahiapalace.com';

export async function submitToIndexNow(urls: string[]): Promise<{ ok: boolean; status?: number }> {
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false };
  }
}

// All indexable EN pages — call this after a deploy to notify Bing.
export function getAllPageUrls(): string[] {
  const base = `https://${HOST}`;
  const locales = ['en', 'fr', 'es', 'de', 'it'];
  const paths = [
    '',
    '/tickets',
    '/tickets/skip-the-line',
    '/entrance-fee',
    '/opening-hours',
    '/faq',
    '/history',
    '/location',
    '/gallery',
    '/videos',
    '/safety',
    '/about',
    '/contact',
    '/blog',
    '/privacy',
    '/terms',
    '/refund-policy',
    '/cookies',
  ];
  return locales.flatMap((locale) => paths.map((path) => `${base}/${locale}${path}`));
}
