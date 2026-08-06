import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

const checks = [
  'best-time-to-visit-bahia-palace',
  'bahia-palace-entrance-fee-2026',
  'how-to-avoid-scams-in-the-souks-of-marrakech-complete-guide-for-travelers',
];
for (const slug of checks) {
  const r = await client.execute({
    sql: "SELECT locale, published FROM BlogPost WHERE slug = ? ORDER BY locale",
    args: [slug],
  });
  console.log(`${slug}: [${r.rows.map(r => `${r.locale}(pub:${r.published})`).join(', ')}]`);
}

// Also check if safety guide already has skip-the-line link
const s = await client.execute({
  sql: "SELECT content FROM BlogPost WHERE slug='marrakech-safety-guide' AND locale='en'",
  args: [],
});
const sc = s.rows[0]?.content ?? '';
console.log('\nSafety guide has /tickets link:', sc.includes('/en/tickets'));
console.log('Safety guide has /tickets/skip-the-line:', sc.includes('/tickets/skip-the-line'));

await client.close();
