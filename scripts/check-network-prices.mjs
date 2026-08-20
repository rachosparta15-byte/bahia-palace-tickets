#!/usr/bin/env node
/**
 * Does network-sites.ts still agree with what the sister sites charge?
 *
 * These prices are printed on a button in the cross-sell email — "Book from
 * €11.99" — and the reader clicks it. If the figure is stale they arrive at a
 * checkout asking for something else, which is the moment a person decides
 * they have been quoted one price and shown another. It happened: this file
 * said 11.99 for months after El Badi and the Saadian Tombs moved to 12.99.
 *
 * Nothing enforces the agreement at runtime. The hub is the authority and
 * charges from its own config; this copy exists only so an email can be
 * rendered without a network call, and a copy with no check is a copy that
 * drifts. This is the check.
 *
 * Reads the price the way the customer's browser does — the data-unit-cents
 * attribute on the pay button, which is the figure those pages actually put
 * in front of somebody.
 *
 * Exits non-zero on a mismatch, so it can gate a release.
 */
import fs from 'node:fs';

const TICKET_PAGES = {
  'El Badi Palace': 'https://badi-palace.com/en/tickets/',
  'Saadian Tombs': 'https://www.saadian-tombs.com/tickets/',
  'Caves of Hercules': 'https://herculescaves.com/en/tickets/',
};

const source = fs.readFileSync(new URL('../src/config/network-sites.ts', import.meta.url), 'utf8');

/** name -> priceEUR, read out of the config rather than imported (it is TS). */
const configured = {};
for (const m of source.matchAll(/name:\s*'([^']+)'[\s\S]*?priceEUR:\s*([\d.]+)/g)) {
  configured[m[1]] = Number(m[2]);
}

let bad = 0;
for (const [name, url] of Object.entries(TICKET_PAGES)) {
  const want = configured[name];
  if (want === undefined) {
    console.error(`  ?  ${name.padEnd(20)} not found in network-sites.ts`);
    bad += 1;
    continue;
  }
  let live;
  try {
    const html = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }).then((r) => r.text());
    const cents = html.match(/data-unit-cents="(\d+)"/);
    live = cents ? Number(cents[1]) / 100 : null;
  } catch (err) {
    console.error(`  ?  ${name.padEnd(20)} could not reach ${url} (${err.message})`);
    bad += 1;
    continue;
  }
  if (live === null) {
    console.error(`  ?  ${name.padEnd(20)} no pay button found at ${url}`);
    bad += 1;
    continue;
  }
  const ok = Math.abs(live - want) < 0.005;
  if (!ok) bad += 1;
  console.log(`  ${ok ? 'ok' : '!!'}  ${name.padEnd(20)} config ${want.toFixed(2)}   live ${live.toFixed(2)}`);
}

if (bad) {
  console.error(`\n${bad} mismatch(es). The cross-sell email would quote a price the checkout does not ask for.`);
  process.exit(1);
}
console.log('\nevery cross-sell price matches the site that charges it');
