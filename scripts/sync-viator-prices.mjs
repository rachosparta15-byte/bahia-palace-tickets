/*
 * Refreshes src/config/viator-prices.json from the Viator Partner API: the
 * per-adult "from" price of each live affiliate product in USD and EUR, as
 * Viator itself prices it in each currency (never a conversion), plus rating
 * and review count.
 *
 *   VIATOR_API_KEY=… node scripts/sync-viator-prices.mjs
 *
 * Run daily by .github/workflows/sync-viator-prices.yml; a changed file is
 * committed and Vercel redeploys.
 *
 * Safeguards — the site must never show a worse number than the one it has:
 *  - any API error or missing product → nothing is written, exit 1;
 *  - a regular price moving more than MAX_JUMP from the stored one is NOT
 *    applied: the old figure stays and the run exits 1, so a person looks
 *    before a wrong or odd price goes live;
 *  - the displayed price is the REGULAR price (fromPriceBeforeDiscount when
 *    Viator runs an offer). A temporary discount is stored separately as
 *    `offer`, so the site can never keep advertising an offer after it ends.
 */
import fs from 'node:fs';

const FILE = new URL('../src/config/viator-prices.json', import.meta.url);
const API = 'https://api.viator.com/partner';
const DESTINATION = '5408'; // Marrakech
const MAX_JUMP = 0.3;

const PRODUCTS = {
  'skip-the-line':      { code: '5670595P2', search: 'Bahia Palace Skip the Line Ticket With Audio Guide' },
  'guided-tour':        { code: '467170P4',  search: 'Saadian Tombs Bahia Palace Souk and Medina Tour' },
  'private-guide-only': { code: '199649P3',  search: 'Bahia palace Saadian Tombs Souk Medina Tour' },
  'private-tour':       { code: '326890P2',  search: 'Private Marrakech Highlights Bahia Palace Souks Medina' },
};

const key = process.env.VIATOR_API_KEY;
if (!key) {
  console.error('VIATOR_API_KEY is not set');
  process.exit(1);
}

async function search(term, currency) {
  const res = await fetch(`${API}/search/freetext`, {
    method: 'POST',
    headers: {
      'exp-api-key': key,
      Accept: 'application/json;version=2.0',
      'Accept-Language': 'en-US',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      searchTerm: term,
      productFiltering: { destination: DESTINATION },
      searchTypes: [{ searchType: 'PRODUCTS', pagination: { start: 1, count: 50 } }],
      currency,
    }),
  });
  if (!res.ok) throw new Error(`Viator ${currency} search "${term}": HTTP ${res.status}`);
  const data = await res.json();
  return data?.products?.results ?? [];
}

/** code → API product, for one currency; one broad search, then targeted ones. */
async function fetchAll(currency) {
  const found = new Map();
  for (const p of await search('Bahia Palace', currency)) found.set(p.productCode, p);
  for (const { code, search: term } of Object.values(PRODUCTS)) {
    if (found.has(code)) continue;
    for (const p of await search(term, currency)) if (p.productCode === code) found.set(code, p);
  }
  return found;
}

const round = (n) => Math.round(n * 100) / 100;

function priceOf(product, currency) {
  const s = product?.pricing?.summary;
  if (!s || typeof s.fromPrice !== 'number' || product.pricing.currency !== currency) return null;
  const regular = round(s.fromPriceBeforeDiscount ?? s.fromPrice);
  const offer = s.fromPriceBeforeDiscount ? round(s.fromPrice) : null;
  return { regular, offer };
}

const [usd, eur] = await Promise.all([fetchAll('USD'), fetchAll('EUR')]);
const stored = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const next = structuredClone(stored);
const problems = [];
let changed = false;

for (const [slug, { code }] of Object.entries(PRODUCTS)) {
  const u = priceOf(usd.get(code), 'USD');
  const e = priceOf(eur.get(code), 'EUR');
  if (!u || !e) {
    problems.push(`${slug} (${code}): not returned by the API — kept the stored prices`);
    continue;
  }
  const old = stored.products[slug];
  const jump = (a, b) => (b ? Math.abs(a - b) / b : 0);
  if (old && (jump(u.regular, old.usd) > MAX_JUMP || jump(e.regular, old.eur) > MAX_JUMP)) {
    problems.push(
      `${slug}: regular price moved from $${old.usd}/€${old.eur} to $${u.regular}/€${e.regular} (> ${MAX_JUMP * 100}%) — NOT applied, check by hand`,
    );
    continue;
  }
  const api = usd.get(code);
  const entry = {
    code,
    usd: u.regular,
    eur: e.regular,
    usdOffer: u.offer,
    eurOffer: e.offer,
    rating: api?.reviews?.combinedAverageRating != null ? round(api.reviews.combinedAverageRating) : old?.rating ?? null,
    reviews: api?.reviews?.totalReviews ?? old?.reviews ?? null,
  };
  if (JSON.stringify(entry) !== JSON.stringify(old)) {
    next.products[slug] = entry;
    changed = true;
    console.log(`${slug}: $${entry.usd} / €${entry.eur}${entry.usdOffer ? ` (offer $${entry.usdOffer} / €${entry.eurOffer})` : ''}`);
  }
}

if (changed) {
  next.checked = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(FILE, JSON.stringify(next, null, 2) + '\n');
  console.log(`Updated ${FILE.pathname}`);
} else {
  console.log('No price changes.');
}

if (problems.length) {
  console.error('\n' + problems.join('\n'));
  process.exit(1);
}
